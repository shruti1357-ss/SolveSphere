"""
Duplicate detection via a hybrid check: geographic proximity (Haversine
distance) AND semantic similarity (cosine similarity over embeddings).
Both conditions must pass for two reports to be linked as duplicates.

This version works against flat latitude/longitude floats, matching the
ACTUAL live schema (Django's SQLite Challenge model) - not GeoJSON. The
candidate embeddings themselves come from a small MongoDB collection
(ai_services/embeddings_store.py), since SQLite has no vector field.
"""

import math

EARTH_RADIUS_METERS = 6371000
DISTANCE_THRESHOLD_METERS = 500
SIMILARITY_THRESHOLD = 0.75


def haversine_distance_meters(lat1, lon1, lat2, lon2):
    """Great-circle distance between two lat/lon points, in meters."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(d_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return EARTH_RADIUS_METERS * c


def cosine_similarity(vec_a, vec_b):
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def find_duplicate(
    candidates,
    new_embedding,
    new_lat,
    new_lon,
    distance_threshold=DISTANCE_THRESHOLD_METERS,
    similarity_threshold=SIMILARITY_THRESHOLD,
):
    """
    candidates: list of {"_id", "embedding", "latitude", "longitude"} dicts
                (from embeddings_store.get_all_embeddings()).
    Returns (duplicate_challenge_id, similarity_score, distance_meters), or
    (None, 0.0, None) if nothing qualifies.
    """
    best_id, best_score, best_distance = None, 0.0, None

    for c in candidates:
        distance = haversine_distance_meters(new_lat, new_lon, c["latitude"], c["longitude"])
        if distance > distance_threshold:
            continue  # too far apart - skip similarity check entirely

        score = cosine_similarity(new_embedding, c["embedding"])
        if score >= similarity_threshold and score > best_score:
            best_id, best_score, best_distance = c["_id"], score, distance

    return best_id, best_score, best_distance
