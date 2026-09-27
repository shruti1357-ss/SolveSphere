import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPathForRole } from "../../utils/authRoutes";

const LOGOUT_REDIRECT_KEY = "solvesphere_logout_redirect";

const getRoleVariants = (role) => {
  const normalized = String(role || "").toUpperCase();

  switch (normalized) {
    case "CITIZEN":
      return ["Citizen", "CITIZEN"];

    case "STUDENT":
      return [
        "University",
        "STUDENT",
        "University Student",
        "Student",
      ];

    case "FACULTY":
      return [
        "University",
        "FACULTY",
        "Faculty",
      ];

    case "GOVT_ADMIN":
    case "GOVERNMENT_ADMIN":
    case "GOVERNMENT":
    case "GOVERNMENT ADMIN":
      return [
        "Government",
        "GOVT_ADMIN",
        "GOVERNMENT_ADMIN",
        "Government Admin",
      ];

    case "CSR_PARTNER":
    case "INDUSTRY":
      return [
        "Industry",
        "CSR_PARTNER",
        "INDUSTRY",
      ];

    case "NGO":
      return ["NGO"];

    case "UNIVERSITY":
      return [
        "University",
        "STUDENT",
        "FACULTY",
        "University Student",
        "Student",
      ];

    default:
      return [role, normalized];
  }
};

const isRoleAllowed = (
  userRole,
  allowedRoles
) => {
  if (
    !allowedRoles ||
    allowedRoles.length === 0
  ) {
    return true;
  }

  const userRoleVariants =
    getRoleVariants(userRole);

  return allowedRoles.some((allowedRole) => {
    const allowedRoleVariants =
      getRoleVariants(allowedRole);

    return allowedRoleVariants.some(
      (variant) =>
        userRoleVariants.includes(variant)
    );
  });
};

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  if (!isAuthenticated) {
    if (
      sessionStorage.getItem(
        LOGOUT_REDIRECT_KEY
      )
    ) {
      sessionStorage.removeItem(
        LOGOUT_REDIRECT_KEY
      );

      return (
        <Navigate
          to="/"
          replace
        />
      );
    }

    const redirectPath =
      `${location.pathname}${location.search}`;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(
          redirectPath
        )}`}
        replace
      />
    );
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !isRoleAllowed(
      user?.role ||
        user?.backendRole ||
        user?.backend_role,
      allowedRoles
    )
  ) {
    const dashboardPath = getDashboardPathForRole(user);

    return (
      <Navigate
        to={dashboardPath || "/"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;