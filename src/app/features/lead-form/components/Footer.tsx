'use client';

import { useTranslation } from 'react-i18next';

import { useStepNavigation } from '../hooks';

interface LeadFormFooterProps {
  onNext: () => void | Promise<void>;
  onPrevious: () => void;
  className?: string;
  isSubmitting?: boolean;
}

export function LeadFormFooter({ onNext, onPrevious, className = '', isSubmitting = false }: LeadFormFooterProps) {
  const { t } = useTranslation();
  const { currentStepIndex, totalSteps } = useStepNavigation();

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <footer
      className={`sticky bottom-0 flex w-full items-center justify-between gap-4 border-t border-border-grey/60 bg-white/90 p-4 backdrop-blur-sm sm:px-6 sm:py-6 ${className}`}
    >
      <button
        onClick={onPrevious}
        className={`border-none bg-transparent text-sm text-grey font-medium hover:text-denim transition-colors ${isFirstStep ? 'invisible' : 'visible'} sm:text-base`}
        type="button"
      >
        {t('buttons.back')}
      </button>
      <button
        onClick={onNext}
        disabled={isSubmitting}
        className={`py-3 px-6 rounded text-sm sm:text-base font-semibold text-white transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed`}
        style={{ backgroundColor: '#2A205E' }}
        onMouseEnter={(e) => {
          if (isSubmitting) return;
          e.currentTarget.style.backgroundColor = '#1e1742';
        }}
        onMouseLeave={(e) => {
          if (isSubmitting) return;
          e.currentTarget.style.backgroundColor = '#2A205E';
        }}
        type="button"
      >
        {t(isLastStep ? 'buttons.submit' : 'buttons.next')}
      </button>
    </footer>
  );
}
