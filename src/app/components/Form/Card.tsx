interface CardProps {
  children: React.ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className="mx-4 sm:mx-0">
      <div className="w-full bg-white rounded-lg px-4 sm:px-5 lg:px-6 py-8 mt-6 sm:mt-0">
        {children}
      </div>
    </div>
  )
}