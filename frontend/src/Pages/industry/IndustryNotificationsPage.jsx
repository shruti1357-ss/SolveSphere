import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  CheckCheck,
  Trash2,
  ExternalLink,
  Filter,
  Check,
  Clock,
  ShieldCheck,
  Building2,
  FolderSync,
} from "lucide-react";
import IndustryModuleLayout from "../../components/industry/IndustryModuleLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getIndustryNotifications,
  markIndustryNotificationAsRead,
  markAllIndustryNotificationsAsRead,
  deleteIndustryNotification,
} from "../../utils/industryNotificationUtils";

export default function IndustryNotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const [activeFilter, setActiveFilter] = useState("ALL"); // "ALL" | "UNREAD" | "match" | "collaboration" | "government"

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

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Handle single notification click / mark read
  const handleNotificationClick = (item) => {
    if (!item.read) {
      markIndustryNotificationAsRead(item.id, user);
      setVersion((v) => v + 1);
    }
    if (item.link) {
      navigate(item.link);
    }
  };

  // Handle Mark All As Read
  const handleMarkAllRead = () => {
    markAllIndustryNotificationsAsRead(user);
    setVersion((v) => v + 1);
  };

  // Handle Delete Notification
  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteIndustryNotification(id, user);
    setVersion((v) => v + 1);
  };

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "UNREAD") return notifications.filter((n) => !n.read);
    if (activeFilter === "ALL") return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  // Get icon by notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "match":
        return <Sparkles size={18} className="text-blue-600" />;
      case "collaboration":
        return <CheckCircle2 size={18} className="text-emerald-600" />;
      case "government":
        return <MessageSquare size={18} className="text-amber-600" />;
      case "milestone":
        return <ShieldCheck size={18} className="text-purple-600" />;
      default:
        return <Bell size={18} className="text-blue-600" />;
    }
  };

  // Get icon container background
  const getIconBg = (type) => {
    switch (type) {
      case "match":
        return "bg-blue-50 border-blue-100";
      case "collaboration":
        return "bg-emerald-50 border-emerald-100";
      case "government":
        return "bg-amber-50 border-amber-100";
      case "milestone":
        return "bg-purple-50 border-purple-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <IndustryModuleLayout
      title="Notifications"
      subtitle="Stay updated on projects, university matches, collaboration requests and government messages."
      icon={Bell}
    >
      <div className="space-y-6 max-w-5xl">
        {/* Top Summary Banner */}
        <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-linear-to-r from-[#0d3971] to-[#1a4a82] p-5 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 backdrop-blur-xs border border-blue-400/20">
              <span className={`h-2 w-2 rounded-full ${unreadCount > 0 ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
              {unreadCount > 0 ? `${unreadCount} Unread Notifications` : "All Caught Up"}
            </div>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Industry Notification Center
            </h2>
            <p className="mt-0.5 text-xs text-blue-200">
              Real-time updates regarding student innovations, HEI partnerships, and civic deployment alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 ? (
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-xs font-bold text-white shadow-xs backdrop-blur-md hover:bg-white/20 transition active:scale-95"
              >
                <CheckCheck size={15} /> Mark All as Read
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-2 text-xs font-bold text-emerald-200">
                <Check size={14} /> Zero Pending Alerts
              </span>
            )}
          </div>
        </div>

        {/* Main Notification Card Container */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Header & Filter Tabs */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50">
            <div>
              <h2 className="font-extrabold text-[#0d3971] text-base">Notification Feed</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {unreadCount} unread out of {notifications.length} total updates
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-200/60 p-1 text-xs font-semibold text-slate-600">
              <button
                onClick={() => setActiveFilter("ALL")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeFilter === "ALL"
                    ? "bg-white text-[#0d3971] shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveFilter("UNREAD")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeFilter === "UNREAD"
                    ? "bg-white text-[#0d3971] shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setActiveFilter("match")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeFilter === "match"
                    ? "bg-white text-[#0d3971] shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Matches
              </button>
              <button
                onClick={() => setActiveFilter("collaboration")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeFilter === "collaboration"
                    ? "bg-white text-[#0d3971] shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Collaborations
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 mb-3">
                  <Bell size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700">No notifications found</p>
                <p className="mt-1 text-xs text-slate-400">
                  {activeFilter === "UNREAD"
                    ? "You have reviewed all current updates."
                    : "New alerts regarding projects and collaborations will appear here."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isUnread = !item.read;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`group relative flex cursor-pointer items-start gap-4 p-5 transition-colors duration-150 ${
                      isUnread
                        ? "bg-blue-50/40 hover:bg-blue-50/70"
                        : "bg-white hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Left Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-2xs ${getIconBg(
                        item.type
                      )}`}
                    >
                      {getNotificationIcon(item.type)}
                    </div>

                    {/* Notification Body */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm ${
                              isUnread ? "font-extrabold text-[#0d3971]" : "font-bold text-slate-800"
                            }`}
                          >
                            {item.title}
                          </h3>
                          {item.priority === "High" && (
                            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200">
                              Priority
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                            <Clock size={12} /> {item.timestamp}
                          </span>
                        </div>
                      </div>

                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.message}</p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px]">
                        {item.category && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-600">
                            {item.category}
                          </span>
                        )}
                        {item.link && (
                          <span className="inline-flex items-center gap-1 font-bold text-blue-600 group-hover:underline">
                            Open Details <ExternalLink size={11} />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Unread Indicator & Delete Button */}
                    <div className="flex shrink-0 items-center gap-2.5 pl-2">
                      {isUnread ? (
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"
                            title="Unread notification - Click to mark as read"
                          />
                          <span className="text-[9px] font-bold text-emerald-600 uppercase">New</span>
                        </div>
                      ) : (
                        <Check size={14} className="text-slate-300" title="Read" />
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, item.id)}
                        className="rounded-lg p-1.5 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition"
                        title="Dismiss notification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </IndustryModuleLayout>
  );
}
