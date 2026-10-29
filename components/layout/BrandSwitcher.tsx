'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND_CONFIGS, INACTIVE_BRANDS } from '@/config/brands.config'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ChevronDown, Check } from 'lucide-react'
import { MercedesStar } from '../ui/MercedesStar'
import { BmwRoundel } from '../ui/BmwRoundel'
import { BrandId } from '@/types'

export function BrandSwitcher() {
  const { activeBrand, setActiveBrand } = useAppStore()
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentBrandConfig = BRAND_CONFIGS[activeBrand]

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.05]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded bg-white/[0.04] border border-white/[0.08] shadow-sm">
          {activeBrand === 'mercedes' ? (
            <img src="/logos/mercedes_benz.png" alt="Mercedes-Benz" className="w-[20px] h-[20px] object-contain" />
          ) : (
            <img src="/logos/bmw.png" alt="BMW" className="w-[20px] h-[20px] object-contain" />
          )}
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-xs font-bold text-[#EDE9DF]">{currentBrandConfig.name}</span>
          <span className="text-[10px] text-[#EDE9DF]/60">{currentBrandConfig.ticker} · {currentBrandConfig.exchange}</span>
        </div>
        <ChevronDown className="ml-2 h-4 w-4 text-[#EDE9DF]/60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 z-50 mt-2 w-64 rounded-xl border border-white/[0.08] bg-[#13121E] p-1 shadow-2xl backdrop-blur-md"
          >
            <div className="px-2 py-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#EDE9DF]/40">Active Brands</span>
            </div>
            {(Object.keys(BRAND_CONFIGS) as BrandId[]).map((id) => {
              const config = BRAND_CONFIGS[id]
              const isActive = activeBrand === id
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveBrand(id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/[0.04]',
                    isActive && 'bg-white/[0.02]'
                  )}
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-white/[0.08] bg-white/[0.03]">
                    {id === 'mercedes' ? <img src="/logos/mercedes_benz.png" alt="Mercedes-Benz" className="w-[18px] h-[18px] object-contain" /> : <img src="/logos/bmw.png" alt="BMW" className="w-[18px] h-[18px] object-contain" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn('text-xs font-semibold', isActive ? 'text-[#EDE9DF]' : 'text-[#EDE9DF]/80')}>
                      {config.name}
                    </span>
                    <span className="text-[10px] text-[#EDE9DF]/50">{config.ticker}</span>
                  </div>
                  {isActive && <Check className="ml-auto h-4 w-4 text-[#C5A880]" />}
                </button>
              )
            })}

            <div className="mt-2 border-t border-white/[0.05] pt-1" />
            <div className="px-2 py-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#EDE9DF]/40">Coming Soon</span>
            </div>
            {INACTIVE_BRANDS.map((brand) => (
              <div
                key={brand.id}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 opacity-40 cursor-not-allowed"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-white/[0.08] bg-white/[0.01]">
                  <span className="text-xs font-bold text-[#EDE9DF]/60">{brand.label[0]}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#EDE9DF]/70">{brand.label}</span>
                  <span className="text-[10px] text-[#EDE9DF]/40">Integration pending</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
