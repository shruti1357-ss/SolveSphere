from django.urls import path
from .views import (
    university_profile_view,
    university_challenges,
    university_challenge_detail,
    accept_challenge,
    decline_challenge,
    university_projects,
    university_project_detail,
    faculty_list_create,
    project_team_list_create,
    delete_team_member,
    project_milestones_view,
    update_milestone,
    collaboration_requests,
    accept_collaboration,
    reject_collaboration,
    submit_progress_report,
    submit_impact_report,
    university_notifications,
    mark_notification_read,
    admin_pending_universities,
    admin_verify_university,
)

urlpatterns = [
    # University Profile
    path('profile/', university_profile_view, name='university_profile'),

    # Challenges Feed & AI Match Score
    path('challenges/', university_challenges, name='university_challenges'),
    path('challenges/<str:pk>/', university_challenge_detail, name='university_challenge_detail'),
    path('challenges/<str:pk>/accept/', accept_challenge, name='accept_challenge'),
    path('challenges/<str:pk>/decline/', decline_challenge, name='decline_challenge'),

    # Projects
    path('projects/', university_projects, name='university_projects'),
    path('projects/<str:pk>/', university_project_detail, name='university_project_detail'),

    # Faculty Mentors
    path('faculty/', faculty_list_create, name='faculty_list_create'),

    # Project Team Members
    path('projects/<str:pk>/team/', project_team_list_create, name='project_team_list_create'),
    path('projects/<str:pk>/team/<str:student_id>/', delete_team_member, name='delete_team_member'),

    # Project Milestones
    path('projects/<str:pk>/milestones/', project_milestones_view, name='project_milestones_view'),
    path('milestones/<str:pk>/', update_milestone, name='update_milestone'),

    # Industry Collaboration
    path('collaboration-requests/', collaboration_requests, name='collaboration_requests'),
    path('collaboration-requests/<str:pk>/accept/', accept_collaboration, name='accept_collaboration'),
    path('collaboration-requests/<str:pk>/reject/', reject_collaboration, name='reject_collaboration'),

    # Reports
    path('projects/<str:pk>/progress-report/', submit_progress_report, name='submit_progress_report'),
    path('projects/<str:pk>/impact-report/', submit_impact_report, name='submit_impact_report'),

    # Notifications
    path('notifications/', university_notifications, name='university_notifications'),
    path('notifications/<str:pk>/read/', mark_notification_read, name='mark_notification_read'),

    # Government / Admin Verification Endpoints
    path('pending-verifications/', admin_pending_universities, name='admin_pending_universities'),
    path('<str:pk>/verify/', admin_verify_university, name='admin_verify_university'),
]
