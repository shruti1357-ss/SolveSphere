import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Download,
  Calendar,
  Layers,
  MapPin,
  GraduationCap,
  Building2,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Check,
  ChevronDown,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { jsPDF } from "jspdf";
import IndustryModuleLayout from "../../components/industry/IndustryModuleLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getCompanyProfile,
  getUniversityCollaborations,
  MOCK_PROJECTS,
} from "../../utils/industryMockData";

// Category Master Metadata with standardized distinctive color palette
export const CATEGORY_PALETTE = {
  "Water & Sanitation": {
    name: "Water & Sanitation",
    shortName: "Water",
    color: "#0284c7", // Sky Blue
    lightBg: "#e0f2fe",
    border: "#bae6fd",
    text: "#0369a1",
  },
  "Waste Management": {
    name: "Waste Management",
    shortName: "Waste",
    color: "#10b981", // Emerald Green
    lightBg: "#d1fae5",
    border: "#a7f3d0",
    text: "#047857",
  },
  "Infrastructure & Roads": {
    name: "Infrastructure & Roads",
    shortName: "Roads",
    color: "#f59e0b", // Amber Gold
    lightBg: "#fef3c7",
    border: "#fde68a",
    text: "#b45309",
  },
  "Education & Literacy": {
    name: "Education & Literacy",
    shortName: "Education",
    color: "#8b5cf6", // Purple
    lightBg: "#ede9fe",
    border: "#ddd6fe",
    text: "#6d28d9",
  },
  "Healthcare & Diagnostics": {
    name: "Healthcare & Diagnostics",
    shortName: "Health",
    color: "#ef4444", // Rose Red
    lightBg: "#ffe4e6",
    border: "#fecdd3",
    text: "#be123c",
  },
  "Agriculture & Food Tech": {
    name: "Agriculture & Food Tech",
    shortName: "Agriculture",
    color: "#84cc16", // Lime Green
    lightBg: "#ecfccb",
    border: "#d9f99d",
    text: "#4d7c0f",
  },
  "Smart City & Mobility": {
    name: "Smart City & Mobility",
    shortName: "Smart City",
    color: "#3b82f6", // Royal Blue
    lightBg: "#dbeafe",
    border: "#bfdbfe",
    text: "#1d4ed8",
  },
  "Renewable Energy & Power": {
    name: "Renewable Energy & Power",
    shortName: "Energy",
    color: "#14b8a6", // Teal
    lightBg: "#ccfbf1",
    border: "#99f6e4",
    text: "#0f766e",
  },
};

// Available Year Selection Options
export const YEAR_OPTIONS = [
  { id: "ALL", label: "All Years (2023 - 2026)", sublabel: "Cumulative Lifetime Impact", badge: "All Time" },
  { id: "2026", label: "Year 2026", sublabel: "FY 2025-26 • Active Period", badge: "Current Year" },
  { id: "2025", label: "Year 2025", sublabel: "FY 2024-25 • Completed Audit", badge: "FY 24-25" },
  { id: "2024", label: "Year 2024", sublabel: "FY 2023-24 • Annual Review", badge: "FY 23-24" },
  { id: "2023", label: "Year 2023", sublabel: "Inception & Pilot Phase", badge: "Inception" },
];

// Seed dataset by Year for dynamic historical comparison
const YEARLY_ANALYTICS_DATA = {
  "2026": {
    kpis: {
      projectsSupported: 28,
      projectsTrend: "+4 in Q3 2026",
      solutionsDeployed: 16,
      deploymentRate: "57.1% Deployed",
      avgResolutionDays: "18.2",
      resolutionTrend: "-4.5d vs State Target",
      csrCommitted: "₹28.5",
      csrTrend: "100% Utilized",
    },
    categories: [
      { categoryKey: "Water & Sanitation", name: "Water & Sanitation", shortLabel: "Water", count: 32, resolutionRate: 88, investment: 8.5, avgDays: 16, color: "#0284c7", activeDeployments: 7, topPartner: "NIT Jamshedpur" },
      { categoryKey: "Waste Management", name: "Waste Management", shortLabel: "Waste", count: 26, resolutionRate: 81, investment: 6.2, avgDays: 19, color: "#10b981", activeDeployments: 5, topPartner: "BIT Mesra" },
      { categoryKey: "Infrastructure & Roads", name: "Infrastructure & Roads", shortLabel: "Roads", count: 22, resolutionRate: 75, investment: 5.8, avgDays: 22, color: "#f59e0b", activeDeployments: 4, topPartner: "IIT (ISM) Dhanbad" },
      { categoryKey: "Education & Literacy", name: "Education & Literacy", shortLabel: "Education", count: 18, resolutionRate: 92, investment: 4.1, avgDays: 14, color: "#8b5cf6", activeDeployments: 3, topPartner: "XYZ University, Dumka" },
      { categoryKey: "Healthcare & Diagnostics", name: "Healthcare & Diagnostics", shortLabel: "Health", count: 14, resolutionRate: 85, investment: 3.9, avgDays: 20, color: "#ef4444", activeDeployments: 2, topPartner: "RIMS Ranchi / XYZ Univ" },
    ],
    stages: [
      { stage: "Requirement & Research", count: 4, percent: 14, color: "#94a3b8" },
      { stage: "Prototype Co-Development", count: 8, percent: 29, color: "#3b82f6" },
      { stage: "Field Testing & Validation", count: 6, percent: 21, color: "#f59e0b" },
      { stage: "Commercial / Ward Deployment", count: 10, percent: 36, color: "#10b981" },
    ],
    districts: [
      { district: "Ranchi", division: "South Chotanagpur", projects: 8, deployed: 5, progress: 85 },
      { district: "East Singhbhum (Jamshedpur)", division: "Kolhan", projects: 6, deployed: 4, progress: 80 },
      { district: "Dhanbad", division: "North Chotanagpur", projects: 5, deployed: 3, progress: 72 },
      { district: "Dumka", division: "Santhal Pargana", projects: 4, deployed: 2, progress: 65 },
      { district: "Bokaro", division: "North Chotanagpur", projects: 3, deployed: 1, progress: 60 },
      { district: "Hazaribagh", division: "North Chotanagpur", projects: 2, deployed: 1, progress: 55 },
    ],
  },
  "2025": {
    kpis: {
      projectsSupported: 21,
      projectsTrend: "+6 in FY25",
      solutionsDeployed: 12,
      deploymentRate: "57.1% Deployed",
      avgResolutionDays: "21.4",
      resolutionTrend: "-2.8d vs Target",
      csrCommitted: "₹21.0",
      csrTrend: "100% Disbursed",
    },
    categories: [
      { categoryKey: "Water & Sanitation", name: "Water & Sanitation", shortLabel: "Water", count: 24, resolutionRate: 83, investment: 6.5, avgDays: 19, color: "#0284c7", activeDeployments: 5, topPartner: "NIT Jamshedpur" },
      { categoryKey: "Waste Management", name: "Waste Management", shortLabel: "Waste", count: 19, resolutionRate: 77, investment: 4.8, avgDays: 22, color: "#10b981", activeDeployments: 4, topPartner: "BIT Mesra" },
      { categoryKey: "Infrastructure & Roads", name: "Infrastructure & Roads", shortLabel: "Roads", count: 17, resolutionRate: 70, investment: 4.5, avgDays: 25, color: "#f59e0b", activeDeployments: 3, topPartner: "IIT (ISM) Dhanbad" },
      { categoryKey: "Education & Literacy", name: "Education & Literacy", shortLabel: "Education", count: 14, resolutionRate: 88, investment: 3.1, avgDays: 17, color: "#8b5cf6", activeDeployments: 2, topPartner: "XYZ University" },
      { categoryKey: "Healthcare & Diagnostics", name: "Healthcare & Diagnostics", shortLabel: "Health", count: 10, resolutionRate: 79, investment: 2.1, avgDays: 24, color: "#ef4444", activeDeployments: 1, topPartner: "RIMS Ranchi" },
    ],
    stages: [
      { stage: "Requirement & Research", count: 3, percent: 14, color: "#94a3b8" },
      { stage: "Prototype Co-Development", count: 6, percent: 29, color: "#3b82f6" },
      { stage: "Field Testing & Validation", count: 5, percent: 24, color: "#f59e0b" },
      { stage: "Commercial / Ward Deployment", count: 7, percent: 33, color: "#10b981" },
    ],
    districts: [
      { district: "Ranchi", division: "South Chotanagpur", projects: 6, deployed: 4, progress: 78 },
      { district: "East Singhbhum (Jamshedpur)", division: "Kolhan", projects: 5, deployed: 3, progress: 74 },
      { district: "Dhanbad", division: "North Chotanagpur", projects: 4, deployed: 2, progress: 68 },
      { district: "Dumka", division: "Santhal Pargana", projects: 3, deployed: 2, progress: 60 },
      { district: "Bokaro", division: "North Chotanagpur", projects: 2, deployed: 1, progress: 50 },
      { district: "Hazaribagh", division: "North Chotanagpur", projects: 1, deployed: 0, progress: 45 },
    ],
  },
  "2024": {
    kpis: {
      projectsSupported: 15,
      projectsTrend: "+5 in FY24",
      solutionsDeployed: 8,
      deploymentRate: "53.3% Deployed",
      avgResolutionDays: "24.8",
      resolutionTrend: "Met Benchmark",
      csrCommitted: "₹14.2",
      csrTrend: "100% Utilized",
    },
    categories: [
      { categoryKey: "Water & Sanitation", name: "Water & Sanitation", shortLabel: "Water", count: 16, resolutionRate: 78, investment: 4.5, avgDays: 23, color: "#0284c7", activeDeployments: 3, topPartner: "NIT Jamshedpur" },
      { categoryKey: "Waste Management", name: "Waste Management", shortLabel: "Waste", count: 13, resolutionRate: 72, investment: 3.4, avgDays: 26, color: "#10b981", activeDeployments: 2, topPartner: "BIT Mesra" },
      { categoryKey: "Infrastructure & Roads", name: "Infrastructure & Roads", shortLabel: "Roads", count: 12, resolutionRate: 65, investment: 3.1, avgDays: 28, color: "#f59e0b", activeDeployments: 2, topPartner: "IIT (ISM) Dhanbad" },
      { categoryKey: "Education & Literacy", name: "Education & Literacy", shortLabel: "Education", count: 9, resolutionRate: 82, investment: 2.0, avgDays: 20, color: "#8b5cf6", activeDeployments: 1, topPartner: "XYZ University" },
      { categoryKey: "Healthcare & Diagnostics", name: "Healthcare & Diagnostics", shortLabel: "Health", count: 7, resolutionRate: 74, investment: 1.2, avgDays: 27, color: "#ef4444", activeDeployments: 1, topPartner: "RIMS Ranchi" },
    ],
    stages: [
      { stage: "Requirement & Research", count: 3, percent: 20, color: "#94a3b8" },
      { stage: "Prototype Co-Development", count: 5, percent: 33, color: "#3b82f6" },
      { stage: "Field Testing & Validation", count: 3, percent: 20, color: "#f59e0b" },
      { stage: "Commercial / Ward Deployment", count: 4, percent: 27, color: "#10b981" },
    ],
    districts: [
      { district: "Ranchi", division: "South Chotanagpur", projects: 5, deployed: 3, progress: 70 },
      { district: "East Singhbhum (Jamshedpur)", division: "Kolhan", projects: 4, deployed: 2, progress: 65 },
      { district: "Dhanbad", division: "North Chotanagpur", projects: 3, deployed: 1, progress: 60 },
      { district: "Dumka", division: "Santhal Pargana", projects: 2, deployed: 1, progress: 50 },
      { district: "Bokaro", division: "North Chotanagpur", projects: 1, deployed: 1, progress: 45 },
    ],
  },
  "2023": {
    kpis: {
      projectsSupported: 9,
      projectsTrend: "Pilot Inception",
      solutionsDeployed: 4,
      deploymentRate: "44.4% Deployed",
      avgResolutionDays: "29.0",
      resolutionTrend: "Inception Phase",
      csrCommitted: "₹8.5",
      csrTrend: "Pilot Fund",
    },
    categories: [
      { categoryKey: "Water & Sanitation", name: "Water & Sanitation", shortLabel: "Water", count: 9, resolutionRate: 71, investment: 2.8, avgDays: 27, color: "#0284c7", activeDeployments: 2, topPartner: "NIT Jamshedpur" },
      { categoryKey: "Waste Management", name: "Waste Management", shortLabel: "Waste", count: 7, resolutionRate: 64, investment: 2.1, avgDays: 31, color: "#10b981", activeDeployments: 1, topPartner: "BIT Mesra" },
      { categoryKey: "Infrastructure & Roads", name: "Infrastructure & Roads", shortLabel: "Roads", count: 6, resolutionRate: 59, investment: 1.8, avgDays: 33, color: "#f59e0b", activeDeployments: 1, topPartner: "IIT (ISM) Dhanbad" },
      { categoryKey: "Education & Literacy", name: "Education & Literacy", shortLabel: "Education", count: 5, resolutionRate: 75, investment: 1.1, avgDays: 24, color: "#8b5cf6", activeDeployments: 1, topPartner: "XYZ University" },
      { categoryKey: "Healthcare & Diagnostics", name: "Healthcare & Diagnostics", shortLabel: "Health", count: 3, resolutionRate: 68, investment: 0.7, avgDays: 30, color: "#ef4444", activeDeployments: 0, topPartner: "RIMS Ranchi" },
    ],
    stages: [
      { stage: "Requirement & Research", count: 2, percent: 22, color: "#94a3b8" },
      { stage: "Prototype Co-Development", count: 3, percent: 33, color: "#3b82f6" },
      { stage: "Field Testing & Validation", count: 2, percent: 22, color: "#f59e0b" },
      { stage: "Commercial / Ward Deployment", count: 2, percent: 22, color: "#10b981" },
    ],
    districts: [
      { district: "Ranchi", division: "South Chotanagpur", projects: 3, deployed: 2, progress: 60 },
      { district: "East Singhbhum (Jamshedpur)", division: "Kolhan", projects: 3, deployed: 1, progress: 55 },
      { district: "Dhanbad", division: "North Chotanagpur", projects: 2, deployed: 1, progress: 50 },
      { district: "Dumka", division: "Santhal Pargana", projects: 1, deployed: 0, progress: 40 },
    ],
  },
  "ALL": {
    kpis: {
      projectsSupported: 73,
      projectsTrend: "+28 active in 2026",
      solutionsDeployed: 40,
      deploymentRate: "54.8% Cumulative",
      avgResolutionDays: "20.8",
      resolutionTrend: "Consistently Improving",
      csrCommitted: "₹72.2",
      csrTrend: "Total Disbursed",
    },
    categories: [
      { categoryKey: "Water & Sanitation", name: "Water & Sanitation", shortLabel: "Water", count: 81, resolutionRate: 85, investment: 22.3, avgDays: 18, color: "#0284c7", activeDeployments: 17, topPartner: "NIT Jamshedpur" },
      { categoryKey: "Waste Management", name: "Waste Management", shortLabel: "Waste", count: 65, resolutionRate: 78, investment: 16.5, avgDays: 22, color: "#10b981", activeDeployments: 12, topPartner: "BIT Mesra" },
      { categoryKey: "Infrastructure & Roads", name: "Infrastructure & Roads", shortLabel: "Roads", count: 57, resolutionRate: 71, investment: 15.2, avgDays: 25, color: "#f59e0b", activeDeployments: 10, topPartner: "IIT (ISM) Dhanbad" },
      { categoryKey: "Education & Literacy", name: "Education & Literacy", shortLabel: "Education", count: 46, resolutionRate: 89, investment: 10.3, avgDays: 16, color: "#8b5cf6", activeDeployments: 7, topPartner: "XYZ University, Dumka" },
      { categoryKey: "Healthcare & Diagnostics", name: "Healthcare & Diagnostics", shortLabel: "Health", count: 34, resolutionRate: 81, investment: 7.9, avgDays: 23, color: "#ef4444", activeDeployments: 4, topPartner: "RIMS Ranchi / XYZ Univ" },
    ],
    stages: [
      { stage: "Requirement & Research", count: 12, percent: 16, color: "#94a3b8" },
      { stage: "Prototype Co-Development", count: 22, percent: 30, color: "#3b82f6" },
      { stage: "Field Testing & Validation", count: 16, percent: 22, color: "#f59e0b" },
      { stage: "Commercial / Ward Deployment", count: 23, percent: 32, color: "#10b981" },
    ],
    districts: [
      { district: "Ranchi", division: "South Chotanagpur", projects: 22, deployed: 14, progress: 82 },
      { district: "East Singhbhum (Jamshedpur)", division: "Kolhan", projects: 18, deployed: 10, progress: 78 },
      { district: "Dhanbad", division: "North Chotanagpur", projects: 14, deployed: 7, progress: 70 },
      { district: "Dumka", division: "Santhal Pargana", projects: 10, deployed: 5, progress: 64 },
      { district: "Bokaro", division: "North Chotanagpur", projects: 6, deployed: 3, progress: 58 },
      { district: "Hazaribagh", division: "North Chotanagpur", projects: 3, deployed: 1, progress: 52 },
    ],
  },
};

// Detailed problem ledger with associated year
const DETAILED_PROBLEMS = [
  {
    id: "CH-1024",
    year: "2026",
    title: "AI Crop Disease Diagnostic & Drone Imagery System",
    category: "Agriculture & Food Tech",
    categoryKey: "Agriculture & Food Tech",
    university: "XYZ University",
    district: "Dumka",
    stage: "Prototype Development",
    progress: 65,
    contribution: "Cloud GPU + Field Trials",
    grant: "₹3.5 Lakhs",
    status: "Active",
  },
  {
    id: "PROJ-102",
    year: "2026",
    title: "Smart Water Quality & Heavy Metal Telemetry Buoys",
    category: "Water & Sanitation",
    categoryKey: "Water & Sanitation",
    university: "NIT Jamshedpur",
    district: "East Singhbhum",
    stage: "Testing & Validation",
    progress: 80,
    contribution: "Sensor Calibration & CSR Grant",
    grant: "₹5.5 Lakhs",
    status: "Active",
  },
  {
    id: "PROJ-103",
    year: "2026",
    title: "Computer Vision Adaptive Traffic Light & Green Corridors",
    category: "Smart City & Mobility",
    categoryKey: "Smart City & Mobility",
    university: "IIT (ISM) Dhanbad",
    district: "Dhanbad",
    stage: "Field Deployment",
    progress: 92,
    contribution: "Edge AI Hardware & Mentorship",
    grant: "₹7.5 Lakhs",
    status: "Deployed",
  },
  {
    id: "PROJ-104",
    year: "2025",
    title: "Tele-Health Portable Vital Diagnostic Kit for Tribal Clinics",
    category: "Healthcare & Diagnostics",
    categoryKey: "Healthcare & Diagnostics",
    university: "XYZ University",
    district: "West Singhbhum",
    stage: "Field Validation",
    progress: 85,
    contribution: "Clinical Testing Sponsorship",
    grant: "₹4.0 Lakhs",
    status: "Active",
  },
  {
    id: "PROJ-105",
    year: "2025",
    title: "Solar Micro-Grid Load Balancer with Decentralized Metering",
    category: "Renewable Energy & Power",
    categoryKey: "Renewable Energy & Power",
    university: "Vinoba Bhave University",
    district: "Hazaribagh",
    stage: "Pilot Prototype",
    progress: 50,
    contribution: "Hybrid Inverters & Grant",
    grant: "₹4.8 Lakhs",
    status: "In Progress",
  },
  {
    id: "PROJ-106",
    year: "2024",
    title: "Vernacular AI Audio Tutor for Rural Primary Classrooms",
    category: "Education & Literacy",
    categoryKey: "Education & Literacy",
    university: "XYZ University",
    district: "Dumka",
    stage: "Ward Deployment",
    progress: 95,
    contribution: "Tablet Hardware + Mentorship",
    grant: "₹3.2 Lakhs",
    status: "Deployed",
  },
  {
    id: "GOV-RNC-0102",
    year: "2024",
    title: "Solid Waste Segregation & Bio-Reactor Processing Automation",
    category: "Waste Management",
    categoryKey: "Waste Management",
    university: "BIT Mesra",
    district: "Ranchi",
    stage: "Testing & Validation",
    progress: 75,
    contribution: "Pilot Plant Testing Support",
    grant: "₹4.2 Lakhs",
    status: "Active",
  },
  {
    id: "GOV-DMD-0081",
    year: "2023",
    title: "Municipal Groundwater Contamination Early Sensor Grid",
    category: "Water & Sanitation",
    categoryKey: "Water & Sanitation",
    university: "IIT (ISM) Dhanbad",
    district: "Dhanbad",
    stage: "Commercial Deployment",
    progress: 100,
    contribution: "Field Pilot Hardware",
    grant: "₹2.8 Lakhs",
    status: "Deployed",
  },
];

export default function IndustryAnalyticsReportsPage() {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2026"); // "ALL" | "2026" | "2025" | "2024" | "2023"
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [metricView, setMetricView] = useState("count"); // "count" | "resolutionRate" | "investment"
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [activeCategoryHighlight, setActiveCategoryHighlight] = useState(null);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsYearDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Sync listener with localStorage and custom portal events
  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_collaborations_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_collaborations_updated", handleUpdate);
    };
  }, []);

  const companyProfile = useMemo(() => getCompanyProfile(user), [user, version]);
  const liveCollaborations = useMemo(() => getUniversityCollaborations(user), [user, version]);

  const companyName =
    companyProfile?.companyName || user?.organization || user?.name || "Tata Motors / Industry Partner";

  // Current year data package
  const yearDataset = useMemo(() => {
    return YEARLY_ANALYTICS_DATA[selectedYear] || YEARLY_ANALYTICS_DATA["2026"];
  }, [selectedYear]);

  // Dynamic category calculations based on selected year & real-time additions
  const dynamicCategoryData = useMemo(() => {
    return yearDataset.categories.map((item) => {
      let bonusCount = 0;
      if (selectedYear === "2026" || selectedYear === "ALL") {
        const liveMatches = liveCollaborations.filter(
          (c) =>
            (c.domain || "").toLowerCase().includes(item.shortLabel.toLowerCase()) ||
            (item.name || "").toLowerCase().includes((c.domain || "").toLowerCase())
        );
        bonusCount = liveMatches.length;
      }
      return {
        ...item,
        value:
          metricView === "count"
            ? item.count + bonusCount
            : metricView === "resolutionRate"
            ? item.resolutionRate
            : item.investment,
      };
    });
  }, [metricView, yearDataset, liveCollaborations, selectedYear]);

  // Filtered Problem Ledger by Year & Category
  const filteredProblems = useMemo(() => {
    return DETAILED_PROBLEMS.filter((p) => {
      const matchYear = selectedYear === "ALL" || p.year === selectedYear;
      const matchCat =
        categoryFilter === "ALL" ||
        p.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        p.categoryKey === categoryFilter;
      const matchSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchYear && matchCat && matchSearch;
    });
  }, [selectedYear, categoryFilter, searchQuery]);

  // Selected Year Label Object
  const currentYearObj = useMemo(() => {
    return YEAR_OPTIONS.find((y) => y.id === selectedYear) || YEAR_OPTIONS[1];
  }, [selectedYear]);

  // Handle PDF Export with selected year branding
  const handleDownloadPdfReport = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 15;

      // Top Primary Header Banner
      doc.setFillColor(13, 57, 113); // #0d3971
      doc.rect(0, 0, pageWidth, 28, "F");

      doc.setFillColor(29, 78, 216); // #1d4ed8 stripe
      doc.rect(0, 28, pageWidth, 2.5, "F");

      // Header Brand Text
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SolveSphere Jharkhand", margin, 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(
        `Industry Innovation & CSR Impact Report • ${currentYearObj.label} (${currentYearObj.sublabel})`,
        margin,
        18
      );

      const dateStr = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.setFontSize(8);
      doc.text(`Generated: ${dateStr}`, pageWidth - margin, 18, { align: "right" });

      yPos = 38;

      // Partner Organization Box
      doc.setFillColor(245, 249, 253);
      doc.roundedRect(margin, yPos, pageWidth - margin * 2, 22, 2, 2, "F");
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, yPos, pageWidth - margin * 2, 22, 2, 2, "S");

      doc.setTextColor(13, 57, 113);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(companyName, margin + 4, yPos + 7);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Type: ${companyProfile.companyType || "Enterprise"}   |   Audit Period: ${currentYearObj.label}   |   Domain: ${companyProfile.industryDomain || "IT & Public Infra"}`,
        margin + 4,
        yPos + 13
      );
      doc.text(
        `Areas of Interest: ${(companyProfile.areasOfInterest || ["Smart City", "Water", "Agriculture"]).join(", ")}`,
        margin + 4,
        yPos + 18
      );

      yPos += 30;

      // Section 1: Executive KPI Metrics for Selected Year
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(13, 57, 113);
      doc.text(`1. Executive Summary & KPI Snapshot (${currentYearObj.label})`, margin, yPos);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);

      yPos += 7;

      const kpis = [
        { label: "Projects Supported", value: String(yearDataset.kpis.projectsSupported), color: [29, 78, 216] },
        { label: "Solutions Deployed", value: String(yearDataset.kpis.solutionsDeployed), color: [16, 185, 129] },
        { label: "Avg. Resolution", value: `${yearDataset.kpis.avgResolutionDays} Days`, color: [245, 158, 11] },
        { label: "CSR Committed", value: `Rs. ${yearDataset.kpis.csrCommitted} L`, color: [139, 92, 246] },
      ];

      const cardWidth = (pageWidth - margin * 2 - 9) / 4;
      kpis.forEach((kpi, idx) => {
        const x = margin + idx * (cardWidth + 3);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, yPos, cardWidth, 18, 1.5, 1.5, "F");
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(x, yPos, cardWidth, 18, 1.5, 1.5, "S");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
        doc.text(kpi.value, x + cardWidth / 2, yPos + 8, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(kpi.label, x + cardWidth / 2, yPos + 14, { align: "center" });
      });

      yPos += 26;

      // Section 2: Category Breakdown
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(13, 57, 113);
      doc.text("2. Industry-Supported Civic Challenges by Category", margin, yPos);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);

      yPos += 7;

      yearDataset.categories.forEach((cat) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        doc.text(`${cat.name} (${cat.count} problems supported)`, margin + 2, yPos + 3.5);

        doc.setTextColor(29, 78, 216);
        doc.text(`Res. Rate: ${cat.resolutionRate}% | Funding: Rs. ${cat.investment}L`, pageWidth - margin - 2, yPos + 3.5, {
          align: "right",
        });

        const barWidth = pageWidth - margin * 2 - 4;
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(margin + 2, yPos + 5, barWidth, 3, 1, 1, "F");

        doc.setFillColor(29, 78, 216);
        doc.roundedRect(margin + 2, yPos + 5, (barWidth * cat.resolutionRate) / 100, 3, 1, 1, "F");

        yPos += 11;
      });

      yPos += 6;

      // Section 3: Key Deployments
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(13, 57, 113);
      doc.text("3. Active Field Deployments & Academic HEI Partners", margin, yPos);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);

      yPos += 7;

      filteredProblems.slice(0, 4).forEach((p) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`• ${p.title} (${p.category}) - Year: ${p.year}`, margin + 2, yPos);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`   Partner: ${p.university} | District: ${p.district} | Stage: ${p.stage} | Grant: ${p.grant}`, margin + 2, yPos + 4);

        yPos += 9;
      });

      // Footer
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `SolveSphere Platform • Government of Jharkhand Civic Innovation Ecosystem (${currentYearObj.label})`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );

      doc.save(`SolveSphere_Impact_Report_${selectedYear}_${companyName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Custom Recharts Tooltip
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
            <p className="text-xs font-bold text-slate-900">{data.name}</p>
          </div>
          <div className="mt-2 space-y-1 text-xs text-slate-600">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Period / Year:</span>
              <span className="font-bold text-blue-700">{currentYearObj.label}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Problems Supported:</span>
              <span className="font-bold text-slate-900">{data.count}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Resolution Rate:</span>
              <span className="font-bold text-emerald-600">{data.resolutionRate}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Sponsored Grant:</span>
              <span className="font-bold text-blue-600">₹{data.investment} Lakhs</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Avg. Turnaround:</span>
              <span className="font-bold text-amber-600">{data.avgDays} days</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-100 pt-1 text-[10px]">
              <span className="text-slate-400">Key HEI Partner:</span>
              <span className="font-semibold text-slate-700">{data.topPartner}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <IndustryModuleLayout
      title="Analytics & Reports"
      subtitle="Monitor industry participation, solution progress and collaboration performance."
      icon={BarChart3}
    >
      <div className="space-y-6">
        {/* Top Control & Action Banner with Year Selection Dropdown */}
        <div className="relative z-30 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-900 via-[#0d3971] to-[#132a4a] p-5 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 backdrop-blur-xs border border-blue-400/20">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Live Industry Impact Ledger • Showing {currentYearObj.label}
            </div>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Performance Intelligence & CSR Analytics
            </h2>
            <p className="mt-0.5 text-xs text-blue-200">
              Real-time analytics for <span className="font-semibold text-white">{companyName}</span> across 24
              districts and partner HEIs in Jharkhand.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Year Selection Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsYearDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white shadow-xs backdrop-blur-md hover:bg-white/20 transition active:scale-95"
              >
                <Calendar size={15} className="text-blue-300" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-wider text-blue-300 font-semibold">Select Year</span>
                  <span className="text-xs font-extrabold text-white">{currentYearObj.label}</span>
                </div>
                <ChevronDown
                  size={15}
                  className={`ml-1 text-blue-200 transition-transform duration-200 ${
                    isYearDropdownOpen ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu Popup */}
              {isYearDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Financial / Audit Year</p>
                    <p className="text-xs text-slate-500 font-medium">Select audit cycle to update analytics</p>
                  </div>
                  <div className="mt-1 space-y-1">
                    {YEAR_OPTIONS.map((yr) => {
                      const isSelected = selectedYear === yr.id;
                      return (
                        <button
                          key={yr.id}
                          type="button"
                          onClick={() => {
                            setSelectedYear(yr.id);
                            setIsYearDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                            isSelected
                              ? "bg-blue-50 text-[#0d3971] font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold">{yr.label}</span>
                              <span
                                className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                  isSelected
                                    ? "bg-blue-200/60 text-[#0d3971]"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {yr.badge}
                              </span>
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{yr.sublabel}</p>
                          </div>
                          {isSelected && <Check size={16} className="shrink-0 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* PDF Export Button */}
            <button
              onClick={handleDownloadPdfReport}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition active:scale-95 disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Generating PDF...
                </>
              ) : pdfSuccess ? (
                <>
                  <Check size={14} /> Report Downloaded!
                </>
              ) : (
                <>
                  <Download size={14} /> Download PDF Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Standardized Enterprise KPI Cards for Selected Year */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <TrendingUp size={22} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                {yearDataset.kpis.projectsTrend}
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">PROJECTS SUPPORTED</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{yearDataset.kpis.projectsSupported}</span>
              <span className="text-xs font-semibold text-slate-500">Initiatives</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Active co-developments with Jharkhand HEIs in {currentYearObj.label}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 size={22} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                {yearDataset.kpis.deploymentRate}
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">SOLUTIONS DEPLOYED</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{yearDataset.kpis.solutionsDeployed}</span>
              <span className="text-xs font-semibold text-slate-500">Field Pilots</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Validated in municipal wards & rural clusters during {selectedYear}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Clock3 size={22} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                {yearDataset.kpis.resolutionTrend}
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">AVERAGE RESOLUTION</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{yearDataset.kpis.avgResolutionDays}</span>
              <span className="text-xs font-semibold text-slate-500">Days</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">From problem intake to functional prototype review</p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-purple-300 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <IndianRupee size={22} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700">
                {yearDataset.kpis.csrTrend}
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">CSR / TECH COMMITTED</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{yearDataset.kpis.csrCommitted}</span>
              <span className="text-xs font-semibold text-slate-500">Lakhs</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Direct hardware, cloud compute & prototype grants in {selectedYear}</p>
          </div>
        </div>

        {/* Primary Interactive Chart Section: Category-wise Bar Graph */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <BarChart3 size={16} />
                </span>
                <h2 className="text-lg font-extrabold text-[#0d3971]">
                  Industry-Supported Civic Challenges by Category ({currentYearObj.label})
                </h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Category-wise volume, resolution performance, and capital allocation across priority state domains for {currentYearObj.label}.
              </p>
            </div>

            {/* Metric Switcher Tabs */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-600">
              <button
                onClick={() => setMetricView("count")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  metricView === "count"
                    ? "bg-[#0d3971] text-white shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Supported Volume
              </button>
              <button
                onClick={() => setMetricView("resolutionRate")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  metricView === "resolutionRate"
                    ? "bg-[#0d3971] text-white shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Resolution Rate (%)
              </button>
              <button
                onClick={() => setMetricView("investment")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  metricView === "investment"
                    ? "bg-[#0d3971] text-white shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Grants (₹ Lakhs)
              </button>
            </div>
          </div>

          {/* Recharts Bar Chart with Distinct Category Colors */}
          <div className="mt-6 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dynamicCategoryData}
                margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="shortLabel"
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  unit={metricView === "resolutionRate" ? "%" : metricView === "investment" ? "L" : ""}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(241, 245, 249, 0.6)" }} />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  barSize={54}
                  animationDuration={900}
                >
                  {dynamicCategoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={
                        activeCategoryHighlight === null || activeCategoryHighlight === entry.name
                          ? 1
                          : 0.35
                      }
                      style={{ transition: "all 0.3s ease" }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Category Color Legend & Quick Cards */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3 lg:grid-cols-5">
            {dynamicCategoryData.map((cat) => (
              <div
                key={cat.name}
                onMouseEnter={() => setActiveCategoryHighlight(cat.name)}
                onMouseLeave={() => setActiveCategoryHighlight(null)}
                onClick={() => setCategoryFilter(categoryFilter === cat.name ? "ALL" : cat.name)}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                  categoryFilter === cat.name
                    ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-md shadow-2xs"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate text-xs font-bold text-slate-800">{cat.name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Supported:</span>
                  <span className="font-extrabold text-slate-900">{cat.count}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Res. Rate:</span>
                  <span className="font-bold text-emerald-600">{cat.resolutionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Secondary Analytics Grid: Stage Pipeline & District Coverage */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Stage Pipeline Breakdown for Selected Year */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0d3971]">Lifecycle Stage Funnel</h3>
                <p className="text-xs text-slate-500">Distribution across TRL levels in {currentYearObj.label}</p>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {yearDataset.kpis.projectsSupported} Total Solutions
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {yearDataset.stages.map((st) => (
                <div key={st.stage}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{st.stage}</span>
                    <span className="font-semibold text-slate-500">
                      {st.count} Solutions ({st.percent}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${st.percent * 2.5}%`, backgroundColor: st.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5 text-xs text-emerald-900 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <span className="font-bold">Rapid Prototype Deployment:</span> {yearDataset.kpis.deploymentRate} of all industry-supported
                prototypes have progressed to active field testing and municipal ward deployment in {currentYearObj.label}.
              </div>
            </div>
          </div>

          {/* District-wise Impact & HEI Network for Selected Year */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0d3971]">District Deployment Reach</h3>
                <p className="text-xs text-slate-500">Active municipal & rural implementations in {currentYearObj.label}</p>
              </div>
              <Link
                to="/industry-dashboard/district-management"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View Map <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="mt-5 space-y-3.5">
              {yearDataset.districts.map((d) => (
                <div
                  key={d.district}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-white hover:border-slate-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-[#0d3971] text-xs font-black">
                      {d.projects}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{d.district}</p>
                      <p className="text-[10px] text-slate-500">{d.division}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                      {d.deployed} Deployed
                    </span>
                    <p className="mt-0.5 text-[10px] font-semibold text-slate-400">{d.progress}% Avg. Progress</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Industry Impact Ledger / Table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <Layers size={16} />
                </span>
                <h3 className="text-lg font-extrabold text-[#0d3971]">
                  Detailed Project Ledger ({currentYearObj.label})
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Showing initiatives, partner universities, funding commitments, and deployment status for {currentYearObj.label}.
              </p>
            </div>

            {/* Search and Category Quick Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search project, university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="ALL">All Categories</option>
                <option value="Water & Sanitation">Water & Sanitation</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Infrastructure & Roads">Infrastructure & Roads</option>
                <option value="Education & Literacy">Education & Literacy</option>
                <option value="Healthcare & Diagnostics">Healthcare & Diagnostics</option>
                <option value="Agriculture & Food Tech">Agriculture & Food Tech</option>
                <option value="Smart City & Mobility">Smart City & Mobility</option>
                <option value="Renewable Energy & Power">Renewable Energy</option>
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Project & Civic Problem</th>
                  <th className="py-3.5 px-3">Year</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Academic Partner</th>
                  <th className="py-3.5 px-3">District</th>
                  <th className="py-3.5 px-3">Stage / Progress</th>
                  <th className="py-3.5 px-3">Contribution</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No matching projects found for year {currentYearObj.label} with current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map((item) => {
                    const catInfo = CATEGORY_PALETTE[item.categoryKey] || {
                      color: "#3b82f6",
                      lightBg: "#eff6ff",
                      text: "#1d4ed8",
                      border: "#bfdbfe",
                    };

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.id}</p>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                            {item.year}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border"
                            style={{
                              backgroundColor: catInfo.lightBg,
                              color: catInfo.text,
                              borderColor: catInfo.border,
                            }}
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: catInfo.color }}
                            />
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">{item.university}</td>
                        <td className="py-3.5 px-3 text-slate-600">{item.district}</td>
                        <td className="py-3.5 px-3">
                          <div className="w-28">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                              <span>{item.stage}</span>
                              <span>{item.progress}%</span>
                            </div>
                            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-blue-600"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-medium text-slate-700">{item.contribution}</p>
                          <p className="text-[10px] font-bold text-purple-700">{item.grant}</p>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                              item.status === "Deployed"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status === "Active"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </IndustryModuleLayout>
  );
}
