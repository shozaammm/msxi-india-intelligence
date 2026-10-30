'use client'
import Link from 'next/link'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'
import { BRAND_MODELS } from '@/config/models.config'
import { lineupStats } from '@/lib/models'
import { useAppStore } from '@/lib/store'
import { Panel } from '@/components/ui/Panel'
import { StatusTag } from '@/components/ui/StatusTag'

export function LineupMatrix() {
  const setBrand = useAppStore((s) => s.setActiveBrand)
  return (
    <Panel title="Lineups compared" kicker="Models" action={<StatusTag status="reported" note={BRAND_MODELS.mercedes.provenance.note} />}
      footer={<p className="text-[12px] text-fg-3">Compiled by hand from public listings; lineups change. Open a brand to see each model.</p>}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-[14px]">
          <thead>
            <tr className="text-[12px] font-medium text-fg-3">
              <th className="pb-2 pr-3 font-medium">Brand</th><th className="pb-2 pr-3 text-right font-medium">Models</th><th className="pb-2 pr-3 text-right font-medium">SUVs</th><th className="pb-2 pr-3 text-right font-medium">Electric</th><th className="pb-2 text-right font-medium">Upcoming</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/[0.08]">
            {[...BRAND_IDS].sort((a, b) => lineupStats(BRAND_MODELS[b].models).total - lineupStats(BRAND_MODELS[a].models).total).map((id) => {
              const s = lineupStats(BRAND_MODELS[id].models)
              return (
                <tr key={id}>
                  <td className="py-3 pr-3"><Link href="/models" onClick={() => setBrand(id)} className="font-semibold text-fg hover:underline underline-offset-4">{BRAND_CONFIGS[id].switchLabel}</Link></td>
                  <td className="num py-3 pr-3 text-right text-fg">{s.total}</td>
                  <td className="num py-3 pr-3 text-right text-fg-2">{s.suvs}</td>
                  <td className="num py-3 pr-3 text-right text-fg-2">{s.electric}</td>
                  <td className="num py-3 text-right text-fg-2">{s.upcoming || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
