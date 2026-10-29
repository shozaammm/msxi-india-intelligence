import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type { Provenance } from '@/types'
import { cn, formatDate } from '@/lib/utils'

/** "Source · as of date" line that sits under every figure. */
export function SourceNote({ p, className, prefix = 'Source' }: { p: Provenance; className?: string; prefix?: string }) {
  const body = (
    <>
      {prefix}: {p.source} · as of {formatDate(p.asOf)}
      {p.sourceUrl && <ArrowUpRight className="ml-0.5 inline h-3 w-3 -translate-y-px" weight="bold" aria-hidden />}
    </>
  )
  return p.sourceUrl ? (
    <a
      href={p.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('text-[11.5px] text-fg-3 underline decoration-line/20 underline-offset-[3px] transition-colors hover:text-fg-2 hover:decoration-fg-2/50', className)}
    >
      {body}
    </a>
  ) : (
    <span className={cn('text-[11.5px] text-fg-3', className)}>{body}</span>
  )
}
