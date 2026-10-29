'use client'
import { Fragment, useMemo } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { topicLabel } from '@/lib/topics'
import { cn, relativeTime } from '@/lib/utils'
import type { NewsItem } from '@/types'

function highlight(text: string, re: RegExp | null) {
  if (!re) return text
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? <mark key={i} className="rounded-[3px] bg-accent/20 px-0.5 text-fg">{part}</mark> : <Fragment key={i}>{part}</Fragment>,
  )
}

export function buildHighlightRegex(words: string[]): RegExp | null {
  const clean = words.map((w) => w.trim()).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  // Whole words only, so "EV" doesn't light up inside "developed".
  return clean.length ? new RegExp(`(?<![\\p{L}\\p{N}])(${clean.join('|')})(?![\\p{L}\\p{N}])`, 'giu') : null
}

export function NewsList({ items, highlightWords = [], dense = false }: { items: NewsItem[]; highlightWords?: string[]; dense?: boolean }) {
  const re = useMemo(() => buildHighlightRegex(highlightWords), [highlightWords])

  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.id} className="hairline border-b last:border-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('group -mx-2 flex gap-3 rounded-tile px-2 transition-colors duration-200 hover:bg-fg/[0.035]', dense ? 'py-2.5' : 'py-3.5')}
          >
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-[11.5px] text-fg-3">
                <span className="font-medium text-fg-2">{item.source}</span>
                {item.region === 'india' && <span className="rounded-[3px] px-1 text-[10.5px] ring-1 ring-line/10">IN</span>}
                <span aria-hidden>·</span>
                <time dateTime={item.isoTimestamp} title={item.dateEstimated ? 'Publisher gave no date; time shown is when we fetched it' : undefined}>
                  {item.dateEstimated ? '~' : ''}{relativeTime(item.isoTimestamp)}
                </time>
              </p>
              <p className={cn('mt-1 font-medium leading-snug text-fg/90 transition-colors group-hover:text-fg', dense ? 'text-[13.5px]' : 'text-[14.5px]')}>
                {highlight(item.headline, re)}
              </p>
              {!dense && item.snippet && <p className="mt-1 line-clamp-2 max-w-[68ch] text-[12.5px] leading-relaxed text-fg-3">{item.snippet}</p>}
              {!dense && item.topics.length > 0 && (
                <p className="mt-2 flex flex-wrap gap-1.5">
                  {item.topics.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-[4px] bg-fg/[0.05] px-1.5 py-0.5 text-[11px] text-fg-3">{topicLabel(t)}</span>
                  ))}
                </p>
              )}
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-fg-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" weight="bold" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
