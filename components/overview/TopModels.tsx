'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'
import { useAllBrandNews } from '@/hooks/useAllBrandNews'
import { useAppStore } from '@/lib/store'
import { rankModels } from '@/lib/models'
import { Panel } from '@/components/ui/Panel'
import { StatusTag } from '@/components/ui/StatusTag'
import { Skeleton } from '@/components/ui/Skeleton'

/** Most-covered car models across all seven brands, from live headlines. */
export function TopModels() {
  const { byBrand, loading } = useAllBrandNews()
  const setBrand = useAppStore((s) => s.setActiveBrand)
  const rows = useMemo(() => {
    const all = BRAND_IDS.flatMap((id) => rankModels(id, byBrand[id]).filter((r) => r.rank !== null).map((r) => ({ id, ...r })))
      .sort((a, b) => b.hits.length - a.hits.length)
    // Ties share a rank: it is the index of the first row with the same count.
    return all.slice(0, 15).map((r) => ({ ...r, overall: all.findIndex((x) => x.hits.length === r.hits.length) + 1 }))
  }, [byBrand])
  const max = rows[0]?.hits.length ?? 1

  return (
    <Panel
      title="Most covered models"
      kicker="Cars, ranked"
      action={<StatusTag status="live" note="Counted from the latest headlines. This measures attention, not sales." />}
      footer={<p className="text-[12px] text-fg-3">Ranked by headlines naming the model in the latest feed pull, across all brands. Brands do not publish model-wise sales, so this is attention, not volume. Brands with a reported best seller are tagged on their Models page.</p>}
    >
      {loading && rows.length === 0 ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : (
        <ol className="divide-y divide-line/[0.08]">
          {rows.map((r, i) => (
            <li key={`${r.id}-${r.model.name}`} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 py-3">
              <span className="num display text-[26px] text-fg-3">{r.overall}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2.5">
                  <Link href="/models" onClick={() => setBrand(r.id)} className="text-[16px] font-semibold text-fg hover:underline underline-offset-4">
                    {BRAND_CONFIGS[r.id].switchLabel} {r.model.name}
                  </Link>
                  <span className="text-[12.5px] text-fg-3">{r.model.body} · {r.model.power.join(' / ')}</span>
                </div>
                <span className="mt-2 block h-[4px] overflow-hidden rounded-full bg-fg/[0.07]">
                  <motion.span className="block h-full origin-left rounded-full" style={{ background: BRAND_CONFIGS[r.id].accentColor }} initial={{ scaleX: 0 }} animate={{ scaleX: r.hits.length / max }} transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.04 * i }} />
                </span>
              </div>
              <p className="num text-[18px] font-semibold text-fg">{r.hits.length}</p>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
