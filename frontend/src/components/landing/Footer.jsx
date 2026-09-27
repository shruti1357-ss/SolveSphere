
import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer id="about" className="bg-[#06132d] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400">
                <span className="text-sm font-black text-slate-950">S</span>
              </div>

              <span className="font-bold">
                Solve<span className="text-emerald-400">Sphere</span>
              </span>
            </div>

            <p className="mt-4 max-w-xs text-[10px] leading-5 text-slate-400">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-bold">{t("footer.platform")}</h3>

            <div className="mt-4 space-y-2 text-[10px] text-slate-400">
              <a href="#challenges" className="block hover:text-white">
                {t("nav.challenges")}
              </a>
              <a href="#how-it-works" className="block hover:text-white">
                {t("nav.howItWorks")}
              </a>
              <a href="#" className="block hover:text-white">
                {t("nav.impact")}
              </a>
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xs font-bold">{t("footer.community")}</h3>

            <div className="mt-4 space-y-2 text-[10px] text-slate-400">
              <a href="#" className="block hover:text-white">
                {t("footer.students")}
              </a>
              <a href="#" className="block hover:text-white">
                {t("footer.mentors")}
              </a>
              <a href="#" className="block hover:text-white">
                {t("footer.organizations")}
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold">{t("footer.company")}</h3>

            <div className="mt-4 space-y-2 text-[10px] text-slate-400">
              <a href="#about" className="block hover:text-white">
                {t("footer.about")}
              </a>
              <a href="#" className="block hover:text-white">
                {t("footer.careers")}
              </a>
              <a href="#" className="block hover:text-white">
                {t("footer.contact")}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-700 pt-5 sm:flex-row">
          <div className="text-[9px] text-slate-500">
            {t("footer.rights")}
          </div>

          <div className="flex gap-4 text-[10px] text-slate-400">
            <a href="#" className="hover:text-white">
              {t("footer.privacy")}
            </a>
            <a href="#" className="hover:text-white">
              {t("footer.terms")}
            </a>
          </div>

          <div className="flex gap-3">
            <a
              href="#"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] hover:bg-emerald-500"
            >
              𝕏
            </a>

            <a
              href="#"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] hover:bg-emerald-500"
            >
              in
            </a>

            <a
              href="#"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] hover:bg-emerald-500"
            >
              ◎
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
