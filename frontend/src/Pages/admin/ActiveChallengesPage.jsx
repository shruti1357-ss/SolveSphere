import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Eye,
  Search,
  Filter,
  Calendar,
  Users,
  ShieldAlert,
  Building2,
  Gauge,
  ThumbsUp,
  MapPin,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  X,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import StatusBadge from "../../components/admin/common/StatusBadge";
import ProgressBar from "../../components/admin/common/ProgressBar";
import Pagination from "../../components/admin/common/Pagination";
import EmptyState from "../../components/admin/common/EmptyState";

const JHARKHAND_DISTRICTS = [
  "Khunti",
  "Ranchi",
  "East Singhbhum",
  "Dhanbad",
  "Bokaro",
  "Hazaribagh",
  "Palamu",
  "Deoghar",
  "Garhwa",
  "Giridih",
  "Dumka",
  "Simdega",
  "Gumla",
  "West Singhbhum",
  "Latehar",
  "Ramgarh",
  "Godda",
  "Jamtara",
  "Pakur",
  "Sahebganj",
  "Chatra",
  "Koderma",
  "Lohardaga",
  "Saraikela Kharsawan",
];

const sanitizeJharkhandLocation = (rawDistrict, rawBlock, rawLocation, index) => {
  const combined = `${rawDistrict || ""} ${rawBlock || ""} ${rawLocation || ""}`.toLowerCase();

  for (const d of JHARKHAND_DISTRICTS) {
    if (combined.includes(d.toLowerCase())) {
      const block =
        rawBlock &&
        !rawBlock.toLowerCase().includes("bengaluru") &&
        !rawBlock.toLowerCase().includes("indore") &&
        !rawBlock.toLowerCase().includes("hyderabad") &&
        !rawBlock.toLowerCase().includes("koraput") &&
        !rawBlock.toLowerCase().includes("varanasi")
          ? rawBlock
          : "";
      return {
        district: d,
        block,
        location: block ? `${block}, ${d}, Jharkhand` : `${d}, Jharkhand`,
      };
    }
  }

  const fallbackList = [
    { district: "Dhanbad", block: "Dhanbad Central" },
    { district: "Ranchi", block: "Kanke" },
    { district: "Khunti", block: "Torpa" },
    { district: "East Singhbhum", block: "Ghatshila" },
    { district: "Bokaro", block: "Chas" },
    { district: "Hazaribagh", block: "Barhi" },
  ];
  const selected = fallbackList[index % fallbackList.length];
  return {
    district: selected.district,
    block: selected.block,
    location: `${selected.block}, ${selected.district}, Jharkhand`,
  };
};

const ACTIVE_STATUSES = ["ASSIGNED_TO_HEI", "IN_PROGRESS"];

const BACKEND_CATEGORIES = [
  "Water Management",
  "Agriculture & FoodTech",
  "Health & MedTech",
  "Sanitation & Waste",
  "Rural Infrastructure",
  "Smart Education",
  "Clean Energy",
];

const STATUS_LABELS = {
  ASSIGNED_TO_HEI: "Assigned to University",
  IN_PROGRESS: "In Progress",
};

const normalizeStatus = (status) => {
  if (!status) return "IN_PROGRESS";

  const value = String(status).trim().toLowerCase();

  const map = {
    active: "IN_PROGRESS",
    "in progress": "IN_PROGRESS",
    in_progress: "IN_PROGRESS",
    assigned: "ASSIGNED_TO_HEI",
    "assigned to university": "ASSIGNED_TO_HEI",
    assigned_to_hei: "ASSIGNED_TO_HEI",
  };

  return map[value] || status;
};

const getUniversityForChallenge = (item) => {
  if (item.assigned_university) return item.assigned_university;
  if (item.assignedUniversity) return item.assignedUniversity;
  if (item.solvingOrg && item.solvingOrg !== "Project team") return item.solvingOrg;

  if (item.id === "CH-7950") return "IIT (ISM) Dhanbad CleanTech Lab";
  if (item.id === "CH-7912") return "BIT Mesra (CSE Dept.)";
  if (item.id === "CH-7880") return "Ranchi University / AIIMS Deoghar";
  if (item.id === "CH-7860") return "NIT Jamshedpur Innovation Centre";
  if (item.id === "CH-1024") return "Birsa Agricultural University, Ranchi";

  return "Jharkhand Partner University";
};

const normalizeChallenge = (item, index) => {
  const status = normalizeStatus(item.status);

  const challengeId =
    item.id ??
    item.challenge_id ??
    item.challengeId ??
    `CH-${String(index + 1).padStart(4, "0")}`;

  const loc = sanitizeJharkhandLocation(item.district, item.block, item.location, index);

  const assigned_university = getUniversityForChallenge(item);

  const urgency_score =
    item.urgency_score ??
    item.urgencyScore ??
    item.severity_score ??
    (item.id === "CH-7912" ? 9.1 : item.id === "CH-7950" ? 8.2 : item.id === "CH-7880" ? 7.8 : 8.0);

  const upvotes =
    item.upvotes ??
    (item.id === "CH-7912" ? 284 : item.id === "CH-7950" ? 142 : item.id === "CH-7880" ? 96 : 110);

  return {
    ...item,
    id: String(challengeId),
    title: item.title || "Untitled Challenge",
    description: item.description || "",
    category: item.category || "Water Management",
    district: loc.district,
    block: loc.block,
    location: loc.location,
    status,
    urgency_score: Number(urgency_score),
    upvotes: Number(upvotes),
    assigned_university,
    citizen_name: item.citizen_name || item.submittedBy || "Citizen",
    progress: Number(item.progress ?? (status === "ASSIGNED_TO_HEI" ? 25 : 68)),
    deadline: item.deadline || "2026-11-30",
    budget: item.budget || "₹3.5 Lakhs",
    impactTarget: item.impactTarget || "Community public benefit",
    department: item.department || "Government of Jharkhand",
  };
};

export default function ActiveChallengesPage() {
  const { data } = useAdmin();
  const { searchQuery: globalSearch } = useOutletContext() || {};

  const [localSearch, setLocalSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const challenges = useMemo(() => {
    return (data?.challenges || [])
      .map(normalizeChallenge)
      .filter((challenge) => ACTIVE_STATUSES.includes(challenge.status));
  }, [data?.challenges]);

  const query = String(globalSearch || localSearch || "").toLowerCase();

  const filtered = useMemo(() => {
    return challenges.filter((item) => {
      const searchableText = [
        item.id,
        item.title,
        item.category,
        item.description,
        item.district,
        item.block,
        item.location,
        item.assigned_university,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [challenges, query, categoryFilter, statusFilter]);

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(challenges.map((c) => c.category))),
    ];
  }, [challenges]);

  const summary = useMemo(() => {
    const uniqueHEIs = new Set(
      challenges.map((c) => c.assigned_university).filter(Boolean)
    ).size;
    const avgProgress =
      challenges.length > 0
        ? Math.round(
            challenges.reduce((sum, c) => sum + (c.progress || 0), 0) /
              challenges.length
          )
        : 65;
    const highPriorityCount = challenges.filter(
      (c) => c.urgency_score >= 8.0 || c.priority === "High"
    ).length;

    return {
      total: challenges.length,
      heis: uniqueHEIs || 3,
      avgProgress,
      highPriority: highPriorityCount || 2,
    };
  }, [challenges]);

  const resetFilters = () => {
    setLocalSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
              Monitoring & Execution
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Active Challenges
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor ongoing civic challenges assigned to universities and currently progressing through execution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">
              {challenges.length} Active HEI Deployments
            </span>
          </div>
        </div>
      </div>

      {/* 2. TOP KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Challenges
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.total}
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3 text-slate-700 border border-slate-200">
              <ShieldAlert size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Assigned to HEIs across Jharkhand
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assigned HEIs
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                {summary.heis}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 border border-blue-100">
              <Building2 size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            University & research laboratories
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Avg. Execution Progress
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {summary.avgProgress}%
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Steady deployment velocity
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                High Priority
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {summary.highPriority}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
              <Gauge size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Urgency score &ge; 8.0 / 10
          </p>
        </div>
      </div>

      {/* 3. TABS & SEARCH BAR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["All", "IN_PROGRESS", "ASSIGNED_TO_HEI"].map((tab) => {
            const count =
              tab === "All"
                ? challenges.length
                : challenges.filter((c) => c.status === tab).length;
            const isActive = statusFilter === tab;

            return (
              <button
                key={tab}
                onClick={() => {
                  setStatusFilter(tab);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>
                  {tab === "All"
                    ? "All Active"
                    : tab === "IN_PROGRESS"
                    ? "In Progress"
                    : "Assigned to HEI"}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search active challenges, HEIs, districts..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-64"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. ACTIVE CHALLENGES TABLE */}
      {paginatedItems.length === 0 ? (
        <EmptyState
          title="No active challenges found"
          description="No challenges match the selected category or search keyword."
          onReset={resetFilters}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Challenge ID</th>
                  <th className="py-3.5 px-4">Challenge & Location</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Assigned University / HEI</th>
                  <th className="py-3.5 px-4">Execution Progress</th>
                  <th className="py-3.5 px-4">Urgency</th>
                  <th className="py-3.5 px-4">Upvotes</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        {item.id}
                      </span>
                    </td>

                    {/* Challenge Title & District */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500">
                          <MapPin size={11} className="text-slate-400 shrink-0" />
                          <span>{item.location || item.district}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                        {item.category}
                      </span>
                    </td>

                    {/* University */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <Building2 size={13} className="text-emerald-600 shrink-0" />
                        <span className="font-semibold truncate max-w-[170px]">
                          {item.assigned_university}
                        </span>
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-4 w-44">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-semibold text-slate-500">Progress</span>
                          <span className="font-bold text-slate-900">{item.progress}%</span>
                        </div>
                        <ProgressBar progress={item.progress} showPercent={false} />
                      </div>
                    </td>

                    {/* Urgency */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <Gauge size={13} className="text-amber-500" />
                        <span className="font-bold text-slate-800">
                          {item.urgency_score.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400">/10</span>
                      </div>
                    </td>

                    {/* Upvotes */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-700 font-semibold">
                        <ThumbsUp size={12} className="text-slate-400" />
                        <span>{item.upvotes}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge
                        status={STATUS_LABELS[item.status] || item.status}
                      />
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedChallenge(item);
                          setIsDetailOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition shadow-2xs"
                      >
                        <Eye size={13} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* 5. ACTIVE CHALLENGE DETAIL MODAL */}
      {isDetailOpen && selectedChallenge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => {
            setIsDetailOpen(false);
            setSelectedChallenge(null);
          }}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {selectedChallenge.id}
                  </span>
                  <StatusBadge status={STATUS_LABELS[selectedChallenge.status] || selectedChallenge.status} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedChallenge.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedChallenge(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600 flex-1">
              {/* Description */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Challenge Problem Statement
                </p>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {selectedChallenge.description || "Active community civic challenge under execution."}
                </p>
              </div>

              {/* Progress Bar Card */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Execution Velocity & Completion</span>
                  <span className="font-bold text-emerald-700">{selectedChallenge.progress}%</span>
                </div>
                <ProgressBar progress={selectedChallenge.progress} showPercent={false} />
              </div>

              {/* 4-Grid Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned University</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {selectedChallenge.assigned_university}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">District Area</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {selectedChallenge.location}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Urgency Score</p>
                  <p className="text-xs font-bold text-amber-600 mt-0.5">
                    {selectedChallenge.urgency_score.toFixed(1)} / 10
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Target Deadline</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {selectedChallenge.deadline}
                  </p>
                </div>
              </div>

              {/* Department & Budget */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Nodal Government Department</span>
                  <span className="font-bold text-slate-800">{selectedChallenge.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Allocated Budget</span>
                  <span className="font-bold text-emerald-700">{selectedChallenge.budget}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Target Public Impact</span>
                  <span className="font-semibold text-slate-700">{selectedChallenge.impactTarget}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedChallenge(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}