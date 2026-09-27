import React, { useMemo, useState, useEffect } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  HelpCircle,
  Info,
  Loader2,
  MapPin,
  Sparkles,
  User,
  X,
  AlertCircle,
  Check,
  Search,
  Tag,
  Clock,
  Layers,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import { getRankedUniversitiesForChallenge } from "../../utils/aiUniversityMatcher";

const STORAGE_KEY = "solvesphere_university_assignments";

// Initial default approved challenges across Jharkhand districts
const defaultApprovedChallenges = [
  {
    id: "CH-8091",
    title: "AI-Powered Traffic Signal Synchronization in High-Density Corridors",
    submittedBy: "Dept. of Urban Transportation & Traffic",
    citizen_name: "Amitabh Sen (Civic Association)",
    category: "Rural Infrastructure",
    location: "Main Road & Albert Ekka Chowk, Ranchi",
    district: "Ranchi",
    date: "2026-08-28",
    priority: "High",
    urgency_score: 9,
    affected_people: "1,200,000 Commuters",
    budget: "₹2.5 Lakhs",
    status: "APPROVED",
    validationStatus: "Government Approved",
    description:
      "Implementing computer vision and real-time sensor analytics to dynamically optimize traffic light timers across critical intersections to reduce urban congestion and emergency corridor delays.",
  },
  {
    id: "CH-8088",
    title: "Solar-Microgrid Deployment for Rural Tribal Healthcare Centers",
    submittedBy: "Ministry of New & Renewable Energy / NHM",
    citizen_name: "Dr. Sunita Munda",
    category: "Clean Energy",
    location: "Torpa & Murhu Blocks, Khunti",
    district: "Khunti",
    date: "2026-08-25",
    priority: "High",
    urgency_score: 9,
    affected_people: "340,000 Patients",
    budget: "₹4.2 Lakhs",
    status: "APPROVED",
    validationStatus: "Government Approved",
    description:
      "Provisioning 24/7 uninterrupted solar power with lithium-ion storage for primary health centers in off-grid remote tribal villages to ensure vaccines and labor rooms remain fully operational.",
  },
  {
    id: "CH-8072",
    title: "Automated Water Contamination & Heavy Metal Detection Pipeline",
    submittedBy: "State Pollution Control Board",
    citizen_name: "Priya Sharma (Green Earth Forum)",
    category: "Water Management",
    location: "Subarnarekha River Basin, East Singhbhum",
    district: "East Singhbhum",
    date: "2026-08-21",
    priority: "High",
    urgency_score: 8,
    affected_people: "2,400,000 Residents",
    budget: "₹1.8 Lakhs",
    status: "APPROVED",
    validationStatus: "Government Approved",
    description:
      "IoT buoy networks along Subarnarekha and Damodar riverbanks measuring heavy metals, pH, and dissolved oxygen with automated early alerts for drinking water intake stations.",
  },
  {
    id: "CH-8065",
    title: "Early Forest Fire & Illegal Logging Detection via Drone Acoustic Grid",
    submittedBy: "Jharkhand Forest & Environment Dept.",
    citizen_name: "Manoj Oraon (Van Samiti)",
    category: "Clean Energy",
    location: "Betla Buffer Zone, Latehar",
    district: "Latehar",
    date: "2026-08-15",
    priority: "Medium",
    urgency_score: 7,
    affected_people: "85,000 Forest Dwellers",
    budget: "₹3.0 Lakhs",
    status: "APPROVED",
    validationStatus: "Government Approved",
    description:
      "Deploying solar-recharged acoustic micro-sensors and AI thermal surveillance along forest boundaries for instant wildfire ignition detection and geo-tagged ranger alerts.",
  },
  {
    id: "CH-8054",
    title: "IoT Sensor Groundwater Salinity & Fluoride Rapid Testing Network",
    submittedBy: "Rural Water Supply & Sanitation Mission",
    citizen_name: "Rajeshwar Mahto",
    category: "Water Management",
    location: "Daltonganj & Hussainabad, Palamu",
    district: "Palamu",
    date: "2026-08-10",
    priority: "High",
    urgency_score: 8,
    affected_people: "420,000 Villagers",
    budget: "₹2.2 Lakhs",
    status: "APPROVED",
    validationStatus: "Government Approved",
    description:
      "Community solar-powered digital spectrophotometers deployed at rural tube-wells providing instant contamination reports and SMS advisories to gram panchayats.",
  },
  {
    id: "CH-8042",
    title: "Smart Cold-Chain Storage & Solar Dryer for Minor Forest Produce",
    submittedBy: "Jharkhand State Tribal Cooperative (JHAMCOFED)",
    citizen_name: "Karan Bedia",
    category: "Rural Infrastructure",
    location: "Bishunpur & Raidih, Gumla",
    district: "Gumla",
    date: "2026-08-04",
    priority: "Medium",
    urgency_score: 7,
    affected_people: "65,000 Tribal Farmers",
    budget: "₹3.8 Lakhs",
    status: "APPROVED",
    validationStatus: "Government Approved",
    description:
      "Temperature-controlled hybrid solar storage units for Mahua, lac, and medicinal herbs preventing post-harvest spoilage and ensuring fair price realisation.",
  },
];

const isApprovedProblem = (problem) => {
  const status = String(problem?.status || "").trim().toUpperCase();
  return (
    status === "OPEN" ||
    status === "APPROVED AS ACTIVE CHALLENGE" ||
    status === "APPROVED" ||
    status === "UNDER_REVIEW" ||
    problem?.validationStatus === "Government Approved"
  );
};

const getLocation = (problem) => {
  const district = problem?.district || problem?.location?.district || "";
  const block = problem?.block || problem?.location?.block || "";
  if (district && block) return `${block}, ${district}`;
  return district || block || problem?.location || "Jharkhand";
};

const readAssignments = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const CATEGORIES = [
  "ALL",
  "Water Management",
  "Clean Energy",
  "Rural Infrastructure",
  "Health & MedTech",
  "Sanitation & Waste",
];

const ApprovedChallengesPage = () => {
  const { userProblems = [] } = useAuth();
  const { data: adminData } = useAdmin();

  // Assignments state
  const [assignments, setAssignments] = useState(readAssignments);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Challenge VIEW modal state
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Workflow states
  const [activeAssignChallenge, setActiveAssignChallenge] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedUniversities, setRecommendedUniversities] = useState([]);
  const [showAllUniversities, setShowAllUniversities] = useState(false);

  // University Action modals inside recommendation panel
  const [viewUniversity, setViewUniversity] = useState(null);
  const [whyUniversity, setWhyUniversity] = useState(null);
  const [confirmAssignUni, setConfirmAssignUni] = useState(null);
  const [isFinalAssigning, setIsFinalAssigning] = useState(false);
  const [assignedSuccessInfo, setAssignedSuccessInfo] = useState(null);

  useEffect(() => {
    const refresh = () => setAssignments(readAssignments());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const approvedChallenges = useMemo(() => {
    const combined = [
      ...(Array.isArray(userProblems) ? userProblems : []),
      ...(Array.isArray(adminData?.challenges) ? adminData.challenges : []),
      ...defaultApprovedChallenges,
    ].filter(isApprovedProblem);

    // Deduplicate by problem ID
    const unique = combined.filter(
      (problem, index, all) =>
        all.findIndex((item) => String(item.id) === String(problem.id)) === index
    );

    // Keep challenges that are NOT already actively accepted
    return unique.filter((problem) => {
      const assignment = assignments.find(
        (a) => String(a.challengeId) === String(problem.id)
      );
      if (assignment && assignment.status === "ACCEPTED") {
        return false;
      }
      return true;
    });
  }, [userProblems, adminData?.challenges, assignments]);

  // Filtered by search & category
  const filteredChallenges = useMemo(() => {
    return approvedChallenges.filter((item) => {
      const q = searchQuery.toLowerCase();
      const title = item.title || "";
      const desc = item.description || "";
      const cat = item.category || "";
      const loc = getLocation(item);
      const rep = item.citizen_name || item.citizenName || item.submittedBy || "";

      const matchesSearch =
        !q ||
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q) ||
        loc.toLowerCase().includes(q) ||
        rep.toLowerCase().includes(q) ||
        String(item.id).toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === "ALL" ||
        cat.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [approvedChallenges, searchQuery, selectedCategory]);

  // Top KPI metrics
  const stats = useMemo(() => {
    const total = approvedChallenges.length;
    const highUrgency = approvedChallenges.filter(
      (c) =>
        String(c.priority).toLowerCase() === "high" ||
        (c.urgency_score && c.urgency_score >= 8)
    ).length;

    const districtSet = new Set();
    approvedChallenges.forEach((c) => {
      const d = c.district || c.location?.district;
      if (d) districtSet.add(d);
    });

    return {
      total,
      highUrgency,
      districtsCount: districtSet.size || 6,
    };
  }, [approvedChallenges]);

  // Handle ASSIGN button click on an approved challenge
  const handleStartAssign = (problem) => {
    setActiveAssignChallenge(problem);
    setIsAnalyzing(true);
    setRecommendedUniversities([]);
    setShowAllUniversities(false);

    // 2.5-second AI loader requirement
    setTimeout(() => {
      const ranked = getRankedUniversitiesForChallenge(problem);
      setRecommendedUniversities(ranked);
      setIsAnalyzing(false);
    }, 2500);
  };

  // Handle final confirmation of university assignment
  const handleExecuteAssignment = () => {
    if (!activeAssignChallenge || !confirmAssignUni) return;

    setIsFinalAssigning(true);

    setTimeout(() => {
      const targetUniName = confirmAssignUni.universityName;
      const targetChallengeTitle = activeAssignChallenge.title || "Challenge";

      const current = readAssignments();
      const next = [
        ...current.filter((a) => String(a.challengeId) !== String(activeAssignChallenge.id)),
        {
          challengeId: activeAssignChallenge.id,
          title: activeAssignChallenge.title,
          category: activeAssignChallenge.category || "General",
          district: activeAssignChallenge.district || "Ranchi",
          location: getLocation(activeAssignChallenge),
          assignedUniversity: targetUniName,
          assignedUniversityEmail: confirmAssignUni.email || "partner@solvesphere.in",
          department: confirmAssignUni.department || "Engineering & Technology",
          status: "ACCEPTED",
          assignedAt: new Date().toISOString(),
          challenge: activeAssignChallenge,
          matchScore: confirmAssignUni.matchScore,
          matchReason: confirmAssignUni.matchReason,
        },
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setAssignments(next);
      window.dispatchEvent(new Event("storage"));

      setIsFinalAssigning(false);
      setConfirmAssignUni(null);
      setActiveAssignChallenge(null);
      setAssignedSuccessInfo({
        universityName: targetUniName,
        challengeTitle: targetChallengeTitle,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BadgeCheck size={16} className="text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
              Government Portal • Jharkhand Civic Hub
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Approved Challenges
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Validated citizen problems ready for AI university partner matching & HEI allocation across Jharkhand.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">
              AI Matching Engine Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. TOP 4 KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Available Approved
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.total}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
              <BadgeCheck size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Ready for university allocation
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                AI Match Readiness
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                100%
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-[#1769c2] border border-blue-100">
              <Sparkles size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            5 Jharkhand HEIs in pool
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                High Urgency
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.highUrgency}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Priority fast-track allocation
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Districts Covered
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.districtsCount}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600 border border-purple-100">
              <MapPin size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Jharkhand state jurisdiction
          </p>
        </div>
      </div>

      {/* 3. SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search approved challenges, districts, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs shadow-xs focus:border-[#1769c2] focus:outline-hidden focus:ring-2 focus:ring-[#1769c2]/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-[#1769c2] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SUCCESS BANNER MODAL */}
      {assignedSuccessInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-7 w-7 stroke-[3]" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">Challenge Assigned Successfully</h2>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-left text-xs space-y-2 border border-slate-100">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[9px] block">Assigned University</span>
                <span className="font-bold text-slate-900 text-sm">{assignedSuccessInfo.universityName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase text-[9px] block">Challenge</span>
                <span className="font-semibold text-slate-700">{assignedSuccessInfo.challengeTitle}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase text-[9px] block">Status</span>
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Accepted & In Progress
                </span>
              </div>
            </div>
            <button
              onClick={() => setAssignedSuccessInfo(null)}
              className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800"
            >
              Close Notification
            </button>
          </div>
        </div>
      )}

      {/* 4. APPROVED CHALLENGES GRID */}
      {filteredChallenges.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <BadgeCheck className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-3 text-base font-bold text-slate-700">No approved challenges matching criteria</h2>
          <p className="mt-1 text-sm text-slate-400">
            {searchQuery || selectedCategory !== "ALL"
              ? "Try resetting your search query or category filters."
              : "Government-approved citizen problems will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredChallenges.map((problem) => {
            const assignment = assignments.find((a) => String(a.challengeId) === String(problem.id));
            const isAssignedPending = assignment && assignment.status === "PENDING";
            const isRejected = assignment && assignment.status === "REJECTED";

            return (
              <article key={problem.id} className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-md">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                        <BadgeCheck className="h-3 w-3" /> APPROVED
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                        <Tag className="h-3 w-3 text-slate-400" />
                        {problem.category || "General"}
                      </span>
                      {problem.priority && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            String(problem.priority).toLowerCase() === "high"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-blue-50 text-[#1769c2] border border-blue-200"
                          }`}
                        >
                          {problem.priority} Priority
                        </span>
                      )}
                      {isAssignedPending && (
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200">
                          Assigned (Pending Response)
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 border border-rose-200">
                          Rejected by {assignment.rejectedBy || assignment.assignedUniversity || "University"}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 font-mono text-[11px] font-bold text-slate-400">
                      #{problem.id}
                    </span>
                  </div>

                  <h2 className="mt-3 text-base font-bold text-slate-900 leading-snug">
                    {problem.title || "Untitled Challenge"}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">
                    {problem.description || "No description available."}
                  </p>

                  <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{getLocation(problem)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {problem.citizen_name || problem.citizenName || problem.submittedBy || "Citizen / Community"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedProblem(problem)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Eye className="h-4 w-4 text-slate-500" /> View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartAssign(problem)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1769c2] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#12579f] shadow-xs transition"
                  >
                    <Sparkles className="h-4 w-4" /> AI Match & Assign
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* =========================================================
          MODAL 1: CHALLENGE DETAILS (VIEW)
      ========================================================= */}
      {selectedProblem && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-100 bg-white p-5">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <BadgeCheck className="h-3 w-3" /> GOVERNMENT APPROVED
                </span>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{selectedProblem.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProblem(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Challenge ID</p>
                <p className="mt-1 text-sm font-semibold font-mono text-slate-800">#{selectedProblem.id}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Problem Statement & Scope</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedProblem.description || "Not provided"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Category</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedProblem.category || "Not provided"}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Location</p>
                  <p className="mt-1 font-semibold text-slate-800">{getLocation(selectedProblem)}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">District (Jharkhand)</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedProblem.district || selectedProblem.location?.district || "Jharkhand"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Priority Level</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedProblem.priority || "High Priority"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Estimated Affected Citizens</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedProblem.affected_people || selectedProblem.affected || "10,000+ Residents"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Estimated Pilot Budget</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedProblem.budget || "₹2.5 Lakhs"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const prob = selectedProblem;
                    setSelectedProblem(null);
                    handleStartAssign(prob);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1769c2] py-3 text-xs font-bold text-white hover:bg-[#12579f]"
                >
                  <Sparkles className="h-4 w-4" /> Start AI University Partner Match
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          AI ANALYSIS LOADER (2.5 Seconds)
      ========================================================= */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-2xl">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-[#1769c2]">
              <Sparkles className="h-10 w-10 animate-pulse text-[#1769c2]" />
              <Loader2 className="absolute inset-0 m-auto h-16 w-16 animate-spin text-blue-300/60" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">AI Partner Matching</h3>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
              Evaluating department alignment, faculty expertise, and geographic proximity across Jharkhand HEIs...
            </p>
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-full animate-pulse rounded-full bg-[#1769c2]" />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: RECOMMENDED UNIVERSITIES DASHBOARD
      ========================================================= */}
      {!isAnalyzing && activeAssignChallenge && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 bg-white p-6 shrink-0">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1769c2]">
                  <Sparkles className="h-4 w-4" /> AI Partner Matching Engine
                </div>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">Recommended Jharkhand Universities</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Target Challenge: <span className="font-bold text-slate-800">{activeAssignChallenge.title}</span> ({activeAssignChallenge.district || "Jharkhand"})
                </p>
              </div>
              <button
                onClick={() => setActiveAssignChallenge(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Table Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {recommendedUniversities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-sm font-bold text-slate-700">No partner universities found</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Registered university accounts will be matched based on domain and proximity.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3.5">University / HEI</th>
                          <th className="px-4 py-3.5">Department</th>
                          <th className="px-4 py-3.5">Key Expertise</th>
                          <th className="px-4 py-3.5">Match Score</th>
                          <th className="px-4 py-3.5">NIRF / Ranking</th>
                          <th className="px-4 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {(showAllUniversities
                          ? recommendedUniversities
                          : recommendedUniversities.slice(0, 4)
                        ).map((uni) => (
                          <tr key={uni.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* UNIVERSITY */}
                            <td className="px-4 py-4 font-bold text-slate-900 max-w-[220px]">
                              <div className="truncate text-sm">{uni.universityName}</div>
                              <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                {uni.location || uni.district || "Jharkhand"}
                              </div>
                            </td>

                            {/* DEPARTMENT */}
                            <td className="px-4 py-4 font-medium text-slate-700 max-w-[170px]">
                              <span className="truncate block">{uni.department || "Engineering & Research"}</span>
                            </td>

                            {/* EXPERTISE */}
                            <td className="px-4 py-4 text-slate-600 max-w-[220px]">
                              {uni.expertiseAreas && uni.expertiseAreas.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {uni.expertiseAreas.slice(0, 2).map((exp) => (
                                    <span
                                      key={exp}
                                      className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-[#1769c2] border border-blue-100 truncate"
                                    >
                                      {exp}
                                    </span>
                                  ))}
                                  {uni.expertiseAreas.length > 2 && (
                                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                                      +{uni.expertiseAreas.length - 2}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Applied Research</span>
                              )}
                            </td>

                            {/* MATCH */}
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                <Sparkles className="h-3 w-3" />
                                {uni.matchScore}
                              </span>
                            </td>

                            {/* RANKING (NIRF) */}
                            <td className="px-4 py-4 font-semibold text-slate-600">
                              {uni.nirfRanking ? (
                                <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-100">
                                  {uni.nirfRanking}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Accredited</span>
                              )}
                            </td>

                            {/* ACTIONS */}
                            <td className="px-4 py-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setWhyUniversity(uni)}
                                  className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1769c2] hover:bg-blue-100 transition"
                                >
                                  Why
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setViewUniversity(uni)}
                                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                                >
                                  View
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmAssignUni(uni)}
                                  className="rounded-xl bg-[#1769c2] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#12579f] shadow-xs transition"
                                >
                                  Assign
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* View More Button */}
                  {!showAllUniversities && recommendedUniversities.length > 4 && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => setShowAllUniversities(true)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
                      >
                        View More ({recommendedUniversities.length - 4} remaining) <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          UNIVERSITY VIEW MODAL
      ========================================================= */}
      {viewUniversity && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">University Details</span>
                <h3 className="text-xl font-bold text-slate-900">{viewUniversity.universityName}</h3>
              </div>
              <button onClick={() => setViewUniversity(null)} className="rounded-xl p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Department</span>
                  <span className="font-semibold text-slate-800">{viewUniversity.department || "Not provided"}</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">NIRF Ranking</span>
                  <span className="font-semibold text-slate-800">
                    {viewUniversity.nirfRanking || "Accredited"}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Location</span>
                  <span className="font-semibold text-slate-800">{viewUniversity.location || "Jharkhand"}</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">District</span>
                  <span className="font-semibold text-slate-800">{viewUniversity.district || "Jharkhand"}</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[9px] font-bold uppercase text-slate-400 block">Areas of Expertise</span>
                <span className="font-semibold text-slate-800">
                  {viewUniversity.expertiseAreas && viewUniversity.expertiseAreas.length > 0
                    ? viewUniversity.expertiseAreas.join(", ")
                    : "IoT, Sustainable Engineering, Civic Tech"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Contact Person</span>
                  <span className="font-semibold text-slate-800">{viewUniversity.contactPerson || "Dean (Research & Innovations)"}</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Contact Number</span>
                  <span className="font-semibold text-slate-800">{viewUniversity.contactNumber || "+91 651 227 5444"}</span>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-800">AI Match Score</span>
                <span className="text-base font-bold text-emerald-700">{viewUniversity.matchScore}</span>
              </div>
            </div>

            <button
              onClick={() => setViewUniversity(null)}
              className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          UNIVERSITY WHY MODAL
      ========================================================= */}
      {whyUniversity && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#1769c2]" />
                <h3 className="text-lg font-bold text-slate-900">Why this university?</h3>
              </div>
              <button onClick={() => setWhyUniversity(null)} className="rounded-xl p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-blue-50/60 p-4 border border-blue-100">
              <p className="text-xs font-bold text-slate-800 mb-1">{whyUniversity.universityName}</p>
              <p className="text-xs leading-5 text-slate-700">{whyUniversity.matchReason}</p>
            </div>

            <button
              onClick={() => setWhyUniversity(null)}
              className="mt-5 w-full rounded-xl bg-[#1769c2] py-2.5 text-xs font-bold text-white hover:bg-[#12579f]"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          UNIVERSITY ASSIGN CONFIRMATION MODAL & LOADER
      ========================================================= */}
      {confirmAssignUni && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            {isFinalAssigning ? (
              <div className="py-6 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#1769c2]" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">Assigning Challenge...</h3>
                <p className="mt-1 text-xs text-slate-500">Creating university assignment record...</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Assign Challenge</span>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">Confirm Assignment</h3>
                  </div>
                  <button onClick={() => setConfirmAssignUni(null)} className="rounded-xl p-1 text-slate-400 hover:bg-slate-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-4 text-xs leading-6 text-slate-600">
                  Are you sure you want to assign this challenge to:
                </p>

                <div className="mt-2 rounded-xl bg-slate-50 p-4 border border-slate-200 text-center font-bold text-sm text-slate-900">
                  {confirmAssignUni.universityName}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setConfirmAssignUni(null)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteAssignment}
                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                  >
                    Yes, Assign
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedChallengesPage;
