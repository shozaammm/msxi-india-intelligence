'use client'
import { Suspense, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { useAppStore } from '@/lib/store'
import { useNewsData } from '@/hooks/useNewsData'
import { NewsPanel } from '@/components/news/NewsPanel'
import { Panel } from '@/components/ui/Panel'
import { Skeleton } from '@/components/ui/Skeleton'
import { relativeTime } from '@/lib/utils'

function SourcesPanel() {
  const brand = useAppStore((s) => s.activeBrand)
  const { data, isLoading } = useNewsData(brand)
  const sources = useMemo(() => {
    const counts = new Map<string, { n: number; india: boolean }>()
    for (const i of data?.data ?? []) {
      const c = counts.get(i.source) ?? { n: 0, india: i.region === 'india' }
      counts.set(i.source, { ...c, n: c.n + 1 })
    }
    return [...counts.entries()].sort((a, b) => b[1].n - a[1].n)
  }, [data])

  return (
    <Panel
      title="Who is writing"
      kicker="Sources"
      footer={data && <p className="text-[11.5px] text-fg-3">{data.meta.feedsOk} of {data.meta.feedsTotal} feeds responded · refreshed {relativeTime(data.meta.fetchedAt)}</p>}
    >
      {isLoading ? (
        <div className="flex flex-col gap-2.5">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-5" />)}</div>
      ) : (
        <ol className="flex flex-col">
          {sources.slice(0, 12).map(([name, { n, india }], i) => (
            <li key={name} className="hairline grid grid-cols-[22px_1fr_auto] items-center gap-2 border-b py-2 last:border-0">
              <span className="num text-[12px] text-fg-3">{i + 1}</span>
              <span className="truncate text-[13px] text-fg">
                {name}
                {india && <span className="ml-2 rounded-[3px] px-1 text-[10.5px] text-fg-3 ring-1 ring-line/10">IN</span>}
              </span>
              <span className="num text-[12.5px] text-fg-2">{n}</span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}

function NewsContent() {
  const brand = useAppStore((s) => s.activeBrand)
  const router = useRouter()
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')

  const update = (q: string) => {
    setQuery(q)
    router.replace(q ? `/news?q=${encodeURIComponent(q)}` : '/news', { scroll: false })
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-3">Headlines</p>
          <h1 className="display text-[clamp(36px,4vw,56px)] text-fg">News desk</h1>
        </div>
        <div className="relative w-full max-w-sm">
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" />
          <input
            value={query}
            onChange={(e) => update(e.target.value)}
            placeholder="Filter by word, model or publisher"
            aria-label="Filter headlines"
            className="h-10 w-full rounded-[10px] bg-panel pl-9 pr-9 text-[13.5px] text-fg ring-1 ring-line/[0.08] placeholder:text-fg-3 focus:outline-none focus:ring-accent/50"
          />
          {query && (
            <button onClick={() => update('')} aria-label="Clear filter" className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-fg-3 hover:bg-raised hover:text-fg">
              <X className="h-3.5 w-3.5" weight="bold" />
            </button>
          )}
        </div>
      </header>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <NewsPanel brand={brand} query={query} className="h-[calc(100dvh-260px)] min-h-[520px]" />
        <SourcesPanel />
      </div>
    </div>
  )
}

export default function NewsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <NewsContent />
    </Suspense>
  )
}
