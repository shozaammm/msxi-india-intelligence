import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatEUR(value: number | null | undefined): string {
  if (value == null) return '—'
  if (value >= 1e12) return `€${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `€${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `€${(value / 1e6).toFixed(1)}M`
  return `€${value.toFixed(2)}`
}

/** Indian grouping: 19,007 · 1,23,456. */
export function formatUnits(n: number): string {
  return n.toLocaleString('en-IN')
}

export function formatSignedPct(n: number, digits = 1): string {
  const s = Math.abs(n).toFixed(Number.isInteger(n) ? 0 : digits)
  return `${n > 0 ? '+' : n < 0 ? '−' : ''}${s}%`
}

export function mktCapINR(capEUR: number | null | undefined, eurinr: number | undefined): string {
  if (capEUR == null || !eurinr) return '—'
  const crore = (capEUR * eurinr) / 1e7
  return `₹${Math.round(crore).toLocaleString('en-IN')} Cr`
}

/** "31 Dec 2025" for a date-only ISO string, without timezone drift. */
export function formatDate(iso: string): string {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00Z`) : new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function toIST(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false })
}

export function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return days < 30 ? `${days}d ago` : formatDate(isoStr)
}

export function hexToRgbTriplet(hex: string): string {
  const h = hex.replace('#', '')
  const n = Number.parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}
