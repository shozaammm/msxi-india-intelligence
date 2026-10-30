'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MsxiLogo } from './MsxiLogo'

/** Brief branded splash on first load in a session only. */
export function ConnectingOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem('msxi-splash')) return
      sessionStorage.setItem('msxi-splash', '1')
    } catch { /* storage blocked: still show once */ }
    const show = setTimeout(() => setVisible(true), 0)
    const hide = setTimeout(() => setVisible(false), 1300)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-overlay flex flex-col items-center justify-center gap-6 bg-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
            <MsxiLogo className="h-12" />
          </motion.div>
          <div className="h-px w-40 overflow-hidden rounded-full bg-fg/10">
            <motion.div className="h-full origin-left bg-msxi" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }} />
          </div>
          <p className="text-[15px] text-fg-2">India intelligence</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
