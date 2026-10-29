'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMarketData } from '@/hooks/useMarketData'
import { ErrorCard } from '@/components/ui/ErrorCard'
import { ProvenanceStamp } from '@/components/ui/ProvenanceStamp'
import type { BrandId } from '@/types'

export function MarketplacePanel({ brand }: { brand: BrandId }) {
  const { data, isError, isLoading } = useMarketData(brand)
  const [activeReviewer, setActiveReviewer] = useState<number>(0)

  const CHANNEL_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
    'Autocar India': { bg: 'bg-[#E08040]/12', text: 'text-[#E08040]', border: 'border-[#E08040]/30' },
    'MotorBeam':     { bg: 'bg-[#3DB87A]/10', text: 'text-[#3DB87A]', border: 'border-[#3DB87A]/30' },
    'Evo India':     { bg: 'bg-[#4A7AE0]/12', text: 'text-[#7AA0E8]', border: 'border-[#4A7AE0]/30' },
  }

  return (
    <motion.section
      className="bg-[#13121E] border-b border-white/[0.07] px-6 py-5 flex flex-col overflow-hidden h-full"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      key={brand}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-['Space_Grotesk',sans-serif] text-[13px] font-bold tracking-[0.10em] uppercase text-[#9A97A8]">
          Customer & Critic Sentiment Hub
        </span>
        <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#C4933F] border border-[#C4933F]/30 bg-[#C4933F]/[0.08] px-2.5 py-1 rounded">
          Verified Reviews
        </span>
      </div>

      {isError && <ErrorCard source="Team-BHP & YouTube Intelligence Stream"/>}

      {isLoading && (
        <div className="flex flex-col gap-4 flex-1 justify-center animate-pulse">
          <div className="h-7 w-1/3 bg-white/[0.06] rounded"/>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 bg-white/[0.04] rounded-xl"/>
            <div className="h-24 bg-white/[0.04] rounded-xl"/>
          </div>
          <div className="h-28 bg-white/[0.04] rounded-xl"/>
        </div>
      )}

      {!isError && !isLoading && data && (
        <div className="flex-1 flex flex-col overflow-y-auto pr-1 select-none no-scrollbar gap-4">

          {/* Section 1: Verified Owner Reviews */}
          <div className="flex items-center gap-4 pb-4 border-b border-white/[0.07]">
            {/* Rating circle */}
            <div className="flex flex-col items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-3 flex-shrink-0">
              <span className="font-['Space_Grotesk',sans-serif] text-[32px] font-extrabold text-[#EDE9DF] leading-none">
                {data.userRating.toFixed(1)}
              </span>
              <span className="text-[11px] text-[#7A7685] font-semibold mt-1">/ 5.0</span>
            </div>

            {/* Owner quick description */}
            <div className="flex-1">
              <div className="flex gap-0.5 text-[#C4933F] text-[15px] mb-1.5">
                {'★'.repeat(Math.floor(data.userRating))}
                {data.userRating % 1 !== 0 ? '½' : ''}
              </div>
              <p className="text-[12px] text-[#7A7685] leading-relaxed">
                Composite of <span className="text-[#EDE9DF] font-bold">{data.totalUserReviews} verified owners</span> surveyed on Team-BHP & CarWale. Consistently high satisfaction scores.
              </p>
            </div>
          </div>

          {/* Owner Pros & Cons (Team-BHP style) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Positives */}
            <div className="bg-[#15231D]/50 border border-[#3DB87A]/20 rounded-xl p-4 hover:bg-[#15231D]/70 transition-colors">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] font-extrabold text-[#3DB87A] bg-[#3DB87A]/15 px-2 py-0.5 rounded">PROS</span>
                <span className="text-[11px] font-bold text-[#7A7685] tracking-[0.04em] uppercase">Owner Highs</span>
              </div>
              <ul className="flex flex-col gap-2">
                {data.userSentimentPositives.slice(0, 2).map((pos, idx) => (
                  <li key={idx} className="text-[12px] text-[#7A7685] leading-snug flex items-start gap-1.5">
                    <span className="text-[#3DB87A] flex-shrink-0 mt-0.5 text-[10px]">●</span>
                    <span>{pos}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critiques */}
            <div className="bg-[#241A1A]/50 border border-[#D95454]/20 rounded-xl p-4 hover:bg-[#241A1A]/70 transition-colors">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] font-extrabold text-[#D95454] bg-[#D95454]/15 px-2 py-0.5 rounded">CONS</span>
                <span className="text-[11px] font-bold text-[#7A7685] tracking-[0.04em] uppercase">Owner Lows</span>
              </div>
              <ul className="flex flex-col gap-2">
                {data.userSentimentNegatives.slice(0, 2).map((neg, idx) => (
                  <li key={idx} className="text-[12px] text-[#7A7685] leading-snug flex items-start gap-1.5">
                    <span className="text-[#D95454] flex-shrink-0 mt-0.5 text-[10px]">●</span>
                    <span>{neg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 2: YouTube Expert Review Cards */}
          <div>
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#7A7685] mb-3 block">
              YouTube Expert Critic Reviews & Verdicts
            </span>

            {/* Selection pills */}
            <div className="flex gap-2 mb-3">
              {data.youtubeReviews.map((rev, idx) => {
                const active = activeReviewer === idx
                const chanColor = CHANNEL_COLOR_MAP[rev.channel] || { bg: 'bg-white/10', text: 'text-[#EDE9DF]', border: 'border-white/20' }
                return (
                  <button
                    key={rev.channel}
                    onClick={() => setActiveReviewer(idx)}
                    className={`flex items-center gap-1.5 text-[11px] font-bold tracking-[0.05em] px-3 py-1.5 rounded border transition-all cursor-pointer ${
                      active
                        ? `${chanColor.text} ${chanColor.bg} ${chanColor.border}`
                        : 'text-[#5A5868] bg-transparent border-white/[0.08] hover:border-white/[0.18] hover:text-[#9A97A8]'
                    }`}
                  >
                    {rev.channel}
                  </button>
                )
              })}
            </div>

            {/* Selected Review Card */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReviewer}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#161524] border border-white/[0.06] p-4 rounded-xl flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#EDE9DF]">
                        {data.youtubeReviews[activeReviewer].reviewer}
                      </span>
                      <span className="text-[11px] text-[#5A5868]">·</span>
                      <span className="text-[11px] text-[#7A7685] italic truncate max-w-[150px]">
                        {data.youtubeReviews[activeReviewer].videoTitle}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.05em] text-[#C4933F] bg-[#C4933F]/[0.10] px-2 py-0.5 rounded flex-shrink-0">
                      Verdict: {data.youtubeReviews[activeReviewer].rating}
                    </span>
                  </div>

                  <div className="relative pl-4 border-l-2 border-white/[0.12] italic text-[13px] text-[#9A97A8] leading-relaxed">
                    <span className="absolute -left-1 text-[28px] font-serif text-white/[0.06] pointer-events-none select-none top-[-12px]">&ldquo;</span>
                    &ldquo;{data.youtubeReviews[activeReviewer].quote}&rdquo;
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <ProvenanceStamp label="Sources: Team-BHP · CarWale Owners Composite · YouTube Automotive Reviews" live={!isLoading}/>
        </div>
      )}
    </motion.section>
  )
}
