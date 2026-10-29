'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MercedesStar } from './MercedesStar'
import { BmwRoundel } from './BmwRoundel'

export function ConnectingOverlay({ brandId = 'mercedes' }: { brandId?: string }) {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => { 
    const t = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(t) 
  }, [])
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 bg-[#0D0C14] flex flex-col items-center justify-center gap-5"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
            {brandId === 'mercedes' ? (
              <img src="/logos/mercedes_benz.png" alt="Mercedes-Benz" className="w-[72px] h-[72px] object-contain" />
            ) : (
              <img src="/logos/bmw.png" alt="BMW" className="w-[72px] h-[72px] object-contain" />
            )}
          </motion.div>
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#EDE9DF]/65">Connecting to live feeds</p>
          <div className="w-48 h-px bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#C5A880] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
