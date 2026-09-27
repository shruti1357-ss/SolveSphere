"""
AI Citizen Problem Analyzer for SolveSphere.
Analyzes reported citizen community problems to extract category, priority,
urgency score, deduplication similarity score, and required technical expertise.
"""

from ai_engine.providers import analyze_challenge_robust
from ai_engine.duplicate_check import find_duplicate


def analyze_citizen_problem(title, description, location_text="Ranchi", latitude=23.3441, longitude=85.3096):
    """
    Returns a dict with AI analysis results:
    category, priority, urgency_score, duplicate_score, matching_duplicate_id, required_expertise, ai_summary
    """
    # 1. Run multi-tier LLM/Rule-based classification
    analysis = analyze_challenge_robust(title=title, description=description, location=location_text, verbose=False)
    
    category = analysis.get("category", "Environment")
    severity_score = float(analysis.get("severity_score", 6.5))

    # Determine Priority
    if severity_score >= 8.5:
        priority = "CRITICAL"
    elif severity_score >= 7.0:
        priority = "HIGH"
    elif severity_score >= 4.5:
        priority = "MEDIUM"
    else:
        priority = "LOW"

    # Extract required technical expertise based on domain keywords
    text = f"{title} {description} {category}".lower()
    expertise = []

    if any(k in text for k in ['water', 'well', 'fluoride', 'pipeline', 'drain']):
        expertise.extend(['Water Quality Engineering', 'Civil Engineering'])
    if any(k in text for k in ['garbage', 'waste', 'dump', 'trash', 'sanitation']):
        expertise.extend(['IoT Sensors', 'Waste Management', 'Data Analytics'])
    if any(k in text for k in ['crop', 'farming', 'pest', 'agriculture', 'soil']):
        expertise.extend(['AI/ML', 'Computer Vision', 'Agriculture Tech'])
    if any(k in text for k in ['road', 'pothole', 'bridge', 'transport']):
        expertise.extend(['Civil Engineering', 'GIS Mapping'])

    if not expertise:
        expertise = ['IoT Sensors', 'Data Analytics']

    # 2. Run Spatial & Semantic Deduplication check
    matching_duplicate_id = None
    matching_duplicate_title = ""
    duplicate_score = 15.0

    try:
        from ai_engine.local_embeddings import get_embedding
        from ai_services.embeddings_store import get_all_embeddings

        new_embedding = get_embedding(f"{title} {description}")
        candidates = get_all_embeddings()
        best_id, best_score, best_distance = find_duplicate(
            candidates, new_embedding, float(latitude), float(longitude)
        )
        if best_id is not None and best_score > 0:
            matching_duplicate_id = str(best_id)
            duplicate_score = round(float(best_score) * 100.0, 1)
            try:
                from mongodb_config import MongoChallenge
                from bson import ObjectId
                matched = None
                if len(str(best_id)) == 24:
                    try:
                        matched = MongoChallenge.objects(id=ObjectId(str(best_id))).first()
                    except Exception:
                        matched = None
                if not matched:
                    matched = MongoChallenge.objects(problem_id=str(best_id)).first()
                if matched:
                    matching_duplicate_title = getattr(matched, 'title', '')
            except Exception:
                pass
    except Exception:
        pass

    ai_summary = f"Category: {category} | Priority: {priority} ({severity_score}/10) | Required Skills: {', '.join(set(expertise))}"

    return {
        "category": category,
        "priority": priority,
        "urgency_score": round(severity_score, 1),
        "duplicate_score": round(duplicate_score, 1),
        "matching_duplicate_id": matching_duplicate_id,
        "matching_duplicate_title": matching_duplicate_title,
        "required_expertise": list(set(expertise)),
        "ai_summary": ai_summary
    }
