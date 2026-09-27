import { useState, useMemo, useEffect } from "react";
import {
  Settings,
  UserRound,
  BellRing,
  ShieldCheck,
  Building2,
  Save,
  Check,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Sparkles,
  KeyRound,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Briefcase,
  Layers,
} from "lucide-react";
import IndustryModuleLayout from "../../components/industry/IndustryModuleLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getCompanyProfile,
  saveCompanyProfile,
  TECHNICAL_EXPERTISE_OPTIONS,
  AREAS_OF_INTEREST_OPTIONS,
} from "../../utils/industryMockData";

export default function IndustrySettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("company"); // "company" | "account" | "notifications" | "security"
  const [version, setVersion] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Form State initialized from user profile
  const storedProfile = useMemo(() => getCompanyProfile(user), [user, version]);

  const [formData, setFormData] = useState({
    companyName: "",
    industryDomain: "",
    companyType: "Enterprise",
    contactPerson: "",
    email: "",
    phone: "",
    companyWebsite: "",
    district: "Ranchi",
    companyDescription: "",
    servicesOffered: "",
    technicalExpertise: [],
    areasOfInterest: [],
  });

  // Notification Preferences state
  const [notifPreferences, setNotifPreferences] = useState({
    projectMatches: true,
    collaborationAcceptance: true,
    govChallenges: true,
    milestoneUpdates: true,
    weeklyDigest: false,
    emailAlerts: true,
  });

  // Security state
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Sync state with stored profile on mount or storage update
  useEffect(() => {
    if (storedProfile) {
      setFormData({
        companyName: storedProfile.companyName || user?.organization || user?.name || "Tata Motors Pvt. Ltd.",
        industryDomain: storedProfile.industryDomain || "Automotive & Smart Infrastructure",
        companyType: storedProfile.companyType || "Enterprise",
        contactPerson: storedProfile.contactPerson || user?.name || "Rajesh Sen",
        email: storedProfile.email || user?.email || "industry.partner@tatamotors.com",
        phone: storedProfile.phone || "9876543210",
        companyWebsite: storedProfile.companyWebsite || "https://www.tatamotors.com",
        district: storedProfile.district || "Ranchi",
        companyDescription:
          storedProfile.companyDescription ||
          "Leading automotive, IoT, and industrial engineering enterprise supporting public infrastructure innovation and CSR development in Jharkhand.",
        servicesOffered:
          storedProfile.servicesOffered ||
          "Technical Mentorship, Prototype Testing, Hardware Sponsorship, CSR Funding, Deployment Support",
        technicalExpertise: Array.isArray(storedProfile.technicalExpertise)
          ? storedProfile.technicalExpertise
          : ["Artificial Intelligence", "Machine Learning", "IoT", "Computer Vision"],
        areasOfInterest: Array.isArray(storedProfile.areasOfInterest)
          ? storedProfile.areasOfInterest
          : ["Smart City", "Water & Sanitation", "Agriculture"],
      });
    }
  }, [storedProfile, user]);

  // Handle Input Changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle Expertise Tags
  const toggleExpertise = (tag) => {
    setFormData((prev) => {
      const exists = prev.technicalExpertise.includes(tag);
      return {
        ...prev,
        technicalExpertise: exists
          ? prev.technicalExpertise.filter((t) => t !== tag)
          : [...prev.technicalExpertise, tag],
      };
    });
  };

  // Toggle Area of Interest Tags
  const toggleInterest = (area) => {
    setFormData((prev) => {
      const exists = prev.areasOfInterest.includes(area);
      return {
        ...prev,
        areasOfInterest: exists
          ? prev.areasOfInterest.filter((a) => a !== area)
          : [...prev.areasOfInterest, area],
      };
    });
  };

  // Handle Save
  const handleSaveSettings = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    saveCompanyProfile(user, formData);

    try {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("solvesphere_industry_profile_updated"));
    } catch {}

    setIsSaved(true);
    setSaveMessage("Settings saved successfully!");
    setVersion((v) => v + 1);

    setTimeout(() => {
      setIsSaved(false);
      setSaveMessage("");
    }, 3500);
  };

  // Handle Password Change
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.newPass || passwords.newPass !== passwords.confirmPass) {
      alert("New passwords do not match or cannot be empty.");
      return;
    }
    setPasswords({ current: "", newPass: "", confirmPass: "" });
    setIsSaved(true);
    setSaveMessage("Password updated securely!");
    setTimeout(() => {
      setIsSaved(false);
      setSaveMessage("");
    }, 3500);
  };

  const navTabs = [
    { id: "company", label: "Company Information", icon: Building2, desc: "Organization details, sector & expertise" },
    { id: "account", label: "Account Settings", icon: UserRound, desc: "Personal contacts & district location" },
    { id: "notifications", label: "Notification Preferences", icon: BellRing, desc: "Alert triggers & digest emails" },
    { id: "security", label: "Security & Access", icon: ShieldCheck, desc: "Password, authentication & sessions" },
  ];

  return (
    <IndustryModuleLayout
      title="Settings"
      subtitle="Manage your Industry Portal preferences and organization settings."
      icon={Settings}
    >
      <div className="space-y-6 max-w-5xl">
        {/* Saved Toast Notification */}
        {isSaved && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm animate-in fade-in slide-in-from-top-3 duration-200">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Check size={18} />
            </span>
            <div>
              <p className="text-xs font-extrabold">{saveMessage || "Settings updated successfully!"}</p>
              <p className="text-[11px] text-emerald-700">All matching algorithms and workspace registries have updated in real time.</p>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  isActive
                    ? "border-blue-600 bg-white shadow-sm ring-2 ring-blue-600/10"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    isActive
                      ? "bg-blue-50 border-blue-200 text-[#0d3971]"
                      : "bg-slate-50 border-slate-100 text-slate-500"
                  }`}
                >
                  <Icon size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold ${isActive ? "text-[#0d3971]" : "text-slate-800"}`}>
                    {tab.label}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400 line-clamp-1">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          {/* TAB 1: Company Information */}
          {activeTab === "company" && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-[#0d3971]">Company Information</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Update your organization profile to improve AI matching with student projects and civic challenges.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      placeholder="e.g. Tata Motors Pvt. Ltd."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Industry Domain / Sector <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.industryDomain}
                      onChange={(e) => handleInputChange("industryDomain", e.target.value)}
                      placeholder="e.g. Automotive & Smart Infrastructure"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Company Type</label>
                  <select
                    value={formData.companyType}
                    onChange={(e) => handleInputChange("companyType", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Enterprise">Enterprise Partner</option>
                    <option value="Startup">Startup / Incubatee</option>
                    <option value="SME">Small & Medium Enterprise (SME)</option>
                    <option value="Public Sector Unit (PSU)">Public Sector Unit (PSU)</option>
                    <option value="Multinational Corporation (MNC)">Multinational Corporation (MNC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Official Website</label>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={formData.companyWebsite}
                      onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                      placeholder="https://www.company.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Company Capability & Overview</label>
                <textarea
                  rows={3}
                  value={formData.companyDescription}
                  onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                  placeholder="Describe your technical capabilities, labs, and CSR goals..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Technical Expertise Multi-Select */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Registered Technical Expertise ({formData.technicalExpertise.length} selected)
                  </label>
                  <span className="text-[10px] text-slate-400">Click to add/remove skills for AI project matching</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TECHNICAL_EXPERTISE_OPTIONS.map((tech) => {
                    const isSelected = formData.technicalExpertise.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleExpertise(tech)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? "bg-[#0d3971] text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Areas of Interest Multi-Select */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Priority Civic Focus Domains ({formData.areasOfInterest.length} selected)
                  </label>
                  <span className="text-[10px] text-slate-400">Used for recommended civic challenges</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {AREAS_OF_INTEREST_OPTIONS.map((area) => {
                    const isSelected = formData.areasOfInterest.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleInterest(area)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-blue-50 text-[#0d3971] hover:bg-blue-100/70"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0d3971] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1a4a82] transition active:scale-95"
                >
                  <Save size={15} /> Save Company Information
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Account Settings */}
          {activeTab === "account" && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-[#0d3971]">Account & Contact Settings</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Primary liaison contact credentials for university and state communication.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Lead Representative Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                      placeholder="e.g. Rajesh Sen"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Official Communication Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="industry.lead@company.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Direct Phone / Hotline</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Headquarters / Main District</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden"
                    >
                      <option value="Ranchi">Ranchi</option>
                      <option value="East Singhbhum (Jamshedpur)">East Singhbhum (Jamshedpur)</option>
                      <option value="Dhanbad">Dhanbad</option>
                      <option value="Bokaro">Bokaro</option>
                      <option value="Hazaribagh">Hazaribagh</option>
                      <option value="Dumka">Dumka</option>
                      <option value="Deoghar">Deoghar</option>
                      <option value="Ramgarh">Ramgarh</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0d3971] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1a4a82] transition active:scale-95"
                >
                  <Save size={15} /> Save Account Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Notification Preferences */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-[#0d3971]">Notification Preferences</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Configure which notifications appear in your topbar bell icon and email dispatch channels.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "projectMatches",
                    title: "High-Confidence Project Matches",
                    desc: "Notify when an academic research team publishes a project matching 80%+ of your technical skills.",
                  },
                  {
                    key: "collaborationAcceptance",
                    title: "Collaboration & Proposal Responses",
                    desc: "Receive real-time alerts when a university accepts or reviews your partnership proposal.",
                  },
                  {
                    key: "govChallenges",
                    title: "Government CSR Challenge Openings",
                    desc: "Immediate alert when state departments request industry co-development or CSR funding in your sector.",
                  },
                  {
                    key: "milestoneUpdates",
                    title: "Workspace Milestone Deliverables",
                    desc: "Alert when partnered student innovators upload prototype test results or proof of work.",
                  },
                  {
                    key: "weeklyDigest",
                    title: "Weekly Innovation Digest (Email)",
                    desc: "A consolidated Monday briefing summarizing active deployments and state progress.",
                  },
                ].map((item) => {
                  const isChecked = notifPreferences[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() =>
                        setNotifPreferences((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                      }
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50/70 transition"
                    >
                      <div className="pr-4">
                        <p className="text-xs font-bold text-slate-800">{item.title}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <div
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                          isChecked ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                            isChecked ? "translate-x-5.5" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0d3971] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1a4a82] transition active:scale-95"
                >
                  <Save size={15} /> Save Notification Preferences
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Security & Access */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-[#0d3971]">Security & Authentication</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Manage login credentials, 2-factor authentication, and active portal sessions.
                </p>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                <h4 className="text-xs font-extrabold text-[#0d3971]">Change Account Password</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        required
                        value={passwords.current}
                        onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        required
                        value={passwords.newPass}
                        onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwords.confirmPass}
                      onChange={(e) => setPasswords((p) => ({ ...p, confirmPass: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                  >
                    <KeyRound size={14} /> Update Password
                  </button>
                </div>
              </form>

              {/* Two-Factor Authentication Status */}
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Smartphone size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] text-slate-500">
                      Require OTP verification for CSR fund allocation and partnership agreements.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled((v) => !v)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    twoFactorEnabled
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {twoFactorEnabled ? "Active & Enforced" : "Disabled"}
                </button>
              </div>

              {/* Active Session Info */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-xs font-bold text-slate-800">Current Session Details</p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Authenticated Role:</span>
                    <span className="font-bold text-[#0d3971]">INDUSTRY_PARTNER</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Security Level:</span>
                    <span className="font-bold text-emerald-600">Level 3 Enterprise Verified</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Session Expiry:</span>
                    <span className="font-semibold text-slate-700">Automatic (7 Days)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </IndustryModuleLayout>
  );
}
