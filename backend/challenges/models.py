from django.db import models
from django.conf import settings

class Challenge(models.Model):
    STATUS_CHOICES = (
        ('OPEN', 'Open for HEI Assignment'),
        ('UNDER_REVIEW', 'Under Expert Review'),
        ('ASSIGNED_TO_HEI', 'Assigned to University'),
        ('IN_PROGRESS', 'Solution Prototype Underway'),
        ('RESOLVED', 'Deployed & Resolved'),
    )
    
    CATEGORY_CHOICES = (
        ('Water Management', 'Water Management & Quality'),
        ('Agriculture & FoodTech', 'Agriculture & Crop Care'),
        ('Health & MedTech', 'Healthcare & Medical Access'),
        ('Sanitation & Waste', 'Sanitation & Waste Management'),
        ('Rural Infrastructure', 'Rural Roads & Infrastructure'),
        ('Smart Education', 'Education & Skill Development'),
        ('Clean Energy', 'Renewable & Clean Energy'),
    )

    problem_id = models.CharField(max_length=50, blank=True, null=True, unique=True, help_text="Unique problem ID e.g. CHL-2026-00124")
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='Water Management')
    district = models.CharField(max_length=100, default='Ranchi')
    block = models.CharField(max_length=100, blank=True, null=True, default='')
    village = models.CharField(max_length=150, blank=True, null=True, default='')
    pin_code = models.CharField(max_length=15, blank=True, null=True, default='')
    
    # GeoJSON / Spatial Coordinates
    latitude = models.FloatField(default=23.3441)
    longitude = models.FloatField(default=85.3096)
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='OPEN')
    priority = models.CharField(max_length=20, default='MEDIUM', help_text="AI Priority: LOW, MEDIUM, HIGH, CRITICAL")
    urgency_score = models.FloatField(default=5.0)
    required_expertise = models.JSONField(default=list, blank=True, help_text="AI extracted technical skills")
    upvotes = models.IntegerField(default=0)
    
    citizen = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='submitted_challenges')
    citizen_name = models.CharField(max_length=100, default='Anonymous Citizen')
    citizen_phone = models.CharField(max_length=20, blank=True, null=True, default='')
    is_anonymous = models.BooleanField(default=False)
    
    media_urls = models.JSONField(default=list, blank=True)
    assigned_university = models.CharField(max_length=150, blank=True, null=True, default=None)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.district}] {self.title} - ({self.status})"

    class Meta:
        ordering = ['-created_at']
