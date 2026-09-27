export const getDashboardPathForRole = (roleOrUser, levelArg = null) => {
  let userObj = typeof roleOrUser === "object" && roleOrUser !== null ? roleOrUser : null;

  // If only string role was passed without level, attempt reading stored active user
  if (!userObj && (!levelArg || typeof levelArg !== "string")) {
    try {
      const savedUserStr = localStorage.getItem("solvesphere_auth_user");
      if (savedUserStr) {
        userObj = JSON.parse(savedUserStr);
      }
    } catch (e) {
      // ignore
    }
  }

  const role = userObj ? userObj.role || userObj.backendRole || userObj.backend_role : roleOrUser;
  const level = levelArg || (userObj ? userObj.level || userObj.dashboard_type || userObj.profile?.level : null);

  const normalizedRole = String(role || "").toLowerCase();

  if (
    normalizedRole === "government" ||
    normalizedRole === "govt_admin" ||
    normalizedRole === "government_admin" ||
    normalizedRole === "government admin"
  ) {
    if (String(level || "").toUpperCase() === "STATE") {
      return "/state/dashboard";
    }
    return "/district/dashboard";
  }

  switch (normalizedRole) {
    case "government":
    case "govt_admin":
    case "government_admin":
    case "government admin":
      return String(level || "").toUpperCase() === "STATE" ? "/state/dashboard" : "/district/dashboard";
    case "university":
    case "student":
    case "faculty":
      return "/university-dashboard";
    case "ngo":
      return "/ngo-dashboard";
    case "industry":
    case "csr_partner":
      return "/industry-dashboard";
    default:
      return "/citizen-dashboard";
  }
};

const publicAuthPaths = new Set(["/", "/login", "/signup", "/admin-login"]);

export const getSafePostAuthRedirect = (redirectTarget, roleOrUser, level) => {
  if (
    typeof redirectTarget === "string" &&
    redirectTarget.startsWith("/") &&
    !redirectTarget.startsWith("//") &&
    !publicAuthPaths.has(redirectTarget)
  ) {
    return redirectTarget;
  }

  return getDashboardPathForRole(roleOrUser, level);
};
