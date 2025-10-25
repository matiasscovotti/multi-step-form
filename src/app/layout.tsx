import './globals.css'
import type { Metadata } from 'next'
import { Ubuntu } from 'next/font/google'

import { I18nProvider } from '@/i18n/provider'

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Educabot - FGC',
  description: 'Formulario de Lead FGC',
  icons: {
    icon: {
      url: '/images/favicon.jpg',
      type: 'image/jpeg'
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='antialiased'>
      <body className={ubuntu.className}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
