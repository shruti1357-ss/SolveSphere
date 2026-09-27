import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Search,
  UserRound,
  X,
  ChevronDown,
  CheckCheck,
  Building2,
  Settings,
  LogOut,
  Handshake,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import {
  getIndustryNotifications,
  markIndustryNotificationAsRead as markAsReadHelper,
  markAllIndustryNotificationsAsRead as markAllHelper,
} from "../../utils/industryNotificationUtils";

const IndustryTopbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [version, setVersion] = useState(0);

  // Sync listener with localStorage and custom portal events
  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_notifications_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_notifications_updated", handleUpdate);
    };
  }, []);

  const notifications = useMemo(() => {
    return getIndustryNotifications(user);
  }, [user, version]);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const companyName =
    user?.organization || user?.companyName || user?.name || user?.first_name || "Tata Motors";
  const userEmail = user?.email || "tata12@gmail.com";
  const initial = companyName.charAt(0).toUpperCase();

  useEffect(() => {
    const close = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id) => {
    markAsReadHelper(id, user);
    setVersion((v) => v + 1);
  };

  const markAllNotificationsRead = () => {
    markAllHelper(user);
    setVersion((v) => v + 1);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/", { replace: true });
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/industry-dashboard/reports-complaints?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-slate-700/60 bg-[#132a4a] px-4 py-2 shadow-sm sm:px-6 lg:px-7 text-white">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-[#1d3b63] text-white shadow-sm lg:hidden"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </motion.button>

        {/* Search input in dark blue theme */}
        <form onSubmit={handleSearchSubmit} className="relative hidden max-w-[460px] flex-1 md:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
            placeholder="Search challenges, projects, universities..."
            className="h-10 w-full rounded-xl border border-slate-600/70 bg-[#1d3b63]/80 pl-10 pr-4 text-xs text-white placeholder:text-slate-300 outline-none focus:border-blue-400 focus:bg-[#1d3b63] transition shadow-xs"
          />
        </form>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-3 sm:gap-4">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-100 hover:bg-white/10 hover:text-white transition"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200 z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Industry Notifications</span>
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
                    No notifications available.
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

              <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center">
                <Link
                  to="/industry-dashboard/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  View All in Notification Center →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Button */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-xl border border-slate-700/60 bg-[#1d3b63]/60 px-3 py-1.5 text-left transition hover:bg-[#1d3b63] hover:border-slate-600"
            aria-label="User profile menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-[#132a4a] shadow-xs">
              {initial || <UserRound size={16} />}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-bold text-white truncate max-w-[130px]">{companyName}</p>
              <p className="text-[10px] font-medium text-slate-300">Industry Partner</p>
            </div>
            <ChevronDown size={14} className="text-slate-300 hidden sm:block" />
          </button>

          {/* Clickable Profile & Logout Menu */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl text-slate-800 z-50 animate-fade-in"
              >
                <div className="border-b border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#132a4a] font-black text-sm">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{companyName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                        <ShieldCheck size={10} /> Verified CSR Partner
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1 text-xs font-medium">
                  <Link
                    to="/industry-dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    <Building2 size={16} className="text-blue-600" />
                    <span>Company Profile</span>
                  </Link>

                  <Link
                    to="/industry-dashboard/collaborations"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    <Handshake size={16} className="text-blue-600" />
                    <span>My Collaborations</span>
                  </Link>

                  <Link
                    to="/industry-dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    <Settings size={16} className="text-blue-600" />
                    <span>Settings &amp; Preferences</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={16} className="text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default IndustryTopbar;
