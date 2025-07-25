import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/navigation'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'sprzatamy.live',
  description:
    'Profesjonalne usługi sprzątania - przejrzyste ceny, wysoka jakość',
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
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {/* <KindeProvider> */}
        <Navigation />
        {children}
        {/* </KindeProvider> */}
      </body>
    </html>
  )
}
