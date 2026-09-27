import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import {
  useAuth,
} from "../../context/AuthContext";
import {
  getDashboardPathForRole,
  getSafePostAuthRedirect,
} from "../../utils/authRoutes";
import { useLanguage } from "../../context/LanguageContext";
import AuthRequiredPopup from "../landing/AuthRequiredPopup";

function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get("redirect");
  const { t } = useLanguage();

  const {
    user: currentUser,
    isAuthenticated,
    login,
  } = useAuth();

  const [showSignupPopup, setShowSignupPopup] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return (
      <Navigate
        to={getDashboardPathForRole(currentUser)}
        replace
      />
    );
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !loginData.email ||
      !loginData.password
    ) {
      setError(t("login.requiredFields"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email.trim())) {
      setError(t("login.invalidEmail"));
      return;
    }

    try {
      setIsLoading(true);

      const user = await login(
        loginData.email,
        loginData.password
      );

      setIsLoading(false);
      navigate(
        getSafePostAuthRedirect(
          redirectTarget,
          user
        ),
        { replace: true }
      );
    } catch (err) {
      console.error("Login error:", err);
      setIsLoading(false);

      // User doesn't exist in backend DB OR local fallback
      if (
        err?.code === "ACCOUNT_NOT_REGISTERED" ||
        err?.code === "AUTH_ERROR" ||
        err?.response?.status === 404
      ) {
        setError(t("login.accountNotRegistered"));
        setShowSignupPopup(true);
        return;
      }

      if (
        err?.code === "INVALID_CREDENTIALS" ||
        err?.response?.status === 401 ||
        err?.code === "AUTHENTICATION_FAILED"
      ) {
        setError(t("login.invalidCredentials"));
        return;
      }

      // Show the backend's specific message (e.g. email not verified, pending approval)
      const backendMsg =
        err?.serverError?.error ||
        err?.serverError?.detail ||
        err?.message;

      setError(
        backendMsg && backendMsg !== err?.code
          ? backendMsg
          : t("login.genericError")
      );
    }
  };

  return (
    <>
      <AuthRequiredPopup
        isOpen={showSignupPopup}
        onClose={() => setShowSignupPopup(false)}
        title={t("login.popupTitle")}
        message={t("login.popupMessage")}
        buttonText={t("login.popupAction")}
        onAction={() => {
          setShowSignupPopup(false);
          navigate("/signup", { replace: false });
        }}
      />

      <div className="min-h-screen bg-[#06132d] flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[1050px] min-h-[650px] bg-white rounded-[28px] border border-slate-700/30 shadow-[0_20px_70px_rgba(6,19,45,0.4)] overflow-hidden grid md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="hidden md:flex relative bg-[#06132d] overflow-hidden p-12 flex-col justify-between">

            {/* Landing Page Style Glows */}
            <div className="absolute w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px] -top-20 -left-20" />
            <div className="absolute w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] bottom-0 right-0" />

            <div className="relative z-10">

              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-sm">
                  <span className="text-slate-950 font-black text-lg">
                    S
                  </span>
                </div>

                <span className="text-white text-xl font-bold tracking-tight">
                  Solve
                  <span className="text-emerald-400">
                    Sphere
                  </span>
                </span>
              </Link>

              {/* Content */}
              <div className="mt-28 max-w-sm">

                <div className="flex items-center gap-2 text-emerald-400 text-sm mb-5 font-semibold">
                  <Sparkles size={15} />

                  {t("login.tagline")}
                </div>

                <h2 className="text-4xl font-semibold text-white leading-tight">
                  {t("login.bannerTitle")}
                </h2>

                <p className="text-slate-400 mt-6 leading-7 text-sm">
                  {t("login.bannerDescription")}
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-slate-500 text-xs">
                {t("login.bannerFooter")}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center p-7 sm:p-12 bg-white">
            <div className="w-full max-w-md">

              {/* Mobile Logo */}
              <div className="flex md:hidden items-center justify-center gap-2 mb-10">

                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                  <span className="text-slate-950 font-black text-lg">
                    S
                  </span>
                </div>

                <span className="text-xl font-bold text-slate-900">
                  Solve
                  <span className="text-emerald-500">
                    Sphere
                  </span>
                </span>
              </div>

              {/* Back to Home Link */}
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition mb-4"
              >
                ← {t("common.back")}
              </Link>

              {/* Heading */}
              <div className="mb-6">

                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {t("login.welcome")}
                </h1>

                <p className="text-slate-500 text-sm mt-1">
                  {t("login.subtitle")}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                  {error}
                </div>
              )}

              {/* FORM */}
              <form
                onSubmit={handleLogin}
                className="space-y-4"
              >

                {/* Email */}
                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t("login.email")}
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder={t("login.emailPlaceholder")}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20"
                    />

                  </div>
                </div>

                {/* Password */}
                <div>

                  <div className="flex justify-between items-center mb-1.5">

                    <label className="text-sm font-medium text-slate-700">
                      {t("login.password")}
                    </label>

                    <span className="text-xs text-emerald-600 hover:underline cursor-pointer">
                      {t("login.forgotPassword")}
                    </span>

                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder={t("login.passwordPlaceholder")}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20"
                    />

                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60 text-white text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
                >

                  {isLoading ? (
                    t("login.signingIn")
                  ) : (
                    <>
                      {t("login.submit")}

                      <ArrowRight size={17} />
                    </>
                  )}

                </button>
              </form>

              {/* Signup Link */}
              <p className="flex justify-center text-center text-sm text-slate-500 mt-6">

                {t("login.noAccount")}{" "}

                <Link
                  to={
                    redirectTarget
                      ? `/signup?redirect=${encodeURIComponent(
                          redirectTarget
                        )}`
                      : "/signup"
                  }
                >
                  <span className="text-emerald-600 ml-1 font-bold hover:underline">
                    {t("login.createAccount")}
                  </span>
                </Link>

              </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;