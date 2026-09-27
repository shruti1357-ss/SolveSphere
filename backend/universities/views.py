from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import (
    UniversityProfile,
    Faculty,
    UniversityProject,
    ProjectTeamMember,
    ProjectMilestone,
    CollaborationRequest,
    ProjectReport,
    UniversityNotification,
)
from .serializers import (
    UniversityProfileSerializer,
    FacultySerializer,
    UniversityProjectSerializer,
    ProjectTeamMemberSerializer,
    ProjectMilestoneSerializer,
    CollaborationRequestSerializer,
    ProjectReportSerializer,
    UniversityNotificationSerializer,
)
from challenges.models import Challenge
from challenges.serializers import ChallengeDetailSerializer
from ai.ai_engine.match_calculator import calculate_university_match
from mongodb_config import (
    MongoChallenge,
    MongoUniversityProfile,
    MongoUniversityProject,
    MongoIndustryCollaborationWorkspace
)


def _serialize_mongo_challenge(c):
    lat = 23.3441
    lon = 85.3096
    if c.location and 'coordinates' in c.location:
        lon, lat = c.location['coordinates'][0], c.location['coordinates'][1]
    return {
        "id": str(c.id),
        "problem_id": c.problem_id or f"CHL-2026-{str(c.id)[-5:]}",
        "title": c.title,
        "description": c.description,
        "category": c.category,
        "district": c.district,
        "block": getattr(c, 'block', ''),
        "village": getattr(c, 'village', ''),
        "pin_code": getattr(c, 'pin_code', ''),
        "latitude": lat,
        "longitude": lon,
        "status": c.status,
        "priority": c.priority,
        "urgency_score": c.urgency_score,
        "required_expertise": getattr(c, 'required_expertise', []),
        "upvotes": getattr(c, 'upvotes', 0),
        "citizen_name": getattr(c, 'citizen_name', 'Anonymous'),
        "assigned_university": getattr(c, 'assigned_university', None),
        "created_at": c.created_at.isoformat() if hasattr(c, 'created_at') and c.created_at else ""
    }


def _find_challenge_for_uni(pk):
    mongo_c = None
    sql_c = None
    str_pk = str(pk).strip()

    if len(str_pk) == 24:
        try:
            from bson import ObjectId
            mongo_c = MongoChallenge.objects(id=ObjectId(str_pk)).first()
        except Exception:
            mongo_c = None

    if not mongo_c:
        try:
            mongo_c = MongoChallenge.objects(problem_id=str_pk).first()
        except Exception:
            pass

    if not mongo_c:
        try:
            mongo_c = MongoChallenge.objects(id=str_pk).first()
        except Exception:
            pass

    if str_pk.isdigit():
        try:
            sql_c = Challenge.objects.filter(pk=int(str_pk)).first()
        except Exception:
            pass
    if not sql_c:
        sql_c = Challenge.objects.filter(problem_id=str_pk).first()

    return mongo_c, sql_c


# Helper function to get logged in university profile
def _get_user_university(request):
    if not request.user.is_authenticated:
        return None
    try:
        return request.user.university_profile
    except UniversityProfile.DoesNotExist:
        # Fallback for dev testing if user is authenticated with university role
        return UniversityProfile.objects.first()


# ==============================================================================
# 1. UNIVERSITY PROFILE ENDPOINTS
# ==============================================================================
@api_view(['GET', 'PUT'])
@permission_classes([permissions.AllowAny])
def university_profile_view(request):
    uni = _get_user_university(request)
    if not uni:
        uni = UniversityProfile.objects.first()
        if not uni:
            return Response({"error": "No university profile found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UniversityProfileSerializer(uni)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UniversityProfileSerializer(uni, data=request.data, partial=True)
        if serializer.is_valid():
            profile = serializer.save()
            return Response(UniversityProfileSerializer(profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==============================================================================
# 2. UNIVERSITY CHALLENGES & AI MATCH SCORE FEED
# ==============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def university_challenges(request):
    """
    Returns available challenges annotated with live AI Match Score (%) based on
    University expertise and departments.
    MongoDB Atlas is primary source of truth.
    """
    uni = _get_user_university(request) or UniversityProfile.objects.first()

    domain = request.query_params.get('domain')
    district = request.query_params.get('district')
    search = request.query_params.get('search')

    mongo_challenges = []
    try:
        qs = MongoChallenge.objects(status__ne='RESOLVED').order_by('-created_at')
        if domain:
            qs = qs.filter(category__icontains=domain)
        if district:
            qs = qs.filter(district__iexact=district)
        if search:
            qs = qs.filter(title__icontains=search)
        mongo_challenges = list(qs)
    except Exception as e:
        print(f"[MONGODB UNI CHALLENGES WARNING] {e}")

    results = []
    if mongo_challenges:
        for challenge in mongo_challenges:
            c_data = _serialize_mongo_challenge(challenge)
            if uni:
                match_info = calculate_university_match(challenge, uni)
                c_data['match_score'] = match_info['match_score']
                c_data['matching_capabilities'] = match_info['matching_tags']
            else:
                c_data['match_score'] = 85
                c_data['matching_capabilities'] = ["General Expertise"]
            results.append(c_data)
    else:
        queryset = Challenge.objects.exclude(status='RESOLVED')
        if domain:
            queryset = queryset.filter(category__icontains=domain)
        if district:
            queryset = queryset.filter(district__iexact=district)
        if search:
            queryset = queryset.filter(title__icontains=search)

        for challenge in queryset:
            c_data = ChallengeDetailSerializer(challenge).data
            if uni:
                match_info = calculate_university_match(challenge, uni)
                c_data['match_score'] = match_info['match_score']
                c_data['matching_capabilities'] = match_info['matching_tags']
            else:
                c_data['match_score'] = 85
                c_data['matching_capabilities'] = ["General Expertise"]
            results.append(c_data)

    # Sort by AI Match Score descending
    results.sort(key=lambda x: x['match_score'], reverse=True)

    return Response({
        "university": uni.university_name if uni else "Portal Guest",
        "count": len(results),
        "challenges": results
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def university_challenge_detail(request, pk):
    mongo_c, sql_c = _find_challenge_for_uni(pk)
    if not mongo_c and not sql_c:
        return Response({"error": "Challenge not found"}, status=status.HTTP_404_NOT_FOUND)

    uni = _get_user_university(request) or UniversityProfile.objects.first()
    if mongo_c:
        c_data = _serialize_mongo_challenge(mongo_c)
        if uni:
            match_info = calculate_university_match(mongo_c, uni)
            c_data['match_score'] = match_info['match_score']
            c_data['matching_capabilities'] = match_info['matching_tags']
        else:
            c_data['match_score'] = 88
            c_data['matching_capabilities'] = ["AI/ML"]
    else:
        c_data = ChallengeDetailSerializer(sql_c).data
        if uni:
            match_info = calculate_university_match(sql_c, uni)
            c_data['match_score'] = match_info['match_score']
            c_data['matching_capabilities'] = match_info['matching_tags']
        else:
            c_data['match_score'] = 88
            c_data['matching_capabilities'] = ["AI/ML"]

    return Response(c_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def accept_challenge(request, pk):
    """
    University Accepts Challenge -> updates status to ASSIGNED_TO_HEI
    MongoDB Atlas is primary source of truth.
    """
    mongo_c, sql_c = _find_challenge_for_uni(pk)
    if not mongo_c and not sql_c:
        return Response({"error": "Challenge not found"}, status=status.HTTP_404_NOT_FOUND)

    uni = _get_user_university(request) or UniversityProfile.objects.first()
    uni_name = uni.university_name if uni else request.data.get('university_name', 'XYZ University')

    if mongo_c:
        mongo_c.assigned_university = uni_name
        mongo_c.status = 'ASSIGNED_TO_HEI'
        mongo_c.save()

    if sql_c:
        sql_c.assigned_university = uni_name
        sql_c.status = 'ASSIGNED_TO_HEI'
        sql_c.save()

    # Update MongoDB Atlas tracking_milestones stage 4
    prob_id = (getattr(mongo_c, 'problem_id', None) if mongo_c else None) or (getattr(sql_c, 'problem_id', None) if sql_c else None) or str(pk)
    try:
        from ai.ai_services.mongodb_config import get_db
        db = get_db()
        db["tracking_milestones"].update_one(
            {"problem_id": prob_id},
            {
                "$set": {
                    "assigned_university": uni_name,
                    "milestones.$[elem].status": "COMPLETED",
                    "milestones.$[elem].completed_date": "Just now"
                }
            },
            array_filters=[{"elem.stage_number": 4}],
            upsert=False
        )
    except Exception:
        pass

    if uni:
        try:
            UniversityNotification.objects.create(
                university=uni,
                title="Challenge Accepted",
                message=f"Your university accepted Challenge '{getattr(mongo_c, 'title', None) or getattr(sql_c, 'title', '')}'. You can now create a project.",
                notification_type="CHALLENGE_ACCEPTED"
            )
        except Exception:
            pass

    c_id = str(mongo_c.id) if mongo_c else sql_c.id
    assigned_u = getattr(mongo_c, 'assigned_university', uni_name) if mongo_c else sql_c.assigned_university
    st = getattr(mongo_c, 'status', 'ASSIGNED_TO_HEI') if mongo_c else sql_c.status

    return Response({
        "message": f"Challenge accepted successfully by {uni_name}",
        "challenge_id": c_id,
        "assigned_university": assigned_u,
        "status": st,
        "next_step": "Create Project via POST /api/university/projects/"
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def decline_challenge(request, pk):
    return Response({"message": f"Challenge #{pk} declined."}, status=status.HTTP_200_OK)


# ==============================================================================
# 3. UNIVERSITY PROJECTS & TIMELINE
# ==============================================================================
@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def university_projects(request):
    uni = _get_user_university(request) or UniversityProfile.objects.first()

    if request.method == 'GET':
        # MongoDB Atlas primary
        mongo_projects = []
        try:
            qs = MongoUniversityProject.objects.all().order_by('-created_at')
            if uni:
                uni_id = str(uni.id)
                uni_name = uni.university_name
                qs = qs.filter(university_id__in=[uni_id, uni_name])
            mongo_projects = list(qs)
        except Exception as e:
            print(f"[MONGODB UNI PROJECTS GET WARNING] {e}")

        if mongo_projects:
            results = []
            for p in mongo_projects:
                results.append({
                    "id": str(p.id),
                    "challenge": p.challenge_id,
                    "challenge_title": p.title,
                    "university": uni.id if uni else 1,
                    "university_name": getattr(p, 'university_id', 'University'),
                    "faculty_mentor": None,
                    "title": p.title,
                    "description": p.description,
                    "expected_outcome": p.expected_outcome,
                    "required_skills": p.required_skills,
                    "estimated_duration": p.estimated_duration,
                    "team_size": p.team_size,
                    "status": p.status,
                    "progress_percent": p.progress_percent,
                    "industry_collaboration_status": p.industry_collaboration_status,
                    "active_industry_partner": p.active_industry_partner,
                    "created_at": p.created_at.isoformat() if hasattr(p, 'created_at') and p.created_at else ""
                })
            return Response(results, status=status.HTTP_200_OK)

        # Fallback to SQLite
        projects = UniversityProject.objects.all()
        if uni:
            projects = projects.filter(university=uni)
        serializer = UniversityProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        data = request.data.copy()
        if not uni:
            return Response({"error": "No active university profile found to create project."}, status=status.HTTP_400_BAD_REQUEST)

        challenge_id = data.get('challenge_id') or data.get('challenge')
        if not challenge_id:
            return Response({"error": "challenge_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        mongo_c, sql_c = _find_challenge_for_uni(challenge_id)
        if not mongo_c and not sql_c:
            return Response({"error": "Challenge not found"}, status=status.HTTP_404_NOT_FOUND)

        title = data.get('title', f"R&D Project: {getattr(mongo_c, 'title', None) or getattr(sql_c, 'title', '')}")
        desc = data.get('description', getattr(mongo_c, 'description', None) or getattr(sql_c, 'description', ''))
        skills = data.get('required_skills', getattr(mongo_c, 'required_expertise', []))
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(',') if s.strip()]

        # 1. Create in MongoDB Atlas
        mongo_proj = None
        try:
            mongo_proj = MongoUniversityProject(
                challenge_id=str(getattr(mongo_c, 'problem_id', None) or getattr(mongo_c, 'id', None) or challenge_id),
                university_id=str(uni.university_name),
                title=title,
                description=desc,
                expected_outcome=data.get('expected_outcome', ''),
                required_skills=skills,
                estimated_duration=data.get('estimated_duration', '6 Months'),
                team_size=int(data.get('team_size', 4)),
                status='PROTOTYPE',
                progress_percent=10
            )
            mongo_proj.save()
        except Exception as e:
            print(f"[MONGODB CREATE PROJECT WARNING] {e}")

        # Update MongoChallenge status to IN_PROGRESS
        if mongo_c:
            mongo_c.status = 'IN_PROGRESS'
            mongo_c.save()

        # Update SQLite if challenge exists
        project = None
        if sql_c:
            faculty_id = data.get('faculty_mentor_id') or data.get('faculty_mentor')
            faculty = Faculty.objects.filter(pk=faculty_id).first() if faculty_id else None
            project = UniversityProject.objects.create(
                challenge=sql_c,
                university=uni,
                faculty_mentor=faculty,
                title=title,
                description=desc,
                expected_outcome=data.get('expected_outcome', ''),
                required_skills=skills,
                estimated_duration=data.get('estimated_duration', '6 Months'),
                team_size=int(data.get('team_size', 4)),
                status='PROTOTYPE',
                progress_percent=10
            )
            sql_c.status = 'IN_PROGRESS'
            sql_c.save()

            default_milestones = [
                ("Requirement & Domain Analysis", "COMPLETED", 100),
                ("Literature Review & Research", "COMPLETED", 100),
                ("Dataset & Evidence Collection", "IN_PROGRESS", 40),
                ("Lab Prototype Development", "PENDING", 0),
                ("Testing & Validation", "PENDING", 0),
                ("Field Pilot Deployment", "PENDING", 0),
                ("Impact Measurement", "PENDING", 0)
            ]
            for m_title, m_status, m_prog in default_milestones:
                ProjectMilestone.objects.create(
                    project=project,
                    title=m_title,
                    status=m_status,
                    progress_percent=m_prog
                )

        if project:
            return Response(UniversityProjectSerializer(project).data, status=status.HTTP_201_CREATED)
        elif mongo_proj:
            return Response({
                "id": str(mongo_proj.id),
                "challenge": mongo_proj.challenge_id,
                "title": mongo_proj.title,
                "description": mongo_proj.description,
                "status": mongo_proj.status,
                "progress_percent": mongo_proj.progress_percent,
                "team_size": mongo_proj.team_size
            }, status=status.HTTP_201_CREATED)
        return Response({"error": "Failed to create project"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([permissions.AllowAny])
def university_project_detail(request, pk):
    mongo_proj = None
    str_pk = str(pk).strip()
    try:
        if len(str_pk) == 24:
            from bson import ObjectId
            mongo_proj = MongoUniversityProject.objects(id=ObjectId(str_pk)).first()
        if not mongo_proj:
            mongo_proj = MongoUniversityProject.objects(id=str_pk).first()
    except Exception:
        pass

    sql_proj = None
    if str_pk.isdigit():
        sql_proj = UniversityProject.objects.filter(pk=int(str_pk)).first()

    if not mongo_proj and not sql_proj:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if sql_proj:
            return Response(UniversityProjectSerializer(sql_proj).data)
        return Response({
            "id": str(mongo_proj.id),
            "challenge": mongo_proj.challenge_id,
            "title": mongo_proj.title,
            "description": mongo_proj.description,
            "expected_outcome": mongo_proj.expected_outcome,
            "required_skills": mongo_proj.required_skills,
            "estimated_duration": mongo_proj.estimated_duration,
            "team_size": mongo_proj.team_size,
            "status": mongo_proj.status,
            "progress_percent": mongo_proj.progress_percent,
            "industry_collaboration_status": mongo_proj.industry_collaboration_status,
            "active_industry_partner": mongo_proj.active_industry_partner,
            "created_at": mongo_proj.created_at.isoformat() if hasattr(mongo_proj, 'created_at') and mongo_proj.created_at else ""
        })

    elif request.method == 'PUT':
        if mongo_proj:
            for field in ['title', 'description', 'expected_outcome', 'estimated_duration', 'status']:
                if field in request.data:
                    setattr(mongo_proj, field, request.data[field])
            if 'team_size' in request.data:
                mongo_proj.team_size = int(request.data['team_size'])
            if 'progress_percent' in request.data:
                mongo_proj.progress_percent = int(request.data['progress_percent'])
            mongo_proj.save()

        if sql_proj:
            serializer = UniversityProjectSerializer(sql_proj, data=request.data, partial=True)
            if serializer.is_valid():
                p = serializer.save()
                return Response(UniversityProjectSerializer(p).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "id": str(mongo_proj.id),
            "title": mongo_proj.title,
            "status": mongo_proj.status,
            "progress_percent": mongo_proj.progress_percent
        }, status=status.HTTP_200_OK)


# ==============================================================================
# 4. FACULTY & TEAM MEMBERS
# ==============================================================================
@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def faculty_list_create(request):
    uni = _get_user_university(request) or UniversityProfile.objects.first()

    if request.method == 'GET':
        members = Faculty.objects.all()
        if uni:
            members = members.filter(university=uni)
        serializer = FacultySerializer(members, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not uni:
            return Response({"error": "No university profile found"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FacultySerializer(data=request.data)
        if serializer.is_valid():
            f = serializer.save(university=uni)
            return Response(FacultySerializer(f).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def project_team_list_create(request, pk):
    try:
        project = UniversityProject.objects.get(pk=pk)
    except UniversityProject.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        members = project.team_members.all()
        return Response(ProjectTeamMemberSerializer(members, many=True).data)

    elif request.method == 'POST':
        serializer = ProjectTeamMemberSerializer(data=request.data)
        if serializer.is_valid():
            tm = serializer.save(project=project)
            return Response(ProjectTeamMemberSerializer(tm).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([permissions.AllowAny])
def delete_team_member(request, pk, student_id):
    try:
        member = ProjectTeamMember.objects.get(pk=student_id, project_id=pk)
        member.delete()
        return Response({"message": "Team member removed successfully"}, status=status.HTTP_204_NO_CONTENT)
    except ProjectTeamMember.DoesNotExist:
        return Response({"error": "Team member not found"}, status=status.HTTP_404_NOT_FOUND)


# ==============================================================================
# 5. PROJECT MILESTONES & EVIDENCE UPLOAD
# ==============================================================================
@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def project_milestones_view(request, pk):
    try:
        project = UniversityProject.objects.get(pk=pk)
    except UniversityProject.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        milestones = project.milestones.all().order_by('id')
        return Response(ProjectMilestoneSerializer(milestones, many=True).data)

    elif request.method == 'POST':
        serializer = ProjectMilestoneSerializer(data=request.data)
        if serializer.is_valid():
            m = serializer.save(project=project)
            return Response(ProjectMilestoneSerializer(m).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([permissions.AllowAny])
def update_milestone(request, pk):
    try:
        milestone = ProjectMilestone.objects.get(pk=pk)
    except ProjectMilestone.DoesNotExist:
        return Response({"error": "Milestone not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProjectMilestoneSerializer(milestone, data=request.data, partial=True)
    if serializer.is_valid():
        m = serializer.save()
        # Recalculate project progress
        proj = m.project
        all_m = proj.milestones.all()
        if all_m.exists():
            avg_prog = sum(x.progress_percent for x in all_m) / all_m.count()
            proj.progress_percent = int(avg_prog)
            proj.save()

        return Response(ProjectMilestoneSerializer(m).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==============================================================================
# 6. INDUSTRY COLLABORATION REQUESTS
# ==============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def collaboration_requests(request):
    """
    Returns collaboration requests for university.
    MongoDB Atlas is primary source of truth.
    """
    uni = _get_user_university(request) or UniversityProfile.objects.first()
    mongo_collabs = []
    try:
        mongo_collabs = list(MongoIndustryCollaborationWorkspace.objects.all().order_by('-created_at'))
    except Exception as e:
        print(f"[MONGODB COLLABS WARNING] {e}")

    if mongo_collabs:
        results = []
        for c in mongo_collabs:
            results.append({
                "id": str(c.id),
                "project": c.project_id,
                "project_title": f"Project #{c.project_id}",
                "industry_name": c.industry_id,
                "official_email": f"partner@{c.industry_id.lower().replace(' ', '')}.com",
                "collaboration_type": c.collaboration_type,
                "proposed_support": c.proposed_support,
                "expected_duration": c.expected_duration,
                "match_score": c.match_score,
                "status": c.status,
                "message": c.message,
                "created_at": c.created_at.isoformat() if hasattr(c, 'created_at') and c.created_at else ""
            })
        return Response(results, status=status.HTTP_200_OK)

    requests = CollaborationRequest.objects.all()
    if uni:
        requests = requests.filter(project__university=uni)
    return Response(CollaborationRequestSerializer(requests, many=True).data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def accept_collaboration(request, pk):
    str_pk = str(pk).strip()
    mongo_c = None
    try:
        if len(str_pk) == 24:
            from bson import ObjectId
            mongo_c = MongoIndustryCollaborationWorkspace.objects(id=ObjectId(str_pk)).first()
        if not mongo_c:
            mongo_c = MongoIndustryCollaborationWorkspace.objects(id=str_pk).first()
    except Exception:
        pass

    if mongo_c:
        mongo_c.status = 'ACCEPTED'
        mongo_c.save()
        try:
            proj = MongoUniversityProject.objects(id=mongo_c.project_id).first()
            if proj:
                proj.industry_collaboration_status = 'ACTIVE'
                proj.active_industry_partner = mongo_c.industry_id
                proj.save()
        except Exception:
            pass
        return Response({
            "message": f"Collaboration request from {mongo_c.industry_id} accepted!",
            "project_id": mongo_c.project_id,
            "collaboration_status": "ACTIVE"
        }, status=status.HTTP_200_OK)

    try:
        req = CollaborationRequest.objects.get(pk=pk)
        req.status = 'ACCEPTED'
        req.save()

        project = req.project
        project.industry_collaboration_status = 'ACTIVE'
        project.active_industry_partner = req.industry_name
        project.save()

        return Response({
            "message": f"Collaboration request from {req.industry_name} accepted!",
            "project_id": project.id,
            "collaboration_status": project.industry_collaboration_status
        }, status=status.HTTP_200_OK)
    except CollaborationRequest.DoesNotExist:
        return Response({"error": "Collaboration request not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reject_collaboration(request, pk):
    str_pk = str(pk).strip()
    mongo_c = None
    try:
        if len(str_pk) == 24:
            from bson import ObjectId
            mongo_c = MongoIndustryCollaborationWorkspace.objects(id=ObjectId(str_pk)).first()
        if not mongo_c:
            mongo_c = MongoIndustryCollaborationWorkspace.objects(id=str_pk).first()
    except Exception:
        pass

    if mongo_c:
        mongo_c.status = 'REJECTED'
        mongo_c.save()
        return Response({"message": "Collaboration request rejected."}, status=status.HTTP_200_OK)

    try:
        req = CollaborationRequest.objects.get(pk=pk)
        req.status = 'REJECTED'
        req.save()
        return Response({"message": "Collaboration request rejected."}, status=status.HTTP_200_OK)
    except CollaborationRequest.DoesNotExist:
        return Response({"error": "Collaboration request not found"}, status=status.HTTP_404_NOT_FOUND)


# ==============================================================================
# 7. PROGRESS & SOCIAL IMPACT REPORTS
# ==============================================================================
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def submit_progress_report(request, pk):
    try:
        project = UniversityProject.objects.get(pk=pk)
    except UniversityProject.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    content = request.data.get('content', request.data)
    report = ProjectReport.objects.create(
        project=project,
        report_type='PROGRESS',
        title=request.data.get('title', f"Progress Report - {project.title}"),
        content_json=content
    )
    return Response(ProjectReportSerializer(report).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def submit_impact_report(request, pk):
    try:
        project = UniversityProject.objects.get(pk=pk)
    except UniversityProject.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    content = request.data.get('content', request.data)
    report = ProjectReport.objects.create(
        project=project,
        report_type='IMPACT',
        title=request.data.get('title', f"Social Impact Report - {project.title}"),
        content_json=content
    )

    project.status = 'COMPLETED'
    project.save()

    return Response(ProjectReportSerializer(report).data, status=status.HTTP_201_CREATED)


# ==============================================================================
# 8. UNIVERSITY NOTIFICATIONS
# ==============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def university_notifications(request):
    uni = _get_user_university(request) or UniversityProfile.objects.first()
    if not uni:
        return Response([])
    notes = uni.notifications.all().order_by('-created_at')
    return Response(UniversityNotificationSerializer(notes, many=True).data)


@api_view(['PUT'])
@permission_classes([permissions.AllowAny])
def mark_notification_read(request, pk):
    try:
        note = UniversityNotification.objects.get(pk=pk)
        note.is_read = True
        note.save()
        return Response(UniversityNotificationSerializer(note).data)
    except UniversityNotification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)


# ==============================================================================
# 9. GOVERNMENT / ADMIN VERIFICATION ENDPOINTS
# ==============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def admin_pending_universities(request):
    pending = UniversityProfile.objects.filter(verification_status='PENDING')
    return Response(UniversityProfileSerializer(pending, many=True).data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_verify_university(request, pk):
    """
    Govt Admin Approves or Rejects University Registration.
    Payload: {"action": "APPROVE"} or {"action": "REJECT", "rejection_reason": "Invalid email domain"}
    Syncs verification to MongoDB Atlas MongoUniversityProfile.
    """
    action = request.data.get('action', 'APPROVE').upper()
    reason = request.data.get('rejection_reason', 'Domain validation failed')
    str_pk = str(pk).strip()

    # 1. Update MongoDB Atlas MongoUniversityProfile
    mongo_uni = None
    try:
        if len(str_pk) == 24:
            from bson import ObjectId
            mongo_uni = MongoUniversityProfile.objects(id=ObjectId(str_pk)).first()
        if not mongo_uni:
            mongo_uni = MongoUniversityProfile.objects(id=str_pk).first()
        if not mongo_uni:
            mongo_uni = MongoUniversityProfile.objects(user_id=str_pk).first()
        if mongo_uni:
            if action == 'APPROVE':
                mongo_uni.verification_status = 'VERIFIED'
                mongo_uni.account_status = 'ACTIVE'
            else:
                mongo_uni.verification_status = 'REJECTED'
                mongo_uni.account_status = 'INACTIVE'
                mongo_uni.rejection_reason = reason
            mongo_uni.save()
    except Exception as e:
        print(f"[MONGODB UNI VERIFY WARNING] {e}")

    # 2. Update SQLite UniversityProfile
    uni = None
    if str_pk.isdigit():
        uni = UniversityProfile.objects.filter(pk=int(str_pk)).first()
    if not uni and mongo_uni:
        uni = UniversityProfile.objects.filter(official_email=mongo_uni.official_email).first()

    if uni:
        if action == 'APPROVE':
            uni.verification_status = 'VERIFIED'
            uni.account_status = 'ACTIVE'
            uni.save()
            try:
                UniversityNotification.objects.create(
                    university=uni,
                    title="Account Approved",
                    message="Your university account has been verified and approved by Government Admin. You can now log in.",
                    notification_type="SYSTEM"
                )
            except Exception:
                pass
            return Response({
                "message": f"University {uni.university_name} has been APPROVED and activated.",
                "profile": UniversityProfileSerializer(uni).data
            }, status=status.HTTP_200_OK)
        elif action == 'REJECT':
            uni.verification_status = 'REJECTED'
            uni.account_status = 'INACTIVE'
            uni.rejection_reason = reason
            uni.save()
            return Response({
                "message": f"University {uni.university_name} has been REJECTED.",
                "reason": reason,
                "profile": UniversityProfileSerializer(uni).data
            }, status=status.HTTP_200_OK)

    if mongo_uni:
        return Response({
            "message": f"University {mongo_uni.university_name} has been {'APPROVED' if action == 'APPROVE' else 'REJECTED'}.",
            "verification_status": mongo_uni.verification_status
        }, status=status.HTTP_200_OK)

    return Response({"error": "University profile not found"}, status=status.HTTP_404_NOT_FOUND)
