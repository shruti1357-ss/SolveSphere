import datetime
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import (
    IndustryProfile,
    IndustryCollaborationWorkspace,
    IndustryFeedback,
    IndustryNotification,
)
from .serializers import (
    IndustryProfileSerializer,
    IndustryCollaborationWorkspaceSerializer,
    IndustryFeedbackSerializer,
    IndustryNotificationSerializer,
)
from universities.models import UniversityProject, ProjectMilestone, UniversityNotification
from universities.serializers import UniversityProjectSerializer
from ai.ai_engine.industry_match_calculator import calculate_industry_match
from mongodb_config import (
    MongoIndustryProfile,
    MongoUniversityProject,
    MongoIndustryCollaborationWorkspace,
    MongoChallenge,
)
from ai.ai_services.mongodb_config import get_db


# Helper function to get logged in industry profile
def _get_user_industry(request):
    if not request.user.is_authenticated:
        return None
    try:
        return request.user.industry_profile
    except IndustryProfile.DoesNotExist:
        # Fallback for dev testing if user is authenticated with industry role
        return IndustryProfile.objects.first()


def _find_project_for_industry(pk):
    """
    Finds project across MongoDB Atlas and SQLite.
    Returns (mongo_proj, sql_proj)
    """
    mongo_p = None
    sql_p = None
    str_pk = str(pk).strip()

    if len(str_pk) == 24:
        try:
            from bson import ObjectId
            mongo_p = MongoUniversityProject.objects(id=ObjectId(str_pk)).first()
        except Exception:
            mongo_p = None

    if not mongo_p:
        try:
            mongo_p = MongoUniversityProject.objects(id=str_pk).first()
        except Exception:
            pass

    if str_pk.isdigit():
        try:
            sql_p = UniversityProject.objects.filter(pk=int(str_pk)).first()
        except Exception:
            pass

    return mongo_p, sql_p


def _find_collaboration(pk):
    """
    Finds collaboration workspace across MongoDB Atlas and SQLite.
    Returns (mongo_collab, sql_collab)
    """
    mongo_c = None
    sql_c = None
    str_pk = str(pk).strip()

    if len(str_pk) == 24:
        try:
            from bson import ObjectId
            mongo_c = MongoIndustryCollaborationWorkspace.objects(id=ObjectId(str_pk)).first()
        except Exception:
            mongo_c = None

    if not mongo_c:
        try:
            mongo_c = MongoIndustryCollaborationWorkspace.objects(id=str_pk).first()
        except Exception:
            pass

    if str_pk.isdigit():
        try:
            sql_c = IndustryCollaborationWorkspace.objects.filter(pk=int(str_pk)).first()
        except Exception:
            pass

    return mongo_c, sql_c


def _serialize_mongo_project_for_industry(proj, ind):
    """
    Serializes a MongoUniversityProject for industry endpoints,
    stripping citizen private details and calculating match scores.
    """
    c_detail = None
    try:
        from bson import ObjectId
        cid = str(proj.challenge_id).strip()
        mongo_c = None
        if len(cid) == 24:
            try:
                mongo_c = MongoChallenge.objects(id=ObjectId(cid)).first()
            except Exception:
                pass
        if not mongo_c:
            mongo_c = MongoChallenge.objects(problem_id=cid).first()
        if not mongo_c:
            mongo_c = MongoChallenge.objects(id=cid).first()

        if mongo_c:
            lat = 23.3441
            lon = 85.3096
            if mongo_c.location and 'coordinates' in mongo_c.location:
                lon, lat = mongo_c.location['coordinates'][0], mongo_c.location['coordinates'][1]
            c_detail = {
                "id": str(mongo_c.id),
                "problem_id": mongo_c.problem_id or f"CHL-2026-{str(mongo_c.id)[-5:]}",
                "title": mongo_c.title,
                "description": mongo_c.description,
                "category": mongo_c.category,
                "district": mongo_c.district,
                "latitude": lat,
                "longitude": lon,
                "status": mongo_c.status,
                "priority": mongo_c.priority,
                "urgency_score": mongo_c.urgency_score,
                # Privacy: citizen_phone, citizen, is_anonymous intentionally excluded
            }
    except Exception:
        pass

    if ind:
        match_info = calculate_industry_match(proj, ind)
    else:
        match_info = {
            "match_score": 92,
            "matching_skills": ["AI/ML", "Computer Vision", "IoT"],
            "matching_services": ["Technical Mentorship", "Testing"]
        }

    return {
        "id": str(proj.id),
        "challenge": proj.challenge_id,
        "challenge_title": proj.title,
        "challenge_detail": c_detail,
        "university": 1,
        "university_name": getattr(proj, 'university_id', 'University'),
        "faculty_mentor": None,
        "title": proj.title,
        "description": proj.description,
        "expected_outcome": getattr(proj, 'expected_outcome', ''),
        "required_skills": getattr(proj, 'required_skills', []),
        "estimated_duration": getattr(proj, 'estimated_duration', '6 Months'),
        "team_size": getattr(proj, 'team_size', 4),
        "status": getattr(proj, 'status', 'PROTOTYPE'),
        "progress_percent": getattr(proj, 'progress_percent', 0),
        "industry_collaboration_status": getattr(proj, 'industry_collaboration_status', 'NONE'),
        "active_industry_partner": getattr(proj, 'active_industry_partner', None),
        "created_at": proj.created_at.isoformat() if hasattr(proj, 'created_at') and proj.created_at else "",
        "match_score": match_info['match_score'],
        "matching_skills": match_info['matching_skills'],
        "matching_services": match_info['matching_services']
    }


def _serialize_mongo_collab(collab):
    """
    Serializes a MongoIndustryCollaborationWorkspace instance matching the IndustryCollaborationWorkspaceSerializer schema.
    """
    proj_detail = None
    uni_name = "University Partner"
    mongo_proj, sql_proj = _find_project_for_industry(collab.project_id)
    if mongo_proj:
        proj_detail = _serialize_mongo_project_for_industry(mongo_proj, None)
        uni_name = getattr(mongo_proj, 'university_id', uni_name)
    elif sql_proj:
        proj_detail = UniversityProjectSerializer(sql_proj).data
        uni_name = getattr(getattr(sql_proj, 'university', None), 'university_name', uni_name)

    return {
        "id": str(collab.id),
        "project": collab.project_id,
        "project_detail": proj_detail,
        "industry": collab.industry_id,
        "company_name": collab.industry_id,
        "university_name": uni_name,
        "collaboration_type": getattr(collab, 'collaboration_type', []),
        "message": getattr(collab, 'message', ''),
        "proposed_support": getattr(collab, 'proposed_support', ''),
        "expected_duration": getattr(collab, 'expected_duration', '3 Months'),
        "match_score": getattr(collab, 'match_score', 92),
        "status": getattr(collab, 'status', 'PENDING'),
        "start_date": None,
        "end_date": None,
        "created_at": collab.created_at.isoformat() if hasattr(collab, 'created_at') and collab.created_at else "",
        "updated_at": collab.created_at.isoformat() if hasattr(collab, 'created_at') and collab.created_at else ""
    }


# ==============================================================================
# 1. INDUSTRY DASHBOARD & PROFILE ENDPOINTS
# ==============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def industry_dashboard(request):
    ind = _get_user_industry(request) or IndustryProfile.objects.first()
    
    # 1. Total projects from MongoDB first, fallback to SQLite
    total_projects = 0
    try:
        total_projects = MongoUniversityProject.objects.count()
    except Exception:
        pass
    if not total_projects:
        total_projects = UniversityProject.objects.count()

    # 2. Collab counts from MongoDB first
    active_collabs = 0
    pending_collabs = 0
    completed_collabs = 0
    mongo_collabs_found = False

    try:
        qs = MongoIndustryCollaborationWorkspace.objects
        if ind:
            qs = qs.filter(industry_id__in=[str(ind.id), ind.company_name])
        active_collabs = qs.filter(status__in=['ACCEPTED', 'ACTIVE']).count()
        pending_collabs = qs.filter(status='PENDING').count()
        completed_collabs = qs.filter(status='COMPLETED').count()
        if active_collabs or pending_collabs or completed_collabs:
            mongo_collabs_found = True
    except Exception:
        pass

    if not mongo_collabs_found:
        if ind:
            active_collabs = IndustryCollaborationWorkspace.objects.filter(industry=ind, status__in=['ACCEPTED', 'ACTIVE']).count()
            pending_collabs = IndustryCollaborationWorkspace.objects.filter(industry=ind, status='PENDING').count()
            completed_collabs = IndustryCollaborationWorkspace.objects.filter(industry=ind, status='COMPLETED').count()
        else:
            active_collabs = IndustryCollaborationWorkspace.objects.filter(status__in=['ACCEPTED', 'ACTIVE']).count()
            pending_collabs = IndustryCollaborationWorkspace.objects.filter(status='PENDING').count()
            completed_collabs = IndustryCollaborationWorkspace.objects.filter(status='COMPLETED').count()

    return Response({
        "company_name": ind.company_name if ind else "ABC Technologies",
        "verification_status": ind.verification_status if ind else "VERIFIED",
        "dashboard_cards": {
            "recommended_projects_count": max(4, total_projects),
            "collaboration_requests_count": pending_collabs,
            "active_collaborations_count": max(1, active_collabs),
            "completed_projects_count": max(2, completed_collabs),
            "projects_supported_count": max(3, active_collabs + completed_collabs),
            "total_beneficiaries_impacted": 28450,
            "districts_covered": 8
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
@permission_classes([permissions.AllowAny])
def industry_profile_view(request):
    ind = _get_user_industry(request) or IndustryProfile.objects.first()
    if not ind:
        return Response({"error": "No industry profile found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(IndustryProfileSerializer(ind).data)

    elif request.method == 'PUT':
        serializer = IndustryProfileSerializer(ind, data=request.data, partial=True)
        if serializer.is_valid():
            profile = serializer.save()
            # Sync to MongoDB Atlas
            try:
                mongo_p = MongoIndustryProfile.objects(official_email=profile.official_email).first()
                if mongo_p:
                    for field in ['company_name', 'phone', 'state', 'district', 'city', 'address', 'expertise', 'services']:
                        if field in request.data:
                            setattr(mongo_p, field, request.data[field])
                    mongo_p.save()
            except Exception as e:
                print(f"[MONGODB PROFILE SYNC WARNING] {e}")

            return Response(IndustryProfileSerializer(profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([permissions.AllowAny])
def expertise_and_services_view(request):
    ind = _get_user_industry(request) or IndustryProfile.objects.first()
    if not ind:
        return Response({"error": "No industry profile found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({
            "expertise": ind.expertise,
            "services": ind.services
        })
    elif request.method == 'PUT':
        if 'expertise' in request.data:
            ind.expertise = request.data['expertise']
        if 'services' in request.data:
            ind.services = request.data['services']
        ind.save()

        # Sync to MongoDB Atlas
        try:
            mongo_p = MongoIndustryProfile.objects(official_email=ind.official_email).first()
            if mongo_p:
                if 'expertise' in request.data:
                    mongo_p.expertise = request.data['expertise']
                if 'services' in request.data:
                    mongo_p.services = request.data['services']
                mongo_p.save()
        except Exception:
            pass

        return Response({
            "message": "Expertise & services updated successfully",
            "expertise": ind.expertise,
            "services": ind.services
        })


# ==============================================================================
# 2. AI RECOMMENDED PROJECTS & PRIVACY PROTECTED DETAILS
# ==============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def recommended_projects(request):
    """
    Returns University Projects annotated with AI Industry Match Score (%) based on
    Industry expertise and services offered.
    Reads from MongoDB Atlas primary.
    """
    ind = _get_user_industry(request) or IndustryProfile.objects.first()
    domain = request.query_params.get('domain')
    search = request.query_params.get('search')

    # MongoDB Atlas primary
    mongo_projects = []
    try:
        qs = MongoUniversityProject.objects.all().order_by('-created_at')
        if domain:
            qs = qs.filter(title__icontains=domain)
        if search:
            qs = qs.filter(title__icontains=search)
        mongo_projects = list(qs)
    except Exception as e:
        print(f"[MONGODB RECOMMENDED PROJECTS WARNING] {e}")

    if mongo_projects:
        results = []
        for proj in mongo_projects:
            results.append(_serialize_mongo_project_for_industry(proj, ind))
        results.sort(key=lambda x: x['match_score'], reverse=True)
        return Response({
            "company_name": ind.company_name if ind else "ABC Technologies",
            "count": len(results),
            "recommended_projects": results
        }, status=status.HTTP_200_OK)

    # SQLite fallback
    projects = UniversityProject.objects.all()
    if domain:
        projects = projects.filter(title__icontains=domain)
    if search:
        projects = projects.filter(title__icontains=search)

    results = []
    for proj in projects:
        p_data = UniversityProjectSerializer(proj).data

        # PRIVACY ENFORCEMENT: Strip citizen contact details from challenge object
        if 'challenge_detail' in p_data and p_data['challenge_detail']:
            p_data['challenge_detail'].pop('citizen_phone', None)
            p_data['challenge_detail'].pop('citizen', None)
            p_data['challenge_detail'].pop('is_anonymous', None)

        if ind:
            match_info = calculate_industry_match(proj, ind)
            p_data['match_score'] = match_info['match_score']
            p_data['matching_skills'] = match_info['matching_skills']
            p_data['matching_services'] = match_info['matching_services']
        else:
            p_data['match_score'] = 92
            p_data['matching_skills'] = ["AI/ML", "Computer Vision", "IoT"]
            p_data['matching_services'] = ["Technical Mentorship", "Testing"]

        results.append(p_data)

    results.sort(key=lambda x: x['match_score'], reverse=True)

    return Response({
        "company_name": ind.company_name if ind else "ABC Technologies",
        "count": len(results),
        "recommended_projects": results
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def industry_project_detail(request, pk):
    mongo_proj, sql_proj = _find_project_for_industry(pk)
    if not mongo_proj and not sql_proj:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    ind = _get_user_industry(request) or IndustryProfile.objects.first()

    if mongo_proj:
        return Response(_serialize_mongo_project_for_industry(mongo_proj, ind), status=status.HTTP_200_OK)

    p_data = UniversityProjectSerializer(sql_proj).data

    # PRIVACY ENFORCEMENT: Strip citizen private contact details
    if 'challenge_detail' in p_data and p_data['challenge_detail']:
        p_data['challenge_detail'].pop('citizen_phone', None)
        p_data['challenge_detail'].pop('citizen', None)

    if ind:
        match_info = calculate_industry_match(sql_proj, ind)
        p_data['match_score'] = match_info['match_score']
        p_data['matching_skills'] = match_info['matching_skills']
        p_data['matching_services'] = match_info['matching_services']
    else:
        p_data['match_score'] = 92
        p_data['matching_skills'] = ["AI/ML", "Computer Vision"]
        p_data['matching_services'] = ["Technical Mentorship", "Testing"]

    return Response(p_data, status=status.HTTP_200_OK)


# ==============================================================================
# 3. COLLABORATION WORKSPACE & REQUESTS
# ==============================================================================
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def send_collaboration_request(request, pk):
    """
    Industry sends Collaboration Request to University Project Team.
    Payload: {"collaboration_type": ["Technical Mentorship", "Testing"], "message": "...", "proposed_support": "..."}
    """
    mongo_proj, sql_proj = _find_project_for_industry(pk)
    if not mongo_proj and not sql_proj:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    ind = _get_user_industry(request) or IndustryProfile.objects.first()
    if not ind:
        return Response({"error": "No industry profile found"}, status=status.HTTP_400_BAD_REQUEST)

    collab_types = request.data.get('collaboration_type', ['Technical Mentorship'])
    message = request.data.get('message', 'We would like to support this project.')
    proposed_support = request.data.get('proposed_support', '')
    expected_duration = request.data.get('expected_duration', '3 Months')

    # Calculate match
    target_proj = mongo_proj or sql_proj
    match_info = calculate_industry_match(target_proj, ind)

    # 1. Save in MongoDB Atlas primary
    mongo_collab = None
    try:
        mongo_collab = MongoIndustryCollaborationWorkspace(
            project_id=str(getattr(mongo_proj, 'id', None) or getattr(sql_proj, 'id', pk)),
            industry_id=str(ind.company_name),
            collaboration_type=collab_types if isinstance(collab_types, list) else [collab_types],
            message=message,
            proposed_support=proposed_support,
            expected_duration=expected_duration,
            match_score=match_info['match_score'],
            status='PENDING'
        )
        mongo_collab.save()
    except Exception as e:
        print(f"[MONGODB SEND COLLAB REQ WARNING] {e}")

    if mongo_proj:
        mongo_proj.industry_collaboration_status = 'PENDING'
        mongo_proj.save()

    # 2. Sync to SQLite if sql_proj exists
    collab = None
    if sql_proj:
        collab = IndustryCollaborationWorkspace.objects.create(
            project=sql_proj,
            industry=ind,
            collaboration_type=collab_types,
            message=message,
            proposed_support=proposed_support,
            expected_duration=expected_duration,
            match_score=match_info['match_score'],
            status='PENDING'
        )
        sql_proj.industry_collaboration_status = 'PENDING'
        sql_proj.save()

        UniversityNotification.objects.create(
            university=sql_proj.university,
            title="New Industry Collaboration Request",
            message=f"{ind.company_name} sent a collaboration request for '{sql_proj.title}' (Match Score: {match_info['match_score']}%).",
            notification_type="COLLABORATION_REQ"
        )

    uni_title = getattr(mongo_proj, 'university_id', None) or getattr(getattr(sql_proj, 'university', None), 'university_name', 'University')
    collab_data = IndustryCollaborationWorkspaceSerializer(collab).data if collab else _serialize_mongo_collab(mongo_collab)

    return Response({
        "message": f"Collaboration request sent to {uni_title} successfully!",
        "collaboration_request": collab_data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def industry_collaboration_requests(request):
    ind = _get_user_industry(request) or IndustryProfile.objects.first()

    # MongoDB Atlas primary
    try:
        qs = MongoIndustryCollaborationWorkspace.objects.all().order_by('-created_at')
        if ind:
            qs = qs.filter(industry_id__in=[str(ind.id), ind.company_name])
        mongo_collabs = list(qs)
        if mongo_collabs:
            return Response([_serialize_mongo_collab(c) for c in mongo_collabs])
    except Exception as e:
        print(f"[MONGODB COLLAB REQS WARNING] {e}")

    collabs = IndustryCollaborationWorkspace.objects.all()
    if ind:
        collabs = collabs.filter(industry=ind)
    return Response(IndustryCollaborationWorkspaceSerializer(collabs, many=True).data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def industry_active_collaborations(request):
    ind = _get_user_industry(request) or IndustryProfile.objects.first()

    # MongoDB Atlas primary
    try:
        qs = MongoIndustryCollaborationWorkspace.objects(status__in=['ACCEPTED', 'ACTIVE', 'COMPLETED']).order_by('-created_at')
        if ind:
            qs = qs.filter(industry_id__in=[str(ind.id), ind.company_name])
        mongo_collabs = list(qs)
        if mongo_collabs:
            return Response([_serialize_mongo_collab(c) for c in mongo_collabs])
    except Exception as e:
        print(f"[MONGODB ACTIVE COLLAB WARNING] {e}")

    collabs = IndustryCollaborationWorkspace.objects.filter(status__in=['ACCEPTED', 'ACTIVE', 'COMPLETED'])
    if ind:
        collabs = collabs.filter(industry=ind)
    return Response(IndustryCollaborationWorkspaceSerializer(collabs, many=True).data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def collaboration_workspace_detail(request, pk):
    mongo_collab, sql_collab = _find_collaboration(pk)
    if not mongo_collab and not sql_collab:
        return Response({"error": "Collaboration workspace not found"}, status=status.HTTP_404_NOT_FOUND)

    if mongo_collab:
        return Response(_serialize_mongo_collab(mongo_collab))
    return Response(IndustryCollaborationWorkspaceSerializer(sql_collab).data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def submit_collaboration_feedback(request, pk):
    """
    Industry submits Technical Feedback / Code Review for a project workspace.
    """
    mongo_collab, sql_collab = _find_collaboration(pk)
    if not mongo_collab and not sql_collab:
        return Response({"error": "Collaboration workspace not found"}, status=status.HTTP_404_NOT_FOUND)

    ind = _get_user_industry(request) or IndustryProfile.objects.first()
    title = request.data.get('title', 'Technical Review & Feedback')
    feedback_text = request.data.get('feedback_text', request.data.get('feedback', ''))
    rating = int(request.data.get('rating', 5))

    # Save to MongoDB Atlas collection 'industry_feedbacks'
    try:
        db = get_db()
        db["industry_feedbacks"].insert_one({
            "workspace_id": str(mongo_collab.id if mongo_collab else sql_collab.id),
            "industry_name": ind.company_name if ind else "Industry Partner",
            "title": title,
            "feedback_text": feedback_text,
            "rating": rating,
            "created_at": datetime.datetime.utcnow().isoformat()
        })
    except Exception as e:
        print(f"[MONGODB FEEDBACK WARNING] {e}")

    # Also save to SQLite if sql_collab exists
    feedback = None
    if sql_collab:
        feedback = IndustryFeedback.objects.create(
            workspace=sql_collab,
            industry=ind,
            title=title,
            feedback_text=feedback_text,
            rating=rating
        )

    if feedback:
        return Response(IndustryFeedbackSerializer(feedback).data, status=status.HTTP_201_CREATED)
    else:
        return Response({
            "message": "Feedback submitted successfully to MongoDB Atlas",
            "workspace_id": str(mongo_collab.id if mongo_collab else pk),
            "title": title,
            "rating": rating
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def submit_collaboration_milestone(request, pk):
    """
    Industry submits milestone contribution (e.g. QA testing completed, cloud infrastructure setup).
    """
    mongo_collab, sql_collab = _find_collaboration(pk)
    if not mongo_collab and not sql_collab:
        return Response({"error": "Collaboration workspace not found"}, status=status.HTTP_404_NOT_FOUND)

    title = request.data.get('title', 'Industry Testing & Validation')
    m_status = request.data.get('status', 'COMPLETED')
    progress = int(request.data.get('progress_percent', 100))
    comments = request.data.get('comments', 'Testing completed by industry team.')

    proj_id = str(mongo_collab.project_id if mongo_collab else sql_collab.project.id)
    company_name = mongo_collab.industry_id if mongo_collab else sql_collab.industry.company_name

    # Save to MongoDB Atlas project_milestones collection
    try:
        db = get_db()
        db["project_milestones"].insert_one({
            "project_id": proj_id,
            "title": f"[Industry - {company_name}] {title}",
            "status": m_status,
            "progress_percent": progress,
            "comments": comments,
            "created_at": datetime.datetime.utcnow().isoformat()
        })
    except Exception as e:
        print(f"[MONGODB MILESTONE WARNING] {e}")

    milestone_id = "mongo_recorded"
    if sql_collab:
        milestone = ProjectMilestone.objects.create(
            project=sql_collab.project,
            title=f"[Industry - {sql_collab.industry.company_name}] {title}",
            status=m_status,
            progress_percent=progress,
            comments=comments
        )
        milestone_id = milestone.id

    return Response({"message": "Industry milestone recorded!", "milestone_id": milestone_id})


# ==============================================================================
# 4. NOTIFICATIONS, REPORTS & IMPACT
# ==============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def industry_notifications(request):
    ind = _get_user_industry(request) or IndustryProfile.objects.first()
    if not ind:
        return Response([])
    notes = ind.notifications.all().order_by('-created_at')
    return Response(IndustryNotificationSerializer(notes, many=True).data)


@api_view(['PUT'])
@permission_classes([permissions.AllowAny])
def mark_industry_notification_read(request, pk):
    try:
        note = IndustryNotification.objects.get(pk=pk)
        note.is_read = True
        note.save()
        return Response(IndustryNotificationSerializer(note).data)
    except IndustryNotification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def industry_impact_summary(request):
    ind = _get_user_industry(request) or IndustryProfile.objects.first()
    return Response({
        "company_name": ind.company_name if ind else "ABC Technologies",
        "impact_summary": {
            "projects_supported": 12,
            "projects_deployed": 7,
            "total_beneficiaries": 28450,
            "districts_covered": 8,
            "problems_solved": 18,
            "villages_covered": 24
        },
        "technologies_contributed": [
            "AI/ML", "Computer Vision", "IoT Sensors", "Cloud Infrastructure"
        ]
    }, status=status.HTTP_200_OK)


# ==============================================================================
# 5. GOVERNMENT / ADMIN VERIFICATION ENDPOINTS FOR INDUSTRY
# ==============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def admin_pending_industries(request):
    try:
        mongo_pending = list(MongoIndustryProfile.objects(verification_status='PENDING'))
        if mongo_pending:
            results = []
            for ind in mongo_pending:
                results.append({
                    "id": str(ind.id),
                    "company_name": ind.company_name,
                    "official_email": ind.official_email,
                    "company_type": ind.company_type,
                    "website": ind.website,
                    "registration_number": ind.registration_number,
                    "contact_person": ind.contact_person,
                    "designation": ind.designation,
                    "phone": ind.phone,
                    "state": ind.state,
                    "district": ind.district,
                    "city": ind.city,
                    "address": ind.address,
                    "expertise": ind.expertise,
                    "services": ind.services,
                    "documents": ind.documents,
                    "email_verified": ind.email_verified,
                    "verification_status": ind.verification_status,
                    "account_status": ind.account_status,
                    "rejection_reason": ind.rejection_reason,
                    "created_at": ind.created_at.isoformat() if hasattr(ind, 'created_at') and ind.created_at else ""
                })
            return Response(results)
    except Exception as e:
        print(f"[MONGODB PENDING INDUSTRIES WARNING] {e}")

    pending = IndustryProfile.objects.filter(verification_status='PENDING')
    return Response(IndustryProfileSerializer(pending, many=True).data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_verify_industry(request, pk):
    """
    Govt Admin Approves or Rejects Industry Registration.
    Payload: {"action": "APPROVE"} or {"action": "REJECT", "rejection_reason": "Invalid registration number"}
    """
    str_pk = str(pk).strip()
    mongo_ind = None
    try:
        if len(str_pk) == 24:
            from bson import ObjectId
            mongo_ind = MongoIndustryProfile.objects(id=ObjectId(str_pk)).first()
        if not mongo_ind:
            mongo_ind = MongoIndustryProfile.objects(id=str_pk).first()
    except Exception:
        pass

    sql_ind = None
    if str_pk.isdigit():
        sql_ind = IndustryProfile.objects.filter(pk=int(str_pk)).first()
    elif not mongo_ind:
        sql_ind = IndustryProfile.objects.filter(official_email=str_pk).first()

    if not mongo_ind and not sql_ind:
        return Response({"error": "Industry profile not found"}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action', 'APPROVE').upper()

    if action == 'APPROVE':
        if mongo_ind:
            mongo_ind.verification_status = 'VERIFIED'
            mongo_ind.account_status = 'ACTIVE'
            mongo_ind.save()

        if sql_ind:
            sql_ind.verification_status = 'VERIFIED'
            sql_ind.account_status = 'ACTIVE'
            sql_ind.save()
            try:
                IndustryNotification.objects.create(
                    industry=sql_ind,
                    title="Organization Verification Approved",
                    message="Your organization profile has been verified and approved by Government Admin. You can now log in.",
                    notification_type="SYSTEM"
                )
            except Exception:
                pass

        company_name = getattr(mongo_ind, 'company_name', None) or getattr(sql_ind, 'company_name', 'Industry')
        prof_data = IndustryProfileSerializer(sql_ind).data if sql_ind else {
            "id": str(mongo_ind.id),
            "company_name": mongo_ind.company_name,
            "verification_status": "VERIFIED",
            "account_status": "ACTIVE"
        }
        return Response({
            "message": f"Industry {company_name} has been APPROVED and activated.",
            "profile": prof_data
        }, status=status.HTTP_200_OK)

    elif action == 'REJECT':
        reason = request.data.get('rejection_reason', 'Company registration check failed')
        if mongo_ind:
            mongo_ind.verification_status = 'REJECTED'
            mongo_ind.account_status = 'INACTIVE'
            mongo_ind.rejection_reason = reason
            mongo_ind.save()

        if sql_ind:
            sql_ind.verification_status = 'REJECTED'
            sql_ind.account_status = 'INACTIVE'
            sql_ind.rejection_reason = reason
            sql_ind.save()

        company_name = getattr(mongo_ind, 'company_name', None) or getattr(sql_ind, 'company_name', 'Industry')
        prof_data = IndustryProfileSerializer(sql_ind).data if sql_ind else {
            "id": str(mongo_ind.id),
            "company_name": mongo_ind.company_name,
            "verification_status": "REJECTED",
            "account_status": "INACTIVE",
            "rejection_reason": reason
        }
        return Response({
            "message": f"Industry {company_name} has been REJECTED.",
            "reason": reason,
            "profile": prof_data
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid action. Use APPROVE or REJECT."}, status=status.HTTP_400_BAD_REQUEST)
