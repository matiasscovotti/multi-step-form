'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { LeadFormProvider } from './context';
import { formSchema, FormValues } from './schema';
import { LeadFormLayout } from './components/Layout';

const defaultValues: FormValues = {
  language: 'es',
  personal: {
    firstName: '',
    lastName: '',
    email: ''
  },
  contact: {
    phone: '',
    role: '',
    organization: ''
  },
  interests: {
    areas: [],
    other: '',
    levels: []
  }
};

export function LeadForm() {
  const { i18n } = useTranslation();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      ...defaultValues,
      language: i18n.language ?? defaultValues.language
    }
  });

  const currentLanguage = methods.watch('language');

  useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage) {
      void i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  useEffect(() => {
    if (i18n.language && i18n.language !== currentLanguage) {
      methods.setValue('language', i18n.language as FormValues['language'], {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false
      });
    }
    // We intentionally ignore currentLanguage here to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  return (
    <FormProvider {...methods}>
      <LeadFormProvider>
        <LeadFormLayout />
      </LeadFormProvider>
    </FormProvider>
  );
}
