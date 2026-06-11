# 🌉 NeedBridge — Dehradun NGO Finder

A web app that connects people in need with the right NGOs in Dehradun.
Built by a 1st year B.Tech CS student. No advanced ML required.

---

## 📁 Project Structure

```
needbridge/
├── backend/
│   ├── app.py           # Flask API server
│   ├── ai_engine.py     # Keyword extraction + NGO matching
│   ├── ngo_data.py      # Dehradun NGO database (15 real NGOs)
│   └── requirements.txt
├── frontend/
│   ├── index.html       # Homepage — category selection
│   ├── form.html        # Requirement + location form
│   ├── results.html     # Top 3 NGO results + map
│   ├── css/style.css
│   └── js/
│       ├── main.js
│       ├── form.js
│       ├── results.js
│       └── maps.js
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ How the AI Engine Works

No machine learning. No deep learning. Simple and effective:

```
User Input → Extract Keywords → Score Every NGO → Return Top 3
```

**Scoring formula:**
```
Final Score = (Category Match × 0.40) + (Keyword Match × 0.40) + (Proximity × 0.20)
```

| Factor | Weight | How it works |
|---|---|---|
| Category Match | 40% | Does this NGO serve the user's category? |
| Keyword Match | 40% | How many user keywords match NGO's services? |
| Proximity | 20% | How close is the NGO? (Haversine distance) |

---

## 🗺️ Maps: Which API to Use?

**Recommendation: Google Maps API (free tier)**

| Feature | Google Maps | OpenStreetMap |
|---|---|---|
| Map display | ✅ Beautiful | ✅ Works |
| Geocoding (address → lat/lng) | ✅ Very accurate | ✅ Good |
| Free tier | ✅ $200/month credit | ✅ Completely free |
| Ease of use | ✅ Best docs | Moderate |
| For a student project | ✅ **Recommended** | Alternative |

**Bottom line:** Use Google Maps. The $200/month free credit is more than enough
for a student project (you'd need ~100,000 map loads to exceed it).

**Where to get a free Google Maps API Key:**
1. Go to https://console.cloud.google.com
2. Create a new project → Enable "Maps JavaScript API"
3. Create credentials → API Key
4. Restrict key to your GitHub Pages domain (for security)

---

## 🚀 How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/needbridge.git
cd needbridge
```

### 2. Set up Python backend
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

### 3. Create your .env file
```bash
cp .env.example .env
# Edit .env and add your Google Maps API key
```

### 4. Run the Flask server
```bash
python app.py
# Server starts at http://localhost:5000
```

### 5. Open the frontend
Open `frontend/index.html` in your browser.
(Or use VS Code Live Server extension — right-click index.html → Open with Live Server)

---

## 🌐 How to Deploy (Get a Live Link)

### Frontend → GitHub Pages (Free)
1. Push code to GitHub
2. Go to repo Settings → Pages → Source: Deploy from branch → main → /frontend
3. Your live URL: `https://YOUR_USERNAME.github.io/needbridge`

### Backend → Render.com (Free)
1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root directory:** `backend`
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `gunicorn app:app`
4. Add environment variables: `FLASK_ENV=production`
5. Your API URL: `https://needbridge-api.onrender.com`

### Connect them
In `frontend/js/results.js`, line 4:
```javascript
const BACKEND_URL = 'https://needbridge-api.onrender.com';
```

---

## 🧠 How to "Train" / Improve the AI

Since this uses rule-based matching (no ML model to train):

1. **Add keywords** to NGOs in `ngo_data.py` — the main way to improve accuracy
2. **Tune weights** in `ai_engine.py` line ~80
3. **Add Hindi synonyms** — map Hindi words to English equivalents
4. **Future (Year 2-3):** Replace with TF-IDF using `sklearn`

---

## 📞 NGO Categories Covered

| Category | NGOs |
|---|---|
| Physically Challenged | Cheshire Homes, Saahas Foundation, Latika Roy Foundation, Autism Welfare Society, NIEPVD |
| Underprivileged | Josh Welfare Society, U H Foundation, Unforgotten Humanity, Aasraa, Mamta Samajik Sanstha, SEAD in Himalayas |
| Senior Citizens | Gauri Old Age Home, Deenseva Welfare, Senior Citizen Home Complex, Senior Citizens Society, Old Age Home Chushi Gangdruk |
| Differently Abled Children | Latika Roy Foundation, Autism Welfare Society, Saahas Foundation, Cheshire Homes, Aasraa |

---

## 👩‍💻 Built By

Stuti Rawat · B.Tech Computer Science Year 1 · Dehradun

