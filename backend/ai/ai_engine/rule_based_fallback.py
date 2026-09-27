"""
Rule-based fallback - LAST RESORT classifier. Pure Python, no API calls,
no dependencies, cannot fail. Used only if both AI tiers fail
(e.g. no internet during a live demo, both providers rate-limited at once).

This is intentionally simple - it exists purely so the demo can never
show an error screen. Do not judge accuracy against this; it's a safety net.

Updated for SolveSphere: 7 categories, severity as a 0.0-10.0 float
(matches what the LLM providers return, so downstream code never has to
branch on which provider handled a request).
"""

CRITICAL_WORDS = ["fire", "collapse", "gas leak", "electrocut", "explosion", "flood", "dead body", "drowning", "outbreak"]
HIGH_WORDS = ["injury", "injured", "sewage", "contaminated", "accident", "leak", "no water", "power outage", "crop failure"]
MEDIUM_WORDS = ["pothole", "streetlight", "garbage", "broken", "delay", "noise", "traffic", "pest"]

CATEGORY_KEYWORDS = {
    "Water Management": ["water", "pipeline", "tap", "drinking water", "borewell", "reservoir", "irrigation canal"],
    "Agriculture & FoodTech": ["crop", "farm", "farmer", "irrigation", "fertilizer", "harvest", "grain", "pesticide", "seed", "soil"],
    "Health & MedTech": ["hospital", "disease", "outbreak", "injury", "medical", "clinic", "doctor", "medicine", "health"],
    "Sanitation & Waste": ["garbage", "sewage", "trash", "waste", "drain", "toilet", "sanitation", "dump"],
    "Rural Infrastructure": ["road", "bridge", "pothole", "building", "construction", "culvert", "village road"],
    "Smart Education": ["school", "college", "classroom", "teacher", "education", "student", "midday meal"],
    "Clean Energy": ["power", "electric", "transformer", "wire", "outage", "solar", "energy", "renewable", "grid"],
}


def _detect_severity(text):
    text = text.lower()
    if any(w in text for w in CRITICAL_WORDS):
        return 9.0
    if any(w in text for w in HIGH_WORDS):
        return 7.0
    if any(w in text for w in MEDIUM_WORDS):
        return 4.5
    return 2.5


def _severity_label(score):
    if score >= 8.0:
        return "critical"
    if score >= 6.0:
        return "high"
    if score >= 3.5:
        return "medium"
    return "low"


def _detect_category(text):
    text = text.lower()
    best_category, best_hits = "Rural Infrastructure", 0
    for category, keywords in CATEGORY_KEYWORDS.items():
        hits = sum(1 for k in keywords if k in text)
        if hits > best_hits:
            best_category, best_hits = category, hits
    return best_category


def analyze_challenge(title, description, location="", evidence=None):
    """Never raises. Always returns a usable dict."""
    combined = f"{title} {description}"
    severity_score = _detect_severity(combined)
    category = _detect_category(combined)

    return {
        "category": category,
        "severity_score": severity_score,
        "severity_label": _severity_label(severity_score),
        "priority_score": int(severity_score * 10),
        "summary": description[:200],
        "required_skills": ["general"],
        "reasoning": "Backup analysis logic used for this report.",
    }
