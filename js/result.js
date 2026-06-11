// Coordinates for each area
const AREA_COORDS = {
  clock_tower:          { lat: 30.3234, lng: 78.0381 },
  rajpur_road:          { lat: 30.3597, lng: 78.0644 },
  gandhi_road:          { lat: 30.3204, lng: 78.0304 },
  astley_hall:          { lat: 30.3280, lng: 78.0450 },
  dalanwala:            { lat: 30.3063, lng: 78.0498 },
  patel_nagar:          { lat: 30.3132, lng: 78.0710 },
  niranjanpur:          { lat: 30.2877, lng: 78.0842 },
  sewla_kalan:          { lat: 30.2900, lng: 78.0950 },
  mohkampur:            { lat: 30.2693, lng: 78.0614 },
  raipur:               { lat: 30.3430, lng: 78.0810 },
  nathanpur:            { lat: 30.3700, lng: 78.0200 },
  ballupur:             { lat: 30.3380, lng: 78.0530 },
  kaonli:               { lat: 30.3500, lng: 78.0150 },
  mussoorie_road:       { lat: 30.3880, lng: 78.0560 },
  malsi:                { lat: 30.3730, lng: 78.0620 },
  sahastradhara:        { lat: 30.3680, lng: 78.1020 },
  dehradun_cantonment:  { lat: 30.2940, lng: 78.0230 },
  jhajhra:              { lat: 30.2600, lng: 77.9800 },
  doiwala:              { lat: 30.1670, lng: 78.1150 }
};

function getUserCoords() {
  const mode = sessionStorage.getItem('nb_location_mode');
  if (mode === 'gps') {
    return {
      lat: parseFloat(sessionStorage.getItem('nb_lat')),
      lng: parseFloat(sessionStorage.getItem('nb_lng'))
    };
  }
  const area = sessionStorage.getItem('nb_location_area');
  if (area && AREA_COORDS[area]) {
    return AREA_COORDS[area];
  }
  return { lat: 30.3165, lng: 78.0322 }; // Dehradun center fallback
}
// results.js — Fetch results from backend, render cards + map

// ─── CONFIG ─────────────────────────────────────────────────────
// When backend is deployed on Render, replace this URL:
const BACKEND_URL = 'https://needbridge-x1o1.onrender.com';
// ────────────────────────────────────────────────────────────────

let mapInstance = null;
let markersArr  = [];

// Called automatically when Google Maps script loads (callback=initMap in maps.js)
function initMap() {
  const userCoords = getUserCoords();
  mapInstance = new google.maps.Map(document.getElementById('map'), {
    center: userCoords,
    zoom: 13,
    styles: [
      { featureType: 'water',      elementType: 'geometry', stylers: [{ color: '#C8E6F0' }] },
      { featureType: 'landscape',  elementType: 'geometry', stylers: [{ color: '#F2EFE9' }] },
      { featureType: 'road',       elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
      { featureType: 'poi.park',   elementType: 'geometry', stylers: [{ color: '#D5E8C8' }] }
    ]
  });

  // User location pin
  new google.maps.Marker({
    position: userCoords,
    map: mapInstance,
    title: 'Your Location',
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 9,
      fillColor: '#F4A261',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2.5
    }
  });
}

// ─── MAIN: load results on page open ────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  const requirement = sessionStorage.getItem('nb_requirement');
  const category    = sessionStorage.getItem('nb_category');

  if (!requirement || !category) {
    showError('Missing information. Please go back and fill in the form.');
    return;
  }

  const userCoords = getUserCoords();

  try {
    const response = await fetch(`${BACKEND_URL}/api/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requirement,
        category,
        user_lat: userCoords.lat,
        user_lng: userCoords.lng
      })
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      showError('No matching NGOs found for your requirement in Dehradun. Try a different description.');
      return;
    }

    renderResults(data.results, requirement, category);

  } catch (err) {
    console.error(err);
    // If backend not connected yet, show demo data so the UI can be tested
    const demo = getDemoResults(category);
    renderResults(demo, requirement, category);
  }
});

// ─── RENDER ──────────────────────────────────────────────────────
function renderResults(results, requirement, category) {
  document.getElementById('loadingState').style.display   = 'none';
  document.getElementById('resultsContent').style.display = 'block';

  // Summary bar
  const catLabel = sessionStorage.getItem('nb_category_label') || category;
  const catIcon  = sessionStorage.getItem('nb_category_icon')  || '🔍';
  document.getElementById('resultsSummary').innerHTML = `
    <span class="rs-icon">${catIcon}</span>
    <div class="rs-text">
      <div class="rs-title">Found ${results.length} NGOs near you for: ${catLabel}</div>
      <div class="rs-sub">Sorted by relevance &amp; distance from your location</div>
    </div>
  `;

  // NGO cards
  const container = document.getElementById('ngoCards');
  container.innerHTML = '';

  results.forEach((ngo, index) => {
    const rank      = index + 1;
    const rankClass = `rank-${rank}`;
    const rankLabel = ['#1 Best Match', '#2', '#3'][index] || `#${rank}`;
    const distText  = ngo.distance_km ? `📍 ${ngo.distance_km.toFixed(1)} km away` : '📍 Dehradun';
    const tagsHtml  = (ngo.tags || []).map(t => `<span class="ngo-tag">${t}</span>`).join('');
    const mapsLink  = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ngo.name + ' ' + ngo.address)}`;

    container.innerHTML += `
      <div class="ngo-card ${rankClass}">
        <div class="ngo-card-header">
          <span class="ngo-rank-badge">${rankLabel}</span>
          <h3 class="ngo-name">${ngo.name}</h3>
          <span class="ngo-distance">${distText}</span>
        </div>
        <div class="ngo-tags">${tagsHtml}</div>
        <div class="ngo-address">📌 ${ngo.address}</div>
        <div class="ngo-actions">
          <a class="btn-call" href="tel:${ngo.phone}">📞 Call ${ngo.phone}</a>
          <a class="btn-map-link" href="${mapsLink}" target="_blank" rel="noopener">🗺️ View on Map</a>
        </div>
      </div>
    `;

    // Add map marker once initMap has run
    addMapMarker(ngo, rank);
  });
}

// ─── MAP MARKERS ─────────────────────────────────────────────────
function addMapMarker(ngo, rank) {
  if (!mapInstance || !ngo.lat || !ngo.lng) return;

  const colors = ['#0F4C5C', '#1A6B80', '#A0C4FF'];
  const marker = new google.maps.Marker({
    position: { lat: ngo.lat, lng: ngo.lng },
    map: mapInstance,
    title: ngo.name,
    label: {
      text: String(rank),
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: '12px'
    },
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 18,
      fillColor: colors[rank - 1] || '#333',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2
    }
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `<div style="font-family:Inter,sans-serif;max-width:180px;">
      <strong style="color:#0F4C5C;">${ngo.name}</strong><br/>
      <span style="font-size:12px;color:#666;">${ngo.address}</span><br/>
      <span style="font-size:12px;font-weight:600;">${ngo.phone}</span>
    </div>`
  });

  marker.addListener('click', () => {
    markersArr.forEach(m => m.infoWindow && m.infoWindow.close());
    infoWindow.open(mapInstance, marker);
  });

  markersArr.push({ marker, infoWindow });
}

// ─── ERROR STATE ─────────────────────────────────────────────────
function showError(msg) {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('errorState').style.display  = 'block';
  document.getElementById('errorMsg').textContent       = msg;
}

// ─── DEMO DATA (used while backend is not connected) ─────────────
// This lets you test the full UI before Flask is set up
function getDemoResults(category) {
  const allNGOs = [
    {
      name: "Umang Welfare Society",
      address: "23 Rajpur Road, Dehradun",
      phone: "0135-2743210",
      tags: ["Physical Rehabilitation", "Assistive Devices", "Wheelchair Support"],
      lat: 30.3597, lng: 78.0644, distance_km: 1.2
    },
    {
      name: "Disha Foundation Dehradun",
      address: "15 Patel Nagar, Near ISBT, Dehradun",
      phone: "9412345678",
      tags: ["Special Education", "Therapy", "Differently Abled"],
      lat: 30.3132, lng: 78.0710, distance_km: 2.8
    },
    {
      name: "Uttarakhand Viklang Kalyan Sansthan",
      address: "Dalanwala Chowk, Dehradun",
      phone: "0135-2654321",
      tags: ["Disability Support", "Mobility Aid", "Rehabilitation"],
      lat: 30.3063, lng: 78.0498, distance_km: 3.5
    },
    {
      name: "Aasra Old Age Home",
      address: "Raipur Road, Dehradun",
      phone: "9897654321",
      tags: ["Elder Care", "Senior Citizens", "Daily Assistance"],
      lat: 30.3430, lng: 78.0810, distance_km: 4.1
    },
    {
      name: "Navjyoti Social Welfare",
      address: "Gandhi Road, Dehradun",
      phone: "9456781234",
      tags: ["Food Support", "Livelihood", "Underprivileged Families"],
      lat: 30.3204, lng: 78.0304, distance_km: 0.9
    }
  ];

  // Return top 3 (later the real AI engine will filter by category)
  return allNGOs.slice(0, 3);
}
