'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import en from 'react-phone-number-input/locale/en';

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
  const { getValues, reset, setValue, watch } = useFormContext<FormValues>();

  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const COOKIE_KEYS = {
    personal: 'lead-form-personal',
    contact: 'lead-form-contact',
    interests: 'lead-form-interests'
  } as const;

  const writeCookie = (key: string, value: unknown) => {
    try {
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString();
      document.cookie = `${key}=${encodeURIComponent(JSON.stringify(value))}; path=/; expires=${expires}`;
    } catch (error) {
      console.warn('[LeadForm] Failed to write cookie', key, error);
    }
  };

  const readCookie = (key: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${key}=`));

    if (!match) {
      return null;
    }

    try {
      return JSON.parse(decodeURIComponent(match.split('=')[1] ?? ''));
    } catch (error) {
      console.warn('[LeadForm] Failed to parse cookie', key, error);
      return null;
    }
  };

  const clearCookie = (key: string) => {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  useEffect(() => {
    const personal = readCookie(COOKIE_KEYS.personal);
    const contact = readCookie(COOKIE_KEYS.contact);
    const interests = readCookie(COOKIE_KEYS.interests);

    if (personal) {
      setValue('personal.firstName', personal.firstName ?? '');
      setValue('personal.lastName', personal.lastName ?? '');
      setValue('personal.email', personal.email ?? '');
    }

    if (contact) {
      setValue('contact.phone', contact.phone ?? '');
      setValue('contact.role', contact.role ?? '');
      setValue('contact.organization', contact.organization ?? '');
      setValue('contact.country', contact.country ?? 'AR');
    }

    if (interests) {
      setValue('interests.areas', Array.isArray(interests.areas) ? interests.areas : []);
      setValue('interests.other', interests.other ?? '');
      setValue('interests.levels', Array.isArray(interests.levels) ? interests.levels : []);
    }
  }, []);

  useEffect(() => {
    const subscription = watch((values) => {
      writeCookie(COOKIE_KEYS.personal, values.personal);
      writeCookie(COOKIE_KEYS.contact, values.contact);
      writeCookie(COOKIE_KEYS.interests, values.interests);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

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
    const countryCode = payload.contact?.country as keyof typeof en | undefined;
    const contactCountryName = countryCode ? en[countryCode] ?? payload.contact?.country : payload.contact?.country;
    const submissionPayload = {
      ...payload,
      contact_country: contactCountryName
    };
    console.log('[LeadForm] Submitting payload', submissionPayload);

    try {
      setSubmissionStatus('submitting');
      setSubmissionError(null);

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionPayload)
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
      clearCookie(COOKIE_KEYS.personal);
      clearCookie(COOKIE_KEYS.contact);
      clearCookie(COOKIE_KEYS.interests);
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
    clearCookie(COOKIE_KEYS.personal);
    clearCookie(COOKIE_KEYS.contact);
    clearCookie(COOKIE_KEYS.interests);
  };

  const CurrentStepComponent = useMemo(() => stepComponents[currentStep.id], [currentStep.id]);

  return (
    <main
      className={`
          page-fade-in flex h-screen flex-col overflow-hidden
          sm:flex-row sm:px-3 sm:py-2 sm:pr-0
        `}
    >
      <aside className="sm:sticky sm:top-2 sm:h-[calc(100vh-1rem)] sm:mr-4">
        <LeadFormSidebar isReviewCompleted={isSuccess} />
      </aside>
      <div className="flex flex-1 overflow-hidden sm:mx-auto sm:max-w-[760px]">
        <div className="flex h-full w-full min-h-0 flex-col gap-4 pt-4 sm:gap-3 sm:pt-0">
          <div className="scroll-area flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom,0px)+104px)] sm:pb-0">
            <Form.Card>
              {isSuccess ? (
                <div key="success" className="step-transition flex flex-col items-center gap-4 py-12 text-center">
                  <div className="success-check flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl text-white">
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
                <div key={currentStep.id} className="step-transition flex flex-col gap-6 sm:gap-8">
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
              className="mt-auto sm:mt-0"
            />
          )}
        </div>
      </div>
    </main>
  );
}
