'use client';

import { useCallback } from 'react';
import { useLeadForm } from './context';
import { FormStepField, FORM_STEPS } from './schema';

import { useFormContext } from 'react-hook-form';

export function useStepNavigation() {
  const { currentStepIndex, goToNextStep, goToPreviousStep, currentStep, totalSteps } = useLeadForm();

  return {
    currentStepIndex,
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep
  };
}

export function useStepCompletion() {
  const { trigger, formState } = useFormContext();

  const validateFields = useCallback(
    async (fields: FormStepField[]) => {
      if (!fields.length) {
        return true;
      }

      const result = await trigger(fields as unknown as Parameters<typeof trigger>[0], {
        shouldFocus: true
      });

      return result;
    },
    [trigger]
  );

  return {
    validateFields,
    formState
  };
}

export function useLeadFormSteps() {
  return FORM_STEPS;
}
