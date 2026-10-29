import { XMLParser } from 'fast-xml-parser'
import type { NewsItem, FeedRegion, SourceColor } from '@/types'
import { safeHttpUrl } from '@/lib/validate'
import { classifyTopics } from '@/lib/topics'
import { recordFeedResult } from '@/lib/feedHealth'

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', processEntities: true })

// Identify the bot honestly; publishers can contact us or block us.
export const BOT_USER_AGENT = 'MSXIIntelBot/1.0 (+https://www.msxi.com)'
const FEED_TIMEOUT_MS = 8000
const FEED_REVALIDATE_S = 600

export interface ParseOptions {
  source: string
  color: SourceColor
  region: FeedRegion
  keywords: string[]
  maxItems: number
  /** Injected for tests; defaults to now. */
  now?: Date
}

const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&nbsp;': ' ' }

function cleanText(raw: unknown): string {
  return String(raw ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(amp|lt|gt|quot|apos|nbsp|#39);/g, (m) => ENTITIES[m] ?? m)
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/\s+/g, ' ')
    .trim()
}

function textOf(node: unknown): string {
  if (node && typeof node === 'object' && '#text' in node) return String((node as Record<string, unknown>)['#text'])
  return typeof node === 'string' || typeof node === 'number' ? String(node) : ''
}

/** FNV-1a: stable id per article, so items keep their identity across refreshes. */
function hashId(input: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(36)
}

// Shape of fast-xml-parser output is whatever the publisher sent.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type XmlNode = Record<string, any>

function pickLink(item: XmlNode): string | null {
  const { link } = item
  if (typeof link === 'string') return safeHttpUrl(link)
  // Atom: one or many <link href rel>; prefer rel="alternate".
  const links = Array.isArray(link) ? link : link ? [link] : []
  const alt = links.find((l) => !l['@_rel'] || l['@_rel'] === 'alternate') ?? links[0]
  return safeHttpUrl(alt?.['@_href']) ?? safeHttpUrl(textOf(item.guid))
}

function parseDate(raw: unknown, now: Date): { iso: string; estimated: boolean } {
  const d = new Date(textOf(raw))
  if (!raw || Number.isNaN(d.getTime())) return { iso: now.toISOString(), estimated: true }
  // A date in the future is a feed bug; clamp it so it doesn't pin to the top.
  return { iso: (d > now ? now : d).toISOString(), estimated: false }
}

function keywordRegex(keywords: string[]): RegExp | null {
  if (keywords.length === 0) return null
  const alts = keywords.map((kw) => kw.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
  return new RegExp(`(?<![a-z0-9])(${alts.join('|')})(?![a-z0-9])`, 'i')
}

/** Pure: XML string → NewsItems. Never throws on a bad item; skips it instead. */
export function parseFeed(xml: string, opts: ParseOptions): NewsItem[] {
  const now = opts.now ?? new Date()
  const parsed = parser.parse(xml)
  const raw = parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? parsed?.['rdf:RDF']?.item ?? []
  const arr: XmlNode[] =Array.isArray(raw) ? raw : [raw]
  const kwRe = keywordRegex(opts.keywords)
  const isGoogleNews = opts.source === 'Google News'

  const out: NewsItem[] = []
  for (const item of arr) {
    if (out.length >= opts.maxItems) break
    if (!item || typeof item !== 'object') continue

    let headline = cleanText(textOf(item.title))
    const url = pickLink(item)
    if (!headline || !url) continue

    let source = opts.source
    if (isGoogleNews) {
      // Google News titles end in " - Publisher"; the publisher is also in <source>.
      const publisher = cleanText(textOf(item.source))
      if (publisher) {
        source = publisher
        if (headline.endsWith(` - ${publisher}`)) headline = headline.slice(0, -(publisher.length + 3))
      }
    }

    let snippet = cleanText(item.description ?? item.summary ?? item['content:encoded'] ?? item.content).slice(0, 260)
    // Google News descriptions just repeat the headline and publisher.
    if (isGoogleNews || snippet.startsWith(headline)) snippet = ''

    if (kwRe && !kwRe.test(`${headline} ${snippet}`)) continue

    const date = parseDate(item.pubDate ?? item.published ?? item.updated ?? item['dc:date'], now)
    out.push({
      id: hashId(url),
      headline,
      source,
      sourceColor: opts.color,
      region: opts.region,
      isoTimestamp: date.iso,
      ...(date.estimated ? { dateEstimated: true } : {}),
      snippet,
      url,
      topics: classifyTopics(`${headline} ${snippet}`),
    })
  }
  return out
}

/** `ok` means the feed answered and parsed, even if no item matched the keywords. */
export async function fetchAndParseRSS(url: string, opts: ParseOptions): Promise<{ ok: boolean; items: NewsItem[] }> {
  const started = Date.now()
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
      headers: { 'User-Agent': BOT_USER_AGENT, Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
      // Shared data cache: one upstream fetch per feed per 10 minutes, across instances where the host supports it.
      next: { revalidate: FEED_REVALIDATE_S },
    })
    if (!res.ok) {
      recordFeedResult({ url, source: opts.source, ok: false, httpStatus: res.status, items: 0, ms: Date.now() - started })
      return { ok: false, items: [] }
    }
    const items = parseFeed(await res.text(), opts)
    recordFeedResult({ url, source: opts.source, ok: true, httpStatus: res.status, items: items.length, ms: Date.now() - started })
    return { ok: true, items }
  } catch (err) {
    recordFeedResult({ url, source: opts.source, ok: false, items: 0, ms: Date.now() - started, error: err instanceof Error ? err.name : 'Error' })
    return { ok: false, items: [] }
  }
}
