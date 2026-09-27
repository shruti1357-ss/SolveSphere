from django.db import models
from challenges.models import Challenge

class Solution(models.Model):
    STATUS_CHOICES = (
        ('PROPOSED', 'Proposal Submitted'),
        ('UNDER_REVIEW', 'Under Mentorship Review'),
        ('APPROVED', 'Approved for Prototyping'),
        ('IN_PROGRESS', 'Field Testing In Progress'),
        ('COMPLETED', 'Deployed Public Good'),
    )

    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name='solution_proposals')
    team_name = models.CharField(max_length=150)
    university_name = models.CharField(max_length=150, default='NIT Jamshedpur')
    department = models.CharField(max_length=100, default='Environmental Engineering')
    faculty_mentor = models.CharField(max_length=100)
    student_leader = models.CharField(max_length=100)
    
    proposal_summary = models.TextField()
    
    # Milestone Tracking Schema: [{"title": "Lab Testing", "status": "COMPLETED", "proof_url": "https://..."}]
    milestones = models.JSONField(default=list, blank=True)
    
    csr_partner = models.CharField(max_length=150, blank=True, null=True, default='')
    csr_grant_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PROPOSED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.team_name} ({self.university_name}) -> Challenge #{self.challenge.id}"

    class Meta:
        ordering = ['-created_at']
