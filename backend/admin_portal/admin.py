from django.contrib import admin
from .models import (
    GovernmentAdminProfile,
    GovernmentValidationRecord,
    UniversityAssignmentRecord,
    GovernmentNotification,
)

@admin.register(GovernmentAdminProfile)
class GovernmentAdminProfileAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'full_name',
        'official_email',
        'department',
        'designation',
        'district',
        'authorization_status',
        'approval_date',
        'created_at',
    )
    list_filter = ('authorization_status', 'department', 'district', 'designation')
    search_fields = ('full_name', 'official_email', 'officer_id', 'department', 'district')
    list_editable = ('authorization_status',)
    actions = ['approve_selected_officers', 'reject_selected_officers']

    @admin.action(description="Approve selected Government Officers")
    def approve_selected_officers(self, request, queryset):
        for profile in queryset:
            profile.authorization_status = 'APPROVED'
            profile.save()
            if profile.user:
                profile.user.is_active = True
                profile.user.save()
        self.message_user(request, f"Successfully approved {queryset.count()} officer(s).")

    @admin.action(description="Reject selected Government Officers")
    def reject_selected_officers(self, request, queryset):
        queryset.update(authorization_status='REJECTED')
        self.message_user(request, f"Successfully rejected {queryset.count()} officer(s).")


@admin.register(GovernmentValidationRecord)
class GovernmentValidationRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'challenge', 'validated_by', 'status_assigned', 'priority_assigned', 'created_at')
    list_filter = ('status_assigned', 'priority_assigned')
    search_fields = ('challenge__title', 'validation_notes')


@admin.register(UniversityAssignmentRecord)
class UniversityAssignmentRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'challenge', 'university_name', 'official_email', 'assigned_by', 'match_score', 'created_at')
    list_filter = ('university_name', 'match_score')
    search_fields = ('university_name', 'official_email', 'challenge__title')


@admin.register(GovernmentNotification)
class GovernmentNotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read')
    search_fields = ('user__username', 'title', 'message')
