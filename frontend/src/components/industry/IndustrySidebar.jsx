import { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Building2,
  Sparkles,
  Handshake,
  LogOut,
  X,
  Zap,
  FileText,
  GraduationCap,
  Map,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getIndustryNotifications } from "../../utils/industryNotificationUtils";

const IndustrySidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_notifications_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_notifications_updated", handleUpdate);
    };
  }, []);

  const unreadCount = useMemo(() => {
    const notifs = getIndustryNotifications(user);
    return notifs.filter((n) => !n.read).length;
  }, [user, version]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/industry-dashboard",
    },
    {
      name: "Recommended Projects",
      icon: Sparkles,
      path: "/industry-dashboard/recommended",
    },
    {
      name: "My Collaborations",
      icon: Handshake,
      path: "/industry-dashboard/collaborations",
    },
    {
      name: "Reports & Complaints",
      icon: FileText,
      path: "/industry-dashboard/reports-complaints",
    },
    {
      name: "Universities & Experts",
      icon: GraduationCap,
      path: "/industry-dashboard/universities-experts",
    },
    {
      name: "District Management",
      icon: Map,
      path: "/industry-dashboard/district-management",
    },
    {
      name: "Analytics & Reports",
      icon: BarChart3,
      path: "/industry-dashboard/analytics",
    },
    {
      name: "Notifications",
      icon: Bell,
      path: "/industry-dashboard/notifications",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/industry-dashboard/settings",
    },
    {
      name: "Company Profile",
      icon: Building2,
      path: "/industry-dashboard/profile",
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
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
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header Logo */}
        <div className="flex h-[72px] items-center justify-between border-b border-slate-700/60 px-5 box-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-[#1d65d6] shadow-sm">
              S
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                Solve<span className="text-blue-400">Sphere</span>
              </h1>

              <p className="flex items-center gap-1 text-[10px] font-medium text-slate-300">
                Industry Portal
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.08, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* Navigation items */}
        <nav className="industry-sidebar-nav flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300">
            Industry Hub
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/industry-dashboard"}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white font-semibold shadow-xs"
                          : "text-slate-200 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="industry-sidebar-active"
                            className="absolute left-0 h-6 w-1 rounded-r-full bg-blue-600"
                          />
                        )}

                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-base transition-all duration-200 ${
                            isActive
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-white/10 text-slate-300 group-hover:bg-white/15 group-hover:text-white"
                          }`}
                        >
                          <Icon size={16} />
                        </span>

                        <span className="flex-1 truncate">{item.name}</span>

                        {item.name === "Notifications" && unreadCount > 0 && (
                          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                            {unreadCount}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </div>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="mt-8">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300">
              CSR & Innovation
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-sm shadow-xs">
                <Sparkles size={16} />
              </div>

              <p className="mt-3 text-xs font-bold text-white">
                Partner with HEIs
              </p>

              <p className="mt-1 text-[11px] leading-4 text-slate-300">
                Sponsor prototype builds and guide student innovations to market.
              </p>

              <NavLink
                to="/industry-dashboard/recommended"
                onClick={() => setIsOpen(false)}
                className="mt-3 inline-flex text-[11px] font-bold text-blue-300 hover:text-blue-200 transition"
              >
                Browse Projects →
              </NavLink>
            </div>
          </div>
        </nav>

        {/* User Profile & Logout Footer */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-xs">
              {user?.name?.charAt(0)?.toUpperCase() || "I"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">
                {user?.name || "Industry Partner"}
              </p>

              <p className="truncate text-[10px] text-slate-300">
                {user?.organization || user?.email || "Enterprise Partner"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={16} className="transition-transform group-hover:-translate-x-0.5" />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default IndustrySidebar;
