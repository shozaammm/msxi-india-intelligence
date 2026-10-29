'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number // 0 to 100
  className?: string
  color?: string
}

export function ProgressBar({ progress, className, color = 'bg-[#1A1A1A]' }: ProgressBarProps) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-black/[0.05]', className)}>
      <motion.div
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
