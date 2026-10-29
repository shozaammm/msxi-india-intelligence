import { describe, expect, it } from 'vitest'
import { parseFeed, type ParseOptions } from '@/lib/rssParser'

const NOW = new Date('2026-10-29T12:00:00Z')
const opts = (o: Partial<ParseOptions> = {}): ParseOptions => ({
  source: 'Test', color: 'amber', region: 'india', keywords: [], maxItems: 20, now: NOW, ...o,
})

const rss = (items: string) => `<?xml version="1.0"?><rss><channel>${items}</channel></rss>`
const item = (title: string, link: string, date = 'Tue, 28 Oct 2026 10:00:00 GMT', desc = '') =>
  `<item><title>${title}</title><link>${link}</link><pubDate>${date}</pubDate><description>${desc}</description></item>`

describe('parseFeed', () => {
  it('parses a normal RSS item', () => {
    const [n] = parseFeed(rss(item('BMW X5 launched at ₹96 lakh', 'https://example.com/a')), opts())
    expect(n.headline).toBe('BMW X5 launched at ₹96 lakh')
    expect(n.url).toBe('https://example.com/a')
    expect(n.isoTimestamp).toBe('2026-10-28T10:00:00.000Z')
    expect(n.topics).toEqual(expect.arrayContaining(['launch', 'pricing']))
  })

  it('handles a feed with a single item (not an array)', () => {
    expect(parseFeed(rss(item('Only one', 'https://example.com/1')), opts())).toHaveLength(1)
  })

  it('drops javascript: and relative links', () => {
    const xml = rss(item('Evil', 'javascript:alert(1)') + item('Relative', '/news/2') + item('Good', 'https://ok.example/3'))
    expect(parseFeed(xml, opts()).map((n) => n.headline)).toEqual(['Good'])
  })

  it('keeps the feed when one item has a bad date, and flags it', () => {
    const xml = rss(item('Bad date', 'https://e.com/1', 'not a date') + item('Good date', 'https://e.com/2'))
    const out = parseFeed(xml, opts())
    expect(out).toHaveLength(2)
    expect(out[0].dateEstimated).toBe(true)
    expect(out[0].isoTimestamp).toBe(NOW.toISOString())
    expect(out[1].dateEstimated).toBeUndefined()
  })

  it('clamps future dates to now', () => {
    const [n] = parseFeed(rss(item('Future', 'https://e.com/f', 'Mon, 01 Jan 2035 00:00:00 GMT')), opts())
    expect(n.isoTimestamp).toBe(NOW.toISOString())
  })

  it('gives the same id for the same URL across fetches', () => {
    const xml = rss(item('A', 'https://e.com/same'))
    expect(parseFeed(xml, opts())[0].id).toBe(parseFeed(xml, opts({ now: new Date() }))[0].id)
  })

  it('matches keywords on word boundaries only', () => {
    const xml = rss(item('New BMW 3 Series', 'https://e.com/1') + item('Submwave headphones', 'https://e.com/2'))
    expect(parseFeed(xml, opts({ keywords: ['bmw'] })).map((n) => n.headline)).toEqual(['New BMW 3 Series'])
  })

  it('parses Atom entries with link arrays', () => {
    const atom = `<feed><entry><title>Atom story</title><link rel="self" href="https://e.com/self"/><link rel="alternate" href="https://e.com/post"/><updated>2026-10-27T08:00:00Z</updated><summary>Text</summary></entry></feed>`
    const [n] = parseFeed(atom, opts())
    expect(n.url).toBe('https://e.com/post')
  })

  it('splits publisher out of Google News titles', () => {
    const xml = rss(`<item><title>Mercedes opens Pune plant line - Autocar India</title><link>https://news.google.com/x</link><pubDate>Tue, 28 Oct 2026 10:00:00 GMT</pubDate><source url="https://autocarindia.com">Autocar India</source><description>&lt;a&gt;Mercedes opens Pune plant line&lt;/a&gt;</description></item>`)
    const [n] = parseFeed(xml, opts({ source: 'Google News' }))
    expect(n.headline).toBe('Mercedes opens Pune plant line')
    expect(n.source).toBe('Autocar India')
    expect(n.snippet).toBe('')
  })

  it('strips HTML and decodes entities in snippets', () => {
    const [n] = parseFeed(rss(item('T', 'https://e.com/1', undefined, '&lt;p&gt;Price &amp;amp; specs&lt;/p&gt;')), opts())
    expect(n.snippet).toBe('Price & specs')
  })
})
