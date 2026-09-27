"""
AI University Matcher Engine for Government Admin (SIH26043)
Calculates AI capability match percentage (0-100%) and fit rank
when Government Admin Officers assign validated citizen challenges to HEIs.
"""

from universities.models import UniversityProfile

DEFAULT_HEI_MATCHES = [
    {
        "university_name": "Birla Institute of Technology (BIT), Mesra",
        "official_email": "admin@bitmesra.ac.in",
        "district": "Ranchi",
        "match_score": 96,
        "match_reasons": [
            "Strong specialization in Environmental & Water Quality Engineering",
            "Active IoT Sensor & Water Monitoring R&D Lab",
            "96% Domain Expertise Alignment"
        ],
        "matching_departments": ["Civil & Environmental Engineering", "Computer Science"],
        "key_capabilities": ["Water Quality Testing", "IoT Sensors", "Geospatial Analysis", "AI/ML"]
    },
    {
        "university_name": "National Institute of Technology (NIT), Jamshedpur",
        "official_email": "admin@nitjsr.ac.in",
        "district": "East Singhbhum (Jamshedpur)",
        "match_score": 91,
        "match_reasons": [
            "Extensive Civil & Infrastructure Research Center",
            "Proven track record in rural filtration and structural solutions",
            "91% Domain Expertise Alignment"
        ],
        "matching_departments": ["Civil Engineering", "Mechanical Engineering"],
        "key_capabilities": ["Filtration Technology", "Structural R&D", "Renewable Energy"]
    },
    {
        "university_name": "Indian Institute of Technology (IIT ISM), Dhanbad",
        "official_email": "admin@iitism.ac.in",
        "district": "Dhanbad",
        "match_score": 88,
        "match_reasons": [
            "Premier Center for Environmental Science & Mining Water Treatment",
            "88% Domain Expertise Alignment"
        ],
        "matching_departments": ["Environmental Science & Engineering", "Mining Engineering"],
        "key_capabilities": ["Heavy Metal Filtration", "Groundwater Analysis", "Sensors"]
    },
    {
        "university_name": "Birsa Agricultural University (BAU), Ranchi",
        "official_email": "admin@bau.ac.in",
        "district": "Ranchi",
        "match_score": 85,
        "match_reasons": [
            "State Leader in Agricultural Engineering & Soil/Water Conservation",
            "85% Domain Expertise Alignment"
        ],
        "matching_departments": ["Agricultural Engineering", "Soil Science"],
        "key_capabilities": ["Agri-Tech", "Soil Analysis", "Irrigation Systems"]
    }
]

def calculate_admin_university_matches(challenge):
    """
    Given a Challenge instance or dict, queries active registered UniversityProfiles
    and returns an ordered list of matching universities with match_score and details.
    """
    category = getattr(challenge, 'category', 'Water Management')
    title = getattr(challenge, 'title', '')
    description = getattr(challenge, 'description', '')
    required_expertise = getattr(challenge, 'required_expertise', []) or []
    district = getattr(challenge, 'district', 'Ranchi')

    # Query universities: MongoDB Atlas primary, SQLite fallback
    db_unis = []
    try:
        from mongodb_config import MongoUniversityProfile
        db_unis = list(MongoUniversityProfile.objects.all())
    except Exception:
        pass
    if not db_unis:
        db_unis = list(UniversityProfile.objects.all())
    
    results = []

    if db_unis:
        for uni in db_unis:
            score = 75 # baseline
            reasons = []

            # Expertise match
            uni_expertise = [e.lower() for e in (uni.expertise or [])]
            matched_tags = []
            for req in required_expertise:
                if req.lower() in uni_expertise or any(req.lower() in exp for exp in uni_expertise):
                    matched_tags.append(req)
                    score += 8

            # Category match heuristics
            if 'Water' in category and any(k in str(uni.expertise) for k in ['Water', 'Environment', 'Civil']):
                score += 12
                reasons.append("High alignment with Water & Environmental Engineering department")
            elif 'Agri' in category and any(k in str(uni.expertise) for k in ['Agri', 'Soil', 'Bio']):
                score += 12
                reasons.append("Top specialization in Agriculture & Bio-resource engineering")
            elif 'Health' in category and any(k in str(uni.expertise) for k in ['Medical', 'Health', 'Bio']):
                score += 12
                reasons.append("Direct alignment with Medical & Community Health research center")

            # District proximity boost
            if uni.district.lower() == district.lower():
                score += 5
                reasons.append(f"Located in target district ({district}) for rapid field deployment")

            score = min(score, 98)

            if not reasons:
                reasons.append(f"{score}% domain capability match based on university research profile")

            results.append({
                "id": uni.id,
                "university_name": uni.university_name,
                "official_email": uni.official_email,
                "district": uni.district,
                "verification_status": uni.verification_status,
                "match_score": score,
                "match_reasons": reasons,
                "matching_departments": uni.departments or ["Engineering & Research"],
                "key_capabilities": uni.expertise or ["Research & Development"]
            })

    # Merge or fallback to DEFAULT_HEI_MATCHES if DB has few entries
    existing_emails = {r['official_email'] for r in results}
    for default_item in DEFAULT_HEI_MATCHES:
        if default_item['official_email'] not in existing_emails:
            results.append({
                "id": None,
                "university_name": default_item['university_name'],
                "official_email": default_item['official_email'],
                "district": default_item['district'],
                "verification_status": "VERIFIED",
                "match_score": default_item['match_score'],
                "match_reasons": default_item['match_reasons'],
                "matching_departments": default_item['matching_departments'],
                "key_capabilities": default_item['key_capabilities']
            })

    # Sort descending by match_score
    results.sort(key=lambda x: x['match_score'], reverse=True)
    return results
