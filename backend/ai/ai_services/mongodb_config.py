"""
Single shared MongoDB connection for SolveSphere. Import `get_challenges_collection()`
(or `get_db()`) from here everywhere instead of creating new MongoClient
instances - one client per process is enough and avoids connection-pool
exhaustion.

Reads MONGO_URI from ai_engine/.env directly via python-dotenv, rather than
relying on it being set in the Windows environment via setx/set - this
avoids CMD's special handling of characters like '&' (e.g. in
retryWrites=true&w=majority), which silently breaks values passed through
setx. Works with either a local MongoDB (mongodb://localhost:27017/...) or
MongoDB Atlas (mongodb+srv://user:pass@cluster.../...) with no code
changes - only the value in .env needs to change.
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


def get_client():
    global _client
    if _client is None:
        mongo_uri = os.environ.get("MONGO_URI")
        if not mongo_uri:
            raise RuntimeError(
                "MONGO_URI is not set. Run: setx MONGO_URI \"your_connection_string\" "
                "then open a NEW Command Prompt window before running manage.py."
            )
        _client = MongoClient(mongo_uri)
    return _client


def get_db():
    return get_client()["solvesphere_db"]


def get_challenges_collection():
    return get_db()["challenges"]
