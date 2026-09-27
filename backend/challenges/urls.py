from django.urls import path
from .views import (
    challenge_list_create,
    challenge_detail,
    upvote_challenge,
    nearby_challenges,
    assign_university
)

urlpatterns = [
    path('', challenge_list_create, name='challenge_list_create'),
    path('nearby/', nearby_challenges, name='nearby_challenges'),
    path('<str:pk>/', challenge_detail, name='challenge_detail'),
    path('<str:pk>/upvote/', upvote_challenge, name='upvote_challenge'),
    path('<str:pk>/assign/', assign_university, name='assign_university'),
]
