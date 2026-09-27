from rest_framework import serializers
from .models import Challenge

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'upvotes', 'urgency_score', 'assigned_university')

class ChallengeDetailSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()

    class Meta:
        model = Challenge
        fields = '__all__'

    def get_location(self, obj):
        return {
            "type": "Point",
            "coordinates": [obj.longitude, obj.latitude]
        }
