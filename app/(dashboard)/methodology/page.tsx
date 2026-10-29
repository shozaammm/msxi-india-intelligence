import type { Metadata } from 'next'
import { FEEDS } from '@/config/feeds.config'
import { StatusTag } from '@/components/ui/StatusTag'
import type { DataStatus } from '@/types'

export const metadata: Metadata = { title: 'Methodology' }

const STATUSES: { s: DataStatus; text: string }[] = [
  { s: 'live', text: 'Fetched automatically from the source within its refresh window (news: minutes; exchange rate: daily).' },
  { s: 'reported', text: 'Typed in by hand from a public document we link to. Click the source line to check it.' },
  { s: 'sample', text: 'A placeholder that shows the layout. Not a real figure. Drawn hatched in charts.' },
  { s: 'stale', text: 'The last good value. The source didn’t answer on the latest try.' },
  { s: 'unavailable', text: 'No source is connected, so we show nothing instead of guessing.' },
]

const SOURCES = [
  { name: 'Company press releases', gives: 'Annual India sales by brand', freq: 'Yearly / quarterly', use: 'Reported figures on Today and Compare' },
  { name: 'FADA retail release', gives: 'OEM-wise retail share from VAHAN', freq: 'Monthly, around the 6th', use: 'Will replace the sample monthly series' },
  { name: 'VAHAN dashboard', gives: 'Registrations by maker, state, RTO', freq: 'Daily', use: 'Not connected: no official API; needs permission' },
  { name: 'ECB via Frankfurter', gives: 'EUR → INR reference rate', freq: 'Each business day', use: 'Market page' },
  { name: 'Twelve Data (licensed)', gives: 'XETRA share prices', freq: 'Delayed quotes', use: 'Only when TWELVE_DATA_API_KEY is set' },
  { name: 'Publisher RSS + Google News', gives: 'Headlines, short excerpts, links', freq: 'Every 10 minutes', use: 'News, Coverage, Brand hub' },
]

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return <h2 id={id} className="scroll-mt-6 text-[19px] font-semibold tracking-[-0.015em] text-fg">{children}</h2>
}

export default function MethodologyPage() {
  const corrections = process.env.NEXT_PUBLIC_CORRECTIONS_EMAIL
  return (
    <article className="flex max-w-[760px] flex-col gap-9 pb-6">
      <header>
        <p className="font-serif text-[16px] italic text-accent">Methodology</p>
        <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.03em] text-fg">Where every number comes from</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-fg-2">
          Every figure in this app carries a status, a source and a date. If a number has no source, we don&apos;t show it. Registrations (VAHAN, FADA) are not the same as manufacturer wholesale figures, and some states report late.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <H2>Status labels</H2>
        <dl className="card divide-y divide-line/[0.06]">
          {STATUSES.map(({ s, text }) => (
            <div key={s} className="grid grid-cols-[120px_1fr] items-start gap-4 px-5 py-3.5">
              <dt><StatusTag status={s} /></dt>
              <dd className="text-[13.5px] leading-relaxed text-fg-2">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Sources</H2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-[13px]">
            <thead className="text-[12px] text-fg-3">
              <tr className="border-b border-line/[0.07]">
                {['Source', 'Gives us', 'How often', 'Used for'].map((h) => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((r) => (
                <tr key={r.name} className="border-b border-line/[0.05] last:border-0">
                  <th scope="row" className="px-4 py-3 font-medium text-fg">{r.name}</th>
                  <td className="px-4 py-3 text-fg-2">{r.gives}</td>
                  <td className="px-4 py-3 text-fg-2">{r.freq}</td>
                  <td className="px-4 py-3 text-fg-2">{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12.5px] leading-relaxed text-fg-3">
          News publishers polled: {FEEDS.map((f) => f.source).join(', ')}, plus Google News searches per brand. Our fetcher identifies itself as MSXIIntelBot and caches each feed for 10 minutes.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <H2 id="monthly">Updating the monthly figures</H2>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-[13.5px] leading-relaxed text-fg-2 marker:text-fg-3">
          <li>When FADA publishes its monthly retail release (around the 6th), open the PDF and find the brand&apos;s row in the OEM-wise table.</li>
          <li>Add the month to <code className="num text-fg">monthlyTrend</code> in <code className="num text-fg">config/intel.config.ts</code>.</li>
          <li>Set <code className="num text-fg">status: &apos;reported&apos;</code>, <code className="num text-fg">sourceUrl</code> to the PDF and <code className="num text-fg">asOf</code> to the month end. Only switch a series to reported once every value in it is real.</li>
          <li>Deploy. The Sample label and the hatching disappear on their own.</li>
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <H2 id="market">Market data</H2>
        <p className="text-[13.5px] leading-relaxed text-fg-2">
          Earlier versions scraped Yahoo Finance and Stooq. Neither offers a public API, their terms restrict automated and commercial use, and both were blocking requests, which made the app show a made-up market cap labelled live. Share prices now come only from a licensed provider. Market cap is price × shares outstanding, and stays labelled approximate until the share count is checked against the latest annual report.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <H2>What we don&apos;t do</H2>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[13.5px] leading-relaxed text-fg-2 marker:text-fg-3">
          <li>Write or paraphrase quotes from reviewers or journalists.</li>
          <li>Score sentiment from a handful of articles.</li>
          <li>Estimate, forecast or fill in missing figures.</li>
          <li>Store or republish full articles. We show the headline, a short excerpt and a link.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <H2 id="corrections">Corrections</H2>
        <p className="text-[13.5px] leading-relaxed text-fg-2">
          Spotted a wrong figure or a broken source? {corrections ? <>Email <span className="num text-fg">{corrections}</span> with the page and the correct source.</> : 'Contact the MSXI India Intelligence team with the page and the correct source.'} We fix and date every correction.
        </p>
        <p className="text-[12.5px] leading-relaxed text-fg-3">
          This is not investment, legal or business advice. Check the original source before making decisions.
        </p>
      </section>
    </article>
  )
}
