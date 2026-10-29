import { XMLParser } from 'fast-xml-parser'
import type { NewsItem } from '@/types'

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

const RSS_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
}

export async function fetchAndParseRSS(
  url: string,
  source: string,
  color: NewsItem['sourceColor'],
  keywords: string[],
  maxItems = 8,
): Promise<NewsItem[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: RSS_HEADERS,
    })
    if (!res.ok) return []

    const xml = await res.text()
    const parsed = parser.parse(xml)

    const raw = parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? []
    const arr: any[] = Array.isArray(raw) ? raw : [raw]

    const filtered = keywords.length === 0
      ? arr
      : arr.filter((item) => {
          const text = `${item.title ?? ''} ${item.description ?? ''} ${item.summary ?? ''} ${item['content:encoded'] ?? ''}`.toLowerCase()
          return keywords.some((kw) => {
            const escaped = kw.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            const regex = new RegExp(`(?<![a-zA-Z0-9])${escaped}(?![a-zA-Z0-9])`, 'i')
            return regex.test(text)
          })
        })

    return filtered.slice(0, maxItems).map((item, idx) => {
      const pubDate = item.pubDate ?? item.published ?? item.updated ?? new Date().toISOString()
      const link = typeof item.link === 'string'
        ? item.link
        : (item.link?.['@_href'] ?? item.guid ?? '#')
      const desc = String(item.description ?? item.summary ?? item['content:encoded'] ?? '')
        .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim().slice(0, 260)

      return {
        id: `${source}-${idx}-${Date.now()}`,
        headline: String(item.title ?? 'No title').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim(),
        source,
        sourceColor: color,
        isoTimestamp: new Date(pubDate).toISOString(),
        snippet: desc,
        url: link,
      }
    })
  } catch {
    return []
  } finally {
    clearTimeout(timer)
  }
}
