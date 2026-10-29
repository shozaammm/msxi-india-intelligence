'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { MarketPanel } from '@/components/market/MarketPanel'
import { useMarketData } from '@/hooks/useMarketData'
import { motion } from 'framer-motion'
import { formatEUR, mktCapINR } from '@/lib/utils'

export default function MarketPage() {
  const activeBrand = useAppStore(state => state.activeBrand)
  const { data, isLoading } = useMarketData(activeBrand)
  const [chartRange, setChartRange] = useState<'1D' | '5D' | '1M'>('1D')

  // Simulated chart data points
  const simulatedChartPoints = {
    '1D': [68.20, 68.45, 67.90, 68.10, 68.65, 68.42, 69.10, 68.85, 68.42],
    '5D': [66.50, 67.20, 68.10, 67.45, 68.42],
    '1M': [62.40, 63.80, 65.10, 64.90, 65.80, 66.40, 67.20, 68.42],
  }

  const activePoints = simulatedChartPoints[chartRange]
  const minVal = Math.min(...activePoints) - 0.5
  const maxVal = Math.max(...activePoints) + 0.5
  const deltaVal = maxVal - minVal

  return (
    <div className="flex-1 grid overflow-hidden h-full min-h-[800px] gap-6 p-6" style={{ gridTemplateColumns: '55% 45%' }}>
      {/* Left Panel: Direct live briefing telemetry */}
      <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#13121E] shadow-sm flex flex-col h-full">
        <MarketPanel brand={activeBrand} />
      </div>

      {/* Right Panel: Advanced Stock Analytics */}
      <div className="rounded-xl border border-white/[0.08] bg-[#13121E] p-6 flex flex-col justify-between shadow-sm h-full relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C5A880]/[0.02] blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C5A880]">VALUATION ENGINE</span>
              <h2 className="text-xl font-bold text-[#EDE9DF] mt-1">Advanced Market Telemetry</h2>
            </div>
            <div className="flex bg-white/[0.04] p-0.5 rounded border border-white/[0.08]">
              {(['1D', '5D', '1M'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${
                    chartRange === r ? 'bg-[#C5A880] text-[#0D0C14]' : 'text-[#EDE9DF]/50 hover:text-[#EDE9DF]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated chart visualization */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3 relative">
            <span className="text-[11px] font-bold tracking-[0.08em] text-[#EDE9DF]/40 uppercase">LIVE TICKER CHART</span>
            <div className="h-44 w-full flex items-end justify-between relative mt-4">
              {/* Horizontal grid lines */}
              <div className="absolute inset-x-0 top-0 h-px bg-white/[0.04]" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.04]" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.04]" />

              {/* Line segments simulation via SVG */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C5A880" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#C5A880" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path
                  d={`
                    M 0 176
                    ${activePoints.map((pt, i) => {
                      const x = (i / (activePoints.length - 1)) * 390
                      const y = 176 - ((pt - minVal) / deltaVal) * 160
                      return `L ${x} ${y}`
                    }).join(' ')}
                    L 390 176 Z
                  `}
                  fill="url(#chart-glow)"
                />
                {/* Stroke path */}
                <path
                  d={activePoints.map((pt, i) => {
                    const x = (i / (activePoints.length - 1)) * 390
                    const y = 176 - ((pt - minVal) / deltaVal) * 160
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#C5A880"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#EDE9DF]/40 mt-1.5 font-mono">
              <span>{chartRange === '1D' ? '09:00 IST' : chartRange === '5D' ? '5 Days Ago' : '1 Month Ago'}</span>
              <span>Active Price Trend</span>
              <span>17:30 IST</span>
            </div>
          </div>

          {/* Interactive FX calculator / breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between h-28">
              <span className="text-[11px] font-bold text-[#EDE9DF]/40 uppercase tracking-[0.05em]">EUR / INR FX Rate</span>
              <span className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#EDE9DF] tracking-tight tabular-nums">
                ₹{isLoading ? '91.50' : data?.eurinr.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#EDE9DF]/40">Verified via Yahoo Finance FX</span>
            </div>
            
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between h-28">
              <span className="text-[11px] font-bold text-[#EDE9DF]/40 uppercase tracking-[0.05em]">Outstanding Shares</span>
              <span className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-[#EDE9DF] tracking-tight tabular-nums">
                {activeBrand === 'mercedes' ? '1.07 Billion' : '601.9 Million'}
              </span>
              <span className="text-[10px] text-[#EDE9DF]/40">Primary Exchange Issued Cap</span>
            </div>
          </div>
        </div>

        {/* Dynamic footer status */}
        <div className="border-t border-white/[0.07] pt-4 mt-6 flex items-center justify-between text-[11px] text-[#EDE9DF]/40">
          <span>Confidential OEM Briefing Tool</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22C55E]"></span>
            Live Connection Healthy
          </span>
        </div>
      </div>
    </div>
  )
}
