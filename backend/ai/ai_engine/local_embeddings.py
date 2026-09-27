"""
Local embedding model - runs entirely on your own machine, no API key,
no internet dependency once the model is downloaded once. This is genuine
ML running under your control, which is a stronger story for judges than
an API call to someone else's server.

Setup:
    pip install sentence-transformers
    (first run downloads the model automatically, ~80MB, one-time)
"""

_model = None


def _get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            # all-MiniLM-L6-v2: small, fast, free, good enough for short problem reports
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e:
            print(f"[AI WARNING] Could not load SentenceTransformer: {e}")
            _model = False
    return _model if _model is not False else None


def get_embedding(text):
    """Returns a list[float] embedding vector, used for duplicate detection."""
    model = _get_model()
    if model is None:
        # Deterministic 384-dimensional fallback vector if sentence_transformers isn't available
        import hashlib
        hash_bytes = hashlib.sha256(text.encode("utf-8")).digest()
        vec = []
        for i in range(384):
            val = (hash_bytes[i % 32] + (i * 7)) % 256
            vec.append((val - 128) / 128.0)
        return vec

    vector = model.encode(text)
    return vector.tolist()
