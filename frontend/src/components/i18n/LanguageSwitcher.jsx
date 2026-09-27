import { useState } from "react";
import { Globe2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSwitcher({ variant = "floating" }) {
  const { language, languages, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  if (variant === "navbar") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:border-emerald-400/60 hover:bg-slate-800"
          aria-label={t("language.change")}
          title={t("language.change")}
        >
          <Globe2 className="h-4 w-4 text-emerald-400" />
          <span className="hidden sm:inline">{languages.find((item) => item.code === language)?.nativeName || t("language.change")}</span>
          <span className="sm:hidden">{language.toUpperCase()}</span>
        </button>

        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[90] cursor-default"
              aria-label="Close language menu"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-11 z-[100] max-h-72 w-48 overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-1 shadow-2xl">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setOpen(false);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-800 ${language === item.code ? "bg-emerald-400/10 text-emerald-300" : "text-white"}`}
                >
                  {item.nativeName}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] text-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-950 px-4 py-2 font-semibold text-white shadow-xl"
      >
        <Globe2 className="h-4 w-4 text-emerald-400" />
        {t("language.change")}
      </button>
      {open && (
        <div className="absolute bottom-12 right-0 max-h-72 w-48 overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-1 shadow-2xl">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setLanguage(item.code);
                setOpen(false);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-800 ${language === item.code ? "bg-emerald-400/10 text-emerald-300" : "text-white"}`}
            >
              {item.nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
