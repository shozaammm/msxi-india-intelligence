/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils'

/**
 * MSXI lockup that follows the surface: black wordmark on white and stone,
 * cream wordmark on black. `compact` shows the round mark only (no text to lose).
 */
export function MsxiLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) return <img src="/logos/msxi_mark.png" alt="MSX International" className={cn('h-8 w-8 object-contain', className)} />
  return (
    <>
      <img src="/logos/msx_international.png" alt="MSX International" className={cn('h-8 w-auto [[data-theme=dark]_&]:hidden', className)} />
      <img src="/logos/msx_international_reversed.png" alt="" aria-hidden className={cn('hidden h-8 w-auto [[data-theme=dark]_&]:block', className)} />
    </>
  )
}
