from rest_framework import serializers
from .models import Solution
from challenges.serializers import ChallengeSerializer

class SolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solution
        fields = '__all__'

class SolutionDetailSerializer(serializers.ModelSerializer):
    challenge_detail = ChallengeSerializer(source='challenge', read_only=True)

    class Meta:
        model = Solution
        fields = '__all__'
