from rest_framework import serializers
from .models import (
    IndustryProfile,
    IndustryCollaborationWorkspace,
    IndustryFeedback,
    IndustryNotification,
)
from universities.serializers import UniversityProjectSerializer


class IndustryProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = IndustryProfile
        fields = [
            'id', 'username', 'email', 'company_name', 'official_email',
            'company_type', 'website', 'registration_number', 'contact_person',
            'designation', 'phone', 'state', 'district', 'city', 'address',
            'expertise', 'services', 'documents', 'email_verified',
            'verification_status', 'account_status', 'rejection_reason',
            'created_at'
        ]
        read_only_fields = ['id', 'email_verified', 'verification_status', 'account_status', 'rejection_reason', 'created_at']


class IndustryCollaborationWorkspaceSerializer(serializers.ModelSerializer):
    project_detail = UniversityProjectSerializer(source='project', read_only=True)
    company_name = serializers.CharField(source='industry.company_name', read_only=True)
    university_name = serializers.CharField(source='project.university.university_name', read_only=True)

    class Meta:
        model = IndustryCollaborationWorkspace
        fields = [
            'id', 'project', 'project_detail', 'industry', 'company_name',
            'university_name', 'collaboration_type', 'message',
            'proposed_support', 'expected_duration', 'match_score', 'status',
            'start_date', 'end_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'industry', 'match_score', 'created_at', 'updated_at']


class IndustryFeedbackSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='industry.company_name', read_only=True)

    class Meta:
        model = IndustryFeedback
        fields = ['id', 'workspace', 'industry', 'company_name', 'title', 'feedback_text', 'rating', 'created_at']
        read_only_fields = ['id', 'industry', 'created_at']


class IndustryNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndustryNotification
        fields = '__all__'
        read_only_fields = ['id', 'industry', 'created_at']
