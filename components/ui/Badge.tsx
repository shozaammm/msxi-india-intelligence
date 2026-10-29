import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'amber' | 'green' | 'blue' | 'gold' | 'red'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2',
        {
          'border-transparent bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/80': variant === 'default',
          'border-transparent bg-black/[0.05] text-[#1A1A1A] hover:bg-black/[0.1]': variant === 'secondary',
          'text-[#1A1A1A]': variant === 'outline',
          'border-transparent bg-red-500 text-white hover:bg-red-600': variant === 'destructive',
          'border-transparent bg-[#F59038]/15 text-[#C96A12]': variant === 'amber',
          'border-transparent bg-[#2D9E6B]/12 text-[#1E7A50]': variant === 'green',
          'border-transparent bg-[#2563EB]/10 text-[#1E50C0]': variant === 'blue',
          'border-transparent bg-[#B47B20]/12 text-[#8A5D14]': variant === 'gold',
          'border-transparent bg-[#DC2626]/10 text-[#B91C1C]': variant === 'red',
        },
        className
      )}
      {...props}
    />
  )
}
