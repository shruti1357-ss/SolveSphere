"""
Database Service Layer for SolveSphere Backend
MongoDB Atlas is the primary database.
Django / SQLite remains available as the automatic offline fallback database.
"""

import os
from mongodb_config import (
    init_mongodb,
    MongoUser,
    MongoChallenge,
    MongoSolution,
    MongoCitizenProfile,
    MongoUniversityProfile,
    MongoIndustryProfile,
    MongoUniversityProject,
    MongoIndustryCollaborationWorkspace,
    MongoAIAnalysisRecord,
    MongoGovernmentAdminProfile,
    MongoGovernmentValidationRecord,
    MongoUniversityAssignmentRecord,
    MongoGovernmentNotification,
)
from challenges.models import Challenge
from solutions.models import Solution
from users.models import User


def mongodb_available():
    # Used for testing SQLite fallback if FORCE_SQLITE=1
    if os.getenv("FORCE_SQLITE") == "1":
        print("[DATABASE] SQLite fallback forced for testing")
        return False

    try:
        return init_mongodb()
    except Exception as e:
        print(f"[DATABASE] MongoDB unavailable: {e}")
        return False


# ==============================================================================
# READ FUNCTIONS WITH MONGODB PRIMARY & SQLITE FALLBACK
# ==============================================================================

def get_challenges():
    if mongodb_available():
        try:
            return list(MongoChallenge.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB challenge read failed: {e}")

    try:
        print("[DATABASE] Using SQLite fallback for challenges")
        return list(Challenge.objects.order_by("-created_at"))
    except Exception as e:
        print(f"[DATABASE] SQLite challenge read failed: {e}")
        return None


def get_solutions():
    if mongodb_available():
        try:
            return list(MongoSolution.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB solution read failed: {e}")

    try:
        print("[DATABASE] Using SQLite fallback for solutions")
        return list(Solution.objects.order_by("-created_at"))
    except Exception as e:
        print(f"[DATABASE] SQLite solution read failed: {e}")
        return None


def get_users():
    if mongodb_available():
        try:
            return list(MongoUser.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB user read failed: {e}")

    try:
        print("[DATABASE] Using SQLite fallback for users")
        return list(User.objects.order_by("-date_joined"))
    except Exception as e:
        print(f"[DATABASE] SQLite user read failed: {e}")
        return None


def get_citizen_profiles():
    if mongodb_available():
        try:
            return list(MongoCitizenProfile.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB citizen profile read failed: {e}")
    return None


def get_university_profiles():
    if mongodb_available():
        try:
            return list(MongoUniversityProfile.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB university profile read failed: {e}")
    return None


def get_industry_profiles():
    if mongodb_available():
        try:
            return list(MongoIndustryProfile.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB industry profile read failed: {e}")
    return None


def get_university_projects():
    if mongodb_available():
        try:
            return list(MongoUniversityProject.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB university project read failed: {e}")
    return None


def get_industry_collaborations():
    if mongodb_available():
        try:
            return list(MongoIndustryCollaborationWorkspace.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB industry collaboration read failed: {e}")
    return None


def get_government_admin_profiles():
    if mongodb_available():
        try:
            return list(MongoGovernmentAdminProfile.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB government admin profile read failed: {e}")
    return None


def get_government_validation_records():
    if mongodb_available():
        try:
            return list(MongoGovernmentValidationRecord.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB government validation record read failed: {e}")
    return None


def get_university_assignment_records():
    if mongodb_available():
        try:
            return list(MongoUniversityAssignmentRecord.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB university assignment record read failed: {e}")
    return None


def get_government_notifications():
    if mongodb_available():
        try:
            return list(MongoGovernmentNotification.objects.order_by("-created_at"))
        except Exception as e:
            print(f"[DATABASE] MongoDB government notification read failed: {e}")
    return None


def database_status():
    mongo_status = mongodb_available()
    return {
        "mongodb": "available" if mongo_status else "unavailable",
        "sqlite": "available",
    }


# ==============================================================================
# MONGODB CREATE / UPDATE / DELETE HELPERS
# ==============================================================================

def create_challenge(data):
    if not mongodb_available():
        return None

    try:
        challenge = MongoChallenge(
            problem_id=data.get("problem_id", "CHL-2026-00124"),
            title=data["title"],
            description=data["description"],
            category=data.get("category", "Water Management"),
            district=data.get("district", "Ranchi"),
            block=data.get("block", ""),
            village=data.get("village", ""),
            pin_code=data.get("pin_code", ""),
            location=data.get(
                "location",
                {
                    "type": "Point",
                    "coordinates": [85.3096, 23.3441]
                }
            ),
            status=data.get("status", "OPEN"),
            priority=data.get("priority", "MEDIUM"),
            urgency_score=data.get("urgency_score", 5.0),
            required_expertise=data.get("required_expertise", []),
            upvotes=data.get("upvotes", 0),
            citizen_name=data.get("citizen_name", "Anonymous"),
            citizen_phone=data.get("citizen_phone", ""),
            is_anonymous=data.get("is_anonymous", False),
            media_urls=data.get("media_urls", []),
            assigned_university=data.get("assigned_university")
        )

        challenge.save()
        print(f"[DATABASE] Challenge created in MongoDB Atlas: {challenge.id}")
        return challenge

    except Exception as e:
        print(f"[DATABASE] Failed to create MongoDB challenge: {e}")
        return None


def update_challenge(challenge_id, data):
    if not mongodb_available():
        return None

    try:
        challenge = MongoChallenge.objects.get(id=challenge_id)
        for field, value in data.items():
            if hasattr(challenge, field):
                setattr(challenge, field, value)
        challenge.save()
        print(f"[DATABASE] Challenge updated in MongoDB: {challenge.id}")
        return challenge
    except Exception as e:
        print(f"[DATABASE] Failed to update MongoDB challenge: {e}")
        return None


def delete_challenge(challenge_id):
    if not mongodb_available():
        return False

    try:
        challenge = MongoChallenge.objects.get(id=challenge_id)
        challenge.delete()
        print(f"[DATABASE] Challenge deleted from MongoDB: {challenge_id}")
        return True
    except Exception as e:
        print(f"[DATABASE] Failed to delete MongoDB challenge: {e}")
        return False


# ==============================================================================
# REAL-TIME MONGODB SYNC HELPERS
# ==============================================================================

def sync_user_to_mongodb(user, profile=None):
    if not mongodb_available():
        return None
    try:
        mongo_user = MongoUser.objects(username=user.username).first()
        if not mongo_user:
            mongo_user = MongoUser(username=user.username)
        mongo_user.email = user.email
        mongo_user.role = user.role
        mongo_user.phone = getattr(user, 'phone', '') or ''
        mongo_user.organization = getattr(user, 'organization', '') or ''
        mongo_user.district = getattr(user, 'district', 'Ranchi') or 'Ranchi'
        mongo_user.save()
        mongo_user_id = str(mongo_user.id)
        if profile:
            role = user.role
            if role == 'CITIZEN':
                cp = MongoCitizenProfile.objects(user_id=mongo_user_id).first() or MongoCitizenProfile(user_id=mongo_user_id)
                cp.full_name = getattr(profile, 'full_name', f"{user.first_name} {user.last_name}".strip())
                cp.phone = getattr(profile, 'phone', '')
                cp.state = getattr(profile, 'state', 'Jharkhand')
                cp.district = getattr(profile, 'district', 'Ranchi')
                cp.block = getattr(profile, 'block', '')
                cp.village = getattr(profile, 'village', '')
                cp.pin_code = getattr(profile, 'pin_code', '')
                cp.occupation = getattr(profile, 'occupation', '')
                cp.age_group = getattr(profile, 'age_group', '18-25')
                cp.otp_code = getattr(profile, 'otp_code', '123456')
                cp.email_verified = getattr(profile, 'email_verified', True)
                cp.account_status = getattr(profile, 'account_status', 'EMAIL_VERIFIED')
                cp.save()

            elif role == 'UNIVERSITY':
                up = MongoUniversityProfile.objects(official_email=getattr(profile, 'official_email', user.email)).first() or MongoUniversityProfile(official_email=getattr(profile, 'official_email', user.email))
                up.user_id = mongo_user_id
                up.university_name = getattr(profile, 'university_name', user.organization)
                up.contact_person = getattr(profile, 'contact_person', user.first_name)
                up.contact_number = getattr(profile, 'contact_number', '')
                up.university_type = getattr(profile, 'university_type', 'UNIVERSITY')
                up.district = getattr(profile, 'district', 'Ranchi')
                up.departments = getattr(profile, 'departments', [])
                up.expertise = getattr(profile, 'expertise', [])
                up.email_verified = getattr(profile, 'email_verified', False)
                up.verification_status = getattr(profile, 'verification_status', 'PENDING')
                up.account_status = getattr(profile, 'account_status', 'INACTIVE')
                up.save()

            elif role in ['INDUSTRY', 'CSR_PARTNER']:
                ip = MongoIndustryProfile.objects(official_email=getattr(profile, 'official_email', user.email)).first() or MongoIndustryProfile(official_email=getattr(profile, 'official_email', user.email))
                ip.user_id = mongo_user_id
                ip.company_name = getattr(profile, 'company_name', user.organization)
                ip.contact_person = getattr(profile, 'contact_person', user.first_name)
                ip.phone = getattr(profile, 'phone', '')
                ip.company_type = getattr(profile, 'company_type', 'Corporate')
                ip.district = getattr(profile, 'district', 'Ranchi')
                ip.expertise = getattr(profile, 'expertise', [])
                ip.email_verified = getattr(profile, 'email_verified', False)
                ip.verification_status = getattr(profile, 'verification_status', 'PENDING')
                ip.account_status = getattr(profile, 'account_status', 'INACTIVE')
                ip.save()

            elif role in ['GOVERNMENT_ADMIN', 'GOVT_ADMIN']:
                gp = MongoGovernmentAdminProfile.objects(official_email=getattr(profile, 'official_email', user.email)).first() or MongoGovernmentAdminProfile(official_email=getattr(profile, 'official_email', user.email))
                gp.user_id = mongo_user_id
                gp.full_name = getattr(profile, 'full_name', user.first_name)
                gp.department = getattr(profile, 'department', 'Rural Development Department')
                gp.designation = getattr(profile, 'designation', 'District Nodal Officer')
                gp.district = getattr(profile, 'district', 'Ranchi')
                gp.officer_id = getattr(profile, 'officer_id', 'DEMO-OFFICER-2026')
                gp.authorization_status = getattr(profile, 'authorization_status', 'APPROVED')
                gp.save()

        print(f"[MONGODB SYNC] Successfully synced user and profile to MongoDB Atlas: {user.email}")
        return mongo_user
    except Exception as e:
        print(f"[MONGODB SYNC WARNING] Failed to sync user to MongoDB: {e}")
        return None


def sync_challenge_to_mongodb(challenge_obj):
    if not mongodb_available():
        return None
    try:
        m_chl = MongoChallenge.objects(problem_id=getattr(challenge_obj, 'problem_id', '')).first() or MongoChallenge()
        m_chl.problem_id = getattr(challenge_obj, 'problem_id', f"CHL-2026-{challenge_obj.id:05d}")
        m_chl.title = challenge_obj.title
        m_chl.description = challenge_obj.description
        m_chl.category = getattr(challenge_obj, 'category', 'Water Management')
        m_chl.district = getattr(challenge_obj, 'district', 'Ranchi')
        m_chl.block = getattr(challenge_obj, 'block', '')
        m_chl.village = getattr(challenge_obj, 'village', '')
        m_chl.pin_code = getattr(challenge_obj, 'pin_code', '')
        m_chl.location = {
            "type": "Point",
            "coordinates": [getattr(challenge_obj, 'longitude', 85.3096) or 85.3096, getattr(challenge_obj, 'latitude', 23.3441) or 23.3441]
        }
        m_chl.status = getattr(challenge_obj, 'status', 'OPEN')
        m_chl.priority = getattr(challenge_obj, 'priority', 'MEDIUM')
        m_chl.urgency_score = float(getattr(challenge_obj, 'urgency_score', 5.0) or 5.0)
        m_chl.citizen_name = getattr(challenge_obj, 'citizen_name', 'Anonymous')
        m_chl.save()
        print(f"[MONGODB SYNC] Challenge synced to MongoDB Atlas: {m_chl.problem_id}")
        return m_chl
    except Exception as e:
        print(f"[MONGODB SYNC WARNING] Failed to sync challenge to MongoDB: {e}")
        return None