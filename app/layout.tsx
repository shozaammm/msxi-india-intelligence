import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: { default: 'MSXI India Intelligence', template: '%s · MSXI India Intelligence' },
  description: 'India automotive briefings from MSX International: brand news from 15+ publishers, reported sales figures with sources, and market context.',
  applicationName: 'MSXI India Intelligence',
  openGraph: {
    title: 'MSXI India Intelligence',
    description: 'India automotive briefings: sourced figures, live brand news, market context.',
    siteName: 'MSX International',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0F0E0C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${geist.variable} ${geistMono.variable} ${serif.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
