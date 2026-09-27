import { motion } from "motion/react";
import { FiFileText, FiCpu, FiShield, FiBookOpen, FiUsers, FiZap, FiTrendingUp } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

const getSteps = (t) => [
  {
    number: "1",
    icon: FiFileText,
    title: t("landing.workflow.report.title"), description: t("landing.workflow.report.description"),
    color: "bg-blue-50 text-blue-500",
  },
  {
    number: "2",
    icon: FiCpu,
    title: t("landing.workflow.ai.title"), description: t("landing.workflow.ai.description"),
    color: "bg-purple-50 text-purple-500",
  },
  {
    number: "3",
    icon: FiShield,
    title: t("landing.workflow.validation.title"), description: t("landing.workflow.validation.description"),
    color: "bg-indigo-50 text-indigo-500",
  },
  {
    number: "4",
    icon: FiBookOpen,
    title: t("landing.workflow.matching.title"), description: t("landing.workflow.matching.description"),
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    number: "5",
    icon: FiUsers,
    title: t("landing.workflow.collaboration.title"), description: t("landing.workflow.collaboration.description"),
    color: "bg-orange-50 text-orange-500",
  },
  {
    number: "6",
    icon: FiZap,
    title: t("landing.workflow.solution.title"), description: t("landing.workflow.solution.description"),
    color: "bg-pink-50 text-pink-500",
  },
  {
    number: "7",
    icon: FiTrendingUp,
    title: t("landing.workflow.impact.title"), description: t("landing.workflow.impact.description"),
    color: "bg-green-50 text-green-500",
  },
];

const HowItWorks = () => {
  const { t } = useLanguage();
  const steps = getSteps(t);
  return (
    <section
      id="how-it-works"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADING */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-center"
        >
          <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-500">
            {t("landing.workflow.eyebrow")}
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t("landing.workflow.title")}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            {t("landing.workflow.description")}
          </p>
        </motion.div>


        {/* STEPS GRID */}
        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="relative text-center"
                initial={{
                  opacity: 0,
                  y: 60,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.12,
                  ease: "easeOut",
                }}
              >

                {/* CONNECTOR */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-[62%] top-10 hidden w-[90%] border-t border-dashed border-slate-300 xl:block" />
                )}


                {/* ICON */}
                <motion.div
                  className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-full ${step.color} text-3xl shadow-sm`}
                  whileHover={{
                    scale: 1.08,
                    y: -4,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                >
                  <Icon size={28} />

                  {/* Number */}
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-600 shadow-md">
                    {step.number}
                  </span>
                </motion.div>

                {/* TITLE */}
                <h3 className="mt-6 text-base font-bold leading-tight text-slate-800 sm:text-lg">
                  {step.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {step.description}
                </p>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
