# ai_engine.py — NeedBridge Matching Engine
#
# HOW THE "AI" WORKS (simple, no ML/deep learning needed):
#
# STEP 1 — Keyword Extraction
#   - Lowercase the user's requirement text
#   - Remove stopwords (common words like "i", "need", "a", "the", "for")
#   - What's left = meaningful keywords
#   - Uses NLTK's stopword list
#
# STEP 2 — Scoring each NGO (0 to 1 scale)
#   Three factors combined:
#   A) Category Match Score (0 or 1)     — weight 40%
#   B) Keyword Match Score (0 to 1)      — weight 40%
#   C) Proximity Score (0 to 1)          — weight 20%
#
#   Final Score = (A × 0.40) + (B × 0.40) + (C × 0.20)
#
# STEP 3 — Sort by Final Score, return top 3
#
# TRAINING / IMPROVEMENT:
#   Since there's no ML model, "training" means improving the keyword lists
#   in ngo_data.py. The more keywords an NGO has, the better it matches.
#   Future upgrade path: collect user queries → build a TF-IDF matrix.

import math
import re
import nltk
from nltk.corpus import stopwords
from ngo_data import NGO_DATABASE

# Download NLTK stopwords on first run (only downloads once)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

# English + common Hindi-English mixing stopwords
STOPWORDS = set(stopwords.words('english')).union({
    'need', 'needs', 'want', 'wants', 'looking', 'help', 'please',
    'hi', 'hello', 'sir', 'mam', 'madam', 'kindly', 'request',
    'mujhe', 'chahiye', 'hai', 'hain', 'ke', 'liye', 'mera', 'meri',
    'koi', 'bhi', 'bahut', 'se', 'ho', 'ka', 'ki', 'ko', 'jo', 'yeh',
    'ngo', 'dehradun', 'uttarakhand'
})


# ─── STEP 1: Extract keywords from user text ────────────────────
def extract_keywords(text: str) -> list[str]:
    """
    Lowercase → remove punctuation → split into words → remove stopwords.
    Returns a list of meaningful keywords.

    Example:
      Input:  "I need a wheelchair for my father who cannot walk"
      Output: ['wheelchair', 'father', 'walk']
    """
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)   # remove punctuation
    words = text.split()
    keywords = [w for w in words if w not in STOPWORDS and len(w) > 2]
    return keywords


# ─── STEP 2A: Category score ────────────────────────────────────
def category_score(ngo: dict, user_category: str) -> float:
    """
    Returns 1.0 if user's category is in this NGO's category list.
    Returns 0.3 if no match (partial — NGO might still be useful).
    """
    if user_category in ngo.get('categories', []):
        return 1.0
    return 0.3


# ─── STEP 2B: Keyword match score ───────────────────────────────
def keyword_score(ngo: dict, user_keywords: list[str]) -> float:
    """
    Count how many user keywords appear in this NGO's keyword list
    or services list. Normalize to 0–1 scale.

    Matching is partial — "wheelchair" matches "wheelchair support" etc.
    """
    if not user_keywords:
        return 0.0

    ngo_keyword_text = ' '.join(
        ngo.get('keywords', []) + ngo.get('services', [])
    ).lower()

    matches = 0
    for kw in user_keywords:
        if kw in ngo_keyword_text:
            matches += 1

    # Normalize: matched / total user keywords, capped at 1.0
    score = matches / len(user_keywords)
    return min(score, 1.0)


# ─── STEP 2C: Proximity score ───────────────────────────────────
def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Haversine formula — straight-line distance in km between two GPS points.
    No API needed.
    """
    R = 6371  # Earth radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(d_lng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def proximity_score(ngo: dict, user_lat: float, user_lng: float) -> tuple[float, float]:
    """
    Returns (score 0–1, distance_km).
    Closer = higher score.
    Max useful distance in Dehradun city = 20 km.
    score = 1 - (distance / 20), floored at 0.
    """
    dist = haversine_km(user_lat, user_lng, ngo['lat'], ngo['lng'])
    score = max(0.0, 1.0 - (dist / 20.0))
    return score, round(dist, 2)


# ─── STEP 3: Main matching function ─────────────────────────────
def find_top_ngos(
    requirement: str,
    category: str,
    user_lat: float,
    user_lng: float,
    top_n: int = 3
) -> list[dict]:
    """
    Main function called by app.py.

    Args:
        requirement : User's typed text e.g. "need wheelchair for father"
        category    : One of: physically_challenged | underprivileged |
                              senior_citizen | differently_abled_child
        user_lat    : User's latitude
        user_lng    : User's longitude
        top_n       : How many results to return (default 3)

    Returns:
        List of top N NGO dicts, each with an added 'score' and 'distance_km'
    """

    keywords = extract_keywords(requirement)

    scored = []
    for ngo in NGO_DATABASE:
        cat_s   = category_score(ngo, category)
        kw_s    = keyword_score(ngo, keywords)
        prox_s, dist_km = proximity_score(ngo, user_lat, user_lng)

        # Weighted final score
        # Category: 40%, Keywords: 40%, Proximity: 20%
        final_score = (cat_s * 0.40) + (kw_s * 0.40) + (prox_s * 0.20)

        scored.append({
            **ngo,
            "score":       round(final_score, 4),
            "distance_km": dist_km,
            "matched_keywords": [
                kw for kw in keywords
                if kw in ' '.join(ngo.get('keywords', []) + ngo.get('services', [])).lower()
            ]
        })

    # Sort by final score descending
    scored.sort(key=lambda x: x['score'], reverse=True)

    return scored[:top_n]


# ─── HOW TO "TRAIN" / IMPROVE THIS MODEL ────────────────────────
#
# This engine has NO machine learning — it uses rule-based keyword matching.
# Here's how to improve it over time:
#
# 1. ADD MORE KEYWORDS to each NGO in ngo_data.py
#    e.g. if users type "baitha nahi sakta" add "baitha", "sakta" to keywords
#
# 2. TUNE THE WEIGHTS in find_top_ngos()
#    If distance matters more, increase prox weight (e.g. 0.30)
#    If category is most important, increase cat weight (e.g. 0.50)
#
# 3. SYNONYM EXPANSION (future upgrade):
#    Map synonyms → canonical keywords
#    e.g. {"wheelchair": ["chair", "mobility aid", "kursi", "pehiya"]}
#    Add to extract_keywords() before matching
#
# 4. LOG QUERIES (future upgrade):
#    Save every user query + selected result to a CSV/DB
#    Use that data to find missing keywords and add them
#
# 5. TF-IDF UPGRADE (future, when you learn it in 2nd/3rd year):
#    Replace keyword matching with sklearn TfidfVectorizer
#    Vectorize all NGO service text → compute cosine similarity
#    Much more powerful, still no deep learning needed
