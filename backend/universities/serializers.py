from rest_framework import serializers
from .models import (
    UniversityProfile,
    Faculty,
    UniversityProject,
    ProjectTeamMember,
    ProjectMilestone,
    CollaborationRequest,
    ProjectReport,
    UniversityNotification,
)
from challenges.serializers import ChallengeDetailSerializer


class UniversityProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UniversityProfile
        fields = [
            'id', 'username', 'email', 'university_name', 'official_email',
            'contact_person', 'contact_number', 'university_type', 'address',
            'district', 'departments', 'expertise', 'research_areas',
            'email_verified', 'verification_status', 'account_status',
            'rejection_reason', 'created_at'
        ]
        read_only_fields = ['id', 'email_verified', 'verification_status', 'account_status', 'rejection_reason', 'created_at']


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = '__all__'
        read_only_fields = ['id', 'university']


class ProjectTeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTeamMember
        fields = '__all__'
        read_only_fields = ['id', 'project']


class ProjectMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = '__all__'
        read_only_fields = ['id', 'project']


class CollaborationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollaborationRequest
        fields = '__all__'
        read_only_fields = ['id', 'project', 'created_at']


class ProjectReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectReport
        fields = '__all__'
        read_only_fields = ['id', 'project', 'created_at']


class UniversityProjectSerializer(serializers.ModelSerializer):
    challenge_detail = ChallengeDetailSerializer(source='challenge', read_only=True)
    faculty_mentor_detail = FacultySerializer(source='faculty_mentor', read_only=True)
    team_members = ProjectTeamMemberSerializer(many=True, read_only=True)
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)

    class Meta:
        model = UniversityProject
        fields = [
            'id', 'challenge', 'challenge_detail', 'university', 'faculty_mentor',
            'faculty_mentor_detail', 'title', 'description', 'expected_outcome',
            'required_skills', 'estimated_duration', 'team_size', 'status',
            'progress_percent', 'industry_collaboration_status',
            'active_industry_partner', 'team_members', 'milestones',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'university', 'created_at', 'updated_at']


class UniversityNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityNotification
        fields = '__all__'
        read_only_fields = ['id', 'university', 'created_at']
