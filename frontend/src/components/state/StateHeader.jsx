import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  Shield,
  Menu,
  CheckCheck,
  Landmark,
  UserRound,
  LogOut,
  Settings,
  FileText,
  Building2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const defaultStateNotifications = [
  {
    id: "sn-1",
    title: "University Verification Required",
    message: "New university institutional credentials submitted and awaiting state accreditation review.",
    timestamp: "10 mins ago",
    read: false,
    link: "/state/organization-verification",
  },
  {
    id: "sn-2",
    title: "Early Warning Alert: Water Quality",
    message: "Elevated turbidity & contamination risk detected in Dhanbad and Khunti water monitoring buoys.",
    timestamp: "1 hour ago",
    read: false,
    link: "/state/early-warnings",
  },
  {
    id: "sn-3",
    title: "Citizen Reports Escalation",
    message: "42 new citizen civic reports submitted across Jharkhand districts today.",
    timestamp: "3 hours ago",
    read: false,
    link: "/state/citizen-reports",
  },
  {
    id: "sn-4",
    title: "Industry CSR Matching",
    message: "Tata Steel Foundation submitted CSR grant allocation for Rural Clean Water project.",
    timestamp: "Yesterday",
    read: true,
    link: "/state/industry-csr-partners",
  },
  {
    id: "sn-5",
    title: "District Resolution Analytics",
    message: "Monthly district-level problem resolution metrics and AI analysis ready for review.",
    timestamp: "2 days ago",
    read: true,
    link: "/state/analytics",
  },
];

const StateHeader = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("solvesphere_state_notifications");
      return saved ? JSON.parse(saved) : defaultStateNotifications;
    } catch {
      return defaultStateNotifications;
    }
  });

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("solvesphere_state_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.warn("Could not save state notifications:", e);
    }
  }, [notifications]);

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem("solvesphere_state_notifications");
        if (saved) setNotifications(JSON.parse(saved));
      } catch (e) {
        console.warn("Could not sync notifications:", e);
      }
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("solvesphere_state_notifications_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("solvesphere_state_notifications_updated", handleSync);
    };
  }, []);

  useEffect(() => {
    const close = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/state/citizen-reports?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const userName = user?.name || user?.organization || "Government Official";
  const userInitials =
    userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "GO";

  return (
    <header className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between border-b border-slate-700/60 bg-[#132a4a] px-4 shadow-sm sm:px-6 lg:px-7 text-white">
      {/* LEFT SECTION: LOGO & STATE EMBLEM */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
        {onMobileMenuClick && (
          <button
            onClick={onMobileMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-[#1d3b63] text-white shadow-sm lg:hidden"
            aria-label="Toggle Menu"
          >
            <Menu size={18} />
          </button>
        )}

        {/* SolveSphere Logo */}
        <Link to="/state/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-[#1d65d6] shadow-sm">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              Solve<span className="text-blue-400">Sphere</span>
            </h1>
            <p className="flex items-center gap-1 text-[10px] font-medium text-slate-300">
              State Portal
            </p>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden lg:block text-slate-600 font-thin text-lg">|</div>

        {/* Government of Jharkhand Header Emblem */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-xs shadow-xs">
            <Shield size={18} className="text-amber-300" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white leading-none tracking-tight">
              Government of Jharkhand
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5 font-medium">
              State Administration & Civic Redressal Portal
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: SEARCH BAR */}
      <div className="flex-1 max-w-[460px] mx-4 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search districts, reports, challenges, universities..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-600/70 bg-[#1d3b63]/80 text-xs text-white placeholder:text-slate-300 outline-none transition focus:bg-[#1d3b63] focus:border-blue-400 shadow-xs"
          />
        </form>
      </div>

      {/* RIGHT SECTION: NOTIFICATION & USER PROFILE */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setShowDropdown(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-100 hover:bg-white/10 hover:text-white transition"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200 z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">State Government Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-200/60">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No state notifications available.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        markNotificationRead(item.id);
                        setNotifOpen(false);
                        if (item.link) navigate(item.link);
                      }}
                      className={`w-full text-left p-3.5 flex gap-3 transition hover:bg-blue-50/60 ${
                        !item.read ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                          !item.read ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center justify-between gap-1">
                          <span className="block text-xs font-bold text-slate-800 line-clamp-1">
                            {item.title}
                          </span>
                          <span className="text-[9px] font-semibold text-blue-600 shrink-0 opacity-0 group-hover:opacity-100">
                            View →
                          </span>
                        </span>
                        <span className="block mt-0.5 text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                          {item.message}
                        </span>
                        <span className="block mt-1 text-[10px] text-slate-400 font-medium">
                          {item.timestamp}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowDropdown((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-xl border border-slate-700/60 bg-[#1d3b63]/60 px-3 py-1.5 text-left transition hover:bg-[#1d3b63] hover:border-slate-600"
            aria-label="State Officer Profile Menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-[#132a4a] shadow-xs">
              {userInitials || <UserRound size={16} />}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-bold text-white truncate max-w-[130px]">{userName}</p>
              <p className="text-[10px] font-medium text-slate-300">
                {user?.accountType || "State Government Official"}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-300 hidden sm:block" />
          </button>

          {/* User Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl text-slate-800 z-50 animate-fade-in">
              <div className="border-b border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#132a4a] font-black text-sm">
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email || "state.official@gov.in"}</p>
                    <span className="mt-1 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 border border-blue-200/60">
                      State Administration Lead
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/state/settings");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Settings size={15} className="text-slate-400" /> Account Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/state/reports");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <FileText size={15} className="text-slate-400" /> State Reports & Dossiers
                </button>
              </div>

              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                    navigate("/", { replace: true });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StateHeader;
