'use client'
export function ProvenanceStamp({ label, live = true, demo = false }: { label: string; live?: boolean; demo?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 pt-3 mt-auto border-t border-white/[0.07]">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${live && !demo ? 'bg-[#3DB87A] animate-pulse' : 'bg-[#C4933F]'}`}/>
      <span className="text-[11px] tracking-[0.08em] uppercase text-[#4A4860]">{label}</span>
      {demo && (
        <span className="ml-auto text-[10px] font-bold tracking-[0.08em] uppercase text-[#C4933F] border border-[#C4933F]/25 bg-[#C4933F]/[0.08] px-2 py-0.5 rounded">
          Demo
        </span>
      )}
    </div>
  )
}
