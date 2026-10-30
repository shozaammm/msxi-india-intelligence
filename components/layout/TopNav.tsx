'use client'
import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlass, Bell, CaretDown, UserCircle, X } from '@phosphor-icons/react'
import { NAVIGATION } from '@/config/navigation.config'
import { useAppStore } from '@/lib/store'
import { useNewsData } from '@/hooks/useNewsData'
import { useDismiss } from '@/hooks/useDismiss'
import { cn, relativeTime } from '@/lib/utils'

/* The bar is black on every surface, like mercedes-benz.co.in; it does not follow the theme tokens. */

function NavEntry({ entry, pathname }: { entry: (typeof NAVIGATION)[number]; pathname: string }) {
  const [open, setOpen] = React.useState(false)
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false))
  const active = entry.href
    ? entry.href === '/' ? pathname === '/' : pathname.startsWith(entry.href)
    : entry.items!.some((i) => pathname.startsWith(i.href))
  const cls = cn('relative px-3 py-2 text-[15px] font-medium text-white/85 transition-colors hover:text-white', active && 'text-white')

  if (entry.href) {
    return (
      <Link href={entry.href} aria-current={active ? 'page' : undefined} className={cls}>
        {entry.name}
        {active && <span className="absolute inset-x-3 -bottom-[14px] h-[2px] bg-white" />}
      </Link>
    )
  }
  return (
    <div ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)} aria-expanded={open} className={cn(cls, 'inline-flex items-center gap-1')}>
        {entry.name}
        <CaretDown className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')} weight="bold" />
        {active && <span className="absolute inset-x-3 -bottom-[14px] h-[2px] bg-white" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-full z-pop w-[320px] rounded-b-[18px] bg-black p-2 pt-3 shadow-[0_24px_48px_-12px_rgb(0_0_0/0.6)] ring-1 ring-white/10"
          >
            {entry.items!.map((i) => (
              <li key={i.href}>
                <Link href={i.href} onClick={() => setOpen(false)} className="block rounded-[12px] px-3 py-2.5 transition-colors hover:bg-white/10">
                  <span className="block text-[15px] font-semibold text-white">{i.name}</span>
                  <span className="block text-[13px] text-white/60">{i.blurb}</span>
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

function Search() {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [q, setQ] = React.useState('')

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(t.tagName)) { e.preventDefault(); setOpen(true) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  React.useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Search headlines" className="grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10">
        <MagnifyingGlass className="h-[22px] w-[22px]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-0 z-pop flex h-16 items-center gap-4 bg-black px-6 lg:px-12"
          >
            <form
              role="search"
              className="mx-auto flex w-full max-w-3xl items-center gap-3 border-b border-white/40 pb-1.5"
              onSubmit={(e) => {
                e.preventDefault()
                router.push(q.trim() ? `/news?q=${encodeURIComponent(q.trim())}` : '/news')
                setOpen(false)
              }}
            >
              <MagnifyingGlass className="h-5 w-5 text-white/70" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search headlines"
                aria-label="Search headlines"
                className="w-full bg-transparent text-[17px] text-white placeholder:text-white/50 focus:outline-none"
              />
            </form>
            <button onClick={() => setOpen(false)} aria-label="Close search" className="grid h-10 w-10 place-items-center rounded-full text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Alerts() {
  const brand = useAppStore((s) => s.activeBrand)
  const { lastSeenNewsAt, markNewsSeen } = useAppStore()
  const { data } = useNewsData(brand)
  const [open, setOpen] = React.useState(false)
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false))

  const fresh = React.useMemo(() => {
    const items = data?.data ?? []
    if (!lastSeenNewsAt) return items.slice(0, 6)
    return items.filter((i) => !i.dateEstimated && i.isoTimestamp > lastSeenNewsAt)
  }, [data, lastSeenNewsAt])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`${fresh.length} new headlines`}
        aria-expanded={open}
        className="relative grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10"
      >
        <Bell className="h-[22px] w-[22px]" weight={fresh.length ? 'fill' : 'regular'} />
        {fresh.length > 0 && (
          <span className="num absolute right-0 top-0 min-w-[18px] rounded-full bg-white px-1 text-center text-[11px] font-bold leading-[18px] text-black">
            {fresh.length > 9 ? '9+' : fresh.length}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full z-pop mt-2 w-[380px] max-w-[92vw] rounded-[18px] bg-black p-2 text-white shadow-[0_24px_48px_-12px_rgb(0_0_0/0.6)] ring-1 ring-white/10"
          >
            <div className="flex items-baseline justify-between px-3 pb-2 pt-2">
              <p className="display text-[24px]">Since you last looked.</p>
              {fresh.length > 0 && (
                <button onClick={() => { markNewsSeen(); setOpen(false) }} className="text-[13px] font-semibold underline underline-offset-4 hover:text-white/70">
                  Mark read
                </button>
              )}
            </div>
            {fresh.length === 0 ? (
              <p className="px-3 pb-3 text-[14px] text-white/60">Nothing new for this brand yet.</p>
            ) : (
              <ul className="max-h-[360px] overflow-y-auto">
                {fresh.slice(0, 8).map((i) => (
                  <li key={i.id}>
                    <a href={i.url} target="_blank" rel="noopener noreferrer" className="block rounded-[12px] px-3 py-2.5 transition-colors hover:bg-white/10">
                      <p className="text-[12.5px] text-white/55">{i.source} · {relativeTime(i.isoTimestamp)}</p>
                      <p className="mt-0.5 line-clamp-2 text-[14.5px] leading-snug">{i.headline}</p>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FeedStatus() {
  const brand = useAppStore((s) => s.activeBrand)
  const { data, isError } = useNewsData(brand)
  const meta = data?.meta
  const warn = isError || meta?.stale || (meta && meta.feedsOk / meta.feedsTotal < 0.7)
  return (
    <span className="hidden items-center gap-2 text-[14px] text-white/75 xl:flex" title="Feeds that returned stories on the last refresh">
      <span className={cn('h-2 w-2 rounded-full', warn ? 'bg-amber-400' : 'bg-emerald-400')} />
      {meta ? <span className="num">{meta.feedsOk}/{meta.feedsTotal} feeds</span> : 'Connecting'}
    </span>
  )
}

export function TopNav() {
  const pathname = usePathname()
  return (
    <header className="relative z-nav h-16 bg-black text-white">
      <div className="mx-auto grid h-full max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center px-4 lg:px-12">
        <nav aria-label="Primary" className="flex items-center gap-1 lg:gap-3">
          {NAVIGATION.map((e) => <NavEntry key={e.name} entry={e} pathname={pathname} />)}
        </nav>

        <Link href="/" aria-label="MSXI India Intelligence home" className="justify-self-center rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/msx_international_reversed.png" alt="MSX International" className="h-9 w-auto" />
        </Link>

        <div className="flex items-center justify-end gap-1 lg:gap-2">
          <FeedStatus />
          <Search />
          <Alerts />
          <Link href="/settings" className="ml-2 hidden items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-white/10 md:flex" aria-label="Settings">
            <UserCircle className="h-9 w-9 text-white/80" weight="fill" />
            <span className="flex flex-col leading-tight">
              <span className="text-[12px] text-white/70">MSX International</span>
              <span className="text-[15px] font-medium">Soham Mondal</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
