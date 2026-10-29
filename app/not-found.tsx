import Link from 'next/link'
import { MsxiLogo } from '@/components/ui/MsxiLogo'

export default function NotFound() {
  return (
    <main className="flex h-dvh flex-col items-start justify-center gap-5 bg-ink px-[12vw]">
      <MsxiLogo className="h-8" />
      <p className="font-serif text-[22px] italic text-fg-3">404</p>
      <h1 className="max-w-[18ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] text-fg">This page isn&apos;t in the brief.</h1>
      <p className="max-w-[52ch] text-[14px] leading-relaxed text-fg-2">The link may be old. Older pages like Sentiment and Car Culture became Coverage and Brand hub.</p>
      <Link href="/" className="rounded-[10px] bg-fg px-4 py-2 text-[13px] font-medium text-ink transition-transform active:scale-[0.98]">Back to today&apos;s brief</Link>
    </main>
  )
}
