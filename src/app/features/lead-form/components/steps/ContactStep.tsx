'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { getCountryCallingCode } from 'react-phone-number-input';
import { useTranslation } from 'react-i18next';

import { FormField } from '../FormField';
import { TextInput } from '../inputs/TextInput';
import { PhoneInput } from '../inputs/PhoneInput';
import { FormValues } from '../../schema';

export function ContactStep() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<FormValues>();

  const { t } = useTranslation();

  const contactErrors = errors.contact ?? {};

  const selectedCountry = watch('contact.country') || 'AR';

  return (
    <div className="grid grid-cols-1 gap-5">
      <Controller
        name="contact.phone"
        control={control}
        render={({ field }) => (
          <FormField
            label={t('fields.phone.label')}
            error={contactErrors.phone?.message ? t(contactErrors.phone.message) : undefined}
            htmlFor="phone"
          >
            <PhoneInput
              id="phone"
              placeholder={t('fields.phone.placeholder')}
              hasError={!!contactErrors.phone}
              countryValue={selectedCountry}
              onCountryChange={(cc) => {
                const next = (cc || 'AR') as FormValues['contact']['country'];
                setValue('contact.country', next, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: false
                });

                // Always overwrite phone with the selected country's calling code
                try {
                  const code = getCountryCallingCode(next as any);
                  setValue('contact.phone', `+${code}`, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: false
                  });
                } catch {}
              }}
              {...field}
            />
          </FormField>
        )}
      />

      <FormField
        label={t('fields.role.label')}
        error={contactErrors.role?.message ? t(contactErrors.role.message) : undefined}
        htmlFor="role"
      >
        <TextInput
          id="role"
          placeholder={t('fields.role.placeholder')}
          hasError={!!contactErrors.role}
          {...register('contact.role')}
        />
      </FormField>

      <FormField
        label={t('fields.organization.label')}
        error={contactErrors.organization?.message ? t(contactErrors.organization.message) : undefined}
        htmlFor="organization"
      >
        <TextInput
          id="organization"
          placeholder={t('fields.organization.placeholder')}
          hasError={!!contactErrors.organization}
          {...register('contact.organization')}
        />
      </FormField>
    </div>
  );
}
