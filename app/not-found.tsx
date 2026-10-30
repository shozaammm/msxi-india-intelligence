import Link from 'next/link'
import { MsxiLogo } from '@/components/ui/MsxiLogo'

export default function NotFound() {
  return (
    <main className="flex h-dvh flex-col items-start justify-center gap-5 bg-ink px-[12vw]">
      <MsxiLogo className="h-8" />
      <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-fg-3">404</p>
      <h1 className="display max-w-[18ch] text-[clamp(40px,5vw,64px)] text-fg">This page isn&apos;t in the brief.</h1>
      <p className="max-w-[52ch] text-[16px] leading-relaxed text-fg-2">The link may be old. Older pages like Sentiment and Car Culture became Coverage and Brand hub.</p>
      <Link href="/" className="btn-solid">Back to today&apos;s brief</Link>
    </main>
  )
}
