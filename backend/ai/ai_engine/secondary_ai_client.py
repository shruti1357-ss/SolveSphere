"""
Secondary AI classification tier - kicks in automatically if the primary
tier fails or rate-limits (see providers.py).

[Internal note - not for sharing outside this file: this tier calls Groq's
API, model "openai/gpt-oss-120b". Filename and variable names are
deliberately generic so this detail stays contained to this one file.]

WHY THIS FILE CHANGED (Sept 2026):
- Groq decommissioned llama-3.3-70b-versatile on Aug 16, 2026; replaced
  with "openai/gpt-oss-120b".

Setup:
    pip install groq
    Get a free key at https://console.groq.com/keys
    set SECONDARY_AI_API_KEY=your_key   (Windows CMD)
"""

import os
import json
from dotenv import load_dotenv

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    Groq = None
    GROQ_AVAILABLE = False

from .prompts import build_prompt

# Load backend/.env directly
backend_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
if os.path.exists(backend_env):
    load_dotenv(backend_env)
else:
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

MODEL_NAME = "openai/gpt-oss-120b"

_client = None


def _get_client():
    global _client
    if not GROQ_AVAILABLE:
        raise ImportError("groq package is not installed.")
    if _client is None:
        # Explicit timeout so a slow/hanging request fails fast instead of
        # blocking the fallback chain for minutes.
        api_key = os.environ.get("SECONDARY_AI_API_KEY", "")
        _client = Groq(api_key=api_key, timeout=15.0)
    return _client


def analyze_challenge(title, description, location="", evidence=None):
    """Returns a dict, or raises if this tier fails (caller handles fallback)."""
    prompt = build_prompt(title, description, location, evidence)
    client = _get_client()
    completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )
    data = json.loads(completion.choices[0].message.content)
    data.setdefault("priority_score", 50)
    data.setdefault("severity_score", 5.0)
    data.setdefault("required_skills", ["general"])
    return data
