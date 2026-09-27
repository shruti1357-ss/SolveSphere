import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Eye,
  Check,
  X,
  HelpCircle,
  Filter,
  Search,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  AlertTriangle,
  ThumbsUp,
  Clock,
  Layers,
  FileText,
  Sparkles,
  Tag,
  CheckCircle2,
} from "lucide-react";

import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";

import StatusBadge from "../../components/admin/common/StatusBadge";
import Pagination from "../../components/admin/common/Pagination";
import EmptyState from "../../components/admin/common/EmptyState";
import DetailModal from "../../components/admin/common/DetailModal";
import ConfirmationModal from "../../components/admin/common/ConfirmationModal";

const BACKEND_STATUSES = {
  UNDER_REVIEW: "UNDER_REVIEW",
  OPEN: "OPEN",
  ASSIGNED_TO_HEI: "ASSIGNED_TO_HEI",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
};

const CATEGORIES = [
  "ALL",
  "Water Management",
  "Clean Energy",
  "Rural Infrastructure",
  "Health & MedTech",
  "Sanitation & Waste",
  "Agriculture & FoodTech",
];

const getBackendStatus = (status) => {
  const normalized = String(status || "").trim().toUpperCase();

  if (
    normalized === BACKEND_STATUSES.UNDER_REVIEW ||
    normalized === "UNDER REVIEW" ||
    normalized === "PENDING REVIEW" ||
    normalized === "UNDER AI ANALYSIS" ||
    normalized === "PENDING GOVERNMENT REVIEW" ||
    normalized === "PENDING"
  ) {
    return BACKEND_STATUSES.UNDER_REVIEW;
  }

  return normalized;
};

const getPriorityFromUrgency = (urgencyScore) => {
  const score = Number(urgencyScore);

  if (Number.isNaN(score)) return "Medium";
  if (score >= 7) return "High";
  if (score >= 4) return "Medium";

  return "Low";
};

// Sanitize any out-of-state locations strictly to Jharkhand
const getDisplayLocation = (challenge) => {
  let district = challenge?.district || challenge?.location?.district || "";
  let block = challenge?.block || challenge?.location?.block || "";
  let loc = challenge?.location || "";

  if (typeof loc === "string") {
    if (loc.toLowerCase().includes("bengaluru") || loc.toLowerCase().includes("karnataka")) {
      return "Main Road, Ranchi, Jharkhand";
    }
    if (loc.toLowerCase().includes("varanasi") || loc.toLowerCase().includes("uttar pradesh")) {
      return "Subarnarekha River Basin, East Singhbhum, Jharkhand";
    }
  }

  if (district && block) {
    return `${block}, ${district}`;
  }

  return loc || district || block || "Ranchi, Jharkhand";
};

const sanitizeDistrict = (challenge) => {
  let district = challenge?.district || challenge?.location?.district || "";
  let loc = typeof challenge?.location === "string" ? challenge.location.toLowerCase() : "";

  if (loc.includes("bengaluru") || loc.includes("karnataka") || district.toLowerCase().includes("bengaluru")) {
    return "Ranchi";
  }
  if (loc.includes("varanasi") || loc.includes("uttar pradesh") || district.toLowerCase().includes("varanasi")) {
    return "East Singhbhum";
  }

  return district || "Ranchi";
};

const sanitizeCategory = (category) => {
  if (category === "Smart Mobility") return "Rural Infrastructure";
  if (category === "Environmental") return "Water Management";
  return category || "Rural Infrastructure";
};

const PendingScrutinyPage = () => {
  const { data, requestChallengeInfo, approveChallenge } = useAdmin();

  const {
    userProblems,
    approveCitizenProblemAsChallenge,
    rejectCitizenProblem,
    showToast,
  } = useAuth();

  const { searchQuery: globalSearch } = useOutletContext() || {};

  const [localSearch, setLocalSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 6;

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [rejectTargetId, setRejectTargetId] = useState(null);

  const [infoTargetChallenge, setInfoTargetChallenge] = useState(null);
  const [infoNotes, setInfoNotes] = useState("");

  /*
   * Citizen reports are converted into the same frontend shape
   */
  const citizenPendingProblems = useMemo(() => {
    return (userProblems || [])
      .filter((problem) => {
        const status = getBackendStatus(problem.status);

        return (
          status === BACKEND_STATUSES.UNDER_REVIEW ||
          status === "PENDING" ||
          status === "PENDING_REVIEW" ||
          status === "UNDER_AI_ANALYSIS"
        );
      })
      .map((problem) => {
        const urgencyScore =
          problem.urgency_score ??
          problem.urgencyScore ??
          problem.severity_score ??
          problem.severityScore ??
          problem.priorityScore;

        const cat = sanitizeCategory(problem.category);
        const dist = sanitizeDistrict(problem);
        const loc = getDisplayLocation(problem);

        return {
          id: problem.id,
          title: problem.title || "Untitled Challenge",
          description: problem.description || "",
          category: cat,
          district: dist,
          block: problem.block || problem.location?.block || "",
          location: loc,
          latitude: problem.latitude ?? problem.coordinates?.[1] ?? 23.3441,
          longitude: problem.longitude ?? problem.coordinates?.[0] ?? 85.3096,
          urgency_score:
            urgencyScore !== undefined && urgencyScore !== null
              ? Number(urgencyScore)
              : 8.0,
          upvotes: Number(problem.upvotes || 0),
          citizen_name:
            problem.citizen_name ||
            problem.citizenName ||
            problem.submittedBy ||
            "Citizen / Community",
          citizen_phone:
            problem.citizen_phone || problem.citizenPhone || "",
          is_anonymous: Boolean(
            problem.is_anonymous ?? problem.isAnonymous ?? false
          ),
          media_urls:
            problem.media_urls || problem.mediaUrls || [],
          assigned_university:
            problem.assigned_university || problem.assignedUniversity || null,
          status: BACKEND_STATUSES.UNDER_REVIEW,
          priority:
            problem.priority || getPriorityFromUrgency(urgencyScore),
          submittedBy:
            problem.submittedBy || problem.submittedByRole || "Citizen / Community",
          impactTarget:
            problem.impactTarget || problem.affected || "Community Residents",
          affected:
            problem.affected || "Community Residents",
          sourceType: "Citizen Report",
          infoRequested: Boolean(problem.infoRequested),
          infoRequestNotes: problem.infoRequestNotes || "",
          created_at: problem.created_at || problem.createdAt || "2026-09-15",
        };
      });
  }, [userProblems]);

  /*
   * AdminContext challenges normalized
   */
  const adminPendingChallenges = useMemo(() => {
    const citizenIds = new Set(
      citizenPendingProblems.map((problem) => String(problem.id))
    );

    return (data?.challenges || [])
      .filter((challenge) => {
        const status = getBackendStatus(challenge.status);

        return (
          status === BACKEND_STATUSES.UNDER_REVIEW ||
          status === "PENDING"
        );
      })
      .filter(
        (challenge) =>
          !citizenIds.has(
            String(challenge.sourceProblemId ?? challenge.id)
          )
      )
      .map((challenge) => {
        const urgencyScore =
          challenge.urgency_score ??
          challenge.urgencyScore ??
          challenge.severity_score ??
          challenge.severityScore;

        const cat = sanitizeCategory(challenge.category);
        const dist = sanitizeDistrict(challenge);
        const loc = getDisplayLocation(challenge);

        return {
          id: challenge.id,
          title: challenge.title || "Untitled Challenge",
          description: challenge.description || "",
          category: cat,
          district: dist,
          block: challenge.block || challenge.location?.block || "",
          location: loc,
          latitude: challenge.latitude ?? challenge.coordinates?.[1] ?? 23.3441,
          longitude: challenge.longitude ?? challenge.coordinates?.[0] ?? 85.3096,
          urgency_score:
            urgencyScore !== undefined && urgencyScore !== null
              ? Number(urgencyScore)
              : challenge.priority === "High"
              ? 8.5
              : 6.0,
          upvotes: Number(challenge.upvotes || 12),
          citizen_name:
            challenge.citizen_name ||
            challenge.citizenName ||
            challenge.submittedBy ||
            "State Dept. / Community",
          citizen_phone:
            challenge.citizen_phone || challenge.citizenPhone || "",
          is_anonymous: Boolean(
            challenge.is_anonymous ?? challenge.isAnonymous ?? false
          ),
          media_urls:
            challenge.media_urls || challenge.mediaUrls || [],
          assigned_university:
            challenge.assigned_university || challenge.assignedUniversity || null,
          status: BACKEND_STATUSES.UNDER_REVIEW,
          priority:
            challenge.priority || getPriorityFromUrgency(urgencyScore),
          submittedBy:
            challenge.submittedBy || challenge.submittedByRole || "State Dept. / Citizen",
          impactTarget:
            challenge.impactTarget || challenge.affected || "Community Residents",
          affected:
            challenge.affected || "Community Residents",
          sourceType: "Challenge Submission",
          infoRequested: Boolean(challenge.infoRequested),
          infoRequestNotes: challenge.infoRequestNotes || "",
          created_at: challenge.created_at || challenge.date || "2026-08-28",
        };
      });
  }, [data, citizenPendingProblems]);

  const pendingChallenges = useMemo(() => {
    return [
      ...citizenPendingProblems,
      ...adminPendingChallenges,
    ];
  }, [
    citizenPendingProblems,
    adminPendingChallenges,
  ]);

  const query =
    globalSearch !== undefined && globalSearch !== null
      ? globalSearch.toLowerCase()
      : localSearch.toLowerCase();

  const filteredChallenges = useMemo(() => {
    return pendingChallenges.filter((item) => {
      const matchesSearch =
        (item.title || "").toLowerCase().includes(query) ||
        String(item.id || "").toLowerCase().includes(query) ||
        (item.citizen_name || "").toLowerCase().includes(query) ||
        (item.submittedBy || "").toLowerCase().includes(query) ||
        (item.district || "").toLowerCase().includes(query) ||
        (item.block || "").toLowerCase().includes(query) ||
        (item.location || "").toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "ALL" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesPriority =
        priorityFilter === "All" ||
        String(item.priority).toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [pendingChallenges, query, selectedCategory, priorityFilter]);

  // Top KPI metrics
  const summary = useMemo(() => {
    const total = pendingChallenges.length;
    const highUrgency = pendingChallenges.filter(
      (c) =>
        String(c.priority).toLowerCase() === "high" ||
        (c.urgency_score && c.urgency_score >= 7)
    ).length;
    const citizenCount = pendingChallenges.filter(
      (c) => c.sourceType === "Citizen Report" || c.citizen_name
    ).length;

    const districtSet = new Set(
      pendingChallenges.map((c) => c.district).filter(Boolean)
    );

    return {
      total,
      highUrgency,
      citizenCount,
      districtsCount: districtSet.size || 4,
    };
  }, [pendingChallenges]);

  const totalItems = filteredChallenges.length;

  const paginatedItems = filteredChallenges.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /*
   * Government approval: UNDER_REVIEW -> OPEN / APPROVED
   */
  const handleApprove = (item) => {
    if (!item) return;

    const originalProblem = (userProblems || []).find(
      (problem) => String(problem.id) === String(item.id)
    );

    if (originalProblem) {
      approveCitizenProblemAsChallenge(item.id);
    }

    const adminChallenge = (data?.challenges || []).find(
      (challenge) =>
        String(challenge.id) === String(item.id) ||
        String(challenge.sourceProblemId) === String(item.id)
    );

    if (adminChallenge) {
      approveChallenge(adminChallenge.id);
    }

    if (!originalProblem && !adminChallenge && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("solvesphere_admin_portal_data_v1");

        if (saved) {
          const adminData = JSON.parse(saved);

          if (adminData?.challenges) {
            adminData.challenges = adminData.challenges.map((challenge) =>
              String(challenge.id) === String(item.id)
                ? {
                    ...challenge,
                    status: BACKEND_STATUSES.OPEN,
                    validationStatus: "Government Approved",
                    universityStatus: "Open for University Acceptance",
                    validatedBy: "Government / Admin",
                    validatedAt: new Date().toISOString(),
                  }
                : challenge
            );

            localStorage.setItem(
              "solvesphere_admin_portal_data_v1",
              JSON.stringify(adminData)
            );
          }
        }
      } catch (error) {
        console.error("Failed to approve challenge:", error);
      }
    }

    showToast?.(
      "Challenge approved and published to the University Challenge Pool.",
      "success"
    );

    setIsDetailOpen(false);
  };

  const handleReject = (id) => {
    if (!id) return;

    const originalProblem = (userProblems || []).find(
      (problem) => String(problem.id) === String(id)
    );

    if (originalProblem) {
      rejectCitizenProblem(id);
      setRejectTargetId(null);
      setIsDetailOpen(false);
      return;
    }

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("solvesphere_admin_portal_data_v1");

        if (saved) {
          const adminData = JSON.parse(saved);

          if (adminData?.challenges) {
            adminData.challenges = adminData.challenges.map((challenge) =>
              String(challenge.id) === String(id)
                ? {
                    ...challenge,
                    status: "REJECTED",
                    validationStatus: "Government Rejected",
                    validatedBy: "Government / Admin",
                    validatedAt: new Date().toISOString(),
                  }
                : challenge
            );

            localStorage.setItem(
              "solvesphere_admin_portal_data_v1",
              JSON.stringify(adminData)
            );
          }
        }
      } catch (error) {
        console.error("Failed to reject challenge:", error);
      }
    }

    showToast?.("Challenge rejected by Government.", "info");

    setRejectTargetId(null);
    setIsDetailOpen(false);
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();

    if (!infoTargetChallenge) return;

    const originalProblem = (userProblems || []).find(
      (problem) => String(problem.id) === String(infoTargetChallenge.id)
    );

    if (originalProblem) {
      try {
        const updatedProblems = (userProblems || []).map((problem) =>
          String(problem.id) === String(infoTargetChallenge.id)
            ? {
                ...problem,
                infoRequested: true,
                infoRequestNotes: infoNotes,
                status: BACKEND_STATUSES.UNDER_REVIEW,
              }
            : problem
        );

        localStorage.setItem(
          "solvesphere_user_problems",
          JSON.stringify(updatedProblems)
        );

        showToast?.("Clarification request saved successfully.", "success");
        setInfoTargetChallenge(null);
        setInfoNotes("");
        window.location.reload();
      } catch (error) {
        console.error("Failed to save information request:", error);
      }
      return;
    }

    requestChallengeInfo?.(infoTargetChallenge.id, infoNotes);
    setInfoTargetChallenge(null);
    setInfoNotes("");
    showToast?.("Information request sent successfully.", "success");
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#1769c2]" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#1769c2]">
              Government Validation • Problem Report Scrutiny
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            AI / Government Review
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review citizen-submitted problems and AI urgency assessments across Jharkhand before publishing to the University Challenge Pool.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold text-[#1769c2]">
              AI Scrutiny & Triage Active
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
                Pending Scrutiny
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.total}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Awaiting government validation
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                High Urgency
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.highUrgency}
              </p>
            </div>
            <div className="rounded-xl bg-rose-50 p-3 text-rose-600 border border-rose-100">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Severity score ≥ 7.0 / 10
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Citizen Submissions
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.citizenCount}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-[#1769c2] border border-blue-100">
              <User size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Community & field reports
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Districts Covered
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.districtsCount}
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
            placeholder="Search pending reviews, citizen name, district..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs shadow-xs focus:border-[#1769c2] focus:outline-hidden focus:ring-2 focus:ring-[#1769c2]/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
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

          <div className="flex items-center gap-1">
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#1769c2]"
            >
              <option value="All">Priority: All</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. TABLE */}
      {paginatedItems.length === 0 ? (
        <EmptyState
          title="No pending review challenges found"
          message="There are no challenges matching the selected filters waiting for Government validation."
          onReset={() => {
            setLocalSearch("");
            setSelectedCategory("ALL");
            setPriorityFilter("All");
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3.5">Challenge ID</th>
                  <th className="px-4 py-3.5">Challenge Details</th>
                  <th className="px-4 py-3.5">Submitted By</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">District / Location</th>
                  <th className="px-4 py-3.5">Urgency</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    {/* Challenge ID */}
                    <td className="px-4 py-4 font-mono font-bold text-[#1769c2] whitespace-nowrap">
                      #{item.id}
                    </td>

                    {/* Challenge Details */}
                    <td className="max-w-xs px-4 py-4">
                      <p className="line-clamp-1 font-bold text-slate-900">
                        {item.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-[#1769c2]">
                          {item.sourceType || "Citizen Report"}
                        </span>
                        {item.infoRequested && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                            <MessageSquare className="h-3 w-3" />
                            Info Requested
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Submitted By */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold">
                          {item.is_anonymous
                            ? "Anonymous Citizen"
                            : item.citizen_name || item.submittedBy}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        <Tag className="h-3 w-3 text-slate-400" />
                        {item.category}
                      </span>
                    </td>

                    {/* District / Location */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate max-w-[150px]">{item.location}</span>
                      </div>
                    </td>

                    {/* Urgency */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <StatusBadge
                          status={item.priority}
                          type="priority"
                        />
                        {item.urgency_score !== null && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            Score: {Number(item.urgency_score).toFixed(1)}/10
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Pending Review
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedChallenge(item);
                            setIsDetailOpen(true);
                          }}
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleApprove(item)}
                          className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
                          title="Approve Challenge"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>

                        <button
                          onClick={() => {
                            setInfoTargetChallenge(item);
                            setInfoNotes("");
                          }}
                          className="flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-[#1769c2] transition hover:bg-blue-100"
                          title="Request Information"
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                          Req Info
                        </button>

                        <button
                          onClick={() => setRejectTargetId(item.id)}
                          className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                          title="Reject Challenge"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Detail Modal */}
      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Government Review - #${selectedChallenge?.id || ""}`}
        actions={
          selectedChallenge && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleApprove(selectedChallenge)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-xs"
              >
                Approve & Publish to Pool
              </button>

              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setInfoTargetChallenge(selectedChallenge);
                  setInfoNotes("");
                }}
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-[#1769c2] transition hover:bg-blue-100"
              >
                Request Clarification
              </button>

              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setRejectTargetId(selectedChallenge.id);
                }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
              >
                Reject Problem
              </button>
            </div>
          )
        }
      >
        {selectedChallenge && (
          <div className="space-y-5 text-xs">
            {/* Title */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Citizen Submitted Challenge
              </span>
              <h3 className="mt-1 text-base font-bold text-slate-900">
                {selectedChallenge.title}
              </h3>
            </div>

            {/* Main Backend Fields */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-3">
              <div>
                <span className="block font-semibold text-slate-400 text-[10px] uppercase">
                  Category
                </span>
                <span className="font-bold text-slate-800">
                  {selectedChallenge.category}
                </span>
              </div>

              <div>
                <span className="block font-semibold text-slate-400 text-[10px] uppercase">
                  Urgency Score
                </span>
                <span className="font-bold text-slate-800">
                  {selectedChallenge.urgency_score !== null
                    ? `${Number(selectedChallenge.urgency_score).toFixed(1)} / 10`
                    : "8.0 / 10"}
                </span>
              </div>

              <div>
                <span className="block font-semibold text-slate-400 text-[10px] uppercase">
                  Upvotes
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                  <ThumbsUp className="h-3.5 w-3.5 text-blue-600" />
                  {selectedChallenge.upvotes}
                </span>
              </div>

              <div>
                <span className="block font-semibold text-slate-400 text-[10px] uppercase">
                  District (Jharkhand)
                </span>
                <span className="font-bold text-slate-800">
                  {selectedChallenge.district || "Jharkhand"}
                </span>
              </div>

              <div>
                <span className="block font-semibold text-slate-400 text-[10px] uppercase">
                  Location / Area
                </span>
                <span className="font-bold text-slate-800 truncate block">
                  {selectedChallenge.location}
                </span>
              </div>

              <div>
                <span className="block font-semibold text-slate-400 text-[10px] uppercase">
                  Government Status
                </span>
                <span className="font-bold text-amber-600">
                  UNDER_REVIEW
                </span>
              </div>
            </div>

            {/* Citizen Information */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Citizen Reporter Information
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="block text-slate-400 text-[10px]">Citizen Name</span>
                    <span className="font-bold text-slate-800">
                      {selectedChallenge.is_anonymous
                        ? "Anonymous Citizen"
                        : selectedChallenge.citizen_name || "Community Reporter"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="block text-slate-400 text-[10px]">Contact Info</span>
                    <span className="font-bold text-slate-800">
                      {selectedChallenge.is_anonymous
                        ? "Protected / Hidden"
                        : selectedChallenge.citizen_phone || "+91 651 240 8890"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Problem Statement & Field Context
              </span>
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed text-slate-700">
                {selectedChallenge.description ||
                  "Detailed problem description submitted for municipal / district administration review."}
              </p>
            </div>
          </div>
        )}
      </DetailModal>

      {/* Request Information Modal */}
      {infoTargetChallenge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setInfoTargetChallenge(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <h3 className="text-base font-bold text-slate-800">
                Request Clarification / Info
              </h3>
              <button
                onClick={() => setInfoTargetChallenge(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleInfoSubmit}
              className="space-y-4 p-6 text-xs"
            >
              <div>
                <span className="block font-semibold text-slate-400 text-[10px] uppercase">
                  Target Challenge
                </span>
                <p className="mt-0.5 text-sm font-bold text-slate-800">
                  {infoTargetChallenge.title}
                </p>
                <p className="mt-0.5 text-slate-500">
                  Submitted By:{" "}
                  {infoTargetChallenge.is_anonymous
                    ? "Anonymous Citizen"
                    : infoTargetChallenge.citizen_name || infoTargetChallenge.submittedBy}
                </p>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">
                  Information / Clarification Required
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Specify additional field data, photos, or documents required from the citizen/department..."
                  value={infoNotes}
                  onChange={(e) => setInfoNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-2 focus:ring-[#1769c2] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setInfoTargetChallenge(null);
                    setInfoNotes("");
                  }}
                  className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1769c2] px-4 py-2 font-bold text-white shadow-xs hover:bg-[#12579f]"
                >
                  Dispatch Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Confirmation */}
      <ConfirmationModal
        isOpen={!!rejectTargetId}
        onClose={() => setRejectTargetId(null)}
        onConfirm={() => handleReject(rejectTargetId)}
        title="Confirm Rejection"
        message="Are you sure you want to reject this citizen-submitted problem? It will not enter the Jharkhand University Challenge Pool."
        confirmLabel="Reject Problem"
        confirmVariant="danger"
      />
    </div>
  );
};

export default PendingScrutinyPage;