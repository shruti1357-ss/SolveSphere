"""
Primary AI classification tier.
Raises an exception on failure; providers.py catches it and tries the
secondary tier next.

[Internal note - not for sharing outside this file: this tier calls
Google's Gemini API, model "gemini-3.6-flash", via the `google-genai`
package. Filename and variable names are deliberately generic so this
detail stays contained to this one file. If you rename this file again,
also update the import in providers.py.]

WHY THIS FILE CHANGED (Sept 2026):
- The old `google-generativeai` package is end-of-life; replaced with `google-genai`
  and its client.interactions.create() calling style.
- Model name "gemini-2.0-flash" was retired -> now "gemini-3.6-flash". If this one
  is retired later, check https://ai.google.dev/gemini-api/docs/models for the
  current GA Flash model name and swap it into GENERATION_MODEL below.

Setup:
    pip install google-genai
    Get a free key at https://aistudio.google.com/app/apikey
    set PRIMARY_AI_API_KEY=your_key   (Windows CMD)
"""

import os
import json
from dotenv import load_dotenv

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    types = None
    GENAI_AVAILABLE = False

from .prompts import build_prompt

# Reads backend/.env directly - avoids CMD's special handling of characters
# like '&' (e.g. in a MongoDB URI with retryWrites=true&w=majority), which
# breaks values passed through setx/set. Safe to call more than once.
backend_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
if os.path.exists(backend_env):
    load_dotenv(backend_env)
else:
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

GENERATION_MODEL = "gemini-3.6-flash"

# Without this, the SDK's default retry/backoff behavior can hang for
# minutes on a slow connection before giving up - too slow for a fallback
# chain where the secondary tier should take over quickly.
REQUEST_TIMEOUT_MS = 15000

_client = None


def _get_client():
    global _client
    if not GENAI_AVAILABLE:
        raise ImportError("google-genai package is not installed.")
    if _client is None:
        api_key = os.environ.get("PRIMARY_AI_API_KEY", "")
        _client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(timeout=REQUEST_TIMEOUT_MS),
        )
    return _client


def analyze_challenge(title, description, location="", evidence=None):
    """Returns a dict, or raises if this tier fails (caller handles fallback)."""
    prompt = build_prompt(title, description, location, evidence)
    client = _get_client()

    interaction = client.interactions.create(
        model=GENERATION_MODEL,
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
        },
    )

    data = json.loads(interaction.output_text)
    data.setdefault("priority_score", 50)
    data.setdefault("severity_score", 5.0)
    data.setdefault("required_skills", ["general"])
    return data
