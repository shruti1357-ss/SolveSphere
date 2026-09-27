import { motion } from "motion/react";
import { FiFileText, FiShield, FiUsers, FiBriefcase, FiAward, FiTrendingUp } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

const getFeatures = (t) => [
  {
    icon: FiFileText,
    title: t("landing.features.reporting.title"), description: t("landing.features.reporting.description"),
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: FiShield,
    title: t("landing.features.verification.title"), description: t("landing.features.verification.description"),
    color: "bg-purple-50 text-purple-500",
  },
  {
    icon: FiUsers,
    title: t("landing.features.team.title"), description: t("landing.features.team.description"),
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    icon: FiBriefcase,
    title: t("landing.features.mentorship.title"), description: t("landing.features.mentorship.description"),
    color: "bg-orange-50 text-orange-500",
  },
  {
    icon: FiAward,
    title: t("landing.features.evaluation.title"), description: t("landing.features.evaluation.description"),
    color: "bg-pink-50 text-pink-500",
  },
  {
    icon: FiTrendingUp,
    title: t("landing.features.impact.title"), description: t("landing.features.impact.description"),
    color: "bg-green-50 text-green-500",
  },
];

const Features = () => {
  const { t } = useLanguage();
  const features = getFeatures(t);
  return (
    <section
      id="challenges"
      className="bg-slate-50 px-6 py-20"
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
            {t("landing.features.eyebrow")}
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t("landing.features.title")}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            {t("landing.features.description")}
          </p>
        </motion.div>


        {/* FEATURE GRID */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-md"
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
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -6,
                }}
              >
                {/* Icon */}
                <motion.div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${feature.color} text-2xl shadow-sm`}
                  whileHover={{
                    scale: 1.08,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <Icon size={24} />
                </motion.div>

                {/* Title */}
                <h3 className="mt-5 text-base font-bold text-slate-800 sm:text-lg">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
