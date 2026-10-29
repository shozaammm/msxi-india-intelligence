import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Footer } from '@/components/layout/Footer'
import { ConnectingOverlay } from '@/components/ui/ConnectingOverlay'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0D0C14]">
      <ConnectingOverlay />
      
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto no-scrollbar relative bg-[#0D0C14]">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}
