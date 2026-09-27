import uuid
from django.db import models
from django.conf import settings
from challenges.models import Challenge


class UniversityProfile(models.Model):
    UNIVERSITY_TYPES = (
        ('UNIVERSITY', 'University'),
        ('COLLEGE', 'Autonomous / Constituent College'),
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
        related_name='university_profile'
    )
    university_name = models.CharField(max_length=255)
    official_email = models.EmailField(unique=True)
    contact_person = models.CharField(max_length=150)
    contact_number = models.CharField(max_length=20)
    university_type = models.CharField(max_length=50, choices=UNIVERSITY_TYPES, default='UNIVERSITY')
    address = models.TextField(blank=True, default='')
    district = models.CharField(max_length=100, default='Ranchi')
    
    departments = models.JSONField(default=list, help_text="List of departments, e.g. ['CSE', 'ECE']")
    expertise = models.JSONField(default=list, help_text="List of expertise tags, e.g. ['AI/ML', 'IoT']")
    research_areas = models.TextField(blank=True, default='')

    email_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, default=uuid.uuid4)
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
        return f"{self.university_name} ({self.district}) - {self.verification_status}"


class Faculty(models.Model):
    university = models.ForeignKey(
        UniversityProfile,
        on_delete=models.CASCADE,
        related_name='faculty_members'
    )
    name = models.CharField(max_length=150)
    department = models.CharField(max_length=100)
    email = models.EmailField()
    expertise = models.JSONField(default=list, help_text="Faculty expertise tags e.g. ['AI/ML', 'Computer Vision']")

    def __str__(self):
        return f"{self.name} - {self.department} ({self.university.university_name})"


class UniversityProject(models.Model):
    PROJECT_STATUS_CHOICES = (
        ('PROTOTYPE', 'Prototype Development'),
        ('TESTING', 'Lab & Field Testing'),
        ('PILOT', 'Field Pilot'),
        ('DEPLOYED', 'Field Deployment'),
        ('COMPLETED', 'Project Completed'),
    )

    COLLABORATION_STATUS_CHOICES = (
        ('NONE', 'No Industry Partner'),
        ('PENDING', 'Collaboration Request Pending'),
        ('ACTIVE', 'Active Industry Partner'),
    )

    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='university_projects'
    )
    university = models.ForeignKey(
        UniversityProfile,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    faculty_mentor = models.ForeignKey(
        Faculty,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='mentored_projects'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    expected_outcome = models.TextField(blank=True, default='')
    required_skills = models.JSONField(default=list)
    estimated_duration = models.CharField(max_length=50, default='6 Months')
    team_size = models.IntegerField(default=4)
    
    status = models.CharField(max_length=40, choices=PROJECT_STATUS_CHOICES, default='PROTOTYPE')
    progress_percent = models.IntegerField(default=0)
    industry_collaboration_status = models.CharField(
        max_length=30,
        choices=COLLABORATION_STATUS_CHOICES,
        default='NONE'
    )
    active_industry_partner = models.CharField(max_length=255, blank=True, null=True, default=None)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.university.university_name}"


class ProjectTeamMember(models.Model):
    project = models.ForeignKey(
        UniversityProject,
        on_delete=models.CASCADE,
        related_name='team_members'
    )
    student_name = models.CharField(max_length=150)
    department = models.CharField(max_length=100)
    email = models.EmailField()
    role = models.CharField(max_length=100, default='Student Researcher')

    def __str__(self):
        return f"{self.student_name} ({self.department}) -> {self.project.title}"


class ProjectMilestone(models.Model):
    MILESTONE_STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    )

    project = models.ForeignKey(
        UniversityProject,
        on_delete=models.CASCADE,
        related_name='milestones'
    )
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=30, choices=MILESTONE_STATUS_CHOICES, default='PENDING')
    progress_percent = models.IntegerField(default=0)
    evidence_url = models.CharField(max_length=500, blank=True, default='')
    comments = models.TextField(blank=True, default='')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} [{self.status}] - {self.project.title}"


class CollaborationRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending University Response'),
        ('ACCEPTED', 'Collaboration Accepted'),
        ('REJECTED', 'Collaboration Rejected'),
    )

    project = models.ForeignKey(
        UniversityProject,
        on_delete=models.CASCADE,
        related_name='collaboration_requests'
    )
    industry_name = models.CharField(max_length=255)
    offered_support = models.JSONField(default=list, help_text="e.g. ['AI Mentorship', 'Funding', 'Prototype Testing']")
    message = models.TextField()
    match_score = models.IntegerField(default=90)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.industry_name} -> {self.project.title} ({self.status})"


class ProjectReport(models.Model):
    REPORT_TYPE_CHOICES = (
        ('PROGRESS', 'Periodic Progress Report'),
        ('PILOT', 'Field Pilot Report'),
        ('IMPACT', 'Final Social Impact Report'),
    )

    project = models.ForeignKey(
        UniversityProject,
        on_delete=models.CASCADE,
        related_name='reports'
    )
    report_type = models.CharField(max_length=30, choices=REPORT_TYPE_CHOICES, default='PROGRESS')
    title = models.CharField(max_length=255)
    content_json = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.report_type}] {self.title} - {self.project.title}"


class UniversityNotification(models.Model):
    university = models.ForeignKey(
        UniversityProfile,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, default='SYSTEM')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.university.university_name}] {self.title}"
