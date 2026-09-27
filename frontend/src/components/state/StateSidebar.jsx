import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  MapPin,
  AlertTriangle,
  Bell,
  CheckSquare,
  ChevronRight,
  Target,
  GraduationCap,
  Building2,
  BarChart3,
  FileText,
  Settings,
  Shield,
  X,
} from "lucide-react";

const sidebarNavItems = [
  { path: "/state/dashboard", label: "Dashboard", icon: Home },
  { path: "/state/all-districts", label: "All Districts", icon: MapPin },
  { path: "/state/citizen-reports", label: "Citizen Reports", icon: AlertTriangle },
  { path: "/state/early-warnings", label: "Early Warnings", icon: Bell, badge: 5 },
  {
    path: "/state/organization-verification",
    label: "Organization Verification",
    icon: CheckSquare,
    hasSub: true,
  },
  { path: "/state/challenges", label: "Challenges", icon: Target },
  { path: "/state/universities-partners", label: "Universities & Partners", icon: GraduationCap },
  { path: "/state/industry-csr-partners", label: "Industry / CSR Partners", icon: Building2 },
  { path: "/state/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/state/reports", label: "Reports", icon: FileText },
  { path: "/state/settings", label: "Settings", icon: Settings },
];

const StateSidebar = ({ isMobileOpen, onCloseMobile }) => {
  const location = useLocation();

  const navContent = (
    <div className="flex h-full flex-col bg-[#0a2139] text-slate-100 select-none">
      {/* SIDEBAR NAVIGATION ITEMS */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/state/dashboard" && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-[#1b6ec2] text-white shadow-md shadow-blue-900/40"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={17} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"} />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
                {item.hasSub && (
                  <ChevronRight size={14} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"} />
                )}
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* BOTTOM WATERMARK GRAPHIC & EMBLEM */}
      <div className="relative overflow-hidden border-t border-slate-800/80 bg-gradient-to-b from-[#081b30] to-[#051323] p-4 text-center">
        {/* Decorative graphic background lines */}
        <div className="absolute -bottom-6 -left-6 opacity-10 pointer-events-none">
          <Shield size={120} className="text-white" />
        </div>

        <div className="relative z-10">
          <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-amber-300">
            <Shield size={18} />
          </div>
          <p className="text-[11px] font-extrabold tracking-wide text-slate-200">
            Government of Jharkhand
          </p>
          <p className="mt-0.5 text-[8.5px] font-medium tracking-wider text-slate-400 uppercase">
            Transparency | Innovation | Progress
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 hidden w-64 z-30 shadow-xl lg:block">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[85vw] h-full shadow-2xl z-50">
            {navContent}
            <button
              onClick={onCloseMobile}
              className="absolute top-3 right-3 rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </aside>
        </div>
      )}
    </>
  );
};

export default StateSidebar;
