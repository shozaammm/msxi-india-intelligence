export function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  return `₹${value.toLocaleString('en-IN')}`
}

export function formatEUR(value: number | null | undefined): string {
  if (value == null) return '--'
  if (value >= 1e12) return `€${(value / 1e12).toFixed(1)}T`
  if (value >= 1e9) return `€${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `€${(value / 1e6).toFixed(1)}M`
  return `€${value.toFixed(2)}`
}

export function formatVolume(v: number): string {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`
  return v.toString()
}

export function toIST(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

export function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function mktCapINR(capEUR: number | null | undefined, eurinr: number): string {
  if (capEUR == null) return '--'
  const crore = (capEUR * eurinr) / 1e7
  return `₹${crore.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Cr`
}

import { clsx, type ClassValue } from "clsx";
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
