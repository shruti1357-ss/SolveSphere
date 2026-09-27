import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { citizenText, localizeProblemTitle, localizeUserName, localizeProblemStatus, localizeAddress } from "../../i18n/citizenUi";
import LanguageSwitcher from "../i18n/LanguageSwitcher";
import { FiBell, FiMenu, FiX, FiChevronDown, FiCheckCircle, FiUser, FiLogOut } from "react-icons/fi";
import {
  getUniversityNotifications,
  markUniversityNotificationRead,
  markAllUniversityNotificationsRead,
} from "../../utils/universityProfileUtils";

const Topbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, userProblems, logout } = useAuth();
  const { language } = useLanguage();
  const t = (key, values) => citizenText(language, key, values);

  const cleanDisplayName = (() => {
    let raw = user?.name || user?.first_name || user?.full_name || user?.username || "";
    if (user?.email && !raw) {
      raw = user.email.split("@")[0];
    }
    return raw ? raw.replace(/_[a-f0-9]{4,8}$/i, "").trim() : "Citizen";
  })();

  const localizedDisplayName = (() => {
    if (!cleanDisplayName || cleanDisplayName.toLowerCase() === "citizen" || cleanDisplayName.toLowerCase() === "user") {
      return t("module.citizen");
    }
    return localizeUserName(cleanDisplayName, language);
  })();

  const initial = (cleanDisplayName || "U").charAt(0)?.toUpperCase() || "U";
  const isUniversity =
    user?.role === "University" ||
    user?.role === "University Student" ||
    user?.role === "Student" ||
    ["STUDENT", "FACULTY", "HEI_ADMIN"].includes(String(user?.backendRole || "").toUpperCase());

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = () => {
      try {
        if (isUniversity) {
          const list = getUniversityNotifications(user);
          setNotifications(list);
        } else {
          const citizenKey = String(user?.email || "citizen").toLowerCase();
          const STORAGE_KEY = `solvesphere_notifications_${citizenKey}`;
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setNotifications(parsed);
              return;
            }
          }

          const problemsList = Array.isArray(userProblems) ? userProblems : [];
          if (problemsList.length > 0) {
            const citizenNotifs = problemsList.slice(0, 5).map((p, idx) => {
              const locTitle = localizeProblemTitle(language, p.title) || p.title || "Report";
              const statusName = localizeProblemStatus(p.status || p.backendStatus || "Under AI Analysis", language);
              const rawLoc = p.location || p.address || p.district || "Jharkhand";
              const loc = localizeAddress(rawLoc, language);
              return {
                id: `p-${p.id || idx}`,
                title: `${t("citizen.report")}: ${locTitle}`,
                message: `${t("status")}: ${statusName} - ${loc}.`,
                time: p.date || t("citizen.recently"),
                read: idx > 1,
                link: "/citizen-dashboard/problems",
              };
            });
            setNotifications(citizenNotifs);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(citizenNotifs)); } catch {}
          } else {
            const defaultCit = [
              {
                id: "cit-notif-1",
                title: t("citizen.notifStatusUnderReview"),
                message: t("citizen.notifWaterloggingDesc"),
                time: t("citizen.oneHourAgo"),
                read: false,
                link: "/citizen-dashboard/problems",
              },
              {
                id: "cit-notif-2",
                title: t("citizen.notifAiAnalysisComplete"),
                message: t("citizen.notifAiAnalysisDesc"),
                time: t("citizen.threeHoursAgo"),
                read: false,
                link: "/citizen-dashboard/problems",
              },
              {
                id: "cit-notif-3",
                title: t("citizen.notifUpvoteMilestone"),
                message: t("citizen.notifUpvoteDesc"),
                time: t("citizen.yesterday"),
                read: true,
                link: "/citizen-dashboard/problems",
              },
              {
                id: "cit-notif-4",
                title: t("citizen.notifSubmitNewIssue"),
                message: t("citizen.notifSubmitNewIssueDesc"),
                time: t("citizen.twoDaysAgo"),
                read: true,
                link: "/report",
              },
            ];
            setNotifications(defaultCit);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCit)); } catch {}
          }
        }
      } catch {
        setNotifications([]);
      }
    };

    loadNotifications();

    const handleUpdate = () => loadNotifications();
    window.addEventListener("solvesphere_notifications_updated", handleUpdate);
    window.addEventListener("solvesphere_university_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("solvesphere_notifications_updated", handleUpdate);
      window.removeEventListener("solvesphere_university_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [isUniversity, userProblems, language, user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id) => {
    if (isUniversity) {
      const updated = markUniversityNotificationRead(id, user);
      setNotifications(updated);
    } else {
      const citizenKey = String(user?.email || "citizen").toLowerCase();
      const STORAGE_KEY = `solvesphere_notifications_${citizenKey}`;
      const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      setNotifications(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
      } catch {}
    }
  };

  const markAllNotificationsRead = () => {
    if (isUniversity) {
      const updated = markAllUniversityNotificationsRead(user);
      setNotifications(updated);
    } else {
      const citizenKey = String(user?.email || "citizen").toLowerCase();
      const STORAGE_KEY = `solvesphere_notifications_${citizenKey}`;
      const updated = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
      } catch {}
    }
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-slate-700/60 bg-[#132a4a] px-4 py-2 shadow-sm sm:px-6 lg:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 lg:hidden"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </motion.button>

        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-slate-100 sm:text-lg">{isUniversity ? "University Dashboard" : `${t("citizen.dashboard")}`}</h2>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-4">
        {!isUniversity && <LanguageSwitcher variant="navbar" />}

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfileMenu(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-100 transition hover:bg-white/10 hover:text-white"
            aria-label={t("common.notifications")}
          >
            <FiBell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Invisible click-away backdrop without blurring the navbar */}
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setShowNotifications(false)}
              />

              {/* Anchored dropdown menu directly beneath the bell icon */}
              <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800">
                      {isUniversity ? "University Notifications" : t("common.notifications")}
                    </h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-200/60">
                        {unreadCount} {t("citizen.newNotif")}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      <FiCheckCircle size={13} /> {t("citizen.markAllRead")}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {isUniversity ? "No notifications" : t("citizen.noNotifications")}
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => {
                          markNotificationRead(notification.id);
                          setShowNotifications(false);
                          if (notification.link) navigate(notification.link);
                        }}
                        className={`group flex cursor-pointer gap-3 px-4 py-3 transition hover:bg-blue-50/60 active:scale-[0.99] ${
                          !notification.read ? "bg-blue-50/40" : ""
                        }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            markNotificationRead(notification.id);
                            setShowNotifications(false);
                            if (notification.link) navigate(notification.link);
                          }
                        }}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                            !notification.read ? "bg-blue-600" : "bg-slate-300"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {notification.title}
                            </p>
                            <span className="text-[9px] font-semibold text-blue-600 shrink-0 opacity-0 group-hover:opacity-100 transition">
                              {t("citizen.viewArrow")}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-[10px] font-medium text-slate-400">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center">
                  <Link
                    to={isUniversity ? "/university-dashboard/notifications" : "/citizen-dashboard/problems"}
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    {isUniversity
                      ? "View All in Notification Center →"
                      : t("citizen.viewAllReports")}
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Top-Right Profile Pill & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 border-l border-slate-700 pl-3 sm:gap-3 sm:pl-4 text-left transition rounded-lg py-1 px-1.5 hover:bg-white/10 focus:outline-none"
            aria-expanded={showProfileMenu}
            aria-label="User profile menu"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/40 bg-slate-50 text-sm font-bold text-slate-700 shrink-0">
              {initial}
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-28 truncate text-xs font-bold text-slate-100">{localizedDisplayName}</p>
              <p className="text-[10px] text-slate-200">{isUniversity ? (user?.role || "University") : t("module.citizen")}</p>
            </div>
            <FiChevronDown className={`h-4 w-4 text-slate-300 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`} />
          </button>

          {showProfileMenu && (
            <>
              {/* Click-away backdrop */}
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setShowProfileMenu(false)}
              />

              <div className="absolute right-0 top-full mt-2 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-fade-in py-1">
                <div className="border-b border-slate-100 px-4 py-3 bg-slate-50">
                  <p className="text-xs font-bold text-slate-800 truncate">{localizedDisplayName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email || (isUniversity ? "University Portal" : t("module.citizen"))}</p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate(isUniversity ? "/university-dashboard/profile" : "/citizen-dashboard/profile");
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition text-left"
                  >
                    <FiUser className="h-4 w-4 text-slate-400" />
                    {t("common.profile")}
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition text-left"
                  >
                    <FiLogOut className="h-4 w-4 text-red-500" />
                    {t("common.logout")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
