// reviews.js — NeedBridge Reviews Page
// Handles: NGO dropdown population, review display, filtering, modals, star picker, submit

// ─── NGO LIST (matches ngo_data.py exactly) ───────────────────────────────
const NGO_LIST = [
  { id: "cheshire_homes",         name: "Cheshire Homes" },
  { id: "saahas_foundation",      name: "Saahas Foundation Inclusive Resource Centre" },
  { id: "latika_roy_foundation",  name: "Latika Roy Foundation" },
  { id: "autism_welfare_society", name: "Autism Welfare Society" },
  { id: "niepvd",                 name: "NIEPVD (National Institute for Empowerment of Persons with Visual Disabilities)" },
  { id: "josh_welfare_society",   name: "Josh Welfare Society" },
  { id: "uh_foundation",          name: "U H Foundation NGO" },
  { id: "unforgotten_humanity",   name: "Unforgotten Humanity Foundation" },
  { id: "aasraa",                 name: "Aasraa" },
  { id: "mamta_samajik_sanstha",  name: "Mamta Samajik Sanstha" },
  { id: "sead_in_himalayas",      name: "SEAD in Himalayas" },
  { id: "gauri_old_age_home",     name: "Gauri Old Age Home" },
  { id: "deenseva_welfare",       name: "Deenseva Welfare Foundation" },
  { id: "senior_citizen_home_complex", name: "Senior Citizen Home Complex" },
  { id: "senior_citizens_society", name: "Senior Citizens Society" },
  { id: "old_age_home_chushi",    name: "Old Age Home (Chushi Gangdruk)" },
];

const BACKEND_URL = 'https://needbridge-x1o1.onrender.com';

// ─── STATE ────────────────────────────────────────────────────────────────
let selectedNgoId   = '';
let selectedNgoName = '';
let selectedStar    = 0;
let allReviews      = [];

// ─── ON PAGE LOAD ─────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  populateNgoDropdowns();
  loadAllReviews();

  // Character counter for review textarea
  const textarea = document.getElementById('reviewText');
  if (textarea) {
    textarea.addEventListener('input', () => {
      document.getElementById('reviewCharCount').textContent = textarea.value.length;
    });
  }
});

// ─── POPULATE BOTH DROPDOWNS ──────────────────────────────────────────────
function populateNgoDropdowns() {
  const writeSelect  = document.getElementById('ngoSelect');
  const filterSelect = document.getElementById('filterNgo');

  NGO_LIST.forEach(ngo => {
    // Write-review dropdown
    const opt1 = document.createElement('option');
    opt1.value       = ngo.id;
    opt1.textContent = ngo.name;
    writeSelect.appendChild(opt1);

    // Filter dropdown
    const opt2 = document.createElement('option');
    opt2.value       = ngo.id;
    opt2.textContent = ngo.name;
    filterSelect.appendChild(opt2);
  });
}

// ─── NGO SELECTED IN WRITE DROPDOWN ──────────────────────────────────────
function onNgoSelect() {
  const select = document.getElementById('ngoSelect');
  selectedNgoId   = select.value;
  selectedNgoName = select.options[select.selectedIndex].text;

  const btn = document.getElementById('writeReviewBtn');
  btn.disabled = !selectedNgoId;
}

// ─── OPEN DISCLAIMER MODAL ────────────────────────────────────────────────
function openReviewModal() {
  if (!selectedNgoId) return;
  document.getElementById('disclaimerNgoName').textContent = selectedNgoName;
  openModal('disclaimerModal');
}

// ─── PROCEED FROM DISCLAIMER TO WRITE MODAL ──────────────────────────────
function proceedToReview() {
  closeModal('disclaimerModal');

  // Reset the write-review modal
  selectedStar = 0;
  renderStars(0);
  document.getElementById('starLabel').textContent    = 'Tap a star to rate';
  document.getElementById('reviewerName').value       = '';
  document.getElementById('reviewText').value         = '';
  document.getElementById('reviewCharCount').textContent = '0';
  document.getElementById('reviewError').style.display  = 'none';
  document.getElementById('reviewModalNgoName').textContent = selectedNgoName;

  openModal('reviewModal');
}

// ─── STAR PICKER ─────────────────────────────────────────────────────────
const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

function setStar(val) {
  selectedStar = val;
  renderStars(val);
  document.getElementById('starLabel').textContent = STAR_LABELS[val];
}

function renderStars(val) {
  document.querySelectorAll('#starPicker .star').forEach(star => {
    const starVal = parseInt(star.getAttribute('data-val'));
    star.classList.toggle('active', starVal <= val);
  });
}

// ─── SUBMIT REVIEW ────────────────────────────────────────────────────────
async function submitReview() {
  const reviewer    = document.getElementById('reviewerName').value.trim();
  const reviewText  = document.getElementById('reviewText').value.trim();
  const errorDiv    = document.getElementById('reviewError');
  const submitBtn   = document.getElementById('submitReviewBtn');

  // Validation
  if (!selectedStar) {
    showReviewError('Please select a star rating.'); return;
  }
  if (!reviewer) {
    showReviewError('Please enter your name.'); return;
  }
  if (reviewText.length < 10) {
    showReviewError('Review must be at least 10 characters.'); return;
  }

  errorDiv.style.display = 'none';
  submitBtn.textContent  = '⏳ Submitting…';
  submitBtn.disabled     = true;

  try {
    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ngo_id:      selectedNgoId,
        ngo_name:    selectedNgoName,
        reviewer:    reviewer,
        stars:       selectedStar,
        review_text: reviewText
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showReviewError(data.error || 'Submission failed. Please try again.');
      submitBtn.textContent = 'Submit Review ⭐';
      submitBtn.disabled    = false;
      return;
    }

    closeModal('reviewModal');
    openModal('successModal');
    loadAllReviews(); // Refresh the reviews list

  } catch (err) {
    showReviewError('Could not connect to the server. Please try again later.');
    submitBtn.textContent = 'Submit Review ⭐';
    submitBtn.disabled    = false;
  }
}

function showReviewError(msg) {
  const errorDiv = document.getElementById('reviewError');
  errorDiv.textContent    = msg;
  errorDiv.style.display  = 'block';
}

// ─── LOAD ALL REVIEWS ─────────────────────────────────────────────────────
async function loadAllReviews() {
  const container = document.getElementById('allReviewsContainer');
  container.innerHTML = `
    <div class="reviews-loading">
      <div class="loader-ring"></div>
      <p>Loading reviews…</p>
    </div>`;

  try {
    const res  = await fetch(`${BACKEND_URL}/api/reviews`);
    const data = await res.json();
    allReviews = data.reviews || [];
    renderReviews(allReviews);
  } catch (err) {
    container.innerHTML = `
      <div class="reviews-empty">
        <div class="empty-icon">⚠️</div>
        <h3>Could not load reviews</h3>
        <p>Make sure the backend server is running.</p>
      </div>`;
  }
}

// ─── RENDER REVIEWS ───────────────────────────────────────────────────────
function renderReviews(reviews) {
  const container = document.getElementById('allReviewsContainer');
  document.getElementById('reviewCount').textContent = reviews.length;

  if (reviews.length === 0) {
    container.innerHTML = `
      <div class="reviews-empty">
        <div class="empty-icon">💬</div>
        <h3>No reviews yet</h3>
        <p>Be the first to share your experience with an NGO.</p>
      </div>`;
    return;
  }

  container.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="rc-top">
        <span class="rc-ngo-name">${r.ngo_name}</span>
        <span class="rc-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span>
      </div>
      <div class="rc-reviewer">
        <div class="rc-reviewer-avatar">${r.reviewer.charAt(0).toUpperCase()}</div>
        <strong>${r.reviewer}</strong>
      </div>
      <p class="rc-text">${r.review_text}</p>
      <span class="rc-date">📅 ${r.created_at}</span>
    </div>
  `).join('');
}

// ─── FILTER REVIEWS ───────────────────────────────────────────────────────
function filterReviews() {
  const ngoFilter  = document.getElementById('filterNgo').value;
  const starFilter = document.getElementById('filterStars').value;

  let filtered = allReviews;

  if (ngoFilter !== 'all') {
    filtered = filtered.filter(r => r.ngo_id === ngoFilter);
  }
  if (starFilter !== 'all') {
    filtered = filtered.filter(r => r.stars === parseInt(starFilter));
  }

  renderReviews(filtered);
}

// ─── MODAL HELPERS ────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
});
