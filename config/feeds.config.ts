import type { NewsItem } from '@/types'

export type RegionFilter = 'all' | 'india' | 'global'

export interface FeedConfig {
  url: string
  source: string
  color: NewsItem['sourceColor']
  region: 'india' | 'global'
}

export const FEEDS: FeedConfig[] = [
  // ── India ──────────────────────────────────────────────────────────────────
  { url: 'https://www.autocarindia.com/rss/news',                        source: 'Autocar India',   color: 'amber',  region: 'india' },
  { url: 'https://auto.economictimes.indiatimes.com/rss/topstories',     source: 'ET Auto',         color: 'green',  region: 'india' },
  { url: 'https://www.overdrive.in/feed/',                               source: 'Overdrive',       color: 'blue',   region: 'india' },
  { url: 'https://www.bsmotoring.com/rss.xml',                           source: 'BS Motoring',     color: 'gold',   region: 'india' },
  { url: 'https://feeds.feedburner.com/ndtvmotors',                      source: 'NDTV Auto',       color: 'red',    region: 'india' },
  { url: 'https://www.zigwheels.com/rss/news.xml',                       source: 'ZigWheels',       color: 'amber',  region: 'india' },
  { url: 'https://www.cardekho.com/rss/news.xml',                        source: 'CarDekho',        color: 'green',  region: 'india' },
  { url: 'https://www.carwale.com/rss/news.xml',                         source: 'CarWale',         color: 'blue',   region: 'india' },
  { url: 'https://www.motorbeam.com/feed/',                              source: 'MotorBeam',       color: 'gold',   region: 'india' },
  { url: 'https://indianautosblog.com/feed',                             source: 'Indian Autos Blog',color: 'red',   region: 'india' },
  { url: 'https://www.autoindiaonline.com/feed/',                        source: 'Auto India',      color: 'amber',  region: 'india' },
  { url: 'https://gaadikey.com/feed/',                                   source: 'Gaadi Key',       color: 'green',  region: 'india' },

  // ── Global ─────────────────────────────────────────────────────────────────
  { url: 'https://www.caranddriver.com/rss/all.xml/',                    source: 'Car & Driver',    color: 'amber',  region: 'global' },
  { url: 'https://www.motortrend.com/feeds/all/',                        source: 'MotorTrend',      color: 'red',    region: 'global' },
  { url: 'https://www.autoblog.com/rss.xml',                             source: 'Autoblog',        color: 'blue',   region: 'global' },
  { url: 'https://www.topgear.com/car-news/rss',                         source: 'Top Gear',        color: 'red',    region: 'global' },
  { url: 'https://www.autocar.co.uk/rss',                                source: 'Autocar UK',      color: 'amber',  region: 'global' },
  { url: 'https://www.autoevolution.com/rss/news.xml',                   source: 'Autoevolution',   color: 'green',  region: 'global' },
  { url: 'https://www.thedrive.com/feed',                                source: 'The Drive',       color: 'blue',   region: 'global' },
  { url: 'https://www.carscoops.com/feed/',                              source: 'Carscoops',       color: 'gold',   region: 'global' },
  { url: 'https://jalopnik.com/rss',                                     source: 'Jalopnik',        color: 'red',    region: 'global' },
  { url: 'https://electrek.co/feed/',                                    source: 'Electrek',        color: 'green',  region: 'global' },
  { url: 'https://insideevs.com/feed/',                                  source: 'InsideEVs',       color: 'blue',   region: 'global' },
  { url: 'https://www.motorauthority.com/rss.xml',                       source: 'Motor Authority', color: 'amber',  region: 'global' },
  { url: 'https://www.roadandtrack.com/rss/all.xml/',                    source: 'Road & Track',    color: 'red',    region: 'global' },
  { url: 'https://www.whichcar.com.au/rss',                              source: 'WhichCar',        color: 'gold',   region: 'global' },
  { url: 'https://www.drivingelectric.com/rss',                          source: 'Driving Electric',color: 'green',  region: 'global' },
  { url: 'https://www.autotrader.co.uk/editorial/rss',                   source: 'Autotrader UK',   color: 'blue',   region: 'global' },
  { url: 'https://www.evo.co.uk/rss',                                    source: 'evo Magazine',    color: 'gold',   region: 'global' },
]
