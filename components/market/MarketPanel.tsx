'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMarketData } from '@/hooks/useMarketData'
import { BRAND_CONFIGS } from '@/lib/brandConfig'
import { MercedesStar } from '@/components/ui/MercedesStar'
import { BmwRoundel } from '@/components/ui/BmwRoundel'
import { ErrorCard } from '@/components/ui/ErrorCard'
import { ProvenanceStamp } from '@/components/ui/ProvenanceStamp'
import { formatEUR, mktCapINR } from '@/lib/utils'
import type { BrandId } from '@/types'

export function MarketPanel({ brand }: { brand: BrandId }) {
  const config = BRAND_CONFIGS[brand]
  const { data, isError, isLoading } = useMarketData(brand)
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)

  const isMB = brand === 'mercedes'
  const isBMW = brand === 'bmw'

  // Calculate max units for monthly chart scaling
  const maxUnits = data?.monthlySalesTrend
    ? Math.max(...data.monthlySalesTrend.map(t => t.units))
    : 2000

  return (
    <motion.section
      className="bg-[#13121E] border-r border-white/[0.07] px-7 py-6 flex flex-col relative overflow-hidden h-full"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      key={brand}
    >
      {/* Rotating watermark */}
      <motion.div
        className="absolute -right-24 -bottom-24 w-[400px] h-[400px] opacity-[0.025] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        {isMB && <MercedesStar size={400} variant="outline"/>}
        {isBMW && <img src="/logos/bmw.png" alt="BMW Watermark" className="w-[400px] h-[400px] object-contain" />}
      </motion.div>

      {/* Scan line on mount */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A880]/40 to-transparent pointer-events-none"
        initial={{ top: '-4px', opacity: 1 }}
        animate={{ top: '104%', opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.4, 0, 0.6, 1], delay: 0.4 }}
      />

      {/* Eyebrow */}
      <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#4A4860] mb-3">
        OFFICIAL OEM BRIEFING · LIVE INTEL · VAHAN & FADA VERIFIED
      </p>

      {/* Brand identity row */}
      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.07]">
        {isMB && <img src="/logos/mercedes_benz.png" alt="Mercedes-Benz" className="w-[52px] h-[52px] object-contain flex-shrink-0" />}
        {isBMW && <img src="/logos/bmw.png" alt="BMW" className="w-[52px] h-[52px] object-contain flex-shrink-0" />}
        <div>
          <div className="flex items-center gap-3">
            {isMB && (
              <>
                <span className="font-['Georgia',serif] text-[18px] text-[#BDBBB6]">Mercedes-Benz</span>
                <div className="w-px h-5 bg-white/10"/>
                <img src="/logos/amg.png" alt="AMG" className="h-[14px] w-auto opacity-70 object-contain" />
              </>
            )}
            {isBMW && (
              <span className="font-['Arial_Black',sans-serif] text-[20px] font-black tracking-[0.06em] text-[#1C69D4]">BMW</span>
            )}
          </div>
          <p className="text-[12px] text-[#5A5868] tracking-[0.03em] mt-1">
            {config.fullName} · India Operations
          </p>
        </div>
      </div>

      {isError && <ErrorCard source={`FADA / VAHAN Telemetry Composite`}/>}

      {!isError && (
        <div className="flex-1 flex flex-col overflow-y-auto pr-1 select-none no-scrollbar gap-5">

          {/* Market Cap KPI Block */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A7685] mb-2">Parent Group Valuation (Market Cap)</p>
            <div className="flex items-baseline gap-3">
              {isLoading ? (
                <span className="font-['Space_Grotesk',sans-serif] text-5xl font-extrabold text-[#EDE9DF] animate-pulse">Loading…</span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="font-['Space_Grotesk',sans-serif] text-[46px] font-extrabold text-[#EDE9DF] tracking-tight leading-none">
                    {formatEUR(data!.marketCap)}
                  </span>
                  <span className="text-[14px] text-[#7A7685] font-semibold">EUR</span>
                </div>
              )}
            </div>
            <p className="text-[13px] text-[#7A7685] mt-1.5 tabular-nums">
              {isLoading ? '≈ ₹-- Crore' : `≈ ${mktCapINR(data!.marketCap, data!.eurinr)} Crore (at ₹${data!.eurinr.toFixed(2)}/EUR)`}
            </p>
          </div>

          {/* India Subsidiary Sales KPIs Grid */}
          <div className="grid grid-cols-4 gap-px bg-white/[0.07] rounded-xl overflow-hidden border border-white/[0.07]">
            {[
              {
                label: 'Monthly Sales',
                value: isLoading ? '—' : `${data!.monthlySalesUnits.toLocaleString('en-IN')}`,
                sub: 'Units · May 2026',
                color: 'text-[#EDE9DF]'
              },
              {
                label: 'YoY Growth',
                value: isLoading ? '—' : `+${data!.yoyGrowthPct}%`,
                sub: 'vs May 2025',
                color: 'text-[#3DB87A]'
              },
              {
                label: 'Luxury Share',
                value: isLoading ? '—' : `${data!.luxurySegmentShare}%`,
                sub: 'Segment Share',
                color: 'text-[#C4933F]'
              },
              {
                label: 'Annual Run',
                value: isLoading ? '—' : `${(data!.annualSalesVolume / 1000).toFixed(1)}k`,
                sub: 'Units Run-Rate',
                color: 'text-[#7AA0E8]'
              },
            ].map(({ label, value, sub, color }, i) => (
              <motion.div
                key={label}
                className="bg-[#191828] px-4 py-4 flex flex-col justify-between min-h-[90px]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
              >
                <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#5A5868]">{label}</span>
                <span className={`font-['Space_Grotesk',sans-serif] text-[24px] font-bold tabular-nums leading-tight mt-1 ${color}`}>{value}</span>
                <span className="text-[11px] text-[#5A5868] mt-1">{sub}</span>
              </motion.div>
            ))}
          </div>

          {/* Monthly Sales Trend Chart (FADA / VAHAN) */}
          {!isLoading && data && (
            <div className="bg-[#161524] border border-white/[0.06] px-5 pt-4 pb-4 rounded-xl flex flex-col relative">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#7A7685] mb-4">
                Monthly Car Sales Trend · India (Last 6 Months)
              </span>

              {/* Bars Row */}
              <div className="h-32 flex items-end gap-3 relative">
                {data.monthlySalesTrend.map((t, idx) => {
                  const pctHeight = Math.max(4, (t.units / maxUnits) * 100)
                  const isHovered = hoveredBarIndex === idx
                  return (
                    <div
                      key={t.month}
                      className="flex-1 flex flex-col items-center group relative cursor-pointer h-full justify-end"
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      {/* Track */}
                      <div className="absolute inset-0 bg-white/[0.03] rounded-t-md" />
                      {/* Animated fill */}
                      <motion.div
                        className="w-full rounded-t-md relative z-10"
                        style={{
                          backgroundColor: isHovered ? '#EDE9DF' : config.accentColor,
                          originY: 1,
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${pctHeight}%` }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 + idx * 0.06 }}
                      >
                        {/* Top highlight line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40 rounded-full" />
                      </motion.div>
                    </div>
                  )
                })}
              </div>

              {/* Labels Row */}
              <div className="flex gap-3 mt-2 text-center">
                {data.monthlySalesTrend.map((t) => (
                  <span key={t.month} className="flex-1 text-[10px] text-[#5A5868] tracking-[0.02em] leading-tight">
                    {t.month.split(' ')[0].slice(0, 3)} &apos;{t.month.split(' ')[1].slice(2)}
                  </span>
                ))}
              </div>

              {/* Tooltip */}
              <div className="h-7 mt-3 relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {hoveredBarIndex !== null ? (
                    <motion.div
                      key={hoveredBarIndex}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] font-bold text-[#EDE9DF] tracking-[0.02em] flex items-center gap-3 bg-white/[0.06] px-4 py-1.5 rounded border border-white/[0.08]"
                    >
                      <span>{data.monthlySalesTrend[hoveredBarIndex].month}:</span>
                      <span className="font-['Space_Grotesk',sans-serif] text-white">
                        {data.monthlySalesTrend[hoveredBarIndex].units.toLocaleString('en-IN')} units
                      </span>
                      <span className="text-[#3DB87A]">
                        ↑ +{data.monthlySalesTrend[hoveredBarIndex].yoyGrowth}% YoY
                      </span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      className="text-[10px] text-[#4A4860] tracking-[0.06em] uppercase"
                    >
                      Hover bars to view monthly growth intelligence
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* VAHAN Best Performing States Leaderboard */}
          {!isLoading && data && (
            <div>
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#7A7685] mb-3 block">
                Top Performing States · VAHAN Registration Leaderboard
              </span>
              <div className="flex flex-col gap-3 bg-[#161524] border border-white/[0.06] p-4 rounded-xl">
                {data.topStates.map((state, i) => (
                  <div key={state.stateName} className="flex items-center gap-3">
                    <span className="text-[12px] font-bold text-[#5A5868] w-5 text-right flex-shrink-0">{i + 1}</span>
                    <span className="text-[13px] font-medium text-[#9A97A8] w-28 flex-shrink-0">{state.stateName}</span>
                    <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${config.accentColor}, #EDE9DF)`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, state.marketSharePct * 2.5)}%` }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <div className="flex items-center gap-2 w-28 justify-end flex-shrink-0">
                      <span className="text-[13px] font-bold font-['Space_Grotesk',sans-serif] text-[#EDE9DF] tabular-nums">
                        {state.registrationCount}
                      </span>
                      <span className="text-[11px] font-bold text-[#3DB87A] tabular-nums bg-[#3DB87A]/[0.10] px-2 py-0.5 rounded">
                        ↑ {state.yoyGrowthPct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ProvenanceStamp label="Sources: Yahoo Finance (Parent Cap) · FADA India · VAHAN Dashboard (Sales & States)" live={!isLoading}/>
        </div>
      )}
    </motion.section>
  )
}
