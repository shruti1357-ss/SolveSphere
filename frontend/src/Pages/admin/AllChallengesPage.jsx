import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Eye,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  MapPin,
  Layers,
  Building2,
  UserRound,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import StatusBadge from "../../components/admin/common/StatusBadge";
import Pagination from "../../components/admin/common/Pagination";
import EmptyState from "../../components/admin/common/EmptyState";
import DetailModal from "../../components/admin/common/DetailModal";

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
    { district: "Khunti", block: "Torpa" },
    { district: "Ranchi", block: "Kanke" },
    { district: "Dhanbad", block: "Jharia" },
    { district: "East Singhbhum", block: "Ghatshila" },
    { district: "Bokaro", block: "Chas" },
    { district: "Palamu", block: "Daltonganj" },
    { district: "Hazaribagh", block: "Barhi" },
    { district: "Deoghar", block: "Madhupur" },
  ];
  const selected = fallbackList[index % fallbackList.length];
  return {
    district: selected.district,
    block: selected.block,
    location: `${selected.block}, ${selected.district}, Jharkhand`,
  };
};

const BACKEND_CATEGORIES = [
  "Water Management",
  "Agriculture & FoodTech",
  "Health & MedTech",
  "Sanitation & Waste",
  "Rural Infrastructure",
  "Smart Education",
  "Clean Energy",
];

const BACKEND_STATUSES = [
  "OPEN",
  "UNDER_REVIEW",
  "ASSIGNED_TO_HEI",
  "IN_PROGRESS",
  "RESOLVED",
];

const STATUS_LABELS = {
  OPEN: "Open",
  UNDER_REVIEW: "Under Review",
  ASSIGNED_TO_HEI: "Assigned to University",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

const normalizeStatus = (status) => {
  if (!status) return "UNDER_REVIEW";

  const value = String(status).trim().toLowerCase();

  const map = {
    open: "OPEN",
    approved: "OPEN",
    active: "OPEN",

    pending: "UNDER_REVIEW",
    "pending review": "UNDER_REVIEW",
    "under review": "UNDER_REVIEW",
    "under ai analysis": "UNDER_REVIEW",
    "ai analysis": "UNDER_REVIEW",
    under_review: "UNDER_REVIEW",

    assigned: "ASSIGNED_TO_HEI",
    "assigned to university": "ASSIGNED_TO_HEI",
    assigned_to_hei: "ASSIGNED_TO_HEI",

    "in progress": "IN_PROGRESS",
    in_progress: "IN_PROGRESS",

    completed: "RESOLVED",
    resolved: "RESOLVED",
    rejected: "REJECTED",
  };

  return map[value] || status;
};

const normalizeChallenge = (item, index) => {
  const challengeId =
    item.id ??
    item.challenge_id ??
    item.challengeId ??
    `CH-${String(index + 1).padStart(4, "0")}`;

  const { district, block, location } = sanitizeJharkhandLocation(
    item.district,
    item.block,
    item.location,
    index
  );

  const submittedBy =
    item.submittedBy ||
    item.citizen_name ||
    item.citizenName ||
    item.citizen?.name ||
    "Citizen";

  const date =
    item.date ||
    item.created_at ||
    item.createdAt ||
    item.submittedDate ||
    "";

  return {
    ...item,
    id: String(challengeId),
    title: item.title || "Untitled Challenge",
    description: item.description || "",
    category: item.category || "Water Management",
    district,
    block,
    location,
    status: normalizeStatus(item.status),
    submittedBy,
    date,
    impactTarget: item.impactTarget || "Public",
    budget: item.budget || null,
    department: item.department || "District Line Department",
  };
};

const AllChallengesPage = () => {
  const { data, approveChallenge, rejectChallenge, showToast } = useAdmin();
  const { searchQuery: globalSearch } = useOutletContext() || {};

  const [localSearch, setLocalSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const challenges = useMemo(() => {
    return (data?.challenges || []).map(normalizeChallenge);
  }, [data?.challenges]);

  const query = String(globalSearch || localSearch || "").toLowerCase();

  const filtered = challenges.filter((item) => {
    const searchableText = [
      item.title,
      item.id,
      item.submittedBy,
      item.citizen_name,
      item.location,
      item.district,
      item.block,
      item.category,
      item.description,
      item.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(query);

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "id") {
      return a.id.localeCompare(b.id);
    }
    if (sortBy === "date-asc") {
      return new Date(a.date || 0) - new Date(b.date || 0);
    }
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  const totalItems = sorted.length;

  const paginatedItems = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const categories = [
    "All",
    ...BACKEND_CATEGORIES.filter((category) =>
      challenges.some((challenge) => challenge.category === category)
    ),
  ];

  const statuses = ["All", ...BACKEND_STATUSES];

  const resetFilters = () => {
    setLocalSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return date;
    }
    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleApprove = (id) => {
    if (typeof approveChallenge === "function") {
      approveChallenge(id);
    }
    if (typeof showToast === "function") {
      showToast(`Challenge ${id} has been approved successfully!`, "success");
    }
  };

  const handleReject = (id) => {
    if (typeof rejectChallenge === "function") {
      rejectChallenge(id, "Administrative review rejected");
    }
    if (typeof showToast === "function") {
      showToast(`Challenge ${id} marked as rejected.`, "info");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Layers className="w-4.5 h-4.5 text-[#1769c2]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Government Challenge Registry
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete registry of civic challenges across Jharkhand districts with administrative review &amp; verification actions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-52 font-medium"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                Status: {s === "All" ? "All" : STATUS_LABELS[s] || s}
              </option>
            ))}
          </select>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="date-desc">Newest Date</option>
              <option value="date-asc">Oldest Date</option>
              <option value="title">Challenge Title</option>
              <option value="id">Challenge ID</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registry Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Total
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {challenges.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Open
          </span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {challenges.filter((c) => c.status === "OPEN").length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Under Review
          </span>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {challenges.filter((c) => c.status === "UNDER_REVIEW").length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            In Progress
          </span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {challenges.filter((c) => c.status === "IN_PROGRESS").length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Resolved
          </span>
          <p className="text-2xl font-bold text-slate-700 mt-1">
            {challenges.filter((c) => c.status === "RESOLVED").length}
          </p>
        </div>
      </div>

      {/* Table */}
      {paginatedItems.length === 0 ? (
        <EmptyState
          title="No challenges found"
          message="No registered public challenges match your search query or filter selection."
          onReset={resetFilters}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Challenge ID</th>
                  <th className="py-3.5 px-4">Challenge</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    {/* ID */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[#1769c2] font-bold">
                        {item.id}
                      </span>
                    </td>

                    {/* Challenge */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-1">
                        {item.title}
                      </p>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Target: {item.impactTarget || "Public"}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-500" />
                        <div>
                          <p className="font-semibold text-slate-700">
                            {item.district}, Jharkhand
                          </p>
                          {item.block && (
                            <p className="text-[10px] text-slate-400">
                              {item.block} Block
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge
                        status={STATUS_LABELS[item.status] || item.status}
                      />
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(item.date)}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedChallenge(item);
                            setIsDetailOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          View
                        </button>

                        {item.status === "UNDER_REVIEW" ? (
                          <>
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition inline-flex items-center gap-1 shadow-xs"
                              title="Approve Challenge"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition inline-flex items-center gap-1 shadow-xs"
                              title="Reject Challenge"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        ) : item.status === "RESOLVED" ||
                          item.status === "OPEN" ||
                          item.status === "ASSIGNED_TO_HEI" ||
                          item.status === "IN_PROGRESS" ? (
                          <>
                            <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold inline-flex items-center gap-1">
                              <Check className="w-3 h-3" /> Approved
                            </span>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="px-2 py-1 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-semibold text-xs transition inline-flex items-center gap-1"
                              title="Reject Challenge"
                            >
                              <X className="w-3 h-3" /> Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-2 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-semibold text-xs transition inline-flex items-center gap-1"
                              title="Re-approve Challenge"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                            <span className="px-2 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold inline-flex items-center gap-1">
                              <X className="w-3 h-3" /> Rejected
                            </span>
                          </>
                        )}
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
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedChallenge(null);
        }}
        title={
          selectedChallenge
            ? `Challenge Registry - ${selectedChallenge.id}`
            : "Challenge Details"
        }
      >
        {selectedChallenge && (
          <div className="space-y-5">
            {/* Title */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Challenge Name
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {selectedChallenge.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                ID: {selectedChallenge.id} &nbsp;•&nbsp; Submitted on: {formatDate(selectedChallenge.date)}
              </p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Category</span>
                <span className="font-bold text-slate-800">{selectedChallenge.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Status</span>
                <StatusBadge status={STATUS_LABELS[selectedChallenge.status] || selectedChallenge.status} />
              </div>
              <div>
                <span className="text-slate-400 block font-medium">District (Jharkhand)</span>
                <span className="font-bold text-slate-800">{selectedChallenge.district}, Jharkhand</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Block / Area</span>
                <span className="font-semibold text-slate-800">{selectedChallenge.block || "District Central"}</span>
              </div>
            </div>

            {/* Department */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Responsible Department
              </span>
              <p className="font-bold text-slate-800 text-sm">
                {selectedChallenge.department || "Rural Development & Civic Administration"}
              </p>
            </div>

            {/* Description */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Full Problem &amp; Scope Description
              </span>
              <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                {selectedChallenge.description || "No detailed description supplied."}
              </p>
            </div>

            {/* Action Buttons in Modal */}
            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedChallenge(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleReject(selectedChallenge.id);
                  setIsDetailOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Reject Challenge
              </button>
              <button
                onClick={() => {
                  handleApprove(selectedChallenge.id);
                  setIsDetailOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Approve Challenge
              </button>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
};

export default AllChallengesPage;