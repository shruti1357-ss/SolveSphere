import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle2,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Radio,
  Settings,
  ShieldCheck,
  UsersRound,
  X,
  BellRing,
  Landmark,
  Factory,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";
import ConfirmationModal from "./common/ConfirmationModal";

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stats, logoutGovtAdmin } = useAdmin();
  const { logout } = useAuth();
  const [challengesOpen, setChallengesOpen] = useState(location.pathname.startsWith("/challenges"));
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logoutGovtAdmin();
    logout();
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  const navLinkClasses = ({ isActive }) =>
    `group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive ? "bg-[#1769c2] text-white shadow-md" : "text-slate-200 hover:bg-white/10 hover:text-white"}`;

  const content = (
    <div className="flex h-full flex-col bg-[#102f50] text-white">
      <div className="px-5 pt-5 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
          <ShieldCheck className="w-4 h-4" /> Government Portal
        </div>
      </div>

      <div className="gov-sidebar-scroll flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div>
          <div className="px-3 mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-blue-200/70">Overview</div>
          <NavLink to="/dashboard" onClick={onCloseMobile} className={navLinkClasses}>
            <span className="flex items-center gap-2.5"><LayoutDashboard className="w-4 h-4" /> Dashboard</span>
          </NavLink>
        </div>

        <div>
          <div className="px-3 mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-blue-200/70">Problem Management</div>
          <NavLink to="/challenges/all" onClick={onCloseMobile} className={navLinkClasses}>
            <span className="flex items-center gap-2.5"><FileText className="w-4 h-4" /> Problem Reports</span>
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px]">{stats.totalChallenges}</span>
          </NavLink>
          <NavLink to="/challenges/pending" onClick={onCloseMobile} className={navLinkClasses}>
            <span className="flex items-center gap-2.5"><Clock3 className="w-4 h-4" /> AI / Government Review</span>
            {stats.pendingScrutiny > 0 && <span className="rounded-full bg-rose-400 px-1.5 py-0.5 text-[9px] font-bold text-white">{stats.pendingScrutiny}</span>}
          </NavLink>
          <NavLink to="/approved-challenges" onClick={onCloseMobile} className={navLinkClasses}>
            <span className="flex items-center gap-2.5"><BadgeCheck className="w-4 h-4" /> Approved Challenges</span>
          </NavLink>
          <NavLink to="/government/assigned-challenges" onClick={onCloseMobile} className={navLinkClasses}>
            <span className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4" /> Assigned Challenges</span>
          </NavLink>
        </div>

        <div>
          <div className="px-3 mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-blue-200/70">Challenges & Solutions</div>
          <button onClick={() => setChallengesOpen((value) => !value)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${location.pathname.startsWith("/challenges") ? "bg-white/10 text-white" : "text-slate-200 hover:bg-white/10"}`}>
            <span className="flex items-center gap-2.5"><Activity className="w-4 h-4" /> Challenges</span>
            {challengesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {challengesOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
              <NavLink to="/challenges/all" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> All Challenges</span></NavLink>
              <NavLink to="/challenges/active" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Active Challenges</span></NavLink>
              <NavLink to="/challenges/completed" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span></NavLink>
            </div>
          )}
          <NavLink to="/solutions" onClick={onCloseMobile} className={navLinkClasses}>
            <span className="flex items-center gap-2.5"><FileText className="w-4 h-4" /> Solutions</span>
          </NavLink>
          <NavLink to="/proposals" onClick={onCloseMobile} className={navLinkClasses}>
            <span className="flex items-center gap-2.5"><UsersRound className="w-4 h-4" /> University Proposals</span>
          </NavLink>
        </div>

        <div>
          <div className="px-3 mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-blue-200/70">Collaboration</div>
          <NavLink to="/partners" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2.5"><Building2 className="w-4 h-4" /> Universities & Industry</span></NavLink>
          <NavLink to="/tracking" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2.5"><Radio className="w-4 h-4" /> Solution Tracking</span></NavLink>
        </div>

        <div>
          <div className="px-3 mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-blue-200/70">District Operations</div>
          <NavLink to="/government/active-reports" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2.5"><FileText className="w-4 h-4" /> Active Reports</span><span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold">12</span></NavLink>
          <NavLink to="/government/early-warnings" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2.5"><BellRing className="w-4 h-4" /> Early Warnings</span><span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold">5</span></NavLink>
          <NavLink to="/government/universities-partners" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2.5"><Landmark className="w-4 h-4" /> Universities & Partners</span></NavLink>
          <NavLink to="/government/industries-csr" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2.5"><Factory className="w-4 h-4" /> Industries / CSR Partners</span></NavLink>
          <NavLink to="/government/departments" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2.5"><Building2 className="w-4 h-4" /> Departments</span></NavLink>
        </div>

        <div>
          <div className="px-3 mb-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-blue-200/70">Insights</div>
          <NavLink to="/reports" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2.5"><BarChart3 className="w-4 h-4" /> Analytics & Reports</span></NavLink>
        </div>
      </div>

      <div className="border-t border-white/10 p-3 space-y-1">
        <NavLink to="/settings" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2.5"><Settings className="w-4 h-4" /> Settings</span></NavLink>
        <NavLink to="/help" onClick={onCloseMobile} className={navLinkClasses}><span className="flex items-center gap-2.5"><HelpCircle className="w-4 h-4" /> Help & Support</span></NavLink>
        <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-200 hover:bg-red-500/10 hover:text-red-100"><LogOut className="w-4 h-4" /> Logout</button>
      </div>

      <ConfirmationModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} title="Confirm Logout" message="Are you sure you want to end your active Government Admin session?" confirmLabel="Logout Now" confirmVariant="danger" />
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-64 shrink-0 h-[calc(100vh-72px)] sticky top-[72px] z-30 overflow-hidden">{content}</aside>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onCloseMobile} />
          <aside className="relative w-72 max-w-[85vw] h-full shadow-2xl z-50">{content}<button onClick={onCloseMobile} className="absolute top-4 right-3 rounded-lg bg-white/10 p-1.5 text-white"><X className="w-5 h-5" /></button></aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
