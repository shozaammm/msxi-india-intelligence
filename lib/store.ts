import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BrandId } from '@/types'
import type { RegionFilter } from '@/config/feeds.config'

export const REFRESH_OPTIONS = [
  { ms: 60_000, label: '1 min' },
  { ms: 120_000, label: '2 min' },
  { ms: 300_000, label: '5 min' },
] as const

export type ThemePref = 'auto' | 'light' | 'dark' | 'stone'

interface AppState {
  activeBrand: BrandId
  setActiveBrand: (brand: BrandId) => void

  /** 'auto' follows the brand: Mercedes white, BMW black. */
  theme: ThemePref
  setTheme: (t: ThemePref) => void

  /** How often the news feed re-polls. */
  refreshMs: number
  setRefreshMs: (ms: number) => void

  defaultRegion: RegionFilter
  setDefaultRegion: (r: RegionFilter) => void

  /** Words highlighted in headlines and counted on the dashboard. */
  watchKeywords: string[]
  setWatchKeywords: (k: string[]) => void

  /** ISO time the user last opened the alerts tray. */
  lastSeenNewsAt: string | null
  markNewsSeen: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeBrand: 'mercedes',
      setActiveBrand: (brand) => set({ activeBrand: brand }),

      theme: 'auto',
      setTheme: (theme) => set({ theme }),

      refreshMs: 120_000,
      setRefreshMs: (refreshMs) => set({ refreshMs }),

      defaultRegion: 'all',
      setDefaultRegion: (defaultRegion) => set({ defaultRegion }),

      watchKeywords: ['launch', 'price', 'EV'],
      setWatchKeywords: (watchKeywords) => set({ watchKeywords }),

      lastSeenNewsAt: null,
      markNewsSeen: () => set({ lastSeenNewsAt: new Date().toISOString() }),
    }),
    {
      name: 'msxi-app-storage',
      version: 3,
      partialize: ({ activeBrand, theme, refreshMs, defaultRegion, watchKeywords, lastSeenNewsAt }) => ({
        activeBrand, theme, refreshMs, defaultRegion, watchKeywords, lastSeenNewsAt,
      }),
      // v1 stored isDarkTheme; anything else carries over.
      migrate: (persisted) => persisted as AppState,
    },
  ),
)
