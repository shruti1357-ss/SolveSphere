"""
AI University Match Score Calculator for SolveSphere.
Calculates domain-capability match percentage (0-100%) between a Challenge
and a University Profile.
"""

def calculate_university_match(challenge, university_profile):
    """
    Returns a dict with integer `match_score` (e.g. 94) and list of `matching_tags`.
    """
    score = 50.0  # Base match score
    matching_tags = []

    uni_expertise = [e.lower() for e in (university_profile.expertise or [])]
    uni_departments = [d.lower() for d in (university_profile.departments or [])]

    challenge_text = f"{challenge.title} {challenge.description} {challenge.category}".lower()

    # Category / Domain matching
    category_map = {
        'WATER_SANITATION': ['water', 'sanitation', 'environmental', 'civil', 'chemistry'],
        'ROAD_INFRASTRUCTURE': ['civil', 'infrastructure', 'mechanical', 'geotechnical'],
        'AGRICULTURE': ['agriculture', 'botany', 'crop', 'ai/ml', 'data science', 'iot'],
        'HEALTHCARE': ['health', 'medtech', 'biotech', 'ai/ml'],
        'EDUCATION': ['computer science', 'education', 'smart education'],
        'CLEAN_ENERGY': ['electrical', 'renewable', 'clean energy', 'solar', 'iot'],
    }

    # Match expertise tags
    for tag in uni_expertise:
        if tag in challenge_text or any(k in tag for k in ['ai', 'ml', 'iot', 'data science', 'water', 'civil', 'crop']):
            score += 12.0
            matching_tags.append(tag.upper())

    # Match department capabilities
    for dept in uni_departments:
        if dept in challenge_text or 'computer' in dept or 'civil' in dept or 'agriculture' in dept:
            score += 8.0
            if dept.upper() not in matching_tags:
                matching_tags.append(dept.upper())

    # District proximity bonus
    if university_profile.district and challenge.district and university_profile.district.lower() == challenge.district.lower():
        score += 10.0
        matching_tags.append(f"District Proximity ({university_profile.district})")

    # Clamp final score between 65% and 98%
    final_score = int(min(98, max(65, score)))

    return {
        "match_score": final_score,
        "matching_tags": list(set(matching_tags))[:5]
    }
