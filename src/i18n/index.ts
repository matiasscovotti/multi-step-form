import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locales/en/common.json';
import es from '@/locales/es/common.json';
import fr from '@/locales/fr/common.json';
import pt from '@/locales/pt/common.json';

const resources = {
  en: { common: en },
  es: { common: es },
  fr: { common: fr },
  pt: { common: pt }
} as const;

export const supportedLanguages = Object.keys(resources) as Array<keyof typeof resources>;

const fallbackLng = 'en';

const detectionOptions = {
  order: ['querystring', 'localStorage', 'sessionStorage', 'navigator'],
  caches: ['localStorage']
};

if (!i18next.isInitialized) {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng,
      supportedLngs: supportedLanguages,
      defaultNS: 'common',
      ns: ['common'],
      interpolation: {
        escapeValue: false
      },
      detection: detectionOptions
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to initialise i18next', error);
    });
}

export default i18next;
