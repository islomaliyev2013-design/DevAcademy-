import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

export const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha", short: 'UZ', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
];

const LANGUAGE_STORAGE_KEY = 'devacademy_language';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'uz';
  });

  const setLanguage = (lang) => {
    if (lang === 'uz' || lang === 'ru' || lang === 'en') {
      setLanguageState(lang);
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      } catch (err) {
        console.warn('Failed to save language to localStorage', err);
      }
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  /**
   * Helper function to get translation by dot-path
   * e.g., t('nav.courses', 'Courses')
   */
  const t = (path, fallback = '') => {
    if (!path) return fallback;
    const parts = path.split('.');
    let current = translations[language];

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English if missing in target language
        let fallbackCurrent = translations['en'];
        for (const fbPart of parts) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fbPart in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fbPart];
          } else {
            return fallback || path;
          }
        }
        return fallbackCurrent || fallback || path;
      }
    }

    return current || fallback || path;
  };

  const currentLanguageMeta = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const localize = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') {
      return val[language] || val['uz'] || val['ru'] || val['en'] || Object.values(val)[0] || '';
    }
    return String(val);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        localize,
        languages: LANGUAGES,
        currentLanguageMeta,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
