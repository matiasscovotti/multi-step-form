'use client';

import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
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

export function LeadFormProvider({ children }: PropsWithChildren) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissionId, setSubmissionId] = useState(() => uuidv4());

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
