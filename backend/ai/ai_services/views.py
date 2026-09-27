"""
Real AI implementation for SolveSphere - replaces the mock stubs
(keyword if/elif guessing, random.uniform fake scores, hardcoded
transcripts) that were here as placeholders.

Endpoint contract is UNCHANGED from the placeholder version, so the
frontend doesn't need to change anything:
    POST /api/ai/classify/      body: {title, description}
    POST /api/ai/transcribe/    body: {audio file} (multipart) or {language} for now
    POST /api/ai/deduplicate/   body: {title, description, latitude, longitude, district}

These are STATELESS - none of them require a challenge to already exist in
the database. The frontend calls these to get a live AI prediction, then
submits the final challenge (with predicted_category/urgency_score
pre-filled) to POST /api/challenges/ separately.
"""

import os
import tempfile

from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from challenges.models import Challenge
from ai_engine.providers import analyze_challenge_robust
from ai_engine.local_embeddings import get_embedding
from ai_engine.duplicate_check import find_duplicate
from ai_engine.university_matcher import match_university
from ai_engine.speech_client import transcribe_and_translate
from .embeddings_store import save_embedding, get_all_embeddings


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def classify_problem(request):
    """
    Real AI classification - replaces the keyword if/elif stub.
    Returns the SAME field names the placeholder used, so the frontend
    contract doesn't change: predicted_category, urgency_score,
    suggested_universities, ai_engine.
    """
    title = request.data.get('title', '')
    description = request.data.get('description', '')
    location_text = request.data.get('district', '')

    analysis = analyze_challenge_robust(title=title, description=description, location=location_text)
    universities = match_university(analysis["category"])

    return Response({
        "input_preview": f"{title} {description}"[:100] + "...",
        "predicted_category": analysis["category"],
        "urgency_score": analysis["severity_score"],
        "urgency_label": analysis["severity_label"],
        "suggested_universities": universities,
        "ai_engine": "AI",
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def transcribe_voice(request):
    """
    Real local Whisper-based transcription - replaces the hardcoded
    hindi/santhali/english stub strings.
    Expects a multipart/form-data upload with an "audio" file field.
    """
    audio_file = request.FILES.get('audio')
    if not audio_file:
        return Response({"error": "no 'audio' file in request"}, status=status.HTTP_400_BAD_REQUEST)

    suffix = os.path.splitext(audio_file.name)[1] or ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        for chunk in audio_file.chunks():
            tmp.write(chunk)
        tmp_path = tmp.name

    try:
        result = transcribe_and_translate(tmp_path)
    finally:
        os.remove(tmp_path)

    return Response({
        "detected_language": result["original_language"],
        "transcribed_text": result["translated_text"],
        "confidence": result["confidence_score"],
        "engine": "AI",
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def check_deduplication(request):
    """
    Real spatial + semantic duplicate check - replaces the random.uniform
    fake-similarity stub. Checks the new report's text/location against
    embeddings of EXISTING challenges already saved in SQLite (whose
    embeddings were stored via save_embedding() when they were classified).
    """
    title = request.data.get('title', '')
    description = request.data.get('description', '')
    try:
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
    except (TypeError, ValueError):
        return Response(
            {"error": "latitude and longitude are required and must be numbers"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    new_embedding = get_embedding(f"{title} {description}")
    candidates = get_all_embeddings()

    duplicate_id, similarity, distance_m = find_duplicate(
        candidates, new_embedding, latitude, longitude
    )

    potential_matches = []
    if duplicate_id is not None:
        existing = None
        try:
            from mongodb_config import MongoChallenge
            try:
                existing = MongoChallenge.objects(id=str(duplicate_id)).first()
            except Exception:
                existing = None
            if not existing:
                try:
                    existing = MongoChallenge.objects(problem_id=str(duplicate_id)).first()
                except Exception:
                    existing = None
        except Exception:
            existing = None

        if not existing and str(duplicate_id).isdigit():
            try:
                existing = Challenge.objects.filter(pk=int(duplicate_id)).first()
            except Exception:
                existing = None

        if existing:
            potential_matches.append({
                "id": str(getattr(existing, "id", duplicate_id)),
                "title": getattr(existing, "title", "Duplicate Challenge"),
                "similarity_score": round(similarity, 3),
                "distance_meters": round(distance_m, 1) if distance_m is not None else 0.0,
                "district": getattr(existing, "district", ""),
                "status": getattr(existing, "status", "OPEN"),
            })

    return Response({
        "is_duplicate_detected": len(potential_matches) > 0,
        "match_count": len(potential_matches),
        "potential_matches": potential_matches,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def store_embedding_for_challenge(request):
    """
    NEW endpoint (not in the original stub) - call this once, right after a
    challenge is successfully saved via POST /api/challenges/, so future
    deduplicate/ calls have something to compare against.
    Body: {challenge_id, title, description, latitude, longitude}
    """
    challenge_id = request.data.get('challenge_id')
    title = request.data.get('title', '')
    description = request.data.get('description', '')
    try:
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
    except (TypeError, ValueError):
        return Response(
            {"error": "latitude and longitude are required and must be numbers"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not challenge_id:
        return Response({"error": "challenge_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    embedding = get_embedding(f"{title} {description}")
    save_embedding(challenge_id, embedding, latitude, longitude)

    return Response({"status": "embedding stored", "challenge_id": challenge_id}, status=status.HTTP_200_OK)
