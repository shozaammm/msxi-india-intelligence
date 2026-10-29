'use client'
import { BRAND_TELEMETRY } from '@/config/telemetry.config'
import { motion } from 'framer-motion'
import { GitCompare, Sparkles } from 'lucide-react'

export default function ComparePage() {
  const mb = BRAND_TELEMETRY.mercedes
  const bmw = BRAND_TELEMETRY.bmw

  const comparisonRows = [
    {
      metric: 'Outstanding Parent Cap (Shares)',
      mbVal: '1.07 Billion shares',
      bmwVal: '601.9 Million shares',
    },
    {
      metric: 'Monthly India Sales Volume',
      mbVal: `${mb.monthlySalesUnits.toLocaleString('en-IN')} units`,
      bmwVal: `${bmw.monthlySalesUnits.toLocaleString('en-IN')} units`,
    },
    {
      metric: 'YoY Growth Rate (May 2026)',
      mbVal: `+${mb.yoyGrowthPct}%`,
      bmwVal: `+${bmw.yoyGrowthPct}%`,
    },
    {
      metric: 'Luxury Segment Share %',
      mbVal: `${mb.luxurySegmentShare}%`,
      bmwVal: `${bmw.luxurySegmentShare}%`,
    },
    {
      metric: 'Consensus Owner Rating (Team-BHP)',
      mbVal: `${mb.userRating} / 5.0`,
      bmwVal: `${bmw.userRating} / 5.0`,
    },
    {
      metric: 'Enthusiast index ranking',
      mbVal: `${mb.carCulture.enthusiastIndex} / 10`,
      bmwVal: `${bmw.carCulture.enthusiastIndex} / 10`,
    },
  ]

  return (
    <div className="flex-grow p-6 flex flex-col gap-6 bg-[#0D0C14] min-h-[800px] overflow-y-auto no-scrollbar select-none">
      {/* Header */}
      <div className="border-b border-white/[0.07] pb-4">
        <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C5A880]">PORTFOLIO ANALYSIS</span>
        <h1 className="text-2xl font-bold text-[#EDE9DF] mt-1 flex items-center gap-2">
          <GitCompare className="h-6 w-6 text-[#C5A880]" />
          Head-to-Head Brand Comparison
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-2">
        {/* Mercedes Overview */}
        <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-xl flex items-center gap-4 relative overflow-hidden">
          <img src="/logos/mercedes_benz.png" alt="Mercedes-Benz" className="w-12 h-12 object-contain" />
          <div>
            <h2 className="text-base font-bold text-[#EDE9DF]">Mercedes-Benz India</h2>
            <p className="text-xs text-[#EDE9DF]/50 mt-0.5">Mercedes-Benz Group AG · India Operations</p>
          </div>
        </div>

        {/* BMW Overview */}
        <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-xl flex items-center gap-4 relative overflow-hidden">
          <img src="/logos/bmw.png" alt="BMW" className="w-12 h-12 object-contain" />
          <div>
            <h2 className="text-base font-bold text-[#EDE9DF]">BMW India</h2>
            <p className="text-xs text-[#EDE9DF]/50 mt-0.5">Bayerische Motoren Werke AG · India Operations</p>
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden mt-4">
        <div className="grid grid-cols-12 bg-white/[0.04] p-4 text-xs font-bold text-[#EDE9DF] border-b border-white/[0.08] uppercase tracking-wider">
          <div className="col-span-4">Metric / Parameter</div>
          <div className="col-span-4 text-left text-[#C5A880]">Mercedes-Benz India</div>
          <div className="col-span-4 text-left text-[#1C69D4]">BMW India</div>
        </div>
        <div className="flex flex-col">
          {comparisonRows.map((row) => (
            <div key={row.metric} className="grid grid-cols-12 p-4 text-xs border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-colors leading-relaxed">
              <div className="col-span-4 font-semibold text-[#EDE9DF]/50">{row.metric}</div>
              <div className="col-span-4 text-[#EDE9DF] font-medium">{row.mbVal}</div>
              <div className="col-span-4 text-[#EDE9DF] font-medium">{row.bmwVal}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Consensus Insight block */}
      <div className="bg-white/[0.01] border border-white/[0.06] p-5 rounded-xl flex items-start gap-4 mt-4">
        <Sparkles className="h-6 w-6 text-[#C5A880] flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-[#EDE9DF] uppercase tracking-wider">MSXI Consultant Consensus Verdict</h3>
          <p className="text-xs text-[#EDE9DF]/65 leading-relaxed mt-1.5">
            Mercedes-Benz India holds an advantage in rear-seat chauffeur comfort and volumetric luxury segment market share dominance (48.5%). BMW India maintains a clear lead in enthusiast driving dynamics, sport engine mapping (M Division cult), and high-performance user satisfaction ratings (4.8/5.0).
          </p>
        </div>
      </div>
    </div>
  )
}
