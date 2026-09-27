from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserSerializer, RegisterSerializer
from database_service import get_challenges

User = get_user_model()

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "User registered successfully",
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    username_input = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')
    
    if not username_input or not password:
        return Response({"error": "Please provide both username/email and password"}, status=status.HTTP_400_BAD_REQUEST)
        
    username_input = str(username_input).strip()
    
    # 1. Direct authentication check with username
    user = authenticate(username=username_input, password=password)
    
    # 2. Case-insensitive fallback check by email if username direct match failed
    if not user:
        try:
            user_obj = User.objects.filter(email__iexact=username_input).first()
            if user_obj:
                user = authenticate(username=user_obj.username, password=password)
        except Exception:
            user = None

    if not user:
        # Check if user account exists to return precise error
        user_exists = User.objects.filter(email__iexact=username_input).exists() or User.objects.filter(username__iexact=username_input).exists()
        if user_exists:
            return Response({"error": "Incorrect password. Please check your credentials and try again."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"error": "No account registered with this email or username. Please register first."}, status=status.HTTP_404_NOT_FOUND)

    if user:
        # Enforce State Government verification for UNIVERSITY role
        if getattr(user, 'role', '') in ['UNIVERSITY', 'STUDENT', 'FACULTY']:
            try:
                uni_profile = getattr(user, 'university_profile', None)
                if uni_profile:
                    if uni_profile.verification_status == 'PENDING':
                        return Response({
                            "error": "Your university registration has been submitted and is currently waiting for State Government verification and approval. You will be able to log in once approved.",
                            "code": "VERIFICATION_PENDING",
                            "verification_status": "PENDING"
                        }, status=status.HTTP_403_FORBIDDEN)

                    if uni_profile.verification_status == 'REJECTED':
                        return Response({
                            "error": f"Your university registration was rejected by the State Government. Reason: {uni_profile.rejection_reason or 'Credentials could not be verified'}",
                            "code": "VERIFICATION_REJECTED",
                            "verification_status": "REJECTED"
                        }, status=status.HTTP_403_FORBIDDEN)

                    if uni_profile.account_status != 'ACTIVE' and uni_profile.verification_status not in ['VERIFIED', 'APPROVED']:
                        return Response({
                            "error": "Your university account is currently pending activation.",
                            "code": "ACCOUNT_INACTIVE"
                        }, status=status.HTTP_403_FORBIDDEN)
            except Exception:
                pass

        # Enforce State Government verification for INDUSTRY / CSR_PARTNER role
        if getattr(user, 'role', '') in ['INDUSTRY', 'CSR_PARTNER']:
            try:
                ind_profile = getattr(user, 'industry_profile', None)
                if ind_profile:
                    if ind_profile.verification_status == 'PENDING':
                        return Response({
                            "error": "Your organization registration has been submitted and is currently waiting for State Government verification and approval. You will be able to log in once approved.",
                            "code": "VERIFICATION_PENDING",
                            "verification_status": "PENDING"
                        }, status=status.HTTP_403_FORBIDDEN)

                    if ind_profile.verification_status == 'REJECTED':
                        return Response({
                            "error": f"Your organization registration was rejected by the State Government. Reason: {ind_profile.rejection_reason or 'Credentials could not be verified'}",
                            "code": "VERIFICATION_REJECTED",
                            "verification_status": "REJECTED"
                        }, status=status.HTTP_403_FORBIDDEN)

                    if ind_profile.account_status != 'ACTIVE' and ind_profile.verification_status not in ['VERIFIED', 'APPROVED']:
                        return Response({
                            "error": "Your industry account is currently pending activation.",
                            "code": "ACCOUNT_INACTIVE"
                        }, status=status.HTTP_403_FORBIDDEN)
            except Exception:
                pass

        # Enforce authorization check for GOVERNMENT_ADMIN role
        if getattr(user, 'role', '') in ['GOVERNMENT_ADMIN', 'GOVT_ADMIN']:
            try:
                govt_profile = getattr(user, 'govt_admin_profile', None)
                if govt_profile:
                    if govt_profile.authorization_status == 'PENDING':
                        return Response({
                            "error": "Your Government Officer registration is currently under review and pending Superadmin approval. You will receive an email and notification once approved to log in.",
                            "code": "AUTHORIZATION_PENDING",
                            "authorization_status": "PENDING"
                        }, status=status.HTTP_403_FORBIDDEN)
                    elif govt_profile.authorization_status == 'REJECTED':
                        return Response({
                            "error": f"Your Government Admin account authorization was rejected by the Superadmin. Reason: {govt_profile.rejection_reason or 'Credentials could not be verified'}",
                            "code": "AUTHORIZATION_REJECTED",
                            "authorization_status": "REJECTED"
                        }, status=status.HTTP_403_FORBIDDEN)
            except Exception:
                pass


        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        profile_data = {}
        level = "DISTRICT"
        role = getattr(user, 'role', 'CITIZEN')

        if role in ['GOVERNMENT_ADMIN', 'GOVT_ADMIN']:
            govt_profile = getattr(user, 'govt_admin_profile', None)
            if govt_profile:
                profile_data = {
                    'full_name': govt_profile.full_name,
                    'department': govt_profile.department,
                    'designation': govt_profile.designation,
                    'district': govt_profile.district,
                    'state': govt_profile.state,
                    'officer_id': govt_profile.officer_id,
                    'authorization_status': govt_profile.authorization_status,
                }
                # Check if State level officer
                desig_upper = str(govt_profile.designation or '').upper()
                dept_upper = str(govt_profile.department or '').upper()
                dist_lower = str(govt_profile.district or '').strip().lower()
                if 'STATE' in desig_upper or 'STATE' in dept_upper or not dist_lower or dist_lower in ['state', 'jharkhand', 'all districts', 'all']:
                    level = "STATE"
                else:
                    level = "DISTRICT"
            else:
                level = "STATE"

        return Response({
            "message": "Login successful",
            "user": user_data,
            "role": role,
            "level": level,
            "dashboard_type": level,
            "dashboard_url": "/state/dashboard" if level == "STATE" else "/district/dashboard",
            "profile": profile_data,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_200_OK)
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def mongo_challenge_test(request):
    challenges = get_challenges()

    if challenges is None:
        return Response(
            {"error": "Both MongoDB and SQLite are unavailable"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    results = []

    for challenge in challenges:

        # MongoDB object
        if hasattr(challenge, "location"):
            location = challenge.location

        # SQLite/Django object
        else:
            location = {
                "type": "Point",
                "coordinates": [
                    challenge.longitude,
                    challenge.latitude
                ]
            }

        results.append({
            "id": str(challenge.id),
            "title": challenge.title,
            "description": challenge.description,
            "category": challenge.category,
            "district": challenge.district,
            "status": challenge.status,
            "urgency_score": challenge.urgency_score,
            "upvotes": challenge.upvotes,
            "location": location,
            "assigned_university": challenge.assigned_university,
        })

    return Response({
        "count": len(results),
        "results": results
    })