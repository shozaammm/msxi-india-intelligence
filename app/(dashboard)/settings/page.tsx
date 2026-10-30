'use client'
import { useState } from 'react'
import { Check } from '@phosphor-icons/react'
import { useAppStore, REFRESH_OPTIONS } from '@/lib/store'
import { Panel } from '@/components/ui/Panel'

export default function SettingsPage() {
  const { theme, setTheme, refreshMs, setRefreshMs, defaultRegion, setDefaultRegion, watchKeywords, setWatchKeywords } = useAppStore()
  const [draft, setDraft] = useState(watchKeywords.join(', '))
  const [saved, setSaved] = useState(false)
  const parsed = draft.split(',').map((k) => k.trim()).filter(Boolean)
  const tooMany = parsed.length > 12

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <header>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-3">Settings</p>
        <h1 className="display text-[clamp(36px,4vw,56px)] text-fg">Your preferences</h1>
        <p className="mt-1 text-[13px] text-fg-2">Saved in this browser only. Changes apply straight away.</p>
      </header>

      <Panel title="Surface" kicker="Appearance">
        <div className="flex flex-wrap gap-1.5">
          {([['auto', 'Follow the brand'], ['light', 'White'], ['dark', 'Black'], ['stone', 'Stone']] as const).map(([t, label]) => (
            <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)} className="chip-btn">{label}</button>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-fg-3">Each brand has a default surface (Mercedes-Benz, Volvo and Lexus white; the rest black). Stone is the warm grey used for Maybach.</p>
      </Panel>

      <Panel title="News refresh" kicker="Timing">
        <div className="flex flex-wrap gap-1.5">
          {REFRESH_OPTIONS.map((o) => (
            <button key={o.ms} aria-pressed={refreshMs === o.ms} onClick={() => setRefreshMs(o.ms)} className="chip-btn">
              Every {o.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-fg-3">Publishers update every few minutes at most, so faster than this only repeats the same stories.</p>
      </Panel>

      <Panel title="Default region" kicker="Feed">
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'india', 'global'] as const).map((r) => (
            <button key={r} aria-pressed={defaultRegion === r} onClick={() => setDefaultRegion(r)} className="chip-btn capitalize">
              {r === 'all' ? 'India and global' : r}
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Watch words" kicker="Highlight">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (tooMany) return
            setWatchKeywords(parsed)
            setSaved(true)
            setTimeout(() => setSaved(false), 1800)
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="kw" className="text-[13px] text-fg-2">Words to highlight in headlines, separated by commas</label>
          <input
            id="kw"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-invalid={tooMany}
            aria-describedby="kw-help"
            className="h-10 rounded-[10px] bg-ink px-3 text-[13.5px] text-fg ring-1 ring-line/10 focus:outline-none focus:ring-accent/50 aria-[invalid=true]:ring-neg/60"
          />
          <p id="kw-help" className={tooMany ? 'text-[12px] text-neg' : 'text-[12px] text-fg-3'}>
            {tooMany ? 'Keep it to 12 words or fewer.' : `${parsed.length} word${parsed.length === 1 ? '' : 's'}`}
          </p>
          <div>
            <button type="submit" disabled={tooMany} className="mt-1 inline-flex items-center gap-2 rounded-[10px] bg-fg px-4 py-2 text-[13px] font-medium text-ink transition-[transform,opacity] hover:opacity-90 active:scale-[0.98] disabled:opacity-40">
              {saved ? <><Check className="h-4 w-4" weight="bold" /> Saved</> : 'Save watch words'}
            </button>
          </div>
        </form>
      </Panel>
    </div>
  )
}
