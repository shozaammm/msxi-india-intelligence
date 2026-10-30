'use client'
import { PERIODS, PERIOD_GROUPS, BRAND_SALES, type PeriodId } from '@/config/sales.config'
import { periodById } from '@/lib/sales'
import { cn } from '@/lib/utils'

/** Tabs for the period (year, financial year, so far, half, quarter, month) with a chip row when a group has several. */
export function PeriodTabs({ value, onChange, className }: { value: PeriodId; onChange: (p: PeriodId) => void; className?: string }) {
  const group = periodById(value).group
  const inGroup = PERIODS.filter((p) => p.group === group)
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div role="tablist" aria-label="Sales period" className="no-scrollbar inline-flex max-w-full self-start overflow-x-auto rounded-full bg-fg/[0.06] p-1">
        {PERIOD_GROUPS.map((g) => {
          const active = g.id === group
          return (
            <button
              key={g.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(PERIODS.find((p) => p.group === g.id)!.id)}
              className={cn('shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-colors', active ? 'bg-fg text-ink' : 'text-fg-2 hover:text-fg')}
            >
              {g.label}
            </button>
          )
        })}
      </div>
      {inGroup.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {inGroup.map((p) => (
            <button key={p.id} className="chip-btn" aria-pressed={p.id === value} onClick={() => onChange(p.id)}>
              {p.label}
              <span className="ml-1.5 text-[11px] opacity-60">{BRAND_SALES[p.id]?.rows.length ?? 0} brands</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
