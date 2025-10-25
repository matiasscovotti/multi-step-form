'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField } from '../FormField';
import { TextInput } from '../inputs/TextInput';
import { FormValues } from '../../schema';

export function PersonalStep() {
  const { i18n, t } = useTranslation();
  const {
    register,
    formState: { errors }
  } = useFormContext<FormValues>();

  const personalErrors = errors.personal ?? {};

  return (
    <div className="grid grid-cols-1 gap-5">
      <FormField
        label={t('fields.firstName.label')}
        error={personalErrors.firstName?.message ? t(personalErrors.firstName.message) : undefined}
        htmlFor="firstName"
      >
        <TextInput
          id="firstName"
          placeholder={t('fields.firstName.placeholder')}
          hasError={!!personalErrors.firstName}
          {...register('personal.firstName')}
        />
      </FormField>

      <FormField
        label={t('fields.lastName.label')}
        error={personalErrors.lastName?.message ? t(personalErrors.lastName.message) : undefined}
        htmlFor="lastName"
      >
        <TextInput
          id="lastName"
          placeholder={t('fields.lastName.placeholder')}
          hasError={!!personalErrors.lastName}
          {...register('personal.lastName')}
        />
      </FormField>

      <FormField
        label={t('fields.email.label')}
        error={personalErrors.email?.message ? t(personalErrors.email.message) : undefined}
        htmlFor="email"
      >
        <TextInput
          id="email"
          type="email"
          placeholder={t('fields.email.placeholder')}
          hasError={!!personalErrors.email}
          autoComplete="email"
          {...register('personal.email')}
        />
      </FormField>
    </div>
  );
}
