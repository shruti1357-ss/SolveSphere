import { useState, useMemo, useEffect } from "react";
import {
  Building2,
  Save,
  CheckCircle2,
  Zap,
  Sparkles,
  Check,
  Globe,
  Briefcase,
  Layers,
  FileText,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import IndustryModuleLayout from "../../components/industry/IndustryModuleLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getCompanyProfile,
  saveCompanyProfile,
  TECHNICAL_EXPERTISE_OPTIONS,
  AREAS_OF_INTEREST_OPTIONS,
} from "../../utils/industryMockData";

export default function IndustryProfilePage() {
  const { user, updateUser, showToast } = useAuth();
  const [version, setVersion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load profile from unified storage
  const storedProfile = useMemo(() => getCompanyProfile(user), [user, version]);

  const [profile, setProfile] = useState({
    companyName: "",
    industryDomain: "Automotive & Smart Infrastructure",
    companyType: "Enterprise",
    companyWebsite: "https://www.tatamotors.com",
    contactPerson: "Rajesh Sen",
    email: "industry.partner@tatamotors.com",
    phone: "9876543210",
    district: "Ranchi",
    companyDescription: "",
    servicesOffered: "",
    technicalExpertise: [],
    areasOfInterest: [],
  });

  useEffect(() => {
    if (storedProfile) {
      setProfile({
        companyName: storedProfile.companyName || user?.organization || user?.name || "Tata Motors",
        industryDomain: storedProfile.industryDomain || "Automotive & Smart Infrastructure",
        companyType: storedProfile.companyType || "Enterprise",
        companyWebsite: storedProfile.companyWebsite || "https://www.tatamotors.com",
        contactPerson: storedProfile.contactPerson || user?.name || "Rajesh Sen",
        email: storedProfile.email || user?.email || "industry.partner@tatamotors.com",
        phone: storedProfile.phone || "9876543210",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTechnicalExpertise = (option) => {
    setProfile((prev) => {
      const current = Array.isArray(prev.technicalExpertise) ? prev.technicalExpertise : [];
      const exists = current.includes(option);
      const updated = exists ? current.filter((item) => item !== option) : [...current, option];
      return { ...prev, technicalExpertise: updated };
    });
  };

  const toggleAreaOfInterest = (option) => {
    setProfile((prev) => {
      const current = Array.isArray(prev.areasOfInterest) ? prev.areasOfInterest : [];
      const exists = current.includes(option);
      const updated = exists ? current.filter((item) => item !== option) : [...current, option];
      return { ...prev, areasOfInterest: updated };
    });
  };

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!profile.companyName.trim()) {
      if (showToast) showToast("Company Name is required.", "error");
      return;
    }

    if (!profile.technicalExpertise || profile.technicalExpertise.length === 0) {
      if (showToast) showToast("Select at least one Technical Expertise.", "error");
      return;
    }

    if (!profile.areasOfInterest || profile.areasOfInterest.length === 0) {
      if (showToast) showToast("Select at least one Area of Interest.", "error");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      saveCompanyProfile(user, profile);

      if (updateUser) {
        updateUser({
          organization: profile.companyName,
        });
      }

      try {
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("solvesphere_industry_profile_updated"));
      } catch {}

      setIsSaving(false);
      setSavedSuccess(true);
      setVersion((v) => v + 1);

      if (showToast) showToast("Company Profile updated successfully!", "success");

      setTimeout(() => setSavedSuccess(false), 3500);
    }, 400);
  };

  return (
    <IndustryModuleLayout
      title="Company Profile"
      subtitle="Manage your company information, technical expertise, and areas of interest to receive matched project recommendations."
      icon={Building2}
    >
      <div className="space-y-6 max-w-5xl">
        {/* Saved Success Toast */}
        {savedSuccess && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm animate-in fade-in slide-in-from-top-3 duration-200">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Check size={18} />
            </span>
            <div>
              <p className="text-xs font-extrabold">Company Profile updated successfully!</p>
              <p className="text-[11px] text-emerald-700">
                Your technical skills and civic focus areas have been synchronized for real-time AI project recommendations.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Card 1: General Company Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
            <div className="border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-base font-extrabold text-[#0d3971]">General Company Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official enterprise registration details used in collaboration proposals and state CSR reports.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={profile.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Tata Motors"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Industry Sector / Domain <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="industryDomain"
                      required
                      value={profile.industryDomain}
                      onChange={handleChange}
                      placeholder="e.g. Automotive & Smart Infrastructure"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company Type
                  </label>
                  <select
                    name="companyType"
                    value={profile.companyType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                  >
                    <option value="Enterprise">Enterprise Partner</option>
                    <option value="Startup">Startup / Incubatee</option>
                    <option value="SME">Small & Medium Enterprise (SME)</option>
                    <option value="Public Sector Unit (PSU)">Public Sector Unit (PSU)</option>
                    <option value="Multinational Corporation (MNC)">Multinational Corporation (MNC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Website
                  </label>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      name="companyWebsite"
                      value={profile.companyWebsite}
                      onChange={handleChange}
                      placeholder="https://www.company.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Overview & Capabilities
                </label>
                <textarea
                  rows={3}
                  name="companyDescription"
                  value={profile.companyDescription}
                  onChange={handleChange}
                  placeholder="Brief summary of your organization's mission, R&D labs, and CSR goals in Jharkhand..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              {/* Services Offered */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Services Offered / Partnership Models
                </label>
                <input
                  type="text"
                  name="servicesOffered"
                  value={profile.servicesOffered}
                  onChange={handleChange}
                  placeholder="e.g. Technical Mentorship, Prototype Testing, Hardware Sponsorship, CSR Funding"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Technical Expertise */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0d3971] flex items-center gap-2">
                  <Zap size={18} className="text-blue-600" />
                  Technical Expertise <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select technologies your company specializes in or can offer mentorship/sponsorship for.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-[#0d3971] border border-blue-100">
                {profile.technicalExpertise?.length || 0} Selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {TECHNICAL_EXPERTISE_OPTIONS.map((option) => {
                const isSelected = profile.technicalExpertise?.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleTechnicalExpertise(option)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition ${
                      isSelected
                        ? "border-[#0d3971] bg-[#0d3971] text-white shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {isSelected && <Check size={13} />}
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 3: Areas of Interest */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0d3971] flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-600" />
                  Areas of Interest & Civic Domains <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select domains your organization targets for CSR, open innovation, or commercial deployments.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-[#0d3971] border border-blue-100">
                {profile.areasOfInterest?.length || 0} Selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {AREAS_OF_INTEREST_OPTIONS.map((option) => {
                const isSelected = profile.areasOfInterest?.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleAreaOfInterest(option)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {isSelected && <Check size={13} />}
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0d3971] px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-900/15 transition hover:bg-[#1a4a82] active:scale-95 disabled:opacity-50"
            >
              <Save size={15} />
              {isSaving ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </IndustryModuleLayout>
  );
}
