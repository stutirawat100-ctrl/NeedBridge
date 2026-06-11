// maps.js — Google Maps API loader
// Replace YOUR_API_KEY below with your actual Google Maps API key
// Get a free key at: https://console.cloud.google.com/

const GOOGLE_MAPS_API_KEY = 'AIzaSyD3nQLzncHbw50aw_65hJlYMGC1fQtOlHw';

// Dynamically load the Maps script so the key lives in one place
(function loadGoogleMaps() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
})();

// Dehradun area coordinates (centre point fallback)
const DEHRADUN_CENTER = { lat: 30.3165, lng: 78.0322 };

// Approximate lat/lng for each dropdown area option
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

// Haversine formula — distance in km between two lat/lng points
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get user coordinates from sessionStorage
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
  return DEHRADUN_CENTER; // fallback
}
