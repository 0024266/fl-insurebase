import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDict, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationDict) => string;
  isSpanish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'agency_directory_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en') return saved;
      // Auto-detect browser language
      if (typeof navigator !== 'undefined' && navigator.language?.startsWith('es')) {
        return 'es';
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore localStorage errors
    }
  };

  // Sync document lang attribute and SEO meta tags when language changes
  useEffect(() => {
    document.documentElement.lang = language;

    if (language === 'es') {
      document.title = 'Directorio de Cláusulas de Hipoteca y Permisos de Florida | Portal de Seguros';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Portal integral de seguros para búsqueda de cláusulas de acreedor hipotecario ISAOA/ATIMA, tasadores de propiedad en Florida y oficinas de permisos de construcción.'
        );
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', 'Directorio de Cláusulas de Hipoteca y Permisos de Florida');
      }
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute(
          'content',
          'Portal integral de seguros para búsqueda de cláusulas de acreedor hipotecario ISAOA/ATIMA, tasadores de propiedad en Florida y oficinas de permisos de construcción.'
        );
      }
    } else {
      document.title = 'Mortgagee Clause & Florida Permit Directory | Insurance Portal';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Dual-directory insurance portal for Mortgagee clauses, ISAOA/ATIMA tracking, and Florida Property Appraiser & Municipal Building Permit lookup.'
        );
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', 'Mortgagee Clause & Florida Permit Directory');
      }
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute(
          'content',
          'Dual-directory insurance portal for Mortgagee clauses, ISAOA/ATIMA tracking, and Florida Property Appraiser & Municipal Building Permit lookup.'
        );
      }
    }
  }, [language]);

  const t = (key: keyof TranslationDict): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isSpanish: language === 'es'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
