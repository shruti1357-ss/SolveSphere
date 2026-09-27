// Industry Notifications Unified Registry & State Utilities

export const DEFAULT_INDUSTRY_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "New project match found",
    message: "A university project matches your registered technical expertise.",
    timestamp: "2 hours ago",
    date: "Today, 11:30 AM",
    type: "match",
    read: false,
    link: "/industry-dashboard/recommended",
    priority: "High",
    category: "AI & Smart Tech",
  },
  {
    id: "notif-2",
    title: "Collaboration request accepted",
    message: "Your proposal for Smart Water Monitoring System was accepted.",
    timestamp: "5 hours ago",
    date: "Today, 08:45 AM",
    type: "collaboration",
    read: false,
    link: "/industry-dashboard/collaborations",
    priority: "High",
    category: "Water & Sanitation",
  },
  {
    id: "notif-3",
    title: "New government message",
    message: "A government challenge needs industry sponsorship in Ranchi.",
    timestamp: "Yesterday",
    date: "Yesterday, 04:20 PM",
    type: "government",
    read: false,
    link: "/industry-dashboard/reports-complaints",
    priority: "Medium",
    category: "Municipal Works",
  },
  {
    id: "notif-4",
    title: "Profile update reminder",
    message: "Review your company expertise to improve project matching.",
    timestamp: "2 days ago",
    date: "25 Sep 2026",
    type: "profile",
    read: false,
    link: "/industry-dashboard/profile",
    priority: "Normal",
    category: "Account Setting",
  },
  {
    id: "notif-5",
    title: "Grant milestone verified",
    message: "Team EcoSort at BIT Mesra completed Prototype stage. Review proof of work in workspace.",
    timestamp: "3 days ago",
    date: "24 Sep 2026",
    type: "milestone",
    read: true,
    link: "/industry-dashboard/collaborations",
    priority: "Normal",
    category: "Waste Management",
  },
];

const getStorageKey = (user) => {
  const userKey = String(user?.email || user?.organization || user?.name || "industry").toLowerCase().trim();
  return `solvesphere_industry_notifications_${userKey}`;
};

export const getIndustryNotifications = (user) => {
  const key = getStorageKey(user);
  try {
    const saved = localStorage.getItem(key) || localStorage.getItem("solvesphere_industry_notifications");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading industry notifications:", e);
  }

  // Seed default notifications
  try {
    localStorage.setItem(key, JSON.stringify(DEFAULT_INDUSTRY_NOTIFICATIONS));
    localStorage.setItem("solvesphere_industry_notifications", JSON.stringify(DEFAULT_INDUSTRY_NOTIFICATIONS));
  } catch {}

  return DEFAULT_INDUSTRY_NOTIFICATIONS;
};

export const markIndustryNotificationAsRead = (id, user) => {
  const key = getStorageKey(user);
  const current = getIndustryNotifications(user);
  const updated = current.map((item) => (String(item.id) === String(id) ? { ...item, read: true } : item));

  try {
    localStorage.setItem(key, JSON.stringify(updated));
    localStorage.setItem("solvesphere_industry_notifications", JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving notification read state:", e);
  }

  try {
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("solvesphere_notifications_updated", { detail: { id, read: true } }));
  } catch {}

  return updated;
};

export const markAllIndustryNotificationsAsRead = (user) => {
  const key = getStorageKey(user);
  const current = getIndustryNotifications(user);
  const updated = current.map((item) => ({ ...item, read: true }));

  try {
    localStorage.setItem(key, JSON.stringify(updated));
    localStorage.setItem("solvesphere_industry_notifications", JSON.stringify(updated));
  } catch (e) {
    console.error("Error marking all notifications read:", e);
  }

  try {
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("solvesphere_notifications_updated", { detail: { allRead: true } }));
  } catch {}

  return updated;
};

export const deleteIndustryNotification = (id, user) => {
  const key = getStorageKey(user);
  const current = getIndustryNotifications(user);
  const updated = current.filter((item) => String(item.id) !== String(id));

  try {
    localStorage.setItem(key, JSON.stringify(updated));
    localStorage.setItem("solvesphere_industry_notifications", JSON.stringify(updated));
  } catch (e) {
    console.error("Error deleting notification:", e);
  }

  try {
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("solvesphere_notifications_updated"));
  } catch {}

  return updated;
};

export const getUnreadIndustryNotificationCount = (user) => {
  const all = getIndustryNotifications(user);
  return all.filter((n) => !n.read).length;
};
