interface HeaderProps {
  title: string
  description: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex flex-col gap-2 sm:gap-3" suppressHydrationWarning>
      <h1 className="text-denim font-bold text-2xl sm:text-3xl" suppressHydrationWarning>{title}</h1>
      <p className="text-grey font-normal text-base " suppressHydrationWarning>{description}</p>
    </header>
  )
}