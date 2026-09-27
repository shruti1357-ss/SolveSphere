import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  authService,
  citizenService,
  TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "../services/api";
import { updateProblemLifecycle } from "../utils/problemLifecycleUtils";

const USER_STORAGE_KEY = "solvesphere_auth_user";
const REGISTERED_USERS_STORAGE_KEY = "solvesphere_registered_users";
const PROBLEMS_STORAGE_KEY = "solvesphere_user_problems";
const ADMIN_STORAGE_KEY = "solvesphere_admin_portal_data_v1";

const AUTH_SESSION_KEYS = [
  USER_STORAGE_KEY,
  "solvesphere_auth_token",
  "solvesphere_session_token",
  "solvesphere_access_token",
  "solvesphere_refresh_token",
  "authToken",
  "token",
];

const LOGOUT_REDIRECT_KEY = "solvesphere_logout_redirect";

/*
 * ============================================================
 * BACKEND COMPATIBILITY HELPERS
 * ============================================================
 *
 * Backend roles:
 * CITIZEN
 * STUDENT
 * FACULTY
 * GOVT_ADMIN
 * CSR_PARTNER
 *
 * Frontend keeps its existing display roles:
 * Citizen
 * University
 * Government
 * NGO
 * Industry
 */

export const BACKEND_ROLES = {
  CITIZEN: "CITIZEN",
  STUDENT: "STUDENT",
  FACULTY: "FACULTY",
  GOVT_ADMIN: "GOVT_ADMIN",
  CSR_PARTNER: "CSR_PARTNER",
};

export const FRONTEND_ROLES = {
  CITIZEN: "Citizen",
  UNIVERSITY: "University",
  GOVERNMENT: "Government",
  NGO: "NGO",
  INDUSTRY: "Industry",
};

export const normalizeBackendRoleToFrontend = (role) => {
  const normalized = String(role || "").toUpperCase();

  switch (normalized) {
    case "CITIZEN":
      return "Citizen";

    case "STUDENT":
    case "FACULTY":
    case "UNIVERSITY":
      return "University";

    case "GOVT_ADMIN":
    case "GOVERNMENT_ADMIN":
    case "GOVERNMENT":
      return "Government";

    case "CSR_PARTNER":
    case "INDUSTRY":
      return "Industry";

    default:
      return role || "Citizen";
  }
};

export const normalizeFrontendRoleToBackend = (role) => {
  const normalized = String(role || "").toLowerCase();

  switch (normalized) {
    case "citizen":
      return BACKEND_ROLES.CITIZEN;

    case "university":
    case "university student":
    case "student":
      return BACKEND_ROLES.STUDENT;

    case "faculty":
      return BACKEND_ROLES.FACULTY;

    case "government":
    case "govt_admin":
    case "government_admin":
    case "government admin":
      return BACKEND_ROLES.GOVT_ADMIN;

    case "industry":
    case "csr_partner":
      return BACKEND_ROLES.CSR_PARTNER;

    /*
     * NGO does not exist in the current backend.
     * Keep NGO in frontend so existing UI does not break.
     */
    case "ngo":
      return null;

    default:
      return role || BACKEND_ROLES.CITIZEN;
  }
};

/*
 * Backend challenge categories
 *
 * UI labels are intentionally preserved.
 */
export const CATEGORY_BACKEND_MAP = {
  "Water & Sanitation": "Water Management",
  "Water Management": "Water Management",

  Agriculture: "Agriculture & FoodTech",
  "Agriculture & FoodTech": "Agriculture & FoodTech",

  Healthcare: "Health & MedTech",
  "Health & MedTech": "Health & MedTech",

  "Waste Management": "Sanitation & Waste",
  "Sanitation & Waste": "Sanitation & Waste",

  Infrastructure: "Rural Infrastructure",
  "Rural Infrastructure": "Rural Infrastructure",

  Education: "Smart Education",
  "Smart Education": "Smart Education",

  Environment: "Clean Energy",
  "Clean Energy": "Clean Energy",

  "Public Safety": "Rural Infrastructure",
};

/*
 * Backend challenge status → existing frontend status
 */
export const CHALLENGE_STATUS_FRONTEND_MAP = {
  OPEN: "Open",
  UNDER_REVIEW: "Under AI Analysis",
  ASSIGNED_TO_HEI: "Active",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Completed",
};

/*
 * Existing frontend status → backend status
 */
export const CHALLENGE_STATUS_BACKEND_MAP = {
  Open: "OPEN",
  Pending: "OPEN",
  "Under AI Analysis": "UNDER_REVIEW",
  "Pending Review": "UNDER_REVIEW",
  Active: "ASSIGNED_TO_HEI",
  Assigned: "ASSIGNED_TO_HEI",
  "In Progress": "IN_PROGRESS",
  Completed: "RESOLVED",
  Resolved: "RESOLVED",

  /*
   * Existing local government status.
   * It represents a reviewed/approved challenge.
   */
  // Government approval publishes the challenge for universities.\n  // University assignment happens later via ASSIGNED_TO_HEI.\n  "Approved as Active Challenge": "OPEN",
};

export const normalizeCategoryToBackend = (category) => {
  return (
    CATEGORY_BACKEND_MAP[category] ||
    category ||
    "Water Management"
  );
};

export const normalizeCategoryToFrontend = (category) => {
  const reverseMap = {
    "Water Management": "Water & Sanitation",
    "Agriculture & FoodTech": "Agriculture",
    "Health & MedTech": "Healthcare",
    "Sanitation & Waste": "Waste Management",
    "Rural Infrastructure": "Infrastructure",
    "Smart Education": "Education",
    "Clean Energy": "Environment",
  };

  return reverseMap[category] || category || "Water & Sanitation";
};

export const normalizeChallengeStatusToFrontend = (status) => {
  return (
    CHALLENGE_STATUS_FRONTEND_MAP[status] ||
    status ||
    "Under AI Analysis"
  );
};

export const normalizeChallengeStatusToBackend = (status) => {
  return (
    CHALLENGE_STATUS_BACKEND_MAP[status] ||
    status ||
    "UNDER_REVIEW"
  );
};

/*
 * Convert backend User response into the shape
 * already expected by the frontend.
 */
export const normalizeBackendUser = (backendUser = {}) => {
  const firstName = backendUser.first_name || backendUser.fullName || "";
  const lastName = backendUser.last_name || "";

  let combinedName = (
    backendUser.profile?.full_name ||
    backendUser.full_name ||
    `${firstName} ${lastName}`.trim() ||
    backendUser.name ||
    ""
  );

  // If only username is available, strip auto-generated suffix (e.g. suman127_6de4 -> suman127)
  if (!combinedName && backendUser.username) {
    combinedName = backendUser.username.replace(/_[a-f0-9]{4,8}$/i, "");
  }

  if (!combinedName && backendUser.email) {
    combinedName = backendUser.email.split("@")[0];
  }

  // Strip accidental trailing uuid suffix if any
  combinedName = combinedName ? combinedName.replace(/_[a-f0-9]{4,8}$/i, "").trim() : "Innovator User";

  return {
    ...backendUser,

    id: backendUser.id,
    username: backendUser.username,

    name: combinedName,

    email: backendUser.email || "",

    /*
     * UI role
     */
    role: normalizeBackendRoleToFrontend(
      backendUser.role
    ),

    /*
     * Exact backend role retained for future API work.
     */
    backendRole:
      backendUser.role ||
      normalizeFrontendRoleToBackend(
        backendUser.role
      ),

    phone: backendUser.phone || "",

    organization:
      backendUser.organization ||
      backendUser.university ||
      backendUser.institutionName ||
      "",

    district: backendUser.district || "",

    first_name: firstName,
    last_name: lastName,

    isLoggedIn: true,
  };
};

/*
 * Convert frontend registration/login data into
 * backend-compatible user payload.
 *
 * This DOES NOT call the backend.
 * It only prepares the structure for the team member
 * who will connect the API later.
 */
export const createBackendUserPayload = ({
  name = "",
  email = "",
  password = "",
  role = "Citizen",
  phone = "",
  organization = "",
  district = "",
}) => {
  const trimmedName = String(name || "").trim();

  const nameParts = trimmedName
    ? trimmedName.split(/\s+/)
    : [];

  const firstName = nameParts.shift() || "";
  const lastName = nameParts.join(" ");

  return {
    username:
      email ||
      trimmedName.toLowerCase().replace(/\s+/g, "_"),

    email,

    password,

    first_name: firstName,

    last_name: lastName,

    role:
      normalizeFrontendRoleToBackend(role) ||
      BACKEND_ROLES.CITIZEN,

    phone,

    organization,

    district,
  };
};

/*
 * Convert a frontend problem into the exact basic
 * Challenge structure expected by Django backend.
 */
export const createBackendChallengePayload = (
  problemData = {},
  currentUser = null
) => {
  const coordinates =
    problemData.latitude !== undefined &&
    problemData.longitude !== undefined
      ? {
          latitude: Number(problemData.latitude),
          longitude: Number(problemData.longitude),
        }
      : {};

  return {
    title:
      problemData.title ||
      "Reported Community Problem",

    description:
      problemData.description || "",

    category:
      normalizeCategoryToBackend(
        problemData.category
      ),

    district:
      problemData.district ||
      currentUser?.district ||
      "",

    block:
      problemData.block ||
      "",

    latitude:
      coordinates.latitude ?? null,

    longitude:
      coordinates.longitude ?? null,

    status:
      normalizeChallengeStatusToBackend(
        problemData.status ||
          "Under AI Analysis"
      ),

    urgency_score:
      Number(
        problemData.urgency_score ??
          problemData.severity_score ??
          problemData.priorityScore ??
          0
      ),

    citizen:
      currentUser?.id || null,

    citizen_name:
      currentUser?.name ||
      "",

    citizen_phone:
      currentUser?.phone ||
      "",

    is_anonymous:
      Boolean(
        problemData.isAnonymous ??
          problemData.is_anonymous ??
          false
      ),

    media_urls:
      Array.isArray(problemData.media_urls)
        ? problemData.media_urls
        : [
            ...(Array.isArray(problemData.photos)
              ? problemData.photos
              : []),
            ...(Array.isArray(problemData.videos)
              ? problemData.videos
              : []),
          ],

    assigned_university:
      problemData.assigned_university ||
      problemData.assignedUniversity ||
      "",
  };
};

/*
 * Convert backend Challenge response into the
 * existing frontend challenge/problem shape.
 *
 * This lets backend data enter the existing UI
 * without redesigning the UI.
 */
export const normalizeBackendChallenge = (
  challenge = {}
) => {
  const frontendCategory =
    normalizeCategoryToFrontend(
      challenge.category
    );

  const frontendStatus =
    normalizeChallengeStatusToFrontend(
      challenge.status
    );

  const locationParts = [
    challenge.block,
    challenge.district,
  ].filter(Boolean);

  const location =
    locationParts.length > 0
      ? locationParts.join(", ")
      : "District Area";

  return {
    ...challenge,

    /*
     * Keep backend ID.
     */
    backendId: challenge.id,

    /*
     * Existing UI can continue treating id as string.
     */
    id:
      challenge.id !== undefined &&
      challenge.id !== null
        ? String(challenge.id)
        : `SS-2026-${Math.floor(
            10000 + Math.random() * 90000
          )}`,

    title:
      challenge.title ||
      "Community Challenge",

    description:
      challenge.description || "",

    category: frontendCategory,

    backendCategory:
      challenge.category || "",

    location,

    district:
      challenge.district || "",

    block:
      challenge.block || "",

    latitude:
      challenge.latitude ?? null,

    longitude:
      challenge.longitude ?? null,

    coordinates:
      challenge.longitude !== undefined &&
      challenge.latitude !== undefined
        ? [
            Number(challenge.longitude),
            Number(challenge.latitude),
          ]
        : null,

    status: frontendStatus,

    backendStatus:
      challenge.status || "",

    urgency_score:
      Number(challenge.urgency_score || 0),

    priority:
      challenge.urgency_score >= 7
        ? "High"
        : challenge.urgency_score >= 4
        ? "Medium"
        : "Low",

    upvotes:
      Number(challenge.upvotes || 0),

    participants:
      challenge.participants || 0,

    teams:
      challenge.teams || 0,

    proposalsCount:
      challenge.proposalsCount || 0,

    submittedBy:
      challenge.is_anonymous
        ? "Anonymous Citizen"
        : challenge.citizen_name ||
          "Citizen",

    submittedByRole: "Citizen",

    assignedUniversity:
      challenge.assigned_university || "",

    assigned_university:
      challenge.assigned_university || "",

    isAnonymous:
      Boolean(challenge.is_anonymous),

    media_urls:
      Array.isArray(challenge.media_urls)
        ? challenge.media_urls
        : [],

    date: challenge.created_at
      ? new Date(
          challenge.created_at
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",

    created_at:
      challenge.created_at || null,

    updated_at:
      challenge.updated_at || null,

    statusStyle:
      frontendStatus === "Completed"
        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
        : frontendStatus === "In Progress"
        ? "bg-blue-50 text-blue-600 border border-blue-200"
        : frontendStatus === "Active"
        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
        : "bg-amber-50 text-amber-600 border border-amber-200",
  };
};

/*
 * Initial demo problems.
 * Existing UI data is intentionally preserved.
 */
const initialUserProblems = [
  {
    id: "SS-2026-8091",
    title: "Drinking Water Shortage & Pipe Contamination",
    location:
      "Chandil Village, District East Singhbhum",
    category: "Water & Sanitation",
    backendCategory: "Water Management",

    description:
      "Frequent water supply cuts and dirty water flowing in main supply line affecting 200+ households.",

    date: "02 Sep 2026",

    status: "Under AI Analysis",

    backendStatus: "UNDER_REVIEW",

    statusStyle:
      "bg-blue-50 text-blue-600 border border-blue-200",

    priority: "High",

    urgency_score: 8,

    affected: "2,500 Residents",

    submittedByRole: "Citizen",

    submittedByBackendRole: "CITIZEN",
  },

  {
    id: "SS-2026-7912",
    title:
      "Pothole Hazards & Poor Road Condition",

    location:
      "Adityapur Industrial Main Road",

    category: "Infrastructure",

    backendCategory: "Rural Infrastructure",

    description:
      "Deep potholes causing severe traffic jams and minor accidents near college crossing.",

    date: "28 Aug 2026",

    status: "Under AI Analysis",

    backendStatus: "UNDER_REVIEW",

    statusStyle:
      "bg-amber-50 text-amber-600 border border-amber-200",

    priority: "High",

    urgency_score: 8,

    affected: "5,000 Commuters",

    submittedByRole: "Citizen",

    submittedByBackendRole: "CITIZEN",
  },

  {
    id: "SS-2026-7450",
    title:
      "Broken Street Lights Near Community Center",

    location: "Jamshedpur Sector 4",

    category: "Public Safety",

    backendCategory: "Rural Infrastructure",

    description:
      "Streetlights non-functional for 3 weeks leading to safety concerns at night.",

    date: "20 Aug 2026",

    status: "Approved as Active Challenge",

    backendStatus: "ASSIGNED_TO_HEI",

    statusStyle:
      "bg-emerald-50 text-emerald-600 border border-emerald-200",

    priority: "Medium",

    urgency_score: 5,

    affected: "800 Residents",

    submittedByRole: "Citizen",

    submittedByBackendRole: "CITIZEN",
  },
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);

      if (saved) {
        const parsedUser = JSON.parse(saved);

        if (parsedUser?.isLoggedIn) {
          const registeredUsers = JSON.parse(
            localStorage.getItem(REGISTERED_USERS_STORAGE_KEY) || "[]"
          );
          const registered = Array.isArray(registeredUsers)
            ? registeredUsers.find(
                (item) =>
                  String(item?.email || "").trim().toLowerCase() ===
                  String(parsedUser?.email || "").trim().toLowerCase()
              )
            : null;

          // Never restore an old session that was not created through signup.
          if (registered) {
            return normalizeBackendUser(parsedUser);
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse stored auth data:", e);
    }

    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  });

  const getUserProblemsStorageKey = (currentUser) => {
    if (!currentUser) return null;
    const identifier = currentUser.email || currentUser.id || currentUser.username;
    return identifier ? `solvesphere_user_problems_${String(identifier).trim().toLowerCase()}` : null;
  };

  const [userProblems, setUserProblems] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const userKey = parsedUser?.email ? `solvesphere_user_problems_${String(parsedUser.email).trim().toLowerCase()}` : null;
        if (userKey) {
          const saved = localStorage.getItem(userKey);
          if (saved) {
            const parsedProblems = JSON.parse(saved);
            if (Array.isArray(parsedProblems)) {
              return parsedProblems;
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse stored user problems:", e);
    }
    return [];
  });

  const [toasts, setToasts] = useState([]);

  const toastIdRef = useRef(0);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(
        USER_STORAGE_KEY
      );
    }
  }, [user]);

  // Load and sync reports dynamically per authenticated user
  useEffect(() => {
    if (!user) {
      setUserProblems([]);
      return;
    }

    const userKey = getUserProblemsStorageKey(user);
    if (userKey) {
      try {
        const cached = localStorage.getItem(userKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setUserProblems(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to read user cached problems:", e);
      }
    }

    let isCancelled = false;
    citizenService
      .getMyReports()
      .then((data) => {
        if (isCancelled) return;
        const reportsList = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.problems)
          ? data.problems
          : [];

        if (reportsList.length > 0) {
          const formatted = reportsList.map(normalizeChallengeToFrontend);
          setUserProblems(formatted);
          if (userKey) {
            localStorage.setItem(userKey, JSON.stringify(formatted));
          }
        } else if (userKey && !localStorage.getItem(userKey)) {
          setUserProblems([]);
          localStorage.setItem(userKey, JSON.stringify([]));
        }
      })
      .catch((err) => {
        console.warn("[Auth] Could not fetch my-reports:", err.message);
      });

    return () => {
      isCancelled = true;
    };
  }, [user?.email, user?.id]);

  useEffect(() => {
    const userKey = getUserProblemsStorageKey(user);
    if (userKey) {
      localStorage.setItem(
        userKey,
        JSON.stringify(userProblems)
      );
    }
  }, [userProblems, user]);

  const showToast = (
    message,
    type = "success"
  ) => {
    toastIdRef.current += 1;

    const id = `auth-toast-${toastIdRef.current}`;

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter(
          (t) => t.id !== id
        )
      );
    }, 4000);
  };

  /*
   * ============================================================
   * LOGIN
   * ============================================================
   *
   * Current frontend remains local.
   *
   * Later backend integration can replace only the inside
   * of this function with:
   *
   * POST /api/users/login/
   *
   * and then pass the backend response through
  /*
   * ============================================================
   * LOGIN  –  MongoDB-primary backend (POST /api/auth/login/)
   * Falls back to localStorage demo accounts if backend unreachable.
   * ============================================================
   */
  const login = async (
    email,
    password,
    roleOverride = null,
    name = ""
  ) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    // ── 1. Try the Django / MongoDB backend first ───────────────
    try {
      const data = await authService.login({
        email: normalizedEmail,
        password: String(password || ""),
        role: roleOverride
          ? normalizeFrontendRoleToBackend(roleOverride)
          : undefined,
      });

      // Store JWT tokens in localStorage so the api.js interceptor picks them up
      const accessToken = data.access || data.token || data.tokens?.access;
      const refreshToken = data.refresh || data.tokens?.refresh;

      if (accessToken) {
        localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken || "");
        localStorage.setItem("solvesphere_auth_token", accessToken);
      }

      const rawUser = data.user || {};
      const backendRoleRaw = data.role || rawUser.role || "CITIZEN";

      const displayName =
        rawUser.first_name
          ? `${rawUser.first_name} ${rawUser.last_name || ""}`.trim()
          : data.profile?.full_name ||
            name ||
            normalizedEmail.split("@")[0];

      const frontendRole = normalizeBackendRoleToFrontend(backendRoleRaw);

      const resolvedLevel = (() => {
        if (data.level) return String(data.level).toUpperCase();
        if (data.dashboard_type) return String(data.dashboard_type).toUpperCase();
        if (data.profile?.level) return String(data.profile.level).toUpperCase();
        if (data.profile?.government_level) return String(data.profile.government_level).toUpperCase();
        const dist = String(data.district || rawUser.district || data.profile?.district || "").trim().toLowerCase();
        const desig = String(data.profile?.designation || "").trim().toUpperCase();
        if (frontendRole === "Government") {
          if (desig.includes("STATE") || !dist || dist === "state" || dist === "jharkhand" || dist === "all districts") {
            return "STATE";
          }
          return "DISTRICT";
        }
        return undefined;
      })();

      const newUser = {
        ...normalizeBackendUser(rawUser),
        name: displayName,
        email: rawUser.email || normalizedEmail,
        role: frontendRole,
        backendRole: backendRoleRaw,
        backend_role: backendRoleRaw,
        level: resolvedLevel,
        district:
          data.district ||
          rawUser.district ||
          data.profile?.district ||
          "",
        profile: data.profile || {},
        dashboard_url: data.dashboard_url || (resolvedLevel === "STATE" ? "/state/dashboard" : "/district/dashboard"),
        isLoggedIn: true,
        isRegistered: true,
      };

      setUser(newUser);
      showToast(`Logged in successfully as ${newUser.role}!`, "success");
      return newUser;
    } catch (apiError) {
      // If the server explicitly rejected the credentials – propagate immediately
      const status = apiError?.response?.status;
      if (status === 400 || status === 401 || status === 403 || status === 404) {
        const errData = apiError.response.data;
        const msg =
          errData?.error || errData?.detail || errData?.message || "Invalid credentials";
        const err = new Error(msg);
        err.code =
          errData?.code ||
          errData?.error_code ||
          (status === 401 ? "INVALID_CREDENTIALS" : "AUTH_ERROR");
        err.serverError = errData;
        throw err;
      }

      // Network / server down → fallback to localStorage demo accounts
      console.warn("[Auth] Backend unreachable, using local fallback:", apiError.message);
    }

    // ── 2. Local fallback (demo + localStorage-registered accounts) ─
    let registeredUsers = [];
    try {
      const saved = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
      registeredUsers = saved ? JSON.parse(saved) : [];
    } catch (_) {
      registeredUsers = [];
    }

    let registeredUser = Array.isArray(registeredUsers)
      ? registeredUsers.find(
          (item) =>
            String(item?.email || "").trim().toLowerCase() === normalizedEmail
        )
      : null;

    if (!registeredUser) {
      const demoAccounts = {
        "admin.portal@gov.in": {
          name: "Government Administrator",
          email: "admin.portal@gov.in",
          password: "GOV-SECRETARY-2026",
          role: "Government",
          backendRole: "GOVT_ADMIN",
          level: "STATE",
        },
        "citizen@example.com": {
          name: "Citizen User",
          email: "citizen@example.com",
          password: "password123",
          role: "Citizen",
          backendRole: "CITIZEN",
        },
        "university@example.com": {
          name: "University User",
          email: "university@example.com",
          password: "password123",
          role: "University",
          backendRole: "STUDENT",
        },
        "industry@example.com": {
          name: "Industry User",
          email: "industry@example.com",
          password: "password123",
          role: "Industry",
          backendRole: "CSR_PARTNER",
        },
      };
      if (demoAccounts[normalizedEmail]) {
        registeredUser = demoAccounts[normalizedEmail];
      }
    }

    if (!registeredUser) {
      const error = new Error("ACCOUNT_NOT_REGISTERED");
      error.code = "ACCOUNT_NOT_REGISTERED";
      throw error;
    }

    if (String(registeredUser.password || "") !== String(password || "")) {
      const error = new Error("INVALID_CREDENTIALS");
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const frontendRole =
      registeredUser.role ||
      normalizeBackendRoleToFrontend(
        registeredUser.backendRole || roleOverride || "Citizen"
      );
    const bRole =
      registeredUser.backendRole || normalizeFrontendRoleToBackend(frontendRole);
    const displayName =
      registeredUser.name || name || normalizedEmail.split("@")[0] || "User";

    const newUser = {
      ...registeredUser,
      name: displayName,
      email: registeredUser.email || normalizedEmail,
      role: frontendRole,
      backendRole: bRole,
      backend_role: bRole,
      level:
        registeredUser.level ||
        (frontendRole === "Government" ? "STATE" : undefined),
      isLoggedIn: true,
      isRegistered: true,
      first_name: registeredUser.first_name || displayName.split(" ")[0] || "",
      last_name:
        registeredUser.last_name ||
        displayName.split(" ").slice(1).join(" "),
      phone: registeredUser.phone || "",
      organization: registeredUser.organization || "",
      district: registeredUser.district || "",
    };

    setUser(newUser);
    showToast(`Logged in successfully as ${newUser.role}!`, "success");
    return newUser;
  };

  /*
   * ============================================================
   * SIGNUP  –  MongoDB-primary backend
   * Calls the correct registration endpoint based on role.
   * Falls back to localStorage only if backend is unreachable.
   * ============================================================
   */
  const signup = async (
    name,
    email,
    password,
    role = "Citizen",
    metadata = {}
  ) => {
    const frontendRole = normalizeBackendRoleToFrontend(role);
    const backendRole = normalizeFrontendRoleToBackend(frontendRole);
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const nameParts = String(name || "").trim().split(/\s+/);
    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ");

    // ── 1. Try the Django / MongoDB backend ──────────────────────
    try {
      let data;

      const basePayload = {
        fullName: name,
        name,
        email: normalizedEmail,
        password,
        confirmPassword: password,
        district: metadata?.district || "Ranchi",
        phone: metadata?.phone || metadata?.contactNumber || "",
        location: metadata?.location || "",
        ...metadata,
      };

      if (frontendRole === "Citizen") {
        data = await authService.registerCitizen(basePayload);
      } else if (frontendRole === "University") {
        data = await authService.registerUniversity({
          ...basePayload,
          universityName: metadata?.universityName || name,
          officialEmail: normalizedEmail,
          contactPerson: metadata?.contactPerson || name,
        });
      } else if (frontendRole === "Industry") {
        data = await authService.registerIndustry({
          ...basePayload,
          companyName: metadata?.companyName || name,
          officialEmail: normalizedEmail,
          contactPerson: metadata?.contactPerson || name,
        });
      } else if (frontendRole === "Government") {
        data = await authService.registerGovernment({
          ...basePayload,
          fullName: name,
          officialEmail: normalizedEmail,
        });
      } else {
        data = await authService.registerCitizen(basePayload);
      }

      // Cache in localStorage so offline fallback works after registration
      const newUser = {
        name: String(name || "").trim(),
        email: normalizedEmail,
        role: frontendRole,
        backendRole,
        backend_role: backendRole,
        username: normalizedEmail,
        first_name: firstName,
        last_name: lastName,
        phone: metadata?.phone || "",
        organization: metadata?.organization || "",
        district: metadata?.district || "",
        password: String(password || ""),
        ...metadata,
        isRegistered: true,
        isLoggedIn: false,
        backendId: data?.id || data?.user?.id || null,
      };

      let registeredUsers = [];
      try {
        const saved = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
        registeredUsers = saved ? JSON.parse(saved) : [];
      } catch (_) {}
      if (!Array.isArray(registeredUsers)) registeredUsers = [];

      const alreadyExists = registeredUsers.some(
        (u) => String(u?.email || "").trim().toLowerCase() === normalizedEmail
      );
      if (!alreadyExists) {
        localStorage.setItem(
          REGISTERED_USERS_STORAGE_KEY,
          JSON.stringify([...registeredUsers, newUser])
        );
      }

      return newUser;
    } catch (apiError) {
      // Explicit backend rejection (duplicate email, validation error etc.) → re-throw
      const status = apiError?.response?.status;
      if (status === 400 || status === 409) {
        const errData = apiError.response.data;
        const msg =
          errData?.error ||
          errData?.detail ||
          errData?.message ||
          errData?.email?.[0] ||
          "Registration failed. Please check your details.";
        const err = new Error(msg);
        err.code =
          errData?.code || errData?.error_code || "ACCOUNT_ALREADY_EXISTS";
        err.serverError = errData;
        throw err;
      }

      // Server down → fallback to localStorage-only registration
      console.warn("[Auth] Backend unreachable, registering locally:", apiError.message);
    }

    // ── 2. Offline / local fallback ──────────────────────────────
    let registeredUsers = [];
    try {
      const saved = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
      registeredUsers = saved ? JSON.parse(saved) : [];
    } catch (_) {
      registeredUsers = [];
    }

    if (
      Array.isArray(registeredUsers) &&
      registeredUsers.some(
        (item) =>
          String(item?.email || "").trim().toLowerCase() === normalizedEmail
      )
    ) {
      const error = new Error("ACCOUNT_ALREADY_EXISTS");
      error.code = "ACCOUNT_ALREADY_EXISTS";
      throw error;
    }

    const newUser = {
      name: String(name || "").trim(),
      email: normalizedEmail,
      role: frontendRole,
      backendRole,
      backend_role: backendRole,
      username: normalizedEmail,
      first_name: firstName,
      last_name: lastName,
      phone: "",
      organization: "",
      district: metadata?.district || "",
      password: String(password || ""),
      ...metadata,
      isRegistered: true,
      isLoggedIn: false,
    };

    localStorage.setItem(
      REGISTERED_USERS_STORAGE_KEY,
      JSON.stringify([...(Array.isArray(registeredUsers) ? registeredUsers : []), newUser])
    );

    return newUser;
  };

  const logout = () => {
    sessionStorage.setItem(
      LOGOUT_REDIRECT_KEY,
      "1"
    );

    setUser(null);
    setUserProblems([]);

    AUTH_SESSION_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    localStorage.removeItem("solvesphere_user_problems");

    showToast(
      "Logged out successfully.",
      "info"
    );
  };

  const updateUser = (updatedFields = {}) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        ...updatedFields,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  /*
   * ============================================================
   * ADD PROBLEM  –  MongoDB-primary backend
   * POSTs to /api/citizen/problems/ and enriches local state with
   * the server-assigned ID, urgency_score and priority.
   * Falls back to local-only if backend is unreachable.
   * ============================================================
   */
  const addProblem = async (problemData = {}) => {
    const backendPayload = createBackendChallengePayload(problemData, user);

    // ── 1. Try backend first ──────────────────────────────────────
    let backendResult = null;
    try {
      backendResult = await citizenService.reportProblem({
        title: problemData.title || "Reported Community Problem",
        description: problemData.description || "",
        category: backendPayload.category || "Water Management",
        district: problemData.district || user?.district || "Ranchi",
        block: problemData.block || "",
        village: problemData.village || "",
        pin_code: problemData.pin_code || "",
        latitude: problemData.latitude ?? 23.3441,
        longitude: problemData.longitude ?? 85.3096,
        citizen_name: user?.name || user?.first_name || "",
      });
    } catch (err) {
      console.warn("[AddProblem] Backend unreachable, using local state:", err.message);
    }

    // ── 2. Build the local problem object ──────────────────────────
    const generatedId =
      backendResult?.id ||
      backendResult?.problem_id ||
      problemData.id ||
      `SS-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newProblem = {
      id: generatedId,
      title: problemData.title || "Reported Community Problem",
      location:
        problemData.location ||
        problemData.address ||
        [problemData.city, problemData.state].filter(Boolean).join(", ") ||
        "District Area",
      category: problemData.category || "General Issue",
      backendCategory: backendPayload.category,
      description: problemData.description || "",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: problemData.status || "Under AI Analysis",
      backendStatus: normalizeChallengeStatusToBackend(
        problemData.status || "Under AI Analysis"
      ),
      statusStyle: "bg-amber-50 text-amber-600 border border-amber-200",
      priority:
        backendResult?.priority ||
        problemData.priority ||
        "High",
      urgency_score: Number(
        backendResult?.urgency_score ??
          problemData.urgency_score ??
          problemData.severity_score ??
          0
      ),
      affected: problemData.estimatedImpact
        ? `${problemData.estimatedImpact} People`
        : "Community Residents",
      submittedByRole: user?.role || "Citizen",
      submittedByBackendRole:
        user?.backendRole ||
        normalizeFrontendRoleToBackend(user?.role || "Citizen"),
      district: problemData.district || user?.district || "",
      block: problemData.block || "",
      latitude: problemData.latitude ?? null,
      longitude: problemData.longitude ?? null,
      coordinates:
        problemData.latitude !== undefined && problemData.longitude !== undefined
          ? [Number(problemData.longitude), Number(problemData.latitude)]
          : null,
      isAnonymous: Boolean(problemData.isAnonymous),
      media_urls: backendPayload.media_urls,
      assigned_university: problemData.assigned_university || "",
      backendPayload,
      savedToMongoDB: !!backendResult,
    };

    updateProblemLifecycle(newProblem.id, newProblem);

    setUserProblems((prev) => [newProblem, ...prev]);
    showToast("Problem submitted and sent for AI analysis!", "success");
    return newProblem;
  };

  /*
   * ============================================================
   * GOVERNMENT VALIDATION & UNIVERSITY ASSIGNMENT
   * ============================================================
   *
   * Citizen Problem
   *       ↓
   * AI Analysis
   *       ↓
   * Government Review & Approval
   *       ↓
   * Assign to University with Domain Expertise
   *       ↓
   * Active Innovation Workspace & Impact Delivery
   */

  const approveCitizenProblemAsChallenge = (
    problemId,
    options = {}
  ) => {
    const targetProblem =
      userProblems.find(
        (p) => p.id === problemId
      );

    const assignedUni = options.assignedUniversity || "Ranchi University";
    const assignedDept = options.department || "Department of Research & Innovation";

    const updates = {
      status: `Assigned to ${assignedUni}`,
      backendStatus: "ASSIGNED_TO_HEI",
      assignedUniversity: assignedUni,
      assignedDepartment: assignedDept,
      targetDays: options.targetDays || 60,
      grantAmount: options.grantAmount || "₹ 15,00,000",
      validatedBy: "Government / Admin",
      validatedAt: new Date().toISOString(),
      governmentApprovedAt: new Date().toISOString(),
      progress: 25,
      statusStyle: "bg-blue-50 text-blue-700 border border-blue-200",
      title: targetProblem?.title || options.title || "Civic Challenge",
      description: targetProblem?.description || options.description || "",
      category: targetProblem?.category || options.category || "Water & Sanitation",
      location: targetProblem?.location || options.location || targetProblem?.district || "Jharkhand",
      district: targetProblem?.district || options.district || "Jharkhand",
      priority: targetProblem?.priority || options.priority || "High",
    };

    updateProblemLifecycle(problemId, updates);

    setUserProblems((prev) =>
      prev.map((p) =>
        p.id === problemId
          ? {
              ...p,
              ...updates,
              backendPayload: createBackendChallengePayload(
                {
                  ...p,
                  ...updates,
                },
                user
              ),
            }
          : p
      )
    );

    /*
     * Sync approved challenge with existing Admin portal.
     * This is local frontend synchronization only.
     */
    try {
      const savedAdminData =
        localStorage.getItem(
          ADMIN_STORAGE_KEY
        );

      let adminObj = savedAdminData
        ? JSON.parse(savedAdminData)
        : {
            challenges: [],
          };

      if (!adminObj.challenges) {
        adminObj.challenges = [];
      }

      const challengeExists =
        adminObj.challenges.some(
          (challenge) =>
            challenge.sourceProblemId ===
            targetProblem.id
        );

      if (!challengeExists) {
        const numericId =
          String(
            targetProblem.id
          ).replace(/[^0-9]/g, "");

        const newActiveChallenge = {
          id:
            numericId
              ? `CH-${numericId}`
              : `CH-${Math.floor(
                  8000 +
                    Math.random() * 1000
                )}`,

          sourceProblemId:
            targetProblem.id,

          title:
            targetProblem.title,

          submittedBy:
            `Citizen Report (${targetProblem.location})`,

          category:
            targetProblem.category ||
            "Community Impact",

          backendCategory:
            targetProblem.backendCategory ||
            normalizeCategoryToBackend(
              targetProblem.category
            ),

          location:
            targetProblem.location,

          district:
            targetProblem.district ||
            "",

          latitude:
            targetProblem.latitude ??
            null,

          longitude:
            targetProblem.longitude ??
            null,

          date:
            new Date()
              .toISOString()
              .split("T")[0],

          priority:
            targetProblem.priority ||
            "High",

          urgency_score:
            targetProblem.urgency_score ||
            0,

          /*
           * Existing UI status.
           */
          status: "Active",

          /*
           * Backend status.
           */
          backendStatus:
            "OPEN",

          progress: 15,

          deadline: "2026-12-31",

          participants: 0,

          teams: 0,

          proposalsCount: 0,

          upvotes: 0,

          description:
            targetProblem.description ||
            "Citizen submitted problem approved by Government and published as an active challenge.",

          validationStatus:
            "Government Approved",

          universityStatus:
            "Open for University Acceptance",

          assigned_university:
            "",

          media_urls:
            targetProblem.media_urls ||
            [],

          backendPayload:
            createBackendChallengePayload(
              {
                ...targetProblem,

                status:
                  "Approved as Active Challenge",
              },
              user
            ),
        };

        adminObj.challenges = [
          newActiveChallenge,
          ...adminObj.challenges,
        ];

        localStorage.setItem(
          ADMIN_STORAGE_KEY,
          JSON.stringify(adminObj)
        );
      }
    } catch (e) {
      console.error(
        "Failed to sync with AdminContext challenges:",
        e
      );
    }

    showToast(
      `Problem ${problemId} approved by Government and published as an Active Challenge!`,
      "success"
    );
  };

  const rejectCitizenProblem = (
    problemId,
    options = {}
  ) => {
    const reason = options.reason || options.rejectionReason || "Rejected during administrative scrutiny";
    const updates = {
      status: "Rejected by Government",
      backendStatus: "REJECTED",
      rejectionReason: reason,
      rejectedAt: new Date().toISOString(),
      validatedBy: "Government / Admin",
      validatedAt: new Date().toISOString(),
      statusStyle: "bg-red-50 text-red-600 border border-red-200",
    };

    updateProblemLifecycle(problemId, updates);

    setUserProblems((prev) =>
      prev.map((p) =>
        p.id === problemId
          ? {
              ...p,
              ...updates,
            }
          : p
      )
    );

    showToast(
      `Problem ${problemId} rejected by Government.`,
      "info"
    );
  };

  /*
   * ============================================================
   * CONTEXT
   * ============================================================
   */
  return (
    <AuthContext.Provider
      value={{
        user,

        userProblems,

        toasts,

        login,

        signup,

        logout,

        updateUser,

        addProblem,

        approveCitizenProblemAsChallenge,

        rejectCitizenProblem,

        showToast,

        /*
         * Backend compatibility helpers are exposed
         * so other frontend files can use the same
         * mapping instead of duplicating logic.
         */
        normalizeBackendUser,

        normalizeBackendRoleToFrontend,

        normalizeFrontendRoleToBackend,

        normalizeCategoryToBackend,

        normalizeCategoryToFrontend,

        normalizeChallengeStatusToFrontend,

        normalizeChallengeStatusToBackend,

        createBackendUserPayload,

        createBackendChallengePayload,

        normalizeBackendChallenge,

        /*
         * Convenient authentication information.
         */
        isAuthenticated:
          !!user &&
          user.isLoggedIn,

        backendRole:
          user?.backendRole ||
          normalizeFrontendRoleToBackend(
            user?.role
          ),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};