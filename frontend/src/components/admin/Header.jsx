import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, CheckCheck, Menu, Search, User, Settings2, LogOut, Landmark, Shield } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";

const Header = ({ onOpenMobile, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const { data, markNotificationRead, markAllNotificationsRead, logoutGovtAdmin } = useAdmin();
  const { logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = data.notifications.filter((item) => !item.read).length;

  useEffect(() => {
    const close = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    logoutGovtAdmin();
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between border-b border-slate-700/60 bg-[#132a4a] px-4 shadow-sm sm:px-6 lg:px-8 text-white">
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
        <button
          onClick={onOpenMobile}
          className="md:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-[#1d3b63] text-white shadow-sm hover:bg-[#254b7d]"
          aria-label="Open government menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Top Left SolveSphere Brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-[#1d65d6] shadow-sm">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              Solve<span className="text-blue-400">Sphere</span>
            </h1>
            <p className="flex items-center gap-1 text-[10px] font-medium text-slate-300">
              District Portal
            </p>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden lg:block text-slate-600 font-thin text-lg">|</div>

        {/* Government of Jharkhand Header Emblem */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-xs shadow-xs">
            <Shield size={18} className="text-amber-300" />
          </div>
          <div>
            <div className="text-xs md:text-sm font-extrabold text-white leading-tight tracking-tight">
              Government of Jharkhand
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              District Administration &amp; Civic Governance
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[460px] mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            value={searchQuery || ""}
            onChange={(event) => setSearchQuery?.(event.target.value)}
            placeholder="Search reports, locations, or IDs..."
            className="w-full rounded-xl border border-white/20 bg-white/10 px-10 py-2 text-xs text-white placeholder:text-slate-300 outline-none transition focus:bg-white focus:text-slate-800 focus:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-300/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((value) => !value)}
            className="relative rounded-xl p-2.5 text-white hover:bg-white/10 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#132a4a]" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {data.notifications.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      markNotificationRead(item.id);
                      setNotifOpen(false);
                      if (item.link) {
                        navigate(item.link);
                      } else if (item.type === "challenge" || item.title?.toLowerCase().includes("challenge")) {
                        navigate("/challenges/pending");
                      } else if (item.type === "solution" || item.type === "proposal" || item.title?.toLowerCase().includes("proposal")) {
                        navigate("/proposals");
                      } else if (item.type === "partner" || item.title?.toLowerCase().includes("partner") || item.title?.toLowerCase().includes("registration")) {
                        navigate("/partners");
                      } else if (item.type === "project" || item.title?.toLowerCase().includes("project") || item.title?.toLowerCase().includes("milestone")) {
                        navigate("/tracking");
                      } else {
                        navigate("/challenges/all");
                      }
                    }}
                    className={`w-full text-left p-3.5 flex gap-3 transition hover:bg-blue-50/60 ${
                      !item.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                        !item.read ? "bg-blue-500" : "bg-slate-300"
                      }`}
                    />
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center justify-between gap-1">
                        <span className="block text-xs font-bold text-slate-800 line-clamp-1">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-semibold text-blue-600 shrink-0">View →</span>
                      </span>
                      <span className="block mt-0.5 text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {item.message}
                      </span>
                      <span className="block mt-1 text-[10px] text-slate-400 font-medium">
                        {item.timestamp}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative border-l border-slate-700/60 pl-3" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((value) => !value)}
            className="flex items-center gap-2 rounded-xl p-1 text-left hover:bg-white/10 transition"
          >
            <div className="h-9 w-9 rounded-full bg-[#1d3b63] border border-blue-400/30 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-bold text-white">Government Admin</span>
              <span className="block text-[10px] text-slate-300">District Administration</span>
            </div>
            <ChevronDown className="hidden lg:block w-4 h-4 text-slate-300" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white py-2 text-slate-700 shadow-2xl border border-slate-200 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Government Administrator</p>
                <p className="text-[10px] text-slate-400 mt-0.5">admin.portal@gov.in</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 text-slate-700"
              >
                <User className="w-4 h-4 text-slate-400" /> Admin Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 text-slate-700"
              >
                <Settings2 className="w-4 h-4 text-slate-400" /> Portal Preferences
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
