"""
Stores embedding vectors for duplicate detection, keyed by the Django
Challenge's integer id (from the SQLite `challenges` app).

This is deliberately separate from the `MongoChallenge` / `MongoUser` schemas
defined in the project's root mongodb_config.py - those aren't wired into any
view yet and the SQLite Challenge model is what's actually live. MongoDB here
is used for exactly one thing: storing vectors, since a relational database
has no native vector field. This matches the "AI context handling" role
described for MongoDB in the project's own architecture notes.

Collection used: "ai_embeddings" (deliberately not "challenges" - avoids any
collision with the collection name your database teammate already uses for
her GeoJSON schema).
"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient
# Load .env from backend root (primary) or ai_engine (fallback)
backend_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
if os.path.exists(backend_env):
    load_dotenv(backend_env)
else:
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "ai_engine", ".env"))

_client = None
COLLECTION_NAME = "ai_embeddings"


def _get_client():
    global _client
    if _client is None:
        mongo_uri = os.environ.get("MONGO_URI")
        if not mongo_uri:
            raise RuntimeError(
                "MONGO_URI is not set. Run: setx MONGO_URI \"your_connection_string\" "
                "then open a NEW Command Prompt window."
            )
        _client = MongoClient(mongo_uri)
    return _client


def _get_collection():
    return _get_client()["solvesphere_db"][COLLECTION_NAME]


def save_embedding(challenge_id, embedding, latitude, longitude):
    """challenge_id: the Django SQLite Challenge's integer id (stored as string)."""
    _get_collection().update_one(
        {"_id": str(challenge_id)},
        {"$set": {"embedding": embedding, "latitude": latitude, "longitude": longitude}},
        upsert=True,
    )


def get_all_embeddings(exclude_challenge_id=None):
    """Returns a list of {"_id", "embedding", "latitude", "longitude"} dicts."""
    query = {}
    if exclude_challenge_id is not None:
        query["_id"] = {"$ne": str(exclude_challenge_id)}
    return list(_get_collection().find(query))
