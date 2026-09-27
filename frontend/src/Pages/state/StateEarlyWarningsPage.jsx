import React, { useState } from "react";
import {
  Bell,
  AlertOctagon,
  ShieldAlert,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Send,
  X,
  Radio,
  FileCheck,
  Building,
  ShieldCheck,
  Layers,
  Sparkles,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

const initialWarningSignals = [
  {
    id: 1,
    location: "Khunti District",
    district: "Khunti",
    category: "Water Supply & Contamination",
    riskLevel: "High",
    score: 8.8,
    growth: "+45% this week",
    status: "Active Hotspot",
    details: "Rapid rise in citizen reports concerning borewell drying and pipeline chemical seepage.",
    recommendedDept: "Drinking Water & Sanitation Department (DWSD)",
    defaultDirective: "Initiate emergency mobile water tanker routes, dispatch water testing labs to Ward 4-9, and expedite alternate piped supply connection.",
    dispatched: false,
  },
  {
    id: 2,
    location: "Dhanbad Coalfield Zone",
    district: "Dhanbad",
    category: "Air Pollution & Particulates",
    riskLevel: "High",
    score: 8.5,
    growth: "+38% this week",
    status: "Active Hotspot",
    details: "AQI spike over 320 recorded across 4 monitoring stations. Respiratory complaint spikes.",
    recommendedDept: "Jharkhand State Pollution Control Board (JSPCB) & Health Dept",
    defaultDirective: "Deploy industrial anti-smog mist cannons along heavy transport corridors, issue N95 advisory to primary schools, and inspect unpaved coal haul roads.",
    dispatched: false,
  },
  {
    id: 3,
    location: "Ranchi Industrial Bypass",
    district: "Ranchi",
    category: "Structural Road Failure",
    riskLevel: "Medium",
    score: 6.8,
    growth: "+20% this week",
    status: "Monitoring",
    details: "Multiple heavy vehicle pothole incidents causing traffic bottlenecks.",
    recommendedDept: "Road Construction Department (RCD) & Municipal Corp",
    defaultDirective: "Commence rapid cold-mix bitumen patching within 48 hours and re-route heavy multi-axle freight traffic during peak hours.",
    dispatched: false,
  },
  {
    id: 4,
    location: "East Singhbhum (Subarnarekha Basin)",
    district: "East Singhbhum",
    category: "Monsoon Flood Risk",
    riskLevel: "Medium",
    score: 6.2,
    growth: "+15% this week",
    status: "Monitoring",
    details: "Water levels approaching warning threshold near Chandil dam discharge point.",
    recommendedDept: "Disaster Management Division & Water Resources Dept",
    defaultDirective: "Place NDRF / SDRF local rescue units on level-2 standby and notify downstream low-lying riverside panchayats.",
    dispatched: false,
  },
  {
    id: 5,
    location: "Garhwa Drought Belt",
    district: "Garhwa",
    category: "Agricultural Drought Signal",
    riskLevel: "Low",
    score: 4.5,
    growth: "+5% this week",
    status: "Low Concern",
    details: "Soil moisture deficit recorded in 3 blocks.",
    recommendedDept: "Department of Agriculture, Animal Husbandry & Co-operative",
    defaultDirective: "Release targeted micro-irrigation diesel subsidies and verify solar pump operation across affected rural blocks.",
    dispatched: false,
  },
];

const StateEarlyWarningsPage = () => {
  const [warnings, setWarnings] = useState(initialWarningSignals);
  const [activeModalSignal, setActiveModalSignal] = useState(null);
  const [department, setDepartment] = useState("");
  const [directive, setDirective] = useState("");
  const [priorityUrgency, setPriorityUrgency] = useState("Immediate Action Required (24h)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const criticalCount = warnings.filter((w) => w.riskLevel === "High" && !w.dispatched).length;
  const mediumCount = warnings.filter((w) => w.riskLevel === "Medium" && !w.dispatched).length;
  const dispatchedCount = warnings.filter((w) => w.dispatched).length;

  const handleOpenAdvisoryModal = (signal) => {
    setActiveModalSignal(signal);
    setDepartment(signal.recommendedDept);
    setDirective(signal.defaultDirective);
    setPriorityUrgency(
      signal.riskLevel === "High"
        ? "Immediate Action Required (24h)"
        : "Priority Intervention (48h-72h)"
    );
  };

  const handleSendAdvisory = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!activeModalSignal) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Mark warning as dispatched
      setWarnings((prev) =>
        prev.map((w) =>
          w.id === activeModalSignal.id
            ? {
                ...w,
                dispatched: true,
                dispatchedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                dispatchedTo: department,
              }
            : w
        )
      );

      // Create state notification in localStorage
      try {
        const savedNotifs = localStorage.getItem("solvesphere_state_notifications");
        let list = [];
        if (savedNotifs) list = JSON.parse(savedNotifs);

        const newNotif = {
          id: `advisory-${Date.now()}`,
          title: `Advisory Dispatched: ${activeModalSignal.location}`,
          message: `Official State Advisory sent to ${department} regarding ${activeModalSignal.category}.`,
          timestamp: "Just now",
          read: false,
          link: "/state/early-warnings",
        };

        localStorage.setItem("solvesphere_state_notifications", JSON.stringify([newNotif, ...list]));
        window.dispatchEvent(new Event("solvesphere_state_notifications_updated"));
      } catch (err) {
        console.warn("Could not save dispatched advisory notification:", err);
      }

      setIsSubmitting(false);
      setToastMessage(`Official State Advisory successfully dispatched to ${department}!`);
      setActiveModalSignal(null);

      setTimeout(() => setToastMessage(""), 5000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600" size={18} />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage("")}
            className="rounded-lg p-1 text-emerald-700 hover:bg-emerald-100"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1">
            <Bell size={13} /> State Early Warning Radar
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">Early Warning &amp; Risk Hotspots</h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated predictive alerts derived from citizen report surges, environmental telemetry, and historical trend anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
            {warnings.filter((w) => !w.dispatched).length} Active Risk Signals
          </div>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs uppercase">
            <AlertOctagon size={16} /> Critical Hotspots
          </div>
          <p className="text-3xl font-black text-rose-950 mt-2">{criticalCount}</p>
          <p className="text-[11px] text-rose-700 mt-1">
            {criticalCount > 0
              ? "Districts requiring immediate state administrative intervention."
              : "All critical hotpots currently have active advisories dispatched."}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs uppercase">
            <ShieldAlert size={16} /> Medium Risk Alerts
          </div>
          <p className="text-3xl font-black text-amber-950 mt-2">{mediumCount}</p>
          <p className="text-[11px] text-amber-700 mt-1">Ranchi &amp; East Singhbhum under active civic telemetry monitoring.</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase">
            <CheckCircle2 size={16} /> Dispatched &amp; Mitigated
          </div>
          <p className="text-3xl font-black text-emerald-950 mt-2">{14 + dispatchedCount}</p>
          <p className="text-[11px] text-emerald-700 mt-1">Active directives sent to District Collectors and Nodal Officers.</p>
        </div>
      </div>

      {/* Risk Signals List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#0d3971]">Active State Early Warning Alerts</h2>
            <p className="text-[10px] text-slate-400">Click Dispatch Advisory to issue binding state directives to local district departments</p>
          </div>
          <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-[10px] font-bold">
            Live AI Threat Clustering
          </span>
        </div>

        <div className="space-y-3">
          {warnings.map((signal) => (
            <div
              key={signal.id}
              className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border transition ${
                signal.dispatched
                  ? "border-emerald-200 bg-emerald-50/30"
                  : "border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-md"
              }`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9.5px] font-extrabold ${
                      signal.dispatched
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : signal.riskLevel === "High"
                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                        : signal.riskLevel === "Medium"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {signal.dispatched
                      ? "✓ Advisory Dispatched"
                      : `${signal.riskLevel} Risk Signal (Score: ${signal.score})`}
                  </span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <MapPin size={13} className="text-blue-600" /> {signal.location}
                  </span>
                  {signal.dispatched && (
                    <span className="text-[10px] font-semibold text-emerald-700">
                      • Dispatched at {signal.dispatchedAt} to {signal.dispatchedTo}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900">{signal.category}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{signal.details}</p>

                <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">Designated Nodal Dept:</span>
                  <span className="text-blue-700 font-medium">{signal.recommendedDept}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Growth Rate</p>
                  <p className="text-xs font-extrabold text-rose-600 flex items-center gap-0.5">
                    <TrendingUp size={13} /> {signal.growth}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenAdvisoryModal(signal)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs flex items-center gap-1.5 ${
                    signal.dispatched
                      ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                      : "bg-[#0d3971] hover:bg-blue-800 text-white"
                  }`}
                >
                  <Send size={13} />
                  {signal.dispatched ? "Re-Dispatch Advisory" : "Dispatch Advisory"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch State Advisory Modal */}
      {activeModalSignal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-extrabold text-rose-700 border border-rose-200 mb-1">
                  <Radio size={12} className="animate-pulse" />
                  State Government Executive Advisory
                </div>
                <h3 className="text-base font-black text-slate-900">
                  Dispatch Advisory: {activeModalSignal.location}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Category: <strong>{activeModalSignal.category}</strong> • Risk Score: {activeModalSignal.score}/10
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalSignal(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Alert Summary Box */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 space-y-1">
              <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-600" />
                Early Warning Signal Summary
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                {activeModalSignal.details}
              </p>
            </div>

            {/* Dispatch Form */}
            <form onSubmit={handleSendAdvisory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Nodal Department / District Collectorate
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Drinking Water & Sanitation Dept, District Collector Khunti"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Advisory Urgency &amp; Action Window
                </label>
                <select
                  value={priorityUrgency}
                  onChange={(e) => setPriorityUrgency(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="Immediate Action Required (24h)">Immediate Action Required (24h Response Window)</option>
                  <option value="Priority Intervention (48h-72h)">Priority Intervention (48h - 72h Window)</option>
                  <option value="Preventive Monitoring (7 Days)">Preventive Monitoring (7 Days Action Plan)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Executive Directive &amp; Operational Orders
                </label>
                <textarea
                  rows={4}
                  value={directive}
                  onChange={(e) => setDirective(e.target.value)}
                  placeholder="Type specific state directives, emergency resource allocations, or field inspection orders..."
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[10px] text-slate-400">
                  Transmitted via Jharkhand State Emergency Governance Ledger
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalSignal(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d3971] hover:bg-blue-800 px-5 py-2 text-xs font-extrabold text-white shadow-sm transition disabled:opacity-60"
                  >
                    <Send size={13} />
                    {isSubmitting ? "Transmitting..." : "Send Binding Advisory"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateEarlyWarningsPage;
