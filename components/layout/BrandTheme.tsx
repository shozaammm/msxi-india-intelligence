'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { hexToRgbTriplet } from '@/lib/utils'

/**
 * Applies the surface (white / black / stone) and, on the stone surface,
 * keeps the CTA colour dark like Maybach; otherwise the accent is the brand's.
 * Mirrors the boot script in app/layout.tsx.
 */
export function BrandTheme() {
  const brand = useAppStore((s) => s.activeBrand)
  const pref = useAppStore((s) => s.theme)
  useEffect(() => {
    const cfg = BRAND_CONFIGS[brand] ?? BRAND_CONFIGS.mercedes
    const root = document.documentElement
    root.dataset.theme = pref === 'auto' ? cfg.theme : pref
    if (root.dataset.theme === 'stone') root.style.removeProperty('--accent')
    else root.style.setProperty('--accent', hexToRgbTriplet(cfg.accentColor))
  }, [brand, pref])
  return null
}
