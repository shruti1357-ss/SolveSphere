import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, LogOut, ShieldCheck, Menu, X } from "lucide-react";
import { getDashboardPathForRole } from "../../utils/authRoutes";
import AuthRequiredPopup from "./AuthRequiredPopup";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [popupKey, setPopupKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (current > previous && current > 150 && !mobileMenuOpen) {
      setHidden(true);
    } else if (current < previous) {
      setHidden(false);
    }
  });

  const isCitizen =
    String(user?.backendRole || user?.backend_role || user?.role || "").toUpperCase() === "CITIZEN" ||
    user?.role === "Citizen";

  const getDashboardPath = () => {
    if (!user) return "/login";
    return getDashboardPathForRole(user);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: hidden ? 0 : 1,
        y: hidden ? -100 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700/20 bg-[#06132d]/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-sm">
            <span className="text-sm font-black text-slate-950">S</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Solve<span className="text-emerald-400">Sphere</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="pb-1 text-sm font-semibold text-white transition hover:text-emerald-400"
          >
            {t("nav.home")}
          </Link>

          <Link
            to={isAuthenticated ? "/report" : "#"}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                setShowAuthPopup(true);
                setPopupKey((prev) => prev + 1);
              }
            }}
            className="rounded-full bg-emerald-500/10 border border-emerald-400/30 px-3.5 py-1 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
          >
            {t("nav.report")}
          </Link>

          <Link
            to={isAuthenticated ? "/challenges" : "/login?redirect=/challenges"}
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            {t("nav.challenges")}
          </Link>

          <a
            href="/#how-it-works"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            {t("nav.howItWorks")}
          </a>

          <Link
            to="/impact"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            {t("nav.impact")}
          </Link>
        </div>

        {/* Desktop Auth Buttons / Logged In User Pill */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isCitizen && <LanguageSwitcher variant="navbar" />}
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 rounded-xl bg-slate-800/90 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <span className="truncate max-w-[120px]">{user.name}</span>
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/", { replace: true });
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition"
                title={t("nav.logout")}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-slate-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                {t("nav.login")}
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                {t("nav.signup")}
              </Link>

              <Link
                to="/government-signup"
                className="rounded-lg border border-blue-400/40 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-500/20 hover:text-white"
              >
                {t("nav.governmentSignup")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle & Language Switcher */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && isCitizen && <LanguageSwitcher variant="navbar" />}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-white shadow-xs focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-800 bg-[#06132d] px-6 py-5 md:hidden space-y-4"
          >
            <div className="flex flex-col space-y-3 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-200 hover:text-emerald-400 py-1"
              >
                {t("nav.home")}
              </Link>

              <Link
                to={isAuthenticated ? "/report" : "#"}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (!isAuthenticated) {
                    e.preventDefault();
                    setShowAuthPopup(true);
                    setPopupKey((prev) => prev + 1);
                  }
                }}
                className="inline-flex items-center justify-between rounded-xl bg-emerald-500/15 border border-emerald-400/30 px-4 py-2.5 text-xs font-bold text-emerald-400"
              >
                <span>{t("nav.report")}</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded-full font-bold">Free</span>
              </Link>

              <Link
                to={isAuthenticated ? "/challenges" : "/login?redirect=/challenges"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-200 hover:text-emerald-400 py-1"
              >
                {t("nav.challenges")}
              </Link>

              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-200 hover:text-emerald-400 py-1"
              >
                {t("nav.howItWorks")}
              </a>

              <Link
                to="/impact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-200 hover:text-emerald-400 py-1"
              >
                {t("nav.impact")}
              </Link>
            </div>

            <div className="border-t border-slate-800 pt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-slate-800/90 border border-slate-700 p-3 text-xs font-semibold text-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100">{user.name}</p>
                        <p className="text-[10px] text-emerald-400">{user.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-bold">Dashboard →</span>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate("/", { replace: true });
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-bold text-rose-400"
                  >
                    <LogOut className="w-4 h-4" /> {t("nav.logout")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center rounded-xl border border-slate-700 py-2.5 text-xs font-bold text-white hover:bg-white/10 text-center"
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 text-center shadow-xs"
                    >
                      {t("nav.signup")}
                    </Link>
                  </div>
                  <Link
                    to="/government-signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-blue-400/40 bg-blue-500/10 py-2.5 text-xs font-semibold text-blue-200 text-center"
                  >
                    {t("nav.governmentSignup")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthRequiredPopup
        key={popupKey}
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
      />
    </motion.nav>
  );
};

export default Navbar;
