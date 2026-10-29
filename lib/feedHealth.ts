// Last result per feed, per server instance. Good enough to spot dead feeds in
// /api/health; move to persistent storage when a scheduled fetch job exists.

export interface FeedResult {
  url: string
  source: string
  ok: boolean
  httpStatus?: number
  items: number
  ms: number
  error?: string
  checkedAt: string
}

const health = new Map<string, FeedResult>()

export function recordFeedResult(r: Omit<FeedResult, 'checkedAt'>) {
  const result = { ...r, checkedAt: new Date().toISOString() }
  health.set(r.url, result)
  if (!r.ok) console.warn(`[feeds] ${r.source} failed: ${r.httpStatus ?? r.error ?? 'unknown'} (${r.url})`)
}

export function getFeedHealth(): FeedResult[] {
  return [...health.values()].sort((a, b) => Number(a.ok) - Number(b.ok) || a.source.localeCompare(b.source))
}
