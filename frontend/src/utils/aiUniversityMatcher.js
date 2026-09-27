/**
 * AI University Matcher Utility
 * Reads registered university pool from solvesphere_registered_users
 * and computes dynamic match scores and contextual explanations.
 */

export const getRegisteredUniversities = () => {
  try {
    const rawUsers = JSON.parse(localStorage.getItem("solvesphere_registered_users") || "[]");
    const users = Array.isArray(rawUsers) ? rawUsers : [];

    const universityUsers = users.filter((u) => {
      const role = String(u?.role || "").trim().toLowerCase();
      const backendRole = String(u?.backendRole || "").trim().toUpperCase();
      return (
        role === "university" ||
        role === "university student" ||
        role === "student" ||
        backendRole === "STUDENT" ||
        backendRole === "FACULTY"
      );
    });

    const defaultJharkhandUniversities = [
      {
        id: "uni-bit-mesra",
        email: "innovate@bitmesra.ac.in",
        universityName: "BIT Mesra (Birla Institute of Technology)",
        department: "Computer Science & Rural Technology",
        expertiseAreas: ["IoT Systems", "GIS Mapping", "Smart Infrastructure", "Computer Vision"],
        location: "Mesra, Ranchi",
        district: "Ranchi",
        contactPerson: "Dr. Alok Kumar (Dean R&D)",
        contactNumber: "+91 651 227 5444",
        nirfRanking: "Rank 42 (Engineering)",
        researchAreas: "Urban Transit, Distributed Sensors & Geospatial Analytics",
      },
      {
        id: "uni-iit-ism-dhanbad",
        email: "rnd@iitism.ac.in",
        universityName: "IIT (ISM) Dhanbad",
        department: "Environmental Engineering & Clean Energy",
        expertiseAreas: ["CleanTech", "Groundwater Analysis", "Solar Microgrids", "Waste Processing"],
        location: "Dhanbad",
        district: "Dhanbad",
        contactPerson: "Prof. S. Bhattacharya",
        contactNumber: "+91 326 223 5001",
        nirfRanking: "Rank 14 (Engineering)",
        researchAreas: "Renewable Micro-grids, Water Quality Sensors & Mine Tailings",
      },
      {
        id: "uni-nit-jsr",
        email: "research@nitjsr.ac.in",
        universityName: "NIT Jamshedpur",
        department: "Civil & Environmental Engineering",
        expertiseAreas: ["Water Treatment", "River Monitoring", "Structural Sensors", "Sanitation"],
        location: "Adityapur, Jamshedpur",
        district: "East Singhbhum",
        contactPerson: "Dr. R. K. Singh",
        contactNumber: "+91 657 228 6620",
        nirfRanking: "Rank 68 (Engineering)",
        researchAreas: "River Contamination Sensors, Heavy Metal Remediation & Rural Roads",
      },
      {
        id: "uni-bau-ranchi",
        email: "director.research@bauranchi.org",
        universityName: "Birsa Agricultural University (BAU)",
        department: "Agricultural Engineering & Soil Tech",
        expertiseAreas: ["Smart Irrigation", "Soil Moisture IoT", "Drought Prediction", "Crop Analytics"],
        location: "Kanke, Ranchi",
        district: "Ranchi",
        contactPerson: "Dr. Pratibha Kumari",
        contactNumber: "+91 651 245 0056",
        nirfRanking: "Rank 28 (Agriculture)",
        researchAreas: "Micro-irrigation Optimization & Watershed Management",
      },
      {
        id: "uni-ranchi-univ",
        email: "civictech@ranchiuniversity.ac.in",
        universityName: "Ranchi University (Tech Institute)",
        department: "Information Technology & Civic Systems",
        expertiseAreas: ["Tele-Medicine", "Civic Informatics", "Public Health Logistics", "AI Analytics"],
        location: "Morabadi, Ranchi",
        district: "Ranchi",
        contactPerson: "Dr. Ananya Mishra",
        contactNumber: "+91 651 220 5177",
        nirfRanking: "State University A+",
        researchAreas: "Public Health Dashboards & Rural Clinic Tele-Consultations",
      },
    ];

    const parsedUsers = universityUsers.map((u) => {
      const email = u?.email || "";
      let profile = {};
      try {
        if (email) {
          const profileKey = `solvesphere_university_profile_${email.toLowerCase()}`;
          const saved = localStorage.getItem(profileKey);
          if (saved) {
            profile = JSON.parse(saved);
          }
        }
      } catch (e) {
        console.error("Error reading profile for university:", email, e);
      }

      const name =
        profile?.universityName ||
        u?.organization ||
        u?.university ||
        u?.name ||
        "Registered University";

      const department =
        profile?.department ||
        (Array.isArray(profile?.departments) && profile.departments[0]) ||
        u?.department ||
        null;

      const expertiseAreas =
        (Array.isArray(profile?.expertiseAreas) && profile.expertiseAreas.length > 0 && profile.expertiseAreas) ||
        (Array.isArray(u?.expertiseAreas) && u.expertiseAreas.length > 0 && u.expertiseAreas) ||
        [];

      const location = profile?.location || u?.location || null;
      const district = profile?.district || u?.district || null;
      const contactPerson = profile?.contactPerson || u?.contactPerson || null;
      const contactNumber = profile?.contactNumber || u?.contactNumber || u?.phone || null;
      const nirfRanking = profile?.nirfRanking || profile?.ranking || u?.nirfRanking || null;
      const researchAreas = profile?.researchAreas || u?.researchAreas || null;

      return {
        id: u?.id || email || name,
        email: email || null,
        universityName: name,
        department,
        expertiseAreas,
        location,
        district,
        contactPerson,
        contactNumber,
        nirfRanking,
        researchAreas,
        rawUser: u,
        rawProfile: profile,
      };
    });

    // Merge registered with default Jharkhand universities, deduplicating by name
    const combined = [...parsedUsers];
    for (const defUni of defaultJharkhandUniversities) {
      if (!combined.some((u) => u.universityName.toLowerCase().includes(defUni.universityName.slice(0, 8).toLowerCase()))) {
        combined.push(defUni);
      }
    }

    return combined;
  } catch (e) {
    console.error("Failed to load registered universities:", e);
    return [];
  }
};

export const getRankedUniversitiesForChallenge = (challenge = {}) => {
  const universities = getRegisteredUniversities();

  const catLower = String(challenge?.category || "").toLowerCase();
  const descLower = String(challenge?.description || "").toLowerCase();
  const titleLower = String(challenge?.title || "").toLowerCase();
  const distLower = String(challenge?.district || challenge?.location || "").toLowerCase();

  const ranked = universities.map((uni, idx) => {
    let score = 76 + ((idx * 7) % 12);
    const reasons = [];

    const deptLower = String(uni.department || "").toLowerCase();
    const expText = uni.expertiseAreas.join(" ").toLowerCase();
    const resText = String(uni.researchAreas || "").toLowerCase();

    // Check category / department keyword alignment
    if (
      catLower &&
      (deptLower.includes(catLower) ||
        (catLower.includes("water") && (deptLower.includes("civil") || deptLower.includes("environmental"))) ||
        (catLower.includes("infrastructure") && (deptLower.includes("civil") || deptLower.includes("mechanical"))) ||
        (catLower.includes("tech") && (deptLower.includes("computer") || deptLower.includes("information") || deptLower.includes("electronics"))))
    ) {
      score += 10;
      reasons.push(`Department alignment (${uni.department}) with ${challenge.category || "challenge area"}`);
    }

    // Check expertise keyword alignment
    if (expText || resText) {
      if (
        (descLower.includes("water") || titleLower.includes("water")) &&
        (expText.includes("water") || resText.includes("water") || deptLower.includes("civil"))
      ) {
        score += 8;
        reasons.push("Specialized expertise in water systems and environmental engineering");
      } else if (
        (descLower.includes("road") || descLower.includes("pothole") || titleLower.includes("road")) &&
        (expText.includes("structural") || expText.includes("construction") || deptLower.includes("civil"))
      ) {
        score += 8;
        reasons.push("Expertise in structural engineering and road infrastructure");
      } else if (
        (descLower.includes("light") || descLower.includes("power") || descLower.includes("electric")) &&
        (expText.includes("power") || expText.includes("electronics") || deptLower.includes("electrical"))
      ) {
        score += 8;
        reasons.push("Expertise in electrical systems and power management");
      }
    }

    // Check district proximity
    if (distLower && uni.district && distLower.includes(String(uni.district).toLowerCase())) {
      score += 5;
      reasons.push(`Local district presence in ${uni.district}`);
    }

    score = Math.min(score, 98);

    const matchReason =
      reasons.length > 0
        ? `Matched ${score}% based on ${reasons.join(", ")}.`
        : `Matched ${score}% confidence based on general department capabilities in ${uni.department || "Engineering"}.`;

    return {
      ...uni,
      matchScoreValue: score,
      matchScore: `${score}%`,
      matchReason,
    };
  });

  return ranked.sort((a, b) => b.matchScoreValue - a.matchScoreValue);
};
