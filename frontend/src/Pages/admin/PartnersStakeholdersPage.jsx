import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Building2,
  Check,
  X,
  FileCheck,
  Eye,
  Search,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Zap,
  MapPin,
  Mail,
  User,
  ShieldCheck,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  AlertCircle,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import StatusBadge from "../../components/admin/common/StatusBadge";
import Pagination from "../../components/admin/common/Pagination";
import EmptyState from "../../components/admin/common/EmptyState";

const PARTNER_TYPES = [
  "All",
  "Universities",
  "Industries",
  "NGOs",
  "Startups",
];

const normalizeVerificationStatus = (status) => {
  const value = String(status || "").trim().toLowerCase();

  if (
    value === "verified" ||
    value === "approved" ||
    value === "active" ||
    value === "verified entity"
  ) {
    return "Verified";
  }

  if (
    value === "rejected" ||
    value === "verification rejected" ||
    value === "declined"
  ) {
    return "Rejected";
  }

  if (
    value === "documents requested" ||
    value === "docs requested" ||
    value === "pending documents"
  ) {
    return "Documents Requested";
  }

  return "Pending Verification";
};

const normalizePartner = (partner, index) => {
  const id =
    partner?.id ||
    partner?.partnerId ||
    partner?.partner_id ||
    `PRT-${String(501 + index)}`;

  const name =
    partner?.name ||
    partner?.organizationName ||
    partner?.organization_name ||
    partner?.university_name ||
    partner?.universityName ||
    partner?.csr_partner ||
    partner?.csrPartner ||
    "Institutional Partner";

  const rawType =
    partner?.type ||
    partner?.partnerType ||
    partner?.partner_type ||
    partner?.organizationType ||
    partner?.organization_type ||
    "";

  const typeMap = {
    university: "Universities",
    universities: "Universities",
    hei: "Universities",
    higher_education: "Universities",
    industry: "Industries",
    industries: "Industries",
    corporate: "Industries",
    company: "Industries",
    ngo: "NGOs",
    ngos: "NGOs",
    startup: "Startups",
    startups: "Startups",
    msme: "Industries",
  };

  const normalizedType =
    typeMap[String(rawType).trim().toLowerCase()] || rawType || "Industries";

  return {
    ...partner,
    id,
    name,
    type: normalizedType,
    location:
      partner?.location ||
      partner?.district ||
      "Jharkhand",
    contactPerson:
      partner?.contactPerson ||
      partner?.contact_person ||
      partner?.contactName ||
      "Dr. Coordinator",
    email: partner?.email || partner?.contact_email || "contact@partner.org",
    activeProjects:
      Number(
        partner?.activeProjects ??
          partner?.active_projects ??
          partner?.projects_count ??
          0
      ) || 0,
    verificationStatus: normalizeVerificationStatus(
      partner?.verificationStatus ||
        partner?.verification_status ||
        partner?.status
    ),
    lastUpdated:
      partner?.lastUpdated ||
      partner?.last_updated ||
      "2026-09-01",
    accreditation:
      partner?.accreditation ||
      partner?.accreditation_status ||
      "State Recognized Entity",
    role:
      partner?.role ||
      partner?.partner_role ||
      "Institutional Stakeholder",
    website: partner?.website || "",
    description:
      partner?.description ||
      "Active partner collaborating with Government of Jharkhand on civic problem resolution and R&D deployments.",
    gstin: partner?.gstin || "",
    pan: partner?.pan || "",
  };
};

const getTabIcon = (tab) => {
  switch (tab) {
    case "Universities":
      return GraduationCap;
    case "Industries":
      return Briefcase;
    case "NGOs":
      return HeartHandshake;
    case "Startups":
      return Zap;
    default:
      return Building2;
  }
};

export default function PartnersStakeholdersPage() {
  const {
    data,
    verifyPartner,
    rejectPartner,
    requestPartnerDocs,
  } = useAdmin();

  const { searchQuery: globalSearch } = useOutletContext() || {};

  const [activeTab, setActiveTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const partners = useMemo(
    () =>
      (Array.isArray(data?.partners) ? data.partners : []).map(
        normalizePartner
      ),
    [data?.partners]
  );

  const query = String(globalSearch || localSearch || "")
    .trim()
    .toLowerCase();

  const filtered = useMemo(() => {
    return partners.filter((item) => {
      const searchableText = [
        item.id,
        item.name,
        item.type,
        item.location,
        item.contactPerson,
        item.email,
        item.role,
        item.accreditation,
        item.verificationStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesType = activeTab === "All" || item.type === activeTab;
      const matchesStatus =
        statusFilter === "All" || item.verificationStatus === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [partners, query, activeTab, statusFilter]);

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const summary = useMemo(() => {
    return {
      total: partners.length,
      universities: partners.filter((p) => p.type === "Universities").length,
      industries: partners.filter((p) => p.type === "Industries").length,
      startups: partners.filter((p) => p.type === "Startups").length,
      ngos: partners.filter((p) => p.type === "NGOs").length,
      pending: partners.filter(
        (p) => p.verificationStatus === "Pending Verification"
      ).length,
      verified: partners.filter((p) => p.verificationStatus === "Verified").length,
      totalActiveProjects: partners.reduce((sum, p) => sum + p.activeProjects, 0),
    };
  }, [partners]);

  const handleVerify = (id) => {
    verifyPartner(id);
  };

  const handleReject = (id) => {
    rejectPartner(id);
  };

  const handleRequestDocs = (id) => {
    requestPartnerDocs(id);
  };

  const resetFilters = () => {
    setLocalSearch("");
    setActiveTab("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
              Collaboration & Accreditation
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Institutional Partners & Stakeholders
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage universities, industry partners, NGOs, startups, MSMEs and CSR stakeholders across Jharkhand
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">
              {summary.verified} Verified Entities
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
                Total Stakeholders
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.total}
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3 text-slate-700 border border-slate-200">
              <Building2 size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Registered institutional ecosystem
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                HEIs & Universities
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.universities}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
              <GraduationCap size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Academic R&D and innovation centers
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Industry & CSR Wings
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.industries}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 border border-blue-100">
              <Briefcase size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Corporate impact & grant funders
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pending Verification
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {summary.pending}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Awaiting accreditation approval
          </p>
        </div>
      </div>

      {/* 3. CATEGORY TABS & FILTER BAR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {PARTNER_TYPES.map((tab) => {
            const Icon = getTabIcon(tab);
            const count =
              tab === "All"
                ? partners.length
                : partners.filter((p) => p.type === tab).length;
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
                <Icon size={14} />
                <span>{tab === "All" ? "All Stakeholders" : tab}</span>
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

        {/* Search & Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search partner, contact, district..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-60"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Documents Requested">Documents Requested</option>
          </select>
        </div>
      </div>

      {/* 4. ROSTER TABLE */}
      {paginatedItems.length === 0 ? (
        <EmptyState
          title="No institutional partners found"
          description="Try adjusting your search keywords or switching category/status filters."
          onReset={resetFilters}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Partner ID</th>
                  <th className="py-3.5 px-4">Organization & Accreditation</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Contact Person</th>
                  <th className="py-3.5 px-4">Active Projects</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {paginatedItems.map((item) => {
                  const Icon = getTabIcon(item.type);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-800 border border-slate-200">
                          {item.id}
                        </span>
                      </td>

                      {/* Organization Name & Role */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3 max-w-sm">
                          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 border border-emerald-100 shrink-0 mt-0.5">
                            <Icon size={16} />
                          </div>
                          <div>
                            <button
                              onClick={() => {
                                setSelectedPartner(item);
                                setIsDetailOpen(true);
                              }}
                              className="font-bold text-slate-900 hover:text-emerald-600 text-left transition"
                            >
                              {item.name}
                            </button>
                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                              {item.accreditation || item.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                          {item.type}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{item.location}</span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-semibold text-slate-800">{item.contactPerson}</p>
                          <a
                            href={`mailto:${item.email}`}
                            className="text-[11px] text-slate-400 hover:text-emerald-600 transition truncate max-w-[160px] block"
                          >
                            {item.email}
                          </a>
                        </div>
                      </td>

                      {/* Active Projects */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            setSelectedPartner(item);
                            setIsDetailOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                          title="View project portfolio"
                        >
                          <Layers size={12} />
                          <span>{item.activeProjects} Live Projects</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.verificationStatus} />
                      </td>

                      {/* Last Updated */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {item.lastUpdated}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <button
                            onClick={() => {
                              setSelectedPartner(item);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            title="View Full Profile"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Verification Actions */}
                          {item.verificationStatus === "Pending Verification" ? (
                            <>
                              <button
                                onClick={() => handleVerify(item.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-2xs"
                                title="Approve & Verify Partner"
                              >
                                <Check size={13} />
                                Verify
                              </button>

                              <button
                                onClick={() => handleRequestDocs(item.id)}
                                className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition"
                                title="Request Accreditation Documents"
                              >
                                <FileCheck size={14} />
                              </button>

                              <button
                                onClick={() => handleReject(item.id)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
                                title="Reject Verification"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : item.verificationStatus === "Documents Requested" ? (
                            <button
                              onClick={() => handleVerify(item.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-2xs"
                            >
                              <Check size={13} />
                              Verify
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRequestDocs(item.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                            >
                              Req Docs
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* 5. RICH PARTNER PROFILE & LIVE PROJECTS MODAL */}
      {isDetailOpen && selectedPartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => {
            setIsDetailOpen(false);
            setSelectedPartner(null);
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
                    {selectedPartner.id}
                  </span>
                  <StatusBadge status={selectedPartner.verificationStatus} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedPartner.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedPartner(null);
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
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedPartner.description}
                </p>
              </div>

              {/* 4-Grid Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Category</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {selectedPartner.type}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Jurisdiction</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {selectedPartner.location}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Accreditation</p>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5 truncate">
                    {selectedPartner.accreditation}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Active Projects</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {selectedPartner.activeProjects} Deployments
                  </p>
                </div>
              </div>

              {/* Contact & Registration Information */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Contact & Accreditation Credentials
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400">Authorized Representative</p>
                      <p className="font-semibold text-slate-800">{selectedPartner.contactPerson}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400">Official Communication Email</p>
                      <p className="font-semibold text-emerald-700">{selectedPartner.email}</p>
                    </div>
                  </div>

                  {selectedPartner.gstin && (
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400">GSTIN / Registration Number</p>
                        <p className="font-semibold text-slate-800">{selectedPartner.gstin}</p>
                      </div>
                    </div>
                  )}

                  {selectedPartner.pan && (
                    <div className="flex items-center gap-2">
                      <FileCheck size={14} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400">Entity PAN</p>
                        <p className="font-semibold text-slate-800">{selectedPartner.pan}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Project Portfolio */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
                  Allocated Civic Solution Portfolio ({selectedPartner.activeProjects})
                </h4>
                <div className="space-y-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {selectedPartner.type === "Universities"
                          ? "Blockchain Land Registry Smart Contracts"
                          : selectedPartner.type === "Industries"
                          ? "Tribal Watershed & Clean Water Grant Program"
                          : "Edge AI Rural Diagnostics Deployment"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Target District: {selectedPartner.location} • Phase: Deployment
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      On Track
                    </span>
                  </div>

                  {selectedPartner.activeProjects > 1 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between shadow-2xs">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Autonomous Municipal Waste Sorting & Drone Telemetry
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Target District: {selectedPartner.location} • Phase: Prototype
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                        Active Testing
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <span className="text-xs text-slate-400">
                Last Verified: {selectedPartner.lastUpdated}
              </span>
              <div className="flex items-center gap-2">
                {selectedPartner.verificationStatus === "Pending Verification" && (
                  <>
                    <button
                      onClick={() => {
                        handleVerify(selectedPartner.id);
                        setIsDetailOpen(false);
                      }}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                    >
                      <Check size={14} />
                      Verify Partner
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedPartner.id);
                        setIsDetailOpen(false);
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    setSelectedPartner(null);
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
    </div>
  );
}