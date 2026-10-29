'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-6 border-b border-black/[0.08]', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative pb-3 text-sm font-semibold transition-colors',
              isActive ? 'text-[#1A1A1A]' : 'text-[#666666] hover:text-[#333333]'
            )}
          >
            <div className="flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-xs',
                  isActive ? 'bg-[#1A1A1A] text-white' : 'bg-black/[0.05] text-[#666666]'
                )}>
                  {tab.count}
                </span>
              )}
            </div>
            {isActive && (
              <motion.div
                layoutId="tabs-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A1A1A] rounded-t-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
