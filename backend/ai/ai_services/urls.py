from django.urls import path
from .views import classify_problem, transcribe_voice, check_deduplication, store_embedding_for_challenge

urlpatterns = [
    path('classify/', classify_problem, name='classify_problem'),
    path('transcribe/', transcribe_voice, name='transcribe_voice'),
    path('deduplicate/', check_deduplication, name='check_deduplication'),
    path('store-embedding/', store_embedding_for_challenge, name='store_embedding_for_challenge'),
]
