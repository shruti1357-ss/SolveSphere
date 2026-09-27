import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowUpRight, BarChart3, BellRing, Building2,
  CheckCircle2, Clock3, Factory, FileCheck2, FileText, GraduationCap, Landmark, MapPin,
  Radio, ShieldCheck, Sparkles, Target, UsersRound, WalletCards, TrendingUp, Search,
  Siren, CircleCheck, CircleDot, ChevronRight, X, Phone, Mail, Filter, Check, Send,
  SlidersHorizontal, RefreshCw, FolderGit2, Plus, ExternalLink, Calendar, Award,
  ArrowRight, Layers, Briefcase, UserCheck, Wrench, Shield, CheckSquare, Coins, IndianRupee
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";

const UNIVERSITY_PROJECTS_STORAGE_KEY = "solvesphere_university_projects_v1";

// Default Live University Projects Database for Jharkhand Institutions
const defaultUniversityProjects = {
  "NIT Jamshedpur": [
    {
      id: "PRJ-NIT-01",
      title: "Automated Sensor Grid for Heavy Metal Detection in Subarnarekha Basin",
      category: "Water & Environment",
      lead: "Dr. A.K. Roy (Dept of Civil & Env Eng)",
      studentLead: "Saurav Mishra (M.Tech)",
      status: "Field Testing",
      progress: 88,
      budget: "₹4.8 Lakhs",
      partner: "Tata Steel CSR Grant",
      targetDate: "Nov 2026",
      district: "East Singhbhum & Khunti",
      description: "Deploying self-cleaning electrochemical sensor buoys along industrial discharge channels to detect lead, iron, and arsenic with automated IoT telemetry alerts."
    },
    {
      id: "PRJ-NIT-02",
      title: "Smart IoT Water Distribution Flow Balancing for Rural Torpa",
      category: "Drinking Water & Sanitation",
      lead: "Prof. S. Soren (Dept of Mechanical Eng)",
      studentLead: "Priya Soren (B.Tech)",
      status: "In Progress",
      progress: 72,
      budget: "₹3.5 Lakhs",
      partner: "Jal Shakti Innovation Fund",
      targetDate: "Dec 2026",
      district: "Khunti",
      description: "Low-cost pressure sensor arrays installed across rural pipeline junctions to identify burst pipes and unequal distribution in off-grid tribal villages."
    },
    {
      id: "PRJ-NIT-03",
      title: "Solar-Powered Water De-fluoridation & Desalination Kiosk",
      category: "Clean Tech & Water",
      lead: "Dr. Manish Kumar (Chemical Eng)",
      studentLead: "Rahul Verma",
      status: "Pilot Deployed",
      progress: 94,
      budget: "₹5.2 Lakhs",
      partner: "State Rural Livelihood Mission",
      targetDate: "Oct 2026",
      district: "Ranchi & Khunti",
      description: "Community reverse osmosis and activated alumina de-fluoridation kiosk operating entirely on rooftop solar with smart RFID card water dispensing."
    },
    {
      id: "PRJ-NIT-04",
      title: "Geospatial Road Deterioration Prediction & Pothole AI Mapping",
      category: "Roads & Infrastructure",
      lead: "Dr. R.K. Prasad (Transportation)",
      studentLead: "Anjali Tirkey",
      status: "In Progress",
      progress: 60,
      budget: "₹2.9 Lakhs",
      partner: "Jharkhand PWD Task Force",
      targetDate: "Jan 2027",
      district: "Khunti & Saraikela",
      description: "Smartphone dashcam computer vision model mounted on state buses to survey asphalt cracks, culvert depressions, and potholes across state highways."
    },
    {
      id: "PRJ-NIT-05",
      title: "Low-Cost Turbidity & pH IoT Monitor for Village Wells",
      category: "Water & Sanitation",
      lead: "Dr. Bina Kumari (Chemistry)",
      studentLead: "Vikas Gope",
      status: "Field Testing",
      progress: 82,
      budget: "₹1.8 Lakhs",
      partner: "UNICEF Water Mission",
      targetDate: "Nov 2026",
      district: "Khunti",
      description: "Submersible telemetry probes monitoring open drinking wells for post-rain siltation and biological pathogen risk."
    },
    {
      id: "PRJ-NIT-06",
      title: "Automated Structural Health Monitoring of Rural Culverts",
      category: "Public Works & Roads",
      lead: "Prof. N.K. Singh (Structural Eng)",
      studentLead: "Kunal Sahu",
      status: "In Progress",
      progress: 54,
      budget: "₹3.1 Lakhs",
      partner: "Rural Development Dept",
      targetDate: "Feb 2027",
      district: "West Singhbhum",
      description: "Vibration and tilt sensors installed on aged stone masonry culverts to detect flash flood scouring and bridge subsidence."
    },
    {
      id: "PRJ-NIT-07",
      title: "Smart Solid Waste Segregator using Edge AI Cameras",
      category: "Sanitation & Waste",
      lead: "Dr. Arvind Kumar (Electronics)",
      studentLead: "Deepak Hansda",
      status: "In Progress",
      progress: 65,
      budget: "₹4.0 Lakhs",
      partner: "Swachh Bharat Innovation Cell",
      targetDate: "Dec 2026",
      district: "East Singhbhum",
      description: "Automated dual-bin feeder utilizing infrared and vision models to separate dry recyclables from wet organic municipal waste."
    },
    {
      id: "PRJ-NIT-08",
      title: "Biogas Power Microgrid for Tribal Dairy Cooperatives",
      category: "Clean Energy",
      lead: "Dr. S.K. Jha (Electrical Eng)",
      studentLead: "Sunita Munda",
      status: "In Progress",
      progress: 48,
      budget: "₹2.7 Lakhs",
      partner: "NABARD Innovation Fund",
      targetDate: "Mar 2027",
      district: "Khunti",
      description: "Community anaerobic digester generating methane power for milk chilling storage units in remote tribal panchayats."
    },
    {
      id: "PRJ-NIT-09",
      title: "Rainwater Harvesting & Ground Recharge Automation",
      category: "Water Resources",
      lead: "Dr. Tanmay Roy (Civil Eng)",
      studentLead: "Rohit Lakra",
      status: "Pilot Deployed",
      progress: 91,
      budget: "₹3.8 Lakhs",
      partner: "Central Ground Water Board",
      targetDate: "Oct 2026",
      district: "East Singhbhum",
      description: "Automated filtration and deep shaft recharge units at 15 government school campuses in Khunti and Jamshedpur."
    },
    {
      id: "PRJ-NIT-10",
      title: "Mobile Tele-Diagnostic Van Telemetry for Remote Blocks",
      category: "Health & MedTech",
      lead: "Prof. P.K. Dutta (Biomedical)",
      studentLead: "Dr. Pooja Minz",
      status: "Field Testing",
      progress: 78,
      budget: "₹4.4 Lakhs",
      partner: "National Health Mission",
      targetDate: "Nov 2026",
      district: "Khunti & Gumla",
      description: "Solar mobile clinic van fitted with digital ECG, retinal scanners, and point-of-care blood analyzers linked to district hospitals via satellite."
    },
    {
      id: "PRJ-NIT-11",
      title: "AI-Assisted Soil Nutrient & Moisture Telemetry Sensor",
      category: "Smart Agriculture",
      lead: "Dr. S. Mohapatra (Electronics)",
      studentLead: "Amit Bedia",
      status: "In Progress",
      progress: 70,
      budget: "₹2.2 Lakhs",
      partner: "Krishi Vigyan Kendra",
      targetDate: "Dec 2026",
      district: "Khunti",
      description: "Wireless sensor probes measuring soil NPK levels, moisture, and pH with SMS advisories in regional languages for small farmers."
    },
    {
      id: "PRJ-NIT-12",
      title: "Low-Power LoRa Mesh Network for Flash Flood Early Warning",
      category: "Disaster Management",
      lead: "Prof. S.K. Mahato (Computer Science)",
      studentLead: "Gaurav Pathak",
      status: "Field Testing",
      progress: 85,
      budget: "₹3.6 Lakhs",
      partner: "Disaster Management Authority",
      targetDate: "Nov 2026",
      district: "East Singhbhum & Khunti",
      description: "Solar ultrasonic water gauge network along river crossings transmitting water rise rate warnings without cellular dependency."
    }
  ],
  "BIT Mesra": [
    {
      id: "PRJ-BIT-01",
      title: "AI Computer Vision for Traffic Signal Flow Optimization",
      category: "Urban Transportation",
      lead: "Dr. Rajiv Mehta (Center for AI)",
      studentLead: "Aarav Sharma (B.Tech)",
      status: "Pilot Deployed",
      progress: 92,
      budget: "₹4.5 Lakhs",
      partner: "Ranchi Smart City Corporation",
      targetDate: "Oct 2026",
      district: "Ranchi",
      description: "Edge camera analytics dynamically adjusting traffic green time based on real-time vehicle queue counts at 12 key intersections."
    },
    {
      id: "PRJ-BIT-02",
      title: "Satellite & Drone Geospatial Tracking for Forest Fire Alerts",
      category: "Forest & Environment",
      lead: "Dr. Sudip Ghosh (Remote Sensing)",
      studentLead: "Kavita Ekka",
      status: "Field Testing",
      progress: 75,
      budget: "₹3.8 Lakhs",
      partner: "Jharkhand Forest Dept",
      targetDate: "Nov 2026",
      district: "Khunti & Ranchi",
      description: "Thermal satellite telemetry paired with automated drone dispatch to detect early canopy dry zones and forest border fires."
    },
    {
      id: "PRJ-BIT-03",
      title: "Smart Public School Midday Meal & Attendance Biometric System",
      category: "Smart Education",
      lead: "Prof. Neha Kapoor (CSE)",
      studentLead: "Rohan Verma",
      status: "Field Testing",
      progress: 86,
      budget: "₹3.2 Lakhs",
      partner: "School Education Dept",
      targetDate: "Dec 2026",
      district: "Ranchi & Khunti",
      description: "Offline-first tablet app utilizing on-device facial verification and ration supply ledger tracking to ensure 100% midday meal delivery."
    },
    {
      id: "PRJ-BIT-04",
      title: "Telemedicine Diagnostic Kiosk for Primary Health Centres",
      category: "Healthcare & AI",
      lead: "Dr. Priya Singh (ECE)",
      studentLead: "Aditya Kumar",
      status: "In Progress",
      progress: 64,
      budget: "₹2.6 Lakhs",
      partner: "NHM Jharkhand",
      targetDate: "Jan 2027",
      district: "Khunti",
      description: "Touchscreen health booth with automated vitals monitoring, prescription printer, and video link to medical college doctors."
    },
    {
      id: "PRJ-BIT-05",
      title: "Blockchain Land Registry Record Verification Node",
      category: "Governance & Security",
      lead: "Dr. Sandeep Paul (CSE)",
      studentLead: "Manish Tirkey",
      status: "Field Testing",
      progress: 80,
      budget: "₹4.0 Lakhs",
      partner: "Revenue & Land Registration",
      targetDate: "Nov 2026",
      district: "Ranchi",
      description: "Tamper-proof digital title registry eliminating property fraud and streamlining urban-rural land deed audits."
    },
    {
      id: "PRJ-BIT-06",
      title: "Smart Solar Street Lighting with Fault Auto-Detection",
      category: "Clean Energy",
      lead: "Prof. R.K. Sinha (Electrical)",
      studentLead: "Alok Topno",
      status: "In Progress",
      progress: 70,
      budget: "₹2.4 Lakhs",
      partner: "Jharkhand Renewable Energy (JREDA)",
      targetDate: "Dec 2026",
      district: "Khunti & Ranchi",
      description: "Centralized mesh controllers for street lights that dim during low-activity hours and dispatch automated fault tickets to repair linemen."
    },
    {
      id: "PRJ-BIT-07",
      title: "Automated Air Particulate Sensor Grid for Mining Belts",
      category: "Environment & Pollution",
      lead: "Dr. Archana Kumari (Env Science)",
      studentLead: "Siddharth Sahu",
      status: "In Progress",
      progress: 58,
      budget: "₹3.0 Lakhs",
      partner: "JSPCB Ranchi",
      targetDate: "Feb 2027",
      district: "Ramgarh & Ranchi",
      description: "Solar PM2.5 and PM10 optical counters installed along heavy transit mining corridors with open citizen dashboard display."
    },
    {
      id: "PRJ-BIT-08",
      title: "Citizen Grievance NLP Categorization & Auto-Routing Model",
      category: "AI & Public Administration",
      lead: "Dr. K.S. Rao (Center for AI)",
      studentLead: "Ananya Roy",
      status: "Field Testing",
      progress: 88,
      budget: "₹2.2 Lakhs",
      partner: "District Administration",
      targetDate: "Oct 2026",
      district: "Khunti & Ranchi",
      description: "Multilingual AI NLP classifier translating citizen grievance audio/text in Hindi, Nagpuri, and Ho into structured line department dispatch orders."
    }
  ],
  "IIT (ISM) Dhanbad": [
    {
      id: "PRJ-ISM-01",
      title: "Subsurface Underground Coal Fire Gas & Thermal Telemetry Sensors",
      category: "Mining & Safety",
      lead: "Prof. V.K. Bansal (Mining Eng)",
      studentLead: "Prashant Kumar",
      status: "Pilot Deployed",
      progress: 90,
      budget: "₹6.5 Lakhs",
      partner: "BCCL & Coal India CSR",
      targetDate: "Oct 2026",
      district: "Dhanbad",
      description: "Fiber-optic temperature probes and toxic gas sensors deployed across Jharia coalfield fissures providing early hazard evacuation warnings."
    },
    {
      id: "PRJ-ISM-02",
      title: "Acid Mine Drainage Neutralization & Potable Water Recovery",
      category: "Water Resources",
      lead: "Dr. B.K. Soren (Env Eng)",
      studentLead: "Ramesh Mahto",
      status: "Field Testing",
      progress: 82,
      budget: "₹5.0 Lakhs",
      partner: "State Pollution Board",
      targetDate: "Nov 2026",
      district: "Dhanbad & Bokaro",
      description: "Chemical neutralization and bio-filter plant purifying acidic mine discharge water for agricultural and household reuse in surrounding villages."
    },
    {
      id: "PRJ-ISM-03",
      title: "Groundwater Aquifer Depletion 3D Hydrological Modeling",
      category: "Water Resources",
      lead: "Dr. S.K. Paul (Earth Sciences)",
      studentLead: "Neha Mundu",
      status: "In Progress",
      progress: 68,
      budget: "₹3.8 Lakhs",
      partner: "Central Ground Water Authority",
      targetDate: "Jan 2027",
      district: "Dhanbad & Giridih",
      description: "3D seismic and resistivity mapping locating deep unconfined aquifers for drought-proof rural tubewell drilling."
    },
    {
      id: "PRJ-ISM-04",
      title: "Dust Suppression Smart Mist Sprinklers with IoT Trigger",
      category: "Clean Tech & Environment",
      lead: "Prof. M.K. Verma (Mechanical)",
      studentLead: "Abhishek Singh",
      status: "In Progress",
      progress: 74,
      budget: "₹4.2 Lakhs",
      partner: "CCL Environmental Wing",
      targetDate: "Dec 2026",
      district: "Dhanbad",
      description: "Laser dust counters that automatically trigger high-pressure micro-mist water nozzles when particulate matter exceeds safety limits."
    },
    {
      id: "PRJ-ISM-05",
      title: "Heavy Haulage Dumper Driver Fatigue Detection AI Camera",
      category: "Industrial Safety",
      lead: "Dr. Anita Sharma (Computer Science)",
      studentLead: "Vipul Topno",
      status: "In Progress",
      progress: 62,
      budget: "₹2.8 Lakhs",
      partner: "Directorate General of Mines Safety",
      targetDate: "Feb 2027",
      district: "Dhanbad & West Singhbhum",
      description: "Cabin camera monitoring eye-blink duration and yawn frequency with acoustic seat vibration alerts for heavy dumper operators."
    },
    {
      id: "PRJ-ISM-06",
      title: "Industrial Fly Ash & Slag Utilization in High-Strength Rural Pavements",
      category: "Infrastructure & Civil",
      lead: "Dr. P.K. Mishra (Civil Eng)",
      studentLead: "Dharmendra Gope",
      status: "In Progress",
      progress: 50,
      budget: "₹3.4 Lakhs",
      partner: "Jharkhand Rural Roads Authority",
      targetDate: "Mar 2027",
      district: "Dhanbad & Bokaro",
      description: "Geopolymer concrete pavement mix incorporating 60% steel slag and fly ash for climate-resilient village roads."
    }
  ],
  "Central University of Jharkhand": [
    {
      id: "PRJ-CUJ-01",
      title: "Tribal Indigenous Nutrition & Traditional Herbal Medicine Value Chain",
      category: "Public Health & Nutrition",
      lead: "Dr. Nirmal Kerketta (Tribal Studies)",
      studentLead: "Shanti Minz",
      status: "Field Testing",
      progress: 85,
      budget: "₹3.2 Lakhs",
      partner: "Tribal Welfare Dept",
      targetDate: "Nov 2026",
      district: "Khunti & Ranchi",
      description: "Standardizing forest superfoods (moringa, millets, mahua) for Anganwadi supplementary nutrition programs across tribal blocks."
    },
    {
      id: "PRJ-CUJ-02",
      title: "Rural Drinking Water Heavy Metal Bio-Remediation Field Unit",
      category: "Water & Sanitation",
      lead: "Dr. B.R. Champatiray (Env Science)",
      studentLead: "Kishore Munda",
      status: "In Progress",
      progress: 78,
      budget: "₹2.5 Lakhs",
      partner: "Jal Jeevan Mission",
      targetDate: "Dec 2026",
      district: "Khunti",
      description: "Plant-based phytoremediation filtration beds removing iron and heavy metal ions from rural pond runoff."
    },
    {
      id: "PRJ-CUJ-03",
      title: "Solar Agro-Processing Cold Storage for Small Vegetable Growers",
      category: "Rural Economy & Energy",
      lead: "Dr. Sudhir Kumar (Energy Eng)",
      studentLead: "Pooja Bedia",
      status: "In Progress",
      progress: 66,
      budget: "₹3.6 Lakhs",
      partner: "Agriculture Dept Jharkhand",
      targetDate: "Jan 2027",
      district: "Khunti & Gumla",
      description: "5-ton portable thermal storage cold rooms preventing post-harvest spoilage of organic green chillies and tomatoes in Torpa block."
    },
    {
      id: "PRJ-CUJ-04",
      title: "Multilingual Dialect Speech Translation for Citizen Grievance Portal",
      category: "Language Tech & Governance",
      lead: "Dr. S. Hansda (Humanities & AI)",
      studentLead: "Ramesh Tirkey",
      status: "In Progress",
      progress: 72,
      budget: "₹2.0 Lakhs",
      partner: "State IT Dept",
      targetDate: "Feb 2027",
      district: "State-wide",
      description: "Voice-to-text acoustic models for Santhali, Mundari, Ho, Kurukh, and Nagpuri enabling non-literate citizens to file audio reports."
    },
    {
      id: "PRJ-CUJ-05",
      title: "Groundwater Arsenic & Nitrate Mapping in Tributary Basins",
      category: "Environment & Water",
      lead: "Dr. A.K. Srivastav (Water Resources)",
      studentLead: "Manju Kumari",
      status: "In Progress",
      progress: 60,
      budget: "₹2.4 Lakhs",
      partner: "Water Resources Dept",
      targetDate: "Mar 2027",
      district: "Khunti & Ranchi",
      description: "GIS geo-referenced water table testing dataset identifying safe deep drilling zones for rural water tankers."
    }
  ],
  "Xavier Institute of Social Service (XISS)": [
    {
      id: "PRJ-XIS-01",
      title: "Digital Social Audit & DBT Entitlement Delivery Verification System",
      category: "Social Welfare & Governance",
      lead: "Dr. Joseph Marianus Kujur (Director)",
      studentLead: "Sneha Tigga",
      status: "Pilot Deployed",
      progress: 95,
      budget: "₹3.5 Lakhs",
      partner: "Rural Development Dept",
      targetDate: "Oct 2026",
      district: "Khunti & Ranchi",
      description: "Independent grassroots audit framework tracking direct benefit transfer speed and pension disbursement across 48 Gram Panchayats."
    },
    {
      id: "PRJ-XIS-02",
      title: "Community Forest Rights (CFR) & Livelihood Value Chain Tracking",
      category: "Rural Management",
      lead: "Prof. Prakash Chandra Dash",
      studentLead: "Bikram Hansda",
      status: "Field Testing",
      progress: 80,
      budget: "₹2.8 Lakhs",
      partner: "Tribal Cooperative (TRIFED)",
      targetDate: "Nov 2026",
      district: "Khunti & Latehar",
      description: "Mobile app linking lac, honey, and sal seed tribal gatherers directly to wholesale fair-price markets without middleman leakage."
    },
    {
      id: "PRJ-XIS-03",
      title: "Gram Panchayat Development Plan (GPDP) Digital Scorecard",
      category: "Panchayati Raj",
      lead: "Dr. Anant Kumar (Rural Dev)",
      studentLead: "Deepa Soren",
      status: "In Progress",
      progress: 74,
      budget: "₹2.2 Lakhs",
      partner: "Panchayati Raj Dept",
      targetDate: "Dec 2026",
      district: "Khunti",
      description: "Participatory micro-planning dashboard tracking Gram Sabha budget prioritization and infrastructure execution milestones."
    },
    {
      id: "PRJ-XIS-04",
      title: "Women Self-Help Group (SHG) Micro-Enterprise Digital Ledger",
      category: "Financial Inclusion",
      lead: "Prof. S.R. Bilung (Social Work)",
      studentLead: "Meena Topno",
      status: "In Progress",
      progress: 88,
      budget: "₹2.9 Lakhs",
      partner: "Jharkhand State Livelihood Promotion Society",
      targetDate: "Jan 2027",
      district: "Khunti & Gumla",
      description: "Easy bookkeeping tablet app with audio prompts enabling 320 women SHGs to maintain transparent loan and sales accounting."
    }
  ]
};

// Line Departments Detailed Roster Data
const departmentsData = [
  {
    id: "DEP-DWSD",
    name: "Drinking Water & Sanitation Department",
    icon: DropletsIcon,
    lead: "Er. S. Soren",
    designation: "Superintending Engineer",
    phone: "+91 94311 20450",
    email: "dwsd.khunti@jharkhand.gov.in",
    openCases: 46,
    resolvedCases: 128,
    totalCases: 174,
    teams: 9,
    readiness: 92,
    slaCompliance: "94.6%",
    priorityStatus: "Critical Priority",
    avgSLA: "2.1 hrs",
    focusArea: "Piped water networks, tube wells, rural water quality testing & tankers",
    recentTasks: [
      { id: "REP-1023", title: "Torpa Pipeline burst & low pressure", status: "In Progress", block: "Torpa" },
      { id: "REP-1017", title: "Deep tube well arsenic testing", status: "Field Testing", block: "Arki" },
      { id: "REP-1012", title: "Overhead tank motor replacement", status: "Resolved", block: "Khunti Town" },
    ]
  },
  {
    id: "DEP-RDD",
    name: "Rural Development & Panchayati Raj",
    icon: Building2,
    lead: "B.K. Bhagat",
    designation: "District Development Commissioner",
    phone: "+91 94311 31820",
    email: "ddc.khunti@jharkhand.gov.in",
    openCases: 38,
    resolvedCases: 114,
    totalCases: 152,
    teams: 7,
    readiness: 84,
    slaCompliance: "88.2%",
    priorityStatus: "High Priority",
    avgSLA: "2.8 hrs",
    focusArea: "Gram Panchayat civic infrastructure, rural connectivity & MGNREGA assets",
    recentTasks: [
      { id: "REP-1021", title: "Primary School boundary wall masonry repair", status: "In Progress", block: "Murhu" },
      { id: "REP-1015", title: "Village concrete pathway drainage", status: "Resolved", block: "Torpa" },
    ]
  },
  {
    id: "DEP-PWD",
    name: "Public Works (Roads & Bridges)",
    icon: Wrench,
    lead: "Er. Amit Kumar",
    designation: "Executive Engineer (PWD)",
    phone: "+91 94311 45910",
    email: "ee.pwd.khunti@jharkhand.gov.in",
    openCases: 31,
    resolvedCases: 89,
    totalCases: 120,
    teams: 6,
    readiness: 79,
    slaCompliance: "82.5%",
    priorityStatus: "High Priority",
    avgSLA: "3.4 hrs",
    focusArea: "Major district roads, arterial culverts, bridge scouring & pothole patching",
    recentTasks: [
      { id: "REP-1022", title: "Culvert sinkhole & bypass road cratering", status: "In Progress", block: "Khunti Town" },
      { id: "REP-1015", title: "Bridge structural safety audit on river crossing", status: "Field Testing", block: "Khunti" },
    ]
  },
  {
    id: "DEP-HFW",
    name: "Health, Medical Education & Family Welfare",
    icon: HeartPulseIcon,
    lead: "Dr. N. Kerketta",
    designation: "Civil Surgeon & CMO",
    phone: "+91 94311 56230",
    email: "civil.surgeon.khunti@jharkhand.gov.in",
    openCases: 24,
    resolvedCases: 142,
    totalCases: 166,
    teams: 4,
    readiness: 88,
    slaCompliance: "96.1%",
    priorityStatus: "Moderate",
    avgSLA: "1.8 hrs",
    focusArea: "Primary Health Centres, cold-chain immunization, disease surveillance & ambulances",
    recentTasks: [
      { id: "REP-1018", title: "PHC solar inverter & vaccine freezer power backup", status: "In Progress", block: "Karra" },
      { id: "REP-1020", title: "Seasonal vector-borne disease fogging drive", status: "Resolved", block: "Rania" },
    ]
  },
  {
    id: "DEP-EDU",
    name: "School Education & Literacy",
    icon: GraduationCap,
    lead: "M. Tigga",
    designation: "District Education Officer",
    phone: "+91 94311 67840",
    email: "deo.khunti@jharkhand.gov.in",
    openCases: 28,
    resolvedCases: 96,
    totalCases: 124,
    teams: 5,
    readiness: 73,
    slaCompliance: "85.0%",
    priorityStatus: "Moderate",
    avgSLA: "3.1 hrs",
    focusArea: "Government school infrastructure, smart ICT labs, sanitation & midday meal compliance",
    recentTasks: [
      { id: "REP-1014", title: "High school digital lab power circuit wiring", status: "Resolved", block: "Torpa" },
      { id: "REP-1008", title: "KGBV girls hostel water filter maintenance", status: "In Progress", block: "Khunti Town" },
    ]
  },
  {
    id: "DEP-MUN",
    name: "Municipal & Urban Sanitation",
    icon: Building2,
    lead: "R.K. Prasad",
    designation: "Executive Officer, Municipal Council",
    phone: "+91 94311 78910",
    email: "eo.nagar.khunti@jharkhand.gov.in",
    openCases: 22,
    resolvedCases: 108,
    totalCases: 130,
    teams: 5,
    readiness: 86,
    slaCompliance: "91.2%",
    priorityStatus: "Active",
    avgSLA: "2.0 hrs",
    focusArea: "Door-to-door solid waste collection, drain desilting & street lighting",
    recentTasks: [
      { id: "REP-1020", title: "Illegal solid waste dumping along stream bank", status: "In Progress", block: "Rania" },
      { id: "REP-1018", title: "Commercial bazaar waste container clearance", status: "Resolved", block: "Khunti Town" },
    ]
  }
];

// CSR Industry Partners Database
const csrPartnersData = [
  {
    id: "CSR-TATA",
    name: "Tata Steel CSR",
    sector: "Clean Drinking Water & Sanitation",
    category: "Water & Sanitation",
    budget: "₹42.0 Lakh",
    disbursed: "₹32.0 Lakh",
    progress: 76,
    status: "Active",
    head: "Sourav Roy (Chief CSR)",
    contact: "csr@tatasteel.com",
    phone: "+91 657 664 4550",
    location: "Jamshedpur & Khunti",
    initiativesCount: 15,
    villagesReached: "28 Villages",
    description: "Funding deep community RO water filtration kiosks and gravity-fed water pipelines across Torpa and Khunti blocks.",
    fundedProjects: [
      { id: "CSR-P-01", title: "Solar Drinking Water Kiosks (15 Units)", status: "Completed", grant: "₹18.5 Lakh" },
      { id: "CSR-P-02", title: "High School Sanitation & Handwash Complexes", status: "In Progress", grant: "₹14.0 Lakh" },
      { id: "CSR-P-03", title: "Groundwater Recharge Borewell Pits", status: "In Progress", grant: "₹9.5 Lakh" },
    ]
  },
  {
    id: "CSR-CCL",
    name: "Central Coalfields Limited (CCL CSR)",
    sector: "Solar Micro-Grids & Rural Power",
    category: "Clean Energy",
    budget: "₹35.0 Lakh",
    disbursed: "₹24.0 Lakh",
    progress: 68,
    status: "Active",
    head: "B.K. Singh (GM CSR)",
    contact: "csr.ccl@coalindia.in",
    phone: "+91 651 236 0123",
    location: "Ranchi & Khunti",
    initiativesCount: 8,
    villagesReached: "18 Villages",
    description: "Installing off-grid rooftop solar systems for primary health sub-centres and cold-chain vaccine storage.",
    fundedProjects: [
      { id: "CSR-P-04", title: "PHC Solar Power Backup & Battery Storage", status: "Completed", grant: "₹15.0 Lakh" },
      { id: "CSR-P-05", title: "Community Solar Water Irrigation Pumps", status: "In Progress", grant: "₹20.0 Lakh" },
    ]
  },
  {
    id: "CSR-ADANI",
    name: "Adani Foundation",
    sector: "Smart Classrooms & Youth Skilling",
    category: "Education & Skilling",
    budget: "₹28.5 Lakh",
    disbursed: "₹18.2 Lakh",
    progress: 64,
    status: "Active",
    head: "Vasant Gadhavi (Executive Director)",
    contact: "foundation@adani.com",
    phone: "+91 79 2656 5555",
    location: "Godda & Khunti",
    initiativesCount: 10,
    villagesReached: "14 Villages",
    description: "Upgrading government secondary schools with interactive smart screens, digital STEM kits and vocational training labs.",
    fundedProjects: [
      { id: "CSR-P-06", title: "Digital Smart Classrooms in 12 Govt Schools", status: "In Progress", grant: "₹16.5 Lakh" },
      { id: "CSR-P-07", title: "Youth Solar Technician Skill Development Lab", status: "Approved", grant: "₹12.0 Lakh" },
    ]
  },
  {
    id: "CSR-JSW",
    name: "JSW Foundation",
    sector: "Rural Road Drainage & Culverts",
    category: "Infrastructure",
    budget: "₹19.0 Lakh",
    disbursed: "₹9.1 Lakh",
    progress: 48,
    status: "Approved",
    head: "Sangita Jindal (Chairperson)",
    contact: "csr@jsw.in",
    phone: "+91 22 4286 1000",
    location: "Khunti & Ramgarh",
    initiativesCount: 6,
    villagesReached: "9 Villages",
    description: "Constructing storm water concrete drains and cross-drainage culverts to prevent monsoon village isolation.",
    fundedProjects: [
      { id: "CSR-P-08", title: "Paved Road Embankment Protection & Drains", status: "In Progress", grant: "₹11.0 Lakh" },
      { id: "CSR-P-09", title: "Pre-cast Reinforced Concrete Culvert Slabs", status: "Approved", grant: "₹8.0 Lakh" },
    ]
  },
  {
    id: "CSR-TRUSTS",
    name: "Tata Trusts Jharkhand",
    sector: "Maternal Health & Nutrition Support",
    category: "Healthcare",
    budget: "₹16.0 Lakh",
    disbursed: "₹9.3 Lakh",
    progress: 58,
    status: "Active",
    head: "Amita Mahto (State Head)",
    contact: "contact@tatatrusts.org",
    phone: "+91 22 6665 8282",
    location: "Khunti & West Singhbhum",
    initiativesCount: 7,
    villagesReached: "32 Hamlets",
    description: "Equipping Anganwadi centres with digital growth monitoring, iron-folic supplementation and mobile health workers.",
    fundedProjects: [
      { id: "CSR-P-10", title: "Supplementary Nutrition & Growth Telemetry Kits", status: "In Progress", grant: "₹10.0 Lakh" },
      { id: "CSR-P-11", title: "Maternal Emergency Transport Incentive Fund", status: "In Progress", grant: "₹6.0 Lakh" },
    ]
  }
];

function DropletsIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  );
}

function HeartPulseIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
    </svg>
  );
}

// Jharkhand District Blocks Database
const jharkhandDistrictsData = {
  "Khunti": {
    blocks: ["Torpa", "Khunti Town", "Murhu", "Rania", "Karra", "Arki"],
    signalCoverage: "94.2%",
    alerts: [
      { id: "EW-KH-01", severity: "CRITICAL", title: "Rising water supply disruptions & pressure drop", block: "Torpa", signals: "12 reports", duration: "3 days", affectedPop: "4,200 residents", rootCause: "Underground main line valve rupture near Torpa Market Chowk.", action: "Dispatch Jal Shakti rapid repair tanker and replace main control valve." },
      { id: "EW-KH-02", severity: "HIGH", title: "Multiple road culvert damage & sinkhole risk", block: "Khunti Town", signals: "8 reports", duration: "2 days", affectedPop: "15,000 commuters", rootCause: "Heavy mineral transit caused 3-foot culvert depression on arterial bypass.", action: "Deploy PWD road inspection crew and issue temporary freight diversion notice." },
      { id: "EW-KH-03", severity: "MEDIUM", title: "Increasing solid waste dumping along stream", block: "Rania", signals: "6 reports", duration: "3 days", affectedPop: "1,800 residents", rootCause: "Unauthorized nocturnal tractor dumping near agricultural channel.", action: "Install barricade sensors and deploy municipal sanitation flying squad." },
      { id: "EW-KH-04", severity: "MEDIUM", title: "Seasonal viral fever & dengue cluster surveillance", block: "Murhu", signals: "5 reports", duration: "2 days", affectedPop: "2,500 residents", rootCause: "Stagnant drainage pools following unseasonal shower.", action: "Direct District Health Officer for anti-larval fogging and mobile clinic camp." },
      { id: "EW-KH-05", severity: "LOW", title: "Dry forest border heat telemetry alert", block: "Arki", signals: "Telemetry signal", duration: "Now", affectedPop: "Forest fringe hamlets", rootCause: "Thermal satellite telemetry shows 39°C surface heat spike.", action: "Alert local Van Samiti fire watchtowers for preventive forest patrol." },
      { id: "EW-KH-06", severity: "LOW", title: "Rural sub-station voltage fluctuation", block: "Karra", signals: "4 reports", duration: "1 day", affectedPop: "3,100 residents", rootCause: "Transformer overheating during peak morning irrigation hours.", action: "JBVNL line team dispatched for load-balancing transformer maintenance." }
    ]
  },
  "Ranchi": {
    blocks: ["Kanke", "Namkum", "Ormanjhi", "Ratu", "Bundu", "Angara", "Tamar", "Nagri", "Bero", "Mandar", "Itki", "Silli"],
    signalCoverage: "96.8%",
    alerts: [
      { id: "EW-RN-01", severity: "CRITICAL", title: "Subarnarekha catchment water turbidity surge", block: "Namkum", signals: "16 reports", duration: "1 day", affectedPop: "28,000 residents", rootCause: "Upstream industrial runoff discharge detected via river buoys.", action: "JSPCB alert issued, intake pump switched to auxiliary filtered reservoir." },
      { id: "EW-RN-02", severity: "HIGH", title: "Urban flash-waterlogging alert on Ring Road junction", block: "Ratu", signals: "11 reports", duration: "4 hours", affectedPop: "45,000 daily commuters", rootCause: "Stormwater trunk drain blocked by plastic packaging debris.", action: "Ranchi Municipal Corporation suction trucks deployed on emergency clearing." },
      { id: "EW-RN-03", severity: "HIGH", title: "High-density livestock vaccination cold-chain alert", block: "Kanke", signals: "7 reports", duration: "2 days", affectedPop: "12 dairy cooperatives", rootCause: "Secondary power feeder outage at veterinary research block.", action: "Automatic diesel genset linked and technician team dispatched." },
      { id: "EW-RN-04", severity: "MEDIUM", title: "Elephant corridor movement tracking alert", block: "Ormanjhi", signals: "Forest telemetry", duration: "Now", affectedPop: "6 peripheral villages", rootCause: "Herd of 9 elephants moving southward towards NH-33.", action: "Forest department alert teams and solar siren network activated." },
      { id: "EW-RN-05", severity: "LOW", title: "Sub-divisional hospital oxygen plant audit", block: "Bundu", signals: "Routine sensor", duration: "1 day", affectedPop: "Regional patients", rootCause: "Pressure sensor calibration due on PSA generator unit.", action: "Biomedical engineer scheduled for maintenance check." }
    ]
  },
  "East Singhbhum": {
    blocks: ["Jamshedpur (Golmuri)", "Ghatshila", "Potka", "Patamda", "Baharagora", "Chakulia", "Musabani", "Dhalbhumgarh"],
    signalCoverage: "95.4%",
    alerts: [
      { id: "EW-ES-01", severity: "CRITICAL", title: "Subarnarekha River water level warning threshold", block: "Ghatshila", signals: "Hydrology buoy", duration: "2 hours", affectedPop: "18,000 riverbank residents", rootCause: "Heavy monsoon precipitation in upper dam catchment area.", action: "Disaster management sirens tested, flood relief shelters prepared." },
      { id: "EW-ES-02", severity: "HIGH", title: "Industrial corridor air particulate PM10 surge", block: "Jamshedpur (Golmuri)", signals: "14 reports", duration: "1 day", affectedPop: "60,000 residents", rootCause: "Uncovered slag transportation and localized dry winds.", action: "Mandatory mist cannons deployed along Tata-Kandra industrial expressway." },
      { id: "EW-ES-03", severity: "MEDIUM", title: "Paddy crop pest manifestation alert (Brown Plant Hopper)", block: "Baharagora", signals: "9 reports", duration: "3 days", affectedPop: "850 farm holdings", rootCause: "High humidity and continuous cloudy spells.", action: "District Agriculture Officer released subsidized bio-pesticide advisory." },
      { id: "EW-ES-04", severity: "LOW", title: "Mine tailing pond water filtration sensor check", block: "Musabani", signals: "IoT sensor", duration: "Now", affectedPop: "Local watershed", rootCause: "Automated pH sensor variance of 0.4.", action: "UCIL safety team alerted for routine water sampling verification." }
    ]
  },
  "West Singhbhum": {
    blocks: ["Chaibasa Sadar", "Chakradharpur", "Jagannathpur", "Manoharpur", "Sonua", "Goilkera", "Jhinkpani", "Noamundi"],
    signalCoverage: "88.6%",
    alerts: [
      { id: "EW-WS-01", severity: "CRITICAL", title: "Roro River bridge abutment erosion alarm", block: "Chaibasa Sadar", signals: "9 reports", duration: "2 days", affectedPop: "22,000 residents", rootCause: "Rapid river water flow eroding western approach embankment.", action: "Sandbag embankment fortification initiated; traffic speed restricted." },
      { id: "EW-WS-02", severity: "HIGH", title: "Mineral haulage heavy vehicle road damage", block: "Noamundi", signals: "12 reports", duration: "3 days", affectedPop: "Mining belt commuters", rootCause: "Overloaded iron ore dumper movement during continuous rainfall.", action: "District mining task force deployed weighbridge compliance check." },
      { id: "EW-WS-03", severity: "MEDIUM", title: "Malaria vector index elevation in forest belt", block: "Manoharpur", signals: "7 reports", duration: "4 days", affectedPop: "Tribal hamlets", rootCause: "Post-rain water stagnation in forest fringe depressions.", action: "Community health workers deployed with rapid diagnostic kits and LLIN nets." }
    ]
  },
  "Dhanbad": {
    blocks: ["Dhanbad Sadar", "Jharia", "Baghmara", "Nirsa", "Govindpur", "Baliapur", "Tundi", "Topchanchi"],
    signalCoverage: "93.8%",
    alerts: [
      { id: "EW-DH-01", severity: "CRITICAL", title: "Subsurface underground coal fire smoke vent warning", block: "Jharia", signals: "Thermal radar", duration: "3 hours", affectedPop: "BCCL township zone", rootCause: "Fissure ventilation spike detected in opencast boundary zone.", action: "BCCL & District Administration evacuation protocol standby." },
      { id: "EW-DH-02", severity: "HIGH", title: "Topchanchi Lake feeder canal siltation blockage", block: "Topchanchi", signals: "8 reports", duration: "2 days", affectedPop: "35,000 water consumers", rootCause: "Debris deposition at intake canal grill following storm.", action: "Excavator machinery dispatched for channel desilting." },
      { id: "EW-DH-03", severity: "MEDIUM", title: "Air quality index decline along coal transit artery", block: "Govindpur", signals: "10 reports", duration: "2 days", affectedPop: "Commercial hub", rootCause: "Coal dust resuspension on NH-2 bypass.", action: "Mandatory continuous mechanized road sweeping ordered." }
    ]
  },
  "Bokaro": {
    blocks: ["Chas", "Chandankiyari", "Bermo", "Gomia", "Jaridih", "Kasmar", "Nawadih", "Petarwar"],
    signalCoverage: "92.4%",
    alerts: [
      { id: "EW-BK-01", severity: "CRITICAL", title: "Damodar River downstream industrial discharge warning", block: "Chas", signals: "11 reports", duration: "1 day", affectedPop: "40,000 residents", rootCause: "Effluent treatment bypass alarm from industrial zone.", action: "Pollution Control Board squad sealed outflow pipe pending audit." },
      { id: "EW-BK-02", severity: "HIGH", title: "Garga Dam spillway gate maintenance alert", block: "Bermo", signals: "Telemetry signal", duration: "Now", affectedPop: "Dam downstream hamlets", rootCause: "Sluice gate motor sensor calibration alert.", action: "Water resources engineering team on-site for automated inspection." },
      { id: "EW-BK-03", severity: "MEDIUM", title: "Rural power distribution transformer overload", block: "Chandankiyari", signals: "6 reports", duration: "2 days", affectedPop: "8,500 residents", rootCause: "Unregistered agriculture tubewell connections.", action: "Upgraded 100kVA transformer installation scheduled." }
    ]
  },
  "Hazaribagh": {
    blocks: ["Hazaribagh Sadar", "Barhi", "Barkagaon", "Chauparan", "Churchu", "Ichak", "Katkamsandi", "Barkatha"],
    signalCoverage: "91.5%",
    alerts: [
      { id: "EW-HZ-01", severity: "CRITICAL", title: "Konar River catchment runoff surge", block: "Barhi", signals: "13 reports", duration: "1 day", affectedPop: "14,000 residents", rootCause: "Heavy tributary inflow after cloudburst in upper hills.", action: "District disaster response unit alerted; low-lying culvert cordoned." },
      { id: "EW-HZ-02", severity: "HIGH", title: "Mining corridor road subsidence alert", block: "Barkagaon", signals: "8 reports", duration: "2 days", affectedPop: "Local commuters", rootCause: "Sub-base soil saturation beside coal dispatch route.", action: "Emergency road repair and stone ballast pitching commenced." }
    ]
  },
  "Deoghar": {
    blocks: ["Deoghar Sadar", "Mohanpur", "Sarwan", "Sarath", "Madhupur", "Palojori", "Devipur"],
    signalCoverage: "93.0%",
    alerts: [
      { id: "EW-DG-01", severity: "CRITICAL", title: "Temple corridor crowd congestion & bottleneck sensor alert", block: "Deoghar Sadar", signals: "Smart camera sensor", duration: "1 hour", affectedPop: "Pilgrim influx", rootCause: "Devotee flow exceeded 120 persons/min at Western gate.", action: "Rapid queue management and auxiliary holding area opened." },
      { id: "EW-DG-02", severity: "HIGH", title: "Rural health sub-centre medicine stock low alert", block: "Sarath", signals: "6 reports", duration: "3 days", affectedPop: "12,000 residents", rootCause: "Antivenom and ORS stocks below 20% safety threshold.", action: "District warehouse dispatched emergency medical replenishment van." }
    ]
  }
};

const getDistrictData = (districtName) => {
  if (jharkhandDistrictsData[districtName]) {
    return jharkhandDistrictsData[districtName];
  }
  const cleanName = districtName || "District";
  const defaultBlocks = [`${cleanName} Sadar`, "North Block", "South Block", "East Block", "West Block"];
  return {
    blocks: defaultBlocks,
    signalCoverage: "91.8%",
    alerts: [
      {
        id: `EW-${cleanName.substring(0, 2).toUpperCase()}-01`,
        severity: "CRITICAL",
        title: "Drinking water pipeline pressure deficit alert",
        block: `${cleanName} Sadar`,
        signals: "9 reports",
        duration: "1 day",
        affectedPop: "5,400 residents",
        rootCause: "Underground booster pump station motor trip.",
        action: "Drinking Water & Sanitation department team deployed on site."
      },
      {
        id: `EW-${cleanName.substring(0, 2).toUpperCase()}-02`,
        severity: "HIGH",
        title: "Arterial road pothole cluster & monsoon erosion risk",
        block: "North Block",
        signals: "7 reports",
        duration: "2 days",
        affectedPop: "11,000 commuters",
        rootCause: "Culvert water overflow damaging asphalt top layer.",
        action: "PWD field team dispatched for stone-pitching and patch repairs."
      },
      {
        id: `EW-${cleanName.substring(0, 2).toUpperCase()}-03`,
        severity: "MEDIUM",
        title: "Solid waste accumulation near public marketplace",
        block: "South Block",
        signals: "5 reports",
        duration: "3 days",
        affectedPop: "3,200 residents",
        rootCause: "Secondary collection container delayed by repair.",
        action: "Municipal sanitary inspector assigned backup collection truck."
      },
      {
        id: `EW-${cleanName.substring(0, 2).toUpperCase()}-04`,
        severity: "LOW",
        title: "Primary Health Centre solar backup maintenance due",
        block: "East Block",
        signals: "Telemetry signal",
        duration: "Now",
        affectedPop: "Health sub-centre",
        rootCause: "Battery state-of-charge sensor variance.",
        action: "Energy technician scheduled for scheduled inspection."
      }
    ]
  };
};

const initialReports = [
  {
    id: "REP-1023",
    title: "Drinking Water Pipeline Leakage & Contamination",
    category: "Water & Sanitation",
    block: "Torpa",
    district: "Khunti",
    priority: "Critical",
    status: "Pending Action",
    date: "2026-09-27, 07:15 AM",
    timeAgo: "2h ago",
    citizenName: "Ramesh Munda",
    citizenPhone: "+91 98351 44210",
    citizenEmail: "ramesh.munda@jharkhandmail.in",
    department: "Drinking Water & Sanitation",
    description: "Main underground supply pipe near Torpa Market Chowk burst early morning, causing severe road flooding and muddy water backflow into residential taps for over 80 households."
  },
  {
    id: "REP-1022",
    title: "Culvert Cave-in & Pothole Cluster on Main Arterial Road",
    category: "Roads & Infrastructure",
    block: "Khunti Town",
    district: "Khunti",
    priority: "High",
    status: "Under Review",
    date: "2026-09-27, 05:30 AM",
    timeAgo: "4h ago",
    citizenName: "Sunita Devi",
    citizenPhone: "+91 94311 88720",
    citizenEmail: "sunita.khunti@gmail.com",
    department: "Public Works / Road Construction",
    description: "Heavy freight transit created a 3-foot sinkhole beside the bridge culvert at Khunti-Murhu connecting road. Commuters and school buses are at high risk of accidents."
  },
  {
    id: "REP-1021",
    title: "Primary School Boundary Wall Collapse Post-Monsoon",
    category: "Education & Infrastructure",
    block: "Murhu",
    district: "Khunti",
    priority: "Medium",
    status: "Forwarded",
    date: "2026-09-27, 04:00 AM",
    timeAgo: "5h ago",
    citizenName: "Birsa Topno",
    citizenPhone: "+91 87092 11984",
    citizenEmail: "birsatopno.smc@gov.in",
    department: "School Education & Literacy",
    description: "East boundary wall of Govt Primary School, Murhu collapsed due to soil erosion. Stray cattle entering campus during class hours. Immediate masonry rebuilding needed."
  },
  {
    id: "REP-1020",
    title: "Illegal Solid Waste Dumping near Waterbody",
    category: "Environment & Sanitation",
    block: "Rania",
    district: "Khunti",
    priority: "High",
    status: "Pending Action",
    date: "2026-09-27, 03:20 AM",
    timeAgo: "6h ago",
    citizenName: "Pooja Kumari",
    citizenPhone: "+91 91234 56789",
    citizenEmail: "pooja.rania@outlook.com",
    department: "Municipal / Urban Sanitation",
    description: "Commercial plastic and construction waste is being dumped by night tankers along the stream bank in Rania, polluting downstream agricultural irrigation channels."
  },
  {
    id: "REP-1019",
    title: "Stone Crusher Particulate Dust Emission",
    category: "Environment & Pollution",
    block: "Torpa",
    district: "Khunti",
    priority: "Low",
    status: "Resolved",
    date: "2026-09-27, 01:10 AM",
    timeAgo: "8h ago",
    citizenName: "Amit Mahato",
    citizenPhone: "+91 99341 62719",
    citizenEmail: "amit.mahato@yahoo.com",
    department: "Jharkhand State Pollution Control Board",
    description: "Crushing unit operating without adequate water sprinkler curtains, causing localized dust haze during daytime shifts."
  },
  {
    id: "REP-1018",
    title: "Primary Health Sub-Centre Solar Power Inverter Fault",
    category: "Health & Energy",
    block: "Karra",
    district: "Khunti",
    priority: "High",
    status: "In Progress",
    date: "2026-09-26, 11:45 PM",
    timeAgo: "10h ago",
    citizenName: "Dr. Anjali Gope",
    citizenPhone: "+91 97712 34561",
    citizenEmail: "phc.karra@jharkhandhealth.gov.in",
    department: "Health & Family Welfare",
    description: "Vaccine storage cold-chain refrigerator is running on backup generator due to rooftop solar inverter breakdown. Emergency electrical servicing required."
  }
];

const dataMeta = {
  "active-reports": {
    title: "Active Reports",
    subtitle: "Review, prioritize and route citizen reports requiring district action.",
    icon: FileText,
    tone: "blue"
  },
  "early-warnings": {
    title: "Early Warnings",
    subtitle: "District alerts detected from report trends, weather telemetry and field signals.",
    icon: AlertTriangle,
    tone: "rose"
  },
  "universities-partners": {
    title: "Universities & Partners",
    subtitle: "Coordinate academic institutions, technical expertise and problem-solving assignments across Jharkhand.",
    icon: GraduationCap,
    tone: "violet",
    institutions: [
      { name: "NIT Jamshedpur", dept: "Civil & Environmental Engineering", location: "Jamshedpur, Jharkhand", match: "94%", contact: "dean.research@nitjsr.ac.in" },
      { name: "BIT Mesra", dept: "Computer Science & Geospatial Tech", location: "Ranchi, Jharkhand", match: "89%", contact: "rnd@bitmesra.ac.in" },
      { name: "IIT (ISM) Dhanbad", dept: "Water Resources & Mining Eng.", location: "Dhanbad, Jharkhand", match: "86%", contact: "consultancy@iitism.ac.in" },
      { name: "Central University of Jharkhand", dept: "Public Health & Rural Development", location: "Ranchi, Jharkhand", match: "81%", contact: "cuj.projects@cuj.ac.in" },
      { name: "Xavier Institute of Social Service (XISS)", dept: "Rural Management & Social Audit", location: "Ranchi, Jharkhand", match: "78%", contact: "director@xiss.ac.in" },
    ]
  },
  "industries-csr": {
    title: "Industries / CSR Partners",
    subtitle: "Track partner commitments, CSR funding allocations and district development impact delivery in Jharkhand.",
    icon: Factory,
    tone: "emerald"
  },
  "departments": {
    title: "Departments",
    subtitle: "Manage departmental workload, response SLA capacity and operational readiness across line departments.",
    icon: Building2,
    tone: "amber"
  }
};

const getStatusBadge = (v) => {
  const x = String(v).toLowerCase();
  if (x.includes("critical") || x.includes("urgent")) return "bg-red-50 text-red-700 border-red-200";
  if (x.includes("high")) return "bg-orange-50 text-orange-700 border-orange-200";
  if (x.includes("medium") || x.includes("moderate") || x.includes("field testing")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (x.includes("low")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (x.includes("pilot deployed") || x.includes("resolved") || x.includes("active") || x.includes("verified") || x.includes("completed") || x.includes("optimal") || x.includes("approved")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (x.includes("in progress")) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
};

// Top Header Component
function PageHeader({ page, go, activeDistrict, onSelectDistrict }) {
  const Icon = page.icon;
  const jharkhandDistrictsList = [
    "Khunti", "Ranchi", "East Singhbhum", "West Singhbhum", "Dhanbad",
    "Bokaro", "Hazaribagh", "Deoghar", "Dumka", "Giridih", "Palamu",
    "Garhwa", "Godda", "Gumla", "Jamtara", "Koderma", "Latehar",
    "Lohardaga", "Pakur", "Ramgarh", "Sahibganj", "Seraikela Kharsawan",
    "Simdega", "Chatra"
  ];

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => go("/dashboard")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-700 transition w-fit"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
          </div>
          Back to Government Dashboard
        </button>

        {/* Signed-in District Selector & Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 px-2 text-xs text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="text-[11px] font-medium text-slate-400">Signed In:</span>
          </div>
          <select
            value={activeDistrict}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden"
            title="Active signed-in district for block-wise monitoring"
          >
            {jharkhandDistrictsList.map((d) => (
              <option key={d} value={d}>
                {d} District, Jharkhand
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  {activeDistrict} District Administration
                </span>
                <span className="text-[11px] text-slate-400">• Jharkhand</span>
              </div>
              <h1 className="mt-1 text-xl font-bold text-slate-900">{page.title}</h1>
              <p className="mt-0.5 text-xs text-slate-500">{page.subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Early Warnings Component (Block/Area Wise for Signed-in District Only)
function EarlyWarnings({ activeDistrict, go }) {
  const [selectedBlock, setSelectedBlock] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [dispatchedAlerts, setDispatchedAlerts] = useState({});
  const [toast, setToast] = useState(null);

  const districtData = useMemo(() => getDistrictData(activeDistrict), [activeDistrict]);
  const districtAlerts = districtData.alerts || [];
  const districtBlocks = ["All", ...(districtData.blocks || [])];

  const filteredAlerts = useMemo(() => {
    return districtAlerts.filter((a) => {
      const matchBlock = selectedBlock === "All" || a.block === selectedBlock;
      const matchSeverity = severityFilter === "All" || a.severity === severityFilter;
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.rootCause.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBlock && matchSeverity && matchSearch;
    });
  }, [districtAlerts, selectedBlock, severityFilter, searchQuery]);

  const criticalCount = districtAlerts.filter((a) => a.severity === "CRITICAL").length;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleDispatch = (alertId) => {
    setDispatchedAlerts((prev) => ({ ...prev, [alertId]: true }));
    showToast(`Rapid Response Team successfully dispatched for ${alertId} in ${activeDistrict}`);
  };

  return (
    <>
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [districtAlerts.length.toString(), `Active Warnings (${activeDistrict})`, AlertTriangle, "text-rose-600", "bg-rose-50"],
          [criticalCount.toString(), "Critical Tier Signals", Siren, "text-red-600", "bg-red-50"],
          [districtData.signalCoverage || "94.2%", "Telemetry Signal Coverage", Radio, "text-blue-600", "bg-blue-50"],
          ["< 2 hrs", "Avg Dispatch SLA", Clock3, "text-amber-600", "bg-amber-50"],
        ].map(([v, l, Icon, textCol, bgCol]) => (
          <div key={l} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgCol} ${textCol}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-semibold text-rose-500">Live Active</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">{l}</p>
            <p className={`text-xl font-bold ${textCol}`}>{v}</p>
          </div>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Block-Wise Early Warning Radar ({activeDistrict} District)
                </h2>
                <p className="text-xs text-slate-500">
                  Showing early warning telemetry signals strictly for areas within {activeDistrict}
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-md bg-red-50 border border-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE SIGNALS
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Block/Area:</span>
                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="All">All Blocks in {activeDistrict}</option>
                  {districtBlocks.filter((b) => b !== "All").map((block) => (
                    <option key={block} value={block}>
                      {block} Block
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Severity:</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="All">All Tiers</option>
                  <option value="CRITICAL">Critical Tier</option>
                  <option value="HIGH">High Tier</option>
                  <option value="MEDIUM">Medium Tier</option>
                  <option value="LOW">Low Tier</option>
                </select>
              </div>

              <div className="relative flex-1 min-w-[150px]">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeDistrict} alerts...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1 pl-7 pr-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2.5">
            {filteredAlerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No warning signals found matching the selected block/area filter in {activeDistrict}.
              </div>
            ) : (
              filteredAlerts.map((a) => {
                const isDispatched = dispatchedAlerts[a.id];
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAlert(a)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition hover:border-blue-300 hover:shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          a.severity === "CRITICAL"
                            ? "bg-red-50 text-red-700"
                            : a.severity === "HIGH"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <Siren className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${getStatusBadge(a.severity)}`}>
                            {a.severity}
                          </span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700">
                            {a.block} Block
                          </span>
                          <b className="truncate text-xs font-bold text-slate-900">{a.title}</b>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                          {a.signals} &nbsp;•&nbsp; Detected {a.duration} ago &nbsp;•&nbsp; {a.affectedPop}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isDispatched ? (
                        <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                        </span>
                      ) : (
                        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition">
                          Inspect
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {activeDistrict} Signal Radar
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-blue-400">{districtData.signalCoverage || "94.2%"}</p>
            <p className="text-xs text-slate-400 mt-1">
              Active telemetry from citizen mobile reports, water buoys & IoT sensors in {activeDistrict}
            </p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className="h-full w-[94%] rounded-full bg-blue-500" />
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-slate-400">
              <span>Citizen Reports (98%)</span>
              <span>Water Sensors (92%)</span>
              <span>Weather (93%)</span>
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50/70 p-5">
            <div className="flex items-center gap-2 text-red-700">
              <BellRing className="h-4 w-4" />
              <h3 className="text-xs font-bold">Immediate Response Protocol</h3>
            </div>
            <p className="mt-2 text-xl font-bold text-red-900">{criticalCount} Critical Urgent Tier</p>
            <p className="text-xs leading-relaxed text-red-700 mt-1">
              Active telemetry anomalies in {districtData.blocks?.slice(0, 2).join(" & ") || activeDistrict} require rapid administrative dispatch.
            </p>
            <button
              onClick={() => go("/government/active-reports")}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition"
            >
              <FileText className="h-3.5 w-3.5" /> View {activeDistrict} Reports →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              {activeDistrict} Block Warning Signals
            </h3>
            <div className="mt-3 space-y-2">
              {(districtData.blocks || []).map((block) => {
                const count = districtAlerts.filter((a) => a.block === block).length;
                return (
                  <div
                    key={block}
                    onClick={() => setSelectedBlock(block)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${
                      selectedBlock === block ? "bg-blue-50 font-bold text-blue-700" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{block} Block</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${count > 0 ? "bg-red-50 text-red-700 border border-red-100" : "bg-slate-100 text-slate-500"}`}>
                      {count} {count === 1 ? "alert" : "alerts"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Alert Investigation Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700 font-bold">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border px-2 py-0.5 text-[9px] font-bold ${getStatusBadge(selectedAlert.severity)}`}>
                      {selectedAlert.severity} ALERT
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-700">
                      {selectedAlert.id}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedAlert.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400">Block / Area</span>
                  <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-blue-600" />
                    {selectedAlert.block} Block, {activeDistrict}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400">Signals & Population</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedAlert.signals} ({selectedAlert.affectedPop})</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Root Cause Diagnostics</span>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed">{selectedAlert.rootCause}</p>
              </div>

              <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Recommended Administrative Action
                </span>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                  {selectedAlert.action}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedAlert(null)}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDispatch(selectedAlert.id);
                  setSelectedAlert(null);
                }}
                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Dispatch Rapid Team
              </button>
              <button
                onClick={() => {
                  setSelectedAlert(null);
                  go("/government/active-reports");
                }}
                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Inspect Reports →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Active Reports Component
function ActiveReports({ activeDistrict, go }) {
  const [reports, setReports] = useState(initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [departmentRouting, setDepartmentRouting] = useState("");

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleUpdateStatus = (reportId, newStatus, customMsg) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(customMsg || `Report ${reportId} marked as ${newStatus}`);
  };

  const handleForwardDepartment = (reportId) => {
    if (!departmentRouting) {
      showToast("Please select a target line department to forward this grievance.");
      return;
    }
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, department: departmentRouting, status: "Forwarded" } : r))
    );
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport((prev) => ({ ...prev, department: departmentRouting, status: "Forwarded" }));
    }
    showToast(`Report ${reportId} successfully routed to ${departmentRouting}`);
  };

  const categories = ["All", ...Array.from(new Set(initialReports.map((r) => r.category)))];
  const priorities = ["All", "Critical", "High", "Medium", "Low"];

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || r.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || r.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <>
      {feedbackToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["198", "Total Active Reports", FileText, "text-blue-600", "bg-blue-50"],
          ["42", "Critical / High Urgent", AlertTriangle, "text-rose-600", "bg-rose-50"],
          ["124", "Verified on Ground", CheckCircle2, "text-emerald-600", "bg-emerald-50"],
          ["32", "Assigned Today", Target, "text-violet-600", "bg-violet-50"],
        ].map(([val, label, Icon, textCol, bgCol]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgCol} ${textCol}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-600">+8.4%</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">{label}</p>
            <p className={`text-xl font-bold ${textCol}`}>{val}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">District Grievance & Incident Queue ({activeDistrict})</h2>
            <p className="text-xs text-slate-500">Live citizen submissions across {activeDistrict} district</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex items-center min-w-[200px]">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, issue, block..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              {categories.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri}>
                  {pri === "All" ? "All Priorities" : `${pri} Priority`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50/75 text-[11px] font-semibold text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">Report ID</th>
                <th className="px-4 py-3 text-left">Issue Summary</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No active reports match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-semibold text-blue-700">
                      {report.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-[240px] truncate">
                      {report.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {report.category}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {report.block}, {activeDistrict}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(report.priority)}`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {report.timeAgo}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setDepartmentRouting(report.department);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700">{selectedReport.id}</span>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(selectedReport.priority)}`}>
                    {selectedReport.priority} Priority
                  </span>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{selectedReport.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 space-y-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Citizen Grievance Description</span>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed">{selectedReport.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400">Location / Block</span>
                  <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-blue-600" />
                    {selectedReport.block}, {activeDistrict}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400">Category</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedReport.category}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400">Timestamp</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedReport.date}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Citizen Reporter Contact</span>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900">{selectedReport.citizenName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedReport.citizenPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedReport.citizenEmail}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">Line Department Assignment</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={departmentRouting}
                    onChange={(e) => setDepartmentRouting(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Drinking Water & Sanitation">Drinking Water & Sanitation Department</option>
                    <option value="Public Works / Road Construction">Public Works / Road Construction</option>
                    <option value="School Education & Literacy">School Education & Literacy</option>
                    <option value="Municipal / Urban Sanitation">Municipal / Urban Sanitation</option>
                    <option value="Health & Family Welfare">Health & Family Welfare</option>
                    <option value="Jharkhand State Pollution Control Board">Jharkhand State Pollution Control Board</option>
                  </select>
                  <button
                    onClick={() => handleForwardDepartment(selectedReport.id)}
                    className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" /> Route Department
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Close Window
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedReport.id, "Rejected", `Report ${selectedReport.id} marked as Rejected/Duplicate`)}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                >
                  Reject / Duplicate
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReport.id, "In Progress", `Report ${selectedReport.id} marked In Progress`)}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReport.id, "Verified & Resolved", `Report ${selectedReport.id} marked Verified & Resolved`)}
                  className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition flex items-center gap-1"
                >
                  <Check className="h-3.5 w-3.5" /> Verify & Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Universities Component (Real-Time Live Projects Portfolio Modal)
function Universities({ page, go }) {
  const [universityProjects, setUniversityProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(UNIVERSITY_PROJECTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse university projects storage", e);
    }
    return defaultUniversityProjects;
  });

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(UNIVERSITY_PROJECTS_STORAGE_KEY, JSON.stringify(universityProjects));
      window.dispatchEvent(new Event("solvesphere_data_updated"));
    } catch (e) {
      console.error("Failed to save university projects", e);
    }
  }, [universityProjects]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const liveProjectCounts = useMemo(() => {
    const counts = {};
    Object.keys(universityProjects).forEach((uni) => {
      counts[uni] = universityProjects[uni]?.length || 0;
    });
    return counts;
  }, [universityProjects]);

  const totalLiveProjects = useMemo(() => {
    return Object.values(liveProjectCounts).reduce((acc, c) => acc + c, 0);
  }, [liveProjectCounts]);

  const handleUpdateProjectStatus = (uniName, projectId, newStatus) => {
    setUniversityProjects((prev) => {
      const uniList = prev[uniName] || [];
      const updatedList = uniList.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status: newStatus,
              progress: newStatus === "Completed" ? 100 : newStatus === "Pilot Deployed" ? 95 : p.progress,
            }
          : p
      );
      return { ...prev, [uniName]: updatedList };
    });
    showToast(`Project ${projectId} updated to "${newStatus}" in real time.`);
  };

  const activeUniversityProjects = useMemo(() => {
    if (!selectedUniversity) return [];
    const list = universityProjects[selectedUniversity.name] || [];
    return list.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.lead.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(projectSearch.toLowerCase());
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [selectedUniversity, universityProjects, projectSearch, statusFilter]);

  return (
    <>
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [page.institutions.length.toString(), "Partner Institutions", Landmark, "text-violet-700", "bg-violet-50"],
          [totalLiveProjects.toString(), "Active Research Projects", Target, "text-blue-700", "bg-blue-50"],
          ["87%", "Avg Technical Match", Sparkles, "text-amber-700", "bg-amber-50"],
          ["18", "Engaged Faculty Labs", Building2, "text-emerald-700", "bg-emerald-50"],
        ].map(([v, l, Icon, textCol, bgCol]) => (
          <div key={l} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgCol} ${textCol}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Real-time
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">{l}</p>
            <p className={`text-xl font-bold ${textCol}`}>{v}</p>
          </div>
        ))}
      </div>

      {/* Institution Cards Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 p-4 gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Institution & Academic Network</h2>
            <p className="text-xs text-slate-500">
              Click on any institution or its live projects badge to view current assigned projects
            </p>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            {page.institutions.length} Accredited University Partners
          </span>
        </div>

        <div className="grid gap-3.5 p-4 md:grid-cols-2 xl:grid-cols-3">
          {page.institutions.map((r) => {
            const projectCount = liveProjectCounts[r.name] || 0;
            return (
              <div
                key={r.name}
                onClick={() => {
                  setSelectedUniversity(r);
                  setProjectSearch("");
                  setStatusFilter("All");
                }}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-300 hover:shadow-2xs cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700 group-hover:bg-violet-100 transition">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <span className="rounded-md border border-violet-100 bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                      {r.match} match
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
                    {r.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-600">{r.dept}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {r.location}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUniversity(r);
                      setProjectSearch("");
                      setStatusFilter("All");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50/80 px-2.5 py-1 text-[11px] font-bold text-violet-700 hover:bg-violet-600 hover:text-white transition shadow-2xs"
                  >
                    <FolderGit2 className="h-3.5 w-3.5" />
                    <span>{projectCount} live {projectCount === 1 ? "project" : "projects"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* University Live Projects Detail Modal */}
      {selectedUniversity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700 font-bold shrink-0">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                      {liveProjectCounts[selectedUniversity.name] || 0} LIVE PROJECTS
                    </span>
                    <span className="text-[11px] text-slate-400">• {selectedUniversity.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedUniversity.name}</h3>
                  <p className="text-xs text-slate-500">{selectedUniversity.dept} &nbsp;•&nbsp; Contact: {selectedUniversity.contact}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUniversity(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5 py-3 border-b border-slate-100 shrink-0">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search live project by title, ID, lead..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Stage:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-violet-500 focus:outline-hidden"
                >
                  <option value="All">All Stages</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Field Testing">Field Testing</option>
                  <option value="Pilot Deployed">Pilot Deployed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="my-3 space-y-3 overflow-y-auto flex-1 pr-1">
              {activeUniversityProjects.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No live projects matching the search criteria for {selectedUniversity.name}.
                </div>
              ) : (
                activeUniversityProjects.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3 hover:border-violet-200 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                          {p.id}
                        </span>
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(p.status)}`}>
                          {p.status}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">{p.category}</span>
                      </div>

                      <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        {p.partner}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Faculty PI & Lead</span>
                        <span className="font-semibold text-slate-800 text-[11px] truncate block">{p.lead}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Target District / Area</span>
                        <span className="font-semibold text-slate-800 text-[11px] block">{p.district}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Target Delivery</span>
                        <span className="font-semibold text-slate-800 text-[11px] block">{p.targetDate}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                      <div className="flex-1 max-w-xs">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                          <span>Milestone Delivery Progress</span>
                          <span className="text-slate-800">{p.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-600 transition-all duration-300"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {p.status !== "Field Testing" && p.status !== "Completed" && (
                          <button
                            onClick={() => handleUpdateProjectStatus(selectedUniversity.name, p.id, "Field Testing")}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-100 transition"
                          >
                            Mark Field Testing
                          </button>
                        )}
                        {p.status !== "Pilot Deployed" && p.status !== "Completed" && (
                          <button
                            onClick={() => handleUpdateProjectStatus(selectedUniversity.name, p.id, "Pilot Deployed")}
                            className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            Mark Pilot Deployed
                          </button>
                        )}
                        {p.status !== "Completed" && (
                          <button
                            onClick={() => handleUpdateProjectStatus(selectedUniversity.name, p.id, "Completed")}
                            className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 shrink-0">
              <span className="text-xs text-slate-500">
                Showing {activeUniversityProjects.length} of {liveProjectCounts[selectedUniversity.name] || 0} live projects
              </span>
              <button
                onClick={() => setSelectedUniversity(null)}
                className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Industries / CSR Partners Component (Standard, Clean & Interactive)
function Industries({ go }) {
  const [partners, setPartners] = useState(csrPartnersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const sectors = ["All", ...Array.from(new Set(csrPartnersData.map((p) => p.category)))];

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.head.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSector = sectorFilter === "All" || p.category === sectorFilter;
      return matchSearch && matchSector;
    });
  }, [partners, searchQuery, sectorFilter]);

  const totalInitiatives = useMemo(() => partners.reduce((acc, p) => acc + p.initiativesCount, 0), [partners]);

  const handleApproveTranche = (partnerId) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, progress: Math.min(100, p.progress + 15) } : p))
    );
    if (selectedPartner && selectedPartner.id === partnerId) {
      setSelectedPartner((prev) => ({ ...prev, progress: Math.min(100, prev.progress + 15) }));
    }
    showToast(`Next milestone grant tranche approved for ${selectedPartner?.name || "Partner"}`);
  };

  return (
    <>
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top 4 Clean KPI Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["₹1.37 Cr", "Committed CSR Portfolio", WalletCards, "text-emerald-700", "bg-emerald-50"],
          [partners.length.toString(), "Active Industry Partners", Factory, "text-blue-700", "bg-blue-50"],
          [totalInitiatives.toString(), "Civic CSR Initiatives", Target, "text-violet-700", "bg-violet-50"],
          ["76.4%", "Avg Fund Deployment", CheckCircle2, "text-amber-700", "bg-amber-50"],
        ].map(([v, l, Icon, textCol, bgCol]) => (
          <div key={l} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgCol} ${textCol}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active MoU
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">{l}</p>
            <p className={`text-xl font-bold ${textCol}`}>{v}</p>
          </div>
        ))}
      </div>

      {/* Partner Commitments Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 p-4 gap-2.5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Industry Partner Commitments & CSR Progress</h2>
            <p className="text-xs text-slate-500">Track partner grants, focus areas and ground milestone delivery</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search partner, sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="All">All Sectors</option>
              {sectors.filter((s) => s !== "All").map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Partners Roster List */}
        <div className="divide-y divide-slate-100">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="p-4.5 hover:bg-slate-50/60 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Partner Profile */}
              <div className="flex items-start gap-3.5 min-w-[320px]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold">
                  <Factory className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{partner.id}</span>
                    <span className={`rounded-md border px-2 py-0.5 text-[9px] font-bold ${getStatusBadge(partner.status)}`}>
                      {partner.status}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">{partner.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{partner.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span className="font-medium text-slate-700">{partner.sector}</span>
                    <span>•</span>
                    <span>{partner.villagesReached}</span>
                  </p>
                </div>
              </div>

              {/* Financial & Reach Metrics */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 text-xs shrink-0 lg:w-96">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Committed Budget</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                    {partner.budget}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Disbursed Grant</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                    {partner.disbursed}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Funded Projects</span>
                  <span className="text-xs font-bold text-blue-700 mt-0.5 block">
                    {partner.initiativesCount} Initiatives
                  </span>
                </div>
              </div>

              {/* Progress Bar & Actions */}
              <div className="flex items-center gap-4 shrink-0 lg:w-72 justify-between">
                <div className="flex-1 max-w-[140px]">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                    <span>Milestones</span>
                    <span className="font-bold text-slate-800">{partner.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${partner.progress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPartner(partner)}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition shadow-2xs"
                >
                  Inspect Portfolio
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSR Partner Portfolio Detail Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold shrink-0">
                  <Factory className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700">{selectedPartner.id}</span>
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(selectedPartner.status)}`}>
                      {selectedPartner.status} PARTNER
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedPartner.name}</h3>
                  <p className="text-xs text-slate-500">{selectedPartner.sector} • {selectedPartner.location}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPartner(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="my-4 space-y-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CSR Focus & Mandate</span>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed">{selectedPartner.description}</p>
              </div>

              {/* Contact Dossier */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CSR Directorate Liaison</span>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{selectedPartner.head}</p>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {selectedPartner.phone}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {selectedPartner.contact}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400">Total Sanctioned</span>
                  <p className="text-base font-bold text-emerald-700 mt-0.5">{selectedPartner.budget}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400">Disbursed on Milestones</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedPartner.disbursed}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400">Impact Footprint</span>
                  <p className="text-base font-bold text-blue-700 mt-0.5">{selectedPartner.villagesReached}</p>
                </div>
              </div>

              {/* Active Funded Projects */}
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Funded Civic Infrastructure Initiatives</span>
                <div className="divide-y divide-slate-100 mt-1">
                  {selectedPartner.fundedProjects.map((p) => (
                    <div key={p.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-[10px] text-emerald-700 font-bold mr-1.5">{p.id}</span>
                        <span className="font-semibold text-slate-800">{p.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700">{p.grant}</span>
                        <span className={`rounded-md border px-2 py-0.5 text-[9px] font-bold ${getStatusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedPartner(null)}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Close Window
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApproveTranche(selectedPartner.id)}
                  className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve Tranche Disbursement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Standard Departments Component (Clean, Robust & Interactive)
function Departments({ go }) {
  const [departments, setDepartments] = useState(departmentsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedDept, setSelectedDept] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.focusArea.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === "All" || d.priorityStatus.includes(priorityFilter);
      return matchesSearch && matchesPriority;
    });
  }, [departments, searchQuery, priorityFilter]);

  const totalOpenCases = useMemo(() => departments.reduce((acc, d) => acc + d.openCases, 0), [departments]);
  const avgReadiness = useMemo(() => {
    const total = departments.reduce((acc, d) => acc + d.readiness, 0);
    return (total / departments.length).toFixed(1);
  }, [departments]);
  const totalTeams = useMemo(() => departments.reduce((acc, d) => acc + d.teams, 0), [departments]);

  const handleDispatchSupportTeam = (deptId) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === deptId ? { ...d, teams: d.teams + 1, readiness: Math.min(99, d.readiness + 3) } : d))
    );
    if (selectedDept && selectedDept.id === deptId) {
      setSelectedDept((prev) => ({ ...prev, teams: prev.teams + 1, readiness: Math.min(99, prev.readiness + 3) }));
    }
    showToast(`Additional Rapid Response Team dispatched to ${selectedDept?.name || "Department"}`);
  };

  return (
    <>
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top 4 Clean KPI Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [departments.length.toString(), "Active Line Departments", Building2, "text-blue-700", "bg-blue-50"],
          [`${avgReadiness}%`, "District Readiness Score", ShieldCheck, "text-emerald-700", "bg-emerald-50"],
          [totalOpenCases.toString(), "Active Grievance Cases", FileText, "text-amber-700", "bg-amber-50"],
          [`${totalTeams} Units`, "Rapid Response Units", UsersRound, "text-violet-700", "bg-violet-50"],
        ].map(([v, l, Icon, textCol, bgCol]) => (
          <div key={l} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgCol} ${textCol}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live SLA
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">{l}</p>
            <p className={`text-xl font-bold ${textCol}`}>{v}</p>
          </div>
        ))}
      </div>

      {/* Departments Roster Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 p-4 gap-2.5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Line Department Workload & Readiness Roster</h2>
            <p className="text-xs text-slate-500">Operational response capacity, assigned officers and queue status</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search department, nodal lead..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Moderate">Moderate Priority</option>
              <option value="Active">Optimal / Active</option>
            </select>
          </div>
        </div>

        {/* Departments List / Cards */}
        <div className="divide-y divide-slate-100">
          {filteredDepartments.map((dept) => {
            const Icon = dept.icon || Building2;
            return (
              <div
                key={dept.id}
                className="p-4.5 hover:bg-slate-50/60 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Department Info */}
                <div className="flex items-start gap-3.5 min-w-[320px]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{dept.id}</span>
                      <span className={`rounded-md border px-2 py-0.5 text-[9px] font-bold ${getStatusBadge(dept.priorityStatus)}`}>
                        {dept.priorityStatus}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{dept.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="font-medium text-slate-700">{dept.lead} ({dept.designation})</span>
                      <span>•</span>
                      <span>{dept.focusArea}</span>
                    </p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 text-xs shrink-0 lg:w-96">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Open Cases</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {dept.openCases} <span className="text-[10px] text-slate-400 font-normal">/ {dept.totalCases} total</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Field Units</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {dept.teams} Teams On Duty
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Avg SLA Response</span>
                    <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                      {dept.avgSLA}
                    </span>
                  </div>
                </div>

                {/* Readiness Progress & Action */}
                <div className="flex items-center gap-4 shrink-0 lg:w-72 justify-between">
                  <div className="flex-1 max-w-[140px]">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                      <span>Readiness</span>
                      <span className="font-bold text-slate-800">{dept.readiness}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          dept.readiness >= 90 ? "bg-emerald-500" : dept.readiness >= 80 ? "bg-blue-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${dept.readiness}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDept(dept)}
                    className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition shadow-2xs"
                  >
                    Inspect Queue
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Inspection & Queue Modal */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold shrink-0">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">{selectedDept.id}</span>
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(selectedDept.priorityStatus)}`}>
                      {selectedDept.priorityStatus}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedDept.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="my-4 space-y-4 text-xs">
              {/* Nodal Officer Dossier */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Designated Nodal Officer</span>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{selectedDept.lead}</p>
                    <p className="text-slate-500 text-[11px]">{selectedDept.designation}</p>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {selectedDept.phone}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {selectedDept.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400">Open Grievance Queue</span>
                  <p className="text-base font-bold text-amber-600 mt-0.5">{selectedDept.openCases} cases</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400">Active Field Units</span>
                  <p className="text-base font-bold text-blue-600 mt-0.5">{selectedDept.teams} Teams</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400">SLA Compliance</span>
                  <p className="text-base font-bold text-emerald-600 mt-0.5">{selectedDept.slaCompliance}</p>
                </div>
              </div>

              {/* Current Active Tasks in Department Queue */}
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live Assigned Incidents</span>
                <div className="divide-y divide-slate-100 mt-1">
                  {selectedDept.recentTasks.map((t) => (
                    <div key={t.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-[10px] text-blue-600 font-bold mr-1.5">{t.id}</span>
                        <span className="font-semibold text-slate-800">{t.title}</span>
                        <span className="text-slate-400 text-[10px] ml-2">({t.block} Block)</span>
                      </div>
                      <span className={`rounded-md border px-2 py-0.5 text-[9px] font-bold ${getStatusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedDept(null)}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Close Window
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDispatchSupportTeam(selectedDept.id)}
                  className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Dispatch Additional Support Unit
                </button>
                <button
                  onClick={() => {
                    setSelectedDept(null);
                    go("/government/active-reports");
                  }}
                  className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  View Full Queue →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Main Page Controller
export default function GovernmentSectionPage() {
  const { section } = useParams();
  const navigate = useNavigate();
  const { data } = useAdmin();
  const { user } = useAuth();

  const defaultDistrict = useMemo(() => {
    if (user?.district) {
      return String(user.district).replace(/ District.*$/i, "").replace(/,.*$/, "").trim();
    }
    if (data?.settings?.district) {
      return String(data.settings.district).replace(/ District.*$/i, "").replace(/,.*$/, "").trim();
    }
    if (data?.settings?.defaultDistrict) {
      return String(data.settings.defaultDistrict).replace(/ District.*$/i, "").replace(/,.*$/, "").trim();
    }
    return "Khunti";
  }, [user, data]);

  const [activeDistrict, setActiveDistrict] = useState(defaultDistrict);

  const page = dataMeta[section] || dataMeta["active-reports"];
  const go = (path) => navigate(path);

  let body;
  if (section === "early-warnings") {
    body = <EarlyWarnings activeDistrict={activeDistrict} go={go} />;
  } else if (section === "universities-partners") {
    body = <Universities page={page} go={go} />;
  } else if (section === "industries-csr") {
    body = <Industries go={go} />;
  } else if (section === "departments") {
    body = <Departments go={go} />;
  } else {
    body = <ActiveReports activeDistrict={activeDistrict} go={go} />;
  }

  return (
    <div className="min-h-full space-y-5 pb-8">
      <PageHeader
        page={page}
        go={go}
        activeDistrict={activeDistrict}
        onSelectDistrict={setActiveDistrict}
      />
      {body}
    </div>
  );
}
