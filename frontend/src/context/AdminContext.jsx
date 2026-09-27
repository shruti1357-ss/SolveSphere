import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const STORAGE_KEY = "solvesphere_admin_portal_data_v1";

const initialMockData = {
  challenges: [
    {
      id: "DEMO-26043-01",
      title: "Safe Drinking Water Monitoring in Rural Villages",
      submittedBy: "Jharkhand Community Demo",
      category: "Water Management",
      backendCategory: "Water Management",
      location: "East Singhbhum, Jharkhand",
      district: "East Singhbhum",
      date: "2026-09-12",
      priority: "High",
      status: "UNDER_REVIEW",
      description:
        "Demo societal challenge for testing the Government review workflow. Build a low-cost monitoring and alert system for safe drinking water in rural communities.",
      department: "Rural Development Department",
      budget: "₹3 Lakhs",
      impactTarget: "5,000 residents",
      isDemo: true,
    },
    {
      id: "CH-8091",
      title: "AI-Powered Traffic Signal Synchronization in High-Density Corridors",
      submittedBy: "Dept. of Urban Transportation & Traffic",
      category: "Rural Infrastructure",
      backendCategory: "Rural Infrastructure",
      location: "Ranchi, Jharkhand",
      district: "Ranchi",
      date: "2026-08-28",
      priority: "High",
      status: "UNDER_REVIEW",
      description:
        "Implementing computer vision and real-time sensor analytics to dynamically optimize traffic light timers across critical intersections to reduce urban congestion.",
      department: "Urban Development & Transport Department",
      budget: "₹2.5 Lakhs",
      impactTarget: "12 Lakhs daily commuters",
      impact: "35% Urban Delay Reduction at 48 Intersections",
      solvingOrg: "BIT Mesra, Ranchi",
      citizensAffected: "1,200,000 Commuters",
      costSaved: "₹6.2 Lakhs / year",
    },
    {
      id: "CH-8088",
      title: "Solar-Microgrid Deployment for Rural Healthcare Centers",
      submittedBy: "Ministry of New & Renewable Energy / NHM",
      category: "Clean Energy",
      backendCategory: "Clean Energy",
      location: "Khunti, Jharkhand",
      district: "Khunti",
      date: "2026-08-25",
      priority: "High",
      status: "UNDER_REVIEW",
      description:
        "Provisioning 24/7 uninterrupted solar power with lithium-ion storage for primary health centers in off-grid remote tribal villages.",
      department: "Jharkhand Renewable Energy Development Agency (JREDA)",
      budget: "₹4.2 Lakhs",
      impactTarget: "85 Healthcare Centers",
      impact: "24/7 Power to 85 Remote Health Sub-Centres",
      solvingOrg: "IIT (ISM) Dhanbad CleanTech Hub",
      citizensAffected: "340,000 Patients",
      costSaved: "₹11.5 Lakhs / year",
    },
    {
      id: "CH-8072",
      title: "Automated Water Contamination Detection Pipeline",
      submittedBy: "State Pollution Control Board",
      category: "Water Management",
      backendCategory: "Water Management",
      location: "East Singhbhum, Jharkhand",
      district: "East Singhbhum",
      date: "2026-08-21",
      priority: "Medium",
      status: "UNDER_REVIEW",
      description:
        "IoT buoy networks along Subarnarekha and Damodar riverbanks measuring heavy metals, pH, and dissolved oxygen with automated early alerts.",
      department: "Drinking Water & Sanitation Department",
      budget: "₹1.8 Lakhs",
      impactTarget: "24 Lakhs Residents",
      impact: "Real-Time 4-Min Toxic Spill Early Alerts",
      solvingOrg: "NIT Jamshedpur Innovation Centre",
      citizensAffected: "2,400,000 Residents",
      costSaved: "₹9.8 Lakhs",
    },
    {
      id: "CH-7950",
      title: "Municipal Solid Waste Automated Sorting Systems",
      submittedBy: "Swachh Bharat Innovation Cell",
      category: "Sanitation & Waste",
      backendCategory: "Sanitation & Waste",
      location: "Dhanbad, Jharkhand",
      district: "Dhanbad",
      date: "2026-07-15",
      priority: "Medium",
      status: "IN_PROGRESS",
      progress: 68,
      deadline: "2026-11-30",
      participants: 14,
      teams: 5,
      proposalsCount: 8,
      description:
        "Robotics and NIR spectroscopy sorting units at material recovery facilities to boost dry waste recycling rates.",
      department: "Urban Development & Housing Department",
      budget: "₹5.0 Lakhs",
      impactTarget: "500 Metric Tons/day",
      impact: "85% Dry Waste Recyclable Recovery Rate",
      solvingOrg: "IIT (ISM) Dhanbad CleanTech Lab",
      assigned_university: "IIT (ISM) Dhanbad CleanTech Lab",
      citizensAffected: "950,000 Residents",
      costSaved: "₹16.0 Lakhs / year",
    },
    {
      id: "CH-7912",
      title: "Blockchain-Based Land Record Verification System",
      submittedBy: "Department of Land Resources & Registration",
      category: "Rural Infrastructure",
      backendCategory: "Rural Infrastructure",
      location: "Ranchi, Jharkhand",
      district: "Ranchi",
      date: "2026-06-10",
      priority: "High",
      status: "IN_PROGRESS",
      progress: 82,
      deadline: "2026-10-15",
      participants: 22,
      teams: 8,
      proposalsCount: 12,
      description:
        "Tamper-proof digital title registry eliminating property fraud and streamlining urban-rural property deed audits.",
      department: "Revenue & Land Reforms Department",
      budget: "₹3.5 Lakhs",
      impactTarget: "45 Lakhs Property Owners",
      impact: "100% Title Authenticity & Fraud Elimination",
      solvingOrg: "BIT Mesra (CSE Dept.)",
      assigned_university: "BIT Mesra (CSE Dept.)",
      citizensAffected: "4,500,000 Citizens",
      costSaved: "₹28.0 Lakhs",
    },
    {
      id: "CH-7880",
      title: "Tele-Ophthalmology Mobile Clinics for Tribal Belts",
      submittedBy: "National Health Mission Jharkhand",
      category: "Health & MedTech",
      backendCategory: "Health & MedTech",
      location: "Khunti, Jharkhand",
      district: "Khunti",
      date: "2026-05-18",
      priority: "Low",
      status: "IN_PROGRESS",
      progress: 45,
      deadline: "2026-12-20",
      participants: 9,
      teams: 3,
      proposalsCount: 6,
      description:
        "AI-assisted retinal scanner vans diagnosing diabetic retinopathy and cataracts in remote hilly tribal blocks.",
      department: "Health, Medical Education & Family Welfare",
      budget: "₹1.9 Lakhs",
      impactTarget: "120,000 Patients",
      impact: "120,000+ Rural Tribal Patients Screened",
      solvingOrg: "Ranchi University / AIIMS Deoghar",
      assigned_university: "Ranchi University / AIIMS Deoghar",
      citizensAffected: "120,000 Patients",
      costSaved: "₹5.4 Lakhs",
    },
    {
      id: "CH-7500",
      title: "IoT Flood Monitoring & Early Warning System",
      submittedBy: "Disaster Management Authority",
      category: "Water Management",
      backendCategory: "Water Management",
      location: "East Singhbhum, Jharkhand",
      district: "East Singhbhum",
      date: "2026-01-10",
      completionDate: "2026-07-20",
      solvingOrg: "NIT Jamshedpur Water Tech Group",
      assigned_university: "NIT Jamshedpur Water Tech Group",
      priority: "High",
      status: "RESOLVED",
      impact: "98.4% Prediction Accuracy with 6-Hr Warning",
      citizensAffected: "3,500,000+ Citizens",
      costSaved: "₹14.0 Lakhs / season",
      geographicReach: "East Singhbhum & Subarnarekha Basin",
      description:
        "Ultrasonic sensor grid coupled with machine learning hydrological models providing 6-hour advance warning before urban flash floods.",
      department: "Disaster Management Department",
    },
    {
      id: "CH-7450",
      title: "Digital Public School Attendance & Midday Meal Tracking",
      submittedBy: "Department of School Education & Literacy",
      category: "Smart Education",
      backendCategory: "Smart Education",
      location: "Ranchi, Jharkhand",
      district: "Ranchi",
      date: "2025-11-05",
      completionDate: "2026-06-12",
      solvingOrg: "BIT Mesra & EdTech Samarth",
      assigned_university: "BIT Mesra & EdTech Samarth",
      priority: "Medium",
      status: "RESOLVED",
      impact: "Zero Leakage & 99% Meal Verification",
      citizensAffected: "850,000 Students",
      costSaved: "₹8.5 Lakhs / year",
      geographicReach: "Ranchi & Khunti Public Schools",
      description:
        "Facial recognition tablet app with automated supply-chain logging for transparent distribution of government subsidized meals.",
      department: "School Education & Literacy Department",
    },
  ],

  proposals: [
    {
      id: "SOL-3041",
      challengeId: "CH-8091",
      challengeTitle:
        "AI-Powered Traffic Signal Synchronization in High-Density Corridors",
      team_name: "Ranchi Urban AI Task Force",
      university_name: "BIT Mesra",
      department: "Computer Science & Artificial Intelligence",
      faculty_mentor: "Dr. Sandeep Kumar (Prof. CSE)",
      student_leader: "Aarav Sharma (M.Tech AI)",
      organization: "BIT Mesra AI & Robotics Lab",
      district: "Ranchi",
      proposal_summary:
        "Deploy edge-AI camera modules with reinforcement learning controllers that adapt signal green times based on real-time corridor queue lengths.",
      abstract:
        "Deploy edge-AI camera modules with reinforcement learning controllers that adapt signal green times based on real-time corridor queue lengths.",
      milestones: [
        { name: "Traffic Data Collection & Baseline", status: "Completed" },
        { name: "AI Neural Network Development", status: "In Progress" },
        { name: "Hardware Edge Kit Calibration", status: "Pending" },
        { name: "Main Road Pilot Deployment", status: "Pending" },
      ],
      csr_partner: "Tata Steel CSR Tech Grant",
      csr_grant_amount: 250000,
      estimatedCost: "₹2.5 Lakhs",
      expectedImpact: "35% Delay Reduction at key Ranchi junctions",
      technicalScore: 94,
      submittedDate: "2026-08-30",
      status: "UNDER_REVIEW",
    },
    {
      id: "SOL-3038",
      challengeId: "CH-8088",
      challengeTitle: "Solar-Microgrid Deployment for Rural Healthcare",
      team_name: "SunGrid Rural Energy Innovations",
      university_name: "IIT (ISM) Dhanbad",
      department: "Electrical & Clean Energy Engineering",
      faculty_mentor: "Prof. Rajiv Shekhar (Dean R&D)",
      student_leader: "Rohan Verma (Research Scholar)",
      organization: "IIT (ISM) Dhanbad CleanTech Hub",
      district: "Dhanbad",
      proposal_summary:
        "Modular plug-and-play solar microgrids with smart load prioritization ensuring continuous ICU & cold-chain vaccine refrigeration power.",
      abstract:
        "Modular plug-and-play solar microgrids with smart load prioritization ensuring continuous ICU & cold-chain vaccine refrigeration power.",
      milestones: [
        { name: "Site Feasibility Survey", status: "Completed" },
        { name: "Microgrid Inverter Engineering", status: "Completed" },
        { name: "Prototype Battery Testing", status: "In Progress" },
        { name: "Primary Health Centre Commissioning", status: "Pending" },
      ],
      csr_partner: "BCCL CSR Clean Energy Fund",
      csr_grant_amount: 390000,
      estimatedCost: "₹3.9 Lakhs",
      expectedImpact: "24/7 Power Reliability with remote telemetry",
      technicalScore: 91,
      submittedDate: "2026-08-27",
      status: "APPROVED",
    },
    {
      id: "SOL-3022",
      challengeId: "CH-8072",
      challengeTitle: "Automated Water Contamination Detection",
      team_name: "AquaSense IoT Research Team",
      university_name: "NIT Jamshedpur",
      department: "Electronics & Water Technologies",
      faculty_mentor: "Dr. K. K. Shukla (Director)",
      student_leader: "Aditya Kumar (B.Tech ECE)",
      organization: "NIT Jamshedpur Innovation Centre",
      district: "East Singhbhum",
      proposal_summary:
        "Self-cleaning electrochemical sensor buoys communicating via LoRaWAN to cloud water quality monitoring servers.",
      abstract:
        "Self-cleaning electrochemical sensor buoys communicating via LoRaWAN to cloud water quality monitoring servers.",
      milestones: [
        { name: "Electrochemical Sensor Benchmarking", status: "Completed" },
        { name: "LoRaWAN Transceiver Integration", status: "In Progress" },
        { name: "Subarnarekha River Field Trials", status: "Pending" },
        { name: "District Dashboard Telemetry Node", status: "Pending" },
      ],
      csr_partner: "Tata Motors CSR Foundation",
      csr_grant_amount: 180000,
      estimatedCost: "₹1.8 Lakhs",
      expectedImpact: "Real-time toxic alert dispatch within 4 minutes",
      technicalScore: 88,
      submittedDate: "2026-08-24",
      status: "UNDER_REVIEW",
    },
    {
      id: "SOL-2990",
      challengeId: "CH-7950",
      challengeTitle: "Municipal Solid Waste Automated Sorting",
      team_name: "EcoSort Jharkhand Robotics Team",
      university_name: "BIT Sindri / Birsa Agricultural Univ",
      department: "Robotics & Waste Management Dept.",
      faculty_mentor: "Prof. Vikram Rao (HOD Mech)",
      student_leader: "Karan Singh (Lead Robotics Engineer)",
      organization: "EcoSort Robotics India",
      district: "Bokaro",
      proposal_summary:
        "Dual-arm delta robot arms equipped with hyperspectral computer vision capable of automated sorting at 120 items per minute.",
      abstract:
        "Dual-arm delta robot arms equipped with hyperspectral computer vision capable of automated sorting at 120 items per minute.",
      milestones: [
        { name: "Facility Readiness Survey", status: "Completed" },
        { name: "Conveyor Hardware Optical Rig", status: "In Progress" },
        { name: "Computer Vision Model Calibration", status: "Pending" },
        { name: "Bokaro Plant Field Pilot Run", status: "Pending" },
      ],
      csr_partner: "SAIL Bokaro Steel CSR Wing",
      csr_grant_amount: 470000,
      estimatedCost: "₹4.7 Lakhs",
      expectedImpact: "85% Sorting Accuracy for recyclable plastics",
      technicalScore: 96,
      submittedDate: "2026-07-20",
      status: "IN_PROGRESS",
      assignedProjectId: "TRK-1002",
    },
  ],

  trackingProjects: [
    {
      id: "TRK-1001",
      challengeId: "CH-7912",
      challenge: "Blockchain Land Record Verification",
      name: "Blockchain Land Record Verification System",
      organization: "BIT Mesra (CSE Dept.)",
      district: "Ranchi",
      currentPhase: "Prototype",
      progress: 78,
      deadline: "2026-10-15",
      health: "On Track",
      lastUpdate: "2026-09-02",
      department: "Revenue & Land Reforms Department",
      milestones: [
        { name: "Requirement Gathering & Field Survey", status: "Completed" },
        { name: "Smart Contract Architecture & Security", status: "Completed" },
        { name: "Sub-Registrar Office Pilot Testbed", status: "In Progress" },
        { name: "State-wide Security & Node Audit", status: "Pending" },
      ],
      recentUpdate:
        "Completed pilot smart contract indexing across 3 sub-registrar offices in Ranchi district.",
    },
    {
      id: "TRK-1002",
      challengeId: "CH-7950",
      challenge: "Municipal Waste Automated Sorting",
      name: "AI-Powered Automated Waste Segregation Facility",
      organization: "IIT (ISM) Dhanbad CleanTech Lab",
      district: "Dhanbad",
      currentPhase: "Research",
      progress: 35,
      deadline: "2026-11-30",
      health: "On Track",
      lastUpdate: "2026-09-01",
      department: "Urban Development & Housing Department",
      milestones: [
        { name: "Site Readiness Survey & Waste Characterization", status: "Completed" },
        { name: "Conveyor Hardware Integration & Optical Rig", status: "In Progress" },
        { name: "Robotic Arm Computer Vision Calibration", status: "Pending" },
        { name: "Dhanbad Plant Full Field Pilot Run", status: "Pending" },
      ],
      recentUpdate:
        "Site readiness survey finalized for Dhanbad Central Waste Facility. Optical sensor rigs deployed.",
    },
    {
      id: "TRK-1003",
      challengeId: "CH-7880",
      challenge: "Tele-Ophthalmology Mobile Clinics",
      name: "Rural Vision AI Screening & Diagnostic Units",
      organization: "Ranchi University / AIIMS Deoghar",
      district: "Khunti",
      currentPhase: "Testing",
      progress: 60,
      deadline: "2026-12-20",
      health: "At Risk",
      lastUpdate: "2026-08-30",
      department: "Health, Medical Education & Family Welfare",
      milestones: [
        { name: "Mobile Diagnostic Van Custom Fabrication", status: "Completed" },
        { name: "Edge AI Fundus Image Model Calibration", status: "Completed" },
        { name: "Rural Tribal Block Connectivity Trials", status: "In Progress" },
        { name: "Paramedic & Clinic Staff Onboarding", status: "Pending" },
      ],
      recentUpdate:
        "Satellite connectivity in Torpa block experiencing intermittent latency. Testing offline edge-AI inference mode.",
    },
    {
      id: "TRK-1004",
      challengeId: "CH-7860",
      challenge: "Solar-Powered Groundwater Arsenic Filtration",
      name: "Solar HydroPurify Micro-Filtration Units",
      organization: "NIT Jamshedpur Water Tech Group",
      district: "East Singhbhum",
      currentPhase: "Deployment",
      progress: 90,
      deadline: "2026-10-30",
      health: "Healthy",
      lastUpdate: "2026-09-05",
      department: "Drinking Water & Sanitation Department",
      milestones: [
        { name: "Hydro-geological Arsenic Mapping", status: "Completed" },
        { name: "Solar Membrane Prototype Benchmarking", status: "Completed" },
        { name: "Pilot Village Installation (5 Units)", status: "Completed" },
        { name: "Remote IoT Quality Telemetry Dashboard", status: "In Progress" },
      ],
      recentUpdate:
        "Successfully commissioned 8 solar filtration hubs across Patamda block, supplying certified potable water.",
    },
  ],

  partners: [
    {
      id: "PRT-501",
      name: "BIT Mesra (Birla Institute of Technology)",
      type: "Universities",
      location: "Ranchi, Jharkhand",
      contactPerson: "Dr. Sandeep Kumar (Dean of Research)",
      email: "dean.research@bitmesra.ac.in",
      activeProjects: 4,
      verificationStatus: "Verified",
      lastUpdated: "2026-09-02",
      accreditation: "NAAC A+ / AICTE Approved",
      role: "State Nodal HEI Partner",
      description: "Premier technical institute collaborating on blockchain land registration, solar micro-filtration, and smart city governance.",
      gstin: "20AAAAA0000A1Z5",
      pan: "AAATB1234K",
      website: "https://www.bitmesra.ac.in",
    },
    {
      id: "PRT-502",
      name: "Tata Steel CSR & Urban Innovations",
      type: "Industries",
      location: "Jamshedpur, East Singhbhum",
      contactPerson: "Sourav Roy (Chief CSR & Social Impact)",
      email: "csr.jharkhand@tatasteel.com",
      activeProjects: 6,
      verificationStatus: "Verified",
      lastUpdated: "2026-08-20",
      accreditation: "ISO 9001:2015 / Section 135 CSR",
      role: "Anchor Industry & CSR Partner",
      description: "Major corporate stakeholder supporting youth skill development, tribal health tech vans, and sustainable watershed management.",
      gstin: "20AAACT2727Q1ZW",
      pan: "AAACT2727Q",
      website: "https://www.tatasteel.com/csr",
    },
    {
      id: "PRT-503",
      name: "IIT (ISM) Dhanbad Innovation Hub",
      type: "Universities",
      location: "Dhanbad, Jharkhand",
      contactPerson: "Prof. Rajiv Shekhar (Dean R&D)",
      email: "dean_rnd@iitism.ac.in",
      activeProjects: 5,
      verificationStatus: "Verified",
      lastUpdated: "2026-09-01",
      accreditation: "Institute of National Importance (INI)",
      role: "Central Technical Partner",
      description: "Leading research institution specializing in automated municipal waste segregation, deep mine telemetry, and clean energy.",
      gstin: "20AAAAI0000B1Z2",
      pan: "AAATI9988C",
      website: "https://www.iitism.ac.in",
    },
    {
      id: "PRT-504",
      name: "Jharkhand Tribal CleanWater Mission",
      type: "NGOs",
      location: "Khunti, Jharkhand",
      contactPerson: "Rajeshwar Munda (Executive Director)",
      email: "contact@tribalcleanwater.org",
      activeProjects: 2,
      verificationStatus: "Pending Verification",
      lastUpdated: "2026-08-29",
      accreditation: "12A / 80G Registered NGO",
      role: "Grassroots Implementation Partner",
      description: "Civil society foundation executing groundwater arsenic filtration and maternal healthcare clinics in remote rural blocks.",
      gstin: "20AAATJ4455P1ZK",
      pan: "AAATJ4455P",
      website: "https://www.tribalcleanwater.org",
    },
    {
      id: "PRT-505",
      name: "GeoSensors InfraTech AgriTech Pvt Ltd",
      type: "Startups",
      location: "Ranchi, Jharkhand",
      contactPerson: "Ananya Roy (Co-Founder & CTO)",
      email: "ananya@geosensors.in",
      activeProjects: 1,
      verificationStatus: "Pending Verification",
      lastUpdated: "2026-08-31",
      accreditation: "Startup Jharkhand / DPIIT Recognized",
      role: "AgriTech & Sensor Startup",
      description: "Jharkhand-incubated technology startup manufacturing solar IoT soil moisture and water table monitoring devices.",
      gstin: "20AAACG6789R1ZT",
      pan: "AAACG6789R",
      website: "https://www.geosensors.in",
    },
    {
      id: "PRT-506",
      name: "Bokaro Steel Plant (SAIL) CSR Wing",
      type: "Industries",
      location: "Bokaro, Jharkhand",
      contactPerson: "Alok Kumar (GM CSR)",
      email: "csr.bsl@sail.in",
      activeProjects: 3,
      verificationStatus: "Verified",
      lastUpdated: "2026-09-03",
      accreditation: "Maharatna PSU CSR",
      role: "PSU Industrial Partner",
      description: "Public sector enterprise sponsoring public school digital labs and municipal waste-to-energy pilot projects.",
      gstin: "20AAACS1234K1ZV",
      pan: "AAACS1234K",
      website: "https://www.sail.co.in",
    },
    {
      id: "PRT-507",
      name: "NIT Jamshedpur Innovation Centre",
      type: "Universities",
      location: "Jamshedpur, East Singhbhum",
      contactPerson: "Dr. K. K. Shukla (Director)",
      email: "director@nitjsr.ac.in",
      activeProjects: 4,
      verificationStatus: "Verified",
      lastUpdated: "2026-09-05",
      accreditation: "NIRF Top Ranked Engineering Institute",
      role: "Regional HEI Partner",
      description: "Center of excellence executing solar water purification pipelines and EV rural logistics testbeds.",
      gstin: "20AAAAN4321F1ZX",
      pan: "AAAAN4321F",
      website: "https://www.nitjsr.ac.in",
    },
  ],

  notifications: [
    {
      id: "NT-1",
      title: "New Challenge Submitted",
      message:
        "Dept. of Urban Transportation submitted 'AI-Powered Traffic Signal Synchronization'.",
      timestamp: "10 minutes ago",
      read: false,
      type: "scrutiny",
    },
    {
      id: "NT-2",
      title: "Proposal Received",
      message:
        "SunGrid Innovations submitted a proposal for Solar-Microgrid Deployment.",
      timestamp: "1 hour ago",
      read: false,
      type: "proposal",
    },
    {
      id: "NT-3",
      title: "Partner Verification Request",
      message:
        "GeoSensors InfraTech requested document verification.",
      timestamp: "3 hours ago",
      read: false,
      type: "partner",
    },
    {
      id: "NT-4",
      title: "Project Health Alert",
      message:
        "Tele-Ophthalmology Mobile Clinics (TRK-1003) flagged as 'At Risk'.",
      timestamp: "1 day ago",
      read: true,
      type: "alert",
    },
  ],

  settings: {
    accountName: "Government Administrator",
    department: "National Urban & Social Innovation Secretariat",
    email: "admin.portal@gov.in",
    phone: "+91 11 2309 4000",
    emailNotifications: true,
    smsAlerts: false,
    weeklyReportDigest: true,
    urgentActionAlerts: true,
    themeMode: "light",
    compactTables: false,
    autoRefreshInterval: "5",
    twoFactorAuth: true,
    sessionTimeout: "30",
  },
};

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        const sanitizeChallenge = (c) => {
          let loc = c.location || "Ranchi, Jharkhand";
          let dist = c.district || "Ranchi";
          let cat = c.category || "Rural Infrastructure";

          if (loc.toLowerCase().includes("bengaluru") || loc.toLowerCase().includes("karnataka")) {
            loc = "Main Road, Ranchi, Jharkhand";
            dist = "Ranchi";
          }
          if (loc.toLowerCase().includes("varanasi") || loc.toLowerCase().includes("uttar pradesh")) {
            loc = "Subarnarekha Basin, East Singhbhum, Jharkhand";
            dist = "East Singhbhum";
          }
          if (cat === "Smart Mobility") cat = "Rural Infrastructure";
          if (cat === "Environmental") cat = "Water Management";

          return {
            ...c,
            location: loc,
            district: dist,
            category: cat,
            backendCategory: cat,
          };
        };

        const cleanedChallenges = (parsed.challenges || initialMockData.challenges).map(sanitizeChallenge);

        return {
          ...initialMockData,
          ...parsed,
          challenges: cleanedChallenges,
          proposals: parsed.proposals || initialMockData.proposals,
          trackingProjects:
            parsed.trackingProjects || initialMockData.trackingProjects,
          partners: parsed.partners || initialMockData.partners,
          notifications:
            parsed.notifications || initialMockData.notifications,
          settings: {
            ...initialMockData.settings,
            ...(parsed.settings || {}),
          },
        };
      }
    } catch (e) {
      console.error("Failed to load admin data from localStorage:", e);
    }

    return initialMockData;
  });

  const [toasts, setToasts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const toastIdRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save admin data from localStorage:", e);
    }
  }, [data]);

  const showToast = (message, type = "success") => {
    toastIdRef.current += 1;

    const id = `admin-toast-${toastIdRef.current}`;

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loginGovtAdmin = () => {
    setIsAuthenticated(true);
    showToast("Government Admin authentication successful!", "success");
  };

  const logoutGovtAdmin = () => {
    setIsAuthenticated(false);
    showToast("Logged out of Government Portal.", "info");
  };

  const approveChallenge = (id) => {
    setData((prev) => ({
      ...prev,
      challenges: prev.challenges.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "OPEN",
              progress: 0,
              participants: 0,
              teams: 0,
              proposalsCount: 0,
              deadline: null,
            }
          : c
      ),
    }));

    showToast(
      `Challenge ${id} approved and promoted to the Challenge Pool.`,
      "success"
    );
  };

  const rejectChallenge = (id, reason = "Criteria not met") => {
    setData((prev) => ({
      ...prev,
      challenges: prev.challenges.map((c) =>
        c.id === id
          ? { ...c, status: "Rejected", rejectReason: reason }
          : c
      ),
    }));

    showToast(`Challenge ${id} has been rejected.`, "error");
  };

  const requestChallengeInfo = (id, notes) => {
    setData((prev) => ({
      ...prev,
      challenges: prev.challenges.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "UNDER_REVIEW",
              infoRequested: true,
              infoNotes: notes,
            }
          : c
      ),
    }));

    showToast(
      `Information request dispatched for Challenge ${id}.`,
      "info"
    );
  };

  const approveProposal = (id) => {
    setData((prev) => ({
      ...prev,
      proposals: prev.proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "APPROVED",
              updated_at: new Date().toISOString(),
            }
          : p
      ),
    }));

    showToast(`Solution ${id} approved successfully!`, "success");
  };

  const rejectProposal = (id) => {
    setData((prev) => ({
      ...prev,
      proposals: prev.proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "Rejected",
              updated_at: new Date().toISOString(),
            }
          : p
      ),
    }));

    showToast(`Solution ${id} marked as rejected.`, "error");
  };

  const requestProposalRevision = (id) => {
    setData((prev) => ({
      ...prev,
      proposals: prev.proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "UNDER_REVIEW",
              revisionRequested: true,
              updated_at: new Date().toISOString(),
            }
          : p
      ),
    }));

    showToast(`Revision request dispatched for Solution ${id}.`, "info");
  };

  const assignProposalToTracking = (proposalId, details = {}) => {
    setData((prev) => {
      const proposal = prev.proposals.find((p) => p.id === proposalId);

      if (!proposal) return prev;

      const newProjectId = `TRK-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const newProject = {
        id: newProjectId,
        solutionId: proposal.id,
        challengeId: proposal.challengeId || "CH-GEN",
        challenge:
          proposal.challengeTitle ||
          proposal.organization ||
          "Solution Project",
        organization:
          proposal.university_name ||
          proposal.organization ||
          "Solution Team",
        university_name: proposal.university_name || "",
        team_name: proposal.team_name || "",
        faculty_mentor: proposal.faculty_mentor || "",
        student_leader: proposal.student_leader || "",
        currentPhase: "Research",
        progress: 15,
        deadline: details.deadline || "2027-01-30",
        health: "On Track",
        lastUpdate: new Date().toISOString().split("T")[0],
        department: details.department || proposal.department || "Innovation Board",
        milestones:
          proposal.milestones?.length > 0
            ? proposal.milestones
            : [
                { name: "Project Kickoff & Charter", status: "Completed" },
                { name: "Detailed Technical Design", status: "In Progress" },
                { name: "Prototype Testing", status: "Pending" },
                { name: "Field Deployment", status: "Pending" },
              ],
        recentUpdate: `Assigned project from Solution ${proposalId}. Initial setup initialized.`,
        csr_partner: proposal.csr_partner || null,
        csr_grant_amount: proposal.csr_grant_amount || 0,
      };

      return {
        ...prev,
        proposals: prev.proposals.map((p) =>
          p.id === proposalId
            ? {
                ...p,
                status: "IN_PROGRESS",
                assignedProjectId: newProjectId,
                updated_at: new Date().toISOString(),
              }
            : p
        ),
        trackingProjects: [newProject, ...prev.trackingProjects],
      };
    });

    showToast(
      `Project created and assigned to Live Tracking!`,
      "success"
    );
  };

  const verifyPartner = (id) => {
    setData((prev) => ({
      ...prev,
      partners: prev.partners.map((p) =>
        p.id === id
          ? {
              ...p,
              verificationStatus: "Verified",
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : p
      ),
    }));

    showToast(`Partner ${id} verified successfully!`, "success");
  };

  const rejectPartner = (id) => {
    setData((prev) => ({
      ...prev,
      partners: prev.partners.map((p) =>
        p.id === id
          ? {
              ...p,
              verificationStatus: "Rejected",
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : p
      ),
    }));

    showToast(`Partner ${id} verification rejected.`, "error");
  };

  const requestPartnerDocs = (id) => {
    showToast(`Document request sent to Partner ${id}.`, "info");
  };

  const markNotificationRead = (id) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  };

  const markAllNotificationsRead = () => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({
        ...n,
        read: true,
      })),
    }));

    showToast("All notifications marked as read.", "info");
  };

  const updateTrackingProject = (id, updates) => {
    setData((prev) => ({
      ...prev,
      trackingProjects: (prev.trackingProjects || []).map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              lastUpdate: new Date().toISOString().split("T")[0],
            }
          : p
      ),
    }));

    showToast("Project tracking status updated successfully!", "success");
  };

  const updateSettings = (newSettings) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }));

    showToast("Settings saved successfully!", "success");
  };

  const resetToDefaults = () => {
    setData(initialMockData);
    localStorage.removeItem(STORAGE_KEY);

    showToast("Dashboard reset to initial mock data.", "info");
  };

  const stats = {
    totalChallenges: data.challenges.length,

    pendingScrutiny: data.challenges.filter(
      (c) => c.status === "UNDER_REVIEW"
    ).length,

    activeChallenges: data.challenges.filter(
      (c) =>
        c.status === "ASSIGNED_TO_HEI" ||
        c.status === "IN_PROGRESS"
    ).length,

    completedChallenges: data.challenges.filter(
      (c) => c.status === "RESOLVED"
    ).length,

    pendingProposals: data.proposals.filter(
      (p) =>
        p.status === "PROPOSED" ||
        p.status === "UNDER_REVIEW"
    ).length,

    verifiedPartners: data.partners.filter(
      (p) => p.verificationStatus === "Verified"
    ).length,
  };

  return (
    <AdminContext.Provider
      value={{
        data,
        stats,
        toasts,
        isAuthenticated,

        loginGovtAdmin,
        logoutGovtAdmin,

        showToast,
        removeToast,

        approveChallenge,
        rejectChallenge,
        requestChallengeInfo,

        approveProposal,
        rejectProposal,
        requestProposalRevision,
        assignProposalToTracking,
        updateTrackingProject,

        verifyPartner,
        rejectPartner,
        requestPartnerDocs,

        markNotificationRead,
        markAllNotificationsRead,

        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return context;
};