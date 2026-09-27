import React, { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  User,
  Lock,
  CheckCircle2,
  Save,
  Building2,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const StateSettingsPage = ({ tab = "settings" }) => {
  const { user, updateUser, showToast } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "Government Official",
    email: user?.email || "state@gmail.com",
    department: user?.department || "Higher & Technical Education",
    designation: user?.designation || "State Secretary / Nodal Officer",
    phone: user?.phone || "+91 66778 89900",
    notificationsEnabled: true,
    emailAlerts: true,
    smsAlerts: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      if (typeof updateUser === "function") {
        updateUser(form);
      }
      if (typeof showToast === "function") {
        showToast("State Official profile and preferences updated successfully!", "success");
      }
      setIsSaving(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
            <Settings size={13} /> Account &amp; System Administration
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
            {tab === "notifications" ? "State Notifications & Alert Rules" : "State Official Profile & Settings"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage state administrative credentials, contact details, early warning notification rules, and security preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-bold">
            <ShieldCheck size={14} /> State Authority Verified
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side Profile Card */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4 self-start">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d3971] text-white font-black text-xl shadow-md mb-3 border-2 border-blue-100">
              {(form.name || "GO").substring(0, 2).toUpperCase()}
            </div>
            <h2 className="text-base font-extrabold text-slate-900">{form.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{form.designation}</p>
            <span className="inline-flex items-center gap-1 mt-2.5 rounded-full bg-blue-50 px-3 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
              <Shield size={11} /> State Government Official
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Building2 size={13} className="text-slate-400" /> Department
              </span>
              <span className="font-bold text-slate-800 text-right">{form.department}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" /> Official Email
              </span>
              <span className="font-bold text-slate-800 text-right font-mono text-[11px]">{form.email}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" /> Contact Phone
              </span>
              <span className="font-bold text-slate-800 text-right">{form.phone}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <MapPin size={13} className="text-emerald-600" /> Jurisdiction
              </span>
              <span className="font-extrabold text-emerald-700">All 24 Districts</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
            <span className="text-[9.5px] font-bold text-slate-400 uppercase">Access Level</span>
            <p className="text-xs font-semibold text-slate-700">
              Full State Dashboard View, Advisory Dispatch, &amp; Accreditation Privileges
            </p>
          </div>
        </div>

        {/* Right Side Settings Form */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 pb-1">
                Official Contact Information
              </h2>
              <p className="text-[11px] text-slate-400">
                Update your nodal identity and communication endpoints for inter-department coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Anjali Sharma"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="e.g. State Secretary"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                  Assigned Department
                </label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g. Higher & Technical Education"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-900 pb-1">
                Notification &amp; Advisory Dispatch Preferences
              </h2>
              <p className="text-[11px] text-slate-400 mb-3">
                Configure early warning threshold triggers and state executive briefs.
              </p>

              <div className="space-y-3">
                <label className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition cursor-pointer gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">Critical Early Warning Notifications</p>
                    <p className="text-[11px] text-slate-500">
                      Receive immediate state alerts when district risk assessment score exceeds 8.0/10.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.notificationsEnabled}
                    onChange={(e) => setForm({ ...form, notificationsEnabled: e.target.checked })}
                    className="h-4 w-4 rounded accent-blue-600 mt-0.5 cursor-pointer"
                  />
                </label>

                <label className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition cursor-pointer gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">Daily State Executive Digest</p>
                    <p className="text-[11px] text-slate-500">
                      Receive daily morning email summaries of new citizen reports and university solution progress.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.emailAlerts}
                    onChange={(e) => setForm({ ...form, emailAlerts: e.target.checked })}
                    className="h-4 w-4 rounded accent-blue-600 mt-0.5 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Official State Government Administration Security Protocol
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0d3971] hover:bg-blue-800 text-white font-extrabold text-xs px-6 py-2.5 shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <Save size={15} />
                <span>{isSaving ? "Saving Settings..." : "Save Settings"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StateSettingsPage;

