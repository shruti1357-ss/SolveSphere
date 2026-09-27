import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LANGUAGES, translations } from "../i18n/translations";

export const LANGUAGE_STORAGE_KEY = "solvesphere_language";
const LanguageContext = createContext(null);

const getSavedLanguage = () => {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (!savedLanguage) return null;
  if (translations[savedLanguage]) return savedLanguage;
  localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  return null;
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getSavedLanguage);

  const setLanguage = useCallback((nextLanguage) => {
    if (!translations[nextLanguage]) return;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  const t = useCallback((key, values = {}) => {
    const catalog = translations[language] || translations.en;
    // A locale is required to own every key. Never silently fall back to another
    // human language: that creates mixed-language screens and masks bad catalogs.
    let text = catalog[key] || translations.en?.[key] || key;
    Object.entries(values).forEach(([name, value]) => { text = text.replaceAll(`{{${name}}}`, String(value)); });
    return text;
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language || "en";
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t, languages: LANGUAGES, hasSelectedLanguage: Boolean(language) }), [language, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
