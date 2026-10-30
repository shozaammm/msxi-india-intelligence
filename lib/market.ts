import { BRAND_CONFIGS } from '@/config/brands.config'
import { BRAND_INTEL } from '@/config/intel.config'
import type { BrandId, MarketSnapshot, Quote, Sourced } from '@/types'

// Licensed provider only. Yahoo/Stooq scraping was removed: no public API,
// terms forbid commercial use, and both were blocking us (429 / bot wall).
// Set TWELVE_DATA_API_KEY to enable quotes; check your plan covers XETRA.
const QUOTE_TTL_MS = 60_000
const FX_TTL_MS = 60 * 60_000

const quoteCache = new Map<BrandId, { quote: Quote | null; ts: number }>()
let fxCache: { fx: Sourced<number> | null; ts: number } | null = null

async function fetchFx(): Promise<Sourced<number> | null> {
  if (fxCache && Date.now() - fxCache.ts < FX_TTL_MS) return fxCache.fx
  try {
    // Frankfurter publishes the European Central Bank reference rates; free, no key.
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=INR', {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(String(res.status))
    const json = await res.json()
    const rate = Number(json?.rates?.INR)
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('bad rate')
    const fx: Sourced<number> = {
      value: rate,
      status: 'live',
      source: 'European Central Bank reference rate (via Frankfurter)',
      sourceUrl: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
      asOf: String(json.date ?? new Date().toISOString().slice(0, 10)),
    }
    fxCache = { fx, ts: Date.now() }
    return fx
  } catch {
    // Keep the last good rate but mark it stale; never invent one.
    if (fxCache?.fx) return { ...fxCache.fx, status: 'stale' }
    return null
  }
}

async function fetchQuote(brand: BrandId): Promise<Quote | null> {
  const key = process.env.TWELVE_DATA_API_KEY
  if (!key) return null
  const cached = quoteCache.get(brand)
  if (cached && Date.now() - cached.ts < QUOTE_TTL_MS) return cached.quote

  const { symbol, exchange } = BRAND_CONFIGS[brand].providerSymbol
  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&exchange=${encodeURIComponent(exchange)}&apikey=${encodeURIComponent(key)}`
    const res = await fetch(url, { signal: AbortSignal.timeout(6000), cache: 'no-store' })
    const json = await res.json()
    const price = Number(json?.close)
    if (!res.ok || json?.status === 'error' || !Number.isFinite(price)) throw new Error(json?.message ?? String(res.status))
    const quote: Quote = {
      price,
      changePct: Number.isFinite(Number(json.percent_change)) ? Number(json.percent_change) : null,
      currency: String(json.currency ?? 'EUR'),
      status: 'live',
      source: `Twelve Data · ${exchange}`,
      sourceUrl: 'https://twelvedata.com/',
      asOf: String(json.datetime ?? new Date().toISOString()),
    }
    quoteCache.set(brand, { quote, ts: Date.now() })
    return quote
  } catch (err) {
    console.warn(`[market] quote failed for ${symbol}: ${err instanceof Error ? err.message : err}`)
    if (cached?.quote) return { ...cached.quote, status: 'stale' }
    return null
  }
}

export async function getMarketSnapshot(brand: BrandId): Promise<MarketSnapshot> {
  const config = BRAND_CONFIGS[brand]
  const shares = BRAND_INTEL[brand].sharesOutstanding
  const [fx, quote] = await Promise.all([fetchFx(), fetchQuote(brand)])
  return {
    brand,
    ticker: config.ticker,
    exchange: config.exchange,
    fx,
    quote,
    marketCapEUR: quote && quote.currency === 'EUR' && shares.value > 0 ? quote.price * shares.value : null,
    sharesOutstanding: shares,
    providerConfigured: Boolean(process.env.TWELVE_DATA_API_KEY),
    fetchedAt: new Date().toISOString(),
  }
}
