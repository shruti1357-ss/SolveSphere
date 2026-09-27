import { useState } from "react";
import { motion } from "motion/react";
import Sidebar from "../components/citizen-dashboard/Sidebar";
import Topbar from "../components/citizen-dashboard/Topbar";
import OverviewCard from "../components/citizen-dashboard/OverviewCard";
import ProblemTable from "../components/citizen-dashboard/ProblemTable";
import {
  useAuth,
  normalizeChallengeStatusToBackend,
  normalizeBackendChallenge,
} from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import {
  PlusCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import {
  FiClock,
  FiFileText,
  FiShield,
  FiMapPin,
  FiTag,
  FiZap,
} from "react-icons/fi";
import { FaRocket } from "react-icons/fa";

const RoleDashboardPage = ({
  roleTitle = "Institutional Dashboard",
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, userProblems } = useAuth();
  const { data: adminData } = useAdmin();
  const [activeTab, setActiveTab] = useState("challenges");

  // Backend-compatible workflow:
  // OPEN = approved and available in the university Challenge Pool.
  // ASSIGNED_TO_HEI / IN_PROGRESS are already taken by a university.
  const approvedChallenges = [
    ...(Array.isArray(userProblems) ? userProblems : []),
    ...(Array.isArray(adminData?.challenges)
      ? adminData.challenges
      : []),
  ]
    .filter((problem) => {
      const backendStatus =
        problem.backendStatus ||
        normalizeChallengeStatusToBackend(problem.status);

      return backendStatus === "OPEN";
    })
    .map((problem) => {
      // AdminContext can already contain a backend-shaped challenge.
      // normalizeBackendChallenge keeps the existing card UI unchanged.
      if (
        problem?.created_at ||
        problem?.citizen_name ||
        problem?.urgency_score !== undefined ||
        problem?.assigned_university !== undefined
      ) {
        return normalizeBackendChallenge(problem);
      }

      return problem;
    })
    .filter(
      (problem, index, all) =>
        all.findIndex(
          (item) =>
            String(item.id) === String(problem.id)
        ) === index
    );

  const pendingProblems = userProblems.filter((problem) => {
    const backendStatus =
      problem.backendStatus ||
      normalizeChallengeStatusToBackend(problem.status);

    return backendStatus === "UNDER_REVIEW";
  });

  const isUniversity =
    user?.role === "University" ||
    user?.role === "University Student" ||
    user?.role === "Student";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="ml-0 lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="w-full space-y-6 px-4 py-6 sm:px-6 lg:p-8">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:flex-row md:items-center"
          >
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {user?.role || "Institutional"} Academic & Research Portal
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                {user?.role
                  ? `${user.role} Dashboard`
                  : roleTitle}
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Explore government-approved civic challenges and
                collaborate on meaningful solutions.
              </p>
            </div>

            {!isUniversity && (
              <Link
                to="/report"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-600"
              >
                <PlusCircle className="h-4 w-4" />
                Report a Problem
              </Link>
            )}
          </motion.div>

          {/* Overview Stat Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <OverviewCard
              title="Available Challenges"
              value={String(approvedChallenges.length)}
              description="Government-approved challenges"
              icon={<FaRocket className="h-5 w-5" />}
              iconBg="bg-emerald-50 text-emerald-500"
            />

            <OverviewCard
              title="Pending Reports"
              value={String(pendingProblems.length)}
              description="Problems under government review"
              icon={<FiClock className="h-5 w-5" />}
              iconBg="bg-amber-50 text-amber-500"
            />

            <OverviewCard
              title="Total Reports"
              value={String(userProblems.length)}
              description="Problems currently in system"
              icon={<FiFileText className="h-5 w-5" />}
              iconBg="bg-blue-50 text-blue-500"
            />

            <OverviewCard
              title="Verified Status"
              value="Verified"
              description="Official institutional account"
              icon={<FiShield className="h-5 w-5" />}
              iconBg="bg-purple-50 text-purple-500"
            />
          </div>

          {/* UNIVERSITY WORKFLOW */}
          {isUniversity ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setActiveTab("challenges")
                    }
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "challenges"
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Challenge Pool ({approvedChallenges.length})
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab("pending")
                    }
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "pending"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    Pending Reports ({pendingProblems.length})
                  </button>
                </div>

                <span className="hidden text-xs font-medium text-slate-400 sm:inline-block">
                  University Challenge Workspace
                </span>
              </div>

              {/* Challenge Pool */}
              {activeTab === "challenges" && (
                <div className="space-y-4 p-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Government-Approved Challenges
                    </h3>

                    <p className="text-xs text-slate-400">
                      Explore validated civic problems and
                      accept a challenge to start building a
                      solution.
                    </p>
                  </div>

                  {approvedChallenges.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
                      No government-approved challenges are
                      available right now.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {approvedChallenges.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col justify-between space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-emerald-300 hover:shadow-sm"
                        >
                          <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <span className="font-mono text-xs font-bold text-emerald-600">
                                {item.id}
                              </span>

                              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                                Government Approved
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-800">
                              {item.title}
                            </h4>

                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                              {item.description}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <FiMapPin className="h-3 w-3" /> {item.location}
                              </span>

                              <span className="flex items-center gap-1">
                                <FiTag className="h-3 w-3" /> {item.category}
                              </span>

                              <span className="flex items-center gap-1">
                                <FiZap className="h-3 w-3" /> {item.priority || "High"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                            <span className="text-xs font-bold text-emerald-600">
                              Open for University
                            </span>

                            <Link
                              to={`/challenges/${item.id}`}
                              className="flex items-center gap-1 text-xs font-bold text-emerald-600 transition hover:text-emerald-700"
                            >
                              View Challenge
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pending Reports */}
              {activeTab === "pending" && (
                <div className="space-y-4 p-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Reports Under Government Review
                    </h3>

                    <p className="text-xs text-slate-400">
                      Citizen reports are validated by Government
                      before entering the Challenge Pool.
                    </p>
                  </div>

                  {pendingProblems.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
                      No citizen reports are currently waiting
                      for government validation.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {pendingProblems.map((item) => (
                        <div
                          key={item.id}
                          className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-xs font-bold text-slate-500">
                              {item.id}
                            </span>

                            <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                              Under Government Review
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-800">
                            {item.title}
                          </h4>

                          <p className="line-clamp-2 text-xs text-slate-500">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <FiMapPin className="h-3 w-3" /> {item.location}
                            </span>

                            <span className="flex items-center gap-1">
                              <FiZap className="h-3 w-3" /> {item.priority || "High"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Other Institutional Roles */
            <div className="mt-8">
              <ProblemTable />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RoleDashboardPage;