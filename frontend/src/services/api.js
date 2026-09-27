/**
 * SolveSphere API Service Layer
 * Connects React frontend to Django REST backend (http://localhost:8000)
 *
 * All /api/* requests are proxied through Vite to http://127.0.0.1:8000
 */

import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE KEY CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
export const TOKEN_STORAGE_KEY = "solvesphere_access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "solvesphere_refresh_token";
export const USER_STORAGE_KEY = "solvesphere_auth_user";

// ─────────────────────────────────────────────────────────────────────────────
// AXIOS INSTANCE
// ─────────────────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Request interceptor – attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(TOKEN_STORAGE_KEY) ||
      localStorage.getItem("solvesphere_auth_token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – auto-refresh expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

      if (refreshToken) {
        try {
          const { data } = await axios.post("/api/auth/token/refresh/", {
            refresh: refreshToken,
          });

          if (data?.access) {
            localStorage.setItem(TOKEN_STORAGE_KEY, data.access);
            localStorage.setItem("solvesphere_auth_token", data.access);
            originalRequest.headers.Authorization = `Bearer ${data.access}`;
            return api(originalRequest);
          }
        } catch (_) {
          // Refresh failed – caller handles redirect
        }
      }
    }

    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// AUTH SERVICE  →  /api/auth/*  +  /api/users/*
// ─────────────────────────────────────────────────────────────────────────────
export const authService = {
  /** POST /api/auth/login/ – returns {access, refresh, role, dashboard_url, user, profile} */
  login: ({ email, password, role = null }) => {
    const payload = { email: String(email).trim().toLowerCase(), password };
    if (role) payload.role = role;
    return api.post("/auth/login/", payload).then((r) => r.data);
  },

  /** POST /api/users/login/ – alternate login endpoint */
  loginAlt: ({ email, password, role = null }) => {
    const payload = { email: String(email).trim().toLowerCase(), password };
    if (role) payload.role = role;
    return api.post("/users/login/", payload).then((r) => r.data);
  },

  /** POST /api/auth/register/citizen/ */
  registerCitizen: (data) =>
    api
      .post("/auth/register/citizen/", {
        full_name: data.fullName || data.name,
        email: String(data.email).trim().toLowerCase(),
        password: data.password,
        confirm_password: data.confirmPassword || data.password,
        location: data.location || "",
        district: data.district || "Ranchi",
        phone: data.phone || data.contactNumber || "",
        role: "citizen",
      })
      .then((r) => r.data),

  /** POST /api/auth/register/university/ */
  registerUniversity: (data) =>
    api
      .post("/auth/register/university/", {
        university_name: data.universityName || data.name,
        official_email: String(data.officialEmail || data.email)
          .trim()
          .toLowerCase(),
        password: data.password,
        contact_person: data.contactPerson,
        contact_number: data.contactNumber || data.phone || "",
        location: data.location || "",
        district: data.district || "Ranchi",
        university_type: data.universityType || "University",
        address: data.address || data.location || "",
        departments:
          data.departments || (data.department ? [data.department] : []),
        expertise: data.expertiseAreas || data.expertise || [],
        research_areas: data.researchAreas || "",
      })
      .then((r) => r.data),

  /** POST /api/auth/register/industry/ */
  registerIndustry: (data) =>
    api
      .post("/auth/register/industry/", {
        company_name: data.companyName || data.name,
        official_email: String(data.officialEmail || data.email)
          .trim()
          .toLowerCase(),
        password: data.password,
        contact_person: data.contactPerson,
        phone: data.phone || data.contactNumber || "",
        company_type: data.companyType || "Startup",
        industry_domain: data.industryDomain || "IT",
        department: data.department || "",
        expertise_areas: data.expertiseAreas || data.expertise || [],
        services_offered: data.servicesOffered || [],
        location: data.location || "",
        district: data.district || "Ranchi",
        company_website: data.companyWebsite || "",
      })
      .then((r) => r.data),

  /** POST /api/government/register/ */
  registerGovernment: (data) =>
    api
      .post("/government/register/", {
        full_name: data.fullName || data.name,
        designation: data.designation || "Nodal Officer",
        department: data.department || "Urban Development",
        organization: data.organization || "Govt of Jharkhand",
        official_email: String(data.officialEmail || data.email)
          .trim()
          .toLowerCase(),
        contact_number: data.contactNumber || data.phone || "",
        government_level: data.level || data.government_level || "STATE",
        state: data.state || "Jharkhand",
        district: data.district || "",
        password: data.password,
      })
      .then((r) => r.data),

  /** POST /api/auth/verify-email/ */
  verifyEmail: ({ email, otp, token }) =>
    api.post("/auth/verify-email/", { email, otp, token }).then((r) => r.data),

  /** GET /api/users/profile/ */
  getProfile: () => api.get("/users/profile/").then((r) => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// CITIZEN SERVICE  →  /api/citizen/*  +  /api/citizens/*
// ─────────────────────────────────────────────────────────────────────────────
export const citizenService = {
  getDashboard: () => api.get("/citizen/dashboard/").then((r) => r.data),

  reportProblem: (problemData) =>
    api
      .post("/citizen/problems/", {
        title: problemData.title,
        description: problemData.description,
        category:
          problemData.category ||
          problemData.backendCategory ||
          "Water Management",
        district: problemData.district || "Ranchi",
        block: problemData.block || "",
        village: problemData.village || "",
        pin_code: problemData.pin_code || "",
        latitude: problemData.latitude ?? 23.3441,
        longitude: problemData.longitude ?? 85.3096,
        citizen_name: problemData.citizen_name || problemData.citizenName || "",
      })
      .then((r) => r.data),

  getProblems: (params = {}) =>
    api.get("/citizen/problems/", { params }).then((r) => r.data),

  getMyReports: (params = {}) =>
    api.get("/citizens/my-reports/", { params }).then((r) => r.data),

  getTrackingDetail: (problemId) =>
    api.get(`/citizens/tracking/${problemId}/`).then((r) => r.data),

  getAllTracking: () =>
    api.get("/citizens/tracking/").then((r) => r.data),

  getSupport: () => api.get("/citizens/support/").then((r) => r.data),

  submitSupportTicket: (ticketData) =>
    api.post("/citizens/support/", ticketData).then((r) => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// GOVERNMENT SERVICE  →  /api/government/*  +  /api/admin/*
// ─────────────────────────────────────────────────────────────────────────────
export const governmentService = {
  getStateDashboard: () =>
    api.get("/government/state/dashboard/").then((r) => r.data),

  getDistrictDashboard: (district = "") =>
    api
      .get("/government/district/dashboard/", {
        params: district ? { district } : {},
      })
      .then((r) => r.data),

  getAdminDashboard: () =>
    api.get("/government/dashboard/").then((r) => r.data),

  getDistricts: () => api.get("/government/districts/").then((r) => r.data),

  getProblems: (params = {}) =>
    api.get("/government/problems/", { params }).then((r) => r.data),

  getProblemDetail: (id) =>
    api.get(`/government/problems/${id}/`).then((r) => r.data),

  approveProblem: (id, data = {}) =>
    api.post(`/government/problems/${id}/approve/`, data).then((r) => r.data),

  rejectProblem: (id, data = {}) =>
    api.post(`/government/problems/${id}/reject/`, data).then((r) => r.data),

  getUniversityMatches: (id) =>
    api
      .get(`/government/problems/${id}/university-matching/`)
      .then((r) => r.data),

  assignUniversity: (id, data) =>
    api
      .post(`/government/problems/${id}/assign-university/`, data)
      .then((r) => r.data),

  getOrganizationVerifications: () =>
    api.get("/government/organization-verifications/").then((r) => r.data),

  getOfficers: () => api.get("/government/officers/").then((r) => r.data),

  approveOfficer: (id) =>
    api.post(`/government/officers/${id}/approve/`).then((r) => r.data),

  rejectOfficer: (id, data = {}) =>
    api.post(`/government/officers/${id}/reject/`, data).then((r) => r.data),

  getUniversities: () =>
    api.get("/government/universities/").then((r) => r.data),

  approveUniversity: (id) =>
    api.post(`/government/universities/${id}/approve/`).then((r) => r.data),

  rejectUniversity: (id, data = {}) =>
    api
      .post(`/government/universities/${id}/reject/`, data)
      .then((r) => r.data),

  getIndustries: () => api.get("/government/industries/").then((r) => r.data),

  approveIndustry: (id) =>
    api.post(`/government/industries/${id}/approve/`).then((r) => r.data),

  rejectIndustry: (id, data = {}) =>
    api.post(`/government/industries/${id}/reject/`, data).then((r) => r.data),

  getDistrictMonitoring: () =>
    api.get("/government/district-monitoring/").then((r) => r.data),

  getImpactReports: () => api.get("/government/impact/").then((r) => r.data),

  getNotifications: () =>
    api.get("/government/notifications/").then((r) => r.data),

  getAnalytics: () => api.get("/government/analytics/").then((r) => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSITY SERVICE  →  /api/university/*
// ─────────────────────────────────────────────────────────────────────────────
export const universityService = {
  getDashboard: () => api.get("/university/dashboard/").then((r) => r.data),

  getProfile: () => api.get("/university/profile/").then((r) => r.data),

  getChallenges: (params = {}) =>
    api.get("/university/challenges/", { params }).then((r) => r.data),

  getProjects: (params = {}) =>
    api.get("/university/projects/", { params }).then((r) => r.data),

  createProject: (data) =>
    api.post("/university/projects/", data).then((r) => r.data),

  getWorkspace: (projectId) =>
    api.get(`/university/workspace/${projectId}/`).then((r) => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// INDUSTRY SERVICE  →  /api/industry/*
// ─────────────────────────────────────────────────────────────────────────────
export const industryService = {
  getDashboard: () => api.get("/industry/dashboard/").then((r) => r.data),

  getRecommendedProjects: () =>
    api.get("/industry/projects/recommended/").then((r) => r.data),

  getWorkspace: (projectId) =>
    api.get(`/industry/workspace/${projectId}/`).then((r) => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// AI SERVICE  →  /api/ai/*
// ─────────────────────────────────────────────────────────────────────────────
export const aiService = {
  /** POST /api/ai/classify/ */
  classifyProblem: (data) =>
    api.post("/ai/classify/", data).then((r) => r.data),

  /** POST /api/ai/transcribe/ – multipart/form-data */
  transcribeAudio: (formData) =>
    api
      .post("/ai/transcribe/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
};

// ─────────────────────────────────────────────────────────────────────────────
// CHALLENGES & ANALYTICS  →  /api/challenges/*  +  /api/analytics/*
// ─────────────────────────────────────────────────────────────────────────────
export const challengeService = {
  getAll: (params = {}) =>
    api.get("/challenges/", { params }).then((r) => r.data),

  getNearby: (lat = 23.3441, lng = 85.3096, radius = 25) =>
    api
      .get(`/challenges/nearby/?lat=${lat}&lng=${lng}&radius=${radius}`)
      .then((r) => r.data),

  getAnalyticsDashboard: () =>
    api.get("/analytics/dashboard/").then((r) => r.data),

  getHeatmap: () => api.get("/analytics/heatmap/").then((r) => r.data),
};

export default api;
