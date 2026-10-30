import type { Metadata, Viewport } from 'next'
import { Source_Sans_3, Instrument_Serif } from 'next/font/google'
import { Providers } from './providers'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'
import './globals.css'

const sans = Source_Sans_3({ subsets: ['latin'], variable: '--font-sans' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal'], variable: '--font-serif' })

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
  themeColor: '#000000',
}

const DARK_BRANDS = JSON.stringify(BRAND_IDS.filter((id) => BRAND_CONFIGS[id].theme === 'dark'))
const THEME_BOOT = `try{var s=JSON.parse(localStorage.getItem('msxi-app-storage')||'{}').state||{};var t=s.theme&&s.theme!=='auto'?s.theme:(${DARK_BRANDS}.indexOf(s.activeBrand)>-1?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-theme="light" suppressHydrationWarning className={`${sans.variable} ${serif.variable}`}>
      <head>
        {/* Apply the saved surface before first paint so BMW/dark users don't see a white flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
