export interface NavItem {
  name: string
  href: string
  icon: string
}

export const NAVIGATION: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { name: 'Market', href: '/market', icon: 'LineChart' },
  { name: 'News', href: '/news', icon: 'Newspaper' },
  { name: 'Sentiment', href: '/sentiment', icon: 'MessageSquareHeart' },
  { name: 'State Analytics', href: '/states', icon: 'Map' },
  { name: 'Car Culture', href: '/culture', icon: 'Flag' },
  { name: 'Compare', href: '/compare', icon: 'ArrowLeftRight' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
]
