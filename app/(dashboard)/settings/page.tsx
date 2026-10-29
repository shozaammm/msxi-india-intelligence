'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, ShieldCheck } from 'lucide-react'

export default function SettingsPage() {
  const [refreshInterval, setRefreshInterval] = useState('30s')
  const [cacheTTL, setCacheTTL] = useState('120s')
  const [customKeywords, setCustomKeywords] = useState('mercedes, bmw, amg, luxury')
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="flex-grow p-6 flex flex-col gap-6 bg-[#0D0C14] min-h-[800px] overflow-y-auto no-scrollbar select-none justify-between">
      {/* Title */}
      <div className="flex flex-col gap-6">
        <div className="border-b border-white/[0.07] pb-4">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C5A880]">PREFERENCE SHELL</span>
          <h1 className="text-2xl font-bold text-[#EDE9DF] mt-1 flex items-center gap-2">
            <Settings className="h-6 w-6 text-[#C5A880]" />
            Intelligence Hub Settings
          </h1>
        </div>

        {/* Input parameters card */}
        <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-xl flex flex-col gap-6 max-w-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C5A880]/[0.02] blur-3xl pointer-events-none" />

          {/* Refresh Intervals */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#EDE9DF]/65 uppercase tracking-[0.05em]">Telemetry Refresh Rate</label>
            <div className="flex bg-white/[0.04] p-0.5 rounded border border-white/[0.08] mt-1 max-w-md">
              {['30s', '60s', '120s'].map((t) => (
                <button
                  key={t}
                  onClick={() => setRefreshInterval(t)}
                  className={`flex-1 text-[11px] font-bold py-2 rounded transition-all capitalize ${
                    refreshInterval === t ? 'bg-[#C5A880] text-[#0D0C14]' : 'text-[#EDE9DF]/50 hover:text-[#EDE9DF]'
                  }`}
                >
                  {t} Polls
                </button>
              ))}
            </div>
            <span className="text-[10px] text-[#EDE9DF]/40 mt-1">Configures background API querying frequency for live market indices</span>
          </div>

          {/* Cache TTLs */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs font-bold text-[#EDE9DF]/65 uppercase tracking-[0.05em]">Aggregator Cache Lifetime</label>
            <div className="flex bg-white/[0.04] p-0.5 rounded border border-white/[0.08] mt-1 max-w-md">
              {['60s', '120s', '300s'].map((t) => (
                <button
                  key={t}
                  onClick={() => setCacheTTL(t)}
                  className={`flex-1 text-[11px] font-bold py-2 rounded transition-all capitalize ${
                    cacheTTL === t ? 'bg-[#C5A880] text-[#0D0C14]' : 'text-[#EDE9DF]/50 hover:text-[#EDE9DF]'
                  }`}
                >
                  {t} Cache
                </button>
              ))}
            </div>
            <span className="text-[10px] text-[#EDE9DF]/40 mt-1">Controls server-side RSS feeds payload persistence parameters</span>
          </div>

          {/* Keywords search */}
          <div className="flex flex-col gap-2.5 mt-2">
            <label className="text-xs font-bold text-[#EDE9DF]/65 uppercase tracking-[0.05em]">Custom Search Index Tags</label>
            <input
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#C5A880]/50 transition-colors mt-1"
            />
            <span className="text-[10px] text-[#EDE9DF]/40">Comma-separated tags for filtering live intelligence news stream</span>
          </div>

          {/* Action button */}
          <div className="mt-4 border-t border-white/[0.06] pt-5 flex items-center justify-between">
            <span className="text-[10px] text-[#EDE9DF]/45 uppercase flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#3DB87A]" />
              Secure Enterprise Mode Active
            </span>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 text-xs font-bold tracking-[0.05em] uppercase text-[#0D0C14] bg-[#C5A880] hover:bg-[#C5A880]/90 px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Save className="h-4 w-4" />
              {isSaved ? 'Preferences Saved!' : 'Save System Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.07] pt-4 mt-12 text-[11px] text-[#EDE9DF]/40 text-center">
        <span>Confidential Dashboard Settings Scoped to MSXI</span>
      </div>
    </div>
  )
}
