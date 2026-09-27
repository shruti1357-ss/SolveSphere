from django.urls import path
from .views import (
    industry_dashboard,
    industry_profile_view,
    expertise_and_services_view,
    recommended_projects,
    industry_project_detail,
    send_collaboration_request,
    industry_collaboration_requests,
    industry_active_collaborations,
    collaboration_workspace_detail,
    submit_collaboration_feedback,
    submit_collaboration_milestone,
    industry_notifications,
    mark_industry_notification_read,
    industry_impact_summary,
    admin_pending_industries,
    admin_verify_industry,
)

urlpatterns = [
    # Dashboard & Profile
    path('dashboard/', industry_dashboard, name='industry_dashboard'),
    path('profile/', industry_profile_view, name='industry_profile'),
    path('expertise-services/', expertise_and_services_view, name='expertise_and_services'),

    # AI Recommended Projects & Privacy View
    path('projects/recommended/', recommended_projects, name='recommended_projects'),
    path('projects/', recommended_projects, name='industry_projects_list'),
    path('projects/<str:pk>/', industry_project_detail, name='industry_project_detail'),

    # Collaboration Requests & Workspace
    path('projects/<str:pk>/collaboration-request/', send_collaboration_request, name='send_collaboration_request'),
    path('collaboration-requests/', industry_collaboration_requests, name='industry_collaboration_requests'),
    path('collaborations/', industry_active_collaborations, name='industry_collaborations'),
    path('collaborations/<str:pk>/', collaboration_workspace_detail, name='collaboration_workspace_detail'),
    path('collaborations/<str:pk>/feedback/', submit_collaboration_feedback, name='submit_collaboration_feedback'),
    path('collaborations/<str:pk>/milestones/', submit_collaboration_milestone, name='submit_collaboration_milestone'),

    # Notifications, Reports & Impact
    path('notifications/', industry_notifications, name='industry_notifications'),
    path('notifications/<str:pk>/read/', mark_industry_notification_read, name='mark_industry_notification_read'),
    path('reports/', industry_impact_summary, name='industry_reports'),
    path('impact/', industry_impact_summary, name='industry_impact'),

    # Government / Admin Verification Endpoints
    path('pending-verifications/', admin_pending_industries, name='admin_pending_industries'),
    path('<str:pk>/verify/', admin_verify_industry, name='admin_verify_industry'),
]
