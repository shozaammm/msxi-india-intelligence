import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-tile bg-fg/[0.06]', className)} aria-hidden />
}

/** Placeholder shaped like a list of news rows. */
export function NewsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex flex-col" role="status" aria-label="Loading headlines">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="hairline flex flex-col gap-2 border-b py-3.5 last:border-0">
          <div className="flex gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-10" />
          </div>
          <Skeleton className="h-3.5 w-[92%]" />
          <Skeleton className="h-3.5 w-[64%]" />
        </div>
      ))}
    </div>
  )
}
