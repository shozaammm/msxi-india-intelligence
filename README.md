# MSXI India Intelligence

India automotive briefings for MSX International: reported brand sales with sources, live brand news from 15+ publishers, coverage topics and market context. Every number on screen carries a status (Live, Reported, Sample, Stale or Unavailable), a source and a date.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # parser + validation unit tests
npm run lint && npm run typecheck
npm run build
```

Stack: Next.js 16 (App Router), React 19, Tailwind 3, TanStack Query, Zustand, Framer Motion, Phosphor icons, Vitest.

## Environment

| Variable | Needed for | Without it |
|---|---|---|
| `TWELVE_DATA_API_KEY` | Share price and market cap (licensed feed; confirm your plan covers XETRA) | Shown as "Unavailable" |
| `NEXT_PUBLIC_CORRECTIONS_EMAIL` | Error-report address on /methodology | Generic contact line |

## Where the data lives

| What | File | How it updates |
|---|---|---|
| Brands, keywords, logos, official links | `config/brands.config.ts` | By hand |
| Annual / monthly / state figures | `config/intel.config.ts` | By hand from cited sources (see /methodology) |
| News feeds | `config/feeds.config.ts` | Polled every 10 min, cached by the CDN for 5 min |
| EUR→INR | ECB via Frankfurter | Daily |

Monthly and state figures are **sample data** until the FADA import (and VAHAN permission) exist. They are hatched in charts and tagged "Sample data" everywhere.

## Adding a brand

1. Add the id to `BrandId` in `types/brand.ts`.
2. Add an entry to `config/brands.config.ts` and a logo to `public/logos/`.
3. Add its figures to `config/intel.config.ts` (start with `status: 'sample'`).

## Health

`GET /api/health` reports each feed's last HTTP status and item count, and whether market data is configured. It returns 503 when every feed is down.

## Known limits

- Caches are in memory per server instance; there's no database or history yet.
- Topic tags are keyword rules (`lib/topics.ts`), not a model.
- No authentication. Add managed auth before any paid or restricted use.
