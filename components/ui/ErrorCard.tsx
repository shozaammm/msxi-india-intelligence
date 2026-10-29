'use client'
import { WarningOctagon } from '@phosphor-icons/react'

export function ErrorCard({ source, message, onRetry }: { source: string; message?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-2 rounded-tile bg-neg/[0.06] px-4 py-4 ring-1 ring-neg/20">
      <p className="flex items-center gap-2 text-[13px] font-medium text-neg">
        <WarningOctagon className="h-4 w-4" weight="duotone" aria-hidden />
        Couldn&apos;t reach {source}
      </p>
      <p className="max-w-prose text-[12.5px] leading-relaxed text-fg-2">
        {message ?? 'Nothing shown here is a guess. We will try again automatically.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="chip-btn mt-1">
          Try again now
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1.5 py-8">
      <p className="font-serif text-[20px] italic text-fg-2">{title}</p>
      {children && <div className="max-w-prose text-[12.5px] leading-relaxed text-fg-3">{children}</div>}
    </div>
  )
}
