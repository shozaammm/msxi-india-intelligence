'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { NAVIGATION } from '@/config/navigation.config'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 72 }}
      className="relative flex h-full flex-col border-r border-white/[0.06] bg-[#100F1B] transition-all overflow-hidden"
    >
      <div className="flex h-[60px] items-center justify-between border-b border-white/[0.06] px-4">
        <div className={cn("flex items-center gap-2 overflow-hidden", !sidebarOpen && "opacity-0")}>
          <img src="/logos/msx_international.png" alt="MSXI" className="h-6 w-auto opacity-100" />
        </div>
        <button
          onClick={toggleSidebar}
          className="absolute right-4 rounded p-1 text-[#EDE9DF]/60 hover:bg-white/[0.05] hover:text-[#EDE9DF]"
        >
          {sidebarOpen ? <Icons.PanelLeftClose className="h-5 w-5" /> : <Icons.PanelLeftOpen className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
        <div className="flex flex-col gap-1 px-3">
          {NAVIGATION.map((item) => {
            const Icon = (Icons as any)[item.icon]
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors relative',
                  isActive
                    ? 'bg-white/[0.04] text-[#EDE9DF]'
                    : 'text-[#EDE9DF]/60 hover:bg-white/[0.02] hover:text-[#EDE9DF]'
                )}
                title={!sidebarOpen ? item.name : undefined}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-[#C5A880]' : 'text-[#EDE9DF]/40 group-hover:text-[#EDE9DF]/85')} />
                <span
                  className={cn(
                    'text-sm font-medium whitespace-nowrap transition-opacity',
                    !sidebarOpen && 'opacity-0 hidden'
                  )}
                >
                  {item.name}
                </span>
                {isActive && sidebarOpen && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 h-8 w-1 rounded-r bg-[#C5A880]"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[#EDE9DF] font-bold text-xs">
            SM
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#EDE9DF]">Soham Mondal</span>
              <span className="text-[10px] text-[#EDE9DF]/50">MSXI Consultant</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
