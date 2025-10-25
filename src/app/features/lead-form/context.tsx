'use client';

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FormStepId, FORM_STEPS } from './schema';

export interface LeadFormContextValue {
  currentStepIndex: number;
  currentStep: typeof FORM_STEPS[number];
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (stepId: FormStepId) => void;
  submissionId: string;
  setSubmissionId: (id: string) => void;
}

const LeadFormContext = createContext<LeadFormContextValue | undefined>(undefined);

const STEP_COOKIE_KEY = 'lead-form-step';
const STEP_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function readStepCookie() {
  if (typeof document === 'undefined') {
    return 0;
  }

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${STEP_COOKIE_KEY}=`));

  if (!match) {
    return 0;
  }

  const value = Number.parseInt(match.split('=')[1] ?? '0', 10);
  return Number.isNaN(value) ? 0 : value;
}

export function LeadFormProvider({ children }: PropsWithChildren) {
  const [currentIndex, setCurrentIndex] = useState(() => readStepCookie());
  const [submissionId, setSubmissionId] = useState(() => uuidv4());

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const clampedIndex = Math.max(0, Math.min(currentIndex, FORM_STEPS.length - 1));
    document.cookie = `${STEP_COOKIE_KEY}=${clampedIndex}; path=/; max-age=${STEP_COOKIE_MAX_AGE}`;
  }, [currentIndex]);

  const value = useMemo<LeadFormContextValue>(() => {
    const totalSteps = FORM_STEPS.length;

    return {
      currentStepIndex: currentIndex,
      currentStep: FORM_STEPS[currentIndex],
      totalSteps,
      goToNextStep: () => {
        setCurrentIndex((prev) => Math.min(prev + 1, totalSteps - 1));
      },
      goToPreviousStep: () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      },
      goToStep: (stepId: FormStepId) => {
        const targetIndex = FORM_STEPS.findIndex((step) => step.id === stepId);
        if (targetIndex >= 0) {
          setCurrentIndex(targetIndex);
        }
      },
      submissionId,
      setSubmissionId
    };
  }, [currentIndex, submissionId]);

  return <LeadFormContext.Provider value={value}>{children}</LeadFormContext.Provider>;
}

export function useLeadForm() {
  const context = useContext(LeadFormContext);

  if (!context) {
    throw new Error('useLeadForm must be used within LeadFormProvider');
  }

  return context;
}
