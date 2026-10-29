'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { hexToRgbTriplet } from '@/lib/utils'

/** The whole UI takes its single accent from the active brand. */
export function BrandTheme() {
  const brand = useAppStore((s) => s.activeBrand)
  useEffect(() => {
    const cfg = BRAND_CONFIGS[brand] ?? BRAND_CONFIGS.mercedes
    document.documentElement.style.setProperty('--accent', hexToRgbTriplet(cfg.accentColor))
  }, [brand])
  return null
}
