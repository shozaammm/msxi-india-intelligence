import { describe, expect, it } from 'vitest'
import { parseBrand, parseEnum, parseIntClamped, safeHttpUrl } from '@/lib/validate'

describe('validation', () => {
  it('accepts known brands and defaults to mercedes', () => {
    expect(parseBrand('bmw')).toBe('bmw')
    expect(parseBrand(null)).toBe('mercedes')
    expect(parseBrand('foo')).toBeNull()
    expect(parseBrand('__proto__')).toBeNull()
  })

  it('restricts enums', () => {
    expect(parseEnum('general', ['brand', 'general'] as const, 'brand')).toBe('general')
    expect(parseEnum(null, ['brand', 'general'] as const, 'brand')).toBe('brand')
    expect(parseEnum('x', ['brand', 'general'] as const, 'brand')).toBeNull()
  })

  it('clamps integers', () => {
    expect(parseIntClamped('9999', 20, 1, 150)).toBe(150)
    expect(parseIntClamped('-3', 20, 1, 150)).toBe(1)
    expect(parseIntClamped('abc', 20, 1, 150)).toBe(20)
  })

  it('only allows http(s) URLs', () => {
    expect(safeHttpUrl('https://a.com/x')).toBe('https://a.com/x')
    expect(safeHttpUrl('JavaScript:alert(1)')).toBeNull()
    expect(safeHttpUrl('data:text/html,hi')).toBeNull()
    expect(safeHttpUrl('/relative')).toBeNull()
    expect(safeHttpUrl(42)).toBeNull()
  })
})
