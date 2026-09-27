"""
AI Industry Match Score Calculator for SolveSphere.
Calculates domain & capability match percentage (0-100%) between a
University Project / Challenge and an Industry Profile.
"""

def calculate_industry_match(project, industry_profile):
    """
    Returns a dict with integer `match_score` (e.g. 92), `matching_skills`,
    and `matching_services`.
    """
    score = 55.0  # Base match score
    matching_skills = []
    matching_services = []

    ind_expertise = [e.lower() for e in (industry_profile.expertise or [])]
    ind_services = [s.lower() for s in (industry_profile.services or [])]

    req_skills = [s.lower() for s in (project.required_skills or [])]
    project_text = f"{project.title} {project.description} {' '.join(req_skills)}".lower()

    # Skill matching
    for exp in ind_expertise:
        if exp in project_text or any(s in exp for s in req_skills):
            score += 10.0
            matching_skills.append(exp.upper())

    # Service alignment matching
    service_keywords = ['mentorship', 'testing', 'funding', 'prototype', 'cloud', 'deployment', 'hardware']
    for srv in ind_services:
        if any(k in srv for k in service_keywords):
            score += 8.0
            matching_services.append(srv.title())

    # District proximity bonus
    if getattr(industry_profile, 'district', None) and getattr(project, 'challenge', None) and getattr(project.challenge, 'district', None):
        if industry_profile.district.lower() == project.challenge.district.lower():
            score += 8.0
            matching_skills.append(f"District Match ({industry_profile.district})")

    # Clamp final score between 70% and 98%
    final_score = int(min(98, max(70, score)))

    return {
        "match_score": final_score,
        "matching_skills": list(set(matching_skills))[:5],
        "matching_services": list(set(matching_services))[:4]
    }
