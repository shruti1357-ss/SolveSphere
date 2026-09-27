import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  User,
  Sparkles,
  GraduationCap,
  Zap,
  Building2,
  Phone,
  Globe,
  CheckSquare,
  MapPin,
  BookOpen,
  Layers,
} from "lucide-react";
import { useAuth, normalizeFrontendRoleToBackend } from "../../context/AuthContext";
import AuthRequiredPopup from "../landing/AuthRequiredPopup";
import { getDashboardPathForRole } from "../../utils/authRoutes";
import { useLanguage } from "../../context/LanguageContext";
import { saveCompanyProfile } from "../../utils/industryMockData";
import {
  saveUniversityProfile,
  UNIVERSITY_TYPES,
  DISTRICT_OPTIONS,
  DEPARTMENT_OPTIONS,
  DEPARTMENT_EXPERTISE,
} from "../../utils/universityProfileUtils";

const COMPANY_TYPES = [
  "Startup",
  "SME",
  "Enterprise",
  "Research Organization",
  "Corporate",
];

const INDUSTRY_DOMAINS = [
  "IT",
  "Artificial Intelligence",
  "Healthcare",
  "Agriculture",
  "Education",
  "Manufacturing",
  "IoT",
  "Other",
];

const SERVICES_OPTIONS = [
  "Mentorship",
  "Funding",
  "Prototype Development",
  "Testing",
  "Deployment",
  "Technical Support",
  "Dataset Support",
  "Infrastructure Support",
];

function SignupForm() {
  const navigate = useNavigate();

  const { user: currentUser, isAuthenticated, signup } = useAuth();
  const { t } = useLanguage();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Citizen",
    location: "",
    district: "",
  });

  // Dedicated Industry Registration State
  const [industryForm, setIndustryForm] = useState({
    companyName: "",
    email: "",
    password: "",
    contactPerson: "",
    phone: "",
    companyType: "Startup",
    industryDomain: "IT",
    department: "",
    expertiseAreas: [],
    servicesOffered: ["Mentorship", "Funding", "Prototype Development"],
    companyWebsite: "",
    location: "",
    district: "",
  });

  // Dedicated University Registration State
  const [universityForm, setUniversityForm] = useState({
    universityName: "",
    officialEmail: "",
    password: "",
    contactPerson: "",
    contactNumber: "",
    universityType: "University",
    address: "",
    location: "",
    district: "Ranchi",
    department: "",
    departments: [],
    expertiseAreas: [],
    researchAreas: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    {
      id: "Citizen",
      label: "Citizen",
      icon: User,
      desc: "Community Member",
    },
    {
      id: "University",
      label: "University",
      icon: GraduationCap,
      desc: "Academic Institution",
    },
    {
      id: "Industry",
      label: "Industry",
      icon: Zap,
      desc: "Startup & Enterprise",
    },
  ];

  if (isAuthenticated) {
    return <Navigate to={getDashboardPathForRole(currentUser)} replace />;
  }

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIndustryChange = (e) => {
    const { name, value } = e.target;
    setIndustryForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" ? { expertiseAreas: [] } : {}),
    }));
  };

  const handleUniversityChange = (e) => {
    const { name, value } = e.target;
    setUniversityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleExpertise = (area) => {
    setIndustryForm((prev) => {
      const exists = prev.expertiseAreas.includes(area);
      const updated = exists
        ? prev.expertiseAreas.filter((a) => a !== area)
        : [...prev.expertiseAreas, area];
      return { ...prev, expertiseAreas: updated };
    });
  };

  const toggleService = (service) => {
    setIndustryForm((prev) => {
      const exists = prev.servicesOffered.includes(service);
      const updated = exists
        ? prev.servicesOffered.filter((s) => s !== service)
        : [...prev.servicesOffered, service];
      return { ...prev, servicesOffered: updated };
    });
  };

  const selectUniversityDepartment = (department) => {
    setUniversityForm((prev) => ({
      ...prev,
      department,
      // Preserve the existing array-shaped profile data for compatibility.
      departments: department ? [department] : [],
      expertiseAreas: [],
    }));
  };

  const toggleUniversityExpertise = (area) => {
    setUniversityForm((prev) => {
      const exists = prev.expertiseAreas.includes(area);
      const updated = exists
        ? prev.expertiseAreas.filter((a) => a !== area)
        : [...prev.expertiseAreas, area];
      return { ...prev, expertiseAreas: updated };
    });
  };

  const handleStandardSignup = async (e) => {
    e.preventDefault();
    setError("");

    const name = signupData.name.trim();
    const email = signupData.email.trim();

    if (!name || !email || !signupData.password || !signupData.confirmPassword) {
      setError(t("signup.requiredFields"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("signup.invalidEmail"));
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError(t("signup.passwordMismatch"));
      return;
    }

    if (signupData.password.length < 6) {
      setError(t("signup.passwordShort"));
      return;
    }

    if (!signupData.location.trim() || !signupData.district) {
      setError(t("signup.locationRequired"));
      return;
    }

    try {
      setIsLoading(true);
      const backendRole = normalizeFrontendRoleToBackend(signupData.role);

      if (!backendRole) {
        setError(t("signup.genericError"));
        setIsLoading(false);
        return;
      }

      const newUser = await signup(
        name,
        email,
        signupData.password,
        signupData.role,
        {
          location: signupData.location.trim(),
          district: signupData.district,
          phone: signupData.phone?.trim() || signupData.contactNumber?.trim() || "0000000000",
        }
      );

      if (!newUser) {
        throw new Error("Unable to create account.");
      }

      setIsLoading(false);
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (err) {
      console.error("Signup error:", err);
      if (err?.code === "ACCOUNT_ALREADY_EXISTS") {
        setError(t("signup.accountExists"));
      } else {
        setError(err?.message || t("signup.genericError"));
      }
      setIsLoading(false);
    }
  };

  const handleIndustrySignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const companyName = industryForm.companyName.trim();
    const email = industryForm.email.trim();

    if (!companyName || !email || !industryForm.password || !industryForm.contactPerson.trim()) {
      setError("Please fill all required fields (*).");
      return;
    }

    if (industryForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!industryForm.department) {
      setError("Please select a Department before choosing Expertise Areas.");
      return;
    }

    if (industryForm.expertiseAreas.length === 0) {
      setError("Please select at least one Expertise Area.");
      return;
    }

    if (!industryForm.location.trim() || !industryForm.district) {
      setError("Please select your District and enter your Location.");
      return;
    }

    try {
      setIsLoading(true);

      const newUser = await signup(
        companyName,
        email,
        industryForm.password,
        "Industry",
        {
          companyName,
          officialEmail: email,
          contactPerson: industryForm.contactPerson,
          phone: industryForm.phone,
          companyType: industryForm.companyType,
          industryDomain: industryForm.industryDomain,
          department: industryForm.department,
          expertiseAreas: industryForm.expertiseAreas,
          servicesOffered: industryForm.servicesOffered,
          companyWebsite: industryForm.companyWebsite,
          location: industryForm.location.trim(),
          district: industryForm.district,
        }
      );

      if (!newUser) {
        throw new Error("Unable to create industry account.");
      }

      saveCompanyProfile(newUser, {
        companyName,
        companyDescription: `${companyName} is a registered ${industryForm.companyType} in ${industryForm.industryDomain}.`,
        servicesOffered: industryForm.servicesOffered.join(", "),
        technicalExpertise: industryForm.expertiseAreas,
        areasOfInterest: [industryForm.industryDomain, "Smart City", "Agriculture"],
        contactPerson: industryForm.contactPerson,
        phone: industryForm.phone,
        companyType: industryForm.companyType,
        department: industryForm.department,
        companyWebsite: industryForm.companyWebsite,
        location: industryForm.location.trim(),
        district: industryForm.district,
      });

      setIsLoading(false);
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (err) {
      console.error("Industry signup error:", err);
      if (err?.code === "ACCOUNT_ALREADY_EXISTS") {
        setError("Account already exists. Please login instead.");
      } else {
        setError(err?.message || "Something went wrong. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const handleUniversitySignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const universityName = universityForm.universityName.trim();
    const officialEmail = universityForm.officialEmail.trim();
    const contactPerson = universityForm.contactPerson.trim();
    const contactNumber = universityForm.contactNumber.trim();
    const password = universityForm.password;

    if (!universityName || !officialEmail || !password || !contactPerson || !contactNumber) {
      setError("Please fill all required fields (*).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(officialEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(contactNumber)) {
      setError("Please enter a valid contact phone number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!universityForm.department) {
      setError("Please select a Department before choosing an Area of Expertise.");
      return;
    }

    if (universityForm.expertiseAreas.length === 0) {
      setError("Please select at least one Area of Expertise.");
      return;
    }

    try {
      setIsLoading(true);

      const newUser = await signup(
        universityName,
        officialEmail,
        password,
        "University",
        {
          universityName,
          officialEmail,
          contactPerson,
          contactNumber,
          phone: contactNumber,
          universityType: universityForm.universityType,
          address: universityForm.address || universityForm.location.trim(),
          location: universityForm.location.trim(),
          district: universityForm.district,
          department: universityForm.department,
          departments: universityForm.departments || [universityForm.department],
          expertiseAreas: universityForm.expertiseAreas,
          researchAreas: universityForm.researchAreas,
        }
      );

      if (!newUser) {
        throw new Error("Unable to create University account.");
      }

      saveUniversityProfile(newUser, {
        universityName,
        officialEmail,
        password,
        contactPerson,
        contactNumber,
        universityType: universityForm.universityType,
        address: universityForm.address,
        location: universityForm.location.trim(),
        district: universityForm.district,
        department: universityForm.department,
        departments: universityForm.departments,
        expertiseAreas: universityForm.expertiseAreas,
        researchAreas: universityForm.researchAreas,
      });

      setIsLoading(false);
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (err) {
      console.error("University signup error:", err);
      if (err?.code === "ACCOUNT_ALREADY_EXISTS") {
        setError("Account already exists. Please login instead.");
      } else {
        setError(err?.message || "Something went wrong. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const isIndustrySelected = signupData.role === "Industry";
  const isUniversitySelected = signupData.role === "University";
  const universityExpertiseOptions = DEPARTMENT_EXPERTISE[universityForm.department] || [];
  const industryExpertiseOptions = DEPARTMENT_EXPERTISE[industryForm.department] || [];

  return (
    <>
      <AuthRequiredPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title={signupData.role === "Citizen" ? t("signup.successTitle") : "Account Created Successfully"}
        message={signupData.role === "Citizen" ? t("signup.successMessage") : "Your SolveSphere account has been created successfully. Please login to continue."}
        buttonText={signupData.role === "Citizen" ? t("signup.continueLogin") : "Continue to Login"}
        onAction={() => navigate("/login", { replace: true })}
        variant="success"
      />

      <div className="min-h-screen bg-[#06132d] flex items-center justify-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-[1100px] min-h-[calc(100vh-32px)] h-auto bg-white rounded-[28px] border border-slate-700/30 shadow-[0_20px_70px_rgba(6,19,45,0.4)] overflow-hidden grid md:grid-cols-12">
          
          {/* LEFT SIDE BANNER */}
          <div className="hidden md:flex md:col-span-5 relative bg-[#06132d] overflow-hidden p-10 flex-col justify-between">
            <div className="absolute w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px] -top-20 -left-20" />
            <div className="absolute w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] bottom-0 right-0" />

            <div className="relative z-10">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                  <span className="text-slate-950 font-black text-lg">S</span>
                </div>
                <span className="text-white text-xl font-bold tracking-tight">
                  Solve<span className="text-emerald-400">Sphere</span>
                </span>
              </Link>

              <div className="mt-16">
                <div className="flex items-center gap-2 text-emerald-400 text-sm mb-4 font-semibold">
                  <Sparkles size={15} />
                  {signupData.role === "Citizen" ? t("signup.citizen.tagline") : "Build. Collaborate. Create Impact."}
                </div>

                <h2 className="text-3xl font-semibold text-white leading-tight">
                  {signupData.role === "Citizen" ? t("signup.citizen.bannerTitle") : isUniversitySelected ? (
                    <>
                      Empower your <span className="text-emerald-400">academic institution</span> to solve civic challenges.
                    </>
                  ) : (
                    <>
                      Connect your <span className="text-emerald-400"> enterprise </span> with academic innovation.
                    </>
                  )}
                </h2>

                <p className="text-slate-400 mt-5 leading-relaxed text-xs">
                  {signupData.role === "Citizen" ? t("signup.citizen.bannerDescription") : "Join a growing ecosystem of universities, research labs, and government leaders driving real-world impact."}
                </p>
              </div>
            </div>

            <p className="relative z-10 text-slate-500 text-xs">
              {signupData.role === "Citizen" ? t("signup.citizen.bannerFooter") : "Select your role to start collaborating."}
            </p>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="md:col-span-7 flex items-center justify-center px-6 py-8 sm:px-10 bg-white">
            <div className="w-full max-w-lg">
              {/* Back to Home Link */}
              {signupData.role === "Citizen" && (
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition mb-3"
                >
                  ← {t("common.back")}
                </Link>
              )}

              {/* Heading */}
              <div className="mb-5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {isUniversitySelected
                    ? "UNIVERSITY REGISTRATION"
                    : isIndustrySelected
                    ? "INDUSTRY REGISTRATION"
                    : t("signup.citizen.title")}
                </h1>
                <p className="text-slate-500 text-xs mt-1">
                  {isUniversitySelected
                    ? "Register your academic institution to accept challenges and lead R&D projects."
                    : isIndustrySelected
                    ? "Fill your company details to receive matched university R&D projects."
                    : t("signup.citizen.subtitle")}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
                  {error}
                </div>
              )}

              {/* ROLE SELECTION */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {signupData.role === "Citizen" ? t("signup.role") : "Select Role"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isSelected = signupData.role === r.id;

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() =>
                          setSignupData((prev) => ({
                            ...prev,
                            role: r.id,
                          }))
                        }
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-xs"
                            : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={isSelected ? "text-emerald-600" : "text-slate-400"}
                        />
                        <span className="text-[11px] mt-1 truncate w-full">
                          {signupData.role === "Citizen"
                            ? t(r.id === "Citizen" ? "module.citizen" : r.id === "University" ? "module.university" : "module.industry")
                            : r.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DEDICATED UNIVERSITY REGISTRATION FORM */}
              {isUniversitySelected ? (
                <form onSubmit={handleUniversitySignupSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      University Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="universityName"
                        value={universityForm.universityName}
                        onChange={handleUniversityChange}
                        placeholder="e.g., XYZ Institute of Technology & Research"
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Official University Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          name="officialEmail"
                          value={universityForm.officialEmail}
                          onChange={handleUniversityChange}
                          placeholder="contact@university.edu.in"
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          name="password"
                          value={universityForm.password}
                          onChange={handleUniversityChange}
                          placeholder="Create password"
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="contactPerson"
                          value={universityForm.contactPerson}
                          onChange={handleUniversityChange}
                          placeholder="Dr. Rajesh Sharma"
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          name="contactNumber"
                          value={universityForm.contactNumber}
                          onChange={handleUniversityChange}
                          placeholder="9876543210"
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="location"
                          value={universityForm.location}
                          onChange={handleUniversityChange}
                          placeholder="e.g. Dhanbad"
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="district"
                        value={universityForm.district}
                        onChange={handleUniversityChange}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      >
                        {DISTRICT_OPTIONS.map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        University Type
                      </label>
                      <select
                        name="universityType"
                        value={universityForm.universityType}
                        onChange={handleUniversityChange}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      >
                        {UNIVERSITY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>


                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Address
                    </label>
                    <textarea
                      rows={2}
                      name="address"
                      value={universityForm.address}
                      onChange={handleUniversityChange}
                      placeholder="Enter full campus address..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/40">
                      {DEPARTMENT_OPTIONS.map((dept) => {
                        const isChecked = universityForm.department === dept;
                        return (
                          <label
                            key={dept}
                            className={`flex items-center gap-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${
                              isChecked
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="universityDepartment"
                              checked={isChecked}
                              onChange={() => selectUniversityDepartment(dept)}
                              className="hidden"
                            />
                            <CheckSquare size={13} className={isChecked ? "text-emerald-600" : "text-slate-300"} />
                            <span className="truncate">{dept}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Areas of Expertise <span className="text-red-500">*</span>
                    </label>
                    <div className={`grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/40 ${!universityForm.department ? "opacity-60" : ""}`}>
                      {!universityForm.department ? (
                        <p className="col-span-2 p-1.5 text-[11px] text-slate-400">Select a department to view its expertise areas.</p>
                      ) : universityExpertiseOptions.map((area) => {
                        const isChecked = universityForm.expertiseAreas.includes(area);
                        return (
                          <label
                            key={area}
                            className={`flex items-center gap-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${
                              isChecked
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleUniversityExpertise(area)}
                              className="hidden"
                            />
                            <CheckSquare size={13} className={isChecked ? "text-emerald-600" : "text-slate-300"} />
                            <span className="truncate">{area}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Research Areas
                    </label>
                    <textarea
                      rows={2}
                      name="researchAreas"
                      value={universityForm.researchAreas}
                      onChange={handleUniversityChange}
                      placeholder="Enter your university's major research areas..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 mt-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20 uppercase tracking-wider"
                  >
                    {isLoading ? (
                      "Registering University..."
                    ) : (
                      <>
                        REGISTERATION UNIVERSITY
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              ) : isIndustrySelected ? (
                /* DEDICATED INDUSTRY REGISTRATION FORM */
                <form onSubmit={handleIndustrySignupSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="companyName"
                        value={industryForm.companyName}
                        onChange={handleIndustryChange}
                        placeholder="ABC Technologies Pvt. Ltd."
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Official Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={industryForm.email}
                          onChange={handleIndustryChange}
                          placeholder="contact@abctech.com"
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          name="password"
                          value={industryForm.password}
                          onChange={handleIndustryChange}
                          placeholder="Create password"
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="contactPerson"
                          value={industryForm.contactPerson}
                          onChange={handleIndustryChange}
                          placeholder="Rahul Kumar"
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={industryForm.phone}
                          onChange={handleIndustryChange}
                          placeholder="98XXXXXXXX"
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="location"
                          value={industryForm.location}
                          onChange={handleIndustryChange}
                          placeholder="e.g. Jamshedpur"
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="district"
                        value={industryForm.district}
                        onChange={handleIndustryChange}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      >
                        <option value="">Select district</option>
                        {DISTRICT_OPTIONS.map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Company Type
                      </label>
                      <select
                        name="companyType"
                        value={industryForm.companyType}
                        onChange={handleIndustryChange}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      >
                        {COMPANY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Industry Domain
                      </label>
                      <select
                        name="industryDomain"
                        value={industryForm.industryDomain}
                        onChange={handleIndustryChange}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      >
                        {INDUSTRY_DOMAINS.map((domain) => (
                          <option key={domain} value={domain}>
                            {domain}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="department"
                      value={industryForm.department}
                      onChange={handleIndustryChange}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                    >
                      <option value="">Select department</option>
                      {DEPARTMENT_OPTIONS.map((department) => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Expertise Areas <span className="text-red-500">*</span>
                    </label>
                    <div className={`grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/40 ${!industryForm.department ? "opacity-60" : ""}`}>
                      {!industryForm.department ? (
                        <p className="col-span-2 p-1.5 text-[11px] text-slate-400">Select a department to view its expertise areas.</p>
                      ) : industryExpertiseOptions.map((area) => {
                        const isChecked = industryForm.expertiseAreas.includes(area);
                        return (
                          <label
                            key={area}
                            className={`flex items-center gap-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${
                              isChecked
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleExpertise(area)}
                              className="hidden"
                            />
                            <CheckSquare size={13} className={isChecked ? "text-emerald-600" : "text-slate-300"} />
                            <span className="truncate">{area}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Services Offered
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/40">
                      {SERVICES_OPTIONS.map((service) => {
                        const isChecked = industryForm.servicesOffered.includes(service);
                        return (
                          <label
                            key={service}
                            className={`flex items-center gap-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${
                              isChecked
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleService(service)}
                              className="hidden"
                            />
                            <CheckSquare size={13} className={isChecked ? "text-emerald-600" : "text-slate-300"} />
                            <span className="truncate">{service}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Company Website
                    </label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="companyWebsite"
                        value={industryForm.companyWebsite}
                        onChange={handleIndustryChange}
                        placeholder="https://www.abctech.com"
                        className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 mt-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20"
                  >
                    {isLoading ? (
                      "Registering Company..."
                    ) : (
                      <>
                        REGISTERATION INDUSTRY
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* STANDARD SIGNUP FORM (CITIZEN ONLY) */
                <form onSubmit={handleStandardSignup} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t("signup.name")}
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={signupData.name}
                        onChange={handleSignupChange}
                        placeholder={t("signup.namePlaceholder")}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t("signup.email")}
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        placeholder={t("login.emailPlaceholder")}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t("signup.password")}
                    </label>
                    <div className="relative">
                      <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        placeholder={t("signup.passwordPlaceholder")}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t("signup.confirmPassword")}
                    </label>
                    <div className="relative">
                      <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        placeholder={t("signup.confirmPasswordPlaceholder")}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {t("signup.location")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="location"
                          value={signupData.location}
                          onChange={handleSignupChange}
                        placeholder={t("signup.locationPlaceholder")}
                          className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {t("signup.district")} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="district"
                        value={signupData.district}
                        onChange={handleSignupChange}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-400"
                      >
                        <option value="">{t("signup.districtPlaceholder")}</option>
                        {DISTRICT_OPTIONS.map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 mt-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20"
                  >
                    {isLoading ? (
                      t("signup.creating")
                    ) : (
                      <>
                        {t("signup.create")}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Login Link */}
              <p className="flex justify-center text-center text-xs text-slate-500 mt-5">
                {t("signup.haveAccount")} {" "}
                <Link to="/login">
                  <span className="text-emerald-600 ml-1 font-bold hover:underline">{t("signup.login")}</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupForm;
