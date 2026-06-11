# app.py — NeedBridge Flask Backend
# Run locally: python app.py
# Deploy to Render: uses gunicorn (see requirements.txt)

from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_engine import find_top_ngos
import os

app = Flask(__name__)

# Allow requests from GitHub Pages frontend and localhost during dev
CORS(app)

# Dehradun city center — fallback if no coordinates sent
DEHRADUN_CENTER = {"lat": 30.3165, "lng": 78.0322}


# ─── HEALTH CHECK ────────────────────────────────────────────────
@app.route('/')
def home():
    return jsonify({
        "status": "NeedBridge API is running ✅",
        "version": "1.0",
        "city": "Dehradun"
    })


# ─── MAIN MATCHING ENDPOINT ──────────────────────────────────────
@app.route('/api/match', methods=['POST'])
def match_ngos():
    """
    POST /api/match
    Body (JSON):
    {
        "requirement": "I need a wheelchair for my father",
        "category": "physically_challenged",
        "user_lat": 30.3165,
        "user_lng": 78.0322
    }

    Returns:
    {
        "results": [ {ngo_obj + score + distance_km}, ... ],
        "keywords_extracted": ["wheelchair", "father"],
        "total_ngos_checked": 15
    }
    """
    data = request.get_json()

    # ── Validate input ──
    if not data:
        return jsonify({"error": "No JSON body received"}), 400

    requirement = data.get('requirement', '').strip()
    category    = data.get('category', '').strip()

    if not requirement:
        return jsonify({"error": "requirement field is required"}), 400

    if not category:
        return jsonify({"error": "category field is required"}), 400

    valid_categories = [
        'physically_challenged', 'underprivileged',
        'senior_citizen', 'differently_abled_child'
    ]
    if category not in valid_categories:
        return jsonify({
            "error": f"Invalid category. Must be one of: {valid_categories}"
        }), 400

    # ── Get user coordinates ──
    try:
        user_lat = float(data.get('user_lat', DEHRADUN_CENTER['lat']))
        user_lng = float(data.get('user_lng', DEHRADUN_CENTER['lng']))
    except (TypeError, ValueError):
        user_lat = DEHRADUN_CENTER['lat']
        user_lng = DEHRADUN_CENTER['lng']

    # ── Run AI engine ──
    from ai_engine import extract_keywords
    keywords = extract_keywords(requirement)

    results = find_top_ngos(
        requirement=requirement,
        category=category,
        user_lat=user_lat,
        user_lng=user_lng,
        top_n=3
    )

    # ── Build clean response (remove internal fields) ──
    clean_results = []
    for ngo in results:
        clean_results.append({
            "id":                ngo["id"],
            "name":              ngo["name"],
            "address":           ngo["address"],
            "phone":             ngo["phone"],
            "rating":            ngo["rating"],
            "lat":               ngo["lat"],
            "lng":               ngo["lng"],
            "categories":        ngo["categories"],
            "services":          ngo["services"],
            "tags":              ngo["services"][:4],   # top 4 services as display tags
            "score":             ngo["score"],
            "distance_km":       ngo["distance_km"],
            "matched_keywords":  ngo["matched_keywords"]
        })

    return jsonify({
        "results":             clean_results,
        "keywords_extracted":  keywords,
        "total_ngos_checked":  15,
        "user_location": {
            "lat": user_lat,
            "lng": user_lng
        }
    })


# ─── GET ALL NGOS (for admin / debugging) ────────────────────────
@app.route('/api/ngos', methods=['GET'])
def all_ngos():
    from ngo_data import NGO_DATABASE
    return jsonify({
        "count": len(NGO_DATABASE),
        "ngos": [{
            "id":         n["id"],
            "name":       n["name"],
            "categories": n["categories"],
            "phone":      n["phone"]
        } for n in NGO_DATABASE]
    })


# ─── RUN ─────────────────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    print(f"🌉 NeedBridge API starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
