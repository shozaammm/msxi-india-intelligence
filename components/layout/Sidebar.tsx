'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { SidebarSimple } from '@phosphor-icons/react'
import { NAVIGATION } from '@/config/navigation.config'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { MsxiLogo } from '@/components/ui/MsxiLogo'

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 232 : 68 }}
      transition={{ type: 'spring', stiffness: 260, damping: 32 }}
      className="relative z-nav flex h-full shrink-0 flex-col overflow-hidden border-r border-line/[0.06] bg-ink"
      aria-label="Primary"
    >
      <div className={cn('flex h-16 items-center', sidebarOpen ? 'justify-between pl-5 pr-3' : 'justify-center')}>
        <Link href="/" aria-label="MSXI India Intelligence home" className="rounded-tile">
          <MsxiLogo compact={!sidebarOpen} className={sidebarOpen ? 'h-9' : 'h-7 w-7'} />
        </Link>
        {sidebarOpen && (
          <button onClick={toggleSidebar} aria-label="Collapse sidebar" className="rounded-tile p-1.5 text-fg-3 transition-colors hover:bg-raised hover:text-fg">
            <SidebarSimple className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {NAVIGATION.map(({ group, items }) => (
          <div key={group} className="mb-5">
            {sidebarOpen && <p className="mb-1.5 px-2.5 font-serif text-[14px] italic text-fg-3">{group}</p>}
            <ul className="flex flex-col gap-0.5">
              {items.map(({ name, href, icon: Icon }) => {
                const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      title={!sidebarOpen ? name : undefined}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-tile px-2.5 py-[7px] text-[13.5px] transition-colors duration-200',
                        sidebarOpen ? '' : 'justify-center',
                        active ? 'bg-raised text-fg' : 'text-fg-2 hover:bg-panel hover:text-fg',
                      )}
                    >
                      {active && <motion.span layoutId="nav-active" className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-accent" />}
                      <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-accent' : 'text-fg-3 group-hover:text-fg-2')} weight={active ? 'fill' : 'regular'} />
                      {sidebarOpen && <span className="truncate font-medium">{name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line/[0.06] p-3">
        {sidebarOpen ? (
          <div className="flex items-center gap-3 rounded-tile px-2 py-1.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-msxi/15 text-[11px] font-semibold text-msxi ring-1 ring-msxi/25">SM</span>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-medium text-fg">Soham Mondal</p>
              <p className="truncate text-[11.5px] text-fg-3">MSX International</p>
            </div>
          </div>
        ) : (
          <button onClick={toggleSidebar} aria-label="Expand sidebar" className="mx-auto grid h-9 w-9 place-items-center rounded-tile text-fg-3 hover:bg-raised hover:text-fg">
            <SidebarSimple className="h-[18px] w-[18px] -scale-x-100" />
          </button>
        )}
      </div>
    </motion.aside>
  )
}
