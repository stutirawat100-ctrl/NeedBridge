// form.js — Requirement form handling

// ---- Example text for each chip ----
const EXAMPLE_TEXTS = {
  "Wheelchair needed":          "I need a wheelchair for my father who cannot walk after an accident. He is in Patel Nagar, Dehradun.",
  "Food support for family":    "Our family of 5 needs food support. We are daily wage workers and struggling to get two meals a day.",
  "Therapy for autistic child": "My 7 year old son has autism and needs speech therapy and special education support.",
  "Elder care support":         "My 78 year old mother lives alone and needs daily care, companionship, and help with medicines."
};

// ---- On page load: fill category badge from session ----
window.addEventListener('DOMContentLoaded', () => {
  const category = sessionStorage.getItem('nb_category');
  const label    = sessionStorage.getItem('nb_category_label');
  const icon     = sessionStorage.getItem('nb_category_icon');

  // If no category selected, redirect to homepage
  if (!category) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('categoryIcon').textContent  = icon  || '❓';
  document.getElementById('categoryLabel').textContent = label || 'Unknown';

  // Character counter
  const textarea = document.getElementById('requirement');
  const counter  = document.getElementById('charCount');
  textarea.addEventListener('input', () => {
    counter.textContent = textarea.value.length;
  });
});

// ---- Fill example text into textarea ----
function fillExample(btn) {
  const text = EXAMPLE_TEXTS[btn.textContent.trim()];
  if (!text) return;
  const textarea = document.getElementById('requirement');
  textarea.value = text;
  document.getElementById('charCount').textContent = text.length;
  textarea.focus();
}

// ---- GPS detection ----
function detectGPS() {
  const btn    = document.getElementById('gpsBtn');
  const status = document.getElementById('gpsStatus');

  if (!navigator.geolocation) {
    status.textContent = 'GPS not supported on this browser.';
    status.style.color = '#C0392B';
    return;
  }

  btn.textContent = '⏳ Detecting…';
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      sessionStorage.setItem('nb_lat', pos.coords.latitude);
      sessionStorage.setItem('nb_lng', pos.coords.longitude);
      sessionStorage.setItem('nb_location_mode', 'gps');
      status.textContent = '✓ Location detected';
      status.style.color = '#2E7D32';
      btn.textContent = '📍 Location detected';
      btn.style.borderColor = '#2E7D32';
      btn.style.color = '#2E7D32';
    },
    (err) => {
      status.textContent = 'Could not get location. Please select area below.';
      status.style.color = '#C0392B';
      btn.textContent = '📍 Use my current location';
      btn.disabled = false;
    },
    { timeout: 8000 }
  );
}

// ---- Form submission ----
function submitForm() {
  const requirement = document.getElementById('requirement').value.trim();
  const locationEl  = document.getElementById('location');
  const errorDiv    = document.getElementById('formError');
  const submitBtn   = document.getElementById('submitBtn');

  // Validate
  if (requirement.length < 10) {
    showError('Please describe the requirement in a bit more detail (at least 10 characters).');
    return;
  }

  const locationMode = sessionStorage.getItem('nb_location_mode');
  const selectedArea  = locationEl.value;

  if (!locationMode && !selectedArea) {
    showError('Please select your area in Dehradun, or use "Use my current location".');
    return;
  }

  errorDiv.style.display = 'none';

  // Save to sessionStorage
  sessionStorage.setItem('nb_requirement', requirement);
  if (selectedArea) {
    sessionStorage.setItem('nb_location_area', selectedArea);
    sessionStorage.setItem('nb_location_mode', 'dropdown');
  }

  // Visual loading on button
  submitBtn.textContent = '⏳ Finding NGOs…';
  submitBtn.disabled = true;

  // Navigate to results
  setTimeout(() => {
    window.location.href = 'results.html';
  }, 300);
}

function showError(msg) {
  const errorDiv = document.getElementById('formError');
  errorDiv.textContent = msg;
  errorDiv.style.display = 'block';
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
