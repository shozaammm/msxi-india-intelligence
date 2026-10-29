'use client'

import { ProvenanceStamp } from '../ui/ProvenanceStamp'

export function Footer() {
  return (
    <footer className="flex h-12 shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#100F1B] px-6">
      <ProvenanceStamp label="Live Intelligence Feed · Yahoo Finance · FADA · VAHAN" live={true} />
      
      <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-widest text-[#EDE9DF]/40">
        <span>Strictly Confidential</span>
        <span className="h-3 w-px bg-white/[0.1]"></span>
        <span>MSX International Internal Use Only</span>
      </div>
    </footer>
  )
}
