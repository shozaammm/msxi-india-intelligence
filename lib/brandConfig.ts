import type { BrandConfig, BrandId } from '@/types'

export const BRAND_CONFIGS: Record<BrandId, BrandConfig> = {
  mercedes: {
    id: 'mercedes',
    name: 'Mercedes-Benz India',
    fullName: 'Mercedes-Benz Group AG',
    ticker: 'MBG.DE',
    exchange: 'XETRA · Frankfurt',
    accentColor: '#C5A880',
    pillTextColor: '#EDE9DF',
    pillBgColor: 'rgba(197,168,128,0.08)',
    pillBorderColor: 'rgba(197,168,128,0.25)',
    newsKeywords: [
      // Brand
      'mercedes', 'mercedes-benz', 'daimler', 'mbipl',
      // Sub-brands
      'amg', 'maybach', 'eqe', 'eqs', 'eq',
      // Models (India + Global launches)
      'glc', 'gle', 'gla', 'glb', 'gls', 'g-class', 'g63', 'g-wagen',
      'e-class', 'c-class', 's-class', 'a-class', 'cla', 'cls',
      'sl', 'slr', 'sls', 'cle', 'c63', 'e63', 's63', 'gt63', 'gt4',
      // Specific new models the user mentioned
      'gt63 4-door', 'amg gt 4-door', 'amg gt4', 's-class 2025', 's-class 2026',
      'gt 63', 'eqa', 'eqb', 'eqc', 'eqv', 'eqs 450', 'eqs 580',
      // India-specific
      'dicv', 'mercedes india', 'star agora', 'mbipl',
      // Generic luxury
      'luxury car india', 'luxury sedan india', 'luxury suv india',
    ],
  },
  bmw: {
    id: 'bmw',
    name: 'BMW India',
    fullName: 'Bayerische Motoren Werke AG',
    ticker: 'BMW.DE',
    exchange: 'XETRA · Frankfurt',
    accentColor: '#1C69D4',
    pillTextColor: '#EDE9DF',
    pillBgColor: 'rgba(28,105,212,0.12)',
    pillBorderColor: 'rgba(28,105,212,0.35)',
    newsKeywords: [
      // Brand
      'bmw', 'bmw india', 'bmw group', 'bayerische',
      // Sub-brands
      'bmw m', 'bmw i', 'mini india', 'rolls-royce', 'rolls royce',
      // Models
      'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'xm',
      'i4', 'i5', 'i7', 'ix', 'ix1', 'ix3', 'ix xdrive',
      'm2', 'm3', 'm4', 'm5', 'm8', 'm340', 'm340i',
      '3 series', '5 series', '7 series', '8 series',
      // Specific launches
      'bmw m5 2025', 'bmw x5 2025', 'bmw 5 series 2025', 'new bmw',
      // India-specific
      'bmw plant chennai', 'bmw financial services india',
      // Generic
      'luxury car india', 'luxury sedan india', 'luxury suv india',
    ],
  },
}

export const INACTIVE_BRANDS = [
  { id: 'stellantis', label: 'Stellantis', color: '#C82327', bg: 'rgba(200,35,39,0.06)', border: 'rgba(200,35,39,0.20)' },
  { id: 'hyundai',    label: 'Hyundai India', color: '#0047AB', bg: 'rgba(0,71,171,0.06)', border: 'rgba(0,71,171,0.20)' },
  { id: 'tata',       label: 'Tata Motors', color: '#2B54A1', bg: 'rgba(43,84,161,0.06)', border: 'rgba(43,84,161,0.18)' },
]
