# app.py — NeedBridge Flask Backend v2.0 (with Reviews)

from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db, Review
from ai_engine import find_top_ngos, extract_keywords
from ngo_data import NGO_DATABASE
import os
import nltk

nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)

app = Flask(__name__)

# ─── DATABASE CONFIG ─────────────────────────────────────────────
basedir = os.path.abspath(os.path.dirname(__file__))
git add .
git commit -m "fix: switch to PostgreSQL for persistent reviews"
git push
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

CORS(app)

DEHRADUN_CENTER = {"lat": 30.3165, "lng": 78.0322}


@app.route('/')
def home():
    return jsonify({"status": "NeedBridge API is running ✅", "version": "2.0"})


@app.route('/api/match', methods=['POST'])
def match_ngos():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body received"}), 400

    requirement = data.get('requirement', '').strip()
    category    = data.get('category', '').strip()

    if not requirement:
        return jsonify({"error": "requirement field is required"}), 400
    if not category:
        return jsonify({"error": "category field is required"}), 400

    valid_categories = ['physically_challenged', 'underprivileged', 'senior_citizen', 'differently_abled_child']
    if category not in valid_categories:
        return jsonify({"error": f"Invalid category"}), 400

    try:
        user_lat = float(data.get('user_lat', DEHRADUN_CENTER['lat']))
        user_lng = float(data.get('user_lng', DEHRADUN_CENTER['lng']))
    except (TypeError, ValueError):
        user_lat = DEHRADUN_CENTER['lat']
        user_lng = DEHRADUN_CENTER['lng']

    keywords = extract_keywords(requirement)
    results  = find_top_ngos(requirement=requirement, category=category,
                              user_lat=user_lat, user_lng=user_lng, top_n=3)

    clean_results = []
    for ngo in results:
        clean_results.append({
            "id": ngo["id"], "name": ngo["name"], "address": ngo["address"],
            "phone": ngo["phone"], "rating": ngo["rating"],
            "lat": ngo["lat"], "lng": ngo["lng"],
            "categories": ngo["categories"], "services": ngo["services"],
            "tags": ngo["services"][:4], "score": ngo["score"],
            "distance_km": ngo["distance_km"], "matched_keywords": ngo["matched_keywords"]
        })

    return jsonify({"results": clean_results, "keywords_extracted": keywords,
                    "total_ngos_checked": len(NGO_DATABASE),
                    "user_location": {"lat": user_lat, "lng": user_lng}})


@app.route('/api/ngos', methods=['GET'])
def all_ngos():
    return jsonify({
        "count": len(NGO_DATABASE),
        "ngos": [{"id": n["id"], "name": n["name"],
                  "categories": n["categories"], "phone": n["phone"]}
                 for n in NGO_DATABASE]
    })


@app.route('/api/reviews', methods=['POST'])
def submit_review():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    required = ['ngo_id', 'ngo_name', 'reviewer', 'stars', 'review_text']
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    stars = int(data.get('stars', 0))
    if stars < 1 or stars > 5:
        return jsonify({"error": "Stars must be between 1 and 5"}), 400

    review_text = data.get('review_text', '').strip()
    if len(review_text) < 10:
        return jsonify({"error": "Review must be at least 10 characters"}), 400

    review = Review(
        ngo_id=data['ngo_id'], ngo_name=data['ngo_name'],
        reviewer=data['reviewer'].strip(), stars=stars, review_text=review_text
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({"success": True, "message": "Review submitted successfully!",
                    "review": review.to_dict()}), 201


@app.route('/api/reviews/<ngo_id>', methods=['GET'])
def get_reviews(ngo_id):
    reviews = Review.query.filter_by(ngo_id=ngo_id)\
                          .order_by(Review.created_at.desc()).all()
    if not reviews:
        return jsonify({"ngo_id": ngo_id, "count": 0, "avg_stars": 0, "reviews": []})

    avg_stars = round(sum(r.stars for r in reviews) / len(reviews), 1)
    return jsonify({"ngo_id": ngo_id, "count": len(reviews),
                    "avg_stars": avg_stars, "reviews": [r.to_dict() for r in reviews]})


@app.route('/api/reviews', methods=['GET'])
def all_reviews():
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify({"count": len(reviews), "reviews": [r.to_dict() for r in reviews]})


if __name__ == '__main__':
    port  = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    print(f"🌉 NeedBridge API v2.0 starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
