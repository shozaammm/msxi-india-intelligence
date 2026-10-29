import type { BrandConfig, BrandId } from '@/types'

// Single source of truth for brands. To add a brand: add its id to BrandId,
// add an entry here, a logo in /public/logos and an entry in intel.config.ts.
export const BRAND_CONFIGS: Record<BrandId, BrandConfig> = {
  mercedes: {
    id: 'mercedes',
    name: 'Mercedes-Benz India',
    fullName: 'Mercedes-Benz Group AG',
    ticker: 'MBG.DE',
    providerSymbol: { symbol: 'MBG', exchange: 'XETR' },
    exchange: 'XETRA · Frankfurt',
    accentColor: '#C5A880',
    logo: '/logos/mercedes_benz.png',
    subLogo: '/logos/amg.png',
    pillTextColor: '#EDE9DF',
    pillBgColor: 'rgba(197,168,128,0.08)',
    pillBorderColor: 'rgba(197,168,128,0.25)',
    // Brand-identifying terms only. Short codes like 'eq' or 'sl' matched
    // unrelated stories, and 'daimler'/'dicv' are Daimler Truck, a separate company.
    newsKeywords: [
      'mercedes', 'mercedes-benz', 'mercedes-amg', 'mercedes-maybach', 'maybach', 'amg', 'mbipl',
      'g-class', 'g-wagen', 'g63', 'e-class', 'c-class', 's-class', 'a-class', 'cla', 'cle',
      'glc', 'gle', 'gls', 'gla', 'glb', 'eqs', 'eqe', 'eqa', 'eqb', 'eqv',
    ],
    googleNewsQuery: '"Mercedes-Benz" India',
    reviewModels: ['E-Class LWB', 'GLC', 'GLE', 'GLS', 'S-Class', 'EQS SUV', 'AMG G63'],
    officialLinks: [
      { label: 'Mercedes-Benz India', url: 'https://www.mercedes-benz.co.in/' },
      { label: 'Group investor relations', url: 'https://group.mercedes-benz.com/investors/' },
    ],
  },
  bmw: {
    id: 'bmw',
    name: 'BMW India',
    fullName: 'Bayerische Motoren Werke AG',
    ticker: 'BMW.DE',
    providerSymbol: { symbol: 'BMW', exchange: 'XETR' },
    exchange: 'XETRA · Frankfurt',
    // BMW blue (#1C69D4) toned down so it sits with the warm neutrals.
    accentColor: '#5B86C9',
    logo: '/logos/bmw.png',
    pillTextColor: '#EDE9DF',
    pillBgColor: 'rgba(28,105,212,0.12)',
    pillBorderColor: 'rgba(28,105,212,0.35)',
    // 'x1'..'x7', 'i5', 'i7', 'm5' and 'xm' collided with chips, phones and
    // satellite radio in global feeds; nearly every BMW story names 'BMW' anyway.
    newsKeywords: ['bmw', 'm340i', 'ix1', 'ix3'],
    googleNewsQuery: 'BMW India',
    reviewModels: ['3 Series LWB', '5 Series LWB', 'X1', 'X5', 'X7', 'iX1', 'M340i'],
    officialLinks: [
      { label: 'BMW India', url: 'https://www.bmw.in/' },
      { label: 'BMW Group PressClub India', url: 'https://www.press.bmwgroup.com/india' },
      { label: 'Group investor relations', url: 'https://www.bmwgroup.com/en/investor-relations.html' },
    ],
  },
}

export const BRAND_IDS = Object.keys(BRAND_CONFIGS) as BrandId[]

export const INACTIVE_BRANDS = [
  { id: 'stellantis', label: 'Stellantis', color: '#C82327', bg: 'rgba(200,35,39,0.06)', border: 'rgba(200,35,39,0.20)' },
  { id: 'hyundai',    label: 'Hyundai India', color: '#0047AB', bg: 'rgba(0,71,171,0.06)', border: 'rgba(0,71,171,0.20)' },
  { id: 'tata',       label: 'Tata Motors', color: '#2B54A1', bg: 'rgba(43,84,161,0.06)', border: 'rgba(43,84,161,0.18)' },
]
