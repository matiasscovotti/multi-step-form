'use client';

import { PropsWithChildren, useEffect } from 'react';
import { I18nextProvider as Provider } from 'react-i18next';

import i18next, { supportedLanguages } from './index';

interface I18nProviderProps {
  locale?: string;
}

export function I18nProvider({ children, locale }: PropsWithChildren<I18nProviderProps>) {
  useEffect(() => {
    if (locale && supportedLanguages.includes(locale as typeof supportedLanguages[number])) {
      void i18next.changeLanguage(locale);
    }
  }, [locale]);

  return <Provider i18n={i18next}>{children}</Provider>;
}
