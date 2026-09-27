import uuid
from django.db import models
from django.conf import settings
from universities.models import UniversityProject


class IndustryProfile(models.Model):
    COMPANY_TYPES = (
        ('Startup', 'Startup'),
        ('MSME', 'MSME'),
        ('Corporate', 'Corporate'),
        ('NGO', 'NGO / Industry Partner'),
        ('TechProvider', 'Technology Provider'),
    )

    VERIFICATION_STATUS_CHOICES = (
        ('PENDING', 'Pending Admin Verification'),
        ('VERIFIED', 'Verified by Admin'),
        ('REJECTED', 'Verification Rejected'),
    )

    ACCOUNT_STATUS_CHOICES = (
        ('INACTIVE', 'Account Inactive'),
        ('ACTIVE', 'Account Active'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='industry_profile'
    )
    company_name = models.CharField(max_length=255)
    official_email = models.EmailField(unique=True)
    company_type = models.CharField(max_length=50, choices=COMPANY_TYPES, default='Corporate')
    website = models.CharField(max_length=255, blank=True, default='')
    registration_number = models.CharField(max_length=100, blank=True, default='')
    
    contact_person = models.CharField(max_length=150)
    designation = models.CharField(max_length=100, blank=True, default='')
    phone = models.CharField(max_length=20)
    
    state = models.CharField(max_length=100, default='Jharkhand')
    district = models.CharField(max_length=100, default='Ranchi')
    city = models.CharField(max_length=100, blank=True, default='Ranchi')
    address = models.TextField(blank=True, default='')

    expertise = models.JSONField(
        default=list,
        help_text="Industry technical expertise tags e.g. ['AI/ML', 'IoT', 'Cloud Computing']"
    )
    services = models.JSONField(
        default=list,
        help_text="Services offered e.g. ['Technical Mentorship', 'Funding', 'Prototype Testing', 'Cloud Resources']"
    )
    documents = models.JSONField(
        default=list,
        help_text="List of uploaded registration/GST certificate document URLs"
    )

    email_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, default=uuid.uuid4)
    otp_code = models.CharField(max_length=10, default='123456')
    verification_status = models.CharField(
        max_length=30,
        choices=VERIFICATION_STATUS_CHOICES,
        default='PENDING'
    )
    account_status = models.CharField(
        max_length=30,
        choices=ACCOUNT_STATUS_CHOICES,
        default='INACTIVE'
    )
    rejection_reason = models.TextField(blank=True, null=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} ({self.company_type}) - {self.verification_status}"


class IndustryCollaborationWorkspace(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending University Approval'),
        ('ACCEPTED', 'Collaboration Accepted'),
        ('ACTIVE', 'Active Collaboration'),
        ('COMPLETED', 'Collaboration Completed'),
        ('REJECTED', 'Collaboration Rejected'),
    )

    project = models.ForeignKey(
        UniversityProject,
        on_delete=models.CASCADE,
        related_name='industry_collaborations'
    )
    industry = models.ForeignKey(
        IndustryProfile,
        on_delete=models.CASCADE,
        related_name='collaborations'
    )
    collaboration_type = models.JSONField(default=list, help_text="e.g. ['Technical Mentorship', 'Testing', 'Funding']")
    message = models.TextField()
    proposed_support = models.TextField(blank=True, default='')
    expected_duration = models.CharField(max_length=50, default='3 Months')
    match_score = models.IntegerField(default=92)
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.industry.company_name} <-> {self.project.title} [{self.status}]"


class IndustryFeedback(models.Model):
    workspace = models.ForeignKey(
        IndustryCollaborationWorkspace,
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )
    industry = models.ForeignKey(
        IndustryProfile,
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )
    title = models.CharField(max_length=255)
    feedback_text = models.TextField()
    rating = models.IntegerField(default=5, help_text="Rating from 1 to 5")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.industry.company_name}] {self.title}"


class IndustryNotification(models.Model):
    industry = models.ForeignKey(
        IndustryProfile,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, default='SYSTEM')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.industry.company_name}] {self.title}"
