# 🌐 SolveSphere — Civic Problem-Solving & Collaboration Platform

    **It connects citizens, government, universities, and industry to transform real-world societal challenges into collaborative, technology-driven solutions.


## 📌 Executive Overview

**SolveSphere** is a centralized civic innovation ecosystem designed for the **Government of Jharkhand**. It operationalizes a structured pipeline that transforms grassroots citizen grievances into validated challenges, matches them with premier Higher Education Institutions through an **AI Partner Matching Engine**, unlocks CSR industry grants, and tracks real-world deployment across all 24 districts of Jharkhand.


## Citizen Dashboard

![Dashboard](<Citizen Dashboard.png>)


## 🏛️ Multi-Stakeholder Portals

| Stakeholder | Key Role & Access | Primary Capabilities |

**👥 Citizen** | Public / Authenticated Citizen | • Multilingual Problem Reporting (Manual Form, Voice Input, Photo/GIS Evidence)• Anonymous & Community Triage• Upvoting & Real-Time Tracking 
**🏛️ District Admin** | District Administration | • AI Scrutiny & Problem Report Validation• AI University Partner Matcher & Assignment• Live 5-Phase Project Tracking & Interactive Jharkhand SVG Map• Solution Verification & Official jsPDF Report Generation 
**🏢 State Govt** | State Administration Secretariat | • State-Wide 24-District Aggregation & Heatmaps• Early Warning Alerts & Disaster Triage• Inter-Department & Organization Verifications 
**🎓 Universities (HEI)** | Engineering Colleges & Research Labs | • Challenge Exploration & Technical Proposal Submission• Student-Faculty Team Setup & Milestone Deliveries• Technical Blueprints & Code Artifact Uploads 
**🏭 Industry & CSR** | Corporate CSR & Industry Mentors | • CSR Grant Allocation & Project Sponsorship• Collaboration Workspaces & Expert Mentorship• Impact Audits & ESG Governance 



### 1. 🤖 AI Government Review & Scrutiny
- **Automated Triage**: Classifies citizen problems by category (*Water Management, Clean Energy, Rural Infrastructure, Health & MedTech, Sanitation & Waste, Agriculture & FoodTech*).
- **Urgency Scoring**: Calculates `/10` severity scores based on community upvotes, population density, and safety factors.
- **Decision Engine**: One-click actions for *Approve & Publish to Challenge Pool*, *Request Information Clarification*, or *Reject Problem*.

### 2. 🎯 AI University Matching Engine
- Dynamically analyzes technical requirements against Jharkhand HEI departmental strengths, NIRF rankings, faculty competencies, and district proximity.
- Generates transparent match confidence percentages and detailed heuristic explanations.

### 3. 📍 Interactive Jharkhand Live Tracking
- **Interactive SVG Map**: Real-time district inspector highlighting active civic interventions in Ranchi, Dhanbad, East Singhbhum, Khunti, Latehar, Gumla, Bokaro, etc.
- **Admin Updater**: Modify progress percentages, update milestones, and adjust project health indicators (*On Track, At Risk, Delayed*).

### 4. 📄 Verified Solutions & jsPDF Report Generator
- Formal solution archive with technical architecture, cost breakdowns, and environmental benefits.


### 5. 📱 Responsive Mobile Experience (PWA)
- Full support for touch screens, mobile drawer navigation, horizontal scroll containers for large data tables, and Progressive Web App service workers.



## 🌲 Jharkhand State Focus

SolveSphere is strictly scoped and optimized for **Jharkhand State Governance**:

- **Districts Covered (24)**: Ranchi, Dhanbad, East Singhbhum (Jamshedpur), Khunti, Latehar, Gumla, Palamu, Bokaro, Hazaribagh, Deoghar, Dumka, Ramgarh, Giridih, West Singhbhum, Garhwa, Chatra, Koderma, Jamtara, Godda, Sahibganj, Pakur, Lohardaga, Simdega, Saraikela Kharsawan.



## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: TailwindCSS 4 + Lucide React + React Icons
- **Animation**: Motion (Framer Motion v13)
- **PDF Engine**: `jspdf` v4.2.1
- **Charts & Data Viz**: Recharts v3 + Custom SVG Geolocation Maps
- **PWA & Offline**: `vite-plugin-pwa` + Workbox
- **Internationalization**: Custom Multi-Language Engine (English, Hindi, Bengali, Ho, Santhali, Mundari, Kurukh, Nagpuri, Odia)

### Backend
- **Framework**: Django REST Framework (Python 3.11+)
- **Database**: SQLite3 (Local Dev) / MongoDB 
- **Authentication**: JWT & Role-Based Access Control (RBAC)
- **AI Modules**: Automated Urgency Scoring, NLP Problem Deduplication, Heuristic HEI Matching



## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **Python**: v3.10+ (for Django backend)



### 1. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will be live at `http://localhost:5173`.

```bash
# Production Build Verification
npm run build
```



### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install Python requirements
pip install -r requirements.txt

# Run migrations and seed data
python manage.py migrate
python seed_data.py

# Start Django development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`.



## 🔐 Security & Governance Principles

1. **Role-Based Access Control (RBAC)**: Strict segregation between Public, Citizen, University, Industry, and District/State Government views.
2. **Citizen Privacy**: Protected anonymous problem reporting mode with masked contact details for public displays.
3. **Audit Trail**: Every government approval, university assignment, and milestone sign-off is logged with timestamped validation credentials.

---



