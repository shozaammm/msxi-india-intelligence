'use client'
import { usePathname } from 'next/navigation'
import { BrandPill } from './BrandSwitcher'

/** Home owns its full-bleed hero; every other page sits in a centred column under the brand pill. */
export function PageFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  // Overview and Brand brief own a full-bleed hero.
  if (path === '/' || path === '/brief') return <>{children}</>
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 lg:px-12">
      <BrandPill className="mt-9" />
      <div className="pt-16">{children}</div>
    </div>
  )
}
