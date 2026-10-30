import { BRAND_CONFIGS } from '@/config/brands.config'
import { BRAND_SALES, MODEL_SALES, PERIODS, type BrandFigure, type ModelFigure, type PeriodId } from '@/config/sales.config'
import type { BrandId } from '@/types'

export const periodById = (id: PeriodId) => PERIODS.find((p) => p.id === id)!

/** YoY % from the printed prior or the printed percentage; null when the source gives neither. */
export function yoy(f: BrandFigure): number | null {
  if (f.prior) return ((f.units - f.prior) / f.prior) * 100
  return f.yoyPct ?? null
}

export interface RankedBrand extends BrandFigure {
  rank: number
  sharePct: number
}

/** Brands with a published figure for the period, highest first. Equal units share a rank. */
export function rankBrands(period: PeriodId): RankedBrand[] {
  const rows = [...(BRAND_SALES[period]?.rows ?? [])].sort((a, b) => b.units - a.units)
  const total = rows.reduce((n, r) => n + r.units, 0)
  return rows.map((r) => ({ ...r, rank: rows.findIndex((x) => x.units === r.units) + 1, sharePct: total ? (r.units / total) * 100 : 0 }))
}

/** Brands that have no figure for the period. */
export function missingBrands(period: PeriodId, all: BrandId[]): BrandId[] {
  const have = new Set((BRAND_SALES[period]?.rows ?? []).map((r) => r.brand))
  return all.filter((b) => !have.has(b))
}

export interface RankedModel extends ModelFigure {
  rank: number
  sharePct: number
}

/** Model-wise ranking for a period, optionally for one brand (rank stays overall). */
export function rankModels(period: PeriodId, brand?: BrandId): RankedModel[] {
  const rows = [...(MODEL_SALES[period]?.rows ?? [])].sort((a, b) => b.units - a.units)
  const total = rows.reduce((n, r) => n + r.units, 0)
  const ranked = rows.map((r) => ({ ...r, rank: rows.findIndex((x) => x.units === r.units) + 1, sharePct: total ? (r.units / total) * 100 : 0 }))
  return brand ? ranked.filter((r) => r.brand === brand) : ranked
}

/** CSV of the brand ranking for the chosen period. */
export function brandCsv(period: PeriodId): string {
  const meta = BRAND_SALES[period]
  const lines = ['rank,brand,units,yoy_pct,share_of_listed_pct,basis,source']
  for (const r of rankBrands(period)) {
    const y = yoy(r)
    lines.push([r.rank, BRAND_CONFIGS[r.brand].name, r.units, y === null ? '' : y.toFixed(1), r.sharePct.toFixed(1), meta?.basis, `"${meta?.source}"`].join(','))
  }
  return lines.join('\n')
}
