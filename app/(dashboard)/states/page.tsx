'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { getBrandIntel } from '@/lib/intel'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { StatesList } from '@/components/brief/StatesList'
import { Panel } from '@/components/ui/Panel'
import { StatusTag } from '@/components/ui/StatusTag'
import { formatUnits } from '@/lib/utils'

export default function StatesPage() {
  const brand = useAppStore((s) => s.activeBrand)
  const { topStates } = getBrandIntel(brand)
  const [selected, setSelected] = useState<number | null>(0)
  const row = selected != null ? topStates.value[selected] : null
  const total = topStates.value.reduce((s, r) => s + r.registrationCount, 0)

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="font-serif text-[16px] italic text-accent">States</p>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-fg">Where {BRAND_CONFIGS[brand].name.split(' ')[0]} registers cars</h1>
      </header>

      {topStates.status === 'sample' && (
        <div role="note" className="flex items-start gap-3 rounded-card bg-warn/[0.07] px-5 py-4 ring-1 ring-warn/20">
          <StatusTag status="sample" />
          <p className="max-w-[80ch] text-[13px] leading-relaxed text-fg-2">
            These state figures are placeholders that show the layout. The VAHAN dashboard has no official API and automated collection needs permission, so real state data waits on that. FADA&apos;s monthly release covers national brand share only.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <StatesList brand={brand} selected={selected} onSelect={setSelected} />
        <Panel title={row ? row.stateName : 'Pick a state'} kicker="Detail">
          <AnimatePresence mode="wait">
            {row ? (
              <motion.dl key={row.stateName} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                <div>
                  <dt className="label">Registrations in the period</dt>
                  <dd className="num text-[40px] font-medium tracking-[-0.04em] text-fg">{formatUnits(row.registrationCount)}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-line/[0.07] pt-4">
                  <div>
                    <dt className="label">Share of brand</dt>
                    <dd className="num text-[20px] text-fg">{row.marketSharePct.toFixed(1)}%</dd>
                  </div>
                  <div>
                    <dt className="label">Of top five</dt>
                    <dd className="num text-[20px] text-fg">{((row.registrationCount / total) * 100).toFixed(1)}%</dd>
                  </div>
                </div>
              </motion.dl>
            ) : (
              <p className="text-[13px] text-fg-3">Select a state on the left.</p>
            )}
          </AnimatePresence>
        </Panel>
      </div>
    </div>
  )
}
