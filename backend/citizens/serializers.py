from rest_framework import serializers
from .models import (
    CitizenProfile,
    ChallengeEvidence,
    AIAnalysisRecord,
    CitizenFeedback,
    CitizenNotification,
    CitizenMilestoneRecord,
    CitizenTimelineEvent,
)
from challenges.models import Challenge
from universities.models import UniversityProject


class CitizenProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = CitizenProfile
        fields = [
            'id', 'username', 'email', 'full_name', 'phone', 'state',
            'district', 'block', 'village', 'pin_code', 'occupation',
            'age_group', 'email_verified', 'account_status', 'created_at'
        ]
        read_only_fields = ['id', 'email_verified', 'account_status', 'created_at']


class ChallengeEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeEvidence
        fields = '__all__'
        read_only_fields = ['id', 'uploaded_at']


class AIAnalysisRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAnalysisRecord
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class CitizenMilestoneRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CitizenMilestoneRecord
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class CitizenTimelineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CitizenTimelineEvent
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class CitizenFeedbackSerializer(serializers.ModelSerializer):
    citizen_name = serializers.CharField(source='citizen.first_name', read_only=True)

    class Meta:
        model = CitizenFeedback
        fields = ['id', 'challenge', 'citizen', 'citizen_name', 'rating', 'was_solved', 'feedback_text', 'created_at']
        read_only_fields = ['id', 'citizen', 'created_at']


class CitizenNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CitizenNotification
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']


class CitizenProblemSerializer(serializers.ModelSerializer):
    ai_analysis = AIAnalysisRecordSerializer(read_only=True)
    evidence_files = ChallengeEvidenceSerializer(many=True, read_only=True)
    milestone_records = CitizenMilestoneRecordSerializer(many=True, read_only=True)
    timeline_events = CitizenTimelineEventSerializer(many=True, read_only=True)

    class Meta:
        model = Challenge
        fields = [
            'id', 'problem_id', 'title', 'description', 'category', 'district',
            'block', 'village', 'pin_code', 'latitude', 'longitude', 'status',
            'priority', 'urgency_score', 'required_expertise', 'upvotes',
            'citizen_name', 'assigned_university', 'ai_analysis', 'evidence_files',
            'milestone_records', 'timeline_events', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'problem_id', 'status', 'priority', 'urgency_score',
            'required_expertise', 'upvotes', 'assigned_university',
            'created_at', 'updated_at'
        ]


class CitizenTrackingDetailSerializer(serializers.ModelSerializer):
    ai_analysis = AIAnalysisRecordSerializer(read_only=True)
    evidence_files = ChallengeEvidenceSerializer(many=True, read_only=True)
    milestones = CitizenMilestoneRecordSerializer(source='milestone_records', many=True, read_only=True)
    timeline = CitizenTimelineEventSerializer(source='timeline_events', many=True, read_only=True)
    feedbacks = CitizenFeedbackSerializer(many=True, read_only=True)

    class Meta:
        model = Challenge
        fields = [
            'id', 'problem_id', 'title', 'description', 'category', 'district',
            'block', 'village', 'pin_code', 'latitude', 'longitude', 'status',
            'priority', 'urgency_score', 'assigned_university', 'ai_analysis',
            'evidence_files', 'milestones', 'timeline', 'feedbacks',
            'created_at', 'updated_at'
        ]
