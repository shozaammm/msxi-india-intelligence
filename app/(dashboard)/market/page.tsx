'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { useMarketData } from '@/hooks/useMarketData'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { MarketStrip } from '@/components/brief/MarketStrip'
import { Panel } from '@/components/ui/Panel'
import { SourceNote } from '@/components/ui/SourceNote'
import { StatusTag } from '@/components/ui/StatusTag'
import { formatUnits } from '@/lib/utils'

function FxConverter({ rate }: { rate: number | undefined }) {
  const [eur, setEur] = useState('85000')
  const n = Number(eur.replace(/,/g, ''))
  return (
    <div className="flex flex-col gap-3">
      <label className="label" htmlFor="eur">Price in euros</label>
      <input
        id="eur"
        inputMode="decimal"
        value={eur}
        onChange={(e) => setEur(e.target.value.replace(/[^\d.,]/g, ''))}
        className="num h-11 rounded-[10px] bg-ink px-3 text-[18px] text-fg ring-1 ring-line/10 focus:outline-none focus:ring-accent/50"
      />
      <p className="text-[12.5px] text-fg-3">
        ≈ <span className="num text-[20px] text-fg">{rate && Number.isFinite(n) ? `₹${Math.round(n * rate).toLocaleString('en-IN')}` : '—'}</span>
      </p>
      <p className="text-[11.5px] leading-relaxed text-fg-3">Currency conversion only. India ex-showroom prices include duties and taxes and are set locally.</p>
    </div>
  )
}

export default function MarketPage() {
  const brand = useAppStore((s) => s.activeBrand)
  const cfg = BRAND_CONFIGS[brand]
  const { data } = useMarketData(brand)

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-3">Market</p>
        <h1 className="display text-[clamp(36px,4vw,56px)] text-fg">{cfg.fullName}</h1>
        <p className="num mt-1 text-[12.5px] text-fg-3">{cfg.ticker} · {cfg.exchange}</p>
      </header>

      <MarketStrip brand={brand} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="How these numbers are made" kicker="Inputs">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className="label flex items-center gap-2">Share price {data?.quote ? <StatusTag status={data.quote.status} /> : <StatusTag status="unavailable" />}</dt>
              <dd className="mt-1 text-[13px] leading-relaxed text-fg-2">
                {data?.quote ? <SourceNote p={data.quote} /> : 'Comes from a licensed market-data feed (Twelve Data). Not set up on this deployment, so nothing is shown.'}
              </dd>
            </div>
            <div>
              <dt className="label flex items-center gap-2">Shares outstanding <StatusTag status={data?.sharesOutstanding.status ?? 'sample'} note={data?.sharesOutstanding.note} /></dt>
              <dd className="mt-1 text-[13px] leading-relaxed text-fg-2">
                <span className="num text-fg">{data ? formatUnits(data.sharesOutstanding.value) : '—'}</span>
                <br />
                {data && <SourceNote p={data.sharesOutstanding} />}
              </dd>
            </div>
            <div>
              <dt className="label flex items-center gap-2">EUR → INR {data?.fx && <StatusTag status={data.fx.status} />}</dt>
              <dd className="mt-1 text-[13px] leading-relaxed text-fg-2">{data?.fx ? <SourceNote p={data.fx} /> : 'Reference rate unavailable.'}</dd>
            </div>
            <div>
              <dt className="label">Why no intraday chart</dt>
              <dd className="mt-1 text-[13px] leading-relaxed text-fg-2">
                The old chart was simulated. A chart comes back once a licensed history feed is connected.
              </dd>
            </div>
          </dl>
        </Panel>
        <Panel title="Euro to rupee" kicker="Convert">
          <FxConverter rate={data?.fx?.value} />
        </Panel>
      </div>
    </div>
  )
}
