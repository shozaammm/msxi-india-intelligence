export interface NavLink {
  name: string
  href: string
  blurb: string
}

/** Four top-level entries, like the Mercedes-Benz bar: Models / Buy / Services / Brand. */
export const NAVIGATION: { name: string; href?: string; items?: NavLink[] }[] = [
  { name: 'Overview', href: '/' },
  {
    name: 'Brands',
    items: [
      { name: 'Brand brief', href: '/brief', blurb: 'Sales, trend and headlines for one brand.' },
      { name: 'Models', href: '/models', blurb: 'Every model in the lineup and what is being written about it.' },
      { name: 'Brand hub', href: '/brand', blurb: 'Launches, reviews and official links.' },
    ],
  },
  { name: 'News', href: '/news' },
  {
    name: 'Figures',
    items: [
      { name: 'Sales rankings', href: '/sales', blurb: 'Cars sold: brands and models by year, quarter or month.' },
      { name: 'Market', href: '/market', blurb: 'Share price, EUR/INR and market context.' },
      { name: 'States', href: '/states', blurb: 'Where the cars are registered.' },
      { name: 'Compare', href: '/compare', blurb: 'Mercedes-Benz and BMW side by side, sourced.' },
    ],
  },
  {
    name: 'About',
    items: [
      { name: 'Coverage', href: '/coverage', blurb: 'Which publishers we read and how they are doing.' },
      { name: 'Methodology', href: '/methodology', blurb: 'Where every number comes from.' },
      { name: 'Settings', href: '/settings', blurb: 'Surface, refresh rate and watch words.' },
    ],
  },
]
