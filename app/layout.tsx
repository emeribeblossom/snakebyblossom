import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Snake',
  description: 'A classic snake game: eat food, grow longer, and avoid crashing into walls or yourself.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/download (5).jpeg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/download (5).jpeg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/download (5).jpeg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/download (5).jpeg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#121a14',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
