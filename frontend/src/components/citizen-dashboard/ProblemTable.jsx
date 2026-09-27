import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiX,
  FiCheck,
  FiCircle,
  FiClock,
  FiAlertCircle,
  FiAward,
} from "react-icons/fi";
import {
  GraduationCap,
  Building2,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText, localizeProblemTitle, localizeAddress } from "../../i18n/citizenUi";

const ProblemTable = ({ localized = false }) => {
  const { userProblems } = useAuth();
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedProgressProblem, setSelectedProgressProblem] = useState(null);
  const [liveVersion, setLiveVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setLiveVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_problems_updated", handleUpdate);
    window.addEventListener("solvesphere_university_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_problems_updated", handleUpdate);
      window.removeEventListener("solvesphere_university_updated", handleUpdate);
    };
  }, []);

  const getProblemTitle = (title) => {
    if (!title) return "";
    return localized ? localizeProblemTitle(language, title) : title;
  };

  const localizeCategory = (category) => {
    const value = String(category || "General").trim();
    const keyMap = {
      "Healthcare": "categoryHealthcare",
      "Waste Management": "categoryWasteManagement",
      "Water Management": "categoryWaterManagement",
      "Water & Sanitation": "categoryWaterManagement",
      "Education": "categoryEducation",
      "Roads": "categoryRoads",
      "Infrastructure": "categoryRoads",
      "Sanitation": "categorySanitation",
      "Public Safety": "categoryPublicSafety",
      "Environment": "categoryGeneral",
      "General": "categoryGeneral",
    };
    return localized ? rt(keyMap[value] || "categoryGeneral") : value;
  };

  const getDisplayLocation = (problem) => {
    const raw =
      problem?.location ||
      problem?.address ||
      [problem?.block, problem?.district]
        .filter(Boolean)
        .join(", ") ||
      "District Area";
    return localized ? localizeAddress(raw, language) : raw;
  };

  const getLifecycleStageInfo = (problem) => {
    const rawStatus = String(
      problem?.backendStatus || problem?.status || ""
    ).toUpperCase();

    const isRejected = rawStatus.includes("REJECT") || String(problem?.status).toLowerCase().includes("reject");

    if (isRejected) {
      return {
        stageIndex: 2,
        isRejected: true,
        progressPercent: 100,
        statusLabel: "Rejected by Government",
        badgeStyle: "bg-red-50 text-red-700 border-red-200",
      };
    }

    let stageIndex = 1;
    let progressPercent = 15;
    let statusLabel = "Under AI Analysis";
    let badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";

    if (rawStatus === "RESOLVED" || rawStatus === "COMPLETED" || String(problem?.status).toLowerCase().includes("complete")) {
      stageIndex = 6;
      progressPercent = 100;
      statusLabel = "Completed & Impact Generated";
      badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (rawStatus === "DEPLOYED" || rawStatus === "TESTING" || String(problem?.status).toLowerCase().includes("deploy")) {
      stageIndex = 5;
      progressPercent = 80;
      statusLabel = "Field Testing & Deployment";
      badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
    } else if (rawStatus === "IN_PROGRESS" || String(problem?.status).toLowerCase().includes("in progress")) {
      stageIndex = 4;
      progressPercent = 55;
      statusLabel = `In Progress (${problem?.assignedUniversity || "University R&D"})`;
      badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
    } else if (rawStatus === "ASSIGNED_TO_HEI" || problem?.assignedUniversity || String(problem?.status).toLowerCase().includes("assigned")) {
      stageIndex = 3;
      progressPercent = 35;
      statusLabel = `Assigned to ${problem?.assignedUniversity || "University"}`;
      badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
    } else if (rawStatus === "OPEN" || String(problem?.status).toLowerCase().includes("approved")) {
      stageIndex = 2;
      progressPercent = 25;
      statusLabel = "Approved by Government";
      badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
    }

    return { stageIndex, isRejected, progressPercent, statusLabel, badgeStyle };
  };

  const getMilestones = (problem) => {
    const { stageIndex, isRejected } = getLifecycleStageInfo(problem);

    const milestones = [
      {
        id: "submitted",
        title: "Report Submitted",
        desc: `Logged on ${getDisplayDate(problem)}`,
      },
      {
        id: "ai",
        title: "AI Analysis & Severity",
        desc: `Risk Score: ${problem.urgency_score || 8}/10 (${problem.priority || "High"})`,
      },
      {
        id: "gov",
        title: isRejected ? "Government Scrutiny" : "District Government Review",
        desc: isRejected ? `Rejected: ${problem.rejectionReason || "Scrutiny unverified"}` : "Approved for civic action",
      },
      {
        id: "uni",
        title: "University Assigned",
        desc: problem.assignedUniversity
          ? `${problem.assignedUniversity} (${problem.assignedDepartment || "R&D Dept"})`
          : "Matching university expertise",
      },
      {
        id: "dev",
        title: "Solution Development",
        desc: stageIndex >= 4 ? "Active prototyping & engineering" : "Pending milestone start",
      },
      {
        id: "testing",
        title: "Field Deployment & Testing",
        desc: stageIndex >= 5 ? "On-ground pilot implementation" : "Scheduled after development",
      },
      {
        id: "impact",
        title: "Completed & Impact Verified",
        desc: stageIndex >= 6 ? (problem.impactSummary || "Problem resolved successfully with civic benefits") : "Final verification",
      },
    ];

    return milestones.map((m, idx) => ({
      ...m,
      completed: isRejected ? idx < 2 : idx < stageIndex,
      current: isRejected ? idx === 2 : idx === stageIndex,
      failed: isRejected && idx === 2,
    }));
  };

  const getDisplayDate = (problem) => {
    if (problem?.date) return problem.date;

    const rawDate = problem?.created_at || problem?.submittedAt;
    if (!rawDate) return "—";

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const label = (key, fallback) => (localized ? rt(key) : fallback);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {label("citizen.myProblems", "My Reported Problems")}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            {localized
              ? `${rt("citizen.totalReportsDesc")} (${userProblems.length} total)`
              : `Real-time tracking of civic issues submitted by you (${userProblems.length} total)`}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] scrollbar-hide">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-700">
              <th className="px-6 py-3.5 text-left">
                {label("citizen.problemTitle", "Problem Title")}
              </th>
              <th className="px-6 py-3.5 text-left">
                {label("citizen.categoryLocation", "Category / Location")}
              </th>
              <th className="px-6 py-3.5 text-left">
                {label("citizen.submittedOn", "Submitted On")}
              </th>
              <th className="px-6 py-3.5 text-left">
                Live Status &amp; University
              </th>
              <th className="px-6 py-3.5 text-right">
                {label("citizen.action", "Action")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {userProblems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-400">
                  {localized ? rt("emptyProblems") : "You have not submitted any problems yet."}
                </td>
              </tr>
            ) : (
              userProblems.map((problem, index) => {
                const info = getLifecycleStageInfo(problem);

                return (
                  <tr
                    key={problem.id || index}
                    className="hover:bg-slate-50/60 transition group"
                  >
                    {/* Problem */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xs">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-slate-900 block truncate max-w-sm group-hover:text-blue-600 transition">
                            {getProblemTitle(problem.title)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {problem.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Location / Category */}
                    <td className="px-6 py-4.5">
                      <span className="text-xs font-bold text-slate-700 block">
                        {localizeCategory(problem.category || problem.backendCategory || "General")}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} /> {getDisplayLocation(problem)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4.5 text-xs text-slate-500 font-medium">
                      {getDisplayDate(problem)}
                    </td>

                    {/* Status & University */}
                    <td className="px-6 py-4.5">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold border ${info.badgeStyle}`}
                        >
                          {info.isRejected ? (
                            <FiAlertCircle size={12} className="text-red-600" />
                          ) : info.progressPercent === 100 ? (
                            <CheckCircle2 size={12} className="text-emerald-600" />
                          ) : (
                            <Activity size={12} className="text-blue-600 animate-pulse" />
                          )}
                          {info.statusLabel}
                        </span>

                        {problem.assignedUniversity && !info.isRejected && (
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                            <GraduationCap size={12} className="text-blue-600" />
                            <span>{problem.assignedUniversity}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProgressProblem(problem)}
                          className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition shadow-2xs"
                        >
                          <TrendingUp size={13} />
                          Track Progress
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedProblem(problem)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition px-2 py-1"
                        >
                          {rt("viewDetails")}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Real-Time Milestone & Impact Progress Modal */}
      {selectedProgressProblem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedProgressProblem(null)}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-6 bg-slate-50/70">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                  Real-Time Problem Lifecycle Tracker
                </span>
                <h3 className="mt-1 truncate text-lg font-extrabold text-slate-900 sm:text-xl">
                  {getProblemTitle(selectedProgressProblem.title)}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Report ID: <strong className="font-mono text-slate-700">{selectedProgressProblem.id}</strong> • Location: <strong>{getDisplayLocation(selectedProgressProblem)}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProgressProblem(null)}
                className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Progress Summary Card */}
              {(() => {
                const info = getLifecycleStageInfo(selectedProgressProblem);
                return (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Phase</span>
                        <p className="text-sm font-extrabold text-slate-800">{info.statusLabel}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold border ${info.badgeStyle}`}>
                        {info.progressPercent}% Completed
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${info.progressPercent}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full ${info.isRejected ? "bg-red-500" : info.progressPercent === 100 ? "bg-emerald-500" : "bg-blue-600"}`}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Assigned University Card (if assigned) */}
              {selectedProgressProblem.assignedUniversity && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Assigned R&amp;D Institution</span>
                      <h4 className="text-sm font-bold text-slate-900">{selectedProgressProblem.assignedUniversity}</h4>
                      <p className="text-[11px] text-slate-600">{selectedProgressProblem.assignedDepartment || "Department of Research & Innovation"}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-800">
                    Active Innovation Team
                  </span>
                </div>
              )}

              {/* Verified Community Impact Card (if completed) */}
              {selectedProgressProblem.backendStatus === "RESOLVED" || selectedProgressProblem.status === "Completed & Impact Generated" ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <h4 className="text-sm font-bold text-emerald-900">Verified Civic Impact Delivered</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
                      <span className="text-slate-500 block">Residents / Beneficiaries</span>
                      <strong className="text-sm font-extrabold text-emerald-800">{selectedProgressProblem.citizensBenefited || "4,500+ Citizens"}</strong>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
                      <span className="text-slate-500 block">Resolution Summary</span>
                      <strong className="text-xs font-semibold text-slate-800">{selectedProgressProblem.impactSummary || "Problem resolved on-ground by university engineering team."}</strong>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Step-by-Step Progress Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Lifecycle Milestones</h4>
                <div className="space-y-3">
                  {getMilestones(selectedProgressProblem).map((step, idx) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3.5 rounded-xl border p-3.5 transition ${
                        step.completed
                          ? "border-emerald-100 bg-emerald-50/30 text-slate-800"
                          : step.current
                          ? "border-blue-200 bg-blue-50/40 text-slate-900"
                          : step.failed
                          ? "border-red-200 bg-red-50/40 text-red-900"
                          : "border-slate-100 bg-slate-50/30 text-slate-400"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          step.completed
                            ? "bg-emerald-600 text-white"
                            : step.current
                            ? "bg-blue-600 text-white animate-pulse"
                            : step.failed
                            ? "bg-red-600 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {step.completed ? <FiCheck size={14} /> : step.failed ? <FiX size={14} /> : idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold">{step.title}</p>
                          <span
                            className={`text-[10px] font-bold ${
                              step.completed
                                ? "text-emerald-700"
                                : step.current
                                ? "text-blue-700"
                                : step.failed
                                ? "text-red-700"
                                : "text-slate-400"
                            }`}
                          >
                            {step.completed ? "Completed" : step.current ? "In Progress" : step.failed ? "Rejected" : "Pending"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 p-4 bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedProgressProblem(null)}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-900"
              >
                Close Tracker
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedProblem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs"
          onClick={() => setSelectedProblem(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {rt("reportedDetails")}
                </span>
                <h3 className="text-base font-bold text-slate-800">
                  {getProblemTitle(selectedProblem.title)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProblem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 transition"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">{rt("problemId")}</span>
                <span className="font-bold text-slate-800">{selectedProblem.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{rt("category")}</span>
                <span className="font-bold text-slate-800">{selectedProblem.category || selectedProblem.backendCategory || "General"}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{rt("location")}</span>
                <span className="font-bold text-slate-800">{getDisplayLocation(selectedProblem)}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{rt("submittedDate")}</span>
                <span className="font-bold text-slate-800">{getDisplayDate(selectedProblem)}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {rt("description")}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {selectedProblem.description || rt("noDescription")}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedProblem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                {rt("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemTable;