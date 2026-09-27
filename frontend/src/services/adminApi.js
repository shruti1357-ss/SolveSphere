/*
 * Government dashboard API contract for the future Django REST backend.
 *
 * The UI currently uses AdminContext mock/local data so the rest of the
 * application remains unchanged. When Django is connected, these endpoints
 * can be wired into AdminContext without changing the dashboard components.
 */

export const ADMIN_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const ADMIN_ENDPOINTS = {
  dashboardStats: "/admin/dashboard/stats/",
  problemReports: "/admin/problems/",
  recentReports: "/admin/problems/recent/",
  highPriorityReports: "/admin/problems/high-priority/",
  categoryAnalytics: "/admin/analytics/categories/",
  priorityAnalytics: "/admin/analytics/priorities/",
  districtAnalytics: "/admin/analytics/districts/",
  challenges: "/admin/challenges/",
  proposals: "/admin/proposals/",
  solutions: "/admin/solutions/",
  tracking: "/admin/tracking/",
  partners: "/admin/partners/",
  notifications: "/admin/notifications/",
};

export const adminUrl = (endpoint) => `${ADMIN_API_BASE_URL}${endpoint}`;

/**
 * Normalizes Django REST Framework problem payloads and keeps the frontend
 * tolerant of the current prototype field names.
 */
export const normalizeProblemReport = (item = {}) => ({
  id: item.id ?? item.problem_id ?? item.challenge_id ?? "",
  title: item.title ?? item.problem_title ?? item.challenge_title ?? "",
  description: item.description ?? "",
  category: item.category ?? "",
  district:
    item.district ??
    item.location?.district ??
    (typeof item.location === "string" ? item.location.split(",")[0].trim() : ""),
  priority: item.priority ?? item.ai_priority ?? "Medium",
  status: item.status ?? "UNDER_REVIEW",
  submitted_by: item.submitted_by ?? item.submittedBy ?? "",
  created_at: item.created_at ?? item.createdAt ?? item.date ?? null,
});
