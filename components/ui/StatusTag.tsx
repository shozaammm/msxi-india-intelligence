import type { DataStatus } from '@/types'
import { cn } from '@/lib/utils'

const STYLES: Record<DataStatus, { label: string; cls: string; dot: string; hint: string }> = {
  live:        { label: 'Live',        cls: 'text-pos bg-pos/10',       dot: 'bg-pos animate-[pulse-dot_2.4s_ease-in-out_infinite]', hint: 'Fetched from the source within its refresh window.' },
  reported:    { label: 'Reported',    cls: 'text-fg-2 bg-fg/[0.06]',   dot: 'bg-fg-2', hint: 'Copied from a public, cited source. Click the source to check it.' },
  sample:      { label: 'Sample data', cls: 'text-warn bg-warn/10',     dot: 'bg-warn', hint: 'Illustrative placeholder. Not real figures.' },
  stale:       { label: 'Stale',       cls: 'text-warn bg-warn/10',     dot: 'bg-warn', hint: 'Last good value; the source did not respond on the latest attempt.' },
  unavailable: { label: 'Unavailable', cls: 'text-fg-3 bg-fg/[0.04]',   dot: 'bg-fg-3', hint: 'Source not configured or not responding.' },
}

export function StatusTag({ status, note, className }: { status: DataStatus; note?: string; className?: string }) {
  const s = STYLES[status]
  return (
    <span
      title={note ?? s.hint}
      className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-[4px] px-1.5 py-0.5 text-[11px] font-medium leading-none', s.cls, className)}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} aria-hidden />
      {s.label}
    </span>
  )
}
