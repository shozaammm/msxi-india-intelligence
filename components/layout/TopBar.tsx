'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { BrandSwitcher } from './BrandSwitcher'
import { SearchInput } from '../ui/SearchInput'
import { Bell } from 'lucide-react'

export function TopBar() {
  const [time, setTime] = React.useState<string>('')
  
  React.useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }))
    update()
    const int = setInterval(update, 1000)
    return () => clearInterval(int)
  }, [])

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#100F1B]/85 backdrop-blur-md px-6 z-40 relative"
    >
      <div className="flex items-center gap-6">
        <BrandSwitcher />
      </div>

      <div className="flex flex-1 items-center justify-center max-w-md px-8">
        <SearchInput placeholder="Search intelligence... (Press '/' to focus)" />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 rounded bg-white/[0.03] border border-white/[0.08] px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
          <span className="tabular-nums font-mono text-xs font-bold text-[#EDE9DF]">{time} IST</span>
        </div>
        
        <div className="flex items-center gap-3 border-l border-white/[0.06] pl-6">
          <button className="relative rounded p-2 text-[#EDE9DF]/60 transition-colors hover:bg-white/[0.05] hover:text-[#EDE9DF]">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-[#100F1B] bg-[#C5A880]"></span>
          </button>
        </div>
      </div>
    </motion.header>
  )
}
