'use client'
import { motion } from 'framer-motion'
import { getBrandIntel } from '@/lib/intel'
import { Panel } from '@/components/ui/Panel'
import { StatusTag } from '@/components/ui/StatusTag'
import { cn, formatUnits } from '@/lib/utils'
import type { BrandId } from '@/types'

export function StatesList({
  brand, className, selected, onSelect,
}: { brand: BrandId; className?: string; selected?: number | null; onSelect?: (i: number) => void }) {
  const { topStates } = getBrandIntel(brand)
  const rows = topStates.value
  const top = rows[0]?.marketSharePct ?? 1

  return (
    <Panel
      title="Registrations by state"
      kicker="Where"
      className={className}
      action={<StatusTag status={topStates.status} note={topStates.note} />}
      footer={<p className="text-[11.5px] text-fg-3">Share of the brand&apos;s India registrations. {topStates.status === 'sample' ? 'Sample until the VAHAN pipeline is approved and connected.' : topStates.status === 'unavailable' ? 'Unavailable.' : topStates.source}</p>}
    >
      {rows.length === 0 && <p className="py-8 text-[14px] leading-relaxed text-fg-3">State-wise registrations aren&apos;t available for this brand yet. They need the VAHAN pipeline.</p>}
      <ol className="flex flex-col">
        {rows.map((s, i) => (
          <li key={s.stateName}>
            <button
              type="button"
              disabled={!onSelect}
              onClick={() => onSelect?.(i)}
              aria-pressed={selected === i}
              className={cn(
                'grid w-full grid-cols-[18px_1fr_auto] items-center gap-3 rounded-tile px-1.5 py-2.5 text-left transition-colors',
                onSelect && 'hover:bg-fg/[0.04]',
                selected === i && 'bg-fg/[0.05]',
              )}
            >
              <span className="num text-[12px] text-fg-3">{i + 1}</span>
              <span className="min-w-0">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[13.5px] text-fg">{s.stateName}</span>
                  <span className="num text-[12px] text-fg-3">{s.marketSharePct.toFixed(1)}%</span>
                </span>
                <span className="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-fg/[0.06]">
                  <motion.span
                    className="block h-full origin-left rounded-full bg-accent/70"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: s.marketSharePct / top }}
                    transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.1 + i * 0.05 }}
                  />
                </span>
              </span>
              <span className="num w-12 text-right text-[13px] text-fg-2">{formatUnits(s.registrationCount)}</span>
            </button>
          </li>
        ))}
      </ol>
    </Panel>
  )
}
