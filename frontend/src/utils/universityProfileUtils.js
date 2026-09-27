// Helper utilities for managing University Profiles in local storage

export const UNIVERSITY_TYPES = [
  "University",
  "College",
  "Deemed University",
  "Autonomous Institute",
  "Research Institute",
];

export const DISTRICT_OPTIONS = [
  "Ranchi",
  "Dumka",
  "Dhanbad",
  "Jamshedpur",
  "Hazaribagh",
  "Bokaro",
  "Deoghar",
  "Giridih",
  "East Singhbhum",
  "West Singhbhum",
  "Ramgarh",
  "Palamu",
];

// Shared source of truth for department-specific expertise during registration.
export const DEPARTMENT_EXPERTISE = {
  "Computer Science & Engineering (CSE)": ["Software Development", "Web Development", "Mobile App Development", "Cloud Computing", "DevOps", "Cybersecurity", "Artificial Intelligence & Machine Learning", "Data Structures & Algorithms", "Database Management", "Computer Networks", "Operating Systems", "Distributed Systems", "Blockchain", "Internet of Things (IoT)", "Other"],
  "Information Technology (IT)": ["Web Development", "Software Engineering", "Cloud Computing", "DevOps", "Cybersecurity", "Database Management", "Computer Networks", "IT Infrastructure", "System Administration", "Information Systems", "IT Service Management", "Other"],
  "Electronics & Communication Engineering (ECE)": ["Embedded Systems", "VLSI Design", "Digital Electronics", "Analog Electronics", "Communication Systems", "Signal Processing", "Microcontrollers", "Microprocessors", "PCB Design", "RF & Microwave Engineering", "Antenna Design", "IoT", "Wireless Communication", "Other"],
  "Electrical & Electronics Engineering (EEE)": ["Power Systems", "Power Electronics", "Electrical Machines", "Control Systems", "Renewable Energy", "Smart Grid", "Electrical Drives", "Instrumentation", "High Voltage Engineering", "Energy Management", "Industrial Automation", "Other"],
  "Civil Engineering": ["Structural Engineering", "Construction Management", "Geotechnical Engineering", "Transportation Engineering", "Highway Engineering", "Environmental Engineering", "Water Resources Engineering", "Hydraulics", "Urban Planning", "Surveying & Geomatics", "Building Information Modeling (BIM)", "Smart Cities & Infrastructure", "Disaster Management", "Other"],
  "Mechanical Engineering": ["Manufacturing", "Production Engineering", "CAD/CAM", "Machine Design", "Thermal Engineering", "Fluid Mechanics", "Automobile Engineering", "Robotics & Automation", "Industrial Engineering", "Mechatronics", "HVAC", "Renewable Energy Systems", "Additive Manufacturing / 3D Printing", "Maintenance Engineering", "Other"],
  "Chemical Engineering": ["Process Engineering", "Process Design", "Process Control", "Chemical Process Safety", "Petroleum & Petrochemical Engineering", "Biochemical Engineering", "Materials Processing", "Heat Transfer", "Mass Transfer", "Reaction Engineering", "Industrial Chemistry", "Waste Treatment", "Other"],
  "Environmental Engineering": ["Water Treatment", "Wastewater Treatment", "Solid Waste Management", "Air Pollution Control", "Environmental Monitoring", "Environmental Impact Assessment", "Waste Management", "Recycling & Resource Recovery", "Climate & Sustainability", "Renewable Energy", "Environmental Modeling", "Disaster & Risk Management", "Other"],
  Biotechnology: ["Bioinformatics", "Genetic Engineering", "Molecular Biology", "Microbiology", "Bioprocess Engineering", "Industrial Biotechnology", "Agricultural Biotechnology", "Medical Biotechnology", "Food Biotechnology", "Pharmaceutical Biotechnology", "Environmental Biotechnology", "Other"],
  "Agricultural Engineering": ["Agricultural Machinery", "Irrigation Engineering", "Soil & Water Conservation", "Precision Agriculture", "Agricultural Automation", "Farm Management", "Food Processing", "Post-Harvest Technology", "Renewable Energy in Agriculture", "Smart Farming", "Other"],
  "Automobile Engineering": ["Automotive Design", "Electric Vehicles", "Vehicle Dynamics", "Automotive Electronics", "Engine Technology", "Vehicle Safety", "Automotive Manufacturing", "Autonomous Vehicles", "Battery Technology", "Vehicle Diagnostics", "Other"],
  "Aerospace Engineering": ["Aerodynamics", "Propulsion", "Aircraft Structures", "Avionics", "Flight Mechanics", "Aerospace Materials", "UAV / Drone Technology", "Space Systems", "Aircraft Design", "Other"],
  "Industrial & Production Engineering": ["Production Planning", "Manufacturing Systems", "Quality Control", "Supply Chain Management", "Operations Research", "Lean Manufacturing", "Six Sigma", "Industrial Automation", "Process Optimization", "Inventory Management", "Other"],
  "Mining Engineering": ["Mine Planning", "Mining Machinery", "Rock Mechanics", "Mine Safety", "Mineral Processing", "Underground Mining", "Open Cast Mining", "Mine Surveying", "Environmental Management in Mining", "Other"],
  "Metallurgical & Materials Engineering": ["Materials Science", "Metallurgy", "Material Characterization", "Corrosion Engineering", "Nanomaterials", "Composite Materials", "Welding Technology", "Metal Processing", "Advanced Materials", "Other"],
  "Robotics & Automation": ["Industrial Robotics", "Autonomous Systems", "Robot Programming", "Computer Vision", "Control Systems", "Mechatronics", "Industrial Automation", "Sensors & Actuators", "Human-Robot Interaction", "Other"],
  "Data Science": ["Data Analytics", "Machine Learning", "Deep Learning", "Data Visualization", "Statistical Modeling", "Big Data", "Predictive Analytics", "Natural Language Processing", "Computer Vision", "Other"],
  "Artificial Intelligence & Machine Learning": ["Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision", "Generative AI", "Reinforcement Learning", "AI Model Development", "AI Ethics", "Other"],
  "Environmental / Sustainability Studies": ["Sustainability", "Climate Change", "Renewable Energy", "Waste Management", "Water Management", "Environmental Monitoring", "ESG", "Sustainable Infrastructure", "Circular Economy", "Other"],
};

export const DEPARTMENT_OPTIONS = Object.keys(DEPARTMENT_EXPERTISE);

export const UNIVERSITY_EXPERTISE_OPTIONS = [
  "AI/ML",
  "IoT",
  "Data Science",
  "Robotics",
  "Cybersecurity",
  "Cloud Computing",
  "Renewable Energy",
];

export const DEFAULT_UNIVERSITY_PROFILE = {
  universityName: "XYZ Institute of Technology & Research",
  officialEmail: "contact@xyzuniv.edu.in",
  contactPerson: "Dr. Rajesh Sharma",
  contactNumber: "9876543210",
  universityType: "University",
  address: "Knowledge Campus, Main Road, Ranchi",
  district: "Ranchi",
  departments: ["Computer Science", "Electronics"],
  expertiseAreas: ["AI/ML", "IoT", "Data Science"],
  researchAreas: "Artificial Intelligence in Agriculture, Rural Smart Water Networks, Autonomous Robotics for Disaster Management",
};

/**
 * Retrieve stored University Profile for the given user, falling back to defaults.
 */
export const getUniversityProfile = (user) => {
  const userEmail = user?.email || "default_university";
  const storageKey = `solvesphere_university_profile_${userEmail.toLowerCase()}`;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading university profile:", e);
  }

  return {
    ...DEFAULT_UNIVERSITY_PROFILE,
    universityName: user?.organization || user?.name || DEFAULT_UNIVERSITY_PROFILE.universityName,
    officialEmail: user?.email || DEFAULT_UNIVERSITY_PROFILE.officialEmail,
  };
};

/**
 * Save updated University Profile to localStorage.
 */
export const saveUniversityProfile = (user, profileData) => {
  const userEmail = user?.email || profileData?.officialEmail || "default_university";
  const storageKey = `solvesphere_university_profile_${userEmail.toLowerCase()}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(profileData));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("solvesphere_university_updated"));
    return true;
  } catch (e) {
    console.error("Error saving university profile:", e);
    return false;
  }
};

/**
 * Get registered expertise areas for a university user.
 * Falls back dynamically to department-specific domains if none were selected.
 */
export const getUniversityExpertiseAreas = (user) => {
  const profile = getUniversityProfile(user);
  if (Array.isArray(profile.expertiseAreas) && profile.expertiseAreas.length > 0) {
    return profile.expertiseAreas;
  }
  if (Array.isArray(user?.expertiseAreas) && user.expertiseAreas.length > 0) {
    return user.expertiseAreas;
  }
  if (Array.isArray(user?.expertise) && user.expertise.length > 0) {
    return user.expertise;
  }

  // Fallback to department expertise if department is specified
  const dept = profile.department || (Array.isArray(profile.departments) && profile.departments[0]) || user?.department;
  if (dept && DEPARTMENT_EXPERTISE[dept]) {
    return DEPARTMENT_EXPERTISE[dept].slice(0, 5);
  }

  return ["AI/ML", "IoT", "Data Science", "Smart Cities & Infrastructure", "Water Resources Engineering"];
};

/**
 * Get government challenges assigned to a specific university based on registration & district government assignment.
 */
export const getUniversityAssignedChallenges = (user) => {
  const ASSIGNMENTS_KEY = "solvesphere_university_assignments";
  const profile = getUniversityProfile(user);
  const uniName = String(profile.universityName || user?.organization || user?.university || user?.name || user?.email || "University").trim();
  const uniKey = uniName.toLowerCase();
  const userEmail = String(user?.email || "").trim().toLowerCase();
  const district = String(profile.district || user?.district || "Ranchi").trim();
  const expertise = getUniversityExpertiseAreas(user);

  let rawAssignments = [];
  try {
    rawAssignments = JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY) || "[]");
    if (!Array.isArray(rawAssignments)) rawAssignments = [];
  } catch {
    rawAssignments = [];
  }

  // Filter assignments directly targeted to this university
  let myAssignments = rawAssignments.filter((item) => {
    const assigned = String(item?.assignedUniversity || "").trim().toLowerCase();
    return assigned && (assigned === uniKey || (userEmail && assigned === userEmail));
  });

  // If no assignments exist yet for this university, seed initial challenges matching the university's registered expertise and district!
  if (myAssignments.length === 0) {
    const isCivilOrEnv = expertise.some((e) => /civil|water|structural|environment|waste|drainage/i.test(e));
    const isCSEorIT = expertise.some((e) => /ai|ml|data|software|iot|cloud|cyber/i.test(e));
    const isElectrical = expertise.some((e) => /power|energy|electric|renewable|smart grid/i.test(e));
    const isAgriculture = expertise.some((e) => /agri|farming|irrigation|soil|food/i.test(e));

    const seeded = [];

    if (isCivilOrEnv) {
      seeded.push(
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0101`,
          assignedUniversity: uniName,
          status: "ACCEPTED",
          assignedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0101`,
            title: "Waterlogging & Drainage Failure near Main Road",
            description: "Severe water accumulation during monsoon blocking school and hospital access. District government assigned for engineering survey & drainage redesign.",
            category: "Water & Sanitation",
            location: `${district} Sector 4`,
            district,
            priority: "High",
            progress: 68,
            team: 6,
          },
        },
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0102`,
          assignedUniversity: uniName,
          status: "ACCEPTED",
          assignedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0102`,
            title: "Solid Waste Segregation & Processing Facility",
            description: "Decentralized bio-waste segregation and compost conversion model for municipal ward clusters.",
            category: "Waste Management",
            location: `${district} Urban Center`,
            district,
            priority: "Medium",
            progress: 45,
            team: 4,
          },
        },
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0103`,
          assignedUniversity: uniName,
          status: "PENDING",
          assignedAt: new Date().toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0103`,
            title: "Overpass Bridge Structural Safety & Crack Analysis",
            description: "Safety audit and non-destructive testing on concrete overpass showing vibration stress cracks.",
            category: "Infrastructure",
            location: `${district} Highway Junction`,
            district,
            priority: "Critical",
            progress: 20,
            team: 5,
          },
        }
      );
    } else if (isCSEorIT) {
      seeded.push(
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0201`,
          assignedUniversity: uniName,
          status: "ACCEPTED",
          assignedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0201`,
            title: "AI-Powered Smart Traffic Density Control",
            description: "Real-time computer vision camera model to adjust signal timing dynamically based on vehicle queue length.",
            category: "Infrastructure",
            location: `${district} Smart Traffic Corridor`,
            district,
            priority: "High",
            progress: 72,
            team: 5,
          },
        },
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0202`,
          assignedUniversity: uniName,
          status: "ACCEPTED",
          assignedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0202`,
            title: "IoT Water Quality Sensor Grid for Rural Wells",
            description: "Low-power microcontroller sensor nodes with GSM telemetry measuring turbidity and pH.",
            category: "Water & Sanitation",
            location: `${district} Rural Blocks`,
            district,
            priority: "High",
            progress: 54,
            team: 6,
          },
        },
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0203`,
          assignedUniversity: uniName,
          status: "PENDING",
          assignedAt: new Date().toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0203`,
            title: "District Healthcare Telemedicine Portal & AI Triage",
            description: "Web and mobile diagnostic triage assistant for Primary Health Centers (PHCs) in remote villages.",
            category: "Healthcare",
            location: `${district} PHC Cluster`,
            district,
            priority: "Medium",
            progress: 15,
            team: 4,
          },
        }
      );
    } else if (isAgriculture) {
      seeded.push(
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0301`,
          assignedUniversity: uniName,
          status: "ACCEPTED",
          assignedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0301`,
            title: "Smart Drip Irrigation & Soil Moisture Automation",
            description: "Automated solar-powered micro-irrigation controller preserving water in dry upland farming zones.",
            category: "Agriculture",
            location: `${district} Agri Block`,
            district,
            priority: "High",
            progress: 60,
            team: 5,
          },
        },
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0302`,
          assignedUniversity: uniName,
          status: "PENDING",
          assignedAt: new Date().toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0302`,
            title: "Post-Harvest Grain Storage Moisture & Pest Protection",
            description: "Low-cost hermetic storage silos for smallholder farmers to prevent grain spoilage.",
            category: "Agriculture",
            location: `${district} Farmer Producer Hub`,
            district,
            priority: "Medium",
            progress: 10,
            team: 4,
          },
        }
      );
    } else if (isElectrical) {
      seeded.push(
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0401`,
          assignedUniversity: uniName,
          status: "ACCEPTED",
          assignedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0401`,
            title: "Micro-Grid Solar Power for Off-Grid Village Schools",
            description: "Decentralized rooftop solar photovoltaic micro-grid design with lithium-ion storage backup.",
            category: "Clean Energy",
            location: `${district} Tribal Education Zone`,
            district,
            priority: "High",
            progress: 75,
            team: 5,
          },
        }
      );
    } else {
      seeded.push(
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0001`,
          assignedUniversity: uniName,
          status: "ACCEPTED",
          assignedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0001`,
            title: "Community Drinking Water Filtration System",
            description: "Low-cost sand and carbon filtration system for fluoride & iron contamination removal.",
            category: "Water & Sanitation",
            location: `${district} Gram Panchayat`,
            district,
            priority: "High",
            progress: 65,
            team: 5,
          },
        },
        {
          challengeId: `GOV-${district.toUpperCase().slice(0, 3)}-0002`,
          assignedUniversity: uniName,
          status: "PENDING",
          assignedAt: new Date().toISOString(),
          challenge: {
            id: `GOV-${district.toUpperCase().slice(0, 3)}-0002`,
            title: "Smart Streetlighting Network Automation",
            description: "Energy-efficient LED street light sensors with remote fault reporting.",
            category: "Infrastructure",
            location: `${district} Municipality`,
            district,
            priority: "Medium",
            progress: 25,
            team: 4,
          },
        }
      );
    }

    try {
      const updatedAll = [...rawAssignments, ...seeded];
      localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(updatedAll));
      myAssignments = seeded;
    } catch (e) {
      console.error("Failed to seed initial assignments:", e);
    }
  }

  // Format into standard challenge shape
  return myAssignments.map((item) => {
    const ch = item.challenge || {};
    const status = item.status === "ACCEPTED" ? "In Progress" : item.status === "PENDING" ? "Awaiting Response" : item.status === "COMPLETED" ? "Completed" : item.status || "In Progress";
    return {
      id: ch.id || item.challengeId,
      title: ch.title || "Assigned Civic Challenge",
      location: ch.location || ch.district || district,
      district: ch.district || district,
      category: ch.category || "Infrastructure",
      priority: ch.priority || "Medium",
      status,
      rawStatus: item.status,
      progress: ch.progress || (item.status === "ACCEPTED" ? 55 : item.status === "COMPLETED" ? 100 : 10),
      team: ch.team || 5,
      updated: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "Active",
      description: ch.description || "",
      assignedAt: item.assignedAt || new Date().toISOString(),
    };
  });
};

/**
 * Get real-time stats for the university dashboard.
 */
export const getUniversityRealStats = (user) => {
  const challenges = getUniversityAssignedChallenges(user);
  const expertise = getUniversityExpertiseAreas(user);

  const totalAssigned = challenges.length;
  const ongoingProjects = challenges.filter(
    (c) => c.rawStatus === "ACCEPTED" || c.status === "In Progress" || c.status === "Research" || c.status === "Prototype" || c.status === "Field Study"
  ).length;
  const completedProjects = challenges.filter(
    (c) => c.rawStatus === "COMPLETED" || c.status === "Completed" || c.status === "Resolved"
  ).length;
  const totalResearchAreas = expertise.length;

  return {
    totalAssigned,
    ongoingProjects,
    completedProjects,
    totalResearchAreas,
    newAssignedThisWeek: Math.max(1, challenges.filter((c) => c.rawStatus === "PENDING").length),
    newOngoingThisWeek: Math.max(1, Math.min(ongoingProjects, 2)),
    newCompletedThisMonth: Math.max(0, completedProjects),
  };
};

/**
 * Get real-time challenge distribution grouped by category based on real assigned challenges.
 */
export const getUniversityCategoryDistribution = (user, challengesList = null) => {
  const challenges = challengesList || getUniversityAssignedChallenges(user);
  const counts = {};

  challenges.forEach((ch) => {
    const cat = ch.category || "Other";
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const entries = Object.entries(counts);
  if (entries.length === 0) {
    return [
      ["Water & Sanitation", 1],
      ["Infrastructure", 1],
      ["Waste Management", 1],
    ];
  }

  return entries.sort((a, b) => b[1] - a[1]);
};

/**
 * Get real-time expertise strength distribution based on the university's registered expertise areas.
 */
export const getUniversityExpertiseDistribution = (user, challengesList = null) => {
  const expertise = getUniversityExpertiseAreas(user);
  if (!expertise || expertise.length === 0) {
    return [["AI/ML", 30], ["IoT", 25], ["Data Science", 25], ["Smart Cities", 20]];
  }

  const count = expertise.length;
  // Compute clean proportional percentages summing to 100%
  const basePct = Math.floor(100 / count);
  const remainder = 100 - (basePct * count);

  return expertise.map((exp, idx) => {
    const pct = idx === 0 ? basePct + remainder : basePct;
    return [exp, pct];
  });
};

/**
 * Notification management for University
 */
export const getUniversityNotifications = (user) => {
  const userKey = String(user?.email || "university").toLowerCase();
  const STORAGE_KEY = `solvesphere_notifications_${userKey}`;
  const challenges = getUniversityAssignedChallenges(user);

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading university notifications:", e);
  }

  // Initialize notifications from real assigned challenges
  const initial = challenges.map((ch, idx) => ({
    id: `notif-${ch.id}`,
    title: `Government Challenge: ${ch.title}`,
    message: `District authority assigned "${ch.title}" (${ch.category}) in ${ch.location} to your department.`,
    time: idx === 0 ? "10 mins ago" : idx === 1 ? "2 hours ago" : "Yesterday",
    read: idx > 1, // First 2 unread
    link: "/university-dashboard/my-projects",
    category: ch.category,
  }));

  if (initial.length === 0) {
    initial.push({
      id: "notif-welcome",
      title: "Welcome to SolveSphere University Innovation Hub",
      message: "Your university is registered. Government challenges in your district and expertise will be assigned here.",
      time: "Just now",
      read: false,
      link: "/university-dashboard/challenges",
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch {}

  return initial;
};

export const markUniversityNotificationRead = (id, user) => {
  const userKey = String(user?.email || "university").toLowerCase();
  const STORAGE_KEY = `solvesphere_notifications_${userKey}`;
  const current = getUniversityNotifications(user);
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("solvesphere_notifications_updated"));
  } catch (e) {
    console.error("Failed to mark notification read:", e);
  }
  return updated;
};

export const getUniversityPublications = (user) => {
  const userKey = String(user?.email || "university").toLowerCase();
  const STORAGE_KEY = `solvesphere_publications_${userKey}`;
  const expertise = getUniversityExpertiseAreas(user);
  const isCivilOrEnv = expertise.some((e) => /civil|water|structural|environment|waste|drainage/i.test(e));
  const isAgri = expertise.some((e) => /agri|farming|irrigation|soil|food/i.test(e));
  const isEnergy = expertise.some((e) => /power|energy|electric|renewable|solar/i.test(e));

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  // Initial publications tailored to registered expertise
  let initial = [];
  if (isCivilOrEnv) {
    initial = [
      {
        id: "PUB-01",
        title: "AI-Based Early Warning & Hydraulic Modeling for Urban Waterlogging",
        journal: "Journal of Sustainable Civil & Environmental Infrastructure",
        year: 2026,
        authors: "Dr. Ananya Sen, Prof. R. K. Mishra, Team SolveSphere",
        domain: "Water Resources & Drainage",
        status: "Published",
        doi: "https://doi.org/10.1016/j.envsoft.2026.04.012",
        abstract: "Integrated hydrodynamic runoff simulation coupled with low-power ultrasonic water level sensors for flash flood mitigation in municipal wards.",
        impact: "Validated on Ranchi Sector 4 drainage network, reducing flood response lag by 65%.",
      },
      {
        id: "PUB-02",
        title: "Automated Bio-Waste Composting with IoT Telemetry in Urban Wards",
        journal: "International Waste Management & Circular Economy Review",
        year: 2026,
        authors: "Dr. Rajesh Sharma, Priya Singh, Dept. of Environmental Engineering",
        domain: "Waste Management",
        status: "Published",
        doi: "https://doi.org/10.1016/j.wasman.2026.01.005",
        abstract: "Microcontroller-based aerobic compost monitoring tracking core temperature, moisture gradient, and odor reduction algorithms.",
        impact: "Accelerated decentralized organic composting cycle from 45 to 21 days.",
      },
      {
        id: "PUB-03",
        title: "Non-Destructive Ultrasonic Structural Vibration Analysis for Overpass Bridges",
        journal: "National Structural Engineering & Public Works Conference",
        year: 2025,
        authors: "Prof. S. K. Verma, Amit Pandey",
        domain: "Structural Engineering",
        status: "Under Review",
        doi: "https://doi.org/10.1007/s13349-025-00892",
        abstract: "Piezoelectric sensor array vibration analysis detecting micro-crack propagation under variable heavy truck loading.",
        impact: "Deployed on district highway overpass for predictive structural safety.",
      },
      {
        id: "PUB-04",
        title: "Digital Public Infrastructure for Real-Time Civic Issue Resolution",
        journal: "National Innovation & Smart Governance Symposium",
        year: 2025,
        authors: "Dr. Vikram Roy, SolveSphere Research Lab",
        domain: "Smart Cities & Civic Tech",
        status: "Published",
        doi: "https://doi.org/10.1145/3610234.3610289",
        abstract: "Decentralized verification and automated district triage architecture for citizen-reported civic infrastructure failures.",
        impact: "Adopted across 4 districts in Jharkhand for automated university research matching.",
      },
    ];
  } else if (isAgri) {
    initial = [
      {
        id: "PUB-01",
        title: "Precision Solar Drip Automation using Low-Power LoRa Sensor Grids",
        journal: "Journal of Agricultural Water Automation & Engineering",
        year: 2026,
        authors: "Dr. Arvind Patel, Rajesh Mahato, Agronomy Research Group",
        domain: "Agricultural Engineering",
        status: "Published",
        doi: "https://doi.org/10.1016/j.agwat.2026.03.011",
        abstract: "Closed-loop solar moisture telemetry activating localized solenoid valves based on evapotranspiration algorithms.",
        impact: "Saved 42% water consumption in upland vegetable farming clusters.",
      },
      {
        id: "PUB-02",
        title: "Early Pest & Leaf Blight Detection via Drone Multi-Spectral Computer Vision",
        journal: "International Precision Agriculture Forum",
        year: 2026,
        authors: "Dr. S. K. Mitra, AgriTech Student Squad",
        domain: "Smart Agriculture",
        status: "Published",
        doi: "https://doi.org/10.1007/s11119-026-09871",
        abstract: "Quantized MobileNetV3 model running on drone edge computing diagnosing paddy fungal infection 10 days before visible foliage damage.",
        impact: "Reduced crop damage by 30% across 50 smallholder trial farms in Dumka.",
      },
      {
        id: "PUB-03",
        title: "Low-Cost Hermetic Silos for Post-Harvest Grain Moisture Preservation",
        journal: "Food Processing & Post-Harvest Engineering Review",
        year: 2025,
        authors: "Prof. Anjali Verma, Nitin Hansda",
        domain: "Post-Harvest Technology",
        status: "Under Review",
        doi: "https://doi.org/10.1016/j.jfoodeng.2025.08.019",
        abstract: "Thermal insulation and oxygen-depleting storage silos protecting grain against moisture ingress and weevil infestation.",
        impact: "Prevents grain spoilage for smallholder farmer producer groups.",
      },
    ];
  } else if (isEnergy) {
    initial = [
      {
        id: "PUB-01",
        title: "Decentralized Solar Microgrid Integration with Lithium-Ion Storage for Village Schools",
        journal: "IEEE Transactions on Sustainable Energy & Smart Grids",
        year: 2026,
        authors: "Dr. Harish Murthy, Prof. V. K. Sharma",
        domain: "Clean Energy & Power Systems",
        status: "Published",
        doi: "https://doi.org/10.1109/TSTE.2026.3389012",
        abstract: "Hybrid 5kW inverter topology with cloud state-of-charge monitoring ensuring uninterrupted 24/7 educational power supply.",
        impact: "Piloted in 3 remote tribal schools in West Singhbhum.",
      },
      {
        id: "PUB-02",
        title: "Automated Fault Detection and Power Inverter Telemetry in Off-Grid Microgrids",
        journal: "Renewable & Sustainable Energy Systems Forum",
        year: 2025,
        authors: "Dr. P. K. Singh, Electrical Engineering Research Cell",
        domain: "Smart Grid Systems",
        status: "Published",
        doi: "https://doi.org/10.1016/j.renene.2025.09.041",
        abstract: "Harmonic distortion analysis and automated relay isolation under variable lightning and load surges.",
        impact: "Reduced microgrid downtime from 48 hours to under 2 hours.",
      },
    ];
  } else {
    initial = [
      {
        id: "PUB-01",
        title: "AI-Based Early Warning for Rural Water Contamination & Distribution Risks",
        journal: "Journal of Smart Governance & Public Systems",
        year: 2026,
        authors: "Dr. Anjali Verma, Prof. Rajesh Kumar",
        domain: "Artificial Intelligence & Water",
        status: "Published",
        doi: "https://doi.org/10.1016/j.smartgov.2026.04",
        abstract: "Machine learning anomaly detection algorithms measuring turbidity and chemical runoff from rural water sensor grids.",
        impact: "Alerts local water supply authorities in under 3 minutes of contamination spikes.",
      },
      {
        id: "PUB-02",
        title: "Low-Cost IoT Edge Telemetry for Real-Time Flood and Drainage Monitoring",
        journal: "International IoT & Embedded Research Forum",
        year: 2026,
        authors: "Prof. Amit Sengupta, Student Innovation Squad",
        domain: "IoT & Embedded Systems",
        status: "Published",
        doi: "https://doi.org/10.1109/JIOT.2026.319024",
        abstract: "Solar-powered ultrasonic water level sensors with GSM cellular fallback designed for rural river crossings.",
        impact: "Successfully prevented road blockages during monsoon season.",
      },
      {
        id: "PUB-03",
        title: "Community Solid Waste Segregation & Geo-AI Spatial Mapping",
        journal: "Sustainable Cities & Municipal Technology Conference",
        year: 2025,
        authors: "Dr. R. K. Roy, Priyanka Kumari",
        domain: "Waste Management & AI",
        status: "Under Review",
        doi: "https://doi.org/10.1016/j.scs.2025.10492",
        abstract: "Computer vision classification for sorting municipal dry and wet waste at community transfer points.",
        impact: "Boosts recyclable recovery rate by 38%.",
      },
      {
        id: "PUB-04",
        title: "Digital Public Infrastructure for Inclusive Rural Primary Education",
        journal: "National Innovation & Educational Technology Symposium",
        year: 2025,
        authors: "Dr. Vikram Malhotra, Education Tech Lab",
        domain: "Education & Digital Infrastructure",
        status: "Published",
        doi: "https://doi.org/10.1145/3610234",
        abstract: "Offline-first vernacular AI tutor tailored for rural students with multilingual phonetics support.",
        impact: "Deployed in 12 rural primary schools with 85% student retention.",
      },
    ];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch {}

  return initial;
};

export const saveUniversityPublications = (user, publications) => {
  const userKey = String(user?.email || "university").toLowerCase();
  const STORAGE_KEY = `solvesphere_publications_${userKey}`;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(publications));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("solvesphere_publications_updated"));
    window.dispatchEvent(new CustomEvent("solvesphere_university_updated"));
    return true;
  } catch (e) {
    console.error("Failed to save university publications:", e);
    return false;
  }
};

export const markAllUniversityNotificationsRead = (user) => {
  const userKey = String(user?.email || "university").toLowerCase();
  const STORAGE_KEY = `solvesphere_notifications_${userKey}`;
  const current = getUniversityNotifications(user);
  const updated = current.map((n) => ({ ...n, read: true }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("solvesphere_notifications_updated"));
  } catch (e) {
    console.error("Failed to mark all notifications read:", e);
  }
  return updated;
};
