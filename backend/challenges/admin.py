from django.contrib import admin
from .models import Challenge

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'district', 'status', 'priority', 'urgency_score', 'created_at')
    list_filter = ('category', 'district', 'status', 'priority')
    search_fields = ('title', 'description', 'district')
