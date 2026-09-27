import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "../components/citizen-dashboard/Sidebar";
import Topbar from "../components/citizen-dashboard/Topbar";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  citizenText,
  localizeAddress,
  localizeCategory,
  localizePriority,
  localizeProblemStatus,
  localizeProblemTitle,
} from "../i18n/citizenUi";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  AlertCircle,
  MapPin,
  Phone,
  CheckCircle2,
  Pencil,
  FileText,
  Globe,
  PlusCircle,
  X,
  Save,
  Activity,
  Clock,
} from "lucide-react";

const JHARKHAND_DISTRICTS = [
  "Ranchi",
  "East Singhbhum",
  "West Singhbhum",
  "Dhanbad",
  "Bokaro",
  "Hazaribagh",
  "Deoghar",
  "Giridih",
  "Ramgarh",
  "Palamu",
  "Dumka",
  "Garhwa",
  "Godda",
  "Gumla",
  "Jamtara",
  "Khunti",
  "Koderma",
  "Latehar",
  "Lohardaga",
  "Pakur",
  "Sahebganj",
  "Seraikela Kharsawan",
  "Simdega",
  "Chatra",
];

const CitizenProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { user, userProblems = [], updateUser, showToast } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = (key, values) => citizenText(language, key, values);

  const cleanDisplayName = (() => {
    const raw =
      user?.name ||
      user?.full_name ||
      user?.profile?.full_name ||
      user?.first_name ||
      user?.username ||
      "";
    if (!raw) return "Citizen User";
    const cleaned = String(raw).replace(/_[a-f0-9]{4,8}$/i, "").trim();
    return cleaned || "Citizen User";
  })();

  // Form state for edit profile
  const [formData, setFormData] = useState({
    name: cleanDisplayName,
    phone: user?.phone || "+91 98765 43210",
    district: user?.district || "East Singhbhum",
    location: user?.location || "Jamshedpur",
    bio:
      user?.bio ||
      "Active resident contributing to community infrastructure, water management, and public safety initiatives in Jharkhand.",
  });

  const handleEditOpen = () => {
    setFormData({
      name: cleanDisplayName,
      phone: user?.phone || "+91 98765 43210",
      district: user?.district || "East Singhbhum",
      location: user?.location || "Jamshedpur",
      bio:
        user?.bio ||
        "Active resident contributing to community infrastructure, water management, and public safety initiatives in Jharkhand.",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      if (updateUser) {
        updateUser({
          name: formData.name,
          phone: formData.phone,
          district: formData.district,
          location: formData.location,
          bio: formData.bio,
        });
      }
      setIsSaving(false);
      setIsEditModalOpen(false);
      if (showToast) {
        showToast(t("updateProfileSuccess"), "success");
      }
    }, 400);
  };

  // Dynamic statistics from user problems
  const totalCount = userProblems.length;
  const underReviewCount = userProblems.filter(
    (p) =>
      p.status === "Under AI Analysis" ||
      p.status === "Under Review" ||
      p.backendStatus === "UNDER_REVIEW" ||
      p.status === "Pending Review"
  ).length;

  const inProgressCount = userProblems.filter(
    (p) =>
      p.status === "In Progress" ||
      p.status === "Approved as Active Challenge" ||
      p.status === "Active" ||
      p.backendStatus === "IN_PROGRESS" ||
      p.backendStatus === "ASSIGNED_TO_HEI"
  ).length;

  const resolvedCount = userProblems.filter(
    (p) =>
      p.status === "Completed" ||
      p.status === "Resolved" ||
      p.backendStatus === "RESOLVED"
  ).length;

  const citizenId =
    user?.id && !String(user.id).includes("-")
      ? `CIT-JH-${String(user.id).padStart(4, "0")}`
      : user?.citizenId || `CIT-JH-2026-8942`;

  const memberSinceText = new Intl.DateTimeFormat(
    [
      language === "sat"
        ? "sat"
        : ["ho", "nag", "kur", "kho", "mul"].includes(language)
        ? "hi"
        : language,
      "en",
    ],
    { month: "long", year: "numeric" }
  ).format(new Date(2026, 7, 1));

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="ml-0 lg:ml-64">
        <Topbar isSidebarOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main className="w-full px-4 py-6 sm:px-6 lg:p-8 space-y-6">
          {/* Simple Top Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-2.5">
                <User className="h-7 w-7 text-emerald-600" />
                {t("citizen.userProfile")}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {t("citizen.profileDesc")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleEditOpen}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition active:scale-95"
              >
                <Pencil size={15} className="text-blue-600" />
                {t("editProfile")}
              </button>

              <Link
                to="/citizen-dashboard/report-problem"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95"
              >
                <PlusCircle size={16} />
                {t("reportNewProblem")}
              </Link>
            </div>
          </div>

          {/* Simple Profile Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-black text-white shadow-md">
                  {cleanDisplayName.charAt(0)?.toUpperCase() || "C"}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {cleanDisplayName}
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={13} /> {t("activeVerified")}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500">
                    {user?.email || "citizen@solvesphere.gov.in"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-700">
                  <MapPin size={14} className="text-blue-600" />
                  {localizeAddress(formData.district, language)}, {t("stateJharkhand")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 font-mono font-bold text-slate-700">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  {citizenId}
                </span>
              </div>
            </div>

            {/* Simple Bio */}
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
              {formData.bio}
            </p>
          </motion.div>

          {/* Civic Impact & Stats Row (4 Clean Cards) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4"
          >
            {/* Total Problems */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t("totalProblems")}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
                {totalCount}
              </p>
              <span className="mt-1 inline-block text-[11px] font-semibold text-blue-600">
                {t("problemsSubmitted")}
              </span>
            </div>

            {/* Under AI Review */}
            <div className="rounded-2xl border border-amber-100 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t("underReviewCount")}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-black text-amber-600">
                {underReviewCount}
              </p>
              <span className="mt-1 inline-block text-[11px] font-semibold text-amber-700">
                {t("underAi")}
              </span>
            </div>

            {/* In Progress */}
            <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t("inProgressCount")}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Activity size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-black text-indigo-600">
                {inProgressCount}
              </p>
              <span className="mt-1 inline-block text-[11px] font-semibold text-indigo-600">
                {t("citizen.inProgressStatus")}
              </span>
            </div>

            {/* Resolved */}
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t("resolvedCount")}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600">
                {resolvedCount}
              </p>
              <span className="mt-1 inline-block text-[11px] font-semibold text-emerald-700">
                {t("completed")}
              </span>
            </div>
          </motion.div>

          {/* Main 2-Column Standard Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Card 1: Personal Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <User size={18} className="text-blue-600" />
                  {t("personalInfo")}
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  ID: {citizenId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <User size={13} /> {t("fullName")}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {cleanDisplayName}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <Mail size={13} /> {t("email")}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800 break-all">
                    {user?.email || "citizen@solvesphere.gov.in"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <Phone size={13} /> {t("phone")}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {formData.phone}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <Globe size={13} /> {t("preferredLang")}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800 uppercase">
                    {language === "hi"
                      ? "हिन्दी (Hindi)"
                      : language === "bn"
                      ? "বাংলা (Bengali)"
                      : language === "or"
                      ? "ଓଡ଼ିଆ (Odia)"
                      : language === "sat"
                      ? "ᱥᱟᱱᱛᱟᱲᱤ (Santali)"
                      : language === "nag"
                      ? "नागपुरी (Nagpuri)"
                      : language === "kur"
                      ? "कुड़ुख़ (Kurukh)"
                      : language === "kho"
                      ? "खोरठा (Khortha)"
                      : language === "ho"
                      ? "हो (Ho)"
                      : language === "mul"
                      ? "मुंडारी (Mundari)"
                      : "English (EN)"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <ShieldCheck size={13} /> {t("accountStatus")}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={14} /> {t("activeVerified")}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <Calendar size={13} /> {t("memberSince")}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {memberSinceText}
                  </p>
                </div>
              </div>
            </section>

            {/* Card 2: Civic Jurisdiction & Location Details */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <MapPin size={18} className="text-emerald-600" />
                  {t("civicDetails")}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {formData.district}, {t("stateJharkhand")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 block">
                    {t("state")}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {t("stateJharkhand")} (Jharkhand)
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 block">
                    {t("district")}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {localizeAddress(formData.district, language)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 block">
                    {t("location")} / {t("blockArea")}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {localizeAddress(formData.location, language)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 block">
                    {t("jurisdiction")}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    Municipal Corporation / Urban Civic Body
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Pencil size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {t("editProfile")}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {t("citizen.profileDesc")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSave} className="mt-5 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t("fullName")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t("phone")}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {/* District & Locality Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t("district")}
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white"
                    >
                      {JHARKHAND_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {localizeAddress(d, language)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t("location")} / {t("blockArea")}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g. Jamshedpur / Sonari"
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t("bio")}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder={t("bioPlaceholder")}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {/* Submit bar */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    <Save size={15} />
                    {isSaving ? t("saving") : t("saveChanges")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitizenProfilePage;
