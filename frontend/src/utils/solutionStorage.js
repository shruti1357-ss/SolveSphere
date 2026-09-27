// Utility functions for Solution Submissions & PDF Storage
import jsPDF from "jspdf";

const SUBMITTED_SOLUTIONS_KEY = "solvesphere_submitted_solutions";

// Initial mock submitted solutions for demo presentation (Strictly Jharkhand)
export const MOCK_SUBMITTED_SOLUTIONS = [
  {
    id: "SUB-1024",
    challengeId: "CH-1024",
    challengeTitle: "Crop Disease Detection System",
    problemStatement:
      "Farmers are facing difficulty identifying crop diseases at an early stage, leading to significant yield reduction in paddy and maize crops across Santhal Pargana region.",
    category: "Agriculture",
    domain: "Agriculture",
    district: "Dumka",
    location: "Dumka, Jharkhand",
    priority: "HIGH",
    requiredExpertise: ["AI/ML", "Computer Vision", "Agriculture Technology"],
    university: "Birsa Agricultural University, Ranchi",
    team: "BAU AgroTech Innovators (4 Members)",
    facultyMentor: "Dr. Rajesh Kumar Sharma",
    status: "SUBMITTED",
    submissionDate: "7 September 2026",
    pdfFileName: "solution-crop-disease-detection.pdf",
  },
  {
    id: "SUB-8091",
    challengeId: "CH-8091",
    challengeTitle: "AI-Powered Traffic Signal Synchronization in High-Density Corridors",
    problemStatement:
      "Implementing computer vision and real-time sensor analytics to dynamically optimize traffic light timers across 45 critical intersections to reduce urban congestion in Ranchi.",
    category: "Rural Infrastructure",
    domain: "Rural Infrastructure",
    district: "Ranchi",
    location: "Ranchi, Jharkhand",
    priority: "HIGH",
    requiredExpertise: ["Computer Vision", "IoT", "Traffic Analytics"],
    university: "BIT Mesra, Ranchi",
    team: "TrafficVision AI Lab (5 Members)",
    facultyMentor: "Prof. S. K. Mitra",
    status: "SUBMITTED",
    submissionDate: "05 September 2026",
    pdfFileName: "traffic-signal-ai-solution.pdf",
  },
  {
    id: "SUB-7860",
    challengeId: "CH-7860",
    challengeTitle: "Solar-Powered Groundwater Arsenic Filtration",
    problemStatement:
      "Autonomous solar micro-filtration membrane units designed to purify arsenic-heavy groundwater in remote rural blocks with low grid availability.",
    category: "Water Management",
    domain: "Water Management",
    district: "East Singhbhum",
    location: "Patamda, East Singhbhum",
    priority: "HIGH",
    requiredExpertise: ["Solar HydroTech", "IoT Telemetry", "Water Filtration"],
    university: "NIT Jamshedpur",
    team: "HydroPurify Research Group (4 Members)",
    facultyMentor: "Dr. K. K. Shukla",
    status: "SUBMITTED",
    submissionDate: "12 September 2026",
    pdfFileName: "nit-jsr-arsenic-filtration.pdf",
  },
  {
    id: "SUB-7950",
    challengeId: "CH-7950",
    challengeTitle: "Municipal Solid Waste Automated Sorting",
    problemStatement:
      "Dual-arm delta robot units equipped with hyperspectral computer vision sensors for automated sorting of recyclable municipal plastics and dry waste.",
    category: "Sanitation & Waste",
    domain: "Sanitation & Waste",
    district: "Dhanbad",
    location: "Dhanbad, Jharkhand",
    priority: "MEDIUM",
    requiredExpertise: ["Robotics", "Hyperspectral Vision", "IoT"],
    university: "IIT (ISM) Dhanbad",
    team: "EcoSort CleanTech Lab (5 Members)",
    facultyMentor: "Prof. Rajiv Shekhar",
    status: "SUBMITTED",
    submissionDate: "15 September 2026",
    pdfFileName: "iit-dhanbad-waste-sorting.pdf",
  },
];

export const getSubmittedSolutions = () => {
  try {
    const saved = localStorage.getItem(SUBMITTED_SOLUTIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure no legacy non-Jharkhand entries
        return parsed.map((item) => {
          if (item.university === "XYZ University") {
            return {
              ...item,
              university: "Birsa Agricultural University, Ranchi",
              team: "BAU AgroTech Innovators (4 Members)",
            };
          }
          if (item.district === "Bengaluru" || item.university?.includes("Bengaluru")) {
            return {
              ...item,
              university: "BIT Mesra, Ranchi",
              district: "Ranchi",
              location: "Ranchi, Jharkhand",
            };
          }
          return item;
        });
      }
    }
  } catch (e) {
    console.error("Error reading submitted solutions:", e);
  }

  try {
    localStorage.setItem(
      SUBMITTED_SOLUTIONS_KEY,
      JSON.stringify(MOCK_SUBMITTED_SOLUTIONS)
    );
  } catch (e) {}
  return MOCK_SUBMITTED_SOLUTIONS;
};

export const getSolutionByChallengeId = (challengeId) => {
  const all = getSubmittedSolutions();
  return all.find(
    (item) =>
      String(item.challengeId || "").toLowerCase() ===
        String(challengeId || "").toLowerCase() ||
      String(item.id || "").toLowerCase() ===
        String(challengeId || "").toLowerCase()
  );
};

export const saveSolutionSubmission = (solutionData) => {
  const existing = getSubmittedSolutions();

  const newSubmission = {
    id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
    challengeId: solutionData.challengeId || "CH-1024",
    challengeTitle: solutionData.challengeTitle || "Community Challenge Solution",
    problemStatement: solutionData.problemStatement || "Reported community issue solution.",
    category: solutionData.category || "General",
    domain: solutionData.domain || solutionData.category || "Technology",
    district: solutionData.district || "Jharkhand",
    location: solutionData.location || "Jharkhand",
    priority: solutionData.priority || "HIGH",
    requiredExpertise: Array.isArray(solutionData.requiredExpertise)
      ? solutionData.requiredExpertise
      : ["Technology", "Engineering"],
    university: solutionData.university || "Jharkhand Partner University",
    team: solutionData.team || "University Team",
    facultyMentor: solutionData.facultyMentor || "Faculty Lead",
    status: "SUBMITTED",
    submissionDate: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    pdfFileName: solutionData.pdfFileName || "solution-document.pdf",
  };

  const updated = [newSubmission, ...existing.filter((s) => s.challengeId !== newSubmission.challengeId)];

  try {
    localStorage.setItem(SUBMITTED_SOLUTIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving solution submission:", e);
  }

  return newSubmission;
};

export const downloadSolutionPdf = (solution) => {
  if (!solution) return;

  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Top Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 38, "F");

    // Accent line
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(0, 38, pageWidth, 3, "F");

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("GOVERNMENT OF JHARKHAND", 14, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("SolveSphere Technical Solution & Implementation Blueprint", 14, 24);

    doc.setFontSize(8);
    doc.text(`Official Submission Reference: ${solution.id || "SUB-DOC"}`, 14, 31);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, pageWidth - 60, 31);

    // Document Body
    let y = 52;

    // Challenge Header Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, 28, 3, 3, "FD");

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(solution.challengeTitle || "Challenge Solution", 18, y + 9);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Challenge ID: ${solution.challengeId || "CH-8000"}   |   Domain: ${solution.domain || solution.category || "General"}   |   Priority: ${solution.priority || "HIGH"}`, 18, y + 17);
    doc.text(`Jurisdiction: ${solution.district || solution.location || "Jharkhand State"}   |   Date: ${solution.submissionDate || "September 2026"}`, 18, y + 23);

    y += 36;

    // Problem Statement Section
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("1. PROBLEM STATEMENT & CONTEXT", 14, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const splitProblem = doc.splitTextToSize(solution.problemStatement || "Problem statement context.", pageWidth - 28);
    doc.text(splitProblem, 14, y);
    y += splitProblem.length * 5 + 8;

    // Submitting HEI Team Section
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("2. SUBMITTING HEI & RESEARCH TEAM", 14, y);
    y += 5;

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Institution: ${solution.university || "Jharkhand Partner University"}`, 18, y + 7);
    doc.text(`Team: ${solution.team || "Research Team"}`, 18, y + 14);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Faculty Mentor: ${solution.facultyMentor || "Dr. Coordinator"}`, 110, y + 7);
    doc.text(`Status: Verified Submission (Completed)`, 110, y + 14);

    y += 30;

    // Technical Expertise & Methodology
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("3. REQUIRED TECHNICAL EXPERTISE & DOMAINS", 14, y);
    y += 6;

    const expertiseList = Array.isArray(solution.requiredExpertise)
      ? solution.requiredExpertise.join(", ")
      : "Artificial Intelligence, Internet of Things, Embedded Firmware, Cloud Telemetry";

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Core Technologies: ${expertiseList}`, 14, y);
    y += 6;
    doc.text("• Deployment Readiness: Ready for prototype bench testing and field validation.", 14, y);
    y += 6;
    doc.text("• Compliance: Aligned with Jharkhand State Innovation and Civic Standards.", 14, y);

    y += 18;

    // Certification Box
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.setDrawColor(167, 243, 208); // emerald-200
    doc.roundedRect(14, y, pageWidth - 28, 24, 3, 3, "FD");

    doc.setTextColor(6, 95, 70); // emerald-800
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("OFFICIAL STATE PORTAL VERIFICATION", 18, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(4, 120, 87);
    doc.text("This document constitutes an official certified submission blueprint archived in the SolveSphere State Repository.", 18, y + 15);
    doc.text("Government of Jharkhand • Department of Higher, Technical Education & Skill Development", 18, y + 20);

    // Save File
    const fileName = solution.pdfFileName || `${(solution.challengeTitle || "solution").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
    doc.save(fileName);
  } catch (e) {
    console.error("Error generating solution PDF:", e);
  }
};
