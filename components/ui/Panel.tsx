import { cn } from '@/lib/utils'

interface PanelProps {
  title: string
  /** Small label above the title, e.g. "Headlines". */
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
      <header className="flex items-end justify-between gap-4 px-6 pb-4 pt-6">
        <div className="min-w-0">
          {kicker && <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-3">{kicker}</p>}
          <h2 className="display mt-1.5 text-[28px] text-fg">{title.replace(/\.$/, '')}.</h2>
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </header>
      <div className={cn('min-h-0 flex-1 px-6 pb-6', bodyClassName)}>{children}</div>
      {footer && <footer className="hairline border-t px-6 py-4">{footer}</footer>}
    </Tag>
  )
}
