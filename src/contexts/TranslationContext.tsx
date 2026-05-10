import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translate, type LanguageId, DEFAULT_LANGUAGE, TRANSLATIONS, type TranslationMap } from '../utils/translations';

interface TranslationContextType {
  language: LanguageId;
  setLanguage: (lang: LanguageId) => void;
  translations: TranslationMap;
  t: (text: string, params?: Record<string, string>) => string;
  updateTranslation: (lang: LanguageId, key: string, value: string) => void;
  addTranslationKey: (key: string) => void;
  deleteTranslationKey: (key: string) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageId>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<TranslationMap>(TRANSLATIONS);

  const updateTranslation = useCallback((lang: LanguageId, key: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  }, []);

  const addTranslationKey = useCallback((key: string) => {
    setTranslations(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(lang => {
        next[lang as LanguageId] = {
          ...next[lang as LanguageId],
          [key]: ''
        };
      });
      return next;
    });
  }, []);

  const deleteTranslationKey = useCallback((key: string) => {
    setTranslations(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(lang => {
        const langId = lang as LanguageId;
        const newLangTranslations = { ...next[langId] };
        delete newLangTranslations[key];
        next[langId] = newLangTranslations;
      });
      return next;
    });
  }, []);

  const t = useCallback((text: string, params?: Record<string, string>) => {
    return translate(text, language, params, translations);
  }, [language, translations]);

  return (
    <TranslationContext.Provider value={{ 
      language, 
      setLanguage, 
      translations, 
      t, 
      updateTranslation, 
      addTranslationKey, 
      deleteTranslationKey 
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
