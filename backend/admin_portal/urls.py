from django.urls import path
from .views import (
    register_admin,
    list_government_officers,
    get_government_officer_detail,
    approve_government_officer,
    reject_government_officer,
    get_admin_dashboard,
    get_admin_analytics,
    get_reports_and_complaints,
    get_ai_analysis_overview,
    get_admin_settings,
    get_admin_problems,
    get_admin_problem_detail,
    approve_problem,
    reject_problem,
    get_university_matches_for_problem,
    assign_university_to_problem,
    list_universities,
    approve_university,
    reject_university,
    list_industries,
    approve_industry,
    reject_industry,
    list_projects,
    get_project_detail,
    list_collaborations,
    get_district_monitoring,
    get_impact_reports,
    get_admin_notifications,
    get_organization_verifications,
)

urlpatterns = [
    # Government Registration
    path('register/', register_admin, name='register_admin'),

    # Organization Verification Requests
    path('organization-verifications/', get_organization_verifications, name='organization_verifications'),
    path('organizations/verifications/', get_organization_verifications, name='orgs_verifications'),

    # Superadmin: Government Officer Approval & Management
    path('superadmin/officers/', list_government_officers, name='list_government_officers'),
    path('superadmin/officers/<str:pk>/', get_government_officer_detail, name='get_government_officer_detail'),
    path('superadmin/officers/<str:pk>/approve/', approve_government_officer, name='approve_government_officer'),
    path('superadmin/officers/<str:pk>/reject/', reject_government_officer, name='reject_government_officer'),

    # Officer aliases
    path('officers/', list_government_officers, name='list_officers'),
    path('officers/<str:pk>/', get_government_officer_detail, name='get_officer_detail'),
    path('officers/<str:pk>/approve/', approve_government_officer, name='approve_officer'),
    path('officers/<str:pk>/reject/', reject_government_officer, name='reject_officer'),

    # Command Dashboard & Analytics
    path('dashboard/', get_admin_dashboard, name='admin_dashboard'),
    path('analytics/', get_admin_analytics, name='admin_analytics'),
    path('reports-complaints/', get_reports_and_complaints, name='admin_reports_complaints'),
    path('ai-analysis/', get_ai_analysis_overview, name='admin_ai_analysis'),
    path('settings/', get_admin_settings, name='admin_settings'),
    path('district-management/', get_district_monitoring, name='admin_district_management'),

    # Problem Reviews & Actions
    path('problems/', get_admin_problems, name='admin_problems'),
    path('problems/<str:pk>/', get_admin_problem_detail, name='admin_problem_detail'),
    path('problems/<str:pk>/approve/', approve_problem, name='approve_problem'),
    path('problems/<str:pk>/validate/', approve_problem, name='validate_problem'),
    path('problems/<str:pk>/reject/', reject_problem, name='reject_problem'),
    path('problems/<str:pk>/university-matching/', get_university_matches_for_problem, name='university_matching'),
    path('problems/<str:pk>/assign-university/', assign_university_to_problem, name='assign_university'),

    # Universities & Experts
    path('universities/', list_universities, name='list_universities'),
    path('experts/', list_universities, name='list_experts'),
    path('universities/<str:pk>/approve/', approve_university, name='approve_university'),
    path('universities/<str:pk>/reject/', reject_university, name='reject_university'),

    # Industries & Collaborations
    path('industries/', list_industries, name='list_industries'),
    path('industries/<str:pk>/approve/', approve_industry, name='approve_industry'),
    path('industries/<str:pk>/reject/', reject_industry, name='reject_industry'),

    # Projects & Monitoring
    path('projects/', list_projects, name='list_projects'),
    path('projects/<str:pk>/', get_project_detail, name='get_project_detail'),
    path('collaborations/', list_collaborations, name='list_collaborations'),
    path('district-monitoring/', get_district_monitoring, name='district_monitoring'),
    path('impact/', get_impact_reports, name='impact_reports'),
    path('reports/', get_impact_reports, name='reports'),
    path('notifications/', get_admin_notifications, name='admin_notifications'),
]


