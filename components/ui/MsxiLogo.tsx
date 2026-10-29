/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils'

/**
 * Reversed MSXI lockup (cream wordmark) for dark surfaces; the original
 * black wordmark was invisible on the dark sidebar. `compact` shows the mark only.
 */
export function MsxiLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return compact ? (
    <img src="/logos/msxi_mark.png" alt="MSX International" className={cn('h-8 w-8', className)} />
  ) : (
    <img src="/logos/msx_international_reversed.png" alt="MSX International" className={cn('h-8 w-auto', className)} />
  )
}
