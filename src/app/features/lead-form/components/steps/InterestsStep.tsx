'use client';

import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CheckIcon } from '@radix-ui/react-icons';

import { FormField } from '../FormField';
import { TextInput } from '../inputs/TextInput';
import { FormValues } from '../../schema';
import { interestOptions, levelOptions } from '../../constants';

export function InterestsStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<FormValues>();
  const { t } = useTranslation();

  const interestsErrors = errors.interests ?? {};

  const selectedInterests = watch('interests.areas') || [];
  const selectedLevels = watch('interests.levels') || [];

  useEffect(() => {
    register('interests.areas');
    register('interests.levels');
  }, [register]);

  const interestTranslations = useMemo(
    () =>
      interestOptions.map((option) => ({
        value: option,
        label: t(`fields.interests.options.${option}`)
      })),
    [t]
  );

  const levelTranslations = useMemo(
    () =>
      levelOptions.map((option) => ({
        value: option,
        label: t(`fields.level.options.${option}`)
      })),
    [t]
  );

  const toggleInterest = (value: string) => {
    const currentArray = Array.isArray(selectedInterests) ? selectedInterests : [];
    const current = new Set(currentArray);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    setValue('interests.areas', Array.from(current), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  const toggleLevel = (value: string) => {
    const currentArray = Array.isArray(selectedLevels) ? selectedLevels : [];
    const current = new Set(currentArray);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    setValue('interests.levels', Array.from(current), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  return (
    <div className="space-y-6">
      <FormField
        label={t('fields.interests.label')}
        error={interestsErrors.areas?.message ? t(interestsErrors.areas.message) : undefined}
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
          {interestTranslations.map((option) => {
            const isSelected = Array.isArray(selectedInterests) && selectedInterests.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleInterest(option.value)}
                className={`flex min-h-[56px] min-w-0 items-center gap-4 rounded-lg border px-4 py-4 text-left text-sm sm:text-base font-medium transition-colors ${
                  isSelected
                    ? 'border-white bg-primary/10 text-denim shadow-sm'
                    : 'border-border-grey bg-white text-denim hover:border-primary/40'
                }`}
                aria-pressed={isSelected}
              >
                <span
                  aria-hidden
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    isSelected ? 'border-white bg-primary text-white' : 'border-border-grey'
                  }`}
                >
                  {isSelected ? <CheckIcon className="h-3 w-3" /> : null}
                </span>
                <span className="flex-1 whitespace-normal leading-snug">{option.label}</span>
              </button>
            );
          })}
        </div>
      </FormField>

      {Array.isArray(selectedInterests) && selectedInterests.includes('other') ? (
        <FormField
          label={t('fields.interests.otherPlaceholder')}
          error={interestsErrors.other?.message ? t(interestsErrors.other.message) : undefined}
          htmlFor="otherInterest"
        >
          <TextInput
            id="otherInterest"
            placeholder={t('fields.interests.otherPlaceholder')}
            hasError={!!interestsErrors.other}
            {...register('interests.other')}
          />
        </FormField>
      ) : null}

      <FormField
        label={t('fields.level.label')}
        error={interestsErrors.levels?.message ? t(interestsErrors.levels.message) : undefined}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {levelTranslations.map((option) => {
            const isSelected = Array.isArray(selectedLevels) && selectedLevels.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleLevel(option.value)}
                className={`flex items-center gap-4 rounded-lg border px-4 py-4 text-left text-sm sm:text-base font-medium transition-colors ${
                  isSelected
                    ? 'border-white bg-primary/10 text-denim shadow-sm'
                    : 'border-border-grey bg-white text-denim hover:border-primary/40'
                }`}
                aria-pressed={isSelected}
              >
                <span
                  aria-hidden
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    isSelected ? 'border-white bg-primary text-white' : 'border-border-grey'
                  }`}
                >
                  {isSelected ? <CheckIcon className="h-3 w-3" /> : null}
                </span>
                <span className="flex-1">{option.label}</span>
              </button>
            );
          })}
        </div>
      </FormField>
    </div>
  );
}
