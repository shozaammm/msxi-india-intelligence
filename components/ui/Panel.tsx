import { cn } from '@/lib/utils'

interface PanelProps {
  title: string
  /** Short serif kicker above the title, e.g. "Brief". */
  kicker?: string
  action?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  bodyClassName?: string
  children: React.ReactNode
  as?: 'section' | 'article' | 'aside'
}

export function Panel({ title, kicker, action, footer, className, bodyClassName, children, as: Tag = 'section' }: PanelProps) {
  return (
    <Tag className={cn('card flex min-h-0 flex-col', className)}>
      <header className="flex items-end justify-between gap-4 px-5 pb-3 pt-4">
        <div className="min-w-0">
          {kicker && <p className="font-serif text-[15px] italic leading-none text-accent">{kicker}</p>}
          <h2 className="mt-1 truncate text-[15px] font-semibold tracking-[-0.01em] text-fg">{title}</h2>
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </header>
      <div className={cn('min-h-0 flex-1 px-5 pb-5', bodyClassName)}>{children}</div>
      {footer && <footer className="hairline border-t px-5 py-3">{footer}</footer>}
    </Tag>
  )
}
