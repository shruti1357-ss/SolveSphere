"""
MongoDB Connection & MongoEngine Document Schemas for SolveSphere Backend
Supports Local MongoDB & MongoDB Atlas (Cloud)
"""

import os
import datetime
from dotenv import load_dotenv
from mongoengine import (
    connect, Document, EmbeddedDocument, StringField, FloatField,
    IntField, ListField, DictField, DateTimeField, BooleanField,
    EmbeddedDocumentField
)

load_dotenv()

# MongoDB Atlas URI
MONGO_URI = os.getenv("MONGO_URI")

_connected = False

def init_mongodb():
    """
    Connects Django to MongoDB Atlas using MongoEngine.
    Uses singleton guard to ensure connect() is only executed once.
    """
    global _connected
    if _connected:
        return True

    try:
        from mongoengine.connection import get_connection
        try:
            get_connection()
            _connected = True
            return True
        except Exception:
            pass

        if not MONGO_URI:
            print("[MONGODB WARNING] MONGO_URI not found in environment")
            return False

        connect(
            host=MONGO_URI,
            serverSelectionTimeoutMS=5000
        )
        _connected = True
        print("[MONGODB] Successfully connected to MongoDB Atlas")
        return True
    except Exception as e:
        print(f"[MONGODB WARNING] Could not connect to MongoDB: {e}")
        return False


# ==============================================================================
# MONGOENGINE DOCUMENT SCHEMAS FOR CITIZEN, UNIVERSITY & INDUSTRY
# ==============================================================================

class MongoUser(Document):
    meta = {'collection': 'users'}
    
    username = StringField(required=True, unique=True)
    email = StringField(required=True)
    role = StringField(choices=('CITIZEN', 'STUDENT', 'FACULTY', 'UNIVERSITY', 'GOVT_ADMIN', 'GOVERNMENT_ADMIN', 'CSR_PARTNER', 'INDUSTRY'), default='CITIZEN')
    phone = StringField(default="")
    organization = StringField(default="")
    district = StringField(default="Ranchi")
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoCitizenProfile(Document):
    meta = {'collection': 'citizen_profiles'}

    user_id = StringField(required=True)
    full_name = StringField(required=True)
    phone = StringField(required=True)
    state = StringField(default='Jharkhand')
    district = StringField(default='Ranchi')
    block = StringField(default='')
    village = StringField(default='')
    pin_code = StringField(default='')
    occupation = StringField(default='')
    age_group = StringField(default='18-25')
    otp_code = StringField(default='123456')
    email_verified = BooleanField(default=False)
    account_status = StringField(default='EMAIL_VERIFIED')
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoUniversityProfile(Document):
    meta = {'collection': 'university_profiles'}

    user_id = StringField(required=True)
    university_name = StringField(required=True)
    official_email = StringField(required=True, unique=True)
    contact_person = StringField(required=True)
    contact_number = StringField(required=True)
    university_type = StringField(default='UNIVERSITY')
    address = StringField(default='')
    district = StringField(default='Ranchi')
    departments = ListField(StringField(), default=list)
    expertise = ListField(StringField(), default=list)
    research_areas = StringField(default='')
    email_verified = BooleanField(default=False)
    verification_token = StringField(default='')
    verification_status = StringField(default='PENDING') # PENDING, VERIFIED, REJECTED
    account_status = StringField(default='INACTIVE')     # INACTIVE, ACTIVE
    rejection_reason = StringField(default='')
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoFaculty(Document):
    meta = {'collection': 'university_faculty'}

    university_id = StringField(required=True)
    name = StringField(required=True)
    department = StringField(required=True)
    email = StringField(required=True)
    expertise = ListField(StringField(), default=list)


class MongoIndustryProfile(Document):
    meta = {'collection': 'industry_profiles'}

    user_id = StringField(required=True)
    company_name = StringField(required=True)
    official_email = StringField(required=True, unique=True)
    company_type = StringField(default='Corporate')
    website = StringField(default='')
    registration_number = StringField(default='')
    contact_person = StringField(required=True)
    designation = StringField(default='')
    phone = StringField(required=True)
    state = StringField(default='Jharkhand')
    district = StringField(default='Ranchi')
    city = StringField(default='Ranchi')
    address = StringField(default='')
    expertise = ListField(StringField(), default=list)
    services = ListField(StringField(), default=list)
    documents = ListField(StringField(), default=list)
    otp_code = StringField(default='123456')
    email_verified = BooleanField(default=False)
    verification_status = StringField(default='PENDING') # PENDING, VERIFIED, REJECTED
    account_status = StringField(default='INACTIVE')     # INACTIVE, ACTIVE
    rejection_reason = StringField(default='')
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoChallenge(Document):
    meta = {
        'collection': 'challenges',
        'strict': False,
        'indexes': [
            [("location", "2dsphere")] # Enables spatial $near queries in MongoDB Atlas!
        ]
    }

    problem_id = StringField(default='')
    title = StringField(required=True)
    description = StringField(required=True)
    category = StringField(default='Water Management')
    district = StringField(default='Ranchi')
    block = StringField(default='')
    village = StringField(default='')
    pin_code = StringField(default='')
    
    # GeoJSON Location Point
    location = DictField(required=True) # {"type": "Point", "coordinates": [lng, lat]}
    
    status = StringField(default='OPEN') # OPEN, ASSIGNED_TO_HEI, IN_PROGRESS, RESOLVED
    priority = StringField(default='MEDIUM') # LOW, MEDIUM, HIGH, CRITICAL
    urgency_score = FloatField(default=5.0)
    required_expertise = ListField(StringField(), default=list)
    upvotes = IntField(default=0)
    
    citizen_name = StringField(default='Anonymous')
    citizen_phone = StringField(default='')
    is_anonymous = BooleanField(default=False)
    
    media_urls = ListField(StringField(), default=list)
    assigned_university = StringField(default=None)
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoAIAnalysisRecord(Document):
    meta = {'collection': 'ai_analysis_records'}

    challenge_id = StringField(required=True)
    category = StringField(required=True)
    priority = StringField(default='MEDIUM')
    urgency_score = FloatField(default=5.0)
    duplicate_score = FloatField(default=0.0)
    matching_duplicate_id = StringField(default=None)
    required_expertise = ListField(StringField(), default=list)
    ai_summary = StringField(default='')
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoUniversityProject(Document):
    meta = {'collection': 'university_projects'}

    challenge_id = StringField(required=True)
    university_id = StringField(required=True)
    title = StringField(required=True)
    description = StringField(required=True)
    expected_outcome = StringField(default='')
    required_skills = ListField(StringField(), default=list)
    estimated_duration = StringField(default='6 Months')
    team_size = IntField(default=4)
    status = StringField(default='PROTOTYPE') # PROTOTYPE, TESTING, PILOT, DEPLOYED, COMPLETED
    progress_percent = IntField(default=0)
    industry_collaboration_status = StringField(default='NONE')
    active_industry_partner = StringField(default=None)
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoIndustryCollaborationWorkspace(Document):
    meta = {'collection': 'industry_collaborations'}

    project_id = StringField(required=True)
    industry_id = StringField(required=True)
    collaboration_type = ListField(StringField(), default=list)
    message = StringField(required=True)
    proposed_support = StringField(default='')
    expected_duration = StringField(default='3 Months')
    match_score = IntField(default=92)
    status = StringField(default='PENDING') # PENDING, ACCEPTED, ACTIVE, COMPLETED, REJECTED
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class Milestone(EmbeddedDocument):
    title = StringField(required=True)
    status = StringField(default='PENDING') # PENDING, IN_PROGRESS, COMPLETED
    proof_url = StringField(default='')


class MongoSolution(Document):
    meta = {'collection': 'solutions'}

    challenge_id = StringField(required=True)
    team_name = StringField(required=True)
    university_name = StringField(default='BIT Mesra')
    department = StringField(default='Computer Science Engineering')
    faculty_mentor = StringField(required=True)
    student_leader = StringField(required=True)
    proposal_summary = StringField(required=True)
    
    milestones = ListField(EmbeddedDocumentField(Milestone), default=list)
    
    csr_partner = StringField(default='')
    csr_grant_amount = FloatField(default=0.0)
    status = StringField(default='PROPOSED')
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoGovernmentAdminProfile(Document):
    meta = {'collection': 'government_admin_profiles'}

    user_id = StringField(required=True)
    full_name = StringField(required=True)
    official_email = StringField(required=True, unique=True)
    department = StringField(default='Rural Development Department')
    designation = StringField(default='District Nodal Officer')
    state = StringField(default='Jharkhand')
    district = StringField(default='Ranchi')
    officer_id = StringField(default='DEMO-OFFICER-2026')
    phone = StringField(default='+919876543210')
    authorization_status = StringField(default='APPROVED')
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoGovernmentValidationRecord(Document):
    meta = {'collection': 'government_validation_records'}

    challenge_id = StringField(required=True)
    validated_by_email = StringField(default='')
    status_assigned = StringField(default='VALIDATED')
    priority_assigned = StringField(default='HIGH')
    validation_notes = StringField(default='')
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoUniversityAssignmentRecord(Document):
    meta = {'collection': 'university_assignment_records'}

    challenge_id = StringField(required=True)
    assigned_by_email = StringField(default='')
    university_name = StringField(required=True)
    official_email = StringField(default='')
    match_score = IntField(default=96)
    assignment_notes = StringField(default='')
    target_deadline = StringField(default='6 Months')
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class MongoGovernmentNotification(Document):
    meta = {'collection': 'government_notifications'}

    user_email = StringField(required=True)
    title = StringField(required=True)
    message = StringField(required=True)
    notification_type = StringField(default='SYSTEM')
    is_read = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.datetime.utcnow)

