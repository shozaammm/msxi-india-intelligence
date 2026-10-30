import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { BrandTheme } from '@/components/layout/BrandTheme'
import { PageFrame } from '@/components/layout/PageFrame'
import { ConnectingOverlay } from '@/components/ui/ConnectingOverlay'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-overlay focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <BrandTheme />
      <ConnectingOverlay />
      <div className="sticky top-0 z-nav"><TopNav /></div>
      <main id="main" className="flex-1">
        <PageFrame>{children}</PageFrame>
      </main>
      <Footer />
    </div>
  )
}
