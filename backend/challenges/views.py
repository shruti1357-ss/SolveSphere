from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import math

from mongodb_config import MongoChallenge


def challenge_to_dict(challenge):
    """
    Convert MongoChallenge into the JSON structure expected by the API.
    """
    coordinates = challenge.location.get("coordinates", [85.3096, 23.3441])

    lng = coordinates[0] if len(coordinates) > 0 else 85.3096
    lat = coordinates[1] if len(coordinates) > 1 else 23.3441

    return {
        "id": str(challenge.id),
        "problem_id": challenge.problem_id,
        "title": challenge.title,
        "description": challenge.description,
        "category": challenge.category,
        "district": challenge.district,
        "block": challenge.block,
        "village": challenge.village,
        "pin_code": challenge.pin_code,
        "latitude": lat,
        "longitude": lng,
        "location": challenge.location,
        "status": challenge.status,
        "priority": challenge.priority,
        "urgency_score": challenge.urgency_score,
        "required_expertise": challenge.required_expertise,
        "upvotes": challenge.upvotes,
        "citizen_name": challenge.citizen_name,
        "citizen_phone": challenge.citizen_phone,
        "is_anonymous": challenge.is_anonymous,
        "media_urls": challenge.media_urls,
        "assigned_university": challenge.assigned_university,
        "created_at": challenge.created_at,
    }


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def challenge_list_create(request):

    # ==========================================================
    # GET - READ CHALLENGES FROM MONGODB
    # ==========================================================
    if request.method == 'GET':

        district = request.query_params.get('district')
        category = request.query_params.get('category')
        status_filter = request.query_params.get('status')
        search_query = request.query_params.get('search')

        challenges = MongoChallenge.objects.order_by("-created_at")

        if district:
            challenges = challenges.filter(district__iexact=district)

        if category:
            challenges = challenges.filter(category__iexact=category)

        if status_filter:
            challenges = challenges.filter(status__iexact=status_filter)

        results = []

        for challenge in challenges:

            if search_query:
                query = search_query.lower()

                title = (challenge.title or "").lower()
                description = (challenge.description or "").lower()

                if query not in title and query not in description:
                    continue

            results.append(challenge_to_dict(challenge))

        return Response({
            "count": len(results),
            "results": results
        }, status=status.HTTP_200_OK)

    # ==========================================================
    # POST - CREATE CHALLENGE DIRECTLY IN MONGODB
    # ==========================================================
    elif request.method == 'POST':

        data = request.data.copy()

        # ------------------------------------------------------
        # Citizen information
        # ------------------------------------------------------
        if request.user.is_authenticated:

            data['citizen_name'] = (
                f"{request.user.first_name} "
                f"{request.user.last_name}"
            ).strip() or request.user.username

        # ------------------------------------------------------
        # Don't trust these values from frontend
        # ------------------------------------------------------
        data.pop('assigned_university', None)
        data.pop('urgency_score', None)

        # ------------------------------------------------------
        # Generate coordinates
        # ------------------------------------------------------
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        try:
            latitude = float(latitude) if latitude is not None else 23.3441
            longitude = float(longitude) if longitude is not None else 85.3096
        except (TypeError, ValueError):
            latitude = 23.3441
            longitude = 85.3096

        location = data.get("location")

        if not location:
            location = {
                "type": "Point",
                "coordinates": [longitude, latitude]
            }

        # ------------------------------------------------------
        # Generate problem ID
        # ------------------------------------------------------
        if not data.get("problem_id"):

            existing_count = MongoChallenge.objects.count()

            data["problem_id"] = (
                f"CHL-2026-{existing_count + 1:05d}"
            )

        # ------------------------------------------------------
        # Create MongoDB document
        # ------------------------------------------------------
        try:

            from database_service import create_challenge

            challenge_data = {
                "problem_id": data.get("problem_id"),
                "title": data.get("title"),
                "description": data.get("description"),
                "category": data.get(
                    "category",
                    "Water Management"
                ),
                "district": data.get(
                    "district",
                    "Ranchi"
                ),
                "block": data.get("block", ""),
                "village": data.get("village", ""),
                "pin_code": data.get("pin_code", ""),
                "location": location,
                "status": data.get("status", "OPEN"),
                "priority": data.get("priority", "MEDIUM"),
                "required_expertise": data.get(
                    "required_expertise",
                    []
                ),
                "citizen_name": data.get(
                    "citizen_name",
                    "Anonymous"
                ),
                "citizen_phone": data.get(
                    "citizen_phone",
                    ""
                ),
                "is_anonymous": data.get(
                    "is_anonymous",
                    False
                ),
                "media_urls": data.get(
                    "media_urls",
                    []
                ),
            }

            challenge = create_challenge(challenge_data)

            if not challenge:
                return Response(
                    {"error": "Failed to create challenge in MongoDB"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:

            print(f"[MONGODB CREATE ERROR] {e}")

            return Response(
                {
                    "error": "Failed to create challenge",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # ======================================================
        # AI URGENCY ANALYSIS
        # ======================================================
        try:

            from ai_engine.providers import analyze_challenge_robust

            analysis = analyze_challenge_robust(
                title=challenge.title,
                description=challenge.description,
                location=challenge.district,
                verbose=False
            )

            challenge.urgency_score = analysis.get(
                "severity_score",
                5.0
            )

            challenge.save()

        except Exception as ai_err:

            print(
                f"[AI Urgency Calculation Warning]: {ai_err}"
            )

        # ======================================================
        # EMBEDDING FOR SEMANTIC DEDUPLICATION
        # ======================================================
        try:
            from ai_engine.local_embeddings import get_embedding
            from ai_services.embeddings_store import save_embedding

            embedding = get_embedding(
            f"{challenge.title} {challenge.description}"
         )

            save_embedding(
            str(challenge.id),
            embedding,
            latitude,
            longitude
            )

        except Exception as emb_err:
           print(
              f"[Embedding Store Warning]: {emb_err}"
    )

        return Response(
            challenge_to_dict(challenge),
            status=status.HTTP_201_CREATED
        )


# ==============================================================
# CHALLENGE DETAIL
# ==============================================================

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.AllowAny])
def challenge_detail(request, pk):

    try:

        challenge = MongoChallenge.objects.get(id=pk)

    except Exception:

        # Also allow lookup by problem_id
        try:
            challenge = MongoChallenge.objects.get(
                problem_id=pk
            )
        except Exception:
            return Response(
                {"error": "Challenge not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    # ----------------------------------------------------------
    # GET
    # ----------------------------------------------------------
    if request.method == 'GET':

        return Response(
            challenge_to_dict(challenge)
        )

    # ----------------------------------------------------------
    # PUT
    # ----------------------------------------------------------
    elif request.method == 'PUT':

        data = request.data.copy()

        # Don't allow frontend to overwrite AI-controlled fields
        data.pop("urgency_score", None)

        allowed_fields = [
            "title",
            "description",
            "category",
            "district",
            "block",
            "village",
            "pin_code",
            "status",
            "priority",
            "required_expertise",
            "citizen_name",
            "citizen_phone",
            "is_anonymous",
            "media_urls",
        ]

        for field in allowed_fields:

            if field in data:
                setattr(
                    challenge,
                    field,
                    data[field]
                )

        # Update location if coordinates were provided
        if "latitude" in data or "longitude" in data:

            current_coordinates = challenge.location.get(
                "coordinates",
                [85.3096, 23.3441]
            )

            longitude = data.get(
                "longitude",
                current_coordinates[0]
            )

            latitude = data.get(
                "latitude",
                current_coordinates[1]
            )

            challenge.location = {
                "type": "Point",
                "coordinates": [
                    float(longitude),
                    float(latitude)
                ]
            }

        challenge.save()

        return Response(
            challenge_to_dict(challenge)
        )

    # ----------------------------------------------------------
    # DELETE
    # ----------------------------------------------------------
    elif request.method == 'DELETE':

        challenge.delete()

        return Response(
            {"message": "Challenge deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# ==============================================================
# UPVOTE
# ==============================================================

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def upvote_challenge(request, pk):

    try:

        challenge = MongoChallenge.objects.get(id=pk)

    except Exception:

        try:
            challenge = MongoChallenge.objects.get(
                problem_id=pk
            )
        except Exception:

            return Response(
                {"error": "Challenge not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    challenge.upvotes += 1
    challenge.save()

    return Response({
        "id": str(challenge.id),
        "problem_id": challenge.problem_id,
        "upvotes": challenge.upvotes
    })


# ==============================================================
# NEARBY CHALLENGES
# ==============================================================

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def nearby_challenges(request):

    try:

        lat = float(
            request.query_params.get(
                'lat',
                23.3441
            )
        )

        lng = float(
            request.query_params.get(
                'lng',
                85.3096
            )
        )

        radius_km = float(
            request.query_params.get(
                'radius',
                15.0
            )
        )

    except ValueError:

        return Response(
            {
                "error":
                "Invalid coordinates or radius parameter"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def haversine(lat1, lon1, lat2, lon2):

        R = 6371.0

        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)

        a = (
            math.sin(dlat / 2) ** 2
            +
            math.cos(math.radians(lat1))
            *
            math.cos(math.radians(lat2))
            *
            math.sin(dlon / 2) ** 2
        )

        c = 2 * math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a)
        )

        return R * c

    all_challenges = MongoChallenge.objects.all()

    nearby_list = []

    for challenge in all_challenges:

        coordinates = challenge.location.get(
            "coordinates",
            [85.3096, 23.3441]
        )

        challenge_lng = coordinates[0]
        challenge_lat = coordinates[1]

        distance = haversine(
            lat,
            lng,
            challenge_lat,
            challenge_lng
        )

        if distance <= radius_km:

            result = challenge_to_dict(challenge)

            result["distance_km"] = round(
                distance,
                2
            )

            nearby_list.append(result)

    nearby_list.sort(
        key=lambda x: x["distance_km"]
    )

    return Response({
        "center": {
            "lat": lat,
            "lng": lng
        },
        "radius_km": radius_km,
        "count": len(nearby_list),
        "results": nearby_list
    })


# ==============================================================
# ASSIGN UNIVERSITY
# ==============================================================

@api_view(['PATCH'])
@permission_classes([permissions.AllowAny])
def assign_university(request, pk):

    university = request.data.get(
        "university_name"
    )

    if not university:

        return Response(
            {
                "error":
                "university_name is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        challenge = MongoChallenge.objects.get(
            id=pk
        )

    except Exception:

        try:
            challenge = MongoChallenge.objects.get(
                problem_id=pk
            )
        except Exception:

            return Response(
                {"error": "Challenge not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    challenge.assigned_university = university
    challenge.status = "ASSIGNED_TO_HEI"
    challenge.save()

    return Response(
        challenge_to_dict(challenge)
    )