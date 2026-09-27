from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from mongodb_config import MongoSolution, MongoChallenge, Milestone


def milestone_to_dict(milestone):
    return {
        "title": getattr(milestone, "title", ""),
        "status": getattr(milestone, "status", "PENDING"),
        "proof_url": getattr(milestone, "proof_url", "")
    }


def solution_to_dict(solution):
    return {
        "id": str(solution.id),
        "challenge_id": solution.challenge_id,
        "team_name": solution.team_name,
        "university_name": solution.university_name,
        "department": solution.department,
        "faculty_mentor": solution.faculty_mentor,
        "student_leader": solution.student_leader,
        "proposal_summary": solution.proposal_summary,
        "milestones": [
            milestone_to_dict(m)
            for m in (solution.milestones or [])
        ],
        "csr_partner": solution.csr_partner,
        "csr_grant_amount": solution.csr_grant_amount,
        "status": solution.status,
        "created_at": solution.created_at,
    }


def update_challenge_status(challenge_id):
    """
    MongoDB is the primary source for challenge status.
    Supports MongoDB ObjectId strings, problem_id strings, and numeric IDs.
    """
    if not challenge_id:
        return
    try:
        challenge = None
        # Try Mongo lookup by ObjectId or string id
        try:
            challenge = MongoChallenge.objects(id=str(challenge_id)).first()
        except Exception:
            challenge = None

        # Fallback: lookup by problem_id if not found by id
        if not challenge:
            try:
                challenge = MongoChallenge.objects(problem_id=str(challenge_id)).first()
            except Exception:
                challenge = None

        if challenge:
            if challenge.status in ["OPEN", "ASSIGNED_TO_HEI"]:
                challenge.status = "IN_PROGRESS"
                challenge.save()

    except Exception as e:
        print(f"[MONGODB CHALLENGE STATUS WARNING] {e}")


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def solution_list_create(request):

    # ==========================================================
    # GET - READ FROM MONGODB
    # ==========================================================
    if request.method == 'GET':

        challenge_id = request.query_params.get('challenge_id')
        university = request.query_params.get('university')
        status_filter = request.query_params.get('status')

        queryset = MongoSolution.objects.order_by("-created_at")

        if challenge_id:
            queryset = queryset.filter(challenge_id=str(challenge_id))

        if university:
            queryset = queryset.filter(
                university_name__icontains=university
            )

        if status_filter:
            queryset = queryset.filter(
                status__iexact=status_filter
            )

        results = [
            solution_to_dict(solution)
            for solution in queryset
        ]

        return Response({
            "count": len(results),
            "results": results
        }, status=status.HTTP_200_OK)

    # ==========================================================
    # POST - CREATE IN MONGODB
    # ==========================================================
    elif request.method == 'POST':

        data = request.data

        required_fields = [
            "challenge_id",
            "team_name",
            "faculty_mentor",
            "student_leader",
            "proposal_summary"
        ]

        missing_fields = [
            field for field in required_fields
            if not data.get(field)
        ]

        if missing_fields:
            return Response(
                {
                    "error": "Required fields are missing",
                    "missing_fields": missing_fields
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            solution = MongoSolution(
                challenge_id=str(data.get("challenge_id")),
                team_name=data.get("team_name"),
                university_name=data.get(
                    "university_name",
                    "BIT Mesra"
                ),
                department=data.get(
                    "department",
                    "Computer Science Engineering"
                ),
                faculty_mentor=data.get("faculty_mentor"),
                student_leader=data.get("student_leader"),
                proposal_summary=data.get("proposal_summary"),
                milestones=data.get("milestones", []),
                csr_partner=data.get("csr_partner", ""),
                csr_grant_amount=float(
                    data.get("csr_grant_amount", 0.0)
                ),
                status=data.get("status", "PROPOSED")
            )

            solution.save()

            print(
                f"[MONGODB] Solution created in MongoDB Atlas: "
                f"{solution.id}"
            )

            # Update corresponding challenge in MongoDB
            update_challenge_status(solution.challenge_id)

            return Response(
                solution_to_dict(solution),
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            print(f"[MONGODB SOLUTION CREATE ERROR] {e}")

            return Response(
                {
                    "error": "Failed to create solution",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==============================================================
# SOLUTION DETAIL
# ==============================================================

@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([permissions.AllowAny])
def solution_detail(request, pk):

    try:
        solution = MongoSolution.objects(id=pk).first()

    except Exception:
        solution = None

    if not solution:
        return Response(
            {"error": "Solution proposal not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # ==========================================================
    # GET
    # ==========================================================

    if request.method == 'GET':

        return Response(
            solution_to_dict(solution),
            status=status.HTTP_200_OK
        )

    # ==========================================================
    # PUT / PATCH
    # ==========================================================

    elif request.method in ['PUT', 'PATCH']:

        data = request.data

        try:

            if "challenge_id" in data:
                solution.challenge_id = str(data["challenge_id"])

            if "team_name" in data:
                solution.team_name = data["team_name"]

            if "university_name" in data:
                solution.university_name = data["university_name"]

            if "department" in data:
                solution.department = data["department"]

            if "faculty_mentor" in data:
                solution.faculty_mentor = data["faculty_mentor"]

            if "student_leader" in data:
                solution.student_leader = data["student_leader"]

            if "proposal_summary" in data:
                solution.proposal_summary = data["proposal_summary"]

            if "milestones" in data:
                solution.milestones = data["milestones"]

            if "csr_partner" in data:
                solution.csr_partner = data["csr_partner"]

            if "csr_grant_amount" in data:
                solution.csr_grant_amount = float(
                    data["csr_grant_amount"]
                )

            if "status" in data:
                solution.status = data["status"]

            solution.save()

            return Response(
                solution_to_dict(solution),
                status=status.HTTP_200_OK
            )

        except Exception as e:

            return Response(
                {
                    "error": "Failed to update solution",
                    "details": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )


# ==============================================================
# ADD MILESTONE
# ==============================================================

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def add_milestone(request, pk):

    try:
        solution = MongoSolution.objects(id=pk).first()

    except Exception:
        solution = None

    if not solution:
        return Response(
            {"error": "Solution proposal not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    milestone_title = request.data.get("title")
    milestone_status = request.data.get("status", "PENDING")
    proof_url = request.data.get("proof_url", "")

    if not milestone_title:
        return Response(
            {"error": "Milestone title is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        current_milestones = solution.milestones or []

        current_milestones.append(
          Milestone(
            title=milestone_title,
            status=milestone_status,
            proof_url=proof_url
        )

     )

        solution.milestones = current_milestones
        solution.save()

        return Response(
            solution_to_dict(solution),
            status=status.HTTP_200_OK
        )

    except Exception as e:

        return Response(
            {
                "error": "Failed to add milestone",
                "details": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==============================================================
# CSR GRANT
# ==============================================================

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def pledge_csr_grant(request, pk):

    try:
        solution = MongoSolution.objects(id=pk).first()

    except Exception:
        solution = None

    if not solution:
        return Response(
            {"error": "Solution proposal not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    csr_partner = request.data.get("csr_partner")
    amount = request.data.get("amount")

    if not csr_partner or amount is None:
        return Response(
            {
                "error": "csr_partner and amount are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        solution.csr_partner = csr_partner
        solution.csr_grant_amount = float(amount)
        solution.save()

        return Response(
            solution_to_dict(solution),
            status=status.HTTP_200_OK
        )

    except Exception as e:

        return Response(
            {
                "error": "Failed to pledge CSR grant",
                "details": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )
