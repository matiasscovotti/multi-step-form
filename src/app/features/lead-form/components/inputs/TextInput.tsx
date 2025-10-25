'use client';

import { forwardRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className = '', hasError = false, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm sm:text-base text-denim placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-secondary ${
        hasError ? 'border-red' : 'border-border-grey'
      } ${className}`}
      {...props}
    />
  );
});
