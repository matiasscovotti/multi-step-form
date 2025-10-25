'use client';

import { useTranslation } from 'react-i18next';

interface ProgressIndicatorProps {
  currentStepIndex: number;
  totalSteps: number;
  stepTitle: string;
}

export function ProgressIndicator({ currentStepIndex, totalSteps, stepTitle }: ProgressIndicatorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-light-blue">
        {t('progress.label', { current: currentStepIndex + 1, total: totalSteps })}
      </span>
      <strong className="text-base sm:text-lg text-denim font-semibold leading-5">{stepTitle}</strong>
    </div>
  );
}
