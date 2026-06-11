# ngo_data.py — Real Dehradun NGO Database
# Each NGO can belong to MULTIPLE categories.
# Coordinates were looked up via OpenStreetMap / Google Maps for each address.
# Scoring uses: category match + keyword match + distance proximity.

NGO_DATABASE = [

    # ─────────────────────────────────────────────
    # PHYSICALLY CHALLENGED
    # ─────────────────────────────────────────────
    {
        "id": "cheshire_homes",
        "name": "Cheshire Homes",
        "address": "16, Pritam Road, Dalanwala, Dehradun, Uttarakhand 248001",
        "phone": "0135-2672331",
        "rating": 4.5,
        "lat": 30.3063,
        "lng": 78.0498,
        "categories": ["physically_challenged", "differently_abled_child"],
        "services": [
            "residential care", "rehabilitation", "disability support",
            "daily living assistance", "developmental support"
        ],
        "keywords": [
            "wheelchair", "disabled", "rehabilitation", "residential", "care",
            "mobility", "physical", "disability", "assisted living", "support"
        ]
    },
    {
        "id": "saahas_foundation",
        "name": "Saahas Foundation Inclusive Resource Centre",
        "address": "Johri, Malsi, Dehradun, Uttarakhand 248003",
        "phone": "+91 97609 66102",
        "rating": 4.9,
        "lat": 30.3730,
        "lng": 78.0620,
        "categories": ["physically_challenged", "differently_abled_child"],
        "services": [
            "inclusive education", "disability support", "rehabilitation",
            "skill development", "inclusive schooling"
        ],
        "keywords": [
            "inclusive", "education", "disability", "rehabilitation", "skill",
            "learning", "school", "support", "development", "resource"
        ]
    },
    {
        "id": "latika_roy_foundation",
        "name": "Latika Roy Foundation",
        "address": "Near Survey Chowk, Rajpur Road, Dehradun, Uttarakhand 248001",
        "phone": "0135-2761014",
        "rating": 4.8,
        "lat": 30.3597,
        "lng": 78.0644,
        "categories": ["physically_challenged", "differently_abled_child"],
        "services": [
            "physiotherapy", "occupational therapy", "speech therapy",
            "assistive devices", "special education", "child development",
            "therapy", "inclusive schooling"
        ],
        "keywords": [
            "physiotherapy", "therapy", "speech", "occupational", "assistive",
            "device", "special education", "child", "disability", "autism",
            "cerebral palsy", "down syndrome", "development", "school"
        ]
    },
    {
        "id": "autism_welfare_society",
        "name": "Autism Welfare Society",
        "address": "Dehradun, Uttarakhand",
        "phone": "+91 99279 94361",
        "rating": 4.2,
        "lat": 30.3165,
        "lng": 78.0322,
        "categories": ["physically_challenged", "differently_abled_child"],
        "services": [
            "autism support", "special education", "parent counselling",
            "therapy", "autism intervention", "counselling"
        ],
        "keywords": [
            "autism", "autistic", "special education", "counselling",
            "therapy", "behavioral", "child", "parent", "support", "intervention"
        ]
    },
    {
        "id": "niepvd",
        "name": "NIEPVD (National Institute for Empowerment of Persons with Visual Disabilities)",
        "address": "116, Rajpur Road, Dehradun, Uttarakhand 248001",
        "phone": "0135-2744491",
        "rating": 4.5,
        "lat": 30.3597,
        "lng": 78.0700,
        "categories": ["physically_challenged"],
        "services": [
            "visually impaired support", "Braille resources",
            "rehabilitation", "assistive technology"
        ],
        "keywords": [
            "blind", "visually impaired", "vision", "braille", "eyesight",
            "assistive technology", "rehabilitation", "low vision", "sight"
        ]
    },

    # ─────────────────────────────────────────────
    # UNDERPRIVILEGED FAMILIES
    # ─────────────────────────────────────────────
    {
        "id": "josh_welfare_society",
        "name": "Josh Welfare Society",
        "address": "42 Mata Mandir Road, Dharampur, Dehradun 248001",
        "phone": "+91 99270 10738",
        "rating": 5.0,
        "lat": 30.3204,
        "lng": 78.0304,
        "categories": ["underprivileged"],
        "services": [
            "food support", "education support", "healthcare assistance",
            "welfare programs"
        ],
        "keywords": [
            "food", "hunger", "meals", "education", "school fees", "healthcare",
            "medical", "welfare", "poor", "needy", "support", "family", "ration"
        ]
    },
    {
        "id": "uh_foundation",
        "name": "U H Foundation NGO",
        "address": "Rana Apartments, 4th Floor, Jakhan, Dehradun 248003",
        "phone": "+91 82185 96166",
        "rating": 4.4,
        "lat": 30.3480,
        "lng": 78.0720,
        "categories": ["underprivileged"],
        "services": [
            "food distribution", "education support",
            "health camps", "livelihood assistance"
        ],
        "keywords": [
            "food", "distribution", "education", "health camp", "livelihood",
            "employment", "poor", "underprivileged", "family", "community"
        ]
    },
    {
        "id": "unforgotten_humanity",
        "name": "Unforgotten Humanity Foundation",
        "address": "Dehradun, Uttarakhand",
        "phone": "+91 81464 65476",
        "rating": 4.7,
        "lat": 30.3165,
        "lng": 78.0322,
        "categories": ["underprivileged", "differently_abled_child"],
        "services": [
            "food drives", "education support", "child welfare",
            "community welfare"
        ],
        "keywords": [
            "food", "drive", "education", "child", "welfare", "community",
            "hunger", "school", "support", "underprivileged"
        ]
    },
    {
        "id": "aasraa",
        "name": "Aasraa",
        "address": "Tapovan Ashram Road, Raipur, Dehradun 248008",
        "phone": "+91 90450 56991",
        "rating": 4.3,
        "lat": 30.3430,
        "lng": 78.0810,
        "categories": ["underprivileged", "differently_abled_child"],
        "services": [
            "education", "foster care", "life skills",
            "support for vulnerable children", "inclusion support"
        ],
        "keywords": [
            "education", "foster", "children", "vulnerable", "life skills",
            "school", "care", "orphan", "shelter", "support", "inclusion"
        ]
    },
    {
        "id": "mamta_samajik_sanstha",
        "name": "Mamta Samajik Sanstha",
        "address": "Dehradun, Uttarakhand",
        "phone": "+91 97192 94888",
        "rating": 4.0,
        "lat": 30.3165,
        "lng": 78.0322,
        "categories": ["underprivileged"],
        "services": [
            "livelihood support", "health initiatives",
            "women's empowerment", "community welfare"
        ],
        "keywords": [
            "livelihood", "women", "empowerment", "health", "community",
            "welfare", "income", "employment", "self help", "skill"
        ]
    },
    {
        "id": "sead_in_himalayas",
        "name": "SEAD in Himalayas",
        "address": "Near Sanskar International School, Jogiwala, Badripur, Dehradun 248014",
        "phone": "+91 99974 78017",
        "rating": 5.0,
        "lat": 30.2808,
        "lng": 78.0622,
        "categories": ["underprivileged"],
        "services": [
            "education support for underprivileged children",
            "healthcare and health awareness",
            "skill development", "vocational training",
            "youth livelihood", "employment support",
            "women empowerment", "community development",
            "nutrition programmes", "career counselling",
            "entrepreneurship development", "disaster preparedness"
        ],
        "keywords": [
            "education", "healthcare", "skill", "vocational", "livelihood",
            "employment", "women", "empowerment", "nutrition", "malnutrition",
            "career", "entrepreneurship", "community", "disaster", "youth",
            "food", "health", "poor", "underprivileged"
        ]
    },

    # ─────────────────────────────────────────────
    # SENIOR CITIZENS
    # ─────────────────────────────────────────────
    {
        "id": "gauri_old_age_home",
        "name": "Gauri Old Age Home",
        "address": "Near Vidya Bhawan School, Ambiwala, Prem Nagar, Dehradun 248007",
        "phone": "+91 70172 63022",
        "rating": 5.0,
        "lat": 30.2780,
        "lng": 77.9980,
        "categories": ["senior_citizen"],
        "services": [
            "shelter", "food", "healthcare support", "elder care"
        ],
        "keywords": [
            "old age", "elderly", "senior", "shelter", "food", "care",
            "healthcare", "aged", "elder", "home", "residence", "alone"
        ]
    },
    {
        "id": "deenseva_welfare",
        "name": "Deenseva Welfare Foundation",
        "address": "Dehradun, Uttarakhand",
        "phone": "+91 90565 49903",
        "rating": 4.8,
        "lat": 30.3165,
        "lng": 78.0322,
        "categories": ["senior_citizen", "underprivileged"],
        "services": [
            "shelter support", "food assistance",
            "elderly care", "social welfare"
        ],
        "keywords": [
            "shelter", "food", "elderly", "senior", "care", "welfare",
            "social", "support", "old", "aged", "assistance"
        ]
    },
    {
        "id": "senior_citizen_home_complex",
        "name": "Senior Citizen Home Complex",
        "address": "8 Old Mussoorie Road, Rajpur Road, Dehradun 248001",
        "phone": "N/A — visit in person",
        "rating": 4.4,
        "lat": 30.3597,
        "lng": 78.0500,
        "categories": ["senior_citizen"],
        "services": [
            "senior living", "companionship",
            "daily assistance"
        ],
        "keywords": [
            "senior", "elderly", "living", "companionship", "daily",
            "assistance", "old age", "retirement", "residence", "home"
        ]
    },
    {
        "id": "senior_citizens_society",
        "name": "Senior Citizens Society",
        "address": "Thakurpur Road, Prem Nagar, Dehradun 248007",
        "phone": "N/A — visit in person",
        "rating": 4.0,
        "lat": 30.2850,
        "lng": 78.0020,
        "categories": ["senior_citizen"],
        "services": [
            "senior citizen welfare", "social support programs"
        ],
        "keywords": [
            "senior", "citizen", "welfare", "social", "support",
            "community", "elderly", "programs"
        ]
    },
    {
        "id": "old_age_home_chushi",
        "name": "Old Age Home (Chushi Gangdruk)",
        "address": "Clement Town, Dehradun 248002",
        "phone": "+91 84493 70229",
        "rating": 5.0,
        "lat": 30.2693,
        "lng": 78.0170,
        "categories": ["senior_citizen"],
        "services": [
            "shelter", "food", "care and support for elderly residents"
        ],
        "keywords": [
            "old age", "home", "elderly", "shelter", "food", "care",
            "senior", "tibetan", "resident", "aged", "support"
        ]
    },
]
