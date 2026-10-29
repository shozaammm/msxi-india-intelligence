'use client'
import { useNewsData } from '@/hooks/useNewsData'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { getBrandIntel } from '@/lib/intel'
import { BrandMark } from '@/components/ui/BrandMark'
import { StatusTag } from '@/components/ui/StatusTag'
import { SourceNote } from '@/components/ui/SourceNote'
import { cn, formatSignedPct, formatUnits } from '@/lib/utils'
import type { DataStatus } from '@/types'

const mb = getBrandIntel('mercedes')
const bmw = getBrandIntel('bmw')

export default function ComparePage() {
  const mbNews = useNewsData('mercedes')
  const bmwNews = useNewsData('bmw')
  const a = mb.annualSales.value
  const b = bmw.annualSales.value
  const lead = a.units - b.units

  const rows: { metric: string; mb: string; bmw: string; status: DataStatus; note?: string }[] = [
    { metric: `Cars sold in India, ${a.year}`, mb: formatUnits(a.units), bmw: formatUnits(b.units), status: 'reported' },
    { metric: `Change vs ${a.year - 1}`, mb: formatSignedPct(a.yoyPct), bmw: formatSignedPct(b.yoyPct), status: 'reported' },
    { metric: 'What the figure covers', mb: a.scope, bmw: b.scope, status: 'reported' },
    {
      metric: 'Brand stories in the feed now',
      mb: mbNews.data ? String(mbNews.data.data.length) : '…',
      bmw: bmwNews.data ? String(bmwNews.data.data.length) : '…',
      status: 'live',
      note: 'Count of matching headlines across all feeds right now; a measure of attention, not of quality.',
    },
    { metric: 'Luxury segment share', mb: `${mb.segmentShare.value}%`, bmw: `${bmw.segmentShare.value}%`, status: 'sample', note: mb.segmentShare.note },
    { metric: 'Largest state', mb: mb.topStates.value[0].stateName, bmw: bmw.topStates.value[0].stateName, status: 'sample', note: mb.topStates.note },
  ]

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="font-serif text-[16px] italic text-accent">Compare</p>
        <h1 className="max-w-[30ch] text-[28px] font-semibold tracking-[-0.025em] text-fg">
          Mercedes-Benz sold {formatUnits(Math.abs(lead))} {lead >= 0 ? 'more' : 'fewer'} cars in India than BMW Group in {a.year}
        </h1>
        <p className="mt-1 max-w-[70ch] text-[13px] leading-relaxed text-fg-2">
          Mercedes {formatSignedPct(a.yoyPct)} year on year; BMW Group {formatSignedPct(b.yoyPct)}, including MINI. Both are company-reported annual figures.
        </p>
      </header>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line/[0.07]">
              <th scope="col" className="w-[34%] px-5 py-4 align-bottom text-[12px] font-medium text-fg-3">Measure</th>
              {(['mercedes', 'bmw'] as const).map((id) => (
                <th key={id} scope="col" className="px-5 py-4">
                  <span className="flex items-center gap-3">
                    <BrandMark brand={id} size="sm" />
                    <span className="text-[14px] font-semibold text-fg">{BRAND_CONFIGS[id].name}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.metric} className="border-b border-line/[0.05] transition-colors last:border-0 hover:bg-fg/[0.02]">
                <th scope="row" className="px-5 py-3.5 align-top text-[13px] font-normal text-fg-2">
                  <span className="flex flex-wrap items-center gap-2">
                    {r.metric}
                    <StatusTag status={r.status} note={r.note} />
                  </span>
                </th>
                {[r.mb, r.bmw].map((v, i) => (
                  <td key={i} className={cn('px-5 py-3.5 align-top text-fg', /^[\d+−,.%…]+$/.test(v) ? 'num text-[16px]' : 'text-[13px] text-fg-2')}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-1">
        <SourceNote p={mb.annualSales} prefix="Mercedes-Benz" />
        <SourceNote p={bmw.annualSales} prefix="BMW Group" />
      </div>
    </div>
  )
}
