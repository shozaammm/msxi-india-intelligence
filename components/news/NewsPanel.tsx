'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNewsData } from '@/hooks/useNewsData'
import { useMarketData } from '@/hooks/useMarketData'
import { LiveIndicator } from '@/components/ui/LiveIndicator'
import { ErrorCard } from '@/components/ui/ErrorCard'
import { ProvenanceStamp } from '@/components/ui/ProvenanceStamp'
import { relativeTime, toIST } from '@/lib/utils'
import type { BrandId, NewsItem } from '@/types'

const COLOR_MAP: Record<NewsItem['sourceColor'], { badge: string; dot: string }> = {
  amber: { badge: 'bg-[#F59038]/15 text-[#C96A12]',  dot: 'bg-[#F59038]' },
  green: { badge: 'bg-[#2D9E6B]/12 text-[#1E7A50]',  dot: 'bg-[#2D9E6B]' },
  blue:  { badge: 'bg-[#2563EB]/10 text-[#1E50C0]',  dot: 'bg-[#2563EB]' },
  gold:  { badge: 'bg-[#B47B20]/12 text-[#8A5D14]',  dot: 'bg-[#C4933F]' },
  red:   { badge: 'bg-[#DC2626]/10 text-[#B91C1C]',  dot: 'bg-[#DC2626]' },
}

// India sources list for filtering
const INDIA_SOURCES = new Set([
  'Autocar India', 'ET Auto', 'Overdrive', 'BS Motoring', 'NDTV Auto',
  'ZigWheels', 'CarDekho', 'CarWale', 'MotorBeam', 'Indian Autos Blog',
  'Auto India', 'Gaadi Key',
])

type MainTab = 'news' | 'general' | 'culture'
type RegionFilter = 'all' | 'india' | 'global'

export function NewsPanel({ brand }: { brand: BrandId }) {
  const { data: brandNewsData, isError: isBrandNewsError, isLoading: isBrandNewsLoading } = useNewsData(brand, 'brand')
  const { data: generalNewsData, isError: isGeneralNewsError, isLoading: isGeneralNewsLoading } = useNewsData(brand, 'general')
  const { data: marketData, isError: isMarketError, isLoading: isMarketLoading } = useMarketData(brand)
  const [activeTab, setActiveTab] = useState<MainTab>('news')
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const isMB = brand === 'mercedes'
  const isNewsTab = activeTab === 'news' || activeTab === 'general'

  const newsData = activeTab === 'news' ? brandNewsData : generalNewsData
  const isNewsError = activeTab === 'news' ? isBrandNewsError : isGeneralNewsError
  const isNewsLoading = activeTab === 'news' ? isBrandNewsLoading : isGeneralNewsLoading

  const isError = isNewsTab ? isNewsError : isMarketError
  const isLoading = isNewsTab ? isNewsLoading : isMarketLoading

  // Filter by region
  const filteredNews = useMemo(() => {
    if (!newsData) return []
    if (regionFilter === 'india') return newsData.filter(n => INDIA_SOURCES.has(n.source))
    if (regionFilter === 'global') return newsData.filter(n => !INDIA_SOURCES.has(n.source))
    return newsData
  }, [newsData, regionFilter])

  const totalCount = newsData?.length ?? 0
  const indiaCount = newsData?.filter(n => INDIA_SOURCES.has(n.source)).length ?? 0
  const globalCount = newsData?.filter(n => !INDIA_SOURCES.has(n.source)).length ?? 0

  return (
    <motion.section
      className="bg-[#13121E] border-t border-white/[0.06] flex flex-col overflow-hidden h-full"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      key={brand}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-0 flex-shrink-0">
        <div className="flex gap-5 border-b border-white/[0.06] w-full pb-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('news')}
            className={`text-[12px] font-bold tracking-[0.08em] uppercase pb-3 transition-all cursor-pointer relative flex-shrink-0 ${
              activeTab === 'news' ? 'text-[#EDE9DF]' : 'text-[#EDE9DF]/50 hover:text-[#EDE9DF]/80'
            }`}
          >
            Live Intelligence
            {activeTab === 'news' && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A880] rounded-full" layoutId="activeNewsTab" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`text-[12px] font-bold tracking-[0.08em] uppercase pb-3 transition-all cursor-pointer relative flex-shrink-0 ${
              activeTab === 'general' ? 'text-[#EDE9DF]' : 'text-[#EDE9DF]/50 hover:text-[#EDE9DF]/80'
            }`}
          >
            General Auto News
            {activeTab === 'general' && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A880] rounded-full" layoutId="activeNewsTab" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('culture')}
            className={`text-[12px] font-bold tracking-[0.08em] uppercase pb-3 transition-all cursor-pointer relative flex-shrink-0 ${
              activeTab === 'culture' ? 'text-[#EDE9DF]' : 'text-[#EDE9DF]/50 hover:text-[#EDE9DF]/80'
            }`}
          >
            Car Culture & Clubs
            {activeTab === 'culture' && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A880] rounded-full" layoutId="activeNewsTab" />
            )}
          </button>

          <div className="ml-auto pb-3 flex items-center gap-2 flex-shrink-0">
            {isNewsTab && !isNewsLoading && (
              <>
                <LiveIndicator label="Live" size="xs"/>
                <span className="text-[11px] font-bold text-[#EDE9DF]/80 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded">
                  {filteredNews.length} articles
                </span>
              </>
            )}
            {activeTab === 'culture' && (
              <span className="text-[11px] font-bold text-[#C5A880] border border-[#C5A880]/25 bg-[#C5A880]/[0.06] px-2.5 py-0.5 rounded">
                Community
              </span>
            )}
          </div>
        </div>
      </div>

      {isError && <div className="px-5 mt-4"><ErrorCard source={isNewsTab ? "Autocar India · ET Auto · Overdrive · Car & Driver · Top Gear · 29 sources" : "Enthusiast Intelligence Feed"}/></div>}

      {/* News Loading skeleton */}
      {isLoading && isNewsTab && (
        <div className="flex flex-col gap-0 flex-1 px-5 pt-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-3.5 border-b border-white/[0.06] animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-16 bg-white/[0.06] rounded-sm"/>
                <div className="h-3 w-20 bg-white/[0.04] rounded-sm"/>
              </div>
              <div className="h-3.5 w-full bg-white/[0.05] rounded mb-1.5"/>
              <div className="h-3.5 w-4/5 bg-white/[0.04] rounded"/>
            </div>
          ))}
        </div>
      )}

      {!isError && !isLoading && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {isNewsTab ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Region filter pills */}
                <div className="flex items-center gap-1.5 px-5 pt-3 pb-2 flex-shrink-0">
                  {([
                    { key: 'all',    label: `All (${totalCount})` },
                    { key: 'india',  label: `🇮🇳 India (${indiaCount})` },
                    { key: 'global', label: `🌍 Global (${globalCount})` },
                  ] as { key: RegionFilter; label: string }[]).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setRegionFilter(key)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        regionFilter === key
                          ? 'bg-[#C5A880] text-[#0D0C14] border-[#C5A880]'
                          : 'bg-transparent text-[#EDE9DF]/65 border-white/[0.12] hover:border-white/[0.25] hover:text-[#EDE9DF]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Scrollable feed */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-5">
                  {filteredNews.length === 0 ? (
                    <div className="flex items-center justify-center h-24 text-[12px] text-[#EDE9DF]/40">
                      No articles found for this region yet — feeds loading…
                    </div>
                  ) : (
                    filteredNews.map((item, i) => {
                      const colors = COLOR_MAP[item.sourceColor]
                      const isExpanded = expandedId === item.id
                      const isIndia = INDIA_SOURCES.has(item.source)
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i * 0.025, 0.4), duration: 0.3 }}
                          className="border-b border-white/[0.06] last:border-0 cursor-pointer group"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        >
                          <div className="py-3 flex flex-col gap-1.5">
                            {/* Source row */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-extrabold tracking-[0.07em] uppercase px-2 py-0.5 rounded-sm ${colors.badge}`}>
                                {item.source}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${isIndia ? 'text-[#C5A880] bg-[#C5A880]/10' : 'text-[#7AA0E8] bg-[#4A7AE0]/15'}`}>
                                {isIndia ? '🇮🇳' : '🌍'}
                              </span>
                              <span className="text-[10px] text-[#EDE9DF]/50 tabular-nums ml-auto">
                                {relativeTime(item.isoTimestamp)}
                              </span>
                            </div>

                            {/* Headline */}
                            <p className={`text-[13px] font-semibold leading-snug transition-colors ${
                              isExpanded ? 'text-[#EDE9DF]' : 'text-[#EDE9DF]/80 group-hover:text-[#EDE9DF]'
                            }`}>
                              {item.headline}
                            </p>

                            {/* Expanded snippet + CTA */}
                            <AnimatePresence>
                              {isExpanded && item.snippet && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <p className="text-[12px] text-[#EDE9DF]/65 leading-relaxed mt-0.5 mb-2">
                                    {item.snippet}
                                  </p>
                                  <div className="flex items-center gap-3">
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-[11px] font-bold tracking-[0.05em] uppercase text-[#0D0C14] bg-[#C5A880] hover:bg-[#C5A880]/90 px-3 py-1.5 rounded transition-colors"
                                    >
                                      Read Full Article ↗
                                    </a>
                                    <span className="text-[11px] text-[#EDE9DF]/40">
                                      {toIST(new Date(item.isoTimestamp).getTime())} IST
                                    </span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Collapsed read link */}
                            {!isExpanded && (
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-[#EDE9DF]/30 group-hover:text-[#EDE9DF]/60 transition-colors">
                                  Tap to expand · read full article ↗
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 pt-2 pb-3 flex-shrink-0 border-t border-white/[0.06]">
                  <p className="text-[10px] tracking-[0.06em] uppercase text-[#EDE9DF]/30 leading-normal">
                    Sources: Autocar India · ET Auto · Overdrive · ZigWheels · CarDekho · CarWale · MotorBeam · Car & Driver · MotorTrend · Top Gear · Autoblog · Autocar UK · Autoevolution · The Drive · Carscoops · Jalopnik · Electrek · Road & Track · Autotrader UK · evo Magazine · +9 more — Raw RSS · Unedited
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ── Tab 2: Car Culture & Clubs ── */
              <motion.div
                key="culture-stream"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-y-auto no-scrollbar px-5 pt-3 gap-4"
              >
                {marketData && (
                  <>
                    {/* Enthusiast Index card */}
                    <div className="flex gap-4 items-center bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                      {isMB && (
                        <img
                          src="/logos/affalterbach_amg.png"
                          alt="Affalterbach Crest"
                          className="w-[48px] h-[48px] object-contain flex-shrink-0 opacity-80"
                        />
                      )}
                      <div className="flex-1">
                        <span className="text-[11px] font-bold tracking-[0.10em] uppercase text-[#EDE9DF]/55 block mb-1">Enthusiast Index</span>
                        <span className="font-['Space_Grotesk',sans-serif] text-[26px] font-extrabold text-[#EDE9DF] tracking-tight">
                          {marketData.carCulture.enthusiastIndex.toFixed(1)}
                          <span className="text-[#C5A880] text-[15px] font-bold ml-2">/ 10 (Elite)</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {marketData.carCulture.officialClubs.map((club) => (
                            <span key={club} className="text-[11px] font-semibold text-[#EDE9DF]/80 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                              {club.split(' (')[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isMB && (
                        <img
                          src="/logos/mercedes_amg.png"
                          alt="Mercedes-AMG"
                          className="h-[20px] w-auto object-contain flex-shrink-0 opacity-60"
                        />
                      )}
                    </div>

                    {/* Culture editorial */}
                    <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-xl">
                      <span className="text-[11px] font-bold tracking-[0.08em] text-[#EDE9DF] uppercase block mb-2">Enthusiast & Heritage Culture</span>
                      <p className="text-[13px] text-[#EDE9DF]/75 leading-relaxed">
                        {marketData.carCulture.cultureHighlight}
                      </p>
                    </div>

                    {/* Major events */}
                    <div>
                      <span className="text-[11px] font-bold tracking-[0.10em] uppercase text-[#EDE9DF]/55 mb-3 block">Notable Brand Festivals & Events</span>
                      <div className="flex flex-col gap-3">
                        {marketData.carCulture.majorEvents.map((evt) => (
                          <div key={evt.name} className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[13px] font-bold text-[#EDE9DF]">{evt.name}</span>
                              <span className="text-[11px] font-semibold text-[#C5A880] bg-[#C5A880]/[0.10] px-2.5 py-0.5 rounded-full">
                                {evt.location.split(', ')[0]}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#EDE9DF]/65 leading-snug">{evt.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <ProvenanceStamp label="Sources: Official Enthusiast Clubs India · Brand Heritage Archives" live={false}/>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  )
}
