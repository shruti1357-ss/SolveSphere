import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  ShieldCheck,
  Bell,
  LockKeyhole,
  Mail,
  CheckCircle2,
  Building2,
  Phone,
  KeyRound,
  Sliders,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  Globe,
  Users,
  FileCheck,
  AlertCircle
} from "lucide-react";
import Sidebar from "../../components/citizen-dashboard/Sidebar";
import Topbar from "../../components/citizen-dashboard/Topbar";
import { useAuth } from "../../context/AuthContext";
import { getUniversityProfile } from "../../utils/universityProfileUtils";

const DEFAULT_SETTINGS = {
  // Identity & Contact
  officialEmail: "admin@ranchiuniversity.ac.in",
  contactPhone: "+91 651 220 8555",
  departmentLead: "Dr. R. K. Sharma (Dean of Research)",
  aisheCode: "U-0428",
  
  // Security
  currentPassword: "password123",
  newPassword: "",
  confirmPassword: "",
  twoFactorAuth: true,
  sessionTimeout: "30",

  // Notifications
  notifyGovAssignments: true,
  notifyCollabRequests: true,
  notifyResearchUpdates: true,
  notifyWeeklyDigest: true,
  notifyEmailAlerts: true,
  notifyBrowserPush: false,

  // Portal & Collaboration
  publicProfileVisible: true,
  autoMatchDomains: true,
  defaultWorkspaceView: "grid",
};

export default function UniversitySettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const profile = getUniversityProfile(user) || {};

  const userKey = String(
    user?.organization || user?.university || profile?.name || user?.name || user?.email || "university"
  ).trim().toLowerCase();

  const storageKey = `solvesphere_university_settings_${userKey}`;

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return {
      ...DEFAULT_SETTINGS,
      officialEmail: user?.email || profile?.email || DEFAULT_SETTINGS.officialEmail,
      contactPhone: profile?.phone || DEFAULT_SETTINGS.contactPhone,
      aisheCode: profile?.code || DEFAULT_SETTINGS.aisheCode,
    };
  });

  const [activeTab, setActiveTab] = useState("all");
  const [showPassword, setShowPassword] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState("");

  const universityName = profile?.name || user?.organization || user?.university || user?.name || "Ranchi University";

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPasswordNotice("");

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setPasswordNotice("New password must be at least 6 characters.");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setPasswordNotice("New passwords do not match.");
        return;
      }
      // Update current password and clear fields
      formData.currentPassword = formData.newPassword;
      formData.newPassword = "";
      formData.confirmPassword = "";
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(formData));
      localStorage.setItem("solvesphere_university_settings", JSON.stringify(formData));
    } catch {
      // ignore
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("solvesphere_university_updated"));
  };

  const handleReset = () => {
    const resetValues = {
      ...DEFAULT_SETTINGS,
      officialEmail: user?.email || profile?.email || DEFAULT_SETTINGS.officialEmail,
    };
    setFormData(resetValues);
    localStorage.setItem(storageKey, JSON.stringify(resetValues));
    setPasswordNotice("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="ml-0 lg:ml-64">
        <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="w-full space-y-6 px-4 py-6 sm:px-6 lg:p-8">
          {/* Header matching standard My Workspace style */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
              Account Control
            </span>

            <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
              Settings
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Manage university portal preferences, security credentials, and notification controls.
            </p>
          </motion.div>

          {/* Save notification feedback */}
          {savedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3.5 text-blue-800 shadow-sm"
            >
              <div className="flex items-center gap-2.5 text-sm font-bold">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Settings updated and saved successfully!
              </div>
              <button
                type="button"
                onClick={() => setSavedSuccess(false)}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {passwordNotice && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-xs font-bold text-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              {passwordNotice}
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { id: "all", label: "All Settings" },
                { id: "security", label: "Account & Security" },
                { id: "notifications", label: "Notifications" },
                { id: "collaboration", label: "Portal & Collaboration" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                <RotateCcw size={14} />
                Reset Defaults
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition"
              >
                <Save size={14} />
                Save Settings
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {/* Account & Security Card */}
              {(activeTab === "all" || activeTab === "security") && (
                <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                      <ShieldCheck size={20} className="text-blue-600" />
                      Account & Security
                    </h2>
                    <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[10px] font-bold text-blue-700">
                      OFFICIAL PORTAL
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* University Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Registered University
                      </label>
                      <div className="relative mt-1">
                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          disabled
                          value={universityName}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-700 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Official University Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Official University Email
                      </label>
                      <div className="relative mt-1">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={formData.officialEmail}
                          onChange={(e) => handleChange("officialEmail", e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Portal Password */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Portal Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                        >
                          {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      <div className="relative mt-1">
                        <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) => handleChange("currentPassword", e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Change Password fields */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600">
                          New Password (optional)
                        </label>
                        <input
                          type="password"
                          placeholder="Leave blank to keep"
                          value={formData.newPassword}
                          onChange={(e) => handleChange("newPassword", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Re-enter new password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange("confirmPassword", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* 2FA & Session Timeout */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
                          <p className="text-[11px] text-slate-500">Require OTP verification on university login</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggle("twoFactorAuth")}
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            formData.twoFactorAuth ? "bg-blue-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                              formData.twoFactorAuth ? "left-6" : "left-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-2.5">
                        <label className="text-xs font-bold text-slate-800">
                          Inactivity Session Timeout
                        </label>
                        <select
                          value={formData.sessionTimeout}
                          onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 outline-hidden focus:border-blue-500"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">60 minutes</option>
                          <option value="240">4 hours</option>
                        </select>
                      </div>
                    </div>

                    {/* Verification Status Banner */}
                    <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/80 px-3.5 py-3 text-xs font-bold text-blue-800">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>University account verified by State Higher Education Department.</span>
                    </div>
                  </div>
                </section>
              )}

              {/* Notifications Card */}
              {(activeTab === "all" || activeTab === "notifications") && (
                <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                      <Bell size={20} className="text-blue-600" />
                      Notifications & Alerts
                    </h2>
                    <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[10px] font-bold text-blue-700">
                      REAL-TIME
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      {
                        key: "notifyGovAssignments",
                        title: "Government Challenge Assignments",
                        desc: "Get notified immediately when the state administration assigns a new civic challenge.",
                      },
                      {
                        key: "notifyCollabRequests",
                        title: "Industry Collaboration Proposals",
                        desc: "Receive alerts when verified industry partners request R&D collaborations on your projects.",
                      },
                      {
                        key: "notifyResearchUpdates",
                        title: "Research & Publication Citations",
                        desc: "Alerts on paper reviews, co-authorship approvals, and institutional citations.",
                      },
                      {
                        key: "notifyEmailAlerts",
                        title: "Email Digest & Urgent Alerts",
                        desc: "Send critical deadlines, submissions, and acceptance emails to the official address.",
                      },
                      {
                        key: "notifyWeeklyDigest",
                        title: "Weekly Telemetry & Progress Summary",
                        desc: "Weekly executive briefing of challenge completion metrics and milestone tracking.",
                      },
                    ].map((item) => {
                      const isChecked = formData[item.key];
                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 hover:bg-slate-50 transition"
                        >
                          <div className="pr-3">
                            <p className="text-xs font-bold text-slate-800">{item.title}</p>
                            <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggle(item.key)}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                              isChecked ? "bg-blue-600" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                                isChecked ? "left-6" : "left-1"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Portal & Collaboration Preferences Section */}
            {(activeTab === "all" || activeTab === "collaboration") && (
              <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                    <Sliders size={20} className="text-blue-600" />
                    Portal & Institutional Collaboration Preferences
                  </h2>
                  <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[10px] font-bold text-blue-700">
                    PREFERENCES
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                    <div className="pr-3">
                      <p className="text-xs font-bold text-slate-800">Public Institutional Profile</p>
                      <p className="mt-1 text-[11px] text-slate-500">Allow verified industry enterprises to view faculty expertise and research publications.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle("publicProfileVisible")}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        formData.publicProfileVisible ? "bg-blue-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                          formData.publicProfileVisible ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                    <div className="pr-3">
                      <p className="text-xs font-bold text-slate-800">Domain Match Pre-Screening</p>
                      <p className="mt-1 text-[11px] text-slate-500">Automatically filter and recommend civic challenges aligned with institutional departments.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle("autoMatchDomains")}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        formData.autoMatchDomains ? "bg-blue-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                          formData.autoMatchDomains ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Bottom Save Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                All settings are securely stored and synced across active portal sessions.
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition"
              >
                <Save size={16} />
                Save Settings
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
