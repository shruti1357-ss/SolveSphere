// Problem Lifecycle & Real-Time Sync Utility
// Handles Citizen Problem -> Government Scrutiny/Approval -> University Expertise Assignment -> Workspace Progress -> Citizen Real-Time Tracking

export const UNIVERSITY_EXPERTISE_MAP = [
  {
    name: "Ranchi University",
    district: "Ranchi",
    departments: [
      "Department of Environmental Sciences & Water Resources",
      "Department of Zoology & Biotechnology",
      "Department of Botany & Agricultural Flora",
    ],
    matchingCategories: ["Water & Sanitation", "Water Management", "Environment", "Waste Management", "Agriculture"],
    matchScore: 96,
  },
  {
    name: "NIT Jamshedpur",
    district: "East Singhbhum",
    departments: [
      "Department of Civil Engineering (Hydraulics & Water Networks)",
      "Department of Electrical Engineering",
      "Department of Computer Science & Engineering",
    ],
    matchingCategories: ["Infrastructure", "Water & Sanitation", "Water Management", "Public Safety"],
    matchScore: 94,
  },
  {
    name: "BIT Mesra, Ranchi",
    district: "Ranchi",
    departments: [
      "Department of Civil & Environmental Engineering",
      "Department of Remote Sensing & Geoinformatics",
      "Department of Bio-Engineering",
    ],
    matchingCategories: ["Environment", "Healthcare", "Infrastructure", "Public Safety"],
    matchScore: 92,
  },
  {
    name: "IIT (ISM) Dhanbad",
    district: "Dhanbad",
    departments: [
      "Department of Environmental Science & Engineering",
      "Department of Mining & Geo-Hydrology",
      "Department of Applied Chemistry",
    ],
    matchingCategories: ["Environment", "Water Management", "Infrastructure", "Clean Energy"],
    matchScore: 90,
  },
  {
    name: "IIIT Ranchi",
    district: "Ranchi",
    departments: [
      "Department of Computer Science & Data Analytics",
      "Centre for AI in Smart Governance & Tele-health",
    ],
    matchingCategories: ["Healthcare", "Education", "Smart Education", "Public Safety"],
    matchScore: 88,
  },
  {
    name: "Birsa Agricultural University (BAU) Ranchi",
    district: "Ranchi",
    departments: [
      "Faculty of Agriculture & Soil Conservation",
      "Department of Irrigation & Water Harvesting",
    ],
    matchingCategories: ["Agriculture", "Water Management", "Environment"],
    matchScore: 95,
  },
  {
    name: "Central University of Jharkhand",
    district: "Ranchi",
    departments: [
      "Centre for Water Engineering and Management",
      "Department of Energy Engineering",
    ],
    matchingCategories: ["Water Management", "Water & Sanitation", "Clean Energy", "Environment"],
    matchScore: 89,
  },
  {
    name: "Kolhan University",
    district: "West Singhbhum",
    departments: [
      "Department of Life Sciences & Public Health",
      "Department of Chemistry & Water Quality",
    ],
    matchingCategories: ["Healthcare", "Water & Sanitation"],
    matchScore: 85,
  },
];

export const getRecommendedUniversities = (category = "", district = "") => {
  const normCat = String(category).toLowerCase();
  const normDist = String(district).toLowerCase();

  return [...UNIVERSITY_EXPERTISE_MAP].sort((a, b) => {
    const aCatMatch = a.matchingCategories.some((c) => normCat.includes(c.toLowerCase()) || c.toLowerCase().includes(normCat));
    const bCatMatch = b.matchingCategories.some((c) => normCat.includes(c.toLowerCase()) || c.toLowerCase().includes(normCat));
    const aDistMatch = normDist && a.district.toLowerCase() === normDist;
    const bDistMatch = normDist && b.district.toLowerCase() === normDist;

    let scoreA = a.matchScore + (aCatMatch ? 15 : 0) + (aDistMatch ? 10 : 0);
    let scoreB = b.matchScore + (bCatMatch ? 15 : 0) + (bDistMatch ? 10 : 0);

    return scoreB - scoreA;
  });
};

// Update and persist problem lifecycle state across local and global stores
export const updateProblemLifecycle = (problemId, updates = {}) => {
  if (!problemId) return null;

  let allProblems = [];
  try {
    const saved = localStorage.getItem("solvesphere_problems");
    if (saved) {
      allProblems = JSON.parse(saved);
    }
  } catch {}

  let found = false;
  const updatedProblems = allProblems.map((p) => {
    if (String(p.id) === String(problemId)) {
      found = true;
      return {
        ...p,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    return p;
  });

  if (!found && updates.title) {
    updatedProblems.unshift({
      id: problemId,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  try {
    localStorage.setItem("solvesphere_problems", JSON.stringify(updatedProblems));
  } catch {}

  // Also sync user problems storage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("solvesphere_user_problems_")) {
        try {
          const userList = JSON.parse(localStorage.getItem(key) || "[]");
          if (Array.isArray(userList)) {
            const modUserList = userList.map((p) => (String(p.id) === String(problemId) ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
            localStorage.setItem(key, JSON.stringify(modUserList));
          }
        } catch {}
      }
    }
  } catch {}

  // If assigned to a university, create assignment record and notification
  if (updates.assignedUniversity) {
    assignProblemToUniversity(problemId, updates);
  }

  // Dispatch global sync events
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent("solvesphere_problems_updated", { detail: { problemId, updates } }));
  window.dispatchEvent(new CustomEvent("solvesphere_university_updated"));
  window.dispatchEvent(new CustomEvent("solvesphere_notifications_updated"));

  return updatedProblems;
};

export const assignProblemToUniversity = (problemId, data = {}) => {
  const uniName = data.assignedUniversity;
  if (!uniName) return;

  const uniKey = String(uniName).trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const STORAGE_KEY = `solvesphere_assigned_challenges_${uniKey}`;
  const GLOBAL_KEY = "solvesphere_assigned_challenges";

  let currentAssignments = [];
  try {
    const saved = localStorage.getItem(GLOBAL_KEY) || localStorage.getItem(STORAGE_KEY);
    if (saved) {
      currentAssignments = JSON.parse(saved);
    }
  } catch {}

  const newAssignment = {
    challengeId: problemId,
    assignedUniversity: uniName,
    department: data.assignedDepartment || "Department of Research & Innovation",
    status: data.universityStatus || "PENDING",
    assignedAt: new Date().toISOString(),
    targetDays: data.targetDays || 60,
    grantAmount: data.grantAmount || "₹ 15,00,000",
    challenge: {
      id: problemId,
      title: data.title || "Government Civic Challenge",
      description: data.description || "Civic problem assigned by District Government for specialized university R&D.",
      category: data.category || "Water & Sanitation",
      location: data.location || data.district || "Jharkhand",
      district: data.district || "Jharkhand",
      priority: data.priority || "High",
      progress: data.progress || 25,
      impactMetrics: data.impactMetrics || null,
    },
  };

  const existingIdx = currentAssignments.findIndex((a) => String(a.challengeId) === String(problemId));
  if (existingIdx >= 0) {
    currentAssignments[existingIdx] = { ...currentAssignments[existingIdx], ...newAssignment };
  } else {
    currentAssignments.unshift(newAssignment);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentAssignments));
    localStorage.setItem(GLOBAL_KEY, JSON.stringify(currentAssignments));
  } catch {}

  // Add notification to the university
  const NOTIF_KEY = `solvesphere_notifications_${uniKey}`;
  try {
    const notifs = JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
    notifs.unshift({
      id: `gov-assign-${problemId}-${Date.now()}`,
      title: `New Government Civic Assignment: ${data.title || problemId}`,
      message: `District Government has assigned challenge #${problemId} (${data.category || "Civic"}) to ${uniName}.`,
      time: "Just now",
      read: false,
      link: "/university-dashboard/my-projects",
    });
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs.slice(0, 20)));
  } catch {}
};

// University marks progress or completion with impact
export const updateUniversityProjectProgress = (challengeId, { status, progress, stage, impactSummary, citizensBenefited }) => {
  const updates = {
    progress: progress ?? (status === "COMPLETED" ? 100 : status === "ACCEPTED" ? 50 : 25),
    universityStatus: status,
    projectStage: stage || (status === "COMPLETED" ? "Solution Deployed & Impact Generated" : "Active Solution Development"),
  };

  if (status === "COMPLETED") {
    updates.status = "Completed & Impact Generated";
    updates.backendStatus = "RESOLVED";
    updates.completedAt = new Date().toISOString();
    updates.impactSummary = impactSummary || "Civic problem resolved successfully by university research team.";
    updates.citizensBenefited = citizensBenefited || "5,000+ residents";
  } else if (status === "ACCEPTED") {
    updates.status = "In Progress (Solution Development)";
    updates.backendStatus = "IN_PROGRESS";
  }

  updateProblemLifecycle(challengeId, updates);
};
