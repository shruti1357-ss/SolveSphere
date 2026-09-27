import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";

import ProtectedRoute from "./components/authentication/ProtectedRoute";

import LandingPage from "./Pages/LandingPage";
import ImpactDashboard from "./Pages/ImpactDashboard";
import ImpactDetailsPage from "./Pages/ImpactDetailsPage";
import LoginForm from "./components/authentication/LoginForm";
import SignupForm from "./components/authentication/SignupForm";

import CitizenDashboard from "./Pages/CitizenDashboard";
import CitizenProblemsPage from "./Pages/CitizenProblemsPage";
import CitizenProfilePage from "./Pages/CitizenProfilePage";
import RoleDashboardPage from "./Pages/RoleDashboardPage";
import UniversityDashboardPage from "./Pages/university/UniversityDashboardPage";
import UniversityChallengesPage from "./Pages/university/UniversityChallengesPage";
import UniversityResearchPublicationsPage from "./Pages/university/UniversityResearchPublicationsPage";
import UniversityReportsAnalyticsPage from "./Pages/university/UniversityReportsAnalyticsPage";
import UniversityNotificationsPage from "./Pages/university/UniversityNotificationsPage";
import UniversitySettingsPage from "./Pages/university/UniversitySettingsPage";

import Challenges from "./Pages/Challenges";
import ChallengeDetails from "./Pages/ChallengeDetails";
import ChallengeJoined from "./Pages/ChallengeJoined";
import TeamSetup from "./Pages/TeamSetup";

import MyWorkspace from "./Pages/MyWorkspace";
import TeamWorkspace from "./Pages/TeamWorkspace";

import ReportProblemPage from "./Pages/ReportProblemPage";
import ReportMethodPage from "./Pages/ReportMethodPage";
import VoiceReportPage from "./Pages/VoiceReportPage";
import GovernmentSignupPage from "./Pages/GovernmentSignupPage";

// Industry Portal Components
import IndustryDashboard from "./Pages/industry/IndustryDashboard";
import IndustryProfilePage from "./Pages/industry/IndustryProfilePage";
import RecommendedProjectsPage from "./Pages/industry/RecommendedProjectsPage";
import IndustryProjectDetailsPage from "./Pages/industry/IndustryProjectDetailsPage";
import MyCollaborationsPage from "./Pages/industry/MyCollaborationsPage";
import CollaborationWorkspacePage from "./Pages/industry/CollaborationWorkspacePage";
import IndustryReportsComplaintsPage from "./Pages/industry/IndustryReportsComplaintsPage";
import IndustryUniversitiesExpertsPage from "./Pages/industry/IndustryUniversitiesExpertsPage";
import IndustryDistrictManagementPage from "./Pages/industry/IndustryDistrictManagementPage";
import IndustryAnalyticsReportsPage from "./Pages/industry/IndustryAnalyticsReportsPage";
import IndustryNotificationsPage from "./Pages/industry/IndustryNotificationsPage";
import IndustrySettingsPage from "./Pages/industry/IndustrySettingsPage";

// University Collaboration Component
import UniversityCollaborationRequestsPage from "./Pages/university/UniversityCollaborationRequestsPage";
import UniversityProfilePage from "./Pages/university/UniversityProfilePage";
import UniversityMyProjectsPage from "./Pages/university/UniversityMyProjectsPage";

// Government Admin Portal Components
import GovtLoginPage from "./Pages/admin/GovtLoginPage";
import DashboardLayout from "./components/admin/DashboardLayout";
import GovernmentDashboard from "./Pages/admin/GovernmentDashboard";
import AllChallengesPage from "./Pages/admin/AllChallengesPage";
import PendingScrutinyPage from "./Pages/admin/PendingScrutinyPage";
import ApprovedChallengesPage from "./Pages/admin/ApprovedChallengesPage";
import AssignedChallengesPage from "./Pages/admin/AssignedChallengesPage";
import ActiveChallengesPage from "./Pages/admin/ActiveChallengesPage";
import CompletedChallengesPage from "./Pages/admin/CompletedChallengesPage";
import ProposalsSolutionsPage from "./Pages/admin/ProposalsSolutionsPage";
import SolutionsPage from "./Pages/admin/SolutionsPage";
import LiveTrackingPage from "./Pages/admin/LiveTrackingPage";
import PartnersStakeholdersPage from "./Pages/admin/PartnersStakeholdersPage";
import ReportsAnalyticsPage from "./Pages/admin/ReportsAnalyticsPage";
import SettingsPage from "./Pages/admin/SettingsPage";
import HelpSupportPage from "./Pages/admin/HelpSupportPage";
import GovernmentSectionPage from "./Pages/admin/GovernmentSectionPage";

// New State Government Portal Components
import StateDashboardLayout from "./components/state/StateDashboardLayout";
import StateGovernmentDashboard from "./Pages/state/StateGovernmentDashboard";
import StateAllDistrictsPage from "./Pages/state/StateAllDistrictsPage";
import StateCitizenReportsPage from "./Pages/state/StateCitizenReportsPage";
import StateEarlyWarningsPage from "./Pages/state/StateEarlyWarningsPage";
import StateOrgVerificationPage from "./Pages/state/StateOrgVerificationPage";
import StateChallengesPage from "./Pages/state/StateChallengesPage";
import StateUniversitiesPartnersPage from "./Pages/state/StateUniversitiesPartnersPage";
import StateIndustryCSRPage from "./Pages/state/StateIndustryCSRPage";
import StateAnalyticsPage from "./Pages/state/StateAnalyticsPage";
import StateReportsPage from "./Pages/state/StateReportsPage";
import StateSettingsPage from "./Pages/state/StateSettingsPage";
import { useAuth } from "./context/AuthContext";

function GovtDashboardRedirect() {
  const { user } = useAuth();
  const normalizedRole = String(user?.role || user?.backendRole || user?.backend_role || "").toLowerCase();
  if (normalizedRole.includes("gov")) {
    if (String(user?.level || "").toUpperCase() === "STATE") {
      return <Navigate to="/state/dashboard" replace />;
    }
    return <Navigate to="/district/dashboard" replace />;
  }
  return <Navigate to="/district/dashboard" replace />;
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            {/* =========================================================
                MAIN LANDING & AUTHENTICATION
            ========================================================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/impact" element={<ImpactDashboard />} />
            <Route path="/impact/:id" element={<ImpactDetailsPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/government-signup" element={<GovernmentSignupPage />} />
            <Route path="/admin-login" element={<GovtLoginPage />} />

            {/* =========================================================
                PROBLEM REPORTING
                Accessible to all authenticated roles
            ========================================================= */}
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportMethodPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report/manual"
              element={
                <ProtectedRoute>
                  <ReportProblemPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report/voice"
              element={
                <ProtectedRoute>
                  <VoiceReportPage />
                </ProtectedRoute>
              }
            />

            {/* =========================================================
                CITIZEN DASHBOARD
            ========================================================= */}
            <Route
              path="/citizen-dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["Citizen", "CITIZEN"]}
                >
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/citizen-dashboard/problems"
              element={
                <ProtectedRoute
                  allowedRoles={["Citizen", "CITIZEN"]}
                >
                  <CitizenProblemsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/citizen-dashboard/profile"
              element={
                <ProtectedRoute
                  allowedRoles={["Citizen", "CITIZEN"]}
                >
                  <CitizenProfilePage />
                </ProtectedRoute>
              }
            />

            {/* =========================================================
                UNIVERSITY DASHBOARD
                Frontend role:
                University / University Student / Student

                Backend roles:
                STUDENT / FACULTY
            ========================================================= */}
            <Route
              path="/university-dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "University",
                    "University Student",
                    "Student",
                    "STUDENT",
                    "FACULTY",
                  ]}
                >
                  <UniversityDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/university-dashboard/challenges"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "University",
                    "University Student",
                    "Student",
                    "STUDENT",
                    "FACULTY",
                  ]}
                >
                  <UniversityChallengesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/university-dashboard/research-publications"
              element={
                <ProtectedRoute allowedRoles={["University", "University Student", "Student", "STUDENT", "FACULTY"]}>
                  <UniversityResearchPublicationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/university-dashboard/reports-analytics"
              element={
                <ProtectedRoute allowedRoles={["University", "University Student", "Student", "STUDENT", "FACULTY"]}>
                  <UniversityReportsAnalyticsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/university-dashboard/notifications"
              element={
                <ProtectedRoute allowedRoles={["University", "University Student", "Student", "STUDENT", "FACULTY"]}>
                  <UniversityNotificationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/university-dashboard/settings"
              element={
                <ProtectedRoute allowedRoles={["University", "University Student", "Student", "STUDENT", "FACULTY"]}>
                  <UniversitySettingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/university-dashboard/my-projects"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "University",
                    "University Student",
                    "Student",
                    "STUDENT",
                    "FACULTY",
                  ]}
                >
                  <UniversityMyProjectsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/university-dashboard/problems"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "University",
                    "University Student",
                    "Student",
                    "STUDENT",
                    "FACULTY",
                  ]}
                >
                  <CitizenProblemsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/university-dashboard/profile"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "University",
                    "University Student",
                    "Student",
                    "STUDENT",
                    "FACULTY",
                  ]}
                >
                  <UniversityProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/university-dashboard/collaboration-requests"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "University",
                    "University Student",
                    "Student",
                    "STUDENT",
                    "FACULTY",
                  ]}
                >
                  <UniversityCollaborationRequestsPage />
                </ProtectedRoute>
              }
            />

            {/* =========================================================
                NGO DASHBOARD
                NGO is kept because it already exists in frontend UI.
                Backend currently does not have a separate NGO role.
            ========================================================= */}
            <Route
              path="/ngo-dashboard"
              element={
                <ProtectedRoute allowedRoles={["NGO"]}>
                  <RoleDashboardPage roleTitle="NGO Social Impact Portal" />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ngo-dashboard/problems"
              element={
                <ProtectedRoute allowedRoles={["NGO"]}>
                  <CitizenProblemsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ngo-dashboard/profile"
              element={
                <ProtectedRoute allowedRoles={["NGO"]}>
                  <CitizenProfilePage />
                </ProtectedRoute>
              }
            />

            {/* =========================================================
                INDUSTRY DASHBOARD

                Frontend role:
                Industry

                Backend role:
                CSR_PARTNER
            ========================================================= */}
            <Route
              path="/industry-dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["Industry", "CSR_PARTNER"]}
                >
                  <IndustryDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/industry-dashboard/profile"
              element={
                <ProtectedRoute
                  allowedRoles={["Industry", "CSR_PARTNER"]}
                >
                  <IndustryProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/industry-dashboard/recommended"
              element={
                <ProtectedRoute
                  allowedRoles={["Industry", "CSR_PARTNER"]}
                >
                  <RecommendedProjectsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/industry-dashboard/projects/:id"
              element={
                <ProtectedRoute
                  allowedRoles={["Industry", "CSR_PARTNER"]}
                >
                  <IndustryProjectDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/industry-dashboard/collaborations"
              element={
                <ProtectedRoute
                  allowedRoles={["Industry", "CSR_PARTNER"]}
                >
                  <MyCollaborationsPage />
                </ProtectedRoute>
              }
            />

            <Route path="/industry-dashboard/reports-complaints" element={<ProtectedRoute allowedRoles={["Industry", "CSR_PARTNER"]}><IndustryReportsComplaintsPage /></ProtectedRoute>} />
            <Route path="/industry-dashboard/universities-experts" element={<ProtectedRoute allowedRoles={["Industry", "CSR_PARTNER"]}><IndustryUniversitiesExpertsPage /></ProtectedRoute>} />
            <Route path="/industry-dashboard/district-management" element={<ProtectedRoute allowedRoles={["Industry", "CSR_PARTNER"]}><IndustryDistrictManagementPage /></ProtectedRoute>} />
            <Route path="/industry-dashboard/analytics" element={<ProtectedRoute allowedRoles={["Industry", "CSR_PARTNER"]}><IndustryAnalyticsReportsPage /></ProtectedRoute>} />
            <Route path="/industry-dashboard/notifications" element={<ProtectedRoute allowedRoles={["Industry", "CSR_PARTNER"]}><IndustryNotificationsPage /></ProtectedRoute>} />
            <Route path="/industry-dashboard/settings" element={<ProtectedRoute allowedRoles={["Industry", "CSR_PARTNER"]}><IndustrySettingsPage /></ProtectedRoute>} />

            {/* =========================================================
                COMMUNITY CHALLENGES
            ========================================================= */}
            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              }
            />

            <Route
              path="/challenges/:id"
              element={
                <ProtectedRoute>
                  <ChallengeDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/challenges/:id/joined"
              element={
                <ProtectedRoute>
                  <ChallengeJoined />
                </ProtectedRoute>
              }
            />

            <Route
              path="/challenges/:id/team"
              element={
                <ProtectedRoute>
                  <TeamSetup />
                </ProtectedRoute>
              }
            />

            {/* =========================================================
                WORKSPACE
            ========================================================= */}
            <Route
              path="/workspace"
              element={
                <ProtectedRoute>
                  <MyWorkspace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/workspace/:teamId"
              element={
                <ProtectedRoute>
                  <TeamWorkspace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/collaboration-workspace/:id"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "University",
                    "University Student",
                    "Student",
                    "STUDENT",
                    "FACULTY",
                    "Industry",
                    "CSR_PARTNER",
                  ]}
                >
                  <CollaborationWorkspacePage />
                </ProtectedRoute>
              }
            />

            {/* =========================================================
                GOVERNMENT ADMIN PORTAL (DISTRICT & LEVEL REDIRECT)
                Frontend role: Government
                Backend role: GOVT_ADMIN
            ========================================================= */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["Government", "GOVT_ADMIN", "GOVERNMENT_ADMIN", "Government Admin"]}>
                  <GovtDashboardRedirect />
                </ProtectedRoute>
              }
            />

            <Route
              path="/citizen-dashboard/reports"
              element={<Navigate to="/citizen-dashboard/problems" replace />}
            />
            <Route
              path="/university-dashboard/projects"
              element={<Navigate to="/university-dashboard/my-projects" replace />}
            />
            <Route
              path="/university-dashboard/publications"
              element={<Navigate to="/university-dashboard/research-publications" replace />}
            />
            <Route
              path="/industry-dashboard/recommended-projects"
              element={<Navigate to="/industry-dashboard/recommended" replace />}
            />
            <Route
              path="/industry-dashboard/challenges"
              element={<Navigate to="/challenges" replace />}
            />

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["Government", "GOVT_ADMIN", "GOVERNMENT_ADMIN", "Government Admin"]}
                >
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/district/dashboard"
                element={<GovernmentDashboard />}
              />

              <Route path="/government/:section" element={<GovernmentSectionPage />} />

              <Route
                path="/challenges/all"
                element={<AllChallengesPage />}
              />
              <Route
                path="/district/all-challenges"
                element={<Navigate to="/challenges/all" replace />}
              />

              <Route
                path="/challenges/pending"
                element={<PendingScrutinyPage />}
              />
              <Route
                path="/district/pending-scrutiny"
                element={<Navigate to="/challenges/pending" replace />}
              />

              <Route
                path="/approved-challenges"
                element={<ApprovedChallengesPage />}
              />

              <Route
                path="/government/assigned-challenges"
                element={<AssignedChallengesPage />}
              />

              <Route
                path="/challenges/active"
                element={<ActiveChallengesPage />}
              />

              <Route
                path="/challenges/completed"
                element={<CompletedChallengesPage />}
              />

              <Route
                path="/proposals"
                element={<ProposalsSolutionsPage />}
              />
              <Route
                path="/district/proposals-solutions"
                element={<Navigate to="/proposals" replace />}
              />

              <Route
                path="/solutions"
                element={<SolutionsPage />}
              />

              <Route
                path="/tracking"
                element={<LiveTrackingPage />}
              />
              <Route
                path="/district/live-tracking"
                element={<Navigate to="/tracking" replace />}
              />

              <Route
                path="/partners"
                element={<PartnersStakeholdersPage />}
              />
              <Route
                path="/district/partners-stakeholders"
                element={<Navigate to="/partners" replace />}
              />

              <Route
                path="/reports"
                element={<ReportsAnalyticsPage />}
              />

              <Route
                path="/settings"
                element={<SettingsPage />}
              />

              <Route
                path="/help"
                element={<HelpSupportPage />}
              />
            </Route>

            {/* =========================================================
                NEW STATE GOVERNMENT PORTAL
            ========================================================= */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["Government", "GOVT_ADMIN", "GOVERNMENT_ADMIN", "Government Admin"]}>
                  <StateDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/state/dashboard" element={<StateGovernmentDashboard />} />
              <Route path="/state/all-districts" element={<StateAllDistrictsPage />} />
              <Route path="/state/district-performance" element={<StateAllDistrictsPage />} />
              <Route path="/state/departments" element={<StateAllDistrictsPage tab="departments" />} />
              <Route path="/state/citizen-reports" element={<StateCitizenReportsPage />} />
              <Route path="/state/problem-reports" element={<StateCitizenReportsPage />} />
              <Route path="/state/ai-review" element={<StateCitizenReportsPage tab="ai-review" />} />
              <Route path="/state/early-warnings" element={<StateEarlyWarningsPage />} />
              <Route path="/state/organization-verification" element={<StateOrgVerificationPage />} />
              <Route path="/state/challenges" element={<StateChallengesPage />} />
              <Route path="/state/approved-challenges" element={<StateChallengesPage />} />
              <Route path="/state/assigned-challenges" element={<StateChallengesPage />} />
              <Route path="/state/solution-tracking" element={<StateChallengesPage tab="tracking" />} />
              <Route path="/state/universities-partners" element={<StateUniversitiesPartnersPage />} />
              <Route path="/state/universities" element={<StateUniversitiesPartnersPage />} />
              <Route path="/state/industry-csr-partners" element={<StateIndustryCSRPage />} />
              <Route path="/state/industry-csr" element={<StateIndustryCSRPage />} />
              <Route path="/state/analytics" element={<StateAnalyticsPage />} />
              <Route path="/state/reports" element={<StateReportsPage />} />
              <Route path="/state/settings" element={<StateSettingsPage />} />
              <Route path="/state/notifications" element={<StateSettingsPage tab="notifications" />} />
            </Route>

            {/* =========================================================
                FALLBACK
            ========================================================= */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;