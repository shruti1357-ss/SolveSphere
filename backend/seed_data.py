import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from challenges.models import Challenge
from solutions.models import Solution

User = get_user_model()

def seed():
    print("[INIT] Starting SolveSphere Database Seeding...")

    # 1. Clear existing data
    Solution.objects.all().delete()
    Challenge.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete()

    # 2. Create Demo Users
    citizen = User.objects.create_user(
        username='ramesh_kumar',
        email='ramesh@example.com',
        password='password123',
        first_name='Ramesh',
        last_name='Kumar',
        role='CITIZEN',
        phone='+919876543210',
        district='Ranchi'
    )

    student = User.objects.create_user(
        username='student_nitjmr',
        email='student@nitjmr.ac.in',
        password='password123',
        first_name='Aman',
        last_name='Singh',
        role='STUDENT',
        organization='NIT Jamshedpur',
        district='Purbi Singhbhum'
    )

    govt_admin = User.objects.create_user(
        username='govt_official',
        email='admin@jharkhand.gov.in',
        password='password123',
        first_name='Priya',
        last_name='Sharma',
        role='GOVERNMENT_ADMIN',
        organization='Dept of Rural Development, Govt of Jharkhand',
        district='Ranchi'
    )

    govt_admin_demo = User.objects.create_user(
        username='admin_demo_officer',
        email='admin@sih-demo.local',
        password='AdminDemo123!',
        first_name='District',
        last_name='Officer',
        role='GOVERNMENT_ADMIN',
        organization='Rural Development Department',
        district='Ranchi'
    )

    from admin_portal.models import GovernmentAdminProfile
    GovernmentAdminProfile.objects.get_or_create(
        user=govt_admin_demo,
        defaults={
            "full_name": "District Officer (Rural Development)",
            "official_email": "admin@sih-demo.local",
            "department": "Rural Development",
            "designation": "District Nodal Officer",
            "state": "Jharkhand",
            "district": "Ranchi",
            "officer_id": "DEMO-OFFICER-2026",
            "authorization_status": "APPROVED"
        }
    )

    csr_partner = User.objects.create_user(
        username='tata_csr',
        email='csr@tatasteel.com',
        password='password123',
        first_name='Vikram',
        last_name='Mehta',
        role='CSR_PARTNER',
        organization='Tata Steel CSR Foundation',
        district='Purbi Singhbhum'
    )

    print("[SUCCESS] Created 4 Demo Users (Citizen, Student, Govt Admin, CSR Sponsor)")

    # 3. Create Demo Challenges
    c1 = Challenge.objects.create(
        title="Arsenic & Fluoride Contamination in Kanke Block Wells",
        description="High levels of toxic arsenic and fluoride detected in community handpumps across 4 panchayats in Kanke block, causing severe bone fluorosis and gastrointestinal illness among villagers.",
        category="Water Management",
        district="Ranchi",
        block="Kanke",
        latitude=23.4341,
        longitude=85.3296,
        status="ASSIGNED_TO_HEI",
        urgency_score=9.1,
        upvotes=48,
        citizen=citizen,
        citizen_name="Ramesh Kumar",
        citizen_phone="+919876543210",
        media_urls=["https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3"],
        assigned_university="IIT ISM Dhanbad"
    )

    c2 = Challenge.objects.create(
        title="Brown Plant Hopper Insect Infestation in Kharif Paddy Crops",
        description="Rapid spread of brown plant hopper insects destroying 30+ hectares of standing Kharif paddy crops near Ormanjhi. Local farmers lack low-cost bio-pesticide access.",
        category="Agriculture & FoodTech",
        district="Ranchi",
        block="Ormanjhi",
        latitude=23.4795,
        longitude=85.4851,
        status="IN_PROGRESS",
        urgency_score=8.4,
        upvotes=32,
        citizen_name="Sita Devi",
        citizen_phone="+919876543211",
        media_urls=["https://images.unsplash.com/photo-1574943320219-553eb213f72d"],
        assigned_university="Birsa Agricultural University (BAU) Ranchi"
    )

    c3 = Challenge.objects.create(
        title="Lack of Cold Storage for Smallholder Organic Vegetable Farmers",
        description="Smallholder tribal farmers in Khunti face 40% post-harvest spoilage of perishable organic vegetables due to absence of solar-powered localized cold storage units.",
        category="Agriculture & FoodTech",
        district="Khunti",
        block="Murhu",
        latitude=22.9863,
        longitude=85.2764,
        status="OPEN",
        urgency_score=7.8,
        upvotes=27,
        citizen_name="Birsa Munda Group",
        is_anonymous=False,
        media_urls=["https://images.unsplash.com/photo-1500937386664-56d1dfef3854"]
    )

    c4 = Challenge.objects.create(
        title="Bridge Structural Damage & Road Washout After Flash Floods",
        description="Heavy monsoon downpour eroded structural pillar of vital connectivity bridge over Subarnarekha river, isolating 12 interior villages from main hospital access.",
        category="Rural Infrastructure",
        district="Purbi Singhbhum",
        block="Ghatshila",
        latitude=22.5833,
        longitude=86.4833,
        status="OPEN",
        urgency_score=8.9,
        upvotes=56,
        citizen_name="Gram Panchayat Secretary",
        media_urls=["https://images.unsplash.com/photo-1513836279014-a89f7a76ae86"]
    )

    c5 = Challenge.objects.create(
        title="Primary Healthcare Center Distance & Vaccine Cold Chain Gaps",
        description="Remote tribal hamlets in Simdega lack real-time vaccine temperature tracking and immediate emergency telehealth consultations during rainy season.",
        category="Health & MedTech",
        district="Simdega",
        block="Kolebira",
        latitude=22.6167,
        longitude=84.7500,
        status="RESOLVED",
        urgency_score=6.2,
        upvotes=19,
        citizen_name="Anonymous Villager",
        is_anonymous=True,
        media_urls=["https://images.unsplash.com/photo-1584515979956-d9f6e5d09982"],
        assigned_university="BIT Mesra"
    )

    print("[SUCCESS] Created 5 Realistic Jharkhand Challenges (Ranchi, Khunti, Purbi Singhbhum, Simdega)")

    # 4. Create Demo Solutions
    s1 = Solution.objects.create(
        challenge=c1,
        team_name="AquaShield Innovations",
        university_name="IIT ISM Dhanbad",
        department="Environmental & Earth Sciences Engineering",
        faculty_mentor="Dr. Alok Nath",
        student_leader="Aman Singh",
        proposal_summary="Low-cost bio-char and iron-oxide nanoparticle filtration column capable of removing 99.2% of dissolved arsenic and fluoride from rural handpumps without electricity.",
        milestones=[
            {"title": "Lab Water Sample Testing & Bio-char Filter Optimization", "status": "COMPLETED", "proof_url": "https://drive.google.com/proof1"},
            {"title": "Kanke Handpump Pilot Installation (Unit 1 & 2)", "status": "IN_PROGRESS", "proof_url": "https://drive.google.com/proof2"},
            {"title": "Government Bureau of Indian Standards (BIS) Water Quality Certification", "status": "PENDING", "proof_url": ""}
        ],
        csr_partner="Tata Steel CSR Foundation",
        csr_grant_amount=250000.00,
        status="IN_PROGRESS"
    )

    s2 = Solution.objects.create(
        challenge=c2,
        team_name="AgriGuard Bio",
        university_name="Birsa Agricultural University (BAU) Ranchi",
        department="Department of Agronomy & Bio-pesticides",
        faculty_mentor="Dr. Sunita Murmu",
        student_leader="Priya Hansda",
        proposal_summary="Indigenous neem-extract and Beauveria bassiana fungal bio-spray with smartphone camera pest density detection model for early spray alerts.",
        milestones=[
            {"title": "Fungal Bio-pesticide Lab Culture & Field Toxicity Assay", "status": "COMPLETED", "proof_url": "https://drive.google.com/proof3"},
            {"title": "Ormanjhi Farmers Co-op Field Trial", "status": "IN_PROGRESS", "proof_url": ""}
        ],
        csr_partner="UPL Sustainable Ag CSR",
        csr_grant_amount=180000.00,
        status="APPROVED"
    )

    print("[SUCCESS] Created 2 Detailed Solution Proposals with Milestones & CSR Grants")

    print("\n[COMPLETE] SolveSphere Database Seeding Finished Successfully!")

if __name__ == '__main__':
    seed()
