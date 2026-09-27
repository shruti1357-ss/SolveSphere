import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  GraduationCap,
  BookOpen,
  Users,
  CalendarDays,
  Pencil,
  Sparkles,
  X,
  Plus,
  Save,
  Check,
} from "lucide-react";
import Sidebar from "../../components/citizen-dashboard/Sidebar";
import Topbar from "../../components/citizen-dashboard/Topbar";
import { useAuth } from "../../context/AuthContext";
import {
  getUniversityProfile,
  saveUniversityProfile,
  getUniversityExpertiseAreas,
  getUniversityRealStats,
  UNIVERSITY_TYPES,
  DISTRICT_OPTIONS,
  DEPARTMENT_OPTIONS,
  DEPARTMENT_EXPERTISE,
} from "../../utils/universityProfileUtils";

export default function UniversityProfilePage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { user } = useAuth();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("solvesphere_university_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("solvesphere_university_updated", handleUpdate);
    };
  }, []);

  const profile = useMemo(() => getUniversityProfile(user) || {}, [user, version]);
  const stats = useMemo(() => getUniversityRealStats(user), [user, version]);
  const expertise = useMemo(() => getUniversityExpertiseAreas(user), [user, version]);

  const universityName = profile.universityName || user?.organization || user?.name || "XYZ University";
  const email = profile.officialEmail || user?.email || "admin@xyzuniv.edu.in";
  const district = profile.district || user?.district || "Ranchi";

  const departments = useMemo(() => {
    if (profile.departments && profile.departments.length > 0) {
      return profile.departments;
    }
    if (profile.department) {
      return [profile.department];
    }
    return [
      "Electrical & Electronics Engineering (EEE)",
      "Computer Science & Engineering (CSE)",
      "Civil Engineering",
    ];
  }, [profile]);

  // Edit form state
  const [formData, setFormData] = useState({
    universityName: "",
    universityType: "University",
    district: "Ranchi",
    officialEmail: "",
    contactPerson: "",
    contactNumber: "",
    departments: [],
    expertiseAreas: [],
    customExpertise: "",
  });

  const openEditModal = () => {
    setFormData({
      universityName,
      universityType: profile.universityType || "University",
      district: district || "Ranchi",
      officialEmail: email,
      contactPerson: profile.contactPerson || "Dr. Rajesh Sharma",
      contactNumber: profile.contactNumber || "+91 98765 43210",
      departments: [...departments],
      expertiseAreas: [...expertise],
      customExpertise: "",
    });
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const editParam = searchParams.get("edit");
    if (editParam === "research" || editParam === "true" || location.state?.openEdit) {
      openEditModal();
    }
  }, [searchParams, location.state]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      universityName: formData.universityName.trim() || universityName,
      universityType: formData.universityType,
      district: formData.district,
      officialEmail: formData.officialEmail.trim() || email,
      contactPerson: formData.contactPerson.trim(),
      contactNumber: formData.contactNumber.trim(),
      departments: formData.departments,
      expertiseAreas: formData.expertiseAreas,
    };

    saveUniversityProfile(user, updated);
    setIsEditModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const toggleDepartment = (dept) => {
    setFormData((prev) => {
      const exists = prev.departments.includes(dept);
      const nextDepts = exists
        ? prev.departments.filter((d) => d !== dept)
        : [...prev.departments, dept];

      // Auto-suggest relevant expertise if adding a department
      let nextExpertise = [...prev.expertiseAreas];
      if (!exists && DEPARTMENT_EXPERTISE[dept]) {
        const topSkills = DEPARTMENT_EXPERTISE[dept].slice(0, 3);
        topSkills.forEach((s) => {
          if (!nextExpertise.includes(s) && s !== "Other") {
            nextExpertise.push(s);
          }
        });
      }

      return {
        ...prev,
        departments: nextDepts,
        expertiseAreas: nextExpertise,
      };
    });
  };

  const toggleExpertise = (exp) => {
    setFormData((prev) => {
      const exists = prev.expertiseAreas.includes(exp);
      return {
        ...prev,
        expertiseAreas: exists
          ? prev.expertiseAreas.filter((e) => e !== exp)
          : [...prev.expertiseAreas, exp],
      };
    });
  };

  const addCustomExpertise = () => {
    const val = formData.customExpertise.trim();
    if (val && !formData.expertiseAreas.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        expertiseAreas: [...prev.expertiseAreas, val],
        customExpertise: "",
      }));
    }
  };

  // Available skills from selected departments
  const suggestedExpertise = useMemo(() => {
    const all = new Set();
    formData.departments.forEach((dept) => {
      if (DEPARTMENT_EXPERTISE[dept]) {
        DEPARTMENT_EXPERTISE[dept].forEach((skill) => {
          if (skill !== "Other") all.add(skill);
        });
      }
    });
    return Array.from(all);
  }, [formData.departments]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="ml-0 lg:ml-64">
        <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="p-5 lg:p-7">
          {saveSuccess && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Check className="h-5 w-5 text-emerald-600" />
                University profile has been successfully updated!
              </div>
              <button
                onClick={() => setSaveSuccess(false)}
                className="text-emerald-600 hover:text-emerald-800"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Profile Header Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
            {/* Banner Top Gradient */}
            <div className="h-36 bg-gradient-to-r from-[#0e3b70] via-[#1d5aa0] to-[#2b75c9]" />

            {/* Banner Content Card */}
            <div className="relative px-5 pb-6 sm:px-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                  {/* University Avatar Icon overlapping banner bottom border */}
                  <div className="-mt-12 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-blue-50 text-blue-700 shadow-md">
                    <Building2 size={40} />
                  </div>

                  {/* University Name & Details positioned comfortably in white card */}
                  <div className="pt-1 sm:pt-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {universityName}
                      </h1>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 size={13} /> Verified Institution
                      </span>
                    </div>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <MapPin size={15} className="text-slate-400" /> {district}, Jharkhand
                    </p>
                  </div>
                </div>

                {/* Edit Profile Action */}
                <div className="pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={openEditModal}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-blue-600 shadow-sm transition hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Pencil size={14} /> Edit Profile
                  </button>
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
                Academic institution profile for participating in government challenges, research collaboration, student innovation, and university–industry solution development under SolveSphere.
              </p>
            </div>
          </div>

          {/* Details & Expertise Sections */}
          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_1fr]">
            {/* Institution Details */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Building2 size={18} className="text-blue-600" /> Institution Details
                </h2>
                <button
                  onClick={openEditModal}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["University Type", profile.universityType || "University", GraduationCap],
                  ["District", district, MapPin],
                  ["Official Email", email, Mail],
                  ["Contact Number", profile.contactNumber || "+91 98765 43210", Phone],
                  ["Contact Person", profile.contactPerson || "Dr. Rajesh Sharma", Users],
                  ["Member Since", profile.createdAt || "2026", CalendarDays],
                ].map(([label, value, Icon]) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      <Icon size={14} />
                      {label}
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-slate-800 break-words">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Departments & Areas of Expertise */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <BookOpen size={18} className="text-violet-600" /> Departments
                </h2>
                <button
                  onClick={openEditModal}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {departments.map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Sparkles size={18} className="text-emerald-600" /> Areas of Expertise
                </h2>
                <button
                  onClick={openEditModal}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {expertise.map((e) => (
                  <span
                    key={e}
                    className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* University Impact Snapshot */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-900 text-base">University Impact Snapshot</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Current participation across the SolveSphere innovation ecosystem.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  [stats.totalAssigned, "Assigned Challenges"],
                  [stats.ongoingProjects, "Ongoing Projects"],
                  [stats.completedProjects, "Completed Projects"],
                  [expertise.length, "Research Areas"],
                ].map(([n, l]) => (
                  <div key={l} className="min-w-[120px] rounded-xl bg-slate-50 border border-slate-100 px-5 py-3 text-center">
                    <p className="text-2xl font-bold text-slate-900">{n}</p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-100 my-8 overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit University Profile</h3>
                  <p className="text-xs text-slate-500">Update your institution details and registered expertise</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* University Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Institution / University Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.universityName}
                    onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                    placeholder="e.g. Ranchi University"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* University Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Institution Type
                  </label>
                  <select
                    value={formData.universityType}
                    onChange={(e) => setFormData({ ...formData, universityType: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {UNIVERSITY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {DISTRICT_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Official Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.officialEmail}
                    onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                    placeholder="admin@university.edu.in"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Person / Dean
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Dr. Rajesh Sharma"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Select Departments */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Active Departments
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {DEPARTMENT_OPTIONS.map((dept) => {
                    const isSelected = formData.departments.includes(dept);
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => toggleDepartment(dept)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {dept}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Areas of Expertise */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Selected Areas of Expertise & Research Strength
                </label>

                {/* Active Selected Tags */}
                <div className="flex flex-wrap gap-2 mb-3 min-h-[36px] p-2 rounded-xl bg-slate-50 border border-slate-200">
                  {formData.expertiseAreas.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No expertise areas selected yet.</span>
                  ) : (
                    formData.expertiseAreas.map((exp) => (
                      <span
                        key={exp}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold"
                      >
                        {exp}
                        <button
                          type="button"
                          onClick={() => toggleExpertise(exp)}
                          className="hover:text-emerald-950"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Suggestions from departments */}
                {suggestedExpertise.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                      Suggested from selected departments:
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                      {suggestedExpertise
                        .filter((s) => !formData.expertiseAreas.includes(s))
                        .slice(0, 15)
                        .map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleExpertise(s)}
                            className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition"
                          >
                            + {s}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Add Custom Area */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.customExpertise}
                    onChange={(e) => setFormData({ ...formData, customExpertise: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomExpertise();
                      }
                    }}
                    placeholder="Add custom expertise or research domain"
                    className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomExpertise}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
