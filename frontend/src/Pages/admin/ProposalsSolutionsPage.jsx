import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Eye,
  X,
  RotateCcw,
  Rocket,
  Search,
  Filter,
  Users,
  GraduationCap,
  UserRound,
  Building2,
  IndianRupee,
  CheckCircle2,
  MapPin,
  Check,
  FileText,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import StatusBadge from "../../components/admin/common/StatusBadge";
import Pagination from "../../components/admin/common/Pagination";
import EmptyState from "../../components/admin/common/EmptyState";
import AssignProjectModal from "../../components/admin/common/AssignProjectModal";

const SOLUTION_STATUS_TABS = [
  "All",
  "UNDER_REVIEW",
  "APPROVED",
  "IN_PROGRESS",
  "Rejected",
];

const STATUS_LABELS = {
  All: "All Proposals",
  PROPOSED: "Proposed",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  Rejected: "Rejected",
};

const normalizeStatus = (status) => {
  if (!status) return "UNDER_REVIEW";

  const value = String(status).trim();

  const map = {
    Pending: "UNDER_REVIEW",
    Proposed: "PROPOSED",
    "Under Review": "UNDER_REVIEW",
    Approved: "APPROVED",
    Assigned: "IN_PROGRESS",
    "Revision Requested": "UNDER_REVIEW",
    "In Progress": "IN_PROGRESS",
    Completed: "COMPLETED",
  };

  return map[value] || value;
};

const getStatusLabel = (status) =>
  STATUS_LABELS[status] || status || "Under Review";

const normalizeSolution = (item) => {
  const status = normalizeStatus(item.status);

  return {
    ...item,
    id: item.id || item.solutionId || "SOL-3000",
    challengeId:
      item.challengeId ||
      item.challenge_id ||
      item.challenge?.id ||
      "CH-8000",
    challengeTitle:
      item.challengeTitle ||
      item.challenge?.title ||
      item.challenge_name ||
      "Civic Problem Challenge",
    district: item.district || "Jharkhand",
    team_name:
      item.team_name ||
      item.teamName ||
      item.team ||
      "HEI Innovation Team",
    university_name:
      item.university_name ||
      item.universityName ||
      item.university ||
      item.organization ||
      "Jharkhand Partner University",
    department:
      item.department ||
      item.dept ||
      "Department of Innovation & R&D",
    faculty_mentor:
      item.faculty_mentor ||
      item.facultyMentor ||
      item.mentor ||
      "Faculty Project Lead",
    student_leader:
      item.student_leader ||
      item.studentLeader ||
      "Student Research Lead",
    proposal_summary:
      item.proposal_summary ||
      item.proposalSummary ||
      item.abstract ||
      "Comprehensive technical approach and engineering architecture addressing the civic challenge.",
    abstract:
      item.abstract ||
      item.proposal_summary ||
      item.proposalSummary ||
      "Engineering implementation framework.",
    milestones: Array.isArray(item.milestones) ? item.milestones : [],
    csr_partner: item.csr_partner || item.csrPartner || null,
    csr_grant_amount: Number(item.csr_grant_amount ?? item.csrGrantAmount ?? 0),
    organization:
      item.organization ||
      item.university_name ||
      "Partner HEI",
    estimatedCost:
      item.estimatedCost ||
      item.estimated_cost ||
      "₹2.5 Lakhs",
    expectedImpact:
      item.expectedImpact ||
      item.expected_impact ||
      "Measurable efficiency and community improvement",
    technicalScore:
      item.technicalScore ??
      item.technical_score ??
      90,
    submittedDate:
      item.submittedDate ||
      item.submitted_date ||
      "2026-08-30",
    status,
  };
};

export default function ProposalsSolutionsPage() {
  const {
    data,
    approveProposal,
    rejectProposal,
    requestProposalRevision,
    assignProposalToTracking,
  } = useAdmin();

  const { searchQuery: globalSearch } = useOutletContext() || {};

  const [localSearch, setLocalSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [assignTargetProposal, setAssignTargetProposal] = useState(null);

  const solutions = useMemo(() => {
    return (data.proposals || []).map(normalizeSolution);
  }, [data.proposals]);

  const query = String(globalSearch || localSearch || "")
    .trim()
    .toLowerCase();

  const filtered = useMemo(() => {
    return solutions.filter((item) => {
      const searchableText = [
        item.id,
        item.challengeId,
        item.challengeTitle,
        item.organization,
        item.university_name,
        item.team_name,
        item.department,
        item.faculty_mentor,
        item.student_leader,
        item.district,
        item.proposal_summary,
        item.csr_partner,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesStatus =
        activeTab === "All" || item.status === activeTab;

      return matchesSearch && matchesStatus;
    });
  }, [solutions, query, activeTab]);

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const summary = useMemo(() => {
    return {
      total: solutions.length,
      underReview: solutions.filter((s) => s.status === "UNDER_REVIEW").length,
      approved: solutions.filter((s) => s.status === "APPROVED").length,
      inProgress: solutions.filter((s) => s.status === "IN_PROGRESS").length,
      totalGrants: solutions.reduce((sum, s) => sum + s.csr_grant_amount, 0),
    };
  }, [solutions]);

  const openDetails = (item) => {
    setSelectedProposal(item);
    setIsDetailOpen(true);
  };

  const formatGrant = (amount) => {
    if (!amount) return "—";
    return `₹${(Number(amount) / 100000).toFixed(1)} Lakhs`;
  };

  const resetFilters = () => {
    setLocalSearch("");
    setActiveTab("All");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
              Innovation & HEI Solutions
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Proposals & Solution Submissions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and evaluate technical solutions, CSR grants, and R&D deployments submitted by partner HEIs across Jharkhand
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">
              {summary.underReview} Awaiting Government Review
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
                Total Submissions
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.total}
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3 text-slate-700 border border-slate-200">
              <FileText size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            University & startup technical proposals
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Under Review
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {summary.underReview}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Pending technical evaluation & review
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Approved Solutions
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {summary.approved}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Ready for live tracking assignment
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Deployments
              </p>
              <p className="mt-1 text-2xl font-bold text-purple-600">
                {summary.inProgress}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600 border border-purple-100">
              <Rocket size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Currently executing in Live Tracking
          </p>
        </div>
      </div>

      {/* 3. TABS & SEARCH BAR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SOLUTION_STATUS_TABS.map((tab) => {
            const count =
              tab === "All"
                ? solutions.length
                : solutions.filter((s) => s.status === tab).length;
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{STATUS_LABELS[tab] || tab}</span>
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

        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search proposals, universities, mentors..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-64"
          />
        </div>
      </div>

      {/* 4. PROPOSALS TABLE */}
      {paginatedItems.length === 0 ? (
        <EmptyState
          title="No solution proposals found"
          description="No proposals match the current filter or search criteria. Try clearing search keywords."
          onReset={resetFilters}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Solution ID</th>
                  <th className="py-3.5 px-4">University & Department</th>
                  <th className="py-3.5 px-4">Research Team & Lead</th>
                  <th className="py-3.5 px-4">Target Challenge & District</th>
                  <th className="py-3.5 px-4">CSR Grant Funding</th>
                  <th className="py-3.5 px-4">Tech Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                      <span className="rounded-md bg-purple-50 px-2 py-1 text-[11px] font-bold text-purple-700 border border-purple-200">
                        {item.id}
                      </span>
                    </td>

                    {/* University & Department */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5 max-w-xs">
                        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 border border-emerald-100 shrink-0 mt-0.5">
                          <GraduationCap size={15} />
                        </div>
                        <div>
                          <button
                            onClick={() => openDetails(item)}
                            className="font-bold text-slate-900 hover:text-emerald-600 text-left transition"
                          >
                            {item.university_name}
                          </button>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">
                            {item.department}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Team & Lead */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-800">{item.team_name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Lead: <span className="font-semibold text-slate-700">{item.student_leader}</span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Mentor: {item.faculty_mentor}
                        </p>
                      </div>
                    </td>

                    {/* Target Challenge */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono text-slate-600">
                            {item.challengeId}
                          </span>
                          {item.district && (
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                              <MapPin size={9} />
                              {item.district}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-900 line-clamp-2 leading-snug">
                          {item.challengeTitle}
                        </p>
                      </div>
                    </td>

                    {/* CSR Grant */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-emerald-700">
                          {formatGrant(item.csr_grant_amount)}
                        </span>
                        {item.csr_partner && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[130px] mt-0.5">
                            {item.csr_partner}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Tech Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                          {item.technicalScore}/100
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={getStatusLabel(item.status)} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => openDetails(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="View Technical Details"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Under Review State Actions */}
                        {item.status === "UNDER_REVIEW" && (
                          <>
                            <button
                              onClick={() => approveProposal(item.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-2xs"
                              title="Approve Proposal"
                            >
                              <Check size={13} />
                              Approve
                            </button>

                            <button
                              onClick={() => requestProposalRevision(item.id)}
                              className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition"
                              title="Request Proposal Revision"
                            >
                              <RotateCcw size={13} />
                            </button>

                            <button
                              onClick={() => rejectProposal(item.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
                              title="Reject Proposal"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}

                        {/* Approved State Action */}
                        {item.status === "APPROVED" && (
                          <button
                            onClick={() => setAssignTargetProposal(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition shadow-xs"
                          >
                            <Rocket size={13} />
                            Assign Project
                          </button>
                        )}
                      </div>
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
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}

      {/* 5. RICH TECHNICAL PROPOSAL INSPECTION MODAL */}
      {isDetailOpen && selectedProposal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => {
            setIsDetailOpen(false);
            setSelectedProposal(null);
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
                    {selectedProposal.id}
                  </span>
                  <StatusBadge status={getStatusLabel(selectedProposal.status)} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedProposal.challengeTitle}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedProposal(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600 flex-1">
              {/* Abstract */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Technical Architecture & Solution Abstract
                </p>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {selectedProposal.proposal_summary}
                </p>
              </div>

              {/* 4-Grid Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">HEI Partner</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {selectedProposal.university_name}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Target District</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {selectedProposal.district || "Jharkhand"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Tech Score</p>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">
                    {selectedProposal.technicalScore} / 100
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">CSR Grant</p>
                  <p className="text-xs font-bold text-purple-700 mt-0.5">
                    {formatGrant(selectedProposal.csr_grant_amount)}
                  </p>
                </div>
              </div>

              {/* Team Information */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Research Team & Faculty Supervision
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400">Team Name</p>
                      <p className="font-semibold text-slate-800">{selectedProposal.team_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400">Faculty Mentor</p>
                      <p className="font-semibold text-slate-800">{selectedProposal.faculty_mentor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserRound size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400">Student Leader</p>
                      <p className="font-semibold text-slate-800">{selectedProposal.student_leader}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400">CSR Sponsor Entity</p>
                      <p className="font-semibold text-purple-700">{selectedProposal.csr_partner || "Self-Funded HEI"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones Delivery Plan */}
              {selectedProposal.milestones && selectedProposal.milestones.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
                    Proposed Milestone Roadmap ({selectedProposal.milestones.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedProposal.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-800">{m.name}</span>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <span className="text-xs text-slate-400">
                Submitted: {selectedProposal.submittedDate}
              </span>
              <div className="flex items-center gap-2">
                {selectedProposal.status === "UNDER_REVIEW" && (
                  <>
                    <button
                      onClick={() => {
                        approveProposal(selectedProposal.id);
                        setIsDetailOpen(false);
                      }}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                    >
                      <Check size={14} />
                      Approve Proposal
                    </button>
                    <button
                      onClick={() => {
                        rejectProposal(selectedProposal.id);
                        setIsDetailOpen(false);
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </>
                )}

                {selectedProposal.status === "APPROVED" && (
                  <button
                    onClick={() => {
                      const toAssign = { ...selectedProposal };
                      setIsDetailOpen(false);
                      setAssignTargetProposal(toAssign);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 text-xs font-semibold text-white hover:bg-purple-700 transition"
                  >
                    <Rocket size={14} />
                    Assign to Live Tracking
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    setSelectedProposal(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ASSIGN TO LIVE TRACKING MODAL */}
      <AssignProjectModal
        isOpen={!!assignTargetProposal}
        onClose={() => setAssignTargetProposal(null)}
        onAssign={assignProposalToTracking}
        proposal={assignTargetProposal}
      />
    </div>
  );
}