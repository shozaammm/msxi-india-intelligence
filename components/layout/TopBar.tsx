'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlass, Bell } from '@phosphor-icons/react'
import { BrandSwitcher } from './BrandSwitcher'
import { useAppStore } from '@/lib/store'
import { useNewsData } from '@/hooks/useNewsData'
import { useDismiss } from '@/hooks/useDismiss'
import { cn, relativeTime } from '@/lib/utils'

function Clock() {
  const [time, setTime] = React.useState('')
  React.useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }))
    update()
    const id = setInterval(update, 15_000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="num text-[12.5px] text-fg-2" suppressHydrationWarning>
      {time} <span className="text-fg-3">IST</span>
    </span>
  )
}

function SearchBox() {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [q, setQ] = React.useState('')

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(t.tagName)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault()
        router.push(q.trim() ? `/news?q=${encodeURIComponent(q.trim())}` : '/news')
      }}
    >
      <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search headlines"
        aria-label="Search headlines"
        className="h-9 w-full rounded-[10px] bg-panel pl-9 pr-10 text-[13px] text-fg ring-1 ring-line/[0.08] transition-shadow placeholder:text-fg-3 focus:outline-none focus:ring-accent/50"
      />
      <kbd className="num pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[4px] px-1.5 text-[11px] text-fg-3 ring-1 ring-line/10">/</kbd>
    </form>
  )
}

function AlertsTray() {
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
        className="relative grid h-9 w-9 place-items-center rounded-[10px] text-fg-2 transition-colors hover:bg-panel hover:text-fg active:scale-95"
      >
        <Bell className="h-[18px] w-[18px]" weight={fresh.length ? 'fill' : 'regular'} />
        {fresh.length > 0 && (
          <span className="num absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-accent px-1 text-center text-[10px] font-semibold leading-[18px] text-ink">
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
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="absolute right-0 top-full z-pop mt-2 w-[360px] rounded-card bg-raised p-2 shadow-pop ring-1 ring-line/10"
          >
            <div className="flex items-baseline justify-between px-2.5 pb-2 pt-1.5">
              <p className="font-serif text-[16px] italic text-fg">Since you last looked</p>
              {fresh.length > 0 && (
                <button onClick={() => { markNewsSeen(); setOpen(false) }} className="text-[12px] text-fg-3 underline-offset-2 hover:text-fg hover:underline">
                  Mark read
                </button>
              )}
            </div>
            {fresh.length === 0 ? (
              <p className="px-2.5 pb-3 text-[12.5px] text-fg-3">Nothing new for this brand yet.</p>
            ) : (
              <ul className="max-h-[360px] overflow-y-auto">
                {fresh.slice(0, 8).map((i) => (
                  <li key={i.id}>
                    <a href={i.url} target="_blank" rel="noopener noreferrer" className="block rounded-[10px] px-2.5 py-2 transition-colors hover:bg-fg/[0.05]">
                      <p className="text-[11.5px] text-fg-3">{i.source} · {relativeTime(i.isoTimestamp)}</p>
                      <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-fg">{i.headline}</p>
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
  const tone = isError || meta?.stale ? 'warn' : meta && meta.feedsOk / meta.feedsTotal < 0.7 ? 'warn' : 'pos'
  return (
    <span className="hidden items-center gap-2 text-[12px] text-fg-3 lg:flex" title="Feeds that returned stories on the last refresh">
      <span className={cn('h-1.5 w-1.5 rounded-full', tone === 'pos' ? 'bg-pos' : 'bg-warn')} />
      {meta ? <span className="num">{meta.feedsOk}/{meta.feedsTotal} feeds</span> : 'Connecting'}
    </span>
  )
}

export function TopBar() {
  return (
    <header className="relative z-nav flex h-16 shrink-0 items-center gap-6 border-b border-line/[0.06] bg-ink/80 px-6 backdrop-blur-md">
      <BrandSwitcher />
      <div className="mx-auto w-full max-w-md">
        <SearchBox />
      </div>
      <div className="flex items-center gap-4">
        <FeedStatus />
        <Clock />
        <AlertsTray />
      </div>
    </header>
  )
}
