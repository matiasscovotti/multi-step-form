'use client';

import { PropsWithChildren } from 'react';

interface StepContainerProps {
  title: string;
  description: string;
}

export function StepContainer({ title, description, children }: PropsWithChildren<StepContainerProps>) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <header className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl font-semibold text-denim">{title}</h1>
          <p className="text-sm sm:text-base text-grey leading-relaxed">{description}</p>
        </header>

        <div className="mt-6 sm:mt-8 space-y-6">{children}</div>
      </div>
    </section>
  );
}
