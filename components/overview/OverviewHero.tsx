'use client'
import Link from 'next/link'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'
import { BRAND_MODELS } from '@/config/models.config'
import { lineupStats } from '@/lib/models'
import { getBrandIntel } from '@/lib/intel'
import { useAppStore } from '@/lib/store'
import { useAllBrandNews } from '@/hooks/useAllBrandNews'
import { cn, formatUnits } from '@/lib/utils'

/** Calendar-2025 company-reported units, the one period every ranked brand shares. */
export function comparableSales() {
  return BRAND_IDS.flatMap((id) => {
    const s = getBrandIntel(id).annualSales
    return s.status === 'reported' && s.value.year === 2025 && !s.value.period ? [{ id, units: s.value.units, yoyPct: s.value.yoyPct, p: s }] : []
  }).sort((a, b) => b.units - a.units)
}

export function OverviewHero() {
  const { byBrand, loading } = useAllBrandNews()
  const setBrand = useAppStore((s) => s.setActiveBrand)
  const ranked = comparableSales()
  const combined = ranked.reduce((s, r) => s + r.units, 0)
  const models = BRAND_IDS.reduce((s, id) => s + lineupStats(BRAND_MODELS[id].models).total, 0)
  const electric = BRAND_IDS.reduce((s, id) => s + lineupStats(BRAND_MODELS[id].models).electric, 0)
  const headlines = BRAND_IDS.reduce((s, id) => s + byBrand[id].length, 0)

  const stats = [
    { label: `${ranked.map((r) => BRAND_CONFIGS[r.id].switchLabel).join(' + ')}, calendar 2025`, value: formatUnits(combined), sub: 'cars sold in India (company-reported)' },
    { label: 'Models tracked', value: String(models), sub: `${electric} fully electric, ${BRAND_IDS.length} brands` },
    { label: 'Headlines in the latest pull', value: loading && headlines === 0 ? '…' : formatUnits(headlines), sub: 'across all brands, live' },
    { label: 'Brands with a 2025 figure', value: `${ranked.length} of ${BRAND_IDS.length}`, sub: 'the rest are older or unpublished' },
  ]

  return (
    <section data-theme="dark" className="relative isolate overflow-hidden bg-ink text-fg">
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(60% 80% at 85% 20%, rgb(255 255 255 / 0.07), transparent 65%), #000' }} />
      <div className="mx-auto max-w-[1800px] px-4 pb-24 pt-20 lg:px-12">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-3">India overview</p>
        <h1 className="display mt-3 max-w-[16ch] text-[clamp(44px,6vw,92px)]">Premium cars in India, at a glance.</h1>
        <p className="mt-6 max-w-[40rem] text-[18px] leading-snug text-fg-2">
          Seven brands side by side: who sold what, who is in the news, and which models they sell. Every figure carries its source and period.
        </p>

        <dl className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-[13px] font-medium text-fg-3">{s.label}</dt>
              <dd className="num display mt-2 text-[clamp(40px,4.4vw,64px)] leading-none">{s.value}</dd>
              <p className="mt-2 text-[13.5px] text-fg-2">{s.sub}</p>
            </div>
          ))}
        </dl>

        <ul className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4" aria-label="Brands covered">
          {BRAND_IDS.map((id) => {
            const b = BRAND_CONFIGS[id]
            return (
              <li key={id}>
                <Link href="/brief" onClick={() => setBrand(id)} className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-fg-2 transition-colors hover:text-fg">
                  {b.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.logo} alt="" aria-hidden className={cn('h-6 object-contain', id === 'lexus' ? 'w-12' : 'w-6', b.logoMono && 'invert')} />
                  )}
                  {b.switchLabel}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
