import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Footer } from '@/components/layout/Footer'
import { BrandTheme } from '@/components/layout/BrandTheme'
import { ConnectingOverlay } from '@/components/ui/ConnectingOverlay'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-overlay focus:rounded-tile focus:bg-fg focus:px-3 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <BrandTheme />
      <ConnectingOverlay />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />
        <main id="main" className="relative flex-1 overflow-y-auto">
          {/* Ambient light from the top-right, tinted by the brand accent. */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_85%_0%,rgb(var(--accent)/0.07),transparent_70%)]" />
          <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-10 pt-6">{children}</div>
        </main>
        <Footer />
      </div>
      <div className="grain" aria-hidden />
    </div>
  )
}
