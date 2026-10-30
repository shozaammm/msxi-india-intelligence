'use client'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { BRAND_SALES, MB_BMW_GAP, PERIODS } from '@/config/sales.config'
import { getBrandIntel } from '@/lib/intel'
import { rankModels } from '@/lib/sales'
import { Panel } from '@/components/ui/Panel'
import { SourceNote } from '@/components/ui/SourceNote'
import { cn, formatUnits } from '@/lib/utils'

const bar = (pct: number, color: string) => (
  <span className="block h-[4px] overflow-hidden rounded-full bg-fg/[0.07]">
    <span className="block h-full rounded-full" style={{ width: `${Math.max(2, pct)}%`, background: color }} />
  </span>
)

/** Mercedes-Benz against BMW, month by month, from the VAHAN monthly rows. */
export function HeadToHead() {
  const months = [...PERIODS.filter((p) => p.group === 'month')].reverse()
  const mb = BRAND_CONFIGS.mercedes
  const bmw = BRAND_CONFIGS.bmw
  const cell = (id: string, brand: 'mercedes' | 'bmw') => BRAND_SALES[id as 'jan2026']?.rows.find((r) => r.brand === brand)?.units ?? 0
  const max = Math.max(...months.flatMap((m) => [cell(m.id, 'mercedes'), cell(m.id, 'bmw')]))
  const meta = BRAND_SALES.mar2026!
  return (
    <Panel title="Mercedes-Benz vs BMW" kicker="Month by month" footer={<SourceNote p={{ status: 'reported', source: meta.source, sourceUrl: meta.sourceUrl, asOf: meta.asOf }} />}>
      <div className="flex flex-col gap-5">
        {months.map((m) => {
          const a = cell(m.id, 'mercedes'), b = cell(m.id, 'bmw')
          const lead = a === b ? null : a > b ? mb : bmw
          return (
            <div key={m.id}>
              <div className="flex items-baseline justify-between">
                <p className="text-[14px] font-semibold text-fg">{m.label}</p>
                <p className="text-[12.5px] text-fg-3">{lead ? `${lead.switchLabel} ahead by ${formatUnits(Math.abs(a - b))}` : 'level'}</p>
              </div>
              <div className="mt-2 grid grid-cols-[88px_1fr_auto] items-center gap-x-3 gap-y-2">
                <span className="text-[12.5px] text-fg-2">{mb.switchLabel}</span>{bar((a / max) * 100, mb.accentColor)}<span className="num text-[14px] font-semibold">{formatUnits(a)}</span>
                <span className="text-[12.5px] text-fg-2">{bmw.switchLabel}</span>{bar((b / max) * 100, bmw.accentColor)}<span className="num text-[14px] font-semibold">{formatUnits(b)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

/** Mercedes-Benz lead over BMW by year: how fast BMW is closing in. */
export function GapTracker() {
  const max = Math.max(...MB_BMW_GAP.rows.map((r) => r.gap))
  return (
    <Panel title="The gap is closing" kicker="Mercedes-Benz lead over BMW" footer={<SourceNote p={{ status: 'reported', source: MB_BMW_GAP.source, sourceUrl: MB_BMW_GAP.sourceUrl, asOf: '2026-03-31' }} />}>
      <ul className="flex flex-col gap-3">
        {MB_BMW_GAP.rows.map((r, i) => (
          <li key={r.year} className="grid grid-cols-[48px_1fr_auto] items-center gap-3">
            <span className="num text-[14px] text-fg-2">{r.year}</span>
            {bar((r.gap / max) * 100, i === MB_BMW_GAP.rows.length - 1 ? BRAND_CONFIGS.bmw.accentColor : BRAND_CONFIGS.mercedes.accentColor)}
            <span className="num text-[14px] font-semibold">{formatUnits(r.gap)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[13px] text-fg-3">The lead fell from 4,553 units in 2024 to 1,736 in 2025. In Q1 2026 VAHAN data, BMW was ahead (4,944 vs 4,861).</p>
    </Panel>
  )
}

/** Company-reported 2025 total next to the VAHAN registration total, so the two are never confused. */
export function ReportedVsRegistered() {
  const rows = (['mercedes', 'bmw', 'audi'] as const).map((id) => {
    const c = getBrandIntel(id).annualSales
    const v = BRAND_SALES.cy2025!.rows.find((r) => r.brand === id)!.units
    return { id, company: c.value.units, vahan: v, scope: c.value.scope, url: c.sourceUrl, source: c.source }
  })
  return (
    <Panel title="Reported vs registered" kicker="Why two totals exist" footer={<p className="text-[12px] text-fg-3">Company figures come from press releases; registrations from VAHAN via Rushlane. Scope differs (BMW includes MINI in the company figure), so a gap is not an error.</p>}>
      <table className="w-full text-left text-[14px]">
        <thead><tr className="text-[12px] uppercase tracking-[0.1em] text-fg-3"><th className="pb-2 font-semibold">2025</th><th className="pb-2 text-right font-semibold">Company</th><th className="pb-2 text-right font-semibold">Registered</th><th className="pb-2 text-right font-semibold">Gap</th></tr></thead>
        <tbody className="divide-y divide-line/[0.08]">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="py-3 font-semibold">{BRAND_CONFIGS[r.id].name}</td>
              <td className="num py-3 text-right">{formatUnits(r.company)}</td>
              <td className="num py-3 text-right">{formatUnits(r.vahan)}</td>
              <td className={cn('num py-3 text-right font-semibold', r.vahan >= r.company ? 'text-pos' : 'text-neg')}>{r.vahan >= r.company ? '+' : '−'}{formatUnits(Math.abs(r.vahan - r.company))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}

/** SUV vs sedan share among the published top models. */
export function BodySplit() {
  const rows = rankModels('cy2025')
  const total = rows.reduce((n, r) => n + r.units, 0)
  const suv = rows.filter((r) => r.body === 'SUV').reduce((n, r) => n + r.units, 0)
  const pct = (suv / total) * 100
  return (
    <Panel title="SUV or sedan" kicker="Body type, 2025" footer={<p className="text-[12px] text-fg-3">Calculated from the {rows.length} models in the published list, not the whole market. Rushlane puts SUVs at over 74% of its top 20.</p>}>
      <div className="flex h-3 overflow-hidden rounded-full bg-fg/[0.07]">
        <span className="bg-fg" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-[14px]">
        <p><span className="num display text-[28px]">{pct.toFixed(0)}%</span> <span className="text-fg-2">SUV · {formatUnits(suv)}</span></p>
        <p className="text-right"><span className="num display text-[28px]">{(100 - pct).toFixed(0)}%</span> <span className="text-fg-2">Sedan · {formatUnits(total - suv)}</span></p>
      </div>
    </Panel>
  )
}
