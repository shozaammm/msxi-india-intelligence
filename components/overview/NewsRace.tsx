'use client'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'
import { useAllBrandNews } from '@/hooks/useAllBrandNews'
import { topicCounts } from '@/components/coverage/CoveragePulse'
import { Panel } from '@/components/ui/Panel'
import { StatusTag } from '@/components/ui/StatusTag'
import { Skeleton } from '@/components/ui/Skeleton'
import { relativeTime } from '@/lib/utils'

export function NewsRace() {
  const { byBrand, loading } = useAllBrandNews()
  const rows = useMemo(
    () =>
      BRAND_IDS.map((id) => {
        const items = byBrand[id]
        const india = items.filter((i) => i.region === 'india').length
        return { id, count: items.length, indiaPct: items.length ? Math.round((india / items.length) * 100) : 0, top: topicCounts(items)[0]?.label ?? '—', latest: items[0]?.isoTimestamp }
      }).sort((a, b) => b.count - a.count),
    [byBrand],
  )
  const max = Math.max(...rows.map((r) => r.count), 1)

  return (
    <Panel title="Who is in the news" kicker="Live" action={<StatusTag status="live" note="Counted from the latest pull of each feed. Not an all-time total." />}
      footer={<p className="text-[12px] text-fg-3">Headlines found in the latest pull of about 15 feeds plus Google News. A guide to attention, not a measure of sales or sentiment.</p>}>
      {loading && rows.every((r) => r.count === 0) ? (
        <div className="flex flex-col gap-3">{BRAND_IDS.map((id) => <Skeleton key={id} className="h-10 w-full" />)}</div>
      ) : (
        <>
          <div className="mb-2 hidden grid-cols-[1fr_72px_88px_150px] gap-4 text-[12px] font-medium text-fg-3 sm:grid">
            <span>Brand</span><span className="text-right">India</span><span className="text-right">Latest</span><span>Biggest topic</span>
          </div>
          <ol className="divide-y divide-line/[0.08]">
            {rows.map((r, i) => (
              <li key={r.id} className="grid grid-cols-[1fr] items-center gap-x-4 gap-y-1 py-3 sm:grid-cols-[1fr_72px_88px_150px]">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="num w-5 text-[13px] text-fg-3">{i + 1}</span>
                    <span className="text-[15px] font-semibold text-fg">{BRAND_CONFIGS[r.id].switchLabel}</span>
                    <span className="num ml-auto text-[15px] text-fg">{r.count}</span>
                  </div>
                  <span className="ml-8 mt-1.5 block h-[4px] overflow-hidden rounded-full bg-fg/[0.07]">
                    <motion.span className="block h-full origin-left rounded-full" style={{ background: BRAND_CONFIGS[r.id].accentColor }} initial={{ scaleX: 0 }} animate={{ scaleX: r.count / max }} transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.05 * i }} />
                  </span>
                </div>
                <span className="num text-[13px] text-fg-2 sm:text-right">{r.indiaPct}% India</span>
                <span className="text-[13px] text-fg-2 sm:text-right">{r.latest ? relativeTime(r.latest) : '—'}</span>
                <span className="text-[13px] text-fg-2">{r.top}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </Panel>
  )
}
