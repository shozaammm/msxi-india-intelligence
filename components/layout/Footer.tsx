import Link from 'next/link'

export function Footer() {
  return (
    <footer className="flex h-10 shrink-0 items-center justify-between gap-6 border-t border-line/[0.06] bg-ink px-6 text-[11.5px] text-fg-3">
      <p className="truncate">
        Figures come from public sources and carry their date. Registrations differ from wholesale. Not investment advice; check the original source before acting.
      </p>
      <nav className="flex shrink-0 items-center gap-4" aria-label="Footer">
        <Link href="/methodology" className="hover:text-fg">Methodology</Link>
        <Link href="/methodology#corrections" className="hover:text-fg">Report an error</Link>
        <span>© {new Date().getFullYear()} MSX International</span>
      </nav>
    </footer>
  )
}
