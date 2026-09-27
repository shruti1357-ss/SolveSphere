from rest_framework import serializers
from .models import (
    GovernmentAdminProfile,
    GovernmentValidationRecord,
    UniversityAssignmentRecord,
    GovernmentNotification
)


class GovernmentAdminProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    approved_by_username = serializers.CharField(source='approved_by.username', read_only=True, default='')

    class Meta:
        model = GovernmentAdminProfile
        fields = [
            'id',
            'username',
            'full_name',
            'official_email',
            'department',
            'designation',
            'state',
            'district',
            'officer_id',
            'phone',
            'id_proof_number',
            'authorization_status',
            'approved_by',
            'approved_by_username',
            'approval_date',
            'rejection_reason',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'authorization_status', 'approved_by', 'approval_date', 'created_at', 'updated_at']



class GovernmentValidationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentValidationRecord
        fields = '__all__'


class UniversityAssignmentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityAssignmentRecord
        fields = '__all__'


class GovernmentNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentNotification
        fields = '__all__'
