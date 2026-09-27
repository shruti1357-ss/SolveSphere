import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  Building2,
  MapPin,
  Tag,
  CalendarDays,
  Clock,
  ShieldCheck,
  Search,
  Eye,
  X,
  Sparkles,
  Layers,
  GraduationCap,
  ChevronRight,
  AlertCircle,
  Check,
} from "lucide-react";

const STORAGE_KEY = "solvesphere_university_assignments";

const defaultInitialAssignments = [
  {
    challengeId: "CH-8072",
    title: "Safe Drinking Water IoT Monitoring in Rural Villages",
    category: "Water Management",
    district: "East Singhbhum",
    location: "Ghatshila & Potka, East Singhbhum",
    assignedUniversity: "NIT Jamshedpur (Dept. of Civil & Environmental Engg)",
    assignedUniversityEmail: "research@nitjsr.ac.in",
    department: "Civil & Environmental Engineering",
    contactPerson: "Dr. R. K. Singh",
    status: "ACCEPTED",
    assignedAt: "2026-09-24T10:30:00.000Z",
    matchScore: "94%",
    matchReason: "Specialized expertise in water treatment, river sensors, and water pollution monitoring across Jharkhand.",
    challenge: {
      id: "CH-8072",
      title: "Safe Drinking Water IoT Monitoring in Rural Villages",
      category: "Water Management",
      district: "East Singhbhum",
      location: "Ghatshila & Potka, East Singhbhum",
      priority: "High",
      budget: "₹1.8 Lakhs",
      affected_people: "2,400,000 Residents",
      description:
        "Deployment of IoT sensors along rural water collection points and river basins measuring pH, heavy metals, and turbidity with automated SMS alerts for panchayats.",
    },
  },
  {
    challengeId: "CH-7912",
    title: "Blockchain-Based Land Record & Deed Verification System",
    category: "Rural Infrastructure",
    district: "Ranchi",
    location: "Kanke & Ormanjhi, Ranchi",
    assignedUniversity: "BIT Mesra (Birla Institute of Technology)",
    assignedUniversityEmail: "innovate@bitmesra.ac.in",
    department: "Computer Science & Rural Technology",
    contactPerson: "Dr. Alok Kumar (Dean R&D)",
    status: "ACCEPTED",
    assignedAt: "2026-09-18T14:15:00.000Z",
    matchScore: "96%",
    matchReason: "High domain alignment in distributed ledger systems, geospatial GIS land registry, and smart contracts.",
    challenge: {
      id: "CH-7912",
      title: "Blockchain-Based Land Record & Deed Verification System",
      category: "Rural Infrastructure",
      district: "Ranchi",
      location: "Kanke & Ormanjhi, Ranchi",
      priority: "High",
      budget: "₹3.5 Lakhs",
      affected_people: "4,500,000 Citizens",
      description:
        "Tamper-proof digital title registry eliminating property fraud and streamlining urban-rural property deed audits across Jharkhand revenue circles.",
    },
  },
  {
    challengeId: "CH-7950",
    title: "Municipal Solid Waste Automated NIR Sorting Systems",
    category: "Sanitation & Waste",
    district: "Dhanbad",
    location: "Dhanbad Municipal Corporation",
    assignedUniversity: "IIT (ISM) Dhanbad CleanTech Lab",
    assignedUniversityEmail: "rnd@iitism.ac.in",
    department: "Environmental Engineering & Clean Energy",
    contactPerson: "Prof. S. Bhattacharya",
    status: "ACCEPTED",
    assignedAt: "2026-09-12T09:00:00.000Z",
    matchScore: "95%",
    matchReason: "Direct experience with robotics and NIR spectroscopy sorting units at material recovery facilities.",
    challenge: {
      id: "CH-7950",
      title: "Municipal Solid Waste Automated NIR Sorting Systems",
      category: "Sanitation & Waste",
      district: "Dhanbad",
      location: "Dhanbad Municipal Corporation",
      priority: "Medium",
      budget: "₹5.0 Lakhs",
      affected_people: "950,000 Residents",
      description:
        "Robotics and NIR spectroscopy sorting units at material recovery facilities to boost dry waste recycling rates and reduce landfill volume.",
    },
  },
  {
    challengeId: "CH-7880",
    title: "Tele-Ophthalmology & Tribal Mobile Diagnostic Clinics",
    category: "Health & MedTech",
    district: "Khunti",
    location: "Murhu & Torpa, Khunti",
    assignedUniversity: "Ranchi University (Tech Institute)",
    assignedUniversityEmail: "civictech@ranchiuniversity.ac.in",
    department: "Information Technology & Civic Systems",
    contactPerson: "Dr. Ananya Mishra",
    status: "PENDING",
    assignedAt: "2026-09-26T11:45:00.000Z",
    matchScore: "88%",
    matchReason: "Strong track record in citizen telehealth logistics and rural clinic tele-consultations.",
    challenge: {
      id: "CH-7880",
      title: "Tele-Ophthalmology & Tribal Mobile Diagnostic Clinics",
      category: "Health & MedTech",
      district: "Khunti",
      location: "Murhu & Torpa, Khunti",
      priority: "High",
      budget: "₹3.2 Lakhs",
      affected_people: "180,000 Citizens",
      description:
        "Van-mounted automated fundus cameras and AI diagnostic kits transmitting real-time retinal scans to district hospital ophthalmologists.",
    },
  },
];

const readAssignments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInitialAssignments));
      return defaultInitialAssignments;
    }
    const value = JSON.parse(raw);
    if (!Array.isArray(value) || value.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInitialAssignments));
      return defaultInitialAssignments;
    }
    // Filter out dummy placeholder "XYZ university" if present and merge with default
    const cleaned = value.map((item) => {
      if (item.assignedUniversity === "XYZ university" || item.assignedUniversity === "XYZ") {
        return {
          ...item,
          assignedUniversity: "NIT Jamshedpur (Dept. of Civil Engg)",
          department: "Civil & Environmental Engineering",
          location: "East Singhbhum, Jharkhand",
          district: "East Singhbhum",
          matchScore: "94%",
          matchReason: "Specialized expertise in water systems and environmental engineering.",
        };
      }
      return item;
    });
    return cleaned;
  } catch {
    return defaultInitialAssignments;
  }
};

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  try {
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
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

const renderStatusBadge = (status, rejectedBy, assignedUniversity) => {
  const normalized = String(status || "").trim().toUpperCase();

  if (normalized === "ACCEPTED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Accepted
      </span>
    );
  }

  if (normalized === "REJECTED") {
    const uniName = rejectedBy || assignedUniversity || "University";
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Rejected by {uniName}
      </span>
    );
  }

  // PENDING or default
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
      Pending Response
    </span>
  );
};

const AssignedChallengesPage = () => {
  const [assignments, setAssignments] = useState(readAssignments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const refresh = () => setAssignments(readAssignments());

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const challenge = item.challenge || {};
      const title = challenge.title || item.title || "";
      const category = challenge.category || item.category || "General";
      const university = item.assignedUniversity || "";
      const district =
        challenge.district ||
        challenge.location?.district ||
        challenge.location ||
        item.district ||
        item.location ||
        "";
      const id = String(item.challengeId || challenge.id || "");
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        !q ||
        title.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q) ||
        university.toLowerCase().includes(q) ||
        district.toLowerCase().includes(q) ||
        id.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === "ALL" ||
        category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [assignments, searchQuery, selectedCategory]);

  const summary = useMemo(() => {
    const total = assignments.length;
    const acceptedCount = assignments.filter(
      (a) => String(a.status || "").toUpperCase() === "ACCEPTED"
    ).length;
    const pendingCount = assignments.filter(
      (a) => String(a.status || "").toUpperCase() === "PENDING"
    ).length;
    const uniqueUnis = new Set(
      assignments.map((a) => a.assignedUniversity).filter(Boolean)
    ).size;

    return {
      total,
      accepted: acceptedCount,
      pending: pendingCount,
      universities: uniqueUnis || 3,
    };
  }, [assignments]);

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#1769c2]" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#1769c2]">
              Government Portal • Higher Education Partner Tracking
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Assigned Challenges
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time status tracking and execution monitoring of societal challenges assigned to Jharkhand HEI partners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 shadow-xs">
            <Building2 size={14} className="text-[#1769c2]" />
            <span className="text-xs font-semibold text-[#1769c2]">
              {summary.universities} Jharkhand Universities Active
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
                Total Assigned
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.total}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-[#1769c2] border border-blue-100">
              <Layers size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Challenges allocated to HEIs
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Accepted & Active
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.accepted}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Currently in technical execution
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pending Response
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.pending}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Awaiting university sign-off
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Partner HEIs Engaged
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.universities}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600 border border-purple-100">
              <GraduationCap size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Jharkhand engineering institutes
          </p>
        </div>
      </div>

      {/* 3. SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assignments, universities, or districts..."
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

      {/* 4. ASSIGNMENTS DATA TABLE */}
      {filteredAssignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <CheckCircle2 className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-3 text-base font-bold text-slate-700">
            {assignments.length === 0
              ? "No challenges assigned yet"
              : "No matching assignments found"}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {assignments.length === 0
              ? "Challenges assigned to universities via Approved Challenges will appear here."
              : "Try adjusting your search query or category filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3.5">Challenge Title & ID</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">District / Location</th>
                  <th className="px-4 py-3.5">Assigned University</th>
                  <th className="px-4 py-3.5">Assignment Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredAssignments.map((item, index) => {
                  const challenge = item.challenge || {};
                  const title = challenge.title || item.title || "Untitled Challenge";
                  const category = challenge.category || item.category || "General";
                  const district =
                    challenge.district ||
                    challenge.location?.district ||
                    challenge.location ||
                    item.district ||
                    item.location ||
                    "Jharkhand";
                  const university = item.assignedUniversity || "Not assigned";
                  const dateStr = formatDate(item.assignedAt);
                  const cid = item.challengeId || challenge.id || `CH-${index + 1}`;

                  return (
                    <tr
                      key={cid}
                      className="transition hover:bg-slate-50/80"
                    >
                      {/* Challenge Title */}
                      <td className="max-w-xs px-4 py-4">
                        <p className="font-bold text-slate-900 line-clamp-2">
                          {title}
                        </p>
                        <span className="mt-0.5 inline-block font-mono text-[10px] text-slate-400 font-bold">
                          #{cid}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                          <Tag className="h-3 w-3 text-slate-400" />
                          {category}
                        </span>
                      </td>

                      {/* District / Location */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="truncate max-w-[140px]">{district}</span>
                        </div>
                      </td>

                      {/* Assigned University */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <Building2 className="h-4 w-4 shrink-0 text-[#1769c2]" />
                          <span className="truncate max-w-[200px]">{university}</span>
                        </div>
                      </td>

                      {/* Assignment Date */}
                      <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Assignment Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {renderStatusBadge(
                          item.status,
                          item.rejectedBy,
                          item.assignedUniversity
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedAssignment(item)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#1769c2] hover:bg-blue-50 transition shadow-2xs"
                        >
                          <Eye className="h-3.5 w-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ASSIGNMENT DETAILS MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-100 bg-white p-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#1769c2] border border-blue-200">
                    <ShieldCheck className="h-3 w-3" /> UNIVERSITY ASSIGNMENT
                  </span>
                  {renderStatusBadge(selectedAssignment.status)}
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {selectedAssignment.challenge?.title || selectedAssignment.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 text-xs">
              {/* Challenge Description */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Problem Description & Requirements
                </p>
                <p className="mt-2 leading-6 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedAssignment.challenge?.description ||
                    "Technical solution design and prototyping assigned to partner university for pilot implementation."}
                </p>
              </div>

              {/* University Details */}
              <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#1769c2]" />
                    <span className="font-bold text-sm text-slate-900">
                      {selectedAssignment.assignedUniversity}
                    </span>
                  </div>
                  {selectedAssignment.matchScore && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <Sparkles className="h-3 w-3" />
                      {selectedAssignment.matchScore} Match Score
                    </span>
                  )}
                </div>

                {selectedAssignment.matchReason && (
                  <p className="text-slate-600 leading-5">
                    {selectedAssignment.matchReason}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Email</span>
                    <span className="font-semibold text-slate-800">
                      {selectedAssignment.assignedUniversityEmail || "partner@solvesphere.in"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Assignment Date</span>
                    <span className="font-semibold text-slate-800">
                      {formatDate(selectedAssignment.assignedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Metadata */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Category</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedAssignment.challenge?.category || selectedAssignment.category || "General"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">District</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedAssignment.challenge?.district || selectedAssignment.district || "Jharkhand"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Target Budget</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedAssignment.challenge?.budget || "₹2.5 Lakhs"}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedChallengesPage;
