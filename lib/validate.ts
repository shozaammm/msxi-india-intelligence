import { BRAND_IDS } from '@/config/brands.config'
import type { BrandId } from '@/types'

export function parseBrand(value: string | null): BrandId | null {
  const v = value ?? 'mercedes'
  return (BRAND_IDS as string[]).includes(v) ? (v as BrandId) : null
}

export function parseEnum<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T | null {
  if (value == null) return fallback
  return (allowed as readonly string[]).includes(value) ? (value as T) : null
}

export function parseIntClamped(value: string | null, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(value ?? '', 10)
  if (Number.isNaN(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

/** Only http(s) links reach the UI; anything else (javascript:, data:, relative) is rejected. */
export function safeHttpUrl(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw.trim()) return null
  try {
    const u = new URL(raw.trim())
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null
  } catch {
    return null
  }
}
