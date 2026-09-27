import random
from django.utils import timezone
from django.db.models import Q
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import (
    CitizenProfile,
    ChallengeEvidence,
    AIAnalysisRecord,
    CitizenFeedback,
    CitizenNotification,
    CitizenMilestoneRecord,
    CitizenTimelineEvent,
)
from .serializers import (
    CitizenProfileSerializer,
    ChallengeEvidenceSerializer,
    AIAnalysisRecordSerializer,
    CitizenFeedbackSerializer,
    CitizenNotificationSerializer,
    CitizenProblemSerializer,
    CitizenMilestoneRecordSerializer,
    CitizenTimelineEventSerializer,
    CitizenTrackingDetailSerializer,
)
from challenges.models import Challenge
from universities.models import UniversityProject, ProjectMilestone
from industries.models import IndustryCollaborationWorkspace
from ai.ai_engine.citizen_problem_analyzer import analyze_citizen_problem
from mongodb_config import (
    MongoChallenge,
    MongoAIAnalysisRecord,
    MongoUniversityProject,
    MongoIndustryCollaborationWorkspace
)

try:
    from ai.ai_services.mongodb_config import get_db
except Exception:
    get_db = None


# Helper function to get logged in citizen user or profile
def _get_user_citizen(request):
    if not request.user.is_authenticated:
        return None
    try:
        return request.user.citizen_profile
    except CitizenProfile.DoesNotExist:
        return CitizenProfile.objects.first()


def _sync_challenge_to_mongodb(challenge, milestones=None, timeline=None):
    """
    Safely syncs problem and milestone tracking data to MongoDB Atlas collection 'challenges' and 'tracking_milestones'.
    """
    if not get_db:
        return
    try:
        db = get_db()
        challenges_col = db["challenges"]
        tracking_col = db["tracking_milestones"]

        doc = {
            "problem_id": challenge.problem_id or f"CHL-2026-{challenge.id:05d}",
            "title": challenge.title,
            "description": challenge.description,
            "category": challenge.category,
            "district": challenge.district,
            "block": challenge.block,
            "village": challenge.village,
            "pin_code": challenge.pin_code,
            "latitude": float(challenge.latitude) if challenge.latitude else 23.3441,
            "longitude": float(challenge.longitude) if challenge.longitude else 85.3096,
            "status": challenge.status,
            "priority": challenge.priority,
            "urgency_score": float(challenge.urgency_score) if challenge.urgency_score else 5.0,
            "assigned_university": challenge.assigned_university,
            "citizen_name": challenge.citizen_name,
            "upvotes": challenge.upvotes,
        }
        challenges_col.update_one({"problem_id": doc["problem_id"]}, {"$set": doc}, upsert=True)

        if milestones:
            tracking_doc = {
                "problem_id": doc["problem_id"],
                "title": challenge.title,
                "category": challenge.category,
                "district": challenge.district,
                "assigned_university": challenge.assigned_university or "Pending Assignment",
                "milestones": milestones,
                "timeline": timeline or []
            }
            tracking_col.update_one({"problem_id": doc["problem_id"]}, {"$set": tracking_doc}, upsert=True)
    except Exception as e:
        print(f"[MONGODB SYNC WARNING] {e}")


def _generate_default_milestones(current_status='OPEN', is_rejected=False):
    if is_rejected:
        return [
            {
                "stage_number": 1,
                "title": "Report Submitted",
                "description": "Citizen filed problem with location & photo evidence.",
                "status": "COMPLETED",
                "completed_date": "Day 1",
                "proof_label": "Citizen Evidence",
                "proof_url": "https://solvesphere.gov.in/evidence/sample1.jpg",
                "assigned_stakeholder": "Citizen"
            },
            {
                "stage_number": 2,
                "title": "Under AI Analysis",
                "description": "Multi-tier AI analyzed urgency, deduplication, and classified duplicate report.",
                "status": "COMPLETED",
                "completed_date": "Day 1",
                "proof_label": "AI Inspection Report",
                "proof_url": "https://solvesphere.gov.in/reports/ai_scanned.pdf",
                "assigned_stakeholder": "AI Engine"
            },
            {
                "stage_number": 3,
                "title": "Government Rejected",
                "description": "Nodal Officer marked report as duplicate/invalid after verification.",
                "status": "COMPLETED",
                "completed_date": "Day 2",
                "proof_label": "Official Rejection Notice",
                "proof_url": "https://solvesphere.gov.in/records/rejection_summary.pdf",
                "assigned_stakeholder": "Government Nodal Officer"
            }
        ]

    stages_info = [
        (1, "Report submitted", "Citizen filed problem with location & photo evidence.", "Citizen", "Citizen Evidence", "https://solvesphere.gov.in/evidence/sample1.jpg"),
        (2, "Under AI Analysis", "AI analyzed urgency, deduplication, and classified domain.", "AI Engine", "AI Inspection Report", "https://solvesphere.gov.in/reports/ai_scanned.pdf"),
        (3, "Government Validation", "Nodal Officer approved problem for HEI intervention.", "Government Officer", "Government Validation Certificate", "https://solvesphere.gov.in/reports/validation_cert.pdf"),
        (4, "University Assigned", "Assigned to university faculty & student engineering team.", "Assigned University", "Institutional MoA & Student Team", "https://solvesphere.gov.in/docs/assignment_moa.pdf"),
        (5, "Project Started", "Faculty and student innovators initiated field R&D.", "University Project Team", "Project Inception Report", "https://solvesphere.gov.in/docs/inception_doc.pdf"),
        (6, "Research/ Development", "Hardware/software prototype and field validation in progress.", "University & Industry", "Technical Blueprint & Lab Tests", "https://solvesphere.gov.in/docs/tech_spec.pdf"),
        (7, "Solution Deployed", "Physical equipment or digital system installed in target village.", "Joint University & Industry", "Field Deployment Photo & Handover", "https://solvesphere.gov.in/photos/field_deployment.jpg"),
        (8, "Problem Solved", "Final civic inspection passed and community feedback verified.", "District Administration", "Citizen Verification Certificate", "https://solvesphere.gov.in/certificates/solution_final.pdf")
    ]

    status_order = {
        'UNDER_REVIEW': 1,
        'OPEN': 3,
        'ASSIGNED_TO_HEI': 4,
        'IN_PROGRESS': 5,
        'RESOLVED': 8
    }
    completed_up_to = status_order.get(current_status, 2)

    milestones = []
    for s_num, title, desc, stakeholder, proof_lbl, proof_url in stages_info:
        if s_num < completed_up_to:
            st = "COMPLETED"
        elif s_num == completed_up_to:
            st = "COMPLETED" if current_status == 'RESOLVED' else "IN_PROGRESS"
        else:
            st = "PENDING"
        milestones.append({
            "stage_number": s_num,
            "title": title,
            "description": desc,
            "status": st,
            "completed_date": f"Stage {s_num}" if st == "COMPLETED" else None,
            "proof_label": proof_lbl,
            "proof_url": proof_url if st == "COMPLETED" else "",
            "assigned_stakeholder": stakeholder
        })
    return milestones


def _get_challenge_mongo_and_sql(pk):
    """
    Returns (mongo_challenge, sql_challenge, problem_id_str).
    Checks MongoChallenge first, then SQLite Challenge.
    """
    mongo_c = None
    sql_c = None
    str_pk = str(pk).strip()

    # 1. MongoChallenge by ObjectId
    if len(str_pk) == 24:
        try:
            from bson import ObjectId
            mongo_c = MongoChallenge.objects(id=ObjectId(str_pk)).first()
        except Exception:
            mongo_c = None

    # 2. MongoChallenge by problem_id
    if not mongo_c:
        try:
            mongo_c = MongoChallenge.objects(problem_id=str_pk).first()
        except Exception:
            pass

    # 3. MongoChallenge by id str
    if not mongo_c:
        try:
            mongo_c = MongoChallenge.objects(id=str_pk).first()
        except Exception:
            pass

    # 4. SQLite Challenge
    if str_pk.isdigit():
        try:
            sql_c = Challenge.objects.filter(pk=int(str_pk)).first()
        except Exception:
            pass
    if not sql_c:
        sql_c = Challenge.objects.filter(problem_id=str_pk).first()

    if mongo_c and not sql_c:
        pid = getattr(mongo_c, 'problem_id', None)
        if pid:
            sql_c = Challenge.objects.filter(problem_id=pid).first()

    if sql_c and not mongo_c:
        pid = getattr(sql_c, 'problem_id', None)
        if pid:
            mongo_c = MongoChallenge.objects(problem_id=pid).first()

    prob_id = (
        (getattr(mongo_c, 'problem_id', None) if mongo_c else None)
        or (getattr(sql_c, 'problem_id', None) if sql_c else None)
        or str_pk
    )
    return mongo_c, sql_c, prob_id


def _get_milestones_and_timeline_for_challenge(mongo_c, sql_c, prob_id):
    """
    Fetches milestone records and timeline from MongoDB collection 'tracking_milestones'.
    If not in MongoDB, generates them based on status, and syncs to MongoDB Atlas.
    """
    if get_db:
        try:
            db = get_db()
            t_doc = db["tracking_milestones"].find_one({"problem_id": prob_id})
            if not t_doc and mongo_c:
                t_doc = db["tracking_milestones"].find_one({"problem_id": str(mongo_c.id)})
            if t_doc and t_doc.get("milestones"):
                return t_doc.get("milestones", []), t_doc.get("timeline", [])
        except Exception as e:
            print(f"[TRACKING READ WARNING] {e}")

    # Fallback to SQLite if present
    if sql_c:
        _ensure_milestones_exist(sql_c)
        m_qs = sql_c.milestone_records.all()
        t_qs = sql_c.timeline_events.all()
        m_data = CitizenMilestoneRecordSerializer(m_qs, many=True).data
        t_data = CitizenTimelineEventSerializer(t_qs, many=True).data
        if m_data:
            if get_db:
                try:
                    db = get_db()
                    db["tracking_milestones"].update_one(
                        {"problem_id": prob_id},
                        {"$set": {
                            "problem_id": prob_id,
                            "title": getattr(sql_c, 'title', ''),
                            "category": getattr(sql_c, 'category', ''),
                            "district": getattr(sql_c, 'district', ''),
                            "assigned_university": getattr(sql_c, 'assigned_university', ''),
                            "milestones": m_data,
                            "timeline": t_data
                        }},
                        upsert=True
                    )
                except Exception:
                    pass
            return m_data, t_data

    # Generate default milestones based on status
    current_status = getattr(mongo_c, 'status', 'OPEN') if mongo_c else (getattr(sql_c, 'status', 'OPEN') if sql_c else 'OPEN')
    is_rejected = current_status in ['REJECTED', 'DUPLICATE', 'FAKE', 'INVALID']
    m_data = _generate_default_milestones(current_status, is_rejected)
    t_data = [
        {
            "id": 1,
            "title": "Problem Submitted",
            "description": "Citizen filed the civic problem with photo & GPS location.",
            "timestamp_text": "Phase 1 - Live",
            "event_type": "SUBMISSION"
        }
    ]
    if get_db:
        try:
            db = get_db()
            title = getattr(mongo_c, 'title', '') if mongo_c else (getattr(sql_c, 'title', '') if sql_c else '')
            cat = getattr(mongo_c, 'category', '') if mongo_c else (getattr(sql_c, 'category', '') if sql_c else '')
            dist = getattr(mongo_c, 'district', '') if mongo_c else (getattr(sql_c, 'district', '') if sql_c else '')
            uni = getattr(mongo_c, 'assigned_university', '') if mongo_c else (getattr(sql_c, 'assigned_university', '') if sql_c else '')
            db["tracking_milestones"].update_one(
                {"problem_id": prob_id},
                {"$set": {
                    "problem_id": prob_id,
                    "title": title,
                    "category": cat,
                    "district": dist,
                    "assigned_university": uni or "Pending Assignment",
                    "milestones": m_data,
                    "timeline": t_data
                }},
                upsert=True
            )
        except Exception:
            pass
    return m_data, t_data


def _ensure_milestones_exist(challenge):
    """
    Ensures milestones and timeline events exist in SQLite & MongoDB for a challenge.
    - Standard Workflow (8 Milestones):
      1. Report submitted
      2. Under AI Analysis
      3. Government Validation
      4. University Assigned
      5. Project Started
      6. Research/ Development
      7. Solution Deployed
      8. Problem Solved
    - Duplicate / Fake / Rejected Workflow (3 Milestones):
      1. Report Submitted
      2. Under AI Analysis
      3. Government Rejected
    """
    is_rejected = challenge.status in ['REJECTED', 'DUPLICATE', 'FAKE', 'INVALID']
    
    # If milestones exist and match current path type, check count
    existing_qs = challenge.milestone_records.all()
    if existing_qs.count() > 0:
        if is_rejected and existing_qs.count() == 3:
            return
        elif not is_rejected and existing_qs.count() == 8:
            return
        # If count doesn't match (e.g. older 6-stage seed), clear and regenerate
        existing_qs.delete()

    c_status = challenge.status
    uni_name = challenge.assigned_university or "Pending University Assignment"

    if is_rejected:
        rejection_reason = getattr(challenge, 'rejection_reason', 'Identified as duplicate / non-genuine submission by AI Scrutiny and District Officers.')
        dup_score = "96%"
        if hasattr(challenge, 'ai_analysis'):
            dup_score = f"{int(challenge.ai_analysis.duplicate_score * 100)}%"

        stages = [
            {
                "stage": 1,
                "title": "Report submitted",
                "desc": "Citizen problem logged with GPS coordinates and photographic evidence.",
                "status": "COMPLETED",
                "date": challenge.created_at.strftime("%d %b %Y") if hasattr(challenge.created_at, 'strftime') else "08 Sep 2026",
                "proof_label": "Citizen Report Evidence",
                "proof_url": "https://solvesphere.gov.in/evidence/report_log.pdf",
                "stakeholder": "Citizen Reporter"
            },
            {
                "stage": 2,
                "title": "Under AI Analysis",
                "desc": f"AI Scrutiny engine flagged duplicate/invalid submission (Similarity Score: {dup_score}).",
                "status": "COMPLETED",
                "date": challenge.created_at.strftime("%d %b %Y") if hasattr(challenge.created_at, 'strftime') else "08 Sep 2026",
                "proof_label": f"AI Scrutiny Flag ({dup_score} Match)",
                "proof_url": "https://solvesphere.gov.in/reports/ai_duplicate_audit.pdf",
                "stakeholder": "AI Scrutiny Engine"
            },
            {
                "stage": 3,
                "title": "Government Rejected",
                "desc": f"District Government Nodal Officer rejected report. Reason: {rejection_reason}",
                "status": "COMPLETED",
                "date": challenge.updated_at.strftime("%d %b %Y") if hasattr(challenge.updated_at, 'strftime') else "09 Sep 2026",
                "proof_label": "Official Rejection Notice",
                "proof_url": "https://solvesphere.gov.in/records/gov_rejection_notice.pdf",
                "stakeholder": "District Nodal Officer"
            }
        ]
    else:
        # Standard 8-Stage Milestone System
        # Determine progress based on status
        if c_status in ['RESOLVED', 'COMPLETED']:
            completed_up_to = 8
        elif c_status == 'IN_PROGRESS':
            completed_up_to = 5  # Project Started / Research
        elif c_status in ['ASSIGNED_TO_HEI']:
            completed_up_to = 4  # University Assigned
        elif c_status == 'OPEN':
            completed_up_to = 3  # Government Validation
        elif c_status == 'UNDER_REVIEW':
            completed_up_to = 2  # Under AI Analysis
        else:
            completed_up_to = 1  # Report submitted

        stages = [
            {
                "stage": 1,
                "title": "Report submitted",
                "desc": "Citizen problem logged with GPS coordinates and photographic evidence.",
                "status": "COMPLETED" if completed_up_to >= 1 else "PENDING",
                "date": "08 Sep 2026",
                "proof_label": "Citizen Report Evidence",
                "proof_url": "https://solvesphere.gov.in/evidence/photo_01.jpg",
                "stakeholder": "Citizen Reporter"
            },
            {
                "stage": 2,
                "title": "Under AI Analysis",
                "desc": "AI classified problem domain, evaluated urgency score, and checked duplicate registries.",
                "status": "COMPLETED" if completed_up_to >= 2 else "IN_PROGRESS",
                "date": "08 Sep 2026" if completed_up_to >= 2 else "In Progress",
                "proof_label": f"AI Urgency {challenge.urgency_score or 8.5}/10",
                "proof_url": "https://solvesphere.gov.in/reports/ai_analysis.pdf",
                "stakeholder": "AI Scrutiny Engine"
            },
            {
                "stage": 3,
                "title": "Government Validation",
                "desc": "District Nodal Officer verified problem on ground and approved civic challenge charter.",
                "status": "COMPLETED" if completed_up_to >= 3 else ("IN_PROGRESS" if completed_up_to == 2 else "PENDING"),
                "date": "09 Sep 2026" if completed_up_to >= 3 else "Pending",
                "proof_label": "Official Sanction Record",
                "proof_url": "https://solvesphere.gov.in/records/gov_assignment.pdf",
                "stakeholder": "Jharkhand Civic Nodal Cell"
            },
            {
                "stage": 4,
                "title": "University Assigned",
                "desc": f"Matched and assigned to {uni_name} faculty mentors and student engineering team.",
                "status": "COMPLETED" if completed_up_to >= 4 else ("IN_PROGRESS" if completed_up_to == 3 else "PENDING"),
                "date": "09 Sep 2026" if completed_up_to >= 4 else "Pending",
                "proof_label": "HEI Assignment Letter",
                "proof_url": "https://solvesphere.gov.in/records/university_sanction.pdf",
                "stakeholder": uni_name
            },
            {
                "stage": 5,
                "title": "Project Started",
                "desc": "University project workspace initialized, baseline parameters measured, and development roadmap created.",
                "status": "COMPLETED" if completed_up_to >= 5 else ("IN_PROGRESS" if completed_up_to == 4 else "PENDING"),
                "date": "10 Sep 2026" if completed_up_to >= 5 else "Pending",
                "proof_label": "Project Kickoff Charter",
                "proof_url": "https://solvesphere.gov.in/proto/project_charter.pdf",
                "stakeholder": uni_name
            },
            {
                "stage": 6,
                "title": "Research/ Development",
                "desc": "Engineering team built sustainable prototype with Industry CSR mentorship and IoT gateway.",
                "status": "COMPLETED" if completed_up_to >= 6 else ("IN_PROGRESS" if completed_up_to == 5 else "PENDING"),
                "date": "10 Sep 2026" if completed_up_to >= 6 else "Pending",
                "proof_label": "Lab Prototype Schematic",
                "proof_url": "https://solvesphere.gov.in/proto/schematic_v1.pdf",
                "stakeholder": f"{uni_name} & CSR Partner"
            },
            {
                "stage": 7,
                "title": "Solution Deployed",
                "desc": "Engineered civic solution deployed on-site in target ward with field telemetry monitoring.",
                "status": "COMPLETED" if completed_up_to >= 7 else ("IN_PROGRESS" if completed_up_to == 6 else "PENDING"),
                "date": "10 Sep 2026" if completed_up_to >= 7 else "Pending",
                "proof_label": "Field Pilot Deployment Log",
                "proof_url": "https://solvesphere.gov.in/pilot/field_test.jpg",
                "stakeholder": "Municipal Civic Board & HEI Team"
            },
            {
                "stage": 8,
                "title": "Problem Solved",
                "desc": "Permanent infrastructure operational. Citizen verified resolution and recorded feedback.",
                "status": "COMPLETED" if completed_up_to == 8 else "PENDING",
                "date": "10 Sep 2026" if completed_up_to == 8 else "Target: Oct 2026",
                "proof_label": "Completion Sign-Off Certificate",
                "proof_url": "https://solvesphere.gov.in/certs/resolved.pdf",
                "stakeholder": "Civic Oversight Committee"
            }
        ]

    created_milestones = []
    for s in stages:
        m = CitizenMilestoneRecord.objects.create(
            challenge=challenge,
            stage_number=s["stage"],
            title=s["title"],
            description=s["desc"],
            status=s["status"],
            completed_date=s["date"],
            proof_label=s["proof_label"],
            proof_url=s["proof_url"],
            assigned_stakeholder=s["stakeholder"]
        )
        created_milestones.append(s)

    if challenge.timeline_events.count() == 0:
        CitizenTimelineEvent.objects.create(
            challenge=challenge,
            title="Field testing team calibrated sensors at site.",
            description="Sensors installed and data streams verified.",
            timestamp_text="Today, 11:30 AM",
            event_type="FIELD_TEST"
        )
        CitizenTimelineEvent.objects.create(
            challenge=challenge,
            title=f"{uni_name} submitted intermediate testing report.",
            description="Lab tests passed with 94% efficiency.",
            timestamp_text="Yesterday, 04:15 PM",
            event_type="PROTOTYPE"
        )
        CitizenTimelineEvent.objects.create(
            challenge=challenge,
            title="Government nodal officer approved HEI project charter.",
            description="Formal authorization letter issued.",
            timestamp_text="08 Sep 2026",
            event_type="GOVT_APPROVAL"
        )

    _sync_challenge_to_mongodb(challenge, created_milestones)


def _seed_dashboard_image_problems():
    """
    Seeds the 5 specific problems from the user's dashboard image into DB and MongoDB.
    """
    sample_problems = [
        {
            "problem_id": "CHL-2026-00101",
            "title": "Waterlogging near Government School",
            "description": "Severe rainwater stagnation in the entrance street of Government High School, causing safety hazards.",
            "category": "Water Management",
            "district": "Jamshedpur",
            "block": "Golmuri",
            "status": "IN_PROGRESS",
            "priority": "HIGH",
            "urgency_score": 8.7,
            "assigned_university": "Birsa Agricultural University",
            "citizen_name": "Shruti Sinha"
        },
        {
            "problem_id": "CHL-2026-00102",
            "title": "Broken street light on main road",
            "description": "Street lighting non-functional on 2km stretch of main bypass road creating night safety issues.",
            "category": "Infrastructure",
            "district": "Ranchi",
            "block": "Kanke",
            "status": "UNDER_REVIEW",
            "priority": "MEDIUM",
            "urgency_score": 6.5,
            "assigned_university": "Under Scrutiny",
            "citizen_name": "Shruti Sinha"
        },
        {
            "problem_id": "CHL-2026-00103",
            "title": "Garbage accumulation in residential area",
            "description": "Overflowing waste dump near residential colony causing hygiene issues.",
            "category": "Waste Management",
            "district": "Dhanbad",
            "block": "Jharia",
            "status": "UNDER_REVIEW",
            "priority": "MEDIUM",
            "urgency_score": 7.0,
            "assigned_university": "Under Scrutiny",
            "citizen_name": "Shruti Sinha"
        },
        {
            "problem_id": "CHL-2026-00104",
            "title": "Lack of clean drinking water facility",
            "description": "Community tubewell water contains high iron content. Villagers require community filtration unit.",
            "category": "Water & Sanitation",
            "district": "Hazaribagh",
            "block": "Barhi",
            "status": "OPEN",
            "priority": "HIGH",
            "urgency_score": 8.9,
            "assigned_university": "BIT Mesra",
            "citizen_name": "Shruti Sinha"
        },
        {
            "problem_id": "CHL-2026-00105",
            "title": "Poor condition of village road",
            "description": "Unpaved link road washed out during monsoon disconnecting village from state highway.",
            "category": "Roads & Transport",
            "district": "Latehar",
            "block": "Mahuadanr",
            "status": "RESOLVED",
            "priority": "HIGH",
            "urgency_score": 9.1,
            "assigned_university": "NIT Jamshedpur",
            "citizen_name": "Shruti Sinha"
        }
    ]

    for p in sample_problems:
        c, created = Challenge.objects.get_or_create(
            problem_id=p["problem_id"],
            defaults=p
        )
        _ensure_milestones_exist(c)



# ==============================================================================
# 1. CITIZEN DASHBOARD & PROFILE ENDPOINTS
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def citizen_dashboard(request):
    """
    Returns exact Citizen Dashboard data aligning with Hack Forge Jharkhand UI:
    - User Profile & Header Info
    - 4 KPI cards (Total, Under Review, In Progress, Completed) calculated dynamically per user
    - 4-Step Quick Action Guide
    - Recent Notifications Feed
    - Your Reported Problems Table with Milestone Tracking Triggers
    """
    citizen_user = request.user if request.user.is_authenticated else None
    profile = _get_user_citizen(request)
    full_name = profile.full_name if profile else (
        f"{request.user.first_name} {request.user.last_name}".strip()
        if (request.user.is_authenticated and request.user.first_name)
        else (request.user.username if request.user.is_authenticated else "Citizen User")
    )
    user_email = request.user.email if request.user.is_authenticated else ""
    user_id = str(request.user.id) if request.user.is_authenticated else ""

    badge_map = {
        'Water Management': 'bg-blue-50 text-blue-600 border border-blue-200',
        'Infrastructure': 'bg-amber-50 text-amber-600 border border-amber-200',
        'Waste Management': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        'Water & Sanitation': 'bg-cyan-50 text-cyan-600 border border-cyan-200',
        'Roads & Transport': 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200',
        'Rural Infrastructure': 'bg-amber-50 text-amber-600 border border-amber-200',
        'Health & MedTech': 'bg-rose-50 text-rose-600 border border-rose-200',
        'Smart Education': 'bg-indigo-50 text-indigo-600 border border-indigo-200',
        'Clean Energy': 'bg-teal-50 text-teal-600 border border-teal-200',
        'Agriculture & FoodTech': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    }
    status_badge_map = {
        'UNDER_REVIEW': 'bg-amber-50 text-amber-600 border border-amber-200',
        'OPEN': 'bg-blue-50 text-blue-600 border border-blue-200',
        'ASSIGNED_TO_HEI': 'bg-teal-50 text-teal-600 border border-teal-200',
        'IN_PROGRESS': 'bg-purple-50 text-purple-600 border border-purple-200',
        'RESOLVED': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        'COMPLETED': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    }

    mongo_challenges = []
    if citizen_user:
        try:
            from mongoengine.queryset.visitor import Q as MQ
            user_filters = []
            if full_name and full_name != "Citizen User":
                user_filters.append(MQ(citizen_name=full_name))
            if user_email:
                user_filters.append(MQ(citizen_name=user_email))
            if hasattr(citizen_user, 'username') and citizen_user.username:
                user_filters.append(MQ(citizen_name=citizen_user.username))

            if user_filters:
                combined_filter = user_filters[0]
                for f in user_filters[1:]:
                    combined_filter = combined_filter | f
                mongo_challenges = list(MongoChallenge.objects(combined_filter).order_by('-created_at'))
            else:
                mongo_challenges = []
        except Exception as e:
            print(f"[MONGODB DASHBOARD ERROR] {e}")
            mongo_challenges = []

    db_total = len(mongo_challenges)
    db_under_review = sum(1 for c in mongo_challenges if getattr(c, 'status', '') in ['UNDER_REVIEW', 'OPEN', 'PENDING_REVIEW'])
    db_in_progress = sum(1 for c in mongo_challenges if getattr(c, 'status', '') in ['IN_PROGRESS', 'ASSIGNED_TO_HEI'])
    db_completed = sum(1 for c in mongo_challenges if getattr(c, 'status', '') in ['RESOLVED', 'COMPLETED'])

    reported_problems = []
    for idx, c in enumerate(mongo_challenges):
        prob_id = c.problem_id or str(c.id)
        milestones, _ = _get_milestones_and_timeline_for_challenge(c, None, prob_id)
        completed_count = sum(1 for m in milestones if m.get('status') == 'COMPLETED')
        total_count = len(milestones) or (3 if getattr(c, 'status', '') in ['REJECTED', 'DUPLICATE', 'FAKE', 'INVALID'] else 8)
        progress_pct = int((completed_count / max(1, total_count)) * 100)

        current_m = "Report submitted"
        for m in milestones:
            if m.get('status') in ['IN_PROGRESS', 'PENDING']:
                current_m = m.get('title')
                break
        if completed_count == total_count:
            current_m = milestones[-1].get('title') if milestones else "Problem Solved"

        reported_problems.append({
            "id": idx + 1,
            "problem_id": prob_id,
            "title": c.title,
            "location": f"{getattr(c, 'district', 'Ranchi')}, Jharkhand",
            "category": c.category,
            "category_badge": badge_map.get(c.category, 'bg-blue-50 text-blue-600 border border-blue-200'),
            "status": c.status.replace('_', ' ').title() if getattr(c, 'status', '') else "Under Review",
            "status_badge": status_badge_map.get(getattr(c, 'status', ''), 'bg-amber-50 text-amber-600 border border-amber-200'),
            "thumbnail": c.media_urls[0] if getattr(c, 'media_urls', None) and len(c.media_urls) > 0 else "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=150&auto=format&fit=crop&q=80",
            "assigned_university": getattr(c, 'assigned_university', None) or "Pending Assignment",
            "progress_percent": progress_pct,
            "milestones_completed": f"{completed_count} / {total_count}",
            "current_milestone": current_m,
            "tracking_url": f"/api/citizens/tracking/{prob_id}/",
            "created_at": c.created_at.strftime("%Y-%m-%d") if getattr(c, 'created_at', None) and hasattr(c.created_at, 'strftime') else "2026-09-23"
        })

    recent_notifications = []
    for problem in reported_problems[:4]:
        recent_notifications.append({
            "id": problem["id"],
            "title": f"Report: {problem['title']}",
            "message": f"Status is {problem['status']} — Milestone: {problem['current_milestone']}",
            "time_ago": "Recently",
            "type": "STATUS_UPDATE",
            "color": "emerald" if "Completed" in problem['status'] else "blue"
        })

    return Response({
        "full_name": full_name,
        "role": "Citizen",
        "greeting": f"Hello, {full_name}!",
        "tagline": "Together we can create solutions for a better tomorrow.",
        "slogan": "A Greener Jharkhand for a Brighter Future",
        "notification_count": len(recent_notifications),
        "kpi_metrics": {
            "total_reports": db_total,
            "under_review": db_under_review,
            "in_progress": db_in_progress,
            "completed": db_completed
        },
        "reported_problems": reported_problems,
        "tracking_workflow": {
            "standard_8_stages": [
                {"stage": 1, "title": "Report submitted"},
                {"stage": 2, "title": "Under AI Analysis"},
                {"stage": 3, "title": "Government Validation"},
                {"stage": 4, "title": "University Assigned"},
                {"stage": 5, "title": "Project Started"},
                {"stage": 6, "title": "Research/ Development"},
                {"stage": 7, "title": "Solution Deployed"},
                {"stage": 8, "title": "Problem Solved"}
            ],
            "rejected_duplicate_3_stages": [
                {"stage": 1, "title": "Report Submitted"},
                {"stage": 2, "title": "Under AI Analysis"},
                {"stage": 3, "title": "Government Rejected"}
            ]
        },
        "recent_notifications": recent_notifications,
        "quick_steps": [
            {"step": 1, "title": "Add Location", "desc": "Help us identify the exact area", "icon": "MapPin"},
            {"step": 2, "title": "Describe the Issue", "desc": "Provide details and upload photos (if any)", "icon": "FileText"},
            {"step": 3, "title": "Select Category", "desc": "Choose the relevant problem type", "icon": "Grid"},
            {"step": 4, "title": "Submit", "desc": "Your report will be analyzed by AI", "icon": "Send"}
        ],
        "sidebar_promo": {
            "title": "Your voice matters",
            "subtitle": "Help build a better, more sustainable Jharkhand."
        },
        "bottom_promos": [
            {
                "title": "Small actions create big changes",
                "desc": "Your reports help universities find real solutions and build a sustainable Jharkhand."
            },
            {
                "title": "Have a question or need help?",
                "desc": "Reach out to our support team"
            }
        ]
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
@permission_classes([permissions.AllowAny])
def citizen_profile_view(request):
    profile = _get_user_citizen(request)
    if not profile:
        profile = CitizenProfile.objects.first()
        if not profile:
            return Response({"error": "No citizen profile found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(CitizenProfileSerializer(profile).data)

    elif request.method == 'PUT':
      serializer = CitizenProfileSerializer(profile, data=request.data, partial=True)

    if serializer.is_valid():
        p = serializer.save()

        # Sync updated citizen profile to MongoDB
        if request.user.is_authenticated:
            try:
                from database_service import sync_user_to_mongodb
                sync_user_to_mongodb(request.user, p)
                print("[MONGODB] Citizen profile synced successfully")
            except Exception as e:
                print(f"[MONGODB PROFILE SYNC WARNING] {e}")

        return Response(CitizenProfileSerializer(p).data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def my_reports(request):
    """
    My Reports Sidebar Tab (/api/citizens/my-reports/)
    Returns list of citizen's reported problems with search, status filters,
    and progress tracking summary matching 'My Reports' view.
    MongoDB Atlas is primary source of truth.
    """
    citizen_user = request.user if request.user.is_authenticated else None
    profile = _get_user_citizen(request)
    full_name = profile.full_name if profile else (
        f"{request.user.first_name} {request.user.last_name}".strip()
        if (request.user.is_authenticated and request.user.first_name)
        else (request.user.username if request.user.is_authenticated else "")
    )
    user_email = request.user.email if request.user.is_authenticated else ""
    user_id = str(request.user.id) if request.user.is_authenticated else ""

    badge_map = {
        'Water Management': 'bg-blue-50 text-blue-600 border border-blue-200',
        'Infrastructure': 'bg-amber-50 text-amber-600 border border-amber-200',
        'Waste Management': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        'Water & Sanitation': 'bg-cyan-50 text-cyan-600 border border-cyan-200',
        'Roads & Transport': 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200',
        'Rural Infrastructure': 'bg-amber-50 text-amber-600 border border-amber-200',
        'Health & MedTech': 'bg-rose-50 text-rose-600 border border-rose-200',
        'Smart Education': 'bg-indigo-50 text-indigo-600 border border-indigo-200',
        'Clean Energy': 'bg-teal-50 text-teal-600 border border-teal-200',
        'Agriculture & FoodTech': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    }

    q = request.query_params.get('q') or request.query_params.get('search')
    status_filter = request.query_params.get('status')

    mongo_challenges = []
    if citizen_user:
        try:
            from mongoengine.queryset.visitor import Q as MQ
            user_filters = []
            if full_name:
                user_filters.append(MQ(citizen_name=full_name))
            if user_email:
                user_filters.append(MQ(citizen_name=user_email))
            if hasattr(citizen_user, 'username') and citizen_user.username:
                user_filters.append(MQ(citizen_name=citizen_user.username))

            if user_filters:
                combined_filter = user_filters[0]
                for f in user_filters[1:]:
                    combined_filter = combined_filter | f
                qs = MongoChallenge.objects(combined_filter).order_by('-created_at')

                if q:
                    qs = qs.filter(
                        MQ(title__icontains=q) |
                        MQ(description__icontains=q) |
                        MQ(category__icontains=q) |
                        MQ(district__icontains=q)
                    )

                if status_filter and status_filter.upper() != 'ALL':
                    sf = status_filter.upper()
                    if sf in ['UNDER_REVIEW', 'UNDER REVIEW']:
                        qs = qs.filter(status='UNDER_REVIEW')
                    elif sf in ['IN_PROGRESS', 'IN PROGRESS']:
                        qs = qs.filter(status='IN_PROGRESS')
                    elif sf in ['ASSIGNED', 'ASSIGNED_TO_HEI']:
                        qs = qs.filter(status__in=['ASSIGNED_TO_HEI', 'OPEN'])
                    elif sf in ['COMPLETED', 'RESOLVED']:
                        qs = qs.filter(status='RESOLVED')
                    elif sf in ['REJECTED', 'DUPLICATE', 'FAKE']:
                        qs = qs.filter(status__in=['REJECTED', 'DUPLICATE', 'FAKE', 'INVALID'])
                    else:
                        qs = qs.filter(status=sf)

                mongo_challenges = list(qs)
        except Exception as e:
            print(f"[MONGODB MY_REPORTS WARNING] {e}")
            mongo_challenges = []

    results = []
    for c in mongo_challenges:
        prob_id = c.problem_id or str(c.id)
        milestones, _ = _get_milestones_and_timeline_for_challenge(c, None, prob_id)
        completed_count = sum(1 for m in milestones if m.get('status') == 'COMPLETED')
        total_count = len(milestones) or (3 if getattr(c, 'status', '') in ['REJECTED', 'DUPLICATE', 'FAKE', 'INVALID'] else 8)
        progress_pct = int((completed_count / max(1, total_count)) * 100)

        current_m = "Report submitted"
        for m in milestones:
            if m.get('status') in ['IN_PROGRESS', 'PENDING']:
                current_m = m.get('title')
                break
        if completed_count == total_count:
            current_m = milestones[-1].get('title') if milestones else "Problem Solved"

        loc_str = f"{getattr(c, 'block', '')}, {getattr(c, 'district', '')}".strip(", ") or f"{getattr(c, 'district', 'Ranchi')}, Jharkhand"

        results.append({
            "id": str(c.id),
            "problem_id": prob_id,
            "title": c.title,
            "description": c.description,
            "category": c.category,
            "category_badge": badge_map.get(c.category, 'bg-gray-50 text-gray-600 border border-gray-200'),
            "district": c.district,
            "location": loc_str,
            "status": c.status,
            "priority": c.priority,
            "urgency_score": c.urgency_score,
            "assigned_university": getattr(c, 'assigned_university', None) or "Pending Assignment",
            "progress_percent": progress_pct,
            "milestones_completed": f"{completed_count} / {total_count}",
            "current_milestone": current_m,
            "is_rejected_workflow": (total_count == 3),
            "tracking_url": f"/api/citizens/tracking/{prob_id}/",
            "milestones": milestones,
            "created_at": c.created_at.strftime("%Y-%m-%d") if getattr(c, 'created_at', None) and hasattr(c.created_at, 'strftime') else str(c.created_at)
        })

    return Response(results, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def citizen_support_view(request):
    """
    Help & Support Sidebar Tab (/api/citizens/support/)
    - GET: Helpline numbers, official nodal email, FAQs, and office hours.
    - POST: Submits a citizen grievance / support ticket and syncs to MongoDB Atlas.
    """
    if request.method == 'GET':
        return Response({
            "support_channels": {
                "helpline_toll_free": "1800-345-6789",
                "nodal_email": "support@solvesphere.gov.in",
                "directorate": "Jharkhand State Civic & Innovation Support Cell",
                "operating_hours": "09:00 AM - 06:00 PM IST (Mon - Sat)",
                "emergency_civic_helpline": "112"
            },
            "faqs": [
                {
                    "question": "How long does AI analysis take after submitting a problem?",
                    "answer": "AI scrutiny runs immediately upon submission, evaluating urgency, domain category, duplicate reports, and technical feasibility within seconds."
                },
                {
                    "question": "How are universities assigned to solve civic problems?",
                    "answer": "The Government Nodal Officer matches the domain and required expertise to accredited Higher Education Institutions (HEIs) like BIT Mesra, NIT Jamshedpur, IIT ISM Dhanbad, and BAU."
                },
                {
                    "question": "Can I track physical milestone progress of my submitted report?",
                    "answer": "Yes! Every report has a 6-stage milestone tracker with verified photo/document proof from the field and real-time timeline event logs."
                },
                {
                    "question": "How can I verify when a project is completed?",
                    "answer": "Once the final stage is reached, citizens can submit their satisfaction rating and confirm resolution directly in the portal."
                }
            ]
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        data = request.data
        user = request.user if request.user.is_authenticated else None
        full_name = data.get('full_name') or (f"{request.user.first_name} {request.user.last_name}".strip() if user else "Shruti Sinha")
        email = data.get('email') or (user.email if user else "citizen@solvesphere.gov.in")
        phone = data.get('phone', '')
        subject = data.get('subject', 'Support Inquiry')
        message = data.get('message', '')

        if not message:
            return Response({"error": "Message content is required"}, status=status.HTTP_400_BAD_REQUEST)

        ticket_id = f"TKT-2026-{random.randint(1000, 9999)}"

        if get_db:
            try:
                get_db()["support_inquiries"].insert_one({
                    "ticket_id": ticket_id,
                    "full_name": full_name,
                    "email": email,
                    "phone": phone,
                    "subject": subject,
                    "message": message,
                    "status": "OPEN",
                    "created_at": timezone.now().isoformat() if hasattr(timezone, 'now') else "2026-09-11T14:00:00Z"
                })
            except Exception as e:
                print(f"[MONGODB SUPPORT SYNC WARNING]: {e}")

        return Response({
            "message": "Your support request has been registered successfully! Our team will get back to you shortly.",
            "ticket_id": ticket_id,
            "inquiry": {
                "ticket_id": ticket_id,
                "full_name": full_name,
                "email": email,
                "phone": phone,
                "subject": subject,
                "message": message,
                "status": "OPEN"
            }
        }, status=status.HTTP_201_CREATED)



@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def citizen_all_tracking_list(request):
    """
    Returns all reported problems with their milestone progress and tracking overview:
    - Standard 8-Stage Progress
    - Duplicate / Fake 3-Stage Rejection Progress
    MongoDB Atlas is primary source of truth.
    """
    results = []
    mongo_challenges = []
    try:
        mongo_challenges = list(MongoChallenge.objects.all().order_by('-created_at'))
    except Exception as e:
        print(f"[MONGODB TRACKING WARNING] {e}")

    if mongo_challenges:
        for c in mongo_challenges:
            prob_id = c.problem_id or str(c.id)
            milestones, _ = _get_milestones_and_timeline_for_challenge(c, None, prob_id)
            completed_count = sum(1 for m in milestones if m.get('status') == 'COMPLETED')
            total_count = len(milestones) or (3 if c.status in ['REJECTED', 'DUPLICATE', 'FAKE', 'INVALID'] else 8)
            progress_pct = int((completed_count / max(1, total_count)) * 100)

            current_m = "Report submitted"
            for m in milestones:
                if m.get('status') in ['IN_PROGRESS', 'PENDING']:
                    current_m = m.get('title')
                    break
            if completed_count == total_count:
                current_m = milestones[-1].get('title') if milestones else ("Government Rejected" if total_count == 3 else "Problem Solved")

            loc_str = f"{getattr(c, 'block', '')}, {getattr(c, 'district', '')}".strip(", ") or getattr(c, 'district', 'Ranchi')

            results.append({
                "id": str(c.id),
                "problem_id": prob_id,
                "title": c.title,
                "category": c.category,
                "district": c.district,
                "location": loc_str,
                "status": c.status,
                "priority": c.priority,
                "urgency_score": c.urgency_score,
                "assigned_university": c.assigned_university or ("Under Scrutiny" if c.status in ['REJECTED', 'DUPLICATE', 'FAKE'] else "Pending Assignment"),
                "progress_percent": progress_pct,
                "milestones_completed": f"{completed_count} / {total_count}",
                "current_milestone": current_m,
                "workflow_type": "REJECTED_3_STAGE" if total_count == 3 else "STANDARD_8_STAGE",
                "is_rejected_workflow": (total_count == 3),
                "milestones": milestones,
                "created_at": c.created_at.strftime("%Y-%m-%d") if hasattr(c.created_at, 'strftime') else str(c.created_at)
            })
    else:
        _seed_dashboard_image_problems()
        challenges = Challenge.objects.all().order_by('-created_at')
        for c in challenges:
            _ensure_milestones_exist(c)
            milestones = CitizenMilestoneRecordSerializer(c.milestone_records.all(), many=True).data
            completed_count = sum(1 for m in milestones if m.get('status') == 'COMPLETED')
            total_count = len(milestones) or (3 if c.status in ['REJECTED', 'DUPLICATE', 'FAKE', 'INVALID'] else 8)
            progress_pct = int((completed_count / total_count) * 100)

            current_m = "Report submitted"
            for m in milestones:
                if m.get('status') in ['IN_PROGRESS', 'PENDING']:
                    current_m = m.get('title')
                    break
            if completed_count == total_count:
                current_m = milestones[-1].get('title') if milestones else ("Government Rejected" if total_count == 3 else "Problem Solved")

            results.append({
                "id": c.id,
                "problem_id": c.problem_id or f"CHL-2026-{c.id:05d}",
                "title": c.title,
                "category": c.category,
                "district": c.district,
                "location": f"{c.block}, {c.district}".strip(", ") or c.district,
                "status": c.status,
                "priority": c.priority,
                "urgency_score": c.urgency_score,
                "assigned_university": c.assigned_university or ("Under Scrutiny" if c.status in ['REJECTED', 'DUPLICATE', 'FAKE'] else "Pending Assignment"),
                "progress_percent": progress_pct,
                "milestones_completed": f"{completed_count} / {total_count}",
                "current_milestone": current_m,
                "workflow_type": "REJECTED_3_STAGE" if total_count == 3 else "STANDARD_8_STAGE",
                "is_rejected_workflow": (total_count == 3),
                "milestones": milestones,
                "created_at": c.created_at.strftime("%Y-%m-%d") if hasattr(c.created_at, 'strftime') else str(c.created_at)
            })

    return Response({
        "count": len(results),
        "tracking_workflow_types": {
            "standard_8_stages": [
                "1. Report submitted",
                "2. Under AI Analysis",
                "3. Government Validation",
                "4. University Assigned",
                "5. Project Started",
                "6. Research/ Development",
                "7. Solution Deployed",
                "8. Problem Solved"
            ],
            "rejected_duplicate_3_stages": [
                "1. Report Submitted",
                "2. Under AI Analysis",
                "3. Government Rejected"
            ]
        },
        "tracking_records": results
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def problem_milestones_tracking(request, pk):
    """
    Comprehensive Live Milestone & Project Progress Tracking for a single problem.
    Accepts integer ID (e.g. 1) or Problem ID (e.g. 'CHL-2026-00101') or MongoDB ObjectId.
    MongoDB Atlas is primary source of truth.
    """
    mongo_c, sql_c, prob_id = _get_challenge_mongo_and_sql(pk)
    if not mongo_c and not sql_c:
        _seed_dashboard_image_problems()
        mongo_c, sql_c, prob_id = _get_challenge_mongo_and_sql(pk)
    if not mongo_c and not sql_c:
        try:
            mongo_c = MongoChallenge.objects.first()
            if mongo_c:
                prob_id = mongo_c.problem_id or str(mongo_c.id)
        except Exception:
            pass
        if not mongo_c:
            sql_c = Challenge.objects.first()
            if sql_c:
                prob_id = sql_c.problem_id or f"CHL-2026-{sql_c.id:05d}"

    if not mongo_c and not sql_c:
        return Response({"error": "Problem not found"}, status=status.HTTP_404_NOT_FOUND)

    milestones_data, timeline_data = _get_milestones_and_timeline_for_challenge(mongo_c, sql_c, prob_id)
    c_status = getattr(mongo_c, 'status', None) or (getattr(sql_c, 'status', 'OPEN') if sql_c else 'OPEN')
    assigned_uni = (getattr(mongo_c, 'assigned_university', None) if mongo_c else None) or (getattr(sql_c, 'assigned_university', None) if sql_c else None) or "Birsa Agricultural University"

    completed_stages = sum(1 for m in milestones_data if m.get('status') == 'COMPLETED')
    total_stages = len(milestones_data) or (3 if c_status in ['REJECTED', 'DUPLICATE', 'FAKE', 'INVALID'] else 8)
    progress_percent = int((completed_stages / max(1, total_stages)) * 100)
    is_rejected = (total_stages == 3 or c_status in ['REJECTED', 'DUPLICATE', 'FAKE', 'INVALID'])

    university_info = {
        "name": assigned_uni if not is_rejected else "Not Applicable (Rejected)",
        "faculty_mentor": "Dr. Arvind Kumar" if not is_rejected else "N/A",
        "department": "Civil & Environmental Engineering" if not is_rejected else "N/A",
        "team_lead": "Rahul Soren (M.Tech Researcher)" if not is_rejected else "N/A",
        "contact_email": "r.soren@baujharkhand.ac.in" if not is_rejected else "support@solvesphere.gov.in"
    }

    industry_info = {
        "name": "ABC Technologies Ltd. / Tata Steel CSR" if not is_rejected else "N/A",
        "role": "Corporate CSR & Tech Mentorship Partner" if not is_rejected else "N/A",
        "grant_amount": "₹2,50,000" if not is_rejected else "₹0",
        "support": "IoT Cloud Gateway & Field Engineering" if not is_rejected else "N/A"
    }

    feedback_data = []
    if get_db:
        try:
            db = get_db()
            feedbacks = list(db["citizen_feedbacks"].find({"problem_id": prob_id}, {"_id": 0}))
            feedback_data = feedbacks
        except Exception:
            pass
    if not feedback_data and sql_c:
        feedback_data = CitizenFeedbackSerializer(sql_c.feedbacks.all(), many=True).data

    current_milestone_title = "Report submitted"
    for m in milestones_data:
        if m.get('status') in ['IN_PROGRESS', 'PENDING']:
            current_milestone_title = m.get('title')
            break
    if completed_stages == total_stages and milestones_data:
        current_milestone_title = milestones_data[-1].get('title')

    title = getattr(mongo_c, 'title', '') if mongo_c else (getattr(sql_c, 'title', '') if sql_c else '')
    desc = getattr(mongo_c, 'description', '') if mongo_c else (getattr(sql_c, 'description', '') if sql_c else '')
    cat = getattr(mongo_c, 'category', '') if mongo_c else (getattr(sql_c, 'category', '') if sql_c else '')
    dist = getattr(mongo_c, 'district', '') if mongo_c else (getattr(sql_c, 'district', '') if sql_c else '')
    blk = getattr(mongo_c, 'block', '') if mongo_c else (getattr(sql_c, 'block', '') if sql_c else '')
    vil = getattr(mongo_c, 'village', '') if mongo_c else (getattr(sql_c, 'village', '') if sql_c else '')
    prio = getattr(mongo_c, 'priority', 'MEDIUM') if mongo_c else (getattr(sql_c, 'priority', 'MEDIUM') if sql_c else 'MEDIUM')
    urg = getattr(mongo_c, 'urgency_score', 5.0) if mongo_c else (getattr(sql_c, 'urgency_score', 5.0) if sql_c else 5.0)
    c_id = str(mongo_c.id) if mongo_c else getattr(sql_c, 'id', 1)

    response_payload = {
        "id": c_id,
        "problem_id": prob_id,
        "title": title,
        "description": desc,
        "category": cat,
        "district": dist,
        "location": f"{blk}, {dist}".strip(", ") or dist,
        "status": c_status,
        "priority": prio,
        "urgency_score": urg,
        "workflow_type": "REJECTED_3_STAGE" if is_rejected else "STANDARD_8_STAGE",
        "is_rejected_workflow": is_rejected,
        "progress_percent": progress_percent,
        "current_milestone": current_milestone_title,
        "milestones_summary": f"{completed_stages} / {total_stages} Stages Completed",
        "assigned_university": university_info,
        "industry_partner": industry_info,
        "milestones": milestones_data,
        "recent_updates": timeline_data,
        "feedbacks": feedback_data,
        "is_verified_by_citizen": any(f.get('was_solved') == 'Yes' for f in feedback_data) if feedback_data else (sql_c.feedbacks.filter(was_solved='Yes').exists() if sql_c else False)
    }

    if sql_c:
        _sync_challenge_to_mongodb(sql_c, milestones_data, timeline_data)

    return Response(response_payload, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def problem_milestone_list(request, pk):
    """
    Returns the array of milestones for a problem from MongoDB tracking_milestones.
    """
    mongo_c, sql_c, prob_id = _get_challenge_mongo_and_sql(pk)
    if not mongo_c and not sql_c:
        return Response({"error": "Problem not found"}, status=status.HTTP_404_NOT_FOUND)

    milestones_data, _ = _get_milestones_and_timeline_for_challenge(mongo_c, sql_c, prob_id)
    return Response({
        "problem_id": prob_id,
        "milestones": milestones_data
    }, status=status.HTTP_200_OK)


@api_view(['POST', 'PUT'])
@permission_classes([permissions.AllowAny])
def update_milestone_status(request, pk, stage_number):
    """
    Updates status and proof for a specific milestone stage.
    MongoDB Atlas tracking_milestones is primary source of truth.
    """
    mongo_c, sql_c, prob_id = _get_challenge_mongo_and_sql(pk)
    if not mongo_c and not sql_c:
        return Response({"error": "Problem not found"}, status=status.HTTP_404_NOT_FOUND)

    milestones_data, timeline_data = _get_milestones_and_timeline_for_challenge(mongo_c, sql_c, prob_id)
    target_m = None
    for m in milestones_data:
        if m.get('stage_number') == int(stage_number):
            target_m = m
            break

    if not target_m:
        return Response({"error": f"Milestone stage {stage_number} not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    if 'status' in data:
        target_m['status'] = data['status'].upper()
    if 'completed_date' in data:
        target_m['completed_date'] = data['completed_date']
    if 'proof_label' in data:
        target_m['proof_label'] = data['proof_label']
    if 'proof_url' in data:
        target_m['proof_url'] = data['proof_url']
    if 'assigned_stakeholder' in data:
        target_m['assigned_stakeholder'] = data['assigned_stakeholder']

    # Update challenge status progression
    new_status = None
    if int(stage_number) in [6, 8] and target_m.get('status') == 'COMPLETED':
        new_status = 'RESOLVED'
    elif int(stage_number) >= 3 and target_m.get('status') == 'COMPLETED':
        current_status = getattr(mongo_c, 'status', None) or (getattr(sql_c, 'status', 'OPEN') if sql_c else 'OPEN')
        if current_status == 'OPEN':
            new_status = 'IN_PROGRESS'

    if new_status:
        if mongo_c:
            mongo_c.status = new_status
            mongo_c.save()
        if sql_c:
            sql_c.status = new_status
            sql_c.save()

    # Save to MongoDB Atlas tracking_milestones
    if get_db:
        try:
            db = get_db()
            db["tracking_milestones"].update_one(
                {"problem_id": prob_id},
                {"$set": {"milestones": milestones_data}},
                upsert=True
            )
        except Exception as e:
            print(f"[MONGODB MILESTONE UPDATE WARNING] {e}")

    # Also update SQLite if sql_c exists
    if sql_c:
        m_rec = sql_c.milestone_records.filter(stage_number=stage_number).first()
        if m_rec:
            if 'status' in data:
                m_rec.status = data['status'].upper()
            if 'completed_date' in data:
                m_rec.completed_date = data['completed_date']
            if 'proof_label' in data:
                m_rec.proof_label = data['proof_label']
            if 'proof_url' in data:
                m_rec.proof_url = data['proof_url']
            if 'assigned_stakeholder' in data:
                m_rec.assigned_stakeholder = data['assigned_stakeholder']
            m_rec.save()

    return Response({
        "message": f"Milestone stage {stage_number} updated successfully",
        "milestone": target_m
    }, status=status.HTTP_200_OK)


# ==============================================================================
# 3. REPORT PROBLEM & EVIDENCE
# ==============================================================================
@api_view(['POST', 'GET'])
@permission_classes([permissions.AllowAny])
def report_problem(request):
    """
    Citizen Reports a Problem.
    MongoDB Atlas is the primary database.
    Existing API endpoint remains unchanged.
    """

    # ============================================================
    # GET - Fetch citizen problems from MongoDB
    # ============================================================
    if request.method == 'GET':
        try:
            mongo_query = {}

            status_filter = request.query_params.get('status')

            if status_filter:
                status_filter = status_filter.lower()

                if status_filter == 'under_review':
                    mongo_query['status'] = 'UNDER_REVIEW'

                elif status_filter == 'approved':
                    mongo_query['status__in'] = [
                        'OPEN',
                        'ASSIGNED_TO_HEI'
                    ]

                elif status_filter == 'in_progress':
                    mongo_query['status'] = 'IN_PROGRESS'

                elif status_filter == 'resolved':
                    mongo_query['status'] = 'RESOLVED'

            # MongoDB is the primary source
            if 'status__in' in mongo_query:
                challenges = MongoChallenge.objects(
                    status__in=mongo_query['status__in']
                ).order_by('-created_at')
            else:
                challenges = MongoChallenge.objects(
                    **mongo_query
                ).order_by('-created_at')

            problems = []

            for challenge in challenges:
                problems.append({
                    "id": str(challenge.id),
                    "problem_id": challenge.problem_id,
                    "title": challenge.title,
                    "description": challenge.description,
                    "category": challenge.category,
                    "district": challenge.district,
                    "block": challenge.block,
                    "village": challenge.village,
                    "pin_code": challenge.pin_code,
                    "latitude": (
                        challenge.location.get('coordinates', [0, 0])[1]
                        if challenge.location
                        else None
                    ),
                    "longitude": (
                        challenge.location.get('coordinates', [0, 0])[0]
                        if challenge.location
                        else None
                    ),
                    "status": challenge.status,
                    "priority": challenge.priority,
                    "urgency_score": challenge.urgency_score,
                    "required_expertise": challenge.required_expertise,
                    "assigned_university": challenge.assigned_university,
                    "citizen_name": challenge.citizen_name,
                    "citizen_phone": challenge.citizen_phone,
                    "is_anonymous": challenge.is_anonymous,
                    "media_urls": challenge.media_urls,
                    "upvotes": challenge.upvotes,
                    "created_at": challenge.created_at
                })

            return Response({
                "count": len(problems),
                "problems": problems
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"[MONGODB GET ERROR] {e}")

            return Response({
                "error": "Unable to fetch problems from MongoDB",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # ============================================================
    # POST - Create new citizen problem in MongoDB
    # ============================================================
    elif request.method == 'POST':

        data = request.data

        title = data.get('title')
        description = data.get('description')
        district = data.get('district', 'Ranchi')
        block = data.get('block', '')
        village = data.get('village', '')
        pin_code = data.get('pin_code', '')
        category_input = data.get(
            'category',
            'Water Management'
        )

        try:
            lat = float(data.get('latitude', 23.3441))
            lng = float(data.get('longitude', 85.3096))
        except (TypeError, ValueError):
            return Response({
                "error": "Invalid latitude or longitude"
            }, status=status.HTTP_400_BAD_REQUEST)

        if not title or not description:
            return Response({
                "error": "title and description are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        # --------------------------------------------------------
        # Citizen information
        # --------------------------------------------------------
        citizen_user = (
            request.user
            if request.user.is_authenticated
            else None
        )

        citizen_name = data.get('citizen_name')

        if not citizen_name:
            if citizen_user:
                citizen_name = (
                    f"{citizen_user.first_name} "
                    f"{citizen_user.last_name}"
                ).strip()

                if not citizen_name:
                    citizen_name = citizen_user.username
            else:
                citizen_name = "Anonymous"

        citizen_phone = data.get('citizen_phone', '')
        is_anonymous = data.get('is_anonymous', False)

        # --------------------------------------------------------
        # Generate unique problem ID
        # --------------------------------------------------------
        rand_num = random.randint(10000, 99999)
        problem_id = f"CHL-2026-{rand_num}"

        # --------------------------------------------------------
        # AI Analysis
        # --------------------------------------------------------
        ai_res = analyze_citizen_problem(
            title=title,
            description=description,
            location_text=district,
            latitude=lat,
            longitude=lng
        )

        # --------------------------------------------------------
        # MongoDB Challenge
        # --------------------------------------------------------
        challenge = MongoChallenge(
            problem_id=problem_id,
            title=title,
            description=description,
            category=ai_res.get(
                'category',
                category_input
            ),
            district=district,
            block=block,
            village=village,
            pin_code=pin_code,

            location={
                "type": "Point",
                "coordinates": [lng, lat]
            },

            status='OPEN',

            priority=ai_res.get(
                'priority',
                'MEDIUM'
            ),

            urgency_score=float(
                ai_res.get(
                    'urgency_score',
                    5.0
                )
            ),

            required_expertise=ai_res.get(
                'required_expertise',
                []
            ),

            citizen_name=(
                "Anonymous"
                if is_anonymous
                else citizen_name
            ),

            citizen_phone=(
                ""
                if is_anonymous
                else citizen_phone
            ),

            is_anonymous=is_anonymous,

            media_urls=data.get(
                'media_urls',
                []
            )
        )

        challenge.save()

        print(
            f"[DATABASE] Challenge created in MongoDB Atlas: "
            f"{challenge.id}"
        )

        # --------------------------------------------------------
        # Save AI Analysis in MongoDB
        # --------------------------------------------------------
        ai_record = MongoAIAnalysisRecord(
            challenge_id=str(challenge.id),
            category=ai_res.get(
                'category',
                category_input
            ),
            priority=ai_res.get(
                'priority',
                'MEDIUM'
            ),
            urgency_score=float(
                ai_res.get(
                    'urgency_score',
                    5.0
                )
            ),
            duplicate_score=float(
                ai_res.get(
                    'duplicate_score',
                    0.0
                )
            ),
            matching_duplicate_id=ai_res.get(
                'matching_duplicate_id'
            ),
            required_expertise=ai_res.get(
                'required_expertise',
                []
            ),
            ai_summary=ai_res.get(
                'ai_summary',
                ''
            )
        )

        ai_record.save()

        # --------------------------------------------------------
        # Save embedding
        # --------------------------------------------------------
        try:
            from ai_engine.local_embeddings import get_embedding
            from ai_services.embeddings_store import save_embedding

            embedding = get_embedding(
                f"{title} {description}"
            )

            save_embedding(
                str(challenge.id),
                embedding,
                lat,
                lng
            )

            print(
                f"[EMBEDDING] Saved embedding for "
                f"{challenge.id}"
            )

        except Exception as emb_err:
            print(
                f"[Embedding Store Warning]: {emb_err}"
            )

        # --------------------------------------------------------
        # Response
        # --------------------------------------------------------
        problem_data = {
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
            "status": challenge.status,
            "priority": challenge.priority,
            "urgency_score": challenge.urgency_score,
            "required_expertise": challenge.required_expertise,
            "assigned_university": challenge.assigned_university,
            "citizen_name": challenge.citizen_name,
            "citizen_phone": challenge.citizen_phone,
            "is_anonymous": challenge.is_anonymous,
            "media_urls": challenge.media_urls,
            "upvotes": challenge.upvotes,
            "created_at": challenge.created_at
        }

        ai_analysis_data = {
            "id": str(ai_record.id),
            "challenge_id": ai_record.challenge_id,
            "category": ai_record.category,
            "priority": ai_record.priority,
            "urgency_score": ai_record.urgency_score,
            "duplicate_score": ai_record.duplicate_score,
            "matching_duplicate_id": ai_record.matching_duplicate_id,
            "required_expertise": ai_record.required_expertise,
            "ai_summary": ai_record.ai_summary,
            "created_at": ai_record.created_at
        }

        return Response({
            "message": "Problem submitted successfully!",
            "problem_id": problem_id,
            "ai_analysis": ai_analysis_data,
            "problem": problem_data
        }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def citizen_problem_detail(request, pk):
    """
    Returns complete citizen problem tracking details.
    MongoDB Atlas is the primary source.
    API endpoint remains unchanged.
    """

    try:
        # --------------------------------------------------------
        # Find challenge from MongoDB
        # --------------------------------------------------------
        challenge = None

        # Search by MongoDB ObjectId
        if not str(pk).isdigit():
            try:
                challenge = MongoChallenge.objects(
                    id=str(pk)
                ).first()
            except Exception:
                challenge = None

        # Search by CHL-2026-XXXXX problem_id
        if not challenge:
            challenge = MongoChallenge.objects(
                problem_id=str(pk)
            ).first()

        if not challenge:
            return Response(
                {"error": "Problem not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # --------------------------------------------------------
        # Get tracking document from MongoDB
        # --------------------------------------------------------
        db = MongoChallenge._get_collection().database

        tracking_doc = db["tracking_milestones"].find_one({
            "problem_id": challenge.problem_id
        })

        milestones = []
        timeline = []

        if tracking_doc:
            milestones = tracking_doc.get(
                "milestones",
                []
            )

            timeline = tracking_doc.get(
                "timeline",
                []
            )

        # --------------------------------------------------------
        # Get coordinates
        # --------------------------------------------------------
        latitude = None
        longitude = None

        if challenge.location:
            coordinates = challenge.location.get(
                "coordinates",
                []
            )

            if len(coordinates) >= 2:
                longitude = coordinates[0]
                latitude = coordinates[1]

        # --------------------------------------------------------
        # Build response
        # --------------------------------------------------------
        problem_data = {
            "id": str(challenge.id),
            "problem_id": challenge.problem_id,
            "title": challenge.title,
            "description": challenge.description,
            "category": challenge.category,
            "district": challenge.district,
            "block": challenge.block,
            "village": challenge.village,
            "pin_code": challenge.pin_code,

            "latitude": latitude,
            "longitude": longitude,

            "status": challenge.status,
            "priority": challenge.priority,
            "urgency_score": challenge.urgency_score,
            "required_expertise": challenge.required_expertise,

            "assigned_university": challenge.assigned_university,

            "citizen_name": challenge.citizen_name,
            "citizen_phone": challenge.citizen_phone,
            "is_anonymous": challenge.is_anonymous,

            "media_urls": challenge.media_urls,
            "upvotes": challenge.upvotes,

            "milestones": milestones,
            "timeline": timeline,

            "created_at": challenge.created_at
        }

        return Response(
            problem_data,
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print(
            f"[MONGODB PROBLEM DETAIL ERROR] {e}"
        )

        return Response(
            {
                "error": "Unable to fetch problem",
                "details": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def upload_evidence(request, pk):
    """
    Upload/store evidence for a citizen problem.
    MongoDB Atlas is the primary source.
    API endpoint remains unchanged.
    """

    try:
        # --------------------------------------------------------
        # Find challenge from MongoDB
        # --------------------------------------------------------
        challenge = None

        # Search by MongoDB ObjectId
        if not str(pk).isdigit():
            try:
                challenge = MongoChallenge.objects(
                    id=str(pk)
                ).first()
            except Exception:
                challenge = None

        # Search by CHL-2026-XXXXX problem_id
        if not challenge:
            challenge = MongoChallenge.objects(
                problem_id=str(pk)
            ).first()

        if not challenge:
            return Response(
                {"error": "Problem not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # --------------------------------------------------------
        # Evidence data
        # --------------------------------------------------------
        file_name = request.data.get(
            'file_name',
            'Evidence_Photo.jpg'
        )

        file_url = request.data.get(
            'file_url',
            'https://solvesphere.gov.in/evidence/photo_01.jpg'
        )

        file_type = request.data.get(
            'file_type',
            'IMAGE'
        ).upper()

        # --------------------------------------------------------
        # Store evidence in MongoDB
        #
        # Evidence is embedded inside the challenge document.
        # Existing fields are preserved.
        # --------------------------------------------------------
        evidence = {
            "file_name": file_name,
            "file_url": file_url,
            "file_type": file_type
        }

        collection = MongoChallenge._get_collection()

        collection.update_one(
            {"_id": challenge.id},
            {
                "$push": {
                    "evidence": evidence
                }
            }
        )

        # --------------------------------------------------------
        # Return the same evidence structure
        # --------------------------------------------------------
        return Response(
            evidence,
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        print(
            f"[MONGODB EVIDENCE ERROR] {e}"
        )

        return Response(
            {
                "error": "Unable to upload evidence",
                "details": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ==============================================================================
# 4. TIMELINE, CONNECTED PROJECT, FEEDBACK & NOTIFICATIONS
# ==============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def problem_timeline(request, pk):
    mongo_c, sql_c, prob_id = _get_challenge_mongo_and_sql(pk)
    if not mongo_c and not sql_c:
        return Response({"error": "Problem not found"}, status=status.HTTP_404_NOT_FOUND)

    _, timeline_data = _get_milestones_and_timeline_for_challenge(mongo_c, sql_c, prob_id)
    title = getattr(mongo_c, 'title', '') if mongo_c else (getattr(sql_c, 'title', '') if sql_c else '')
    dist = getattr(mongo_c, 'district', '') if mongo_c else (getattr(sql_c, 'district', '') if sql_c else '')
    st = getattr(mongo_c, 'status', 'OPEN') if mongo_c else (getattr(sql_c, 'status', 'OPEN') if sql_c else 'OPEN')

    return Response({
        "problem_id": prob_id,
        "title": title,
        "district": dist,
        "current_status": st,
        "timeline_events": timeline_data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def add_timeline_event(request, pk):
    mongo_c, sql_c, prob_id = _get_challenge_mongo_and_sql(pk)
    if not mongo_c and not sql_c:
        return Response({"error": "Problem not found"}, status=status.HTTP_404_NOT_FOUND)

    title = request.data.get('title', 'Progress Update')
    description = request.data.get('description', '')
    timestamp_text = request.data.get('timestamp_text', 'Just now')
    event_type = request.data.get('event_type', 'UPDATE')

    event_dict = {
        "title": title,
        "description": description,
        "timestamp_text": timestamp_text,
        "event_type": event_type,
        "created_at": timezone.now().isoformat()
    }

    if get_db:
        try:
            db = get_db()
            db["tracking_milestones"].update_one(
                {"problem_id": prob_id},
                {"$push": {"timeline": event_dict}},
                upsert=True
            )
        except Exception as e:
            print(f"[MONGODB TIMELINE ADD WARNING] {e}")

    if sql_c:
        try:
            CitizenTimelineEvent.objects.create(
                challenge=sql_c,
                title=title,
                description=description,
                timestamp_text=timestamp_text,
                event_type=event_type
            )
        except Exception:
            pass

    return Response(event_dict, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def connected_project(request, pk):
    mongo_c, sql_c, prob_id = _get_challenge_mongo_and_sql(pk)
    if not mongo_c and not sql_c:
        return Response({"error": "Problem not found"}, status=status.HTTP_404_NOT_FOUND)

    # 1. Look for MongoUniversityProject
    m_proj = None
    try:
        m_proj = MongoUniversityProject.objects(challenge_id=prob_id).first()
        if not m_proj and mongo_c:
            m_proj = MongoUniversityProject.objects(challenge_id=str(mongo_c.id)).first()
    except Exception:
        pass

    if m_proj:
        collab_partner = m_proj.active_industry_partner or "None"
        return Response({
            "problem_id": prob_id,
            "project_title": m_proj.title,
            "university_name": getattr(m_proj, 'university_id', 'Assigned University'),
            "faculty_mentor": "Faculty Mentor",
            "student_team_count": m_proj.team_size,
            "student_team": [f"Researcher {i+1}" for i in range(m_proj.team_size)],
            "industry_partner": collab_partner,
            "progress_percent": m_proj.progress_percent,
            "current_stage": m_proj.status,
        }, status=status.HTTP_200_OK)

    # 2. Fallback to SQLite UniversityProject
    project = None
    if sql_c:
        project = UniversityProject.objects.filter(challenge=sql_c).first()
    if not project:
        c_title = getattr(mongo_c, 'title', '') if mongo_c else (getattr(sql_c, 'title', '') if sql_c else '')
        c_uni = getattr(mongo_c, 'assigned_university', '') if mongo_c else (getattr(sql_c, 'assigned_university', '') if sql_c else '')
        return Response({
            "problem_id": prob_id,
            "title": c_title,
            "assigned_university": c_uni or "Pending University Assignment",
            "status": "Awaiting University Project Creation",
            "project": None
        }, status=status.HTTP_200_OK)

    collab = IndustryCollaborationWorkspace.objects.filter(project=project, status='ACCEPTED').first()

    return Response({
        "problem_id": prob_id,
        "project_title": project.title,
        "university_name": project.university.university_name,
        "faculty_mentor": project.faculty_mentor.name if project.faculty_mentor else "Faculty Mentor",
        "student_team_count": project.team_members.count(),
        "student_team": [f"{m.student_name} ({m.department})" for m in project.team_members.all()],
        "industry_partner": collab.industry.company_name if collab else (project.active_industry_partner or "None"),
        "progress_percent": project.progress_percent,
        "current_stage": project.status,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def citizen_impact_summary(request, pk=None):
    return Response({
        "impact_metrics": {
            "problem_solved": True,
            "solution_name": "Smart Community Water Filtration & Monitoring System",
            "deployment_status": "DEPLOYED",
            "beneficiaries_count": 2500,
            "villages_covered": 3,
            "water_quality_efficiency_gain": "+40%",
            "district": "Ranchi"
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def submit_citizen_feedback(request, pk):
    mongo_c, sql_c, prob_id = _get_challenge_mongo_and_sql(pk)
    if not mongo_c and not sql_c:
        return Response({"error": "Problem not found"}, status=status.HTTP_404_NOT_FOUND)

    citizen_user = request.user if request.user.is_authenticated else None
    rating = int(request.data.get('rating', 5))
    was_solved = request.data.get('was_solved', 'Yes')
    feedback_text = request.data.get('feedback_text', request.data.get('feedback', ''))
    c_name = getattr(citizen_user, 'username', None) or (getattr(mongo_c, 'citizen_name', None) if mongo_c else None) or "Anonymous"

    fb_doc = {
        "problem_id": prob_id,
        "rating": rating,
        "was_solved": was_solved,
        "feedback_text": feedback_text,
        "citizen_name": c_name,
        "created_at": timezone.now().isoformat()
    }

    if get_db:
        try:
            get_db()["citizen_feedbacks"].insert_one(fb_doc)
        except Exception as e:
            print(f"[MONGODB FEEDBACK WARNING] {e}")

    fb = None
    if sql_c:
        try:
            fb = CitizenFeedback.objects.create(
                challenge=sql_c,
                citizen=citizen_user or getattr(sql_c, 'citizen', None),
                rating=rating,
                was_solved=was_solved,
                feedback_text=feedback_text
            )
        except Exception:
            pass

    return Response({
        "message": "Citizen feedback recorded successfully",
        "feedback": {
            "problem_id": prob_id,
            "rating": rating,
            "was_solved": was_solved,
            "feedback_text": feedback_text
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def citizen_notifications(request):
    if not request.user.is_authenticated:
        return Response([
            {
                "id": 1,
                "title": "Your report has been submitted",
                "message": "Waterlogging near Government School, Jamshedpur",
                "notification_type": "SUBMITTED",
                "is_read": False,
                "created_at": "2026-09-11T09:00:00Z"
            },
            {
                "id": 2,
                "title": "AI analysis completed",
                "message": "Your report has been analyzed. Check the details in My Reports.",
                "notification_type": "AI_ANALYSIS",
                "is_read": False,
                "created_at": "2026-09-11T07:00:00Z"
            }
        ])
    notes = CitizenNotification.objects.filter(user=request.user).order_by('-created_at')
    return Response(CitizenNotificationSerializer(notes, many=True).data)


@api_view(['PUT'])
@permission_classes([permissions.AllowAny])
def mark_citizen_notification_read(request, pk):
    try:
        note = CitizenNotification.objects.get(pk=pk)
        note.is_read = True
        note.save()
        return Response(CitizenNotificationSerializer(note).data)
    except CitizenNotification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

