'use client'
import { useMemo } from 'react'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'
import { useAllBrandNews } from '@/hooks/useAllBrandNews'
import { Panel } from '@/components/ui/Panel'
import { StatusTag } from '@/components/ui/StatusTag'
import { Skeleton } from '@/components/ui/Skeleton'
import { relativeTime } from '@/lib/utils'

export function LatestAcross() {
  const { byBrand, loading } = useAllBrandNews()
  const items = useMemo(
    () => BRAND_IDS.flatMap((id) => byBrand[id].filter((i) => !i.dateEstimated).map((i) => ({ ...i, brand: id })))
      .sort((a, b) => b.isoTimestamp.localeCompare(a.isoTimestamp)).slice(0, 14),
    [byBrand],
  )
  return (
    <Panel title="Latest across all brands" kicker="Headlines" action={<StatusTag status="live" />} bodyClassName="overflow-y-auto" className="max-h-[720px]">
      {loading && items.length === 0 ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : (
        <ul className="divide-y divide-line/[0.08]">
          {items.map((i) => (
            <li key={`${i.brand}-${i.id}`}>
              <a href={i.url} target="_blank" rel="noopener noreferrer" className="block py-3 transition-colors hover:text-accent">
                <p className="flex flex-wrap items-center gap-x-2 text-[12.5px] text-fg-3">
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-fg ring-1 ring-fg/30">{BRAND_CONFIGS[i.brand].switchLabel}</span>
                  {i.source} · {relativeTime(i.isoTimestamp)}
                </p>
                <p className="mt-1 text-[15px] leading-snug text-fg">{i.headline}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
