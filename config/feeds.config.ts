import type { FeedRegion, SourceColor } from '@/types'

export type RegionFilter = 'all' | FeedRegion

export interface FeedConfig {
  url: string
  source: string
  color: SourceColor
  region: FeedRegion
}

// Checked 29 Oct 2026: each returned HTTP 200 with items. Feeds that were dead,
// blocked (403) or empty were removed: ET Auto, Overdrive, BS Motoring, NDTV Auto,
// ZigWheels, CarDekho, CarWale, Indian Autos Blog, Auto India, Gaadi Key,
// MotorTrend, Top Gear, Autocar UK, Autoevolution, Motor Authority, WhichCar,
// Driving Electric, Autotrader UK, evo. /api/health reports live status per feed.
export const FEEDS: FeedConfig[] = [
  // ── India ──────────────────────────────────────────────────────────────────
  { url: 'https://www.autocarindia.com/rss/news', source: 'Autocar India', color: 'amber', region: 'india' },
  { url: 'https://www.motorbeam.com/feed/',       source: 'MotorBeam',     color: 'gold',  region: 'india' },
  { url: 'https://www.rushlane.com/feed',         source: 'Rushlane',      color: 'red',   region: 'india' },
  { url: 'https://www.autox.com/feed/',           source: 'Autox',         color: 'green', region: 'india' },
  { url: 'https://www.motoroids.com/feed/',       source: 'Motoroids',     color: 'blue',  region: 'india' },

  // ── Global ─────────────────────────────────────────────────────────────────
  { url: 'https://www.caranddriver.com/rss/all.xml/', source: 'Car & Driver', color: 'amber', region: 'global' },
  { url: 'https://www.autoblog.com/rss.xml',          source: 'Autoblog',     color: 'blue',  region: 'global' },
  { url: 'https://www.thedrive.com/feed',             source: 'The Drive',    color: 'blue',  region: 'global' },
  { url: 'https://www.carscoops.com/feed/',           source: 'Carscoops',    color: 'gold',  region: 'global' },
  { url: 'https://jalopnik.com/rss',                  source: 'Jalopnik',     color: 'red',   region: 'global' },
  { url: 'https://electrek.co/feed/',                 source: 'Electrek',     color: 'green', region: 'global' },
  { url: 'https://insideevs.com/feed/',               source: 'InsideEVs',    color: 'blue',  region: 'global' },
  { url: 'https://www.roadandtrack.com/rss/all.xml/', source: 'Road & Track', color: 'red',   region: 'global' },
  { url: 'https://www.motor1.com/rss/news/all/',      source: 'Motor1',       color: 'amber', region: 'global' },
]

/** Per-brand India coverage from Google News search. Publisher name comes from each item. */
export function googleNewsFeed(query: string): FeedConfig {
  return {
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`,
    source: 'Google News',
    color: 'green',
    region: 'india',
  }
}
