import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiGrid,
  FiHome,
  FiFileText,
  FiSearch,
  FiBriefcase,
  FiUsers,
  FiUser,
  FiX,
  FiLogOut,
  FiBookOpen,
  FiBarChart2,
  FiBell,
  FiSettings,
} from "react-icons/fi";
import { FaLightbulb } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { citizenText, localizeUserName } from "../../i18n/citizenUi";


const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const t = (key, values) => citizenText(language, key, values);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

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

  /*
   * Frontend roles + Backend roles
   *
   * Backend:
   * CITIZEN
   * STUDENT
   * FACULTY
   * HEI_ADMIN
   * STATE_GOVT
   * MUNICIPAL_CORP
   * INDUSTRY
   */
  const roleUpper = String(
    user?.backendRole ||
      user?.backend_role ||
      user?.role ||
      ""
  ).toUpperCase();

  const isCitizen =
    roleUpper === "CITIZEN" ||
    user?.role === "Citizen";

  const isUniversity =
    roleUpper === "STUDENT" ||
    roleUpper === "FACULTY" ||
    roleUpper === "HEI_ADMIN" ||
    user?.role === "University" ||
    user?.role === "University Student" ||
    user?.role === "Student";

  const isIndustry =
    roleUpper === "CSR_PARTNER" ||
    roleUpper === "INDUSTRY" ||
    user?.role === "Industry";

  const dashboardPath =
    user?.role === "Citizen" || isCitizen
      ? "/citizen-dashboard"
      : user?.role === "University" || isUniversity
      ? "/university-dashboard"
      : user?.role === "Government"
      ? "/government-dashboard"
      : "/citizen-dashboard";

  const problemsPath = isCitizen
    ? "/citizen-dashboard/problems"
    : "/citizen-dashboard/problems";

  const profilePath = isCitizen
    ? "/citizen-dashboard/profile"
    : isUniversity
    ? "/university-dashboard/profile"
    : "/citizen-dashboard/profile";

  /*
   * Base menu items
   */
  const menuItems = [
    ...(isCitizen
      ? [{
          name: isCitizen ? t("citizen.home") : "Home",
          icon: <FiHome className="h-4 w-4" />,
          path: "/",
        }]
      : []),
    {
      name: isCitizen ? t("citizen.dashboard") : "Dashboard",
      icon: <FiGrid className="h-4 w-4" />,
      path: dashboardPath,
    },
    ...(isCitizen
      ? [{
          name: t("citizen.myProblems"),
          icon: <FiFileText className="h-4 w-4" />,
          path: problemsPath,
        }]
      : []),
    ...(!isUniversity
      ? [{
          name: isCitizen ? t("citizen.reportProblem") : "Report a prolem",
          icon: <FiSearch className="h-4 w-4" />,
          path: "/report",
        }]
      : []),

    ...(isUniversity
      ? [
          {
            name: "Challenges",
            icon: <FiSearch className="h-4 w-4" />,
            path: "/university-dashboard/challenges",
            highlight: true,
          },
          {
            name: "My Projects",
            icon: <FiFileText className="h-4 w-4" />,
            path: "/university-dashboard/my-projects",
            highlight: true,
          },
        ]
      : []),

    /*
     * My Workspace is only for University/Industry.
     * Citizen does not create/join teams, so it is hidden.
     */
    ...(!isCitizen
      ? [
          {
            name: "My Workspace",
            icon: <FiBriefcase className="h-4 w-4" />,
            path: "/workspace",
            highlight: true,
          },
        ]
      : []),

    /*
     * Collaboration Requests for University
     */
    ...(isUniversity
      ? [
          {
            name: "Collaboration Requests",
            icon: <FiUsers className="h-4 w-4" />,
            path: "/university-dashboard/collaboration-requests",
            highlight: true,
          },
        ]
      : []),

    ...(isUniversity
      ? [
          {
            name: "Research & Publications",
            icon: <FiBookOpen className="h-4 w-4" />,
            path: "/university-dashboard/research-publications",
          },
          {
            name: "Reports & Analytics",
            icon: <FiBarChart2 className="h-4 w-4" />,
            path: "/university-dashboard/reports-analytics",
          },
          {
            name: "Notifications",
            icon: <FiBell className="h-4 w-4" />,
            path: "/university-dashboard/notifications",
          },
          {
            name: "Settings",
            icon: <FiSettings className="h-4 w-4" />,
            path: "/university-dashboard/settings",
          },
        ]
      : []),
    {
      name: isCitizen ? t("citizen.profile") : "Profile",
      icon: <FiUser className="h-4 w-4" />,
      path: profilePath,
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-700/60 bg-[#132a4a] text-white shadow-xl transition-transform duration-300 lg:z-40 lg:translate-x-0 lg:shadow-none ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-slate-700/60 px-5 box-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-[#1d65d6] shadow-sm">
              S
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                Solve<span className="text-blue-400">Sphere</span>
              </h1>

              <p className="text-[10px] font-medium text-slate-300">
                {isUniversity
                  ? "University Portal"
                  : isIndustry
                    ? "Industry Portal"
                    : t("citizen.portal")}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.08,
              rotate: 90,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <FiX className="h-5 w-5" />
          </motion.button>
        </div>

        <nav className="flex-1  px-3 py-6">
          {/* <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300">
            Workspace
          </p> */}

          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#1d6be0] text-white shadow-sm"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute left-0 h-7 w-1 rounded-r-full bg-white"
                        />
                      )}

                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-base transition-all duration-200 ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "text-slate-300 group-hover:scale-110"
                        }`}
                      >
                        {item.icon}
                      </span>

                      <span className="flex-1">
                        {item.name}
                      </span>

                      {item.highlight && isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </>
                  )}
                </NavLink>
              </div>
            ))}
          </div>

          {/* <div className="mt-7">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Collaboration
            </p>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                <FaLightbulb className="h-4 w-4" />
              </div>

              <p className="mt-3 text-xs font-bold text-white">
                Have an idea?
              </p>

              <p className="mt-1 text-[10px] leading-4 text-slate-300">
                Join a challenge and collaborate with your community.
              </p>

              <NavLink
                to="/challenges"
                onClick={() => setIsOpen(false)}
                className="mt-3 inline-flex text-[10px] font-bold text-sky-300 transition hover:text-white"
              >
                Explore Challenges →
              </NavLink>
            </div>
          </div> */}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold text-white">
              {cleanDisplayName.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold text-white">
                {cleanDisplayName}
              </p>

              <p className="text-[9px] text-slate-300">
                {isCitizen ? t("module.citizen") : (user?.role || "Community Member")}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
          >
            <motion.span
              whileHover={{ x: 3 }}
              className="flex h-7 w-7 items-center justify-center text-slate-300 group-hover:text-red-300"
            >
              <FiLogOut className="h-4 w-4" />
            </motion.span>

            {t("common.logout")}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;