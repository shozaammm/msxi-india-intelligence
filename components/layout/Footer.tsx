'use client'
import Link from 'next/link'
import { CaretUp } from '@phosphor-icons/react'
import { NAVIGATION } from '@/config/navigation.config'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'

const nav = (name: string) => NAVIGATION.find((e) => e.name === name)?.items ?? []
const COLUMNS = [
  { title: 'Brands', links: [{ label: 'Overview', href: '/' }, ...nav('Brands').map((i) => ({ label: i.name, href: i.href })), { label: 'News', href: '/news' }] },
  { title: 'Figures', links: nav('Figures').map((i) => ({ label: i.name, href: i.href })) },
  { title: 'About', links: nav('About').map((i) => ({ label: i.name, href: i.href })) },
  { title: 'Brand sites', links: BRAND_IDS.map((id) => ({ label: BRAND_CONFIGS[id].switchLabel, href: BRAND_CONFIGS[id].officialLinks[0].url })) },
  {
    title: 'Investors',
    links: BRAND_IDS.flatMap((id) => BRAND_CONFIGS[id].officialLinks.filter((l) => /investor/i.test(l.label)).slice(0, 1).map((l) => ({ label: BRAND_CONFIGS[id].switchLabel, href: l.url }))),
  },
]

/** Black multi-column footer, as on mercedes-benz.co.in. */
export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1800px] px-4 pb-10 pt-8 lg:px-12">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="mx-auto flex flex-col items-center gap-1 text-[13px] text-white/80 transition-colors hover:text-white"
        >
          <CaretUp className="h-5 w-5" weight="bold" />
          Up
        </button>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h2 className="text-[17px] font-bold">{c.title}</h2>
              <ul className="mt-4 flex flex-col gap-3 text-[15px] text-white/80">
                {c.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith('http')
                      ? <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline underline-offset-4">{l.label}</a>
                      : <Link href={l.href} className="hover:text-white hover:underline underline-offset-4">{l.label}</Link>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-white/15 pt-6 text-[13px] leading-relaxed text-white/60">
          <p className="max-w-4xl">
            Figures come from public sources and carry their date. Registrations differ from wholesale. Not investment advice; check the original source before acting.
            Brand names and logos belong to their owners and are shown only to identify the brands covered.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/methodology" className="hover:text-white">Methodology</Link>
            <Link href="/methodology#corrections" className="hover:text-white">Report an error</Link>
            <span>© {new Date().getFullYear()} MSX International</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
