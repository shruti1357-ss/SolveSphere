from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('CITIZEN', 'Citizen / Local Community'),
        ('STUDENT', 'University Student'),
        ('FACULTY', 'Faculty Mentor'),
        ('UNIVERSITY', 'Registered University / Institution'),
        ('GOVT_ADMIN', 'Government / District Official'),
        ('GOVERNMENT_ADMIN', 'Government / District Official'),
        ('CSR_PARTNER', 'Industry / CSR Sponsor'),
        ('INDUSTRY', 'Industry / Corporate Partner'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CITIZEN')
    phone = models.CharField(max_length=15, blank=True, null=True)
    organization = models.CharField(max_length=150, blank=True, null=True, help_text="University or Company Name")
    district = models.CharField(max_length=100, blank=True, null=True, default="Ranchi")
    
    def __str__(self):
        return f"{self.username} ({self.role})"
