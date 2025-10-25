'use client';

import { useEffect, useRef, useState } from 'react';
import { CaretDownIcon, CheckIcon, GlobeIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '@/i18n';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../schema';

const languageLabels: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  pt: 'Português'
};

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const { setValue, watch } = useFormContext<FormValues>();

  const selectedLanguage = watch('language');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleSelect(language: string) {
    setValue('language', language as FormValues['language'], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false
    });
    void i18n.changeLanguage(language);
    setIsOpen(false);
  }

  const selectedLabel = languageLabels[selectedLanguage] ?? selectedLanguage.toUpperCase();

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
          isOpen ? 'ring-2 ring-primary/40' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <GlobeIcon className="h-4 w-4" aria-hidden />
        <span>{selectedLabel}</span>
        <CaretDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {isOpen ? (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-border-grey bg-white shadow-lg"
        >
          {supportedLanguages.map((language) => {
            const label = languageLabels[language] ?? language.toUpperCase();
            const isActive = language === selectedLanguage;

            return (
              <li key={language}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(language)}
                  className={`flex w-full items-center justify-between px-4 py-2 text-sm transition-colors ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-denim hover:bg-bg'
                  }`}
                >
                  <span>{label}</span>
                  {isActive ? <CheckIcon className="h-4 w-4" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
