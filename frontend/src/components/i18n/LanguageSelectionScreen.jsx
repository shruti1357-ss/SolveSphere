import { useMemo, useState } from "react";
import { Check, ChevronRight, Globe2, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSelectionScreen({ onLanguageSelected }) {
  const { language: currentLang, languages, setLanguage } = useLanguage();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(currentLang || "en");
  const shouldReduceMotion = useReducedMotion();

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return languages;
    return languages.filter((language) =>
      `${language.name} ${language.nativeName}`.toLowerCase().includes(normalizedQuery)
    );
  }, [languages, query]);

  const handleContinue = () => {
    const nextLanguage = selected || "en";
    setLanguage(nextLanguage);
    onLanguageSelected?.(nextLanguage);
  };

  return (
    <main className="fixed inset-0 z-[9998] flex min-h-screen items-center justify-center overflow-hidden bg-[#06132d] px-4 py-6 text-white sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(52,211,153,0.13) 0%, transparent 70%)", filter: "blur(70px)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)", filter: "blur(75px)" }} />

      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18, scale: shouldReduceMotion ? 1 : 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex max-h-[calc(100vh-3rem)] w-full max-w-[560px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1d3a]/95 shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
      >
        <div className="px-6 pb-5 pt-7 text-center sm:px-8 sm:pt-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.10)]">
            <Globe2 className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">Select Language</h1>
          <p className="mt-2 text-sm text-slate-300 sm:text-[15px]">Choose your preferred language for the portal.</p>
        </div>

        <div className="px-6 sm:px-8">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search languages..."
              aria-label="Search languages"
              className="w-full rounded-2xl border border-white/10 bg-[#07172f] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
            />
          </label>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-6 pb-2 sm:px-8">
          <div className="space-y-2.5 pr-1">
            {filteredLanguages.map((language) => {
              const isSelected = selected === language.code;
              return (
                <motion.button
                  key={language.code}
                  type="button"
                  onClick={() => setSelected(language.code)}
                  whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 sm:px-5 ${isSelected ? "border-cyan-300/45 bg-cyan-300/[0.10] shadow-[0_0_28px_rgba(34,211,238,0.08)]" : "border-white/10 bg-[#0a1a34] hover:border-white/20 hover:bg-[#0d2241]"}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-base font-semibold text-white sm:text-[17px]">{language.nativeName}</span>
                    <span className="mt-0.5 block truncate text-xs text-slate-400 sm:text-sm">{language.name}</span>
                  </span>
                  <span className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${isSelected ? "border-cyan-200 bg-cyan-200 text-[#06203a]" : "border-slate-500/60 bg-transparent text-transparent"}`} aria-hidden="true">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </motion.button>
              );
            })}
            {filteredLanguages.length === 0 && <div className="rounded-2xl border border-white/10 bg-[#0a1a34] px-5 py-8 text-center text-sm text-slate-400">No language found.</div>}
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#091a35]/80 px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={handleContinue}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3.5 text-sm font-bold text-[#06203a] shadow-[0_12px_30px_rgba(34,211,238,0.16)] transition-all hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200/60 focus:ring-offset-2 focus:ring-offset-[#091a35]"
          >
            Continue
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </motion.section>
    </main>
  );
}
