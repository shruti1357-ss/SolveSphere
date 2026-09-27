import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Building2, Key } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { getDashboardPathForRole } from "../../utils/authRoutes";

const GovtLoginPage = () => {
  const navigate = useNavigate();
  const { loginGovtAdmin } = useAdmin();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("admin.portal@gov.in");
  const [securityKey, setSecurityKey] = useState("GOV-SECRETARY-2026");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (typeof loginGovtAdmin === "function") {
        loginGovtAdmin(email, securityKey);
      }
      const loggedInUser = await login(email, securityKey, "Government", "Government Admin");
      setIsLoading(false);
      const targetPath = getDashboardPathForRole(loggedInUser);
      navigate(targetPath || "/state/dashboard", { replace: true });
    } catch (err) {
      console.error("Govt login error:", err);
      setIsLoading(false);
      setError(err?.message || "Invalid government credentials or authorization pending.");
    }
  };

  const handleDemoFill = () => {
    setEmail("admin.portal@gov.in");
    setSecurityKey("GOV-SECRETARY-2026");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f8f8fc] flex items-center justify-center px-5 py-10 font-sans">
      <div className="w-full max-w-[1050px] min-h-[600px] bg-white rounded-[28px] border border-gray-200 shadow-[0_20px_70px_rgba(40,20,100,0.08)] overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE (Government Brand) */}
        <div className="hidden md:flex relative bg-slate-900 overflow-hidden p-12 flex-col justify-between">
          <div className="absolute w-80 h-80 bg-emerald-600/20 rounded-full blur-[100px] -top-20 -left-20" />
          <div className="absolute w-72 h-72 bg-cyan-600/20 rounded-full blur-[100px] bottom-0 right-0" />

          <div className="relative z-10">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-emerald-500/30">
                S
              </div>
              <span className="text-white text-xl font-bold tracking-tight">
                Solve<span className="text-emerald-400">Sphere</span>
              </span>
            </Link>

            {/* Content */}
            <div className="mt-20 max-w-sm">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles size={15} />
                {t("login.gov.badge")}
              </div>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                {t("login.gov.title")}
              </h2>
              <p className="text-slate-400 mt-4 leading-relaxed text-xs">
                {t("login.gov.description")}
              </p>
            </div>
          </div>

          <div className="relative z-10 border-t border-slate-800 pt-4">
            <p className="text-slate-500 text-xs">
              {t("login.gov.protocol")}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (Login Form) */}
        <div className="flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-md space-y-6">
            {/* Mobile Logo */}
            <div className="flex md:hidden items-center justify-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg">
                S
              </div>
              <span className="text-xl font-bold text-slate-900">
                Solve<span className="text-emerald-600">Sphere</span>
              </span>
            </div>

            {/* Heading */}
            <div>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block">
                {t("login.gov.officialAccess")}
              </span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                {t("login.gov.signInTitle")}
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                {t("login.gov.signInSubtitle")}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t("login.gov.officialEmail")}
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin.portal@gov.in"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t("login.gov.passkey")}
                </label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={securityKey}
                    onChange={(e) => setSecurityKey(e.target.value)}
                    placeholder={t("login.gov.passkeyPlaceholder")}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  {t("login.gov.demoFill")}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-slate-900/10"
              >
                {isLoading ? t("login.gov.authenticating") : t("login.gov.submit")}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                {t("login.gov.backHome")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovtLoginPage;
