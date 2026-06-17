# 🌉 NeedBridge — Find Help in Dehradun

> A student project by **Stuti Rawat** · B.Tech Computer Science, Year 1  
> Built during internship at an NGO · Serving Dehradun, Uttarakhand

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-black.svg)](https://flask.palletsprojects.com)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-purple.svg)](https://render.com)

---

## 📌 What is NeedBridge?

NeedBridge is a free, no-registration web application that connects people in need with the right NGOs in Dehradun. A person describes what kind of help they need — in simple words, even Hindi-English mix — and the AI matching engine suggests the top 3 nearest, most relevant NGOs with contact details and a map.
  
**GitHub:** [https://stutirawat100-ctrl.github.io/NeedBridge/]

---

## ✨ Features

### 🔍 AI-Powered NGO Matching
- User selects a category (Physically Challenged, Underprivileged, Senior Citizens, Differently Abled Children)
- Describes their need in plain language — no formal language required
- Backend AI engine extracts keywords using NLTK, scores every NGO in the database across three factors:
  - **Category match** (40% weight)
  - **Keyword match** (40% weight)
  - **Proximity / distance** (20% weight)
- Returns top 3 matching NGOs sorted by relevance and distance

### 🗺️ Interactive Map
- Google Maps integration showing user location and all 3 matched NGOs
- Numbered markers (1, 2, 3) for each result
- Clickable markers with NGO name, address, and phone popup
- Direct "View on Map" link for each NGO

### ⭐ NGO Reviews System
- Any user can write a review for any of the 16 listed NGOs
- Star rating (1–5), reviewer name, and written experience
- Disclaimer modal before writing to ensure authentic reviews
- Filter reviews by NGO name or star rating
- Reviews persist permanently via PostgreSQL database (hosted on Render)
- Reviews also viewable as a popup directly from the results page

### 🤝 Get Involved Page
Two-tab page for people who want to give back:

**Tab 1 — Volunteer / Donate Goods**
- User selects which cause they care about (one or more categories)
- Selects what they can offer (time, teaching, food, clothes, assistive devices, skills, transport, companionship, financial donation, etc.)
- Enters their name and optional phone/note
- System generates matching NGO cards with:
  - Pre-filled **WhatsApp message link** — opens WhatsApp with message already written, user just presses Send
  - **Call button** with direct phone link
- No data stored — user contacts NGO directly

**Tab 2 — Learn & Awareness**
- Category-wise educational content for all 4 groups
- Each category includes a paragraph explaining the challenges faced
- Key **Government Schemes** listed for each group:
  - Physically Challenged: ADIP Scheme, UDID Card, RPwD Act 2016, NHFDC
  - Underprivileged: PMGKAY, Ayushman Bharat, PM Awas Yojana, MGNREGS, Ujjwala Yojana
  - Senior Citizens: IGNOAPS, Rashtriya Vayoshri Yojana, Senior Citizens Act 2007, AB-PMJAY (70+)
  - Differently Abled Children: Samagra Shiksha, National Trust Act, NIEPVD, NSP Scholarships
- Volunteer tips for each category
- Sources cited: Ministry of Social Justice, Census 2011, PM-JAY Portal, etc.

### 📍 Location Detection
- GPS auto-detection via browser
- Manual area dropdown with 19 Dehradun localities grouped by zone (Central, East, West, North, South)
- Falls back to Dehradun city centre if no location provided

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Fonts | Google Fonts (Poppins + Inter) |
| Maps | Google Maps JavaScript API |
| Backend | Python 3, Flask 3.0.3 |
| AI Engine | NLTK (keyword extraction), custom scoring algorithm |
| Database | PostgreSQL (production via Render), SQLite (local dev) |
| ORM | Flask-SQLAlchemy |
| Deployment | Render (free tier) |
| Version Control | GitHub |

---

## 🤖 How the AI Matching Works

No machine learning or deep learning is used. The engine works in 3 steps:

**Step 1 — Keyword Extraction**
- User's text is lowercased and punctuation removed
- Common stopwords (English + Hindi-English Hinglish words) are filtered out
- Remaining words become the search keywords

**Step 2 — Scoring each NGO (0 to 1 scale)**
```
Final Score = (Category Match × 0.40) + (Keyword Match × 0.40) + (Proximity × 0.20)
```
- **Category Match:** 1.0 if NGO serves the user's category, 0.3 otherwise
- **Keyword Match:** ratio of user keywords found in NGO's keyword/service list
- **Proximity:** calculated using the Haversine formula (straight-line GPS distance), max useful range 20km

**Step 3 — Return top 3 by score**

---

## 🗄️ NGO Database

16 real NGOs in Dehradun across 4 categories:

| Category | NGOs |
|----------|------|
| Physically Challenged | Cheshire Homes, Saahas Foundation, Latika Roy Foundation, Autism Welfare Society, NIEPVD |
| Underprivileged | Josh Welfare Society, U H Foundation, Unforgotten Humanity, Aasraa, Mamta Samajik Sanstha, SEAD in Himalayas |
| Senior Citizens | Gauri Old Age Home, Deenseva Welfare, Senior Citizen Home Complex, Senior Citizens Society, Old Age Home (Chushi Gangdruk) |
| Differently Abled Children | Cheshire Homes, Saahas Foundation, Latika Roy Foundation, Autism Welfare Society, Unforgotten Humanity, Aasraa |

All NGO data (addresses, phone numbers, coordinates) is publicly sourced.

---

## 📁 Project Structure

```
needbridge/
│
├── app.py                  # Flask backend — all API routes
├── ai_engine.py            # Keyword extraction + NGO scoring algorithm
├── database.py             # SQLAlchemy Review model
├── ngo_data.py             # NGO database (16 NGOs)
├── requirements.txt        # Python dependencies
│
├── index.html              # Homepage — category selection
├── form.html               # Step 2 — describe your need
├── results.html            # Step 3 — matched NGOs + map
├── reviews.html            # NGO reviews page
├── volunteer.html          # Get Involved page (volunteer + awareness)
│
├── css/
│   ├── style.css           # Global styles
│   ├── reviews.css         # Reviews page styles
│   └── volunteer.css       # Get Involved page styles
│
└── js/
    ├── main.js             # Homepage category selection
    ├── form.js             # Form validation + GPS detection
    ├── maps.js             # Google Maps loader + area coordinates
    ├── result.js           # Results rendering + map markers + reviews popup
    ├── reviews.js          # Reviews page — full CRUD + modals + filters
    └── volunteer.js        # Volunteer form + WhatsApp link generation
```

---

## 🚀 Running Locally

**1. Clone the repository**
```bash
git clone https://github.com/your-username/needbridge.git
cd needbridge
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Run the Flask server**
```bash
python app.py
```

**4. Open in browser**
```
http://localhost:5000
```
> Local dev uses SQLite automatically — no database setup needed.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |
| POST | `/api/match` | Match NGOs to user requirement |
| GET | `/api/ngos` | List all NGOs |
| POST | `/api/reviews` | Submit a review |
| GET | `/api/reviews` | Get all reviews |
| GET | `/api/reviews/<ngo_id>` | Get reviews for a specific NGO |

---

## ⚠️ Disclaimer

NeedBridge is a **student project** built for learning and demonstration purposes. It is not officially affiliated with any of the listed NGOs. All NGO information is publicly sourced. Users contact NGOs directly — NeedBridge does not intermediary or store any personal data beyond reviews voluntarily submitted.

---

## 👩‍💻 Author

**Stuti Rawat**  
B.Tech Computer Science, Year 1  
Built during NGO internship, Dehradun · 2024  

---

*Made with ❤️ for Dehradun*
