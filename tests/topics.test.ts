import { describe, expect, it } from 'vitest'
import { isAutoRelevant } from '@/lib/topics'

describe('isAutoRelevant', () => {
  it.each([
    'Upcoming Cars in November 2026: GLC EV to VinFast VF3, 7 Expected Launches',
    'Mercedes Boss Talks Electric E-Class, Developed From A White Sheet Of Paper',
    'BYD Yangwang Altior Luxury Sedan Teased Ahead of November 5 Debut in Dubai',
    'Mercedes-Benz India posts record Q3 retail sales',
  ])('keeps %s', (h) => expect(isAutoRelevant(h)).toBe(true))

  it.each([
    'Kerala judge says son took Mercedes without his knowledge; High Court stays his arrest',
    "'He Was Questioned For 4 Hours': Kerala Judge Gets Pre-Arrest Bail In Mercedes Crash Case",
    'The Vatican Is Celebrating Nearly 100 Years of Popemobiles With a Very Special Car Collection',
    'Mercedes-Benz Cuts Outlook as China Woes Deepen, Offers Buyouts',
  ])('drops %s', (h) => expect(isAutoRelevant(h)).toBe(false))
})
