from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root_index(request):
    """
    Root Welcome Page for SolveSphere API
    """
    base_url = request.build_absolute_uri('/')[:-1]
    return Response({
        "project": "SolveSphere API - Government of Jharkhand (SIH26043)",
        "team_name": "Hack Forage",
        "status": "Online & Healthy 🚀",
        "version": "1.0.0",
        "available_endpoints": {
            "university_register": f"{base_url}/api/auth/register/university/",
            "industry_register": f"{base_url}/api/auth/register/industry/",
            "citizen_register": f"{base_url}/api/auth/register/citizen/",
            "verify_email": f"{base_url}/api/auth/verify-email/",
            "auth_login": f"{base_url}/api/auth/login/",
            "citizen_dashboard": f"{base_url}/api/citizen/dashboard/",
            "report_problem": f"{base_url}/api/citizen/problems/",
            "university_profile": f"{base_url}/api/university/profile/",
            "university_challenges": f"{base_url}/api/university/challenges/",
            "university_projects": f"{base_url}/api/university/projects/",
            "industry_dashboard": f"{base_url}/api/industry/dashboard/",
            "industry_recommended_projects": f"{base_url}/api/industry/projects/recommended/",
            "challenges_list": f"{base_url}/api/challenges/",
            "nearby_challenges": f"{base_url}/api/challenges/nearby/?lat=23.3441&lng=85.3096&radius=25",
            "solutions_list": f"{base_url}/api/solutions/",
            "user_register": f"{base_url}/api/users/register/",
            "user_login": f"{base_url}/api/users/login/",
            "ai_classify": f"{base_url}/api/ai/classify/",
            "ai_transcribe": f"{base_url}/api/ai/transcribe/",
            "analytics_dashboard": f"{base_url}/api/analytics/dashboard/",
            "gis_heatmap": f"{base_url}/api/analytics/heatmap/",
            "admin_register": f"{base_url}/api/auth/register/admin/",
            "admin_dashboard": f"{base_url}/api/admin/dashboard/",
            "admin_problems": f"{base_url}/api/admin/problems/",
            "district_monitoring": f"{base_url}/api/admin/district-monitoring/",
            "django_admin": f"{base_url}/admin/"
        }
    })

urlpatterns = [
    path('', api_root_index, name='api_root_index'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth.urls')),
    path('api/users/', include('users.urls')),
    path('api/challenges/', include('challenges.urls')),
    path('api/solutions/', include('solutions.urls')),
    path('api/ai/', include('ai_services.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/university/', include('universities.urls')),
    path('api/universities/', include('universities.urls')),
    path('api/industry/', include('industries.urls')),
    path('api/industries/', include('industries.urls')),
    path('api/citizen/', include('citizens.urls')),
    path('api/citizens/', include('citizens.urls')),
    path('api/admin/', include('admin_portal.urls')),
    path('api/government/', include('admin_portal.urls')),
]
