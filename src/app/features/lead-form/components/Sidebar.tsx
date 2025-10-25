'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { Step } from '@/app/components/Sidebar/Step';

import { useLeadFormSteps, useStepNavigation } from '../hooks';

export function LeadFormSidebar() {
  const steps = useLeadFormSteps();
  const { currentStepIndex } = useStepNavigation();
  const { t } = useTranslation();

  return (
    <div
      className="
      flex flex-col items-center justify-start gap-4 pt-8 h-[200px] w-full bg-no-repeat bg-cover bg-[url('/images/bg-sidebar-mobile.svg')] 
      sm:items-start sm:gap-8 sm:p-8 sm:w-[274px] sm:h-[calc(100vh-32px)] sm:bg-[url('/images/bg-sidebar-desktop.svg')] sm:rounded-lg sm:bg-center"
    >
      <Image
        src="/images/logo_blanco.svg"
        alt="Educabot Logo"
        width={192}
        height={48}
        className="h-12 w-auto sm:mb-4"
        priority
      />

      <div className="flex flex-row justify-center gap-3 sm:flex-col sm:justify-start sm:gap-8">
        {steps.map((step, index) => (
          <Step
            key={step.id}
            step={{
              number: index + 1,
              title: t(`${step.translationKey}.title`).toUpperCase(),
              label: t('progress.stepLabel', { number: index + 1 })
            }}
            isActive={index === currentStepIndex}
            isCompleted={index < currentStepIndex}
          />
        ))}
      </div>
    </div>
  );
}
