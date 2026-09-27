import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthRequiredPopup from "./AuthRequiredPopup";
import { FiUser, FiCpu, FiShield, FiBookOpen, FiGlobe } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

const getOrbitItems = (t) => [
  {
    icon: FiUser,
    title: t("module.citizen"),
    sub: t("nav.report"),
    position: "citizen",
    bg: "bg-slate-800/95",
  },
  {
    icon: FiCpu,
    title: t("common.analytics"),
    sub: t("common.analytics"),
    position: "ai",
    bg: "bg-cyan-500/95",
  },
  {
    icon: FiShield,
    title: t("module.government"),
    sub: t("nav.challenges"),
    position: "government",
    bg: "bg-purple-500/95",
  },
  {
    icon: FiBookOpen,
    title: t("module.university"),
    sub: t("module.innovationSubmissions"),
    position: "university",
    bg: "bg-blue-500/95",
  },
  {
    icon: FaBuilding,
    title: t("module.industry"),
    sub: t("module.innovationChallenges"),
    position: "industry",
    bg: "bg-emerald-500/95",
  },
];

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [popupKey, setPopupKey] = useState(0);
  const { t } = useLanguage();
  const orbitItems = getOrbitItems(t);

  return (
    <section
      id="home"
      className="relative min-h-[650px] overflow-hidden bg-[#06132d]"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -right-32 top-0 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute left-0 top-32 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Government-style subtle grid */}
      <div className="absolute inset-0 opacity-[0.045]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "65px 65px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6 pb-12 pt-20">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">

          {/* =========================
              LEFT CONTENT
          ========================== */}

          <motion.div
            className="relative z-20 max-w-xl"
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            {/* <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,.8)]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                Connect • Collaborate • Create Impact
              </span>
            </div> */}

            <h1 className="text-4xl font-extrabold leading-[1.10] tracking-tight text-white sm:text-5xl lg:text-[54px]">
              {t("hero.title1")}
              <br />

              <span className="text-emerald-400">
                {t("hero.title2")}
              </span>

              <br />

              <span className="text-emerald-400">
                {t("hero.title3")}
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
              {t("hero.description")}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={isAuthenticated ? "/report" : "#"}
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    setShowAuthPopup(true);
                    setPopupKey((prev) => prev + 1);
                  }
                }}
                className="group inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                {t("hero.report")}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to={
                  isAuthenticated
                    ? "/challenges"
                    : "/login?redirect=/challenges"
                }
                className="group inline-flex items-center gap-2 rounded-md border border-slate-500 bg-transparent px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                {t("hero.explore")}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </motion.div>

          {/* =========================
              NEW RIGHT VISUAL
          ========================== */}

          <motion.div
            className="relative hidden h-[560px] w-full lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          >
            {/* Large ambient glow */}
            <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.035] blur-3xl" />

            {/* =========================
                DIGITAL NETWORK
            ========================== */}

            <div className="absolute inset-0">

              {/* Network lines */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 650 560"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Main connections */}
                <path
                  d="M105 125 C190 145 245 215 325 280"
                  stroke="rgba(103,232,249,.18)"
                  strokeWidth="1.5"
                  strokeDasharray="5 7"
                />

                <path
                  d="M545 125 C455 145 405 215 325 280"
                  stroke="rgba(167,139,250,.18)"
                  strokeWidth="1.5"
                  strokeDasharray="5 7"
                />

                <path
                  d="M92 420 C185 395 245 340 325 280"
                  stroke="rgba(96,165,250,.18)"
                  strokeWidth="1.5"
                  strokeDasharray="5 7"
                />

                <path
                  d="M558 420 C465 395 405 340 325 280"
                  stroke="rgba(52,211,153,.18)"
                  strokeWidth="1.5"
                  strokeDasharray="5 7"
                />

                <path
                  d="M325 65 C325 145 325 205 325 280"
                  stroke="rgba(34,211,238,.16)"
                  strokeWidth="1.5"
                  strokeDasharray="4 8"
                />

                {/* Outer network */}
                <path
                  d="M105 125 C180 55 250 45 325 65 C400 45 470 55 545 125"
                  stroke="rgba(255,255,255,.06)"
                  strokeWidth="1"
                />

                <path
                  d="M92 420 C155 500 245 515 325 495 C405 515 495 500 558 420"
                  stroke="rgba(255,255,255,.06)"
                  strokeWidth="1"
                />

                {/* Moving connection particles */}
                <circle r="3" fill="#67e8f9">
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    path="M105 125 C190 145 245 215 325 280"
                  />
                </circle>

                <circle r="3" fill="#a78bfa">
                  <animateMotion
                    dur="5s"
                    repeatCount="indefinite"
                    path="M545 125 C455 145 405 215 325 280"
                  />
                </circle>

                <circle r="3" fill="#34d399">
                  <animateMotion
                    dur="4.5s"
                    repeatCount="indefinite"
                    path="M558 420 C465 395 405 340 325 280"
                  />
                </circle>

                <circle r="3" fill="#60a5fa">
                  <animateMotion
                    dur="5.5s"
                    repeatCount="indefinite"
                    path="M92 420 C185 395 245 340 325 280"
                  />
                </circle>
              </svg>

              {/* =========================
                  CENTER CORE
              ========================== */}

              <motion.div
                className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.035, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Pulsing rings */}
                <div className="absolute -inset-10 animate-[pulseRing_3s_ease-out_infinite] rounded-full border border-cyan-300/10" />

                <div className="absolute -inset-6 rounded-full border border-cyan-300/15" />

                {/* Core */}
                <div className="relative flex h-[145px] w-[145px] items-center justify-center rounded-full border border-white/20 bg-[#0b2349]/95 shadow-[0_0_80px_rgba(34,211,238,.25)] backdrop-blur-xl">
                  <div className="absolute inset-[10px] rounded-full border border-cyan-300/20" />

                  <div className="absolute inset-[22px] rounded-full bg-gradient-to-br from-blue-600/70 via-cyan-500/60 to-emerald-500/70 blur-sm" />

                  <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 shadow-[0_0_40px_rgba(34,211,238,.35)]">
                    <FiGlobe size={42} className="text-white" />
                  </div>

                  {/* <div className="absolute -bottom-8 rounded-full border border-white/10 bg-[#071a38] px-4 py-1.5 shadow-xl">
                    <span className="text-[9px] font-bold tracking-[0.18em] text-white">
                      SOLVESPHERE
                    </span>
                  </div> */}
                </div>
              </motion.div>

              {/* =========================
                  CITIZEN
              ========================== */}

              <motion.div
                className="absolute left-[20px] top-[72px]"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <NetworkCard item={orbitItems[0]} />
              </motion.div>

              {/* =========================
                  AI
              ========================== */}

              <motion.div
                className="absolute left-1/2 top-[5px] -translate-x-1/2"
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <NetworkCard item={orbitItems[1]} />
              </motion.div>

              {/* =========================
                  GOVERNMENT
              ========================== */}

              <motion.div
                className="absolute right-[20px] top-[72px]"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeInOut",
                }}
              >
                <NetworkCard item={orbitItems[2]} />
              </motion.div>

              {/* =========================
                  UNIVERSITY
              ========================== */}

              <motion.div
                className="absolute bottom-[62px] left-[35px]"
                animate={{
                  y: [0, 9, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  delay: 0.3,
                  ease: "easeInOut",
                }}
              >
                <NetworkCard item={orbitItems[3]} />
              </motion.div>

              {/* =========================
                  INDUSTRY
              ========================== */}

              <motion.div
                className="absolute bottom-[62px] right-[35px]"
                animate={{
                  y: [0, -9, 0],
                }}
                transition={{
                  duration: 4.3,
                  repeat: Infinity,
                  delay: 0.8,
                  ease: "easeInOut",
                }}
              >
                <NetworkCard item={orbitItems[4]} />
              </motion.div>

              {/* =========================
                  SMALL DATA NODES
              ========================== */}

              <motion.div
                className="absolute left-[18%] top-[47%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,.9)]"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              <motion.div
                className="absolute right-[18%] top-[47%] h-2 w-2 rounded-full bg-purple-300 shadow-[0_0_14px_rgba(196,181,253,.9)]"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              />

              <motion.div
                className="absolute bottom-[27%] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                }}
              />
            </div>

            {/* Bottom ecosystem label */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              {/* <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Connected Innovation Ecosystem
                </span>
              </div> */}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulseRing {
          0% {
            transform: scale(0.85);
            opacity: 0.7;
          }

          70% {
            transform: scale(1.3);
            opacity: 0;
          }

          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
      `}</style>

      <AuthRequiredPopup
        key={popupKey}
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
      />
    </section>
  );
};

const NetworkCard = ({ item }) => {
  const Icon = item.icon;
  return (
    <div className="group flex w-[158px] items-center gap-2.5 rounded-2xl border border-white/15 bg-[#081a37]/85 p-2.5 shadow-[0_15px_35px_rgba(0,0,0,.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/30">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white text-xl shadow-lg">
        {typeof Icon === "function" || typeof Icon === "object" ? (
          <Icon size={20} className="text-slate-800" />
        ) : (
          item.icon
        )}

        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#081a37] bg-emerald-400" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[10px] font-bold text-white">
          {item.title}
        </p>

        <p className="mt-0.5 text-[8px] leading-3 text-slate-400">
          {item.sub}
        </p>
      </div>
    </div>
  );
};

export default Hero;
