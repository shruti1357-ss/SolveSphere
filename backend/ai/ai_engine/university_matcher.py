"""
Maps a classified category to real Jharkhand research/academic institutions
that are a plausible fit to advise on or help solve that class of civic
problem. Used by ai_services/views.py right after classification.

`confidence` is a simple, hand-tuned relevance score (0.0-1.0) — it is NOT
learned from data. Tune these numbers based on judge/mentor feedback; they
exist to let the frontend show "best fit" vs "also relevant" institutions.
"""

INSTITUTIONS = {
    "BIT_MESRA": {
        "name": "Birla Institute of Technology, Mesra",
        "location": "Ranchi",
        "departments": ["Civil Engineering", "Electrical Engineering", "Computer Science", "Environmental Engineering"],
    },
    "NIT_JAMSHEDPUR": {
        "name": "National Institute of Technology, Jamshedpur",
        "location": "Jamshedpur",
        "departments": ["Civil Engineering", "Mechanical Engineering", "Metallurgical Engineering"],
    },
    "IIT_ISM_DHANBAD": {
        "name": "Indian Institute of Technology (ISM), Dhanbad",
        "location": "Dhanbad",
        "departments": ["Mining Engineering", "Environmental Science & Engineering", "Petroleum Engineering", "Energy & Resources"],
    },
    "BAU_RANCHI": {
        "name": "Birsa Agricultural University",
        "location": "Ranchi",
        "departments": ["Agronomy", "Horticulture", "Agricultural Engineering", "Veterinary Science"],
    },
    "RIMS_RANCHI": {
        "name": "Rajendra Institute of Medical Sciences",
        "location": "Ranchi",
        "departments": ["Community Medicine", "General Medicine", "Public Health"],
    },
    "RANCHI_UNIVERSITY": {
        "name": "Ranchi University",
        "location": "Ranchi",
        "departments": ["Education", "Public Administration", "Social Work"],
    },
}

# category -> ordered list of (institution_key, department, confidence)
CATEGORY_TO_INSTITUTIONS = {
    "Water Management": [
        ("IIT_ISM_DHANBAD", "Environmental Science & Engineering", 0.90),
        ("BIT_MESRA", "Civil Engineering", 0.70),
    ],
    "Agriculture & FoodTech": [
        ("BAU_RANCHI", "Agricultural Engineering", 0.95),
        ("NIT_JAMSHEDPUR", "Mechanical Engineering", 0.55),
    ],
    "Health & MedTech": [
        ("RIMS_RANCHI", "Community Medicine", 0.95),
        ("BIT_MESRA", "Electrical Engineering", 0.50),  # biomedical devices angle
    ],
    "Sanitation & Waste": [
        ("BIT_MESRA", "Environmental Engineering", 0.90),
        ("IIT_ISM_DHANBAD", "Environmental Science & Engineering", 0.75),
    ],
    "Rural Infrastructure": [
        ("NIT_JAMSHEDPUR", "Civil Engineering", 0.90),
        ("IIT_ISM_DHANBAD", "Mining Engineering", 0.55),
    ],
    "Smart Education": [
        ("RANCHI_UNIVERSITY", "Education", 0.90),
        ("BIT_MESRA", "Computer Science", 0.60),
    ],
    "Clean Energy": [
        ("IIT_ISM_DHANBAD", "Energy & Resources", 0.90),
        ("BIT_MESRA", "Electrical Engineering", 0.75),
    ],
}


def match_university(category):
    """
    Returns a list of dicts like:
    [{"university": "Birla Institute of Technology, Mesra", "location": "Ranchi",
      "department": "Civil Engineering", "match_confidence": 0.9}, ...]
    Falls back to Ranchi University (general) if the category is unrecognized.

    Field names (university/match_confidence) deliberately match what the
    backend team's ai_services/views.py stub already returns, so the
    frontend contract doesn't need to change.
    """
    matches = CATEGORY_TO_INSTITUTIONS.get(category)
    if not matches:
        matches = [("RANCHI_UNIVERSITY", "Public Administration", 0.40)]

    results = []
    for key, department, confidence in matches:
        info = INSTITUTIONS[key]
        results.append({
            "university": info["name"],
            "location": info["location"],
            "department": department,
            "match_confidence": confidence,
        })
    return results
