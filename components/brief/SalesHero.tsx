'use client'
import { motion } from 'framer-motion'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { getBrandIntel } from '@/lib/intel'
import { BrandMark } from '@/components/ui/BrandMark'
import { StatusTag } from '@/components/ui/StatusTag'
import { SourceNote } from '@/components/ui/SourceNote'
import { cn, formatSignedPct, formatUnits } from '@/lib/utils'
import type { BrandId } from '@/types'

export function SalesHero({ brand }: { brand: BrandId }) {
  const cfg = BRAND_CONFIGS[brand]
  const { annualSales } = getBrandIntel(brand)
  const s = annualSales.value

  return (
    <section className="card relative overflow-hidden px-7 pb-6 pt-7">
      {/* Oversized logo bleeding off the corner, very faint. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cfg.logo} alt="" aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-[340px] w-[340px] object-contain opacity-[0.045] grayscale" />

      <div className="relative flex items-center gap-4">
        <BrandMark brand={brand} size="lg" />
        <div>
          <p className="font-serif text-[15px] italic text-accent">India brief</p>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-fg">
            {cfg.name}
            {cfg.subLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cfg.subLogo} alt="AMG" className="ml-3 inline h-[11px] w-auto -translate-y-0.5 opacity-55 brightness-0 invert" />
            )}
          </h1>
          <p className="text-[12.5px] text-fg-3">{cfg.fullName}</p>
        </div>
      </div>

      <motion.div
        key={brand}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 140, damping: 20 }}
        className="relative mt-8 flex flex-wrap items-end gap-x-8 gap-y-3"
      >
        <div>
          <p className="label mb-1">Cars sold in India, calendar {s.year}</p>
          <p className="num text-[64px] font-medium leading-[0.95] tracking-[-0.045em] text-fg">{formatUnits(s.units)}</p>
        </div>
        <div className="pb-2">
          <p className={cn('num text-[22px] font-medium tracking-[-0.03em]', s.yoyPct >= 0 ? 'text-pos' : 'text-neg')}>
            {formatSignedPct(s.yoyPct)}
          </p>
          <p className="text-[12px] text-fg-3">vs {s.year - 1}</p>
        </div>
        <StatusTag status={annualSales.status} className="mb-3" />
      </motion.div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line/[0.07] pt-4">
        <p className="text-[12px] text-fg-2">{s.scope}</p>
        <SourceNote p={annualSales} />
      </div>
    </section>
  )
}
