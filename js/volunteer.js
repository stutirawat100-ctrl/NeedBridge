// volunteer.js — Get Involved page logic for NeedBridge

// ─── ALL NGOs WITH PHONE NUMBERS ─────────────────────────────────────────
const ALL_NGOS = [
  {
    id: "cheshire_homes",
    name: "Cheshire Homes",
    address: "16, Pritam Road, Dalanwala, Dehradun 248001",
    phone: "01352672331",
    phone_display: "0135-2672331",
    categories: ["physically_challenged", "differently_abled_child"]
  },
  {
    id: "saahas_foundation",
    name: "Saahas Foundation Inclusive Resource Centre",
    address: "Johri, Malsi, Dehradun 248003",
    phone: "917760966102",
    phone_display: "+91 97609 66102",
    categories: ["physically_challenged", "differently_abled_child"]
  },
  {
    id: "latika_roy_foundation",
    name: "Latika Roy Foundation",
    address: "Near Survey Chowk, Rajpur Road, Dehradun 248001",
    phone: "01352761014",
    phone_display: "0135-2761014",
    categories: ["physically_challenged", "differently_abled_child"]
  },
  {
    id: "autism_welfare_society",
    name: "Autism Welfare Society",
    address: "Dehradun, Uttarakhand",
    phone: "919927994361",
    phone_display: "+91 99279 94361",
    categories: ["physically_challenged", "differently_abled_child"]
  },
  {
    id: "niepvd",
    name: "NIEPVD (National Institute for Empowerment of Persons with Visual Disabilities)",
    address: "116, Rajpur Road, Dehradun 248001",
    phone: "01352744491",
    phone_display: "0135-2744491",
    categories: ["physically_challenged"]
  },
  {
    id: "josh_welfare_society",
    name: "Josh Welfare Society",
    address: "42 Mata Mandir Road, Dharampur, Dehradun 248001",
    phone: "919927010738",
    phone_display: "+91 99270 10738",
    categories: ["underprivileged"]
  },
  {
    id: "uh_foundation",
    name: "U H Foundation NGO",
    address: "Rana Apartments, 4th Floor, Jakhan, Dehradun 248003",
    phone: "918218596166",
    phone_display: "+91 82185 96166",
    categories: ["underprivileged"]
  },
  {
    id: "unforgotten_humanity",
    name: "Unforgotten Humanity Foundation",
    address: "Dehradun, Uttarakhand",
    phone: "918146465476",
    phone_display: "+91 81464 65476",
    categories: ["underprivileged", "differently_abled_child"]
  },
  {
    id: "aasraa",
    name: "Aasraa",
    address: "Tapovan Ashram Road, Raipur, Dehradun 248008",
    phone: "919045056991",
    phone_display: "+91 90450 56991",
    categories: ["underprivileged", "differently_abled_child"]
  },
  {
    id: "mamta_samajik_sanstha",
    name: "Mamta Samajik Sanstha",
    address: "Dehradun, Uttarakhand",
    phone: "919719294888",
    phone_display: "+91 97192 94888",
    categories: ["underprivileged"]
  },
  {
    id: "sead_in_himalayas",
    name: "SEAD in Himalayas",
    address: "Near Sanskar International School, Jogiwala, Dehradun 248014",
    phone: "919997478017",
    phone_display: "+91 99974 78017",
    categories: ["underprivileged"]
  },
  {
    id: "gauri_old_age_home",
    name: "Gauri Old Age Home",
    address: "Near Vidya Bhawan School, Ambiwala, Prem Nagar, Dehradun 248007",
    phone: "917017263022",
    phone_display: "+91 70172 63022",
    categories: ["senior_citizen"]
  },
  {
    id: "deenseva_welfare",
    name: "Deenseva Welfare Foundation",
    address: "Dehradun, Uttarakhand",
    phone: "919056549903",
    phone_display: "+91 90565 49903",
    categories: ["senior_citizen", "underprivileged"]
  },
  {
    id: "senior_citizen_home_complex",
    name: "Senior Citizen Home Complex",
    address: "8 Old Mussoorie Road, Rajpur Road, Dehradun 248001",
    phone: null,
    phone_display: "Visit in person",
    categories: ["senior_citizen"]
  },
  {
    id: "senior_citizens_society",
    name: "Senior Citizens Society",
    address: "Thakurpur Road, Prem Nagar, Dehradun 248007",
    phone: null,
    phone_display: "Visit in person",
    categories: ["senior_citizen"]
  },
  {
    id: "old_age_home_chushi",
    name: "Old Age Home (Chushi Gangdruk)",
    address: "Clement Town, Dehradun 248002",
    phone: "918449370229",
    phone_display: "+91 84493 70229",
    categories: ["senior_citizen"]
  }
];

const CAT_LABELS = {
  physically_challenged:   "Physically Challenged",
  underprivileged:         "Underprivileged",
  senior_citizen:          "Senior Citizens",
  differently_abled_child: "Differently Abled Children"
};

// ─── STATE ────────────────────────────────────────────────────────────────
let selectedCats = new Set();
let selectedHelp = new Set();

// ─── TAB SWITCHING ────────────────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('panelVolunteer').style.display = tab === 'volunteer' ? 'flex' : 'none';
  document.getElementById('panelLearn').style.display     = tab === 'learn'     ? 'flex' : 'none';
  document.getElementById('tabVolunteer').classList.toggle('active', tab === 'volunteer');
  document.getElementById('tabLearn').classList.toggle('active', tab === 'learn');
}

// ─── TOGGLE CATEGORY ──────────────────────────────────────────────────────
function toggleCat(btn) {
  const cat = btn.getAttribute('data-cat');
  if (selectedCats.has(cat)) {
    selectedCats.delete(cat);
    btn.classList.remove('selected');
  } else {
    selectedCats.add(cat);
    btn.classList.add('selected');
  }
}

// ─── TOGGLE HELP TYPE ─────────────────────────────────────────────────────
function toggleHelp(btn) {
  const help = btn.getAttribute('data-help');
  if (selectedHelp.has(help)) {
    selectedHelp.delete(help);
    btn.classList.remove('selected');
  } else {
    selectedHelp.add(help);
    btn.classList.add('selected');
  }
}

// ─── GENERATE CONTACTS ────────────────────────────────────────────────────
function generateContacts() {
  const name    = document.getElementById('volName').value.trim();
  const phone   = document.getElementById('volPhone').value.trim();
  const note    = document.getElementById('volNote').value.trim();
  const errorEl = document.getElementById('volError');

  // Validate
  if (selectedCats.size === 0) {
    showVolError('Please select at least one cause you care about.'); return;
  }
  if (selectedHelp.size === 0) {
    showVolError('Please select at least one type of help you can offer.'); return;
  }
  if (!name) {
    showVolError('Please enter your name.'); return;
  }

  errorEl.style.display = 'none';

  // Filter NGOs by selected categories
  const matchedNGOs = ALL_NGOS.filter(ngo =>
    ngo.categories.some(c => selectedCats.has(c))
  );

  // Build the WhatsApp message
  const helpList   = [...selectedHelp].join(', ');
  const catList    = [...selectedCats].map(c => CAT_LABELS[c]).join(', ');
  const phoneText  = phone ? `\nMy contact: ${phone}` : '';
  const noteText   = note  ? `\n\n${note}` : '';

  const waMessage =
    `Hello, I found your NGO on NeedBridge (needbridge project, Dehradun).\n\n` +
    `My name is ${name} and I would like to volunteer / help with: ${helpList}.\n` +
    `Cause area I want to support: ${catList}.` +
    phoneText +
    noteText +
    `\n\nPlease let me know how I can contribute. Thank you!`;

  // Render cards
  const container = document.getElementById('volNgoCards');
  container.innerHTML = '';

  matchedNGOs.forEach(ngo => {
    const catTags = ngo.categories
      .map(c => `<span class="vol-cat-tag">${CAT_LABELS[c]}</span>`)
      .join('');

    const encodedMsg = encodeURIComponent(waMessage);
    const waLink = ngo.phone
      ? `https://wa.me/${ngo.phone}?text=${encodedMsg}`
      : null;
    const callLink = ngo.phone ? `tel:${ngo.phone}` : null;

    const waBtn = waLink
      ? `<a class="btn-whatsapp" href="${waLink}" target="_blank" rel="noopener">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
             <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.552 4.094 1.513 5.815L.057 23.484a.5.5 0 0 0 .609.61l5.74-1.498A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.876 9.876 0 0 1-5.031-1.373l-.36-.214-3.733.974.997-3.636-.235-.373A9.861 9.861 0 0 1 2.1 12C2.1 6.534 6.534 2.1 12 2.1c5.465 0 9.9 4.434 9.9 9.9 0 5.465-4.435 9.9-9.9 9.9z"/>
           </svg>
           WhatsApp
         </a>`
      : `<span style="font-size:0.8rem;color:#9999AA;">No WhatsApp — visit in person</span>`;

    const callBtn = callLink
      ? `<a class="btn-vol-call" href="${callLink}">📞 ${ngo.phone_display}</a>`
      : `<span class="btn-vol-call" style="cursor:default;opacity:0.5;">📞 ${ngo.phone_display}</span>`;

    container.innerHTML += `
      <div class="vol-ngo-card">
        <div class="vol-ngo-name">${ngo.name}</div>
        <div class="vol-ngo-address">📌 ${ngo.address}</div>
        <div class="vol-ngo-cats">${catTags}</div>
        <div class="vol-ngo-actions">
          ${waBtn}
          ${callBtn}
        </div>
      </div>
    `;
  });

  document.getElementById('volResults').style.display = 'block';
  document.getElementById('volResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showVolError(msg) {
  const el = document.getElementById('volError');
  el.textContent   = msg;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
