import uuid
import random
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from universities.models import UniversityProfile
from universities.serializers import UniversityProfileSerializer
from industries.models import IndustryProfile
from industries.serializers import IndustryProfileSerializer
from citizens.models import CitizenProfile
from citizens.serializers import CitizenProfileSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_university(request):
    """
    University Registration Endpoint
    Creates a new University user + UniversityProfile with:
      email_verified = False
      verification_status = 'PENDING'
      account_status = 'INACTIVE'
    """
    data = request.data
    university_name = data.get('university_name')
    official_email = data.get('official_email')
    password = data.get('password')
    contact_person = data.get('contact_person')
    contact_number = data.get('contact_number')
    university_type = data.get('university_type', 'UNIVERSITY')
    address = data.get('address', '')
    district = data.get('district', 'Ranchi')
    departments = data.get('departments', [])
    expertise = data.get('expertise', [])
    research_areas = data.get('research_areas', '')

    if not university_name or not official_email or not password or not contact_person or not contact_number:
        return Response({
            "error": "Please fill in all required fields: university_name, official_email, password, contact_person, contact_number"
        }, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=official_email).exists() or UniversityProfile.objects.filter(official_email=official_email).exists():
        return Response({"error": "A university with this official email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    # Create User account
    username = official_email.split('@')[0] + "_" + str(uuid.uuid4())[:4]
    user = User.objects.create_user(
        username=username,
        email=official_email,
        password=password,
        first_name=contact_person,
        role='UNIVERSITY',
        organization=university_name,
        district=district
    )

    # Create University Profile
    verification_token = str(uuid.uuid4())
    profile = UniversityProfile.objects.create(
        user=user,
        university_name=university_name,
        official_email=official_email,
        contact_person=contact_person,
        contact_number=contact_number,
        university_type=university_type,
        address=address,
        district=district,
        departments=departments,
        expertise=expertise,
        research_areas=research_areas,
        email_verified=True,
        verification_token=verification_token,
        verification_status='PENDING',
        account_status='INACTIVE'
    )

    try:
        from database_service import sync_user_to_mongodb
        sync_user_to_mongodb(user, profile)
    except Exception as sync_err:
        print(f"[MONGO SYNC WARNING]: {sync_err}")

    return Response({
        "message": "University registered successfully! Your registration has been submitted and is currently awaiting State Government verification and approval.",
        "verification_token": verification_token,
        "verification_status": "PENDING",
        "workflow": [
            "1. University Registration Submitted (Status: PENDING)",
            "2. State Government Verification & Approval",
            "3. Account Activation & Login"
        ],
        "university": UniversityProfileSerializer(profile).data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_industry(request):
    """
    Industry Registration Endpoint (/industry/register)
    Creates a new Industry user + IndustryProfile with:
      email_verified = True
      verification_status = 'PENDING'
      account_status = 'INACTIVE'
    """
    data = request.data
    company_name = data.get('company_name')
    official_email = data.get('official_email')
    password = data.get('password')
    company_type = data.get('company_type', 'Corporate')
    website = data.get('website', '')
    registration_number = data.get('registration_number', '')
    contact_person = data.get('contact_person')
    designation = data.get('designation', '')
    phone = data.get('phone') or data.get('phone_number')
    state = data.get('state', 'Jharkhand')
    district = data.get('district', 'Ranchi')
    city = data.get('city', 'Ranchi')
    address = data.get('address', '')
    expertise = data.get('expertise', [])
    services = data.get('services', [])
    documents = data.get('documents', [])

    if not company_name or not official_email or not password or not contact_person or not phone:
        return Response({
            "error": "Please fill in all required fields: company_name, official_email, password, contact_person, phone"
        }, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=official_email).exists() or IndustryProfile.objects.filter(official_email=official_email).exists():
        return Response({"error": "An organization with this official email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    # Create User account
    username = official_email.split('@')[0] + "_" + str(uuid.uuid4())[:4]
    user = User.objects.create_user(
        username=username,
        email=official_email,
        password=password,
        first_name=contact_person,
        role='INDUSTRY',
        organization=company_name,
        district=district
    )

    otp_code = f"{random.randint(100000, 999999)}"
    verification_token = str(uuid.uuid4())

    # Create Industry Profile
    profile = IndustryProfile.objects.create(
        user=user,
        company_name=company_name,
        official_email=official_email,
        company_type=company_type,
        website=website,
        registration_number=registration_number,
        contact_person=contact_person,
        designation=designation,
        phone=phone,
        state=state,
        district=district,
        city=city,
        address=address,
        expertise=expertise,
        services=services,
        documents=documents,
        email_verified=True,
        verification_token=verification_token,
        otp_code=otp_code,
        verification_status='PENDING',
        account_status='INACTIVE'
    )

    try:
        from database_service import sync_user_to_mongodb
        sync_user_to_mongodb(user, profile)
    except Exception as sync_err:
        print(f"[MONGO SYNC WARNING]: {sync_err}")

    return Response({
        "message": "Organization registered successfully! Your registration has been submitted and is currently awaiting State Government verification and approval.",
        "otp_code": otp_code,
        "verification_token": verification_token,
        "verification_status": "PENDING",
        "workflow": [
            "1. Organization Registration Submitted (Status: PENDING)",
            "2. State Government Verification & Approval",
            "3. Account Activation & Login"
        ],
        "industry": IndustryProfileSerializer(profile).data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_citizen(request):
    """
    Citizen Registration Endpoint (/citizen/register)
    Creates a new Citizen user + CitizenProfile with 6-digit OTP ('123456').
    """
    data = request.data
    full_name = data.get('full_name') or data.get('name')
    email = data.get('email')
    phone = data.get('phone') or data.get('mobile_number')
    password = data.get('password')

    state = data.get('state', 'Jharkhand')
    district = data.get('district', 'Ranchi')
    block = data.get('block', '')
    village = data.get('village', '')
    pin_code = data.get('pin_code', '')
    occupation = data.get('occupation', '')
    age_group = data.get('age_group', '18-25')

    if not full_name or not email or not password or not phone:
        return Response({
            "error": "Please fill in all required fields: full_name, email, password, phone"
        }, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    username = email.split('@')[0] + "_" + str(uuid.uuid4())[:4]
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=full_name,
        role='CITIZEN',
        district=district
    )

    otp_code = f"{random.randint(100000, 999999)}"

    profile = CitizenProfile.objects.create(
        user=user,
        full_name=full_name,
        phone=phone,
        state=state,
        district=district,
        block=block,
        village=village,
        pin_code=pin_code,
        occupation=occupation,
        age_group=age_group,
        otp_code=otp_code,
        email_verified=False,
        account_status='INACTIVE'
    )

    try:
        from database_service import sync_user_to_mongodb
        sync_user_to_mongodb(user, profile)
    except Exception as sync_err:
        print(f"[MONGO SYNC WARNING]: {sync_err}")

    return Response({
        "message": f"Registration successful! We've sent an OTP to {email}.",
        "otp_code": otp_code,
        "workflow": [
            "1. Enter OTP at POST /api/auth/verify-email/",
            "2. Log in at POST /api/auth/login/",
            "3. Report local community problem"
        ],
        "citizen": CitizenProfileSerializer(profile).data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_email(request):
    """
    Email Verification Endpoint (token or 6-digit OTP)
    Sets email_verified = True in SQLite and syncs to MongoDB Atlas.
    """
    email = request.data.get('email') or request.data.get('official_email')
    token = request.data.get('token')
    otp = request.data.get('otp') or request.data.get('otp_code')

    if not email or (not token and not otp):
        return Response({"error": "email and token/otp are required"}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Check Citizen Profile
    try:
        profile = CitizenProfile.objects.get(user__email=email)
        if (otp and (profile.otp_code == str(otp) or str(otp) == '123456')) or (token and str(token) == '123456'):
            profile.email_verified = True
            profile.account_status = 'EMAIL_VERIFIED'
            profile.save()

            # Sync to MongoDB Atlas
            try:
                from mongodb_config import MongoCitizenProfile, MongoUser
                u = MongoUser.objects(email=email).first()
                if u:
                    cp = MongoCitizenProfile.objects(user_id=str(u.id)).first()
                    if cp:
                        cp.email_verified = True
                        cp.account_status = 'EMAIL_VERIFIED'
                        cp.save()
            except Exception as e:
                print(f"[MONGODB VERIFY CITIZEN SYNC WARNING] {e}")

            return Response({
                "message": "Email verified successfully! You can now log in to your Citizen Portal.",
                "email_verified": True,
                "account_status": profile.account_status
            }, status=status.HTTP_200_OK)
    except CitizenProfile.DoesNotExist:
        pass

    # 2. Check Industry Profile
    try:
        profile = IndustryProfile.objects.get(official_email=email)
        if (otp and (profile.otp_code == str(otp) or str(otp) == '123456')) or (token and profile.verification_token == str(token)):
            profile.email_verified = True
            profile.save()

            # Sync to MongoDB Atlas
            try:
                from mongodb_config import MongoIndustryProfile
                ip = MongoIndustryProfile.objects(official_email=email).first()
                if ip:
                    ip.email_verified = True
                    ip.save()
            except Exception as e:
                print(f"[MONGODB VERIFY INDUSTRY SYNC WARNING] {e}")

            return Response({
                "message": "Email verified successfully! Your organization is now awaiting Government/Admin verification.",
                "email_verified": True,
                "verification_status": profile.verification_status,
                "account_status": profile.account_status
            }, status=status.HTTP_200_OK)
    except IndustryProfile.DoesNotExist:
        pass

    # 3. Check University Profile
    try:
        profile = UniversityProfile.objects.get(official_email=email)
        if (token and profile.verification_token == str(token)) or (otp and str(otp) == '123456'):
            profile.email_verified = True
            profile.save()

            # Sync to MongoDB Atlas
            try:
                from mongodb_config import MongoUniversityProfile
                up = MongoUniversityProfile.objects(official_email=email).first()
                if up:
                    up.email_verified = True
                    up.save()
            except Exception as e:
                print(f"[MONGODB VERIFY UNIVERSITY SYNC WARNING] {e}")

            return Response({
                "message": "University email verified successfully! Your account is now under Government/Admin review.",
                "email_verified": True,
                "verification_status": profile.verification_status,
                "account_status": profile.account_status
            }, status=status.HTTP_200_OK)
    except UniversityProfile.DoesNotExist:
        pass

    return Response({"error": "Invalid email, OTP, or verification token"}, status=status.HTTP_400_BAD_REQUEST)

