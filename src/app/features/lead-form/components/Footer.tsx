'use client';

import Image from 'next/image';
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
        className={`flex items-center justify-center gap-2 rounded px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:text-base`}
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
        {isSubmitting ? (
          <>
            <Image src="/images/anibot.gif" alt="Loading" width={28} height={28} className="h-7 w-7" priority />
            <span>{t(isLastStep ? 'buttons.submit' : 'buttons.next')}</span>
          </>
        ) : (
          t(isLastStep ? 'buttons.submit' : 'buttons.next')
        )}
      </button>
    </footer>
  );
}
