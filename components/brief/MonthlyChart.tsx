'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { getBrandIntel } from '@/lib/intel'
import { Panel } from '@/components/ui/Panel'
import { StatusTag } from '@/components/ui/StatusTag'
import { cn, formatUnits } from '@/lib/utils'
import type { BrandId } from '@/types'

/** Sample series are drawn hatched so they never read as real data. */
export function MonthlyChart({ brand, className }: { brand: BrandId; className?: string }) {
  const { monthlyTrend } = getBrandIntel(brand)
  const series = monthlyTrend.value
  const isSample = monthlyTrend.status === 'sample'
  const max = Math.max(...series.map((m) => m.units))
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? series.length - 1

  return (
    <Panel
      title="Monthly retail"
      kicker="Trend"
      className={className}
      action={<StatusTag status={monthlyTrend.status} note={monthlyTrend.note} />}
      footer={<p className="text-[11.5px] text-fg-3">{isSample ? 'Replace with FADA OEM-wise retail figures each month. See Methodology.' : monthlyTrend.source}</p>}
    >
      <div className="flex items-baseline justify-between">
        <p className="num text-[28px] font-medium tracking-[-0.03em] text-fg">{formatUnits(series[shown].units)}</p>
        <p className="text-[12px] text-fg-3">{series[shown].month}</p>
      </div>
      <div className="mt-4 flex h-32 items-end gap-2.5" onMouseLeave={() => setHover(null)} role="img" aria-label={`Monthly units, ${isSample ? 'sample data' : monthlyTrend.source}`}>
        {series.map((m, i) => (
          <button
            key={m.month}
            type="button"
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            aria-label={`${m.month}: ${formatUnits(m.units)} units`}
            className="group flex h-full flex-1 flex-col justify-end focus:outline-none"
          >
            <motion.span
              className={cn('block w-full rounded-[4px] transition-colors duration-200', i === shown ? 'bg-accent' : 'bg-accent/35 group-hover:bg-accent/60')}
              style={isSample ? { backgroundImage: 'repeating-linear-gradient(135deg, rgb(15 14 12 / 0.55) 0 3px, transparent 3px 7px)' } : undefined}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(6, (m.units / max) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20, delay: i * 0.04 }}
            />
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2.5">
        {series.map((m, i) => (
          <span key={m.month} className={cn('num flex-1 text-center text-[11px]', i === shown ? 'text-fg-2' : 'text-fg-3')}>
            {m.month.slice(0, 3)}
          </span>
        ))}
      </div>
    </Panel>
  )
}
