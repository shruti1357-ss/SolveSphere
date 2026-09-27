from django.urls import path
from .views import (
    citizen_dashboard,
    citizen_profile_view,
    my_reports,
    citizen_support_view,
    report_problem,
    citizen_problem_detail,
    upload_evidence,
    citizen_all_tracking_list,
    problem_milestones_tracking,
    problem_milestone_list,
    update_milestone_status,
    problem_timeline,
    add_timeline_event,
    connected_project,
    citizen_impact_summary,
    submit_citizen_feedback,
    citizen_notifications,
    mark_citizen_notification_read,
)

urlpatterns = [
    # Dashboard & Profile
    path('dashboard/', citizen_dashboard, name='citizen_dashboard'),
    path('profile/', citizen_profile_view, name='citizen_profile'),
    path('my-reports/', my_reports, name='citizen_my_reports'),
    path('reports/', my_reports, name='citizen_reports'),
    path('support/', citizen_support_view, name='citizen_support'),
    path('help/', citizen_support_view, name='citizen_help'),

    # All Problems Tracking Overview
    path('tracking/', citizen_all_tracking_list, name='citizen_all_tracking_list'),
    path('tracking/<str:pk>/', problem_milestones_tracking, name='citizen_tracking_detail'),

    # Report Problem & Evidence
    path('problems/', report_problem, name='report_problem'),
    path('report-problem/', report_problem, name='report_problem_alias'),

    path('problems/<str:pk>/', citizen_problem_detail, name='citizen_problem_detail'),
    path('problems/<str:pk>/evidence/', upload_evidence, name='upload_evidence'),

    # Live Milestone & Project Progress Tracking
    path('problems/<str:pk>/tracking/', problem_milestones_tracking, name='problem_milestones_tracking'),
    path('problems/<str:pk>/milestones/', problem_milestone_list, name='problem_milestone_list'),
    path('problems/<str:pk>/milestones/<int:stage_number>/update/', update_milestone_status, name='update_milestone_status'),
    path('problems/<str:pk>/timeline/', problem_timeline, name='problem_timeline'),
    path('problems/<str:pk>/timeline/add/', add_timeline_event, name='add_timeline_event'),
    path('problems/<str:pk>/project/', connected_project, name='connected_project'),

    # Impact Analytics & Feedback
    path('impact/', citizen_impact_summary, name='citizen_impact'),
    path('problems/<str:pk>/impact/', citizen_impact_summary, name='problem_impact'),
    path('problems/<str:pk>/feedback/', submit_citizen_feedback, name='submit_citizen_feedback'),

    # Notifications
    path('notifications/', citizen_notifications, name='citizen_notifications'),
    path('notifications/<str:pk>/read/', mark_citizen_notification_read, name='mark_citizen_notification_read'),
]

