import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BrandId } from '@/types'

interface AppState {
  activeBrand: BrandId
  setActiveBrand: (brand: BrandId) => void
  
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  
  isDarkTheme: boolean
  setDarkTheme: (isDark: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeBrand: 'mercedes',
      setActiveBrand: (brand) => set({ activeBrand: brand }),
      
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      isDarkTheme: false,
      setDarkTheme: (isDark) => set({ isDarkTheme: isDark }),
    }),
    {
      name: 'msxi-app-storage',
      partialize: (state) => ({ activeBrand: state.activeBrand, isDarkTheme: state.isDarkTheme }),
    }
  )
)
