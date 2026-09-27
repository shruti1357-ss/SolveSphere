import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  FiArrowRight,
  FiBell,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiMapPin,
  FiPlus,
  FiShield,
  FiXCircle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import topbarImage from "../assets/topbar-image-citizen.webp";

import Sidebar from "../components/citizen-dashboard/Sidebar";
import Topbar from "../components/citizen-dashboard/Topbar";
import OverviewCard from "../components/citizen-dashboard/OverviewCard";
import ProblemTable from "../components/citizen-dashboard/ProblemTable";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { citizenText, localizeProblemTitle, localizeUserName, localizeProblemStatus } from "../i18n/citizenUi";

const CitizenDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, userProblems } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = (key, values) => citizenText(language, key, values);

  const cleanDisplayName = useMemo(() => {
    const raw =
      user?.name ||
      user?.full_name ||
      user?.profile?.full_name ||
      user?.first_name ||
      user?.username ||
      "";
    if (!raw) return t("module.citizen");
    const cleaned = String(raw).replace(/_[a-f0-9]{4,8}$/i, "").trim();
    if (!cleaned || cleaned.toLowerCase() === "citizen" || cleaned.toLowerCase() === "user") {
      return t("module.citizen");
    }
    return localizeUserName(cleaned, language);
  }, [user, language]);

  const problems = Array.isArray(userProblems) ? userProblems : [];

  const getBackendStatus = (problem) =>
    String(problem?.backendStatus || problem?.status || "").toUpperCase();

  const stats = useMemo(() => {
    return {
      total: problems.length,
      underReview: problems.filter(
        (problem) =>
          ["UNDER_REVIEW", "PENDING_REVIEW", "UNDER AI ANALYSIS"].includes(
            getBackendStatus(problem)
          ) || problem?.status === "Pending Review" || problem?.status === "Under AI Analysis"
      ).length,
      validated: problems.filter((problem) =>
        ["OPEN", "ASSIGNED_TO_HEI", "IN_PROGRESS", "RESOLVED"].includes(
          getBackendStatus(problem)
        )
      ).length,
      resolved: problems.filter(
        (problem) =>
          getBackendStatus(problem) === "RESOLVED" || problem?.status === "Completed"
      ).length,
    };
  }, [problems]);

  const recentNotifications = useMemo(() => {
    if (!problems.length) {
      return [
        {
          id: "welcome",
          icon: <FiFileText className="h-4 w-4" />,
          tone: "bg-blue-50 text-blue-600",
          title: t("citizen.welcomeDashboard"),
          text: t("citizen.welcomeDashboardDesc"),
          time: t("citizen.getStarted"),
          link: "/report",
        },
      ];
    }

    return problems.slice(0, 4).map((problem, index) => {
      const status = String(problem?.status || problem?.backendStatus || "").toLowerCase();
      const resolved = status.includes("complete") || status.includes("resolved");
      const review = status.includes("review") || status.includes("analysis");

      return {
        id: problem?.id || problem?.problem_id || index,
        icon: resolved ? (
          <FiCheckCircle className="h-4 w-4" />
        ) : review ? (
          <FiClock className="h-4 w-4" />
        ) : (
          <FiBell className="h-4 w-4" />
        ),
        tone: resolved
          ? "bg-emerald-50 text-emerald-600"
          : review
            ? "bg-amber-50 text-amber-600"
            : "bg-blue-50 text-blue-600",
        title: localizeProblemTitle(language, problem?.title) || t("citizen.reportUpdated"),
        text: localizeProblemStatus(problem?.status || problem?.backendStatus, language),
        time: index === 0 ? t("citizen.recently") : t("citizen.earlier"),
        link: "/citizen-dashboard/problems",
      };
    });
  }, [problems, language]);

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="ml-0 lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="w-full px-4 py-5 sm:px-6 lg:px-7 xl:px-8">
          {/* Welcome banner */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-sky-100 via-blue-50/70 to-transparent" />
            <div className="absolute -right-8 -top-16 h-48 w-48 rounded-full border-[18px] border-sky-100/70" />
            <div className="absolute right-16 bottom-[-70px] h-44 w-44 rounded-full border-[22px] border-emerald-100/60" />

            <div            
            className="relative flex min-h-[142px] items-center px-5 py-2 sm:px-7 "
  style={{
    backgroundImage: `
      linear-gradient(
        to right,
        #ffffff 0%,
        rgba(255,255,255,0.9) 20%,
        rgba(255,255,255,0.6) 40%,
        rgba(255,255,255,0.3) 60%,
        rgba(255,255,255,0.1) 80%,
        rgba(255,255,255,0) 100%
      ),
      url(${topbarImage})
    `,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  }}
            >
              <div className="max-w-2xl">
                <div className="mb-2 flex items-center gap-2 text-amber-500">
                  <span className="text-3xl">👋</span>
                  {/* <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Citizen Portal
                  </span> */}
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                  {t("citizen.hello", { name: cleanDisplayName })}
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  {t("citizen.welcomeText")}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Overview cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
            className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <motion.div variants={cardVariants}>
              <OverviewCard
                title={t("citizen.totalReports")}
                value={String(stats.total)}
                description={t("citizen.totalReportsDesc")}
                icon={<FiFileText className="h-5 w-5" />}
                iconBg="bg-blue-50 text-blue-600"
              />
            </motion.div>

            <motion.div variants={cardVariants}>
              <OverviewCard
                title={t("citizen.underReview")}
                value={String(stats.underReview)}
                description={t("citizen.underReviewDesc")}
                icon={<FiCheckCircle className="h-5 w-5" />}
                iconBg="bg-emerald-50 text-emerald-600"
              />
            </motion.div>

            <motion.div variants={cardVariants}>
              <OverviewCard
                title={t("citizen.inProgress")}
                value={String(Math.max(stats.validated - stats.resolved, 0))}
                description={t("citizen.inProgressDesc")}
                icon={<FiClock className="h-5 w-5" />}
                iconBg="bg-violet-50 text-violet-600"
              />
            </motion.div>

            <motion.div variants={cardVariants}>
              <OverviewCard
                title={t("citizen.completed")}
                value={String(stats.resolved)}
                description={t("citizen.completedDesc")}
                icon={<FiCheckCircle className="h-5 w-5" />}
                iconBg="bg-cyan-50 text-cyan-600"
              />
            </motion.div>
          </motion.div>

          {/* Main content */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
            <div className="space-y-5">
              {/* Report new problem */}
              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.18 }}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className=" bg-blue-600 text-white flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <FiPlus className="h-5 w-5" />
                      </span>
                      <h2 className="text-lg font-bold text-slate-800">
                        {t("citizen.newProblem")}
                      </h2>
                    </div>
                    <p className="mt-1.5 pl-11 text-xs text-slate-400 sm:text-sm">
                      {t("citizen.newProblemDesc")}
                    </p>
                  </div>

                  <Link
                    to="/report"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-2zl font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <FiPlus className="h-6 w-6" />
                    {t("citizen.reportProblem")}
                  </Link>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 md:grid-cols-4">
                  <ReportStep icon={<FiMapPin />} title={t("citizen.addLocation")} text={t("citizen.addLocationDesc")} />
                  <ReportStep icon={<FiFileText />} title={t("citizen.describeIssue")} text={t("citizen.describeIssueDesc")} />
                  <ReportStep icon={<FiShield />} title={t("citizen.selectCategory")} text={t("citizen.selectCategoryDesc")} />
                  <ReportStep icon={<FiArrowRight />} title={t("citizen.submit")} text={t("citizen.submitDesc")} />
                </div>
              </motion.section>

              {/* Existing reports */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 }}
              >
                <ProblemTable localized />
              </motion.div>
            </div>

            {/* Right rail */}
            <div className="space-y-5">
              <motion.section
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 }}
                className="rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <FiBell className="h-4 w-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-800">{t("citizen.recentNotifications")}</h2>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600">{t("citizen.recent")}</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {recentNotifications.map((notification, index) => (
                    <div
                      key={`${notification.title}-${index}`}
                      onClick={() => navigate(notification.link || "/citizen-dashboard/reports")}
                      className="group flex cursor-pointer items-start gap-3 px-5 py-4 transition-colors hover:bg-slate-50/80 active:bg-slate-100"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigate(notification.link || "/citizen-dashboard/reports");
                        }
                      }}
                    >
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${notification.tone}`}>
                        {notification.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-700 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {notification.title}
                          </p>
                          <FiArrowRight className="h-3.5 w-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-blue-600 transition-all shrink-0" />
                        </div>
                        <p className="mt-1 text-[11px] leading-4 text-slate-400 line-clamp-2">{notification.text}</p>
                        <p className="mt-1.5 text-[10px] text-slate-400">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.32 }}
                className="overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                  <FiCheckCircle className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-base font-bold text-slate-800">{t("citizen.smallActions")}</h2>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {t("citizen.smallActionsDesc")}
                </p>

                <Link
                  to="/citizen-dashboard/profile"
                  className="mt-4 flex items-center justify-between rounded-lg border border-emerald-100 bg-white/80 px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-white"
                >
                  <span>{t("citizen.checkProfile")}</span>
                  <FiArrowRight className="h-4 w-4 text-emerald-600" />
                </Link>
              </motion.section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const ReportStep = ({ icon, title, text }) => (
  <div className="relative text-center md:px-3 md:not-last:border-r md:not-last:border-slate-100">
    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
      <span className="h-5 w-5">{icon}</span>
    </div>
    <h3 className="mt-3 text-xs font-bold text-slate-700">{title}</h3>
    <p className="mx-auto mt-1 max-w-[150px] text-[10px] leading-4 text-slate-400">{text}</p>
  </div>
);

export default CitizenDashboard;
