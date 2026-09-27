"""
Run this file to test the AI pipeline WITHOUT needing Django or MongoDB
set up yet. Good first thing to run to confirm everything works.

IMPORTANT - run it from ONE FOLDER ABOVE ai_engine, like this:
    python -m ai_engine.test_pipeline

(not "python test_pipeline.py" from inside the folder - that won't work
because this file is part of the ai_engine package)
"""

from .providers import analyze_challenge_robust
from .local_embeddings import get_embedding
from .duplicate_check import cosine_similarity, haversine_distance_meters
from .university_matcher import match_university

SAMPLE_CHALLENGES = [
    {
        "title": "Broken streetlight on MG Road",
        "description": "The streetlight near the MG Road bus stop has been broken for 2 weeks, making it very dark and unsafe at night.",
        "location": "MG Road, Ranchi",
        "latitude": 23.3629,
        "longitude": 85.3346,
    },
    {
        "title": "Street light not working near bus stop",
        "description": "There is a non-functional street lamp close to the MG Road bus stand, area is pitch dark at night.",
        "location": "MG Road, Ranchi",
        "latitude": 23.3631,   # ~25m from the first report - same real-world issue
        "longitude": 85.3349,
    },
    {
        "title": "Sewage overflow near school",
        "description": "Sewage water has been overflowing onto the road right outside the government primary school for 3 days, children are walking through it.",
        "location": "Ward 12, Ranchi",
        "latitude": 23.4100,   # several km away - unrelated issue
        "longitude": 85.4200,
    },
]

if __name__ == "__main__":
    results = []
    for challenge in SAMPLE_CHALLENGES:
        print(f"\nAnalyzing: {challenge['title']}")
        analysis = analyze_challenge_robust(
            title=challenge["title"],
            description=challenge["description"],
            location=challenge["location"],
        )
        print(analysis)

        institutions = match_university(analysis["category"])
        print(f"Recommended institutions: {institutions}")

        embedding = get_embedding(f"{challenge['title']} {challenge['description']}")
        results.append((challenge, embedding))

    # Semantic similarity: 1 and 2 should be HIGH (same issue), 1 and 3 LOW (different issue)
    sim_1_2 = cosine_similarity(results[0][1], results[1][1])
    sim_1_3 = cosine_similarity(results[0][1], results[2][1])
    print(f"\nSemantic similarity 1 vs 2 (should be HIGH): {sim_1_2:.3f}")
    print(f"Semantic similarity 1 vs 3 (should be LOW):  {sim_1_3:.3f}")

    # Spatial distance: 1 and 2 should be well under 500m, 1 and 3 should be far over
    c1, c2, c3 = SAMPLE_CHALLENGES
    dist_1_2 = haversine_distance_meters(c1["latitude"], c1["longitude"], c2["latitude"], c2["longitude"])
    dist_1_3 = haversine_distance_meters(c1["latitude"], c1["longitude"], c3["latitude"], c3["longitude"])
    print(f"\nDistance 1 vs 2 (should be < 500m): {dist_1_2:.1f}m")
    print(f"Distance 1 vs 3 (should be > 500m): {dist_1_3:.1f}m")

    print(f"\n[DEBUG] This file is: {__file__}")
    print(f"[DEBUG] sim_1_2 = {sim_1_2!r}, comparing sim_1_2 >= 0.75 -> {sim_1_2 >= 0.75}")
    would_link = (sim_1_2 >= 0.75) and (dist_1_2 <= 500)   
    print(f"\nWould challenge 1 & 2 be linked as duplicates? {'YES' if would_link else 'NO (tune thresholds if this looks wrong)'}")
