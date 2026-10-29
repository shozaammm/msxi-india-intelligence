'use client'
import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretDown, Check } from '@phosphor-icons/react'
import { BRAND_CONFIGS, BRAND_IDS, INACTIVE_BRANDS } from '@/config/brands.config'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { BrandMark } from '@/components/ui/BrandMark'
import { useDismiss } from '@/hooks/useDismiss'

export function BrandSwitcher() {
  const { activeBrand, setActiveBrand } = useAppStore()
  const [open, setOpen] = React.useState(false)
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false))
  const current = BRAND_CONFIGS[activeBrand] ?? BRAND_CONFIGS.mercedes

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-3 rounded-[12px] py-1 pl-1 pr-3 transition-colors duration-200 hover:bg-panel active:scale-[0.99]"
      >
        <BrandMark brand={current.id} size="sm" />
        <span className="flex flex-col items-start text-left leading-tight">
          <span className="text-[13.5px] font-semibold tracking-[-0.01em] text-fg">{current.name}</span>
          <span className="num text-[11px] text-fg-3">{current.ticker} · {current.exchange}</span>
        </span>
        <CaretDown className={cn('ml-1 h-3.5 w-3.5 text-fg-3 transition-transform duration-200', open && 'rotate-180')} weight="bold" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Choose brand"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="absolute left-0 top-full z-pop mt-2 w-72 origin-top-left rounded-card bg-raised p-1.5 shadow-pop ring-1 ring-line/10"
          >
            <p className="px-2.5 pb-1 pt-1.5 font-serif text-[14px] italic text-fg-3">Tracking</p>
            {BRAND_IDS.map((id) => {
              const b = BRAND_CONFIGS[id]
              const active = id === activeBrand
              return (
                <button
                  key={id}
                  role="option"
                  aria-selected={active}
                  onClick={() => { setActiveBrand(id); setOpen(false) }}
                  className={cn('flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left transition-colors hover:bg-fg/[0.05]', active && 'bg-fg/[0.04]')}
                >
                  <BrandMark brand={id} size="sm" />
                  <span className="flex flex-col">
                    <span className="text-[13px] font-medium text-fg">{b.name}</span>
                    <span className="num text-[11px] text-fg-3">{b.ticker}</span>
                  </span>
                  {active && <Check className="ml-auto h-4 w-4 text-accent" weight="bold" />}
                </button>
              )
            })}
            <div className="my-1.5 border-t border-line/[0.07]" />
            <p className="px-2.5 pb-1 pt-1 font-serif text-[14px] italic text-fg-3">Next up</p>
            {INACTIVE_BRANDS.map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-[10px] px-2 py-2 opacity-55" aria-disabled>
                <span className="grid h-8 w-8 place-items-center rounded-[9px] text-[12px] font-semibold ring-1 ring-line/10" style={{ color: b.color, background: b.bg }}>
                  {b.label[0]}
                </span>
                <span className="text-[13px] text-fg-2">{b.label}</span>
                <span className="ml-auto text-[11px] text-fg-3">Planned</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
