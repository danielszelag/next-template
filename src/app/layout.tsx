import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/navigation'
import { ClerkProvider } from '@clerk/nextjs'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'cleanrecord.pl - Profesjonalne sprzątanie z nagrywaniem',
  description:
    'cleanrecord.pl - Profesjonalne usługi sprzątania z możliwością nagrywania procesu. Przejrzyste ceny, wysoka jakość, pełna transparentność.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl='/dashboard'
      afterSignUpUrl='/dashboard'
    >
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
        >
          <Navigation />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
