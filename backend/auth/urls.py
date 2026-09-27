from django.urls import path
from .views import register_university, register_industry, register_citizen, verify_email
from users.views import login_user
from admin_portal.views import register_admin

urlpatterns = [
    path('register/university/', register_university, name='register_university'),
    path('register/industry/', register_industry, name='register_industry'),
    path('register/citizen/', register_citizen, name='register_citizen'),
    path('register/admin/', register_admin, name='register_admin'),
    path('verify-email/', verify_email, name='verify_email'),
    path('login/', login_user, name='auth_login'),
]
