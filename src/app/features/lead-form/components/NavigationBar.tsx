'use client';

import { useTranslation } from 'react-i18next';

interface NavigationBarProps {
  onNext: () => void | Promise<void>;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function NavigationBar({ onNext, onPrevious, isFirstStep, isLastStep }: NavigationBarProps) {
  const { t } = useTranslation();

  return (
    <nav className="sticky bottom-0 z-10 bg-white border-t border-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <button
          type="button"
          className={`text-sm sm:text-base font-medium text-grey hover:text-denim transition-colors ${isFirstStep ? 'opacity-0 pointer-events-none' : ''}`}
          onClick={onPrevious}
        >
          {t('buttons.back')}
        </button>

        <button
          type="button"
          className="px-5 py-3 rounded-lg text-sm sm:text-base font-semibold text-white transition-colors bg-primary hover:bg-primary/90"
          onClick={onNext}
        >
          {t(isLastStep ? 'buttons.submit' : 'buttons.next')}
        </button>
      </div>
    </nav>
  );
}
