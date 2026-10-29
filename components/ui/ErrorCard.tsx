'use client'
export function ErrorCard({ source, message }: { source: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
      <div className="w-8 h-8 rounded-full border border-[#D95454]/40 flex items-center justify-center">
        <span className="text-[#D95454] text-sm font-bold">!</span>
      </div>
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#D95454]">External Connection Interrupted</p>
      <p className="text-[10px] text-[#3F3D4E] tracking-wider uppercase">{source}</p>
      {message && <p className="text-[10px] text-[#3F3D4E] max-w-xs text-center">{message}</p>}
    </div>
  )
}
