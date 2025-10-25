'use client';

import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useLeadForm } from '../../context';
import { FormValues } from '../../schema';
import { interestOptions, levelOptions } from '../../constants';

export function ReviewStep() {
  const { getValues } = useFormContext<FormValues>();
  const values = getValues();
  const { goToStep } = useLeadForm();
  const { t, i18n } = useTranslation();

  const interestLabels = useMemo(() => {
    const entries = interestOptions.map((option) => [option, t(`fields.interests.options.${option}`)] as const);

    return Object.fromEntries(entries) as Record<(typeof interestOptions)[number], string>;
  }, [t]);

  const levelLabels = useMemo(() => {
    const entries = levelOptions.map((option) => [option, t(`fields.level.options.${option}`)] as const);

    return Object.fromEntries(entries) as Record<(typeof levelOptions)[number], string>;
  }, [t]);

  return (
    <div className="space-y-8 text-grey">
      <section className="space-y-3">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-grey">{t('summary.title')}</h2>
          <button
            type="button"
            onClick={() => goToStep('personal')}
            className="text-sm text-primary font-medium hover:underline"
          >
            {t('summary.edit')}
          </button>
        </header>
        <dl className="grid gap-2 text-sm sm:text-base">
          <div className="flex justify-between">
            <dt className="font-medium text-grey">{t('fields.firstName.label')}</dt>
            <dd className="text-grey">{values.personal.firstName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-grey">{t('fields.lastName.label')}</dt>
            <dd className="text-grey">{values.personal.lastName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-grey">{t('fields.email.label')}</dt>
            <dd className="text-grey">{values.personal.email}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-grey">{t('summary.contact')}</h2>
          <button
            type="button"
            onClick={() => goToStep('contact')}
            className="text-sm text-primary font-medium hover:underline"
          >
            {t('summary.edit')}
          </button>
        </header>
        <dl className="grid gap-2 text-sm sm:text-base">
          <div className="flex justify-between">
            <dt className="font-medium text-grey">{t('fields.phone.label')}</dt>
            <dd className="text-grey">{values.contact.phone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-grey">{t('fields.role.label')}</dt>
            <dd className="text-grey">{values.contact.role}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-grey">{t('fields.organization.label')}</dt>
            <dd className="text-grey">{values.contact.organization}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-grey">{t('summary.interests')}</h2>
          <button
            type="button"
            onClick={() => goToStep('interests')}
            className="text-sm text-primary font-medium hover:underline"
          >
            {t('summary.edit')}
          </button>
        </header>

        <div className="space-y-2 text-sm sm:text-base">
          <div>
            <h3 className="font-medium text-grey">{t('fields.interests.label')}</h3>
            <ul className="mt-1 list-disc list-inside text-grey">
              {values.interests.areas.map((area) => {
                const label = interestLabels[area as keyof typeof interestLabels] ?? area;
                return <li key={area}>{label}</li>;
              })}
              {values.interests.other ? <li>{values.interests.other}</li> : null}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-grey">{t('fields.level.label')}</h3>
            <ul className="mt-1 list-disc list-inside text-grey">
              {values.interests.levels.map((level) => {
                const label = levelLabels[level as keyof typeof levelLabels] ?? level;
                return <li key={level}>{label}</li>;
              })}
            </ul>
          </div>
        </div>
      </section>

      <footer className="text-sm">
        {t('summary.language')}: <strong className="text-denim">{i18n.language.toUpperCase()}</strong>
      </footer>
    </div>
  );
}
