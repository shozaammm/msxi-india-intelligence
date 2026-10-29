import { BRAND_CONFIGS } from '@/config/brands.config'
import type { BrandId } from '@/types'
import { cn } from '@/lib/utils'

const SIZES = { sm: 'h-8 w-8 p-1.5 rounded-[9px]', md: 'h-11 w-11 p-2 rounded-[12px]', lg: 'h-16 w-16 p-2.5 rounded-[16px]', xl: 'h-24 w-24 p-3.5 rounded-[22px]' }

/**
 * OEM logo on a lit tile: a soft light from the top-left plus a brand-coloured
 * rim, so chrome-finish logos read as metal rather than a flat sticker.
 */
export function BrandMark({ brand, size = 'md', className }: { brand: BrandId; size?: keyof typeof SIZES; className?: string }) {
  const b = BRAND_CONFIGS[brand]
  return (
    <span
      className={cn('relative grid shrink-0 place-items-center overflow-hidden', SIZES[size], className)}
      style={{
        background: `radial-gradient(120% 120% at 25% 15%, rgb(255 250 240 / 0.14), rgb(255 250 240 / 0.02) 55%), ${b.accentColor}14`,
        boxShadow: `inset 0 0 0 1px ${b.accentColor}40, inset 0 1px 0 rgb(255 255 255 / 0.08), 0 8px 20px -10px ${b.accentColor}66`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={b.logo} alt={`${b.name} logo`} className="h-full w-full object-contain drop-shadow-[0_2px_3px_rgb(0_0_0/0.45)]" />
    </span>
  )
}
