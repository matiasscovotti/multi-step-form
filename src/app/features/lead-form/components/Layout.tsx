'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Form from '@/app/components/Form';

import { useLeadForm } from '../context';
import { useStepCompletion, useStepNavigation } from '../hooks';
import { LanguageSelector } from './LanguageSelector';
import { LeadFormFooter } from './Footer';
import { LeadFormSidebar } from './Sidebar';

import { PersonalStep } from './steps/PersonalStep';
import { ContactStep } from './steps/ContactStep';
import { InterestsStep } from './steps/InterestsStep';
import { ReviewStep } from './steps/ReviewStep';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../schema';

const stepComponents = {
  personal: PersonalStep,
  contact: ContactStep,
  interests: InterestsStep,
  review: ReviewStep
} as const;

export function LeadFormLayout() {
  const { currentStep, goToStep, setSubmissionId } = useLeadForm();
  const { t } = useTranslation();
  const { validateFields } = useStepCompletion();
  const { goToNextStep, goToPreviousStep } = useStepNavigation();
  const { getValues, reset } = useFormContext<FormValues>();

  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const isSuccess = submissionStatus === 'success';

  const handleNext = async () => {
    if (submissionStatus === 'submitting') return;

    const isValid = await validateFields(currentStep.fields);
    if (!isValid) return;

    const isLastStep = currentStep.id === 'review';

    if (!isLastStep) {
      goToNextStep();
      return;
    }

    const payload = getValues();
    console.log('[LeadForm] Submitting payload', payload);

    try {
      setSubmissionStatus('submitting');
      setSubmissionError(null);

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let responseBody: any = null;
      try {
        responseBody = await response.json();
      } catch (parseError) {
        console.warn('[LeadForm] Could not parse webhook response JSON', parseError);
      }

      console.log('[LeadForm] Submission response', response.status, responseBody);

      if (!response.ok || responseBody?.success === false) {
        throw new Error(responseBody?.error || `Request failed with status ${response.status}`);
      }

      setSubmissionStatus('success');
      // Generate a new submission identifier for potential future submissions
      setSubmissionId(crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
      reset();
    } catch (error) {
      console.error('[LeadForm] Submission error', error);
      setSubmissionStatus('error');
      setSubmissionError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  const handleResetForm = () => {
    reset();
    goToStep('personal');
    setSubmissionStatus('idle');
    setSubmissionError(null);
    setSubmissionId(crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
  };

  const CurrentStepComponent = useMemo(() => stepComponents[currentStep.id], [currentStep.id]);

  return (
    <main
      className={`
          flex flex-col min-h-screen m-0 overflow-hidden
          sm:flex-row sm:m-4 sm:mr-0 sm:min-h-[calc(100vh-32px)]
        `}
    >
      <aside className="sm:sticky sm:top-4 sm:h-[calc(100vh-32px)] sm:mr-4">
        <LeadFormSidebar />
      </aside>
      <div className="flex flex-1 sm:max-w-[760px] sm:flex-0 sm:mx-auto">
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto pb-32 pt-6 sm:pb-28">
          <div className="flex-1">
            <Form.Card>
              {isSuccess ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl text-white">
                    ✓
                  </div>
                  <h2 className="text-xl font-semibold text-denim sm:text-2xl">
                    {t('confirmation.title')}
                  </h2>
                  <p className="max-w-md text-sm text-grey sm:text-base">
                    {t('confirmation.description')}
                  </p>
                  <button
                    onClick={handleResetForm}
                    className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary/90"
                    type="button"
                  >
                    {t('confirmation.cta')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6 sm:gap-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <Form.Header
                      title={t(`${currentStep.translationKey}.title`)}
                      description={t(`${currentStep.translationKey}.description`)}
                    />
                    <LanguageSelector />
                  </div>

                  <div className="flex flex-col gap-5">
                    <CurrentStepComponent />
                  </div>
                </div>
              )}
            </Form.Card>
          </div>

          {!isSuccess && submissionStatus === 'error' && submissionError ? (
            <div className="px-4 text-center text-sm text-red sm:px-6">{submissionError}</div>
          ) : null}

          {!isSuccess && (
            <LeadFormFooter
              onNext={handleNext}
              onPrevious={goToPreviousStep}
              isSubmitting={submissionStatus === 'submitting'}
            />
          )}
        </div>
      </div>
    </main>
  );
}
