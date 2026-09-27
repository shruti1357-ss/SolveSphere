from rest_framework import serializers
from django.contrib.auth import get_user_model
from mongodb_config import MongoUser
import datetime

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'role',
            'organization',
            'district'
        )
        read_only_fields = ('id',)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'password',
            'role',
            'organization',
            'district'
        )

    def create(self, validated_data):
        # 1. Create user in Django
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'CITIZEN'),
            organization=validated_data.get('organization', ''),
            district=validated_data.get('district', 'Ranchi')
        )

        # 2. Sync same user to existing MongoDB Atlas
        try:
            MongoUser.objects.create(
                username=user.username,
                email=user.email,
                role=user.role,
                organization=user.organization or '',
                district=user.district or 'Ranchi',
                created_at=datetime.datetime.utcnow()
            )

            print(f"[MONGODB] User synced: {user.username}")

        except Exception as e:
            print(f"[MONGODB USER SYNC WARNING] {e}")

        return user