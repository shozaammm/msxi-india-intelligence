import {
  SquaresFour, Newspaper, Waveform, ChartLineUp, MapTrifold, IdentificationCard, Scales, BookOpenText, SlidersHorizontal,
  type Icon,
} from '@phosphor-icons/react'

export interface NavItem {
  name: string
  href: string
  icon: Icon
}

export const NAVIGATION: { group: string; items: NavItem[] }[] = [
  {
    group: 'Brief',
    items: [
      { name: 'Today', href: '/', icon: SquaresFour },
      { name: 'News', href: '/news', icon: Newspaper },
      { name: 'Coverage', href: '/coverage', icon: Waveform },
    ],
  },
  {
    group: 'Figures',
    items: [
      { name: 'Market', href: '/market', icon: ChartLineUp },
      { name: 'States', href: '/states', icon: MapTrifold },
      { name: 'Compare', href: '/compare', icon: Scales },
      { name: 'Brand hub', href: '/brand', icon: IdentificationCard },
    ],
  },
  {
    group: 'About',
    items: [
      { name: 'Methodology', href: '/methodology', icon: BookOpenText },
      { name: 'Settings', href: '/settings', icon: SlidersHorizontal },
    ],
  },
]
