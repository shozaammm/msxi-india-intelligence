import type { BrandId, Provenance } from '@/types'

export type BodyType = 'SUV' | 'Sedan' | 'Coupe' | 'Convertible' | 'MPV'
export type Powertrain = 'Petrol' | 'Diesel' | 'Hybrid' | 'Plug-in hybrid' | 'Electric'

export interface ModelEntry {
  name: string
  body: BodyType
  power: Powertrain[]
  /** 'upcoming' = announced for India, not yet on sale. 'check' = listing sites disagree. */
  status?: 'upcoming' | 'check'
  /** Phrases used to match headlines to this model. Most specific phrase wins. */
  keywords: string[]
  note?: string
  /** Only where a cited source names the model as the brand's best seller. */
  bestSeller?: { period: string; source: string; sourceUrl: string }
}

export interface BrandModels {
  models: ModelEntry[]
  provenance: Provenance
}

// Model names, body types and powertrains compiled by hand from Autocar India,
// CarDekho and trade press listings (Sep-Oct 2026). Prices are deliberately left
// out: listing sites disagreed by lakhs on the same model. Lineups change; confirm on
// the brand's India site (linked on each brand's page) before quoting.
const provenance = (source: string, sourceUrl: string): Provenance => ({
  status: 'reported',
  source,
  sourceUrl,
  asOf: '2026-10-30',
  note: 'Compiled by hand from public listings. Verify against the brand site before quoting.',
})

export const BRAND_MODELS: Record<BrandId, BrandModels> = {
  mercedes: {
    provenance: provenance('Autocar India brand listing and trade press', 'https://www.autocarindia.com/cars/mercedes-benz'),
    models: [
      { name: 'GLA', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['gla'] },
      { name: 'C-Class', body: 'Sedan', power: ['Petrol', 'Diesel'], keywords: ['c-class', 'c class'] },
      { name: 'GLC', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['glc'] },
      { name: 'E-Class', body: 'Sedan', power: ['Petrol', 'Diesel'], keywords: ['e-class', 'e class'], bestSeller: { period: 'FY2025 (Apr 2024 to Mar 2025)', source: 'Autocar India: E-Class LWB was Mercedes-Benz India\'s best seller', sourceUrl: 'https://www.autocarindia.com/car-news/luxury-car-sales-fy2025-mercedes-retains-top-spot-e-class-lwb-best-selling-model-435059' } },
      { name: 'CLE Cabriolet', body: 'Convertible', power: ['Petrol'], keywords: ['cle'] },
      { name: 'GLE', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['gle'] },
      { name: 'S-Class', body: 'Sedan', power: ['Plug-in hybrid'], keywords: ['s-class', 's class'], note: '2026 facelift reported as plug-in hybrid only in India.' },
      { name: 'AMG G-Class', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['g-class', 'g class', 'g63', 'g 63', 'g-wagen'] },
      { name: 'Maybach GLS', body: 'SUV', power: ['Petrol'], keywords: ['maybach gls', 'gls'] },
      { name: 'Maybach SL 680', body: 'Convertible', power: ['Petrol'], keywords: ['maybach sl', 'sl 680'] },
      { name: 'EQA', body: 'SUV', power: ['Electric'], keywords: ['eqa'] },
      { name: 'EQS SUV', body: 'SUV', power: ['Electric'], keywords: ['eqs'] },
      { name: 'G-Class Electric', body: 'SUV', power: ['Electric'], keywords: ['g 580', 'g580', 'electric g-class'] },
      { name: 'CLA Electric', body: 'Sedan', power: ['Electric'], status: 'upcoming', keywords: ['cla'] },
    ],
  },
  bmw: {
    provenance: provenance('Autocar India brand listing and BMW Group PressClub India', 'https://www.autocarindia.com/cars/bmw'),
    models: [
      { name: '2 Series Gran Coupe', body: 'Sedan', power: ['Petrol', 'Diesel'], keywords: ['2 series', '220i'] },
      { name: '3 Series', body: 'Sedan', power: ['Petrol', 'Diesel'], keywords: ['3 series', '3-series', '330li', '320ld'] },
      { name: 'M340i', body: 'Sedan', power: ['Petrol'], keywords: ['m340i'] },
      { name: '5 Series', body: 'Sedan', power: ['Petrol', 'Diesel'], keywords: ['5 series', '5-series', '530li'] },
      { name: '7 Series', body: 'Sedan', power: ['Petrol', 'Diesel'], keywords: ['7 series', '7-series', '740i'] },
      { name: 'X1', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['x1'] },
      { name: 'iX1 LWB', body: 'SUV', power: ['Electric'], keywords: ['ix1'] },
      { name: 'X3', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['x3'] },
      { name: 'X5', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['x5'] },
      { name: 'X7', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['x7'] },
      { name: 'XM', body: 'SUV', power: ['Plug-in hybrid'], keywords: ['bmw xm'] },
      { name: 'i7', body: 'Sedan', power: ['Electric'], keywords: ['i7'] },
      { name: 'i5 LWB', body: 'Sedan', power: ['Electric'], status: 'upcoming', keywords: ['i5'] },
    ],
  },
  audi: {
    provenance: provenance('Autocar India brand listing and trade press', 'https://www.autocarindia.com/cars/audi'),
    models: [
      { name: 'A4', body: 'Sedan', power: ['Petrol'], status: 'check', keywords: ['audi a4'], note: 'Listing sites disagree on whether the A4 is still sold.' },
      { name: 'A6', body: 'Sedan', power: ['Petrol'], keywords: ['audi a6'] },
      { name: 'Q3', body: 'SUV', power: ['Petrol'], keywords: ['audi q3'] },
      { name: 'Q5', body: 'SUV', power: ['Petrol'], keywords: ['audi q5'] },
      { name: 'Q7', body: 'SUV', power: ['Petrol'], keywords: ['audi q7'] },
      { name: 'Q8', body: 'SUV', power: ['Petrol'], keywords: ['audi q8'] },
      { name: 'SQ8', body: 'SUV', power: ['Petrol'], keywords: ['sq8'] },
      { name: 'RS Q8', body: 'SUV', power: ['Petrol'], keywords: ['rs q8'] },
      { name: 'Q8 e-tron', body: 'SUV', power: ['Electric'], keywords: ['q8 e-tron', 'q8 etron'] },
    ],
  },
  volvo: {
    provenance: provenance('Autocar India brand listing and trade press', 'https://www.autocarindia.com/cars/volvo'),
    models: [
      { name: 'EX30', body: 'SUV', power: ['Electric'], keywords: ['ex30'] },
      { name: 'EX40', body: 'SUV', power: ['Electric'], keywords: ['ex40'] },
      { name: 'EC40', body: 'SUV', power: ['Electric'], keywords: ['ec40'] },
      { name: 'XC60', body: 'SUV', power: ['Petrol'], keywords: ['xc60'] },
      { name: 'XC90', body: 'SUV', power: ['Petrol'], keywords: ['xc90'] },
      { name: 'EX90', body: 'SUV', power: ['Electric'], status: 'check', keywords: ['ex90'], note: 'One source reports a launch; another lists it as upcoming.' },
    ],
  },
  porsche: {
    provenance: provenance('Autocar India and CarDekho brand listings', 'https://www.autocarindia.com/cars/porsche'),
    models: [
      { name: 'Macan', body: 'SUV', power: ['Petrol'], keywords: ['porsche macan', 'macan'] },
      { name: 'Macan Electric', body: 'SUV', power: ['Electric'], keywords: ['macan electric', 'macan ev'] },
      { name: 'Cayenne', body: 'SUV', power: ['Petrol'], keywords: ['cayenne'] },
      { name: 'Cayenne Electric', body: 'SUV', power: ['Electric'], keywords: ['cayenne electric', 'cayenne ev'] },
      { name: 'Panamera', body: 'Sedan', power: ['Petrol'], keywords: ['panamera'] },
      { name: 'Taycan', body: 'Sedan', power: ['Electric'], keywords: ['taycan'] },
      { name: '911', body: 'Coupe', power: ['Petrol'], keywords: ['porsche 911', '911'] },
    ],
  },
  landrover: {
    provenance: provenance('Autocar India and CarDekho brand listings', 'https://www.autocarindia.com/cars/land-rover'),
    models: [
      { name: 'Defender', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['land rover defender', 'defender'], note: 'Defender 110 is now locally assembled in India.', bestSeller: { period: 'FY2025 (Apr 2024 to Mar 2025)', source: 'Autocar India: Defender was JLR India\'s top seller', sourceUrl: 'https://www.autocarindia.com/car-news/luxury-car-sales-fy2025-mercedes-retains-top-spot-e-class-lwb-best-selling-model-435059' } },
      { name: 'Range Rover', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['range rover'] },
      { name: 'Range Rover Sport', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['range rover sport'] },
      { name: 'Range Rover Velar', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['velar'] },
      { name: 'Range Rover Evoque', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['evoque'] },
      { name: 'Discovery Sport', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['discovery sport'] },
      { name: 'Discovery', body: 'SUV', power: ['Petrol', 'Diesel'], keywords: ['land rover discovery', 'discovery tempest', 'discovery gemini'] },
      { name: 'Range Rover Electric', body: 'SUV', power: ['Electric'], status: 'upcoming', keywords: ['range rover electric', 'range rover ev'] },
    ],
  },
  lexus: {
    provenance: provenance('Autocar India brand listing', 'https://www.autocarindia.com/cars/lexus'),
    models: [
      { name: 'ES', body: 'Sedan', power: ['Hybrid'], keywords: ['lexus es', 'es 300h', 'es 350h'] },
      { name: 'NX', body: 'SUV', power: ['Hybrid'], keywords: ['lexus nx', 'nx 350h'] },
      { name: 'RX', body: 'SUV', power: ['Hybrid'], keywords: ['lexus rx', 'rx 350h'] },
      { name: 'LX', body: 'SUV', power: ['Diesel'], keywords: ['lexus lx', 'lx 500d'] },
      { name: 'LM', body: 'MPV', power: ['Hybrid'], status: 'check', keywords: ['lexus lm', 'lm 350h'], note: 'One listing says the LM was discontinued; others still list it.' },
    ],
  },
}
