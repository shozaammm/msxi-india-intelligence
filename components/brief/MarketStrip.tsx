'use client'
import Link from 'next/link'
import { useMarketData } from '@/hooks/useMarketData'
import { StatusTag } from '@/components/ui/StatusTag'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn, formatEUR, formatSignedPct, mktCapINR } from '@/lib/utils'
import type { BrandId } from '@/types'

const CURRENCY_SYMBOL: Record<string, string> = { EUR: '€', INR: '₹', JPY: '¥', USD: '$' }

/** Compact parent-group market context. Shows nothing it can't source. */
export function MarketStrip({ brand }: { brand: BrandId }) {
  const { data, isLoading, isError } = useMarketData(brand)

  const cells = [
    {
      label: 'Share price',
      value: data?.quote ? `${CURRENCY_SYMBOL[data.quote.currency] ?? `${data.quote.currency} `}${data.quote.price.toFixed(2)}` : '—',
      sub: data?.quote?.changePct != null ? formatSignedPct(data.quote.changePct, 2) : data?.providerConfigured ? 'No quote' : 'Feed not set up',
      subTone: data?.quote?.changePct != null ? (data.quote.changePct >= 0 ? 'text-pos' : 'text-neg') : 'text-fg-3',
      status: data?.quote?.status ?? 'unavailable',
    },
    {
      label: 'Market cap (approx.)',
      value: formatEUR(data?.marketCapEUR),
      sub: data?.marketCapEUR ? mktCapINR(data.marketCapEUR, data.fx?.value) : 'Needs a live quote',
      subTone: 'text-fg-3',
      status: data?.marketCapEUR ? 'sample' : 'unavailable',
      note: data?.sharesOutstanding.note,
    },
    {
      label: 'EUR → INR',
      value: data?.fx ? `₹${data.fx.value.toFixed(2)}` : '—',
      sub: data?.fx ? `ECB · ${data.fx.asOf}` : 'Rate unavailable',
      subTone: 'text-fg-3',
      status: data?.fx?.status ?? 'unavailable',
    },
  ] as const

  return (
    <section className="card grid grid-cols-1 divide-y divide-line/[0.07] sm:grid-cols-3 sm:divide-x sm:divide-y-0" aria-label="Market context">
      {cells.map((c) => (
        <div key={c.label} className="flex flex-col gap-1 px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="label">{c.label}</p>
            {!isLoading && <StatusTag status={c.status} note={'note' in c ? c.note : undefined} />}
          </div>
          {isLoading ? (
            <Skeleton className="mt-1 h-7 w-28" />
          ) : (
            <p className={cn('num text-[24px] font-medium tracking-[-0.03em]', c.value === '—' ? 'text-fg-3' : 'text-fg')}>{c.value}</p>
          )}
          <p className={cn('num text-[12px]', isError ? 'text-neg' : c.subTone)}>{isError ? 'Request failed' : c.sub}</p>
        </div>
      ))}
      {!isLoading && data && !data.providerConfigured && (
        <p className="col-span-full px-5 py-2.5 text-[11.5px] text-fg-3 sm:border-t sm:border-line/[0.07]">
          Share prices need a licensed feed. Add <code className="num text-fg-2">TWELVE_DATA_API_KEY</code> to the deployment. <Link href="/methodology#market" className="underline underline-offset-2 hover:text-fg">Why</Link>
        </p>
      )}
    </section>
  )
}
