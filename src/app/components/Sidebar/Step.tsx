interface StepProps {
  step: {
    number: number;
    title?: string;
    label?: string;
  };
  isActive?: boolean;
  isCompleted?: boolean;
}

export function Step({ step, isActive = false, isCompleted = false }: StepProps) {
  return (
    <div className="flex flex-row items-center justify-start gap-6">
      <div
        className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center border-2 ${
          isActive ? 'border-secondary bg-secondary' : isCompleted ? 'border-white bg-white' : 'border-white'
        }`}
      >
        <span className={`text-sm font-bold ${isActive ? 'text-white' : isCompleted ? 'text-primary' : 'text-white'}`}>
          {isCompleted ? '✓' : step.number}
        </span>

      </div>
      <div className="hidden sm:flex sm:flex-col sm:gap-2" suppressHydrationWarning>
        <span className="text-xs font-normal leading-3 text-white/70" suppressHydrationWarning>
          {step.label ?? `STEP ${step.number}`}
        </span>
        <strong className="text-sm text-white font-bold leading-3 uppercase tracking-[1px]" suppressHydrationWarning>
          {step.title}
        </strong>
      </div>
    </div >
  )
} 