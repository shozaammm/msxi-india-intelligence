'use client'
export function LiveIndicator({ label = 'Live', size = 'sm' }: { label?: string; size?: 'sm' | 'xs' }) {
  const dot = size === 'xs' ? 'w-1.5 h-1.5' : 'w-2 h-2'
  const ring = size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'
  const txt = size === 'xs' ? 'text-[11px]' : 'text-[12px]'
  return (
    <div className="flex items-center gap-1.5">
      <div className={`relative flex items-center justify-center ${ring} flex-shrink-0`}>
        <div className="absolute inset-0 rounded-full border border-[#3DB87A] animate-[ripple_2s_ease-out_infinite]"/>
        <div className="absolute inset-0 rounded-full border border-[#3DB87A] animate-[ripple_2s_ease-out_0.7s_infinite]"/>
        <div className={`${dot} rounded-full bg-[#3DB87A] relative z-10`}/>
      </div>
      <span className={`${txt} font-bold tracking-[0.14em] uppercase text-[#3DB87A]`}>{label}</span>
    </div>
  )
}
