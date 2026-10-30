'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { getBrandIntel } from '@/lib/intel'
import { StatusTag } from '@/components/ui/StatusTag'
import { SourceNote } from '@/components/ui/SourceNote'
import { cn, formatSignedPct, formatUnits } from '@/lib/utils'
import type { BrandId } from '@/types'

/**
 * Full-bleed hero. Always on the dark surface (like the photo hero on the Mercedes
 * site) so the headline and figure read the same whichever page surface is active.
 */
export function SalesHero({ brand }: { brand: BrandId }) {
  const cfg = BRAND_CONFIGS[brand]
  const { annualSales } = getBrandIntel(brand)
  const s = annualSales.value
  const published = annualSales.status !== 'unavailable'

  return (
    <section
      data-theme="dark"
      className="relative isolate overflow-hidden bg-ink text-fg"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: `radial-gradient(70% 90% at 82% 30%, ${cfg.accentColor}55, transparent 65%), linear-gradient(180deg, #000 0%, #0a0a0a 60%, #000 100%)` }}
      />
      <motion.div
        key={brand}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="mx-auto grid min-h-[600px] max-w-[1800px] grid-cols-1 items-center gap-12 px-4 pb-24 pt-20 lg:grid-cols-[1.1fr_1fr] lg:px-12"
      >
        <div>
          {cfg.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cfg.logo} alt={`${cfg.name} logo`} className={cn('mb-8 h-20 w-auto max-w-[220px] object-contain', cfg.logoMono && 'invert')} />
          )}
          <h1 className="display text-[clamp(44px,6vw,84px)]">{cfg.name}, briefed.</h1>
          <p className="mt-6 max-w-[34rem] text-[18px] leading-snug text-fg-2">
            Sourced sales figures, live headlines from India&apos;s motoring press and market context. Every number shows where it came from.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/news" className="btn-accent">Read the headlines</Link>
            <Link href="/methodology" className="btn border border-white/60 text-white hover:bg-white hover:text-black">How we source this</Link>
          </div>
        </div>

        <div className="lg:justify-self-end lg:text-right">
          <p className="text-[15px] font-medium text-fg-2">Cars sold in India, {s.period ?? `calendar ${s.year}`}</p>
          {published ? (
            <>
              <p className="num display mt-2 text-[clamp(72px,10vw,148px)] leading-[0.9] tracking-[-0.03em]">{formatUnits(s.units)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 lg:justify-end">
                <span className={cn('num text-[24px] font-semibold', s.yoyPct >= 0 ? 'text-pos' : 'text-neg')}>{formatSignedPct(s.yoyPct)}</span>
                <span className="text-[14px] text-fg-3">vs {s.vsLabel ?? s.year - 1}</span>
                <StatusTag status={annualSales.status} />
              </div>
            </>
          ) : (
            <>
              <p className="display mt-2 text-[clamp(44px,6vw,84px)] leading-[0.95] text-fg-2">Not published</p>
              <div className="mt-4 flex lg:justify-end"><StatusTag status={annualSales.status} note={annualSales.note} /></div>
            </>
          )}
          <p className="mt-4 max-w-md text-[13.5px] text-fg-2 lg:ml-auto">{s.scope}</p>
          <div className="mt-1 lg:ml-auto lg:max-w-md"><SourceNote p={annualSales} /></div>
        </div>
      </motion.div>
    </section>
  )
}
