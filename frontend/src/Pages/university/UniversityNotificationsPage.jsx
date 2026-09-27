import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, CheckCircle2, MessageSquare, Building2, Clock3, Check } from "lucide-react";
import Sidebar from "../../components/citizen-dashboard/Sidebar";
import Topbar from "../../components/citizen-dashboard/Topbar";
import { useAuth } from "../../context/AuthContext";
import {
  getUniversityNotifications,
  markUniversityNotificationRead,
  markAllUniversityNotificationsRead,
} from "../../utils/universityProfileUtils";

export default function UniversityNotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getUniversityNotifications(user));

  const loadNotifs = () => {
    setNotifications(getUniversityNotifications(user));
  };

  useEffect(() => {
    loadNotifs();
    window.addEventListener("solvesphere_notifications_updated", loadNotifs);
    window.addEventListener("storage", loadNotifs);
    return () => {
      window.removeEventListener("solvesphere_notifications_updated", loadNotifs);
      window.removeEventListener("storage", loadNotifs);
    };
  }, [user]);

  const handleMarkAll = () => {
    const updated = markAllUniversityNotificationsRead(user);
    setNotifications(updated);
  };

  const handleItemClick = (item) => {
    markUniversityNotificationRead(item.id, user);
    if (item.link) {
      navigate(item.link);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="lg:ml-64">
        <Topbar isSidebarOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="p-5 lg:p-7 max-w-5xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Updates & Alerts</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Notifications</h1>
              <p className="mt-1 text-sm text-slate-500">
                Stay updated on government assignments, collaborations, and project milestones.
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-600 shadow-xs hover:bg-blue-50 transition active:scale-95"
              >
                <Check size={14} /> Mark all as read
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-sm">
                Recent Notifications {unreadCount > 0 && <span className="ml-2 rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-bold">{unreadCount} New</span>}
              </h2>
            </div>

            {notifications.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-400">No notifications found.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`flex gap-4 p-5 transition cursor-pointer hover:bg-slate-50/80 ${
                      !item.read ? "bg-blue-50/30 font-medium" : ""
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        !item.read ? "bg-blue-100 text-blue-600 shadow-xs" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Building2 size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                        <h3 className={`text-sm ${!item.read ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                          {item.title}
                        </h3>
                        <span className="text-[10px] font-semibold text-slate-400">{item.time}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{item.message}</p>
                    </div>
                    {!item.read && <span className="h-2.5 w-2.5 rounded-full bg-blue-600 self-center shrink-0" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
