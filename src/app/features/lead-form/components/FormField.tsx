'use client';

import { PropsWithChildren } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  htmlFor?: string;
  assistiveText?: string;
}

export function FormField({ label, error, htmlFor, assistiveText, children }: PropsWithChildren<FormFieldProps>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm sm:text-base font-medium text-denim">
          {label}
        </label>
        {error ? <span className="text-xs sm:text-sm text-red font-medium">{error}</span> : null}
      </div>
      {children}
      {assistiveText ? <p className="text-xs text-grey">{assistiveText}</p> : null}
    </div>
  );
}
