from django.db import models
from django.conf import settings
from challenges.models import Challenge


class GovernmentAdminProfile(models.Model):
    AUTHORIZATION_STATUS_CHOICES = (
        ('PENDING', 'Pending Super-Admin Approval'),
        ('APPROVED', 'Approved & Active Officer'),
        ('REJECTED', 'Authorization Rejected'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='govt_admin_profile'
    )
    full_name = models.CharField(max_length=150)
    official_email = models.EmailField(unique=True)
    department = models.CharField(max_length=150, default='Rural Development')
    designation = models.CharField(max_length=150, default='District Officer')
    state = models.CharField(max_length=100, default='Jharkhand')
    district = models.CharField(max_length=100, default='Ranchi')
    officer_id = models.CharField(max_length=100, default='DEMO-OFFICER-2026')
    phone = models.CharField(max_length=20, blank=True, default='')
    id_proof_number = models.CharField(max_length=100, blank=True, default='')
    
    authorization_status = models.CharField(
        max_length=30,
        choices=AUTHORIZATION_STATUS_CHOICES,
        default='PENDING'
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_officers'
    )
    approval_date = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Officer {self.full_name} ({self.department} - {self.district}) [{self.authorization_status}]"



class GovernmentValidationRecord(models.Model):
    STATUS_CHOICES = (
        ('VALIDATED', 'Validated & Approved'),
        ('REJECTED', 'Rejected'),
        ('REQUEST_INFO', 'More Information Requested'),
    )

    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='government_validations'
    )
    validated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='validated_challenges'
    )
    status_assigned = models.CharField(max_length=30, choices=STATUS_CHOICES, default='VALIDATED')
    priority_assigned = models.CharField(max_length=20, default='HIGH')
    validation_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Validation [{self.status_assigned}] -> Challenge #{self.challenge.id}"


class UniversityAssignmentRecord(models.Model):
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='university_assignments'
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_challenges'
    )
    university_name = models.CharField(max_length=255)
    official_email = models.EmailField(blank=True, default='')
    match_score = models.IntegerField(default=95)
    assignment_notes = models.TextField(blank=True, default='')
    target_deadline = models.CharField(max_length=100, default='6 Months')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Assignment -> {self.university_name} for Challenge #{self.challenge.id}"


class GovernmentNotification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='govt_notifications'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, default='SYSTEM')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.user.username}] {self.title}"
