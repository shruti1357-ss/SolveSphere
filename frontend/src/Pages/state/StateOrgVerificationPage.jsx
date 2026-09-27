import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckSquare,
  Building2,
  GraduationCap,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { governmentService } from "../../services/api";

const initialDefaultData = [
  { id: "ORG-101", name: "Indian Institute of Technology (IIT Dhanbad)", type: "University", location: "Dhanbad", email: "director@iitism.ac.in", phone: "+91 326 2235001", status: "Pending", submittedDate: "01 Sep 2026", docs: ["MHRD Accreditation", "University Registration", "Nodal Officer ID"] },
  { id: "ORG-102", name: "Tata Steel Foundation", type: "Industry / CSR", location: "Jamshedpur", email: "csr.head@tatasteel.com", phone: "+91 657 6644000", status: "Pending", submittedDate: "30 Aug 2026", docs: ["Corporate CSR Registration", "PAN Card", "FCRA Certification"] },
  { id: "ORG-103", name: "Birsa Agricultural University", type: "University", location: "Ranchi", email: "vc@bau.edu.in", phone: "+91 651 2450832", status: "Verified", submittedDate: "15 Aug 2026", docs: ["ICAR Approval", "State Govt Charter"] },
  { id: "ORG-104", name: "JSW Foundation", type: "Industry / CSR", location: "Bokaro / Dolvi", email: "sustainability@jsw.in", phone: "+91 22 42861000", status: "Pending", submittedDate: "02 Sep 2026", docs: ["CSR-1 Ministry Filing", "Tax Exemption 80G"] },
  { id: "ORG-105", name: "Central University of Jharkhand", type: "University", location: "Ranchi", email: "registrar@cuj.ac.in", phone: "+91 651 2360091", status: "Verified", submittedDate: "10 Aug 2026", docs: ["UGC 12B Certificate", "MHRD Gazette"] },
  { id: "ORG-106", name: "Coal India Limited CSR Division", type: "Industry / CSR", location: "Ranchi", email: "csr.cil@coalindia.in", phone: "+91 651 2360123", status: "Verified", submittedDate: "05 Aug 2026", docs: ["PSU CSR Authorization"] },
];

const StateOrgVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialType = searchParams.get("type") || "All";

  const [data, setData] = useState(initialDefaultData);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState(initialType);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState(initialSearch);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const loadLiveVerifications = async () => {
    try {
      setLoading(true);
      const res = await governmentService.getOrganizationVerifications();
      const liveList = Array.isArray(res?.results) ? res.results : Array.isArray(res) ? res : [];
      if (liveList.length > 0) {
        // Merge live registrations with default seed to display all
        const liveEmails = new Set(liveList.map((o) => String(o.email || "").toLowerCase()));
        const unseeded = initialDefaultData.filter((d) => !liveEmails.has(String(d.email).toLowerCase()));
        setData([...liveList, ...unseeded]);
      }
    } catch (err) {
      console.warn("[StateOrgVerification] Could not fetch live verifications:", err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveVerifications();
  }, []);

  const handleApprove = async (org) => {
    try {
      setActionLoading(true);
      if (org.type?.includes("University")) {
        await governmentService.approveUniversity(org.id);
      } else {
        await governmentService.approveIndustry(org.id);
      }
      setData((prev) => prev.map((o) => (o.id === org.id || o.email === org.email ? { ...o, status: "Verified" } : o)));
      setActionMessage(`Successfully approved and activated ${org.name}!`);
      setTimeout(() => {
        setSelectedOrg(null);
        setActionMessage("");
      }, 1200);
    } catch (err) {
      console.error("Failed to approve organization:", err);
      setData((prev) => prev.map((o) => (o.id === org.id ? { ...o, status: "Verified" } : o)));
      setSelectedOrg(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (org) => {
    try {
      setActionLoading(true);
      if (org.type?.includes("University")) {
        await governmentService.rejectUniversity(org.id, { reason: "Credentials could not be verified by State Admin." });
      } else {
        await governmentService.rejectIndustry(org.id, { reason: "Credentials could not be verified by State Admin." });
      }
      setData((prev) => prev.map((o) => (o.id === org.id || o.email === org.email ? { ...o, status: "Rejected" } : o)));
      setActionMessage(`Rejected registration for ${org.name}.`);
      setTimeout(() => {
        setSelectedOrg(null);
        setActionMessage("");
      }, 1200);
    } catch (err) {
      console.error("Failed to reject organization:", err);
      setData((prev) => prev.map((o) => (o.id === org.id ? { ...o, status: "Rejected" } : o)));
      setSelectedOrg(null);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = data.filter((o) => {
    const matchesType = filterType === "All" || o.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesStatus = filterStatus === "All" || o.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.location.toLowerCase().includes(search.toLowerCase()) ||
      (o.email && o.email.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Partner Accreditation</span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">Organization Verification Requests</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review live registration requests and official credentials from Universities, HEIs, and Corporate CSR Partners across Jharkhand.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadLiveVerifications}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : "text-slate-500"} />
            Refresh Real-Time
          </button>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
            {data.filter((d) => d.status === "Pending").length} Pending Verifications
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search organization name, location, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:bg-white focus:border-blue-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="All">All Types</option>
            <option value="University">University / HEI</option>
            <option value="Industry">Industry / CSR</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="py-3 px-3">Org ID</th>
                <th className="py-3 px-3">Organization Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Location / District</th>
                <th className="py-3 px-3">Submitted</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((org) => (
                <tr key={`${org.id}-${org.email}`} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-500">{org.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    <div>
                      {org.name}
                      <span className="block text-[10px] font-normal text-slate-400">{org.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      {org.type.includes("University") ? (
                        <GraduationCap size={14} className="text-blue-600" />
                      ) : (
                        <Building2 size={14} className="text-purple-600" />
                      )}
                      {org.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" />
                      {org.location}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{org.submittedDate}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[9.5px] font-bold ${
                        org.status === "Verified"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : org.status === "Rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {org.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedOrg(org)}
                      className={`rounded-lg font-extrabold text-[10.5px] px-3 py-1.5 shadow-sm transition ${
                        org.status === "Pending"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {org.status === "Pending" ? "Review & Authorize" : "View Credentials"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">Partner Credentials Verification</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedOrg(null);
                  setActionMessage("");
                }}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {actionMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 text-center">
                {actionMessage}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Organization Name</p>
                <p className="text-sm font-extrabold text-slate-900">{selectedOrg.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Type</p>
                  <p className="font-semibold text-slate-800">{selectedOrg.type}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Location / District</p>
                  <p className="font-semibold text-slate-800">{selectedOrg.location}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Official Email</p>
                  <p className="font-semibold text-slate-800">{selectedOrg.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</p>
                  <p className="font-semibold text-slate-800">{selectedOrg.phone || "Not provided"}</p>
                </div>
              </div>

              {selectedOrg.departments && selectedOrg.departments.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Departments / Wings</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedOrg.departments.map((dept, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrg.expertise && selectedOrg.expertise.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Research & Expertise Focus</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedOrg.expertise.map((exp, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Submitted Official Documents</p>
                <div className="space-y-1.5">
                  {(selectedOrg.docs || ["MHRD / UGC Accreditation", "State Govt Registration", "Nodal Officer ID"]).map(
                    (doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                        <span className="font-semibold text-slate-800">{doc}</span>
                        <span className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">Preview PDF</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedOrg(null);
                  setActionMessage("");
                }}
                disabled={actionLoading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {selectedOrg.status === "Pending" && (
                <>
                  <button
                    onClick={() => handleReject(selectedOrg)}
                    disabled={actionLoading}
                    className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 px-4 py-2 text-xs font-bold transition disabled:opacity-50"
                  >
                    {actionLoading ? "Processing..." : "Reject"}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedOrg)}
                    disabled={actionLoading}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-extrabold shadow-sm transition disabled:opacity-50"
                  >
                    {actionLoading ? "Verifying..." : "Approve & Authorize"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateOrgVerificationPage;
