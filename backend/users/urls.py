from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    register_user,
    login_user,
    get_user_profile,
    mongo_challenge_test,
)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('profile/', get_user_profile, name='profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # MongoDB Atlas test endpoint
    path('mongo-challenges/', mongo_challenge_test, name='mongo_challenge_test'),
]
