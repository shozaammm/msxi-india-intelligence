'use client'
import { motion } from 'framer-motion'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

/** Pill segmented control, as on the Mercedes-Benz home page. */
export function BrandSwitcher({ className }: { className?: string }) {
  const { activeBrand, setActiveBrand } = useAppStore()
  return (
    <div
      role="tablist"
      aria-label="Choose brand"
      className={cn('no-scrollbar pointer-events-auto inline-flex max-w-[94vw] overflow-x-auto rounded-full bg-ink p-1 ring-1 ring-fg/70 shadow-pop', className)}
    >
      {BRAND_IDS.map((id) => {
        const active = id === activeBrand
        const b = BRAND_CONFIGS[id]
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            onClick={() => setActiveBrand(id)}
            className={cn(
              // One typeface for every brand so the pill reads as a single control.
              'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 sm:px-5',
              active ? 'text-ink' : 'text-fg hover:text-fg-2',
            )}
          >
            {active && <motion.span layoutId="brand-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-fg" />}
            <span className="relative flex items-center gap-2.5">
              {b.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.logo}
                  alt=""
                  aria-hidden
                  className={cn(
                    'h-5 w-5 object-contain',
                    b.id === 'lexus' && 'w-9',
                    b.logoMono && (active ? 'invert [[data-theme=dark]_&]:invert-0' : '[[data-theme=dark]_&]:invert'),
                  )}
                />
              )}
              {b.switchLabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Zero-height sticky slot: sits where it is placed in the flow (hero bottom on Today,
 * top of the page elsewhere), then pins under the nav while scrolling.
 */
export function BrandPill({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none sticky top-[100px] z-nav flex h-0 items-start justify-center overflow-visible', className)}>
      <BrandSwitcher className="-translate-y-1/2" />
    </div>
  )
}
