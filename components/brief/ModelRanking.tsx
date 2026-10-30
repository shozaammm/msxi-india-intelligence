'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useNewsData } from '@/hooks/useNewsData'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { rankModels } from '@/lib/models'
import { Panel } from '@/components/ui/Panel'
import { StatusTag } from '@/components/ui/StatusTag'
import { Skeleton } from '@/components/ui/Skeleton'
import type { BrandId } from '@/types'

/** Models ranked by live headline mentions. Model-wise sales are not published, so this says so. */
export function ModelRanking({ brand, className, limit = 8 }: { brand: BrandId; className?: string; limit?: number }) {
  const { data, isLoading } = useNewsData(brand)
  const cfg = BRAND_CONFIGS[brand]
  const ranked = useMemo(() => rankModels(brand, data?.data ?? []), [brand, data])
  const top = ranked.filter((r) => r.rank !== null).slice(0, limit)
  const max = top[0]?.hits.length ?? 1

  return (
    <Panel
      title="Most mentioned"
      kicker="In the news, not sales"
      className={className}
      action={<StatusTag status="live" note="Counted from the latest headlines. This measures attention, not sales." />}
      footer={
        <p className="text-[12px] text-fg-3">
          Ranked by headlines mentioning the model in the latest feed pull. {cfg.switchLabel} does not publish model-wise sales, so this is attention, not volume.{' '}
          <Link href="/models" className="underline underline-offset-2 hover:text-fg">All models</Link>
        </p>
      }
    >
      {isLoading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : top.length === 0 ? (
        <p className="py-6 text-[14px] text-fg-3">No model is named in the latest headlines.</p>
      ) : (
        <ol className="divide-y divide-line/[0.08]">
          {top.map((r, i) => (
            <li key={r.model.name} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 py-3">
              <span className="num display text-[26px] text-fg-3">{r.rank}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <p className="text-[16px] font-semibold text-fg">{r.model.name}</p>
                  <p className="text-[12.5px] text-fg-3">{r.model.body} · {r.model.power.join(' / ')}</p>
                  {r.model.bestSeller && (
                    <a href={r.model.bestSeller.sourceUrl} target="_blank" rel="noopener noreferrer" title={`${r.model.bestSeller.source}, ${r.model.bestSeller.period}`} className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
                      Reported best seller
                    </a>
                  )}
                </div>
                <span className="mt-2 block h-[4px] overflow-hidden rounded-full bg-fg/[0.07]">
                  <motion.span className="block h-full origin-left rounded-full" style={{ background: cfg.accentColor }} initial={{ scaleX: 0 }} animate={{ scaleX: r.hits.length / max }} transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.05 * i }} />
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
