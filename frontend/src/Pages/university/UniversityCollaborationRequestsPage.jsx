import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import {
  Handshake,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  ExternalLink,
  Layers,
  X,
  Sparkles,
  Check,
} from "lucide-react";
import { FiCheck } from "react-icons/fi";

import Sidebar from "../../components/citizen-dashboard/Sidebar";
import Topbar from "../../components/citizen-dashboard/Topbar";
import { useAuth } from "../../context/AuthContext";
import {
  getUniversityCollaborations,
  updateCollaborationStatus,
} from "../../utils/industryMockData";

export default function UniversityCollaborationRequestsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [version, setVersion] = useState(0);

  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  // Load live shared collaborations matching university's assigned challenges
  const [collaborationsList, setCollaborationsList] = useState([]);

  useEffect(() => {
    const list = getUniversityCollaborations(user);
    setCollaborationsList(list);
  }, [user, version]);

  useEffect(() => {
    const handleUpdate = () => {
      const list = getUniversityCollaborations(user);
      setCollaborationsList(list);
      setVersion((v) => v + 1);
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_collaborations_updated", handleUpdate);
    window.addEventListener("solvesphere_university_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_collaborations_updated", handleUpdate);
      window.removeEventListener("solvesphere_university_updated", handleUpdate);
    };
  }, [user]);

  const filteredRequests = useMemo(() => {
    if (activeTab === "All") return collaborationsList;
    if (activeTab === "Active") {
      return collaborationsList.filter((c) => c.status === "ACTIVE" || c.status === "ACCEPTED");
    }
    return collaborationsList.filter(
      (item) => item.status?.toLowerCase() === activeTab.toLowerCase()
    );
  }, [collaborationsList, activeTab]);

  const stats = useMemo(() => {
    return {
      total: collaborationsList.length,
      pending: collaborationsList.filter((c) => c.status === "PENDING").length,
      accepted: collaborationsList.filter((c) => c.status === "ACCEPTED" || c.status === "ACTIVE").length,
      rejected: collaborationsList.filter((c) => c.status === "REJECTED").length,
    };
  }, [collaborationsList]);

  const handleOpenDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleAccept = (e, requestId) => {
    if (e && e.stopPropagation) e.stopPropagation();

    // Update storage
    updateCollaborationStatus(requestId, "ACTIVE", user);

    // Update local state immediately
    setCollaborationsList((prev) =>
      prev.map((item) =>
        item.id === requestId || item.projectId === requestId
          ? { ...item, status: "ACTIVE" }
          : item
      )
    );

    if (selectedRequest && (selectedRequest.id === requestId || selectedRequest.projectId === requestId)) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: "ACTIVE" } : null));
    }

    setActionSuccess("Collaboration Proposal Accepted! Status is now Active.");
    setTimeout(() => setActionSuccess(""), 4000);

    if (showToast) {
      showToast("Collaboration Proposal Accepted! Status is now ACTIVE.", "success");
    }

    setVersion((v) => v + 1);
  };

  const handleReject = (e, requestId) => {
    if (e && e.stopPropagation) e.stopPropagation();

    // Update storage
    updateCollaborationStatus(requestId, "REJECTED", user);

    // Update local state immediately
    setCollaborationsList((prev) =>
      prev.map((item) =>
        item.id === requestId || item.projectId === requestId
          ? { ...item, status: "REJECTED" }
          : item
      )
    );

    if (selectedRequest && (selectedRequest.id === requestId || selectedRequest.projectId === requestId)) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: "REJECTED" } : null));
    }

    setActionSuccess("Collaboration Proposal Declined.");
    setTimeout(() => setActionSuccess(""), 4000);

    if (showToast) {
      showToast("Collaboration Proposal Declined.", "info");
    }

    setVersion((v) => v + 1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700">
            <Clock size={13} />
            PENDING
          </span>
        );
      case "ACCEPTED":
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
            <CheckCircle2 size={13} />
            ACTIVE
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-700">
            <XCircle size={13} />
            REJECTED
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
            <CheckCircle2 size={13} />
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="ml-0 lg:ml-64">
        <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="w-full space-y-6 px-4 py-6 sm:px-6 lg:p-8">
          {actionSuccess && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Check className="h-5 w-5 text-blue-600" />
                {actionSuccess}
              </div>
              <button
                type="button"
                onClick={() => setActionSuccess("")}
                className="text-blue-600 hover:text-blue-800"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
              Collaboration
            </span>

            <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
              Collaboration Requests
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Review industry proposals from capable partners offering co-development, funding, and testing for your accepted civic projects.
            </p>
          </motion.div>

          {/* Metric Bar */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Requests</span>
              <p className="mt-2 text-2xl font-black text-slate-900">{stats.total}</p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending</span>
              <p className="mt-2 text-2xl font-black text-amber-800">{stats.pending}</p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Accepted / Active</span>
              <p className="mt-2 text-2xl font-black text-blue-800">{stats.accepted}</p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5 shadow-sm">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Rejected</span>
              <p className="mt-2 text-2xl font-black text-red-800">{stats.rejected}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            {["All", "Pending", "Active", "Rejected", "Completed"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition shrink-0 cursor-pointer ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Request Cards Grid */}
          {filteredRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
              No collaboration proposals found in "{activeTab}".
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div>
                    {/* Industry Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                            <Building2 size={18} />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 block leading-tight">
                              {request.companyName}
                            </span>
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                              {request.companyType}
                            </span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {/* Target Challenge Section */}
                    <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        <span>Project Proposal For</span>
                        <span className="text-blue-600 font-mono">{request.projectId}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {request.projectName}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {request.message}
                      </p>
                    </div>

                    {/* Industry Capability Snippet */}
                    {request.capabilityDescription && (
                      <div className="mt-3 text-xs text-slate-600">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Industry Capability:
                        </span>
                        <p className="text-xs text-slate-600 line-clamp-2 italic">
                          "{request.capabilityDescription}"
                        </p>
                      </div>
                    )}

                    {/* Offerings & Funding */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Support Offered
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(request.collaborationTypes || ["Technical Mentorship", "Testing"]).map((type) => (
                            <span
                              key={type}
                              className="rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 flex items-center gap-1"
                            >
                              <FiCheck className="h-3 w-3" /> {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      {request.fundingOffered && (
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                            Grant / Funding
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                            <Sparkles size={11} /> {request.fundingOffered}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(request)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      VIEW DETAILS
                    </button>

                    <div className="flex items-center gap-2">
                      {request.status === "PENDING" && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => handleReject(e, request.id)}
                            className="rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer active:scale-95"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleAccept(e, request.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer active:scale-95"
                          >
                            <Check size={14} /> Accept Proposal
                          </button>
                        </>
                      )}

                      {(request.status === "ACTIVE" || request.status === "ACCEPTED") && (
                        <Link
                          to={`/workspace?challenge=${request.projectId}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
                        >
                          <Layers size={14} />
                          OPEN WORKSPACE
                        </Link>
                      )}

                      {request.status === "REJECTED" && (
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl">
                          Proposal Declined
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* REQUEST DETAILS MODAL */}
      {isDetailsModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 my-8 max-h-[90vh] flex flex-col animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Handshake size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Industry Collaboration Proposal</h3>
                  <p className="text-xs text-slate-500">Project: {selectedRequest.projectName}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-700">
              {/* INDUSTRY DETAILS */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Building2 size={16} className="text-blue-600" />
                    INDUSTRY PARTNER CREDENTIALS
                  </h4>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                    {selectedRequest.companyType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Company Name</span>
                    <p className="font-bold text-slate-900 text-sm">{selectedRequest.companyName}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Lead Contact Person</span>
                    <p className="font-semibold text-slate-800">{selectedRequest.contactPerson}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Official Email</span>
                    <p className="font-medium text-slate-800">{selectedRequest.companyEmail}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Industry Domain</span>
                    <p className="font-semibold text-slate-800">{selectedRequest.industryDomain}</p>
                  </div>
                </div>

                {selectedRequest.capabilityDescription && (
                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Technical Capability & Track Record
                    </span>
                    <p className="text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-lg border border-slate-200">
                      {selectedRequest.capabilityDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* PROJECT DETAILS */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  TARGET CIVIC CHALLENGE
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Project / Challenge</span>
                    <p className="font-bold text-slate-800">{selectedRequest.projectName}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Category & Location</span>
                    <p className="font-semibold text-slate-800">
                      {selectedRequest.domain} • {selectedRequest.district}
                    </p>
                  </div>
                </div>
              </div>

              {/* COLLABORATION OFFERED & MESSAGE */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 border-b border-blue-200 pb-2 flex items-center justify-between">
                  <span>PROPOSAL DETAILS & COMMITMENT</span>
                  {selectedRequest.fundingOffered && (
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                      {selectedRequest.fundingOffered}
                    </span>
                  )}
                </h4>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Offered Resources & Assistance
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedRequest.collaborationTypes || ["Technical Mentorship"]).map((type) => (
                      <span key={type} className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded-md text-xs flex items-center gap-1">
                        <FiCheck className="h-3 w-3" /> {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Message from Industry Partner
                  </span>
                  <p className="bg-white p-3.5 rounded-lg border border-blue-100 text-slate-800 leading-relaxed">
                    "{selectedRequest.message}"
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                {getStatusBadge(selectedRequest.status)}
              </div>

              <div className="flex items-center gap-3">
                {selectedRequest.status === "PENDING" ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleReject(e, selectedRequest.id)}
                      className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer active:scale-95"
                    >
                      Decline Proposal
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleAccept(e, selectedRequest.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer active:scale-95"
                    >
                      <Check size={15} />
                      Accept Proposal & Collaborate
                    </button>
                  </>
                ) : (selectedRequest.status === "ACTIVE" || selectedRequest.status === "ACCEPTED") ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      navigate(`/workspace?challenge=${selectedRequest.projectId}`);
                    }}
                    className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Layers size={15} />
                    Open Shared Workspace
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
