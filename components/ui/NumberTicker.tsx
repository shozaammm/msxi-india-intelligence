'use client'
import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, motion } from 'framer-motion'

export function NumberTicker({
  value, prefix = '', suffix = '', decimals = 0, className = '',
}: {
  value: number | null | undefined; prefix?: string; suffix?: string; decimals?: number; className?: string
}) {
  const mv = useMotionValue(0)
  const display = useTransform(mv, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`)
  const prevRef = useRef(0)

  useEffect(() => {
    if (value == null) return
    const ctrl = (animate as any)(mv, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      from: prevRef.current,
    })
    prevRef.current = value
    return ctrl.stop
  }, [value])

  if (value == null) return <span className={className}>--</span>
  return <motion.span className={className}>{display}</motion.span>
}
