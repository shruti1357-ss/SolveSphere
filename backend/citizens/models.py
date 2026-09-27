import uuid
from django.db import models
from django.conf import settings
from challenges.models import Challenge


class CitizenProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='citizen_profile'
    )
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    
    state = models.CharField(max_length=100, default='Jharkhand')
    district = models.CharField(max_length=100, default='Ranchi')
    block = models.CharField(max_length=100, blank=True, default='')
    village = models.CharField(max_length=150, blank=True, default='')
    pin_code = models.CharField(max_length=15, blank=True, default='')
    
    occupation = models.CharField(max_length=100, blank=True, default='')
    age_group = models.CharField(max_length=20, default='18-25')

    otp_code = models.CharField(max_length=10, default='123456')
    email_verified = models.BooleanField(default=False)
    account_status = models.CharField(max_length=30, default='EMAIL_VERIFIED')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.district})"


class ChallengeEvidence(models.Model):
    EVIDENCE_TYPES = (
        ('IMAGE', 'Photo / Image'),
        ('DOCUMENT', 'Supporting Document (PDF/Doc)'),
        ('VIDEO', 'Video Clip'),
    )

    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='evidence_files'
    )
    file_name = models.CharField(max_length=255)
    file_url = models.CharField(max_length=500)
    file_type = models.CharField(max_length=20, choices=EVIDENCE_TYPES, default='IMAGE')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.file_type}] {self.file_name} -> Challenge #{self.challenge.id}"


class AIAnalysisRecord(models.Model):
    challenge = models.OneToOneField(
        Challenge,
        on_delete=models.CASCADE,
        related_name='ai_analysis'
    )
    category = models.CharField(max_length=100)
    priority = models.CharField(max_length=20, default='MEDIUM')
    urgency_score = models.FloatField(default=5.0)
    duplicate_score = models.FloatField(default=0.0)
    matching_duplicate_id = models.IntegerField(null=True, blank=True)
    matching_duplicate_title = models.CharField(max_length=255, blank=True, default='')
    required_expertise = models.JSONField(default=list)
    ai_summary = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Analysis -> Challenge #{self.challenge.id} ({self.priority})"


class CitizenFeedback(models.Model):
    WAS_SOLVED_CHOICES = (
        ('Yes', 'Yes, Completely Solved'),
        ('Partially', 'Partially Solved'),
        ('No', 'No, Not Solved'),
    )

    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )
    citizen = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='citizen_feedbacks'
    )
    rating = models.IntegerField(default=5, help_text="Star rating from 1 to 5")
    was_solved = models.CharField(max_length=20, choices=WAS_SOLVED_CHOICES, default='Yes')
    feedback_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for Challenge #{self.challenge.id} ({self.was_solved})"


class CitizenNotification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='citizen_notifications'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, default='SYSTEM')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.user.username}] {self.title}"


class CitizenMilestoneRecord(models.Model):
    STATUS_CHOICES = (
        ('COMPLETED', 'Completed'),
        ('IN_PROGRESS', 'In Progress'),
        ('PENDING', 'Pending'),
    )

    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='milestone_records'
    )
    stage_number = models.IntegerField(default=1)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING')
    completed_date = models.CharField(max_length=100, blank=True, default='')
    proof_label = models.CharField(max_length=255, blank=True, default='')
    proof_url = models.CharField(max_length=500, blank=True, default='')
    assigned_stakeholder = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['stage_number']

    def __str__(self):
        return f"Stage {self.stage_number}: {self.title} ({self.status})"


class CitizenTimelineEvent(models.Model):
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='timeline_events'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    timestamp_text = models.CharField(max_length=100, default='Just now')
    event_type = models.CharField(max_length=50, default='SYSTEM')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.challenge.id}] {self.title}"


