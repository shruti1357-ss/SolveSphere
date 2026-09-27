import React, { useState } from "react";
import {
  User,
  Bell,
  Sliders,
  Shield,
  Save,
  RotateCcw,
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Radio,
  Settings,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

const SettingsPage = () => {
  const { data, updateSettings, resetToDefaults } = useAdmin();

  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    accountName: data.settings?.accountName || "Government Administrator",
    designation: data.settings?.designation || "District Administration Nodal Officer",
    department: data.settings?.department || "National Urban & Social Innovation Secretariat",
    district: data.settings?.district || "Khunti District, Jharkhand",
    email: data.settings?.email || "admin.portal@gov.in",
    phone: data.settings?.phone || "+91 11 2309 4000",
    officeAddress: data.settings?.officeAddress || "District Collectorate, Khunti - 835210",
    emailNotifications: data.settings?.emailNotifications ?? true,
    weeklyReportDigest: data.settings?.weeklyReportDigest ?? true,
    urgentActionAlerts: data.settings?.urgentActionAlerts ?? true,
    smsAlerts: data.settings?.smsAlerts ?? false,
    autoRefreshInterval: data.settings?.autoRefreshInterval || "5",
    compactTables: data.settings?.compactTables ?? false,
    twoFactorAuth: data.settings?.twoFactorAuth ?? true,
    sessionTimeout: data.settings?.sessionTimeout || "30",
    defaultDistrict: data.settings?.defaultDistrict || "Khunti",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" /> District Administration &amp; Governance
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
            Government Portal Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure system defaults, administrative credentials, notifications, and security preferences.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> District Authority Verified
          </span>
          <button
            type="button"
            onClick={resetToDefaults}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Official Profile Dossier */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#132a4a] text-white font-black text-xl shadow-sm mb-3 border-2 border-blue-100">
                {(formData.accountName || "GA")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase() || "GA"}
              </div>
              <h2 className="text-base font-extrabold text-slate-900">{formData.accountName}</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{formData.designation}</p>
              <span className="inline-flex items-center gap-1 mt-2.5 rounded-full bg-blue-50 px-3 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                <Shield className="w-3 h-3" /> Khunti District Administrator
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Department
                </span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">
                  {formData.department}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Jurisdiction
                </span>
                <span className="font-bold text-slate-800 text-right">{formData.district}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Official Email
                </span>
                <span className="font-bold text-slate-800 text-right font-mono text-[11px]">
                  {formData.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Phone
                </span>
                <span className="font-bold text-slate-800 text-right font-mono text-[11px]">
                  {formData.phone}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" /> Access Tier
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                  Super Admin (Level 2)
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-[#eff6ff] to-white p-4 shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-bold">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>System &amp; Network Health</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Connected to Jharkhand State Government Data Grid. Telemetry active with 94.2% operational monitoring.
            </p>
            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-semibold border-t border-blue-100">
              <span>Security Protocol: TLS 1.3</span>
              <span className="text-emerald-700 font-bold">Live Synchronized</span>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Tabs & Form Container */}
        <div className="lg:col-span-8 space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
            {[
              { id: "account", label: "Account Profile", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "preferences", label: "Dashboard Preferences", icon: Sliders },
              { id: "security", label: "Security & Access", icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    isActive
                      ? "bg-[#1769c2] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            {/* Account Profile Tab */}
            {activeTab === "account" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900">Administrator Profile Info</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your official district administrative credentials and contact details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.accountName || ""}
                      onChange={(e) => handleChange("accountName", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Designation
                    </label>
                    <input
                      type="text"
                      value={formData.designation || ""}
                      onChange={(e) => handleChange("designation", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Secretariat Department
                    </label>
                    <input
                      type="text"
                      value={formData.department || ""}
                      onChange={(e) => handleChange("department", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      District Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={formData.district || ""}
                      onChange={(e) => handleChange("district", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50/50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Office Collectorate Address
                    </label>
                    <input
                      type="text"
                      value={formData.officeAddress || ""}
                      onChange={(e) => handleChange("officeAddress", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900">Alerts &amp; Notifications Config</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage real-time grievance escalation triggers and scheduled digest frequencies.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                    <div>
                      <span className="font-semibold text-slate-800 block">Email Digest &amp; Alerts</span>
                      <span className="text-slate-500 text-[11px]">
                        Receive instant notifications when new citizen problem reports are submitted.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-xs focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                    <div>
                      <span className="font-semibold text-slate-800 block">Weekly Digest Email</span>
                      <span className="text-slate-500 text-[11px]">
                        Weekly summary report of district problem resolution and milestone tracking.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.weeklyReportDigest}
                      onChange={(e) => handleChange("weeklyReportDigest", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-xs focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                    <div>
                      <span className="font-semibold text-slate-800 block">Urgent Action SMS Alerts</span>
                      <span className="text-slate-500 text-[11px]">
                        Immediate SMS notifications for critical infrastructure or health emergencies.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.urgentActionAlerts}
                      onChange={(e) => handleChange("urgentActionAlerts", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-xs focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                    <div>
                      <span className="font-semibold text-slate-800 block">Early Warning Radar Telemetry</span>
                      <span className="text-slate-500 text-[11px]">
                        Automated AI risk detection alerts for water, weather, and epidemic signals.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.smsAlerts}
                      onChange={(e) => handleChange("smsAlerts", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-xs focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Dashboard Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900">Portal Display &amp; Telemetry Preferences</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize your dashboard refresh intervals, table layout, and visual presentation.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Auto-Refresh Telemetry Interval (Minutes)
                    </label>
                    <select
                      value={formData.autoRefreshInterval}
                      onChange={(e) => handleChange("autoRefreshInterval", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                    >
                      <option value="1">Every 1 Minute (High frequency)</option>
                      <option value="5">Every 5 Minutes (Recommended)</option>
                      <option value="15">Every 15 Minutes</option>
                      <option value="30">Every 30 Minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Default Landing District Filter
                    </label>
                    <select
                      value={formData.defaultDistrict}
                      onChange={(e) => handleChange("defaultDistrict", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                    >
                      <option value="Khunti">Khunti District (Default)</option>
                      <option value="Ranchi">Ranchi District</option>
                      <option value="Dhanbad">Dhanbad District</option>
                      <option value="East Singhbhum">East Singhbhum District</option>
                      <option value="All">All Jharkhand Districts</option>
                    </select>
                  </div>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                    <div>
                      <span className="font-semibold text-slate-800 block">Compact Table Spacing</span>
                      <span className="text-slate-500 text-[11px]">
                        Optimize data density on challenge and report queues.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.compactTables}
                      onChange={(e) => handleChange("compactTables", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-xs focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Security & Access Tab */}
            {activeTab === "security" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900">Security &amp; Authentication Policy</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure two-factor authentication, session lifecycle, and credential access policies.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                    <div>
                      <span className="font-semibold text-slate-800 block">Two-Factor Authentication (2FA)</span>
                      <span className="text-slate-500 text-[11px]">
                        Enforce OTP verification upon district administrator sign-in.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.twoFactorAuth}
                      onChange={(e) => handleChange("twoFactorAuth", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-xs focus:ring-blue-500"
                    />
                  </label>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Session Inactivity Timeout
                    </label>
                    <select
                      value={formData.sessionTimeout}
                      onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes (Recommended)</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800 block">Audit Logging &amp; Access History</span>
                        <span className="text-slate-500 text-[11px]">
                          Cryptographically signed administrative audit log enabled.
                        </span>
                      </div>
                      <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold text-[10px]">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Action Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1769c2] hover:bg-[#125aa8] text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
