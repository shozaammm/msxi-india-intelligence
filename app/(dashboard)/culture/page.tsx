'use client'
import { useAppStore } from '@/lib/store'
import { useMarketData } from '@/hooks/useMarketData'
import { motion } from 'framer-motion'
import { Award, Compass, Heart } from 'lucide-react'

export default function CulturePage() {
  const activeBrand = useAppStore(state => state.activeBrand)
  const { data, isLoading } = useMarketData(activeBrand)

  const isMB = activeBrand === 'mercedes'

  return (
    <div className="flex-grow p-6 flex flex-col gap-6 bg-[#0D0C14] min-h-[800px] overflow-y-auto no-scrollbar select-none">
      {/* Title Header */}
      <div className="border-b border-white/[0.07] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C5A880]">BRAND HERITAGE</span>
          <h1 className="text-2xl font-bold text-[#EDE9DF] mt-1">Car Culture & Enthusiast Networks</h1>
        </div>
        <div className="flex items-center gap-2 rounded bg-white/[0.03] border border-white/[0.08] px-3 py-1 text-xs font-bold text-[#C5A880]">
          <Heart className="h-4 w-4 fill-current animate-pulse text-[#C5A880]" />
          Enthusiast Premium Index
        </div>
      </div>

      {!isLoading && data && (
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Main Hero Culture Index Card */}
          <div className="col-span-8 bg-white/[0.02] border border-white/[0.08] p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C5A880]/[0.02] blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-6">
              {isMB ? (
                <img
                  src="/logos/affalterbach_amg.png"
                  alt="Affalterbach Crest"
                  className="w-[84px] h-[84px] object-contain flex-shrink-0 opacity-90 shadow-2xl"
                />
              ) : (
                <img
                  src="/logos/bmw.png"
                  alt="BMW Logo"
                  className="w-[84px] h-[84px] object-contain flex-shrink-0 opacity-90 shadow-2xl"
                />
              )}
              <div className="flex-grow flex flex-col gap-2">
                <span className="text-xs text-[#EDE9DF]/50 uppercase tracking-widest font-bold">Consensus Index Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-['Space_Grotesk',sans-serif] text-5xl font-extrabold text-[#EDE9DF] tracking-tight">
                    {data.carCulture.enthusiastIndex.toFixed(1)}
                  </span>
                  <span className="text-lg text-[#C5A880] font-bold">/ 10.0 (Elite Rank)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/[0.06] pt-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-[#EDE9DF] uppercase tracking-wider flex items-center gap-2">
                <Compass className="h-4.5 w-4.5 text-[#C5A880]" />
                Enthusiast & Heritage Background
              </span>
              <p className="text-sm text-[#EDE9DF]/75 leading-relaxed font-normal">
                {data.carCulture.cultureHighlight}
              </p>
            </div>
          </div>

          {/* Official Clubs Card */}
          <div className="col-span-4 bg-white/[0.02] border border-white/[0.08] p-6 rounded-xl flex flex-col gap-4">
            <span className="text-xs font-bold text-[#EDE9DF] uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-[#C5A880]" />
              Official Owner Networks
            </span>
            <div className="flex flex-col gap-3">
              {data.carCulture.officialClubs.map((club) => (
                <div key={club} className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-xl hover:bg-white/[0.05] transition-colors">
                  <span className="text-xs font-bold text-[#EDE9DF] block">{club.split(' (')[0]}</span>
                  <span className="text-[10px] text-[#C5A880] block mt-1">Official verified network</span>
                </div>
              ))}
            </div>
          </div>

          {/* Festivals & Events Section */}
          <div className="col-span-12 flex flex-col gap-4">
            <span className="text-xs font-bold text-[#EDE9DF] uppercase tracking-wider block">Notable Brand Festivals & Events</span>
            <div className="grid grid-cols-2 gap-6">
              {data.carCulture.majorEvents.map((evt) => (
                <div key={evt.name} className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-xl flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#EDE9DF]">{evt.name}</h3>
                      <span className="text-[10px] text-[#EDE9DF]/40 uppercase mt-0.5 block">{evt.location}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#C5A880] bg-[#C5A880]/[0.08] px-2.5 py-0.5 rounded-full border border-[#C5A880]/20 flex-shrink-0">
                      Active Event
                    </span>
                  </div>
                  <p className="text-xs text-[#EDE9DF]/70 leading-relaxed">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
