import { BRAND_MODELS, type ModelEntry } from '@/config/models.config'
import type { BrandId, NewsItem } from '@/types'

const norm = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9+. ]+/g, ' ').replace(/\s+/g, ' ')} `

/**
 * Attach each headline to at most one model. The longest matching phrase wins,
 * so "Range Rover Sport" does not also count for "Range Rover".
 */
export function mentionsByModel(brand: BrandId, items: NewsItem[]): Map<string, NewsItem[]> {
  const models = BRAND_MODELS[brand].models
  const phrases = models
    .flatMap((m) => m.keywords.map((k) => ({ model: m, phrase: norm(k.trim()) })))
    .sort((a, b) => b.phrase.length - a.phrase.length)
  const out = new Map<string, NewsItem[]>(models.map((m) => [m.name, []]))
  for (const item of items) {
    const text = norm(`${item.headline} ${item.snippet}`)
    const hit = phrases.find((p) => text.includes(p.phrase))
    if (hit) out.get(hit.model.name)!.push(item)
  }
  return out
}

export function lineupStats(models: ModelEntry[]) {
  const onSale = models.filter((m) => m.status !== 'upcoming')
  return {
    total: onSale.length,
    electric: onSale.filter((m) => m.power.includes('Electric')).length,
    upcoming: models.filter((m) => m.status === 'upcoming').length,
    suvs: onSale.filter((m) => m.body === 'SUV').length,
  }
}

export interface RankedModel {
  model: ModelEntry
  hits: NewsItem[]
  /** 1-based; ties share a rank; null when no recent headline mentions the model. */
  rank: number | null
}

/** Models ordered by how often the latest headlines mention them. This is attention, not sales. */
export function rankModels(brand: BrandId, items: NewsItem[]): RankedModel[] {
  const mentions = mentionsByModel(brand, items)
  const sorted = BRAND_MODELS[brand].models
    .map((model, order) => ({ model, hits: mentions.get(model.name) ?? [], order }))
    .sort((a, b) => b.hits.length - a.hits.length || a.order - b.order)
  let rank = 0, prev = -1
  return sorted.map((r, i) => {
    if (r.hits.length !== prev) { rank = i + 1; prev = r.hits.length }
    return { model: r.model, hits: r.hits, rank: r.hits.length > 0 ? rank : null }
  })
}
