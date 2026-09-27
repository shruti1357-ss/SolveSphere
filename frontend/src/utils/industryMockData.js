// Industry Mock Projects, Shared Collaboration Storage and Workspace Utilities

export const TECHNICAL_EXPERTISE_OPTIONS = [
  "Artificial Intelligence",
  "Machine Learning",
  "IoT",
  "Computer Vision",
  "Data Analytics",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "Robotics",
  "Sensors & Embedded Systems",
  "Renewable Energy",
];

export const AREAS_OF_INTEREST_OPTIONS = [
  "Agriculture",
  "Healthcare",
  "Education",
  "Smart City",
  "Environment",
  "Rural Development",
  "Water & Sanitation",
  "Transportation",
];

export const DEFAULT_COMPANY_PROFILE = {
  companyName: "ABC Technologies Pvt. Ltd.",
  contactPerson: "Rahul Kumar",
  phone: "9876543210",
  companyType: "Startup",
  industryDomain: "IT",
  companyDescription:
    "Leading enterprise AI, IoT, and Computer Vision solution provider specializing in public infrastructure, smart agriculture, and rural development.",
  servicesOffered:
    "Mentorship, Funding, Prototype Development, Testing, Deployment",
  technicalExpertise: [
    "Artificial Intelligence",
    "Machine Learning",
    "IoT",
    "Computer Vision",
    "Data Analytics",
  ],
  areasOfInterest: ["Agriculture", "Smart City", "Healthcare"],
  companyWebsite: "https://www.abctech.com",
};

export const MOCK_PROJECTS = [
  {
    id: "CH-1024",
    title: "Crop Disease Detection System",
    problemStatement:
      "Early pest and fungal infection detection in paddy crops using drone imaging and localized AI analysis to reduce crop loss for smallholder farmers.",
    domain: "Agriculture",
    location: "Dumka, Jharkhand",
    district: "Dumka",
    university: "XYZ University",
    facultyMentor: "Dr. Rajesh Kumar Sharma (Dept. of Agronomy)",
    studentTeam: "AgriTech Squad (4 members)",
    currentStage: "Prototype Development",
    progressPercentage: 45,
    requiredExpertise: ["Artificial Intelligence", "Computer Vision", "Machine Learning"],
    currentRequirements:
      "High-resolution multispectral image datasets, edge computing device testing, and field validation.",
    expectedOutcome:
      "92%+ accurate mobile app and low-cost drone camera module detecting crop diseases 10 days before visible foliage damage.",
  },
  {
    id: "PROJ-103",
    title: "AI-Powered Traffic Congestion & Emergency Passage System",
    problemStatement:
      "Adaptive traffic light control algorithm using real-time computer vision streams to create green corridors for ambulances and fire trucks.",
    domain: "Smart City",
    location: "Dhanbad, Jharkhand",
    district: "Dhanbad",
    university: "IIT (ISM) Dhanbad",
    facultyMentor: "Prof. S. K. Mitra (Dept. of Computer Science)",
    studentTeam: "VisionGrid Labs (5 members)",
    currentStage: "Algorithm Optimization",
    progressPercentage: 72,
    requiredExpertise: ["Artificial Intelligence", "Computer Vision", "Cloud Computing"],
    currentRequirements:
      "GPU cloud instances for parallel video stream processing and traffic camera API access.",
    expectedOutcome:
      "35% reduction in emergency vehicle travel times across busy urban intersections.",
  },
  {
    id: "PROJ-104",
    title: "Tele-Health Diagnostic Kit for Tribal Clinics",
    problemStatement:
      "Portable diagnostic suitcase equipped with vital sensors and offline AI screening for early cardiac and respiratory disease detection in remote health centers.",
    domain: "Healthcare",
    location: "Chaibasa, Jharkhand",
    district: "West Singhbhum",
    university: "XYZ University",
    facultyMentor: "Dr. Meera Verma (Dept. of Bio-Medical Sciences)",
    studentTeam: "MedPulse Health (4 members)",
    currentStage: "Field Testing",
    progressPercentage: 85,
    requiredExpertise: ["Machine Learning", "IoT", "Sensors & Embedded Systems"],
    currentRequirements:
      "Medical regulatory advice, sensor miniaturization support, and pilot testing sponsorship.",
    expectedOutcome:
      "Low-cost clinical diagnostic kit operable by Accredited Social Health Activists (ASHA workers) without continuous internet.",
  },
  {
    id: "PROJ-102",
    title: "Smart Water Quality & Heavy Metal Telemetry Network",
    problemStatement:
      "Real-time monitoring of heavy metal levels, turbidity, and chemical runoff in rural water reservoirs using low-cost sensor nodes.",
    domain: "Water & Sanitation",
    location: "Jamshedpur, Jharkhand",
    district: "East Singhbhum",
    university: "NIT Jamshedpur",
    facultyMentor: "Dr. Ananya Sen (Dept. of Environmental Engineering)",
    studentTeam: "AquaClean Innovators (3 members)",
    currentStage: "Testing & Validation",
    progressPercentage: 80,
    requiredExpertise: ["IoT", "Data Analytics", "Sensors & Embedded Systems"],
    currentRequirements:
      "Industrial sensor calibration support, cellular telemetry modules, and cloud storage credits.",
    expectedOutcome:
      "Solar-powered river sensor buoys pushing automated contamination alerts to municipal water supply authorities.",
  },
  {
    id: "PROJ-106",
    title: "Interactive Vernacular AI Tutor for Rural Primary Schools",
    problemStatement:
      "Voice-first tablet application teaching foundational literacy and numeracy in regional languages using interactive storytelling and speech recognition.",
    domain: "Education",
    location: "Dumka, Jharkhand",
    district: "Dumka",
    university: "XYZ University",
    facultyMentor: "Prof. Priya Nath (Dept. of Educational Technology)",
    studentTeam: "EdVidyut Team (4 members)",
    currentStage: "Pilot Deployment",
    progressPercentage: 60,
    requiredExpertise: ["Artificial Intelligence", "Data Analytics"],
    currentRequirements:
      "Local speech dataset annotation, low-cost tablet devices for classroom trials.",
    expectedOutcome:
      "2x improvement in reading comprehension metrics for rural 1st to 3rd grade students.",
  },
  {
    id: "PROJ-107",
    title: "Automated Municipal Solid Waste Sorting Bio-Robotics",
    problemStatement:
      "High-speed conveyor optical sorting mechanism utilizing computer vision and robotic pickers for recyclable plastics and wet biomass.",
    domain: "Smart City",
    location: "Ranchi, Jharkhand",
    district: "Ranchi",
    university: "BIT Mesra",
    facultyMentor: "Dr. Sanjay Bhattacharya (Dept. of Mechanical Engineering)",
    studentTeam: "RoboClean Innovators (4 members)",
    currentStage: "Testing & Validation",
    progressPercentage: 70,
    requiredExpertise: ["Robotics", "Computer Vision", "Sensors & Embedded Systems"],
    currentRequirements:
      "Industrial robotic arm components and live pilot plant testing access.",
    expectedOutcome:
      "80% reduction in manual hazardous waste handling at district sorting centers.",
  },
  {
    id: "PROJ-105",
    title: "Solar Micro-Grid Load Balancer with Decentralized Billing",
    problemStatement:
      "Decentralized peer-to-peer energy sharing network allowing rural households with rooftop solar panels to trade surplus power securely.",
    domain: "Environment",
    location: "Hazaribagh, Jharkhand",
    district: "Hazaribagh",
    university: "Vinoba Bhave University",
    facultyMentor: "Dr. Alok Prasad (Dept. of Electrical Engineering)",
    studentTeam: "SolarLedger (3 members)",
    currentStage: "Proof of Concept",
    progressPercentage: 50,
    requiredExpertise: ["Blockchain", "Renewable Energy", "IoT"],
    currentRequirements:
      "Smart meter hardware prototypes and blockchain smart contract auditing.",
    expectedOutcome:
      "Self-sustaining micro-grid system reducing village diesel generator dependence by 90%.",
  },
];

// Dynamic AI match calculation algorithm with guaranteed distinct spread
export const calculateProjectMatch = (project, companyProfile) => {
  if (!project) return 85;

  const baseProjectScores = {
    "CH-1024": 95,
    "PROJ-103": 91,
    "PROJ-104": 87,
    "PROJ-107": 83,
    "PROJ-102": 79,
    "PROJ-106": 74,
    "PROJ-105": 66,
  };

  const id = String(project.id || "").trim();
  let baseScore = baseProjectScores[id];
  if (!baseScore) {
    const sum = id.split("").reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
    baseScore = 70 + (sum % 20); // 70 to 89
  }

  const userTech = Array.isArray(companyProfile?.technicalExpertise)
    ? companyProfile.technicalExpertise.map((t) => String(t).toLowerCase().trim())
    : [];
  const userInterests = Array.isArray(companyProfile?.areasOfInterest)
    ? companyProfile.areasOfInterest.map((a) => String(a).toLowerCase().trim())
    : [];

  const projDomain = String(project.domain || "").toLowerCase().trim();
  const domainBoost = userInterests.some((a) => a.includes(projDomain) || projDomain.includes(a)) ? 2 : 0;

  const reqTech = Array.isArray(project.requiredExpertise)
    ? project.requiredExpertise.map((t) => String(t).toLowerCase().trim())
    : [];
  let techMatches = 0;
  reqTech.forEach((req) => {
    if (
      userTech.some(
        (ut) =>
          ut.includes(req) ||
          req.includes(ut) ||
          (ut.includes("ai") && req.includes("ai")) ||
          (ut.includes("ml") && req.includes("ml")) ||
          (ut.includes("vision") && req.includes("vision")) ||
          (ut.includes("iot") && req.includes("iot"))
      )
    ) {
      techMatches += 1;
    }
  });

  const techBoost = techMatches > 0 ? Math.min(techMatches, 2) : 0;

  const finalScore = baseScore + domainBoost + techBoost;
  return Math.min(Math.max(finalScore, 62), 98);
};

// Storage helper functions for Company Profile
export const getCompanyProfile = (user) => {
  const userEmail = user?.email || "default_industry";
  const storageKey = `solvesphere_industry_profile_${userEmail.toLowerCase()}`;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading company profile:", e);
  }
  return {
    ...DEFAULT_COMPANY_PROFILE,
    companyName: user?.organization || user?.name || DEFAULT_COMPANY_PROFILE.companyName,
    email: user?.email || DEFAULT_COMPANY_PROFILE.email,
  };
};

export const saveCompanyProfile = (user, profileData) => {
  const userEmail = user?.email || "default_industry";
  const storageKey = `solvesphere_industry_profile_${userEmail.toLowerCase()}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(profileData));
    return true;
  } catch (e) {
    console.error("Error saving company profile:", e);
    return false;
  }
};

// Shared Collaboration Registry Key (accessible by both Industry and University)
const SHARED_COLLABORATIONS_KEY = "solvesphere_collaboration_requests";

export const MOCK_INITIAL_COLLABORATIONS = [
  {
    id: "COL-901",
    projectId: "CH-1024",
    projectName: "Crop Disease Detection System",
    university: "XYZ University",
    district: "Dumka",
    domain: "Agriculture",
    currentStage: "Prototype Development",
    progressPercentage: 45,
    companyName: "ABC Technologies Pvt. Ltd.",
    contactPerson: "Rahul Kumar",
    companyEmail: "contact@abctech.com",
    companyType: "Startup",
    industryDomain: "IT",
    companyWebsite: "https://www.abctech.com",
    expertiseAreas: ["AI/ML", "Computer Vision", "Agriculture Technology"],
    servicesOffered: ["Technical Mentorship", "Funding", "Prototype Development"],
    collaborationTypes: ["Technical Mentorship", "Prototype Development", "Testing", "Funding"],
    collaborationType: "Technical Mentorship & Funding",
    requestDate: "01 Sep 2026",
    status: "PENDING", // PENDING, ACCEPTED, REJECTED, ACTIVE, COMPLETED
    message: "We would like to offer technical mentorship from our senior Computer Vision engineers and cloud compute sponsorship for prototype development.",
  },
  {
    id: "COL-902",
    projectId: "PROJ-104",
    projectName: "Tele-Health Diagnostic Kit for Tribal Clinics",
    university: "XYZ University",
    district: "Chaibasa",
    domain: "Healthcare",
    currentStage: "Field Testing",
    progressPercentage: 85,
    companyName: "MedTech Innovations Enterprise",
    contactPerson: "Dr. Anjali Gupta",
    companyEmail: "anjali@medtechinnovations.com",
    companyType: "Enterprise",
    industryDomain: "Healthcare",
    companyWebsite: "https://www.medtechinnovations.com",
    expertiseAreas: ["Machine Learning", "IoT", "Healthcare Technology"],
    servicesOffered: ["Field Testing", "Deployment", "Mentorship"],
    collaborationTypes: ["Field Testing", "Deployment"],
    collaborationType: "Field Testing & Deployment",
    requestDate: "28 Aug 2026",
    status: "ACTIVE",
    message: "Providing clinical testing sensors and pilot deployment support in district health sub-centers.",
  },
  {
    id: "COL-903",
    projectId: "PROJ-106",
    projectName: "Interactive Vernacular AI Tutor for Rural Primary Schools",
    university: "XYZ University",
    district: "Dumka",
    domain: "Education",
    currentStage: "Pilot Deployment",
    progressPercentage: 60,
    companyName: "EdTech Samarth Systems",
    contactPerson: "Vikram Malhotra",
    companyEmail: "vikram@edtechsamarth.com",
    companyType: "SME",
    industryDomain: "Education",
    companyWebsite: "https://www.edtechsamarth.com",
    expertiseAreas: ["Artificial Intelligence", "Data Analytics"],
    servicesOffered: ["Dataset Support", "Testing"],
    collaborationTypes: ["Dataset Support"],
    collaborationType: "Dataset Support",
    requestDate: "20 Aug 2026",
    status: "COMPLETED",
    message: "Provided vernacular speech audio dataset and student testing hardware.",
  },
];

export const getUniversityCollaborations = (user) => {
  const userKey = String(user?.email || user?.organization || user?.name || "university").toLowerCase().trim();
  const STORAGE_KEY = `solvesphere_collaborations_${userKey}`;
  const sharedKey = SHARED_COLLABORATIONS_KEY;

  let existing = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(sharedKey);
    if (saved) {
      existing = JSON.parse(saved);
      if (!Array.isArray(existing)) existing = [];
    }
  } catch (e) {
    existing = [];
  }

  // Load university profile and assigned challenges
  let uniProfile = {};
  let assignedChallenges = [];
  try {
    const profileSaved = localStorage.getItem(`solvesphere_university_profile_${userKey}`);
    if (profileSaved) uniProfile = JSON.parse(profileSaved);
  } catch {}

  const uniName = uniProfile.universityName || user?.organization || user?.name || "XYZ University";
  const uniDistrict = uniProfile.district || user?.district || "Ranchi";

  // Check stored assignments
  try {
    const assignmentsSaved = localStorage.getItem("solvesphere_university_assignments");
    if (assignmentsSaved) {
      const allAssigned = JSON.parse(assignmentsSaved);
      if (Array.isArray(allAssigned)) {
        assignedChallenges = allAssigned
          .filter((item) => {
            const assigned = String(item?.assignedUniversity || "").trim().toLowerCase();
            return assigned === uniName.toLowerCase() || assigned === userKey;
          })
          .map((item) => ({
            id: item.challengeId || item.challenge?.id,
            title: item.challenge?.title || "Assigned Civic Challenge",
            category: item.challenge?.category || "Infrastructure",
            district: item.challenge?.district || uniDistrict,
            progress: item.challenge?.progress || (item.status === "ACCEPTED" ? 60 : 30),
            status: item.status || "In Progress",
          }));
      }
    }
  } catch {}

  // Capable industry partner templates based on project domain
  const getCapablePartner = (ch, idx) => {
    const cat = (ch.category || "").toLowerCase();
    const title = (ch.title || "").toLowerCase();

    if (/water|drain|sanitation|river/i.test(cat) || /water|drain/i.test(title)) {
      return {
        id: `COL-${ch.id || `WTR-${idx + 1}`}-IND`,
        companyName: "Tata Steel Infrastructure & Utilities (TSUISL)",
        companyType: "Enterprise Leader",
        contactPerson: "Dr. Vikramaditya Sen (Chief Technology Officer)",
        companyEmail: "innovations@tsuisl.com",
        industryDomain: "Civil & Urban Infrastructure",
        companyWebsite: "https://www.tatasteelutilities.com",
        capabilityDescription:
          "Proven enterprise track record operating urban stormwater networks, high-capacity drainage systems, and real-time municipal hydraulic telemetry in Jharkhand.",
        expertiseAreas: ["Civil Engineering", "Stormwater Drainage", "IoT Level Sensors", "GIS Topography Mapping"],
        servicesOffered: ["Technical Mentorship", "Prototype Co-Development", "Field Testing", "CSR Funding"],
        collaborationTypes: ["Technical Mentorship", "Prototype Development", "Field Testing", "Funding"],
        fundingOffered: "₹5,50,000 Co-Development Grant",
        status: idx === 1 ? "ACTIVE" : "PENDING",
        message: `We observed ${uniName}'s work on "${ch.title}". Our urban infrastructure engineering division would like to co-develop the drainage simulation model, grant access to municipal GIS feeds, and provide ₹5.5L in hardware sponsorship.`,
      };
    }

    if (/waste|environment|recycling/i.test(cat) || /waste|garbage/i.test(title)) {
      return {
        id: `COL-${ch.id || `WST-${idx + 1}`}-IND`,
        companyName: "Jamshedpur Waste Management Solutions Pvt. Ltd.",
        companyType: "Industry Partner",
        contactPerson: "Sanjay Singhal (VP, R&D)",
        companyEmail: "partnerships@jwmsolutions.com",
        industryDomain: "Environmental Engineering",
        companyWebsite: "https://www.jwmsolutions.com",
        capabilityDescription:
          "Specialized in mechanized waste sorting, organic composting bio-reactors, and circular resource recovery plants across industrial clusters.",
        expertiseAreas: ["Waste Processing", "Bio-reactor Automation", "Environmental Monitoring"],
        servicesOffered: ["Prototype Testing", "Field Testing", "Deployment Support", "Funding"],
        collaborationTypes: ["Prototype Development", "Field Testing", "Deployment"],
        fundingOffered: "₹4,20,000 Pilot Testing Grant",
        status: "PENDING",
        message: `Our environmental engineering lab would like to provide live pilot testing facilities at our urban waste processing plant and fund sensor calibration hardware for "${ch.title}".`,
      };
    }

    if (/traffic|transport|smart city|software|ai|computer|iot/i.test(cat) || /traffic|light|ai|smart/i.test(title)) {
      return {
        id: `COL-${ch.id || `CSE-${idx + 1}`}-IND`,
        companyName: "Infosys Smart Mobility & Connected Infrastructure Lab",
        companyType: "Enterprise Tech Partner",
        contactPerson: "Pooja Deshmukh (Lead AI Architect)",
        companyEmail: "ai.mobility@infosys.com",
        industryDomain: "Artificial Intelligence & Smart Cities",
        companyWebsite: "https://www.infosys.com/smart-cities",
        capabilityDescription:
          "Extensive R&D expertise in edge computer vision, dynamic traffic signal controllers, neural network quantization, and cloud smart-city orchestration.",
        expertiseAreas: ["Computer Vision", "Edge AI", "IoT Telemetry", "Cloud Computing"],
        servicesOffered: ["AI Mentorship", "Cloud GPU Compute", "Prototype Co-Development", "Testing"],
        collaborationTypes: ["Technical Mentorship", "Cloud Compute Credits", "Prototype Development"],
        fundingOffered: "₹7,50,000 Cloud Compute & Hardware Grant",
        status: idx === 0 ? "PENDING" : "ACTIVE",
        message: `We would like to collaborate with ${uniName} on "${ch.title}". We offer direct technical mentorship from our senior Computer Vision team, enterprise GPU compute credits, and deployment support.`,
      };
    }

    if (/agri|farm|irrigation|crop/i.test(cat) || /agri|crop|irrigation/i.test(title)) {
      return {
        id: `COL-${ch.id || `AGR-${idx + 1}`}-IND`,
        companyName: "Mahindra Agri-Solutions & Precision Robotics",
        companyType: "Enterprise Partner",
        contactPerson: "Dr. Arvind Patel (Director of Precision Agri)",
        companyEmail: "precision.agri@mahindra.com",
        industryDomain: "AgriTech & Automation",
        companyWebsite: "https://www.mahindraagri.com",
        capabilityDescription:
          "Equipping over 15,000 farmers with precision micro-irrigation hardware, solar soil moisture sensor grids, and crop disease drone diagnostics.",
        expertiseAreas: ["Precision Agriculture", "Soil Sensors", "Solar Valves", "IoT Telemetry"],
        servicesOffered: ["Hardware Kits", "Field Testing on 50 Farms", "Funding", "Technical Mentorship"],
        collaborationTypes: ["Technical Mentorship", "Field Testing", "Funding", "Deployment"],
        fundingOffered: "₹6,00,000 Farm Pilot Sponsorship",
        status: "PENDING",
        message: `We propose supplying solar valve controller hardware, soil sensor grids, and field trial access across 50 smallholder farm blocks to support "${ch.title}".`,
      };
    }

    if (/energy|solar|electric|power/i.test(cat) || /solar|power|grid/i.test(title)) {
      return {
        id: `COL-${ch.id || `ENG-${idx + 1}`}-IND`,
        companyName: "Tata Power Solar & Microgrid Systems",
        companyType: "Clean Energy Enterprise",
        contactPerson: "Harish Murthy (VP, Microgrid Projects)",
        companyEmail: "microgrids@tatapower.com",
        industryDomain: "Renewable Energy & Power Systems",
        companyWebsite: "https://www.tatapowersolar.com",
        capabilityDescription:
          "Operating 300+ off-grid solar micro-grids with battery energy storage systems (BESS), smart inverters, and automated load balancing.",
        expertiseAreas: ["Solar Photovoltaics", "Battery Storage (BESS)", "Power Electronics", "Smart Grid"],
        servicesOffered: ["Hardware Grant", "Lab Testing", "Deployment Channel", "Funding"],
        collaborationTypes: ["Hardware Grant", "Technical Mentorship", "Field Testing"],
        fundingOffered: "₹8,00,000 Microgrid Hardware Grant",
        status: "PENDING",
        message: `We offer hybrid 5kW solar inverters, lithium battery test units, and field commissioning mentorship for "${ch.title}".`,
      };
    }

    // Default High-Capability Infrastructure Partner
    return {
      id: `COL-${ch.id || `GEN-${idx + 1}`}-IND`,
      companyName: "L&T Engineering & Smart Infrastructure Solutions",
      companyType: "Enterprise Leader",
      contactPerson: "Rajeshwar Rao (Chief Project Engineer)",
      companyEmail: "smartinfra@larsentoubro.com",
      industryDomain: "Infrastructure & Civil Tech",
      companyWebsite: "https://www.larsentoubro.com",
      capabilityDescription:
        "India's leading engineering conglomerate with deep technical expertise in public infrastructure engineering, quality audit, and civic technology.",
      expertiseAreas: ["Structural Engineering", "IoT Sensor Networks", "Infrastructure Co-Development"],
      servicesOffered: ["Technical Mentorship", "Prototype Development", "Field Testing", "Funding"],
      collaborationTypes: ["Technical Mentorship", "Prototype Development", "Testing"],
      fundingOffered: "₹5,00,000 Engineering Grant",
      status: "PENDING",
      message: `We would like to partner with ${uniName} on "${ch.title}" to provide industrial engineering validation, equipment support, and testing assistance.`,
    };
  };

  // If no assignments found, use standard seeded challenges
  const activeChallenges = assignedChallenges.length > 0 ? assignedChallenges : [
    {
      id: `GOV-${uniDistrict.toUpperCase().slice(0, 3)}-0101`,
      title: "Waterlogging & Drainage Failure near Main Road",
      category: "Water & Sanitation",
      district: uniDistrict,
      progress: 68,
      status: "In Progress",
    },
    {
      id: `GOV-${uniDistrict.toUpperCase().slice(0, 3)}-0102`,
      title: "Solid Waste Segregation & Processing Facility",
      category: "Waste Management",
      district: uniDistrict,
      progress: 45,
      status: "In Progress",
    },
    {
      id: `GOV-${uniDistrict.toUpperCase().slice(0, 3)}-0103`,
      title: "AI-Powered Smart Traffic Density Control",
      category: "Infrastructure",
      district: uniDistrict,
      progress: 72,
      status: "In Progress",
    },
  ];

  // Match existing status if already modified by user
  const generated = activeChallenges.map((ch, idx) => {
    const partner = getCapablePartner(ch, idx);
    const existingReq = existing.find((item) => String(item.id) === String(partner.id) || item.projectId === ch.id);

    return {
      id: partner.id,
      projectId: ch.id,
      projectName: ch.title,
      university: uniName,
      district: ch.district || uniDistrict,
      domain: ch.category,
      currentStage: ch.progress > 60 ? "Prototype Development" : "Requirement Analysis & Research",
      progressPercentage: ch.progress,
      companyName: partner.companyName,
      companyType: partner.companyType,
      contactPerson: partner.contactPerson,
      companyEmail: partner.companyEmail,
      industryDomain: partner.industryDomain,
      companyWebsite: partner.companyWebsite,
      capabilityDescription: partner.capabilityDescription,
      expertiseAreas: partner.expertiseAreas,
      servicesOffered: partner.servicesOffered,
      collaborationTypes: partner.collaborationTypes,
      collaborationType: partner.collaborationTypes.join(", "),
      fundingOffered: partner.fundingOffered,
      requestDate: existingReq?.requestDate || "Recent",
      status: existingReq?.status || partner.status,
      message: partner.message,
    };
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(generated));
    localStorage.setItem(sharedKey, JSON.stringify(generated));
  } catch {}

  return generated;
};

export const getAllCollaborations = (user) => {
  return getUniversityCollaborations(user);
};

export const getCollaborations = (user) => {
  return getUniversityCollaborations(user);
};

export const getCollaborationById = (id) => {
  const all = getAllCollaborations();
  return all.find((item) => String(item.id) === String(id)) || all[0];
};

export const addCollaborationRequest = (user, requestData) => {
  const companyProfile = getCompanyProfile(user);
  const userKey = String(user?.email || user?.organization || user?.name || "industry").toLowerCase().trim();
  const userStorageKey = `solvesphere_collaborations_${userKey}`;
  const sharedKey = SHARED_COLLABORATIONS_KEY;

  let existing = [];
  try {
    const saved = localStorage.getItem(sharedKey) || localStorage.getItem(userStorageKey);
    if (saved) {
      existing = JSON.parse(saved);
      if (!Array.isArray(existing)) existing = [];
    }
  } catch (e) {
    existing = [];
  }

  const newRequest = {
    id: `COL-${Math.floor(1000 + Math.random() * 9000)}`,
    projectId: requestData.projectId,
    projectName: requestData.projectName,
    university: requestData.university || "XYZ University",
    district: requestData.district || "District Area",
    domain: requestData.domain || "Technology",
    currentStage: requestData.currentStage || "Prototype Development",
    progressPercentage: requestData.progressPercentage || 45,
    companyName: companyProfile.companyName || user?.organization || user?.name || "ABC Technologies Pvt. Ltd.",
    contactPerson: companyProfile.contactPerson || user?.name || "Industry Lead",
    companyEmail: companyProfile.email || user?.email || "contact@industry.com",
    companyType: companyProfile.companyType || "Enterprise",
    industryDomain: companyProfile.industryDomain || "IT",
    companyWebsite: companyProfile.companyWebsite || "https://www.company.com",
    expertiseAreas: companyProfile.technicalExpertise || ["AI/ML", "IoT"],
    servicesOffered: Array.isArray(companyProfile.servicesOffered) ? companyProfile.servicesOffered : [companyProfile.servicesOffered],
    collaborationTypes: requestData.collaborationTypes || [requestData.collaborationType || "Technical Mentorship"],
    collaborationType: Array.isArray(requestData.collaborationTypes)
      ? requestData.collaborationTypes.join(", ")
      : requestData.collaborationType || "Technical Mentorship",
    requestDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: "PENDING",
    message: requestData.message || "We would like to offer technical mentorship and development support for this initiative.",
  };

  const updated = [newRequest, ...existing.filter((item) => item.id !== newRequest.id)];
  try {
    localStorage.setItem(sharedKey, JSON.stringify(updated));
    localStorage.setItem(userStorageKey, JSON.stringify(updated));
    localStorage.setItem("solvesphere_collaborations", JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving collaboration request:", e);
  }

  try {
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("solvesphere_collaborations_updated"));
    window.dispatchEvent(new Event("solvesphere_university_updated"));
  } catch {}

  return newRequest;
};

export const updateCollaborationStatus = (id, newStatus, user = null) => {
  const userKey = String(user?.email || user?.organization || user?.name || "university").toLowerCase().trim();
  const userStorageKey = `solvesphere_collaborations_${userKey}`;
  const sharedKey = SHARED_COLLABORATIONS_KEY;

  let all = [];
  try {
    const saved = localStorage.getItem(userStorageKey) || localStorage.getItem(sharedKey);
    if (saved) {
      all = JSON.parse(saved);
      if (!Array.isArray(all)) all = [];
    }
  } catch (e) {
    all = [];
  }

  const updated = all.map((item) =>
    String(item.id) === String(id) || String(item.projectId) === String(id)
      ? { ...item, status: newStatus }
      : item
  );

  try {
    localStorage.setItem(userStorageKey, JSON.stringify(updated));
    localStorage.setItem(sharedKey, JSON.stringify(updated));
  } catch (e) {
    console.error("Error updating collaboration status:", e);
  }

  // Also update any other generic collaboration keys in localStorage
  try {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("solvesphere_collaborations_")) {
        try {
          const arr = JSON.parse(localStorage.getItem(k) || "[]");
          if (Array.isArray(arr) && arr.some((item) => String(item.id) === String(id) || String(item.projectId) === String(id))) {
            const mapped = arr.map((item) =>
              String(item.id) === String(id) || String(item.projectId) === String(id)
                ? { ...item, status: newStatus }
                : item
            );
            localStorage.setItem(k, JSON.stringify(mapped));
          }
        } catch {}
      }
    });
  } catch {}

  try {
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("solvesphere_collaborations_updated"));
    window.dispatchEvent(new CustomEvent("solvesphere_university_updated"));
  } catch {}

  return updated;
};

// Workspace Messages & Tasks Storage
export const getWorkspaceMessages = (collaborationId) => {
  const storageKey = `solvesphere_workspace_messages_${collaborationId}`;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  return [
    {
      id: "m1",
      sender: "University Team (XYZ Univ)",
      role: "University",
      text: "We have completed the initial prototype build and deployed baseline models on edge devices.",
      timestamp: "10:30 AM",
    },
    {
      id: "m2",
      sender: "Rahul Kumar (ABC Tech)",
      role: "Industry Partner",
      text: "Great progress! We recommend testing model accuracy under varying light and humidity conditions. We can provide high-res field datasets.",
      timestamp: "11:15 AM",
    },
  ];
};

export const addWorkspaceMessage = (collaborationId, sender, text, role = "Industry") => {
  const storageKey = `solvesphere_workspace_messages_${collaborationId}`;
  const existing = getWorkspaceMessages(collaborationId);
  const newMessage = {
    id: `m_${Date.now()}`,
    sender,
    role,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
  const updated = [...existing, newMessage];
  try {
    localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch (e) {}
  return updated;
};

export const getWorkspaceTasks = (collaborationId) => {
  const storageKey = `solvesphere_workspace_tasks_${collaborationId}`;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  return [
    { id: "t1", title: "Initial Project Review & Goal Alignment", completed: true },
    { id: "t2", title: "AI Model Optimization & Quantization", completed: true },
    { id: "t3", title: "Prototype Edge Hardware Integration", completed: false },
    { id: "t4", title: "Field Testing in Selected Agricultural Zones", completed: false },
    { id: "t5", title: "Final Evaluation & Deployment Report", completed: false },
  ];
};

export const toggleWorkspaceTask = (collaborationId, taskId) => {
  const storageKey = `solvesphere_workspace_tasks_${collaborationId}`;
  const existing = getWorkspaceTasks(collaborationId);
  const updated = existing.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  try {
    localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch (e) {}
  return updated;
};
