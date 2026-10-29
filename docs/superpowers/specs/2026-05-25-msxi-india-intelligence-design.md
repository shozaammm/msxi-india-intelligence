# MSXI India OEM Intelligence Portal — Design Spec
**Date:** 2026-05-25  
**Status:** Approved  
**Author:** Claude Code (brainstorming session)

---

## 1. Purpose

A real-time executive data mirror for MSXI consultants to use during live OEM meetings in India. The portal surfaces live stock performance, India automotive marketplace telemetry, and a raw news intelligence stream for a single active OEM brand (Mercedes-Benz India, Phase 1). It is a zero-processing, zero-hallucination proxy layer — every visible field maps 1:1 to a raw external data source.

---

## 2. Approved Design Direction

**Layout:** Cinematic Split — no sidebar, no traditional dashboard chrome.
- **Top bar (52px):** MSXI wordmark · context label · brand switcher pills · India badge · live indicator · IST clock
- **Left panel (55%):** Stock market hero — large price, change, 6-metric grid
- **Right column (45%):** Marketplace telemetry (top 50%) + Intelligence news stream (bottom 50%)

**Theme:** Warm dark obsidian (`#0D0C14` base, `#EDE9DF` cream text). Not cyberpunk-neon, not blinding white. Inspired by luxury instrument clusters and the editorial minimalism of landonorris.com.

**Brand Identity:**
- Mercedes-Benz three-pointed star: SVG with chrome radial gradients (matches official logo)
- "Mercedes-Benz" serif wordmark + "///AMG" speed-stripe logo inline in brand identity row
- Large rotating watermark star behind the price panel (opacity 3%)
- Per-brand accent colors for coming-soon pills: BMW blue `#1C69D4`, Stellantis red `#C82327`, Hyundai navy `#002C5F`

---

## 3. Architecture

### 3.1 Runtime Target
- **Primary:** Next.js 14 (App Router) web app — runs at `localhost:3000`
- **Tauri-ready:** folder structure and config prepared for Tauri wrapping in a future step (no Electron)
- All API keys live server-side only (Next.js API routes)

### 3.2 Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| UI | React 18 + Tailwind CSS v3 |
| Animation | Framer Motion v11 |
| Data fetching | TanStack Query v5 (React Query) |
| Fonts | Space Grotesk (headings/numbers) + Inter (body) via next/font |
| Numeric display | `font-variant-numeric: tabular-nums` everywhere |
| Server proxy | Next.js API Routes (Node.js runtime) |
| Tauri config | `src-tauri/` stub, `tauri.conf.json` pre-wired |

### 3.3 Folder Structure
```
/
├── app/
│   ├── api/
│   │   ├── market/route.ts          ← Yahoo Finance proxy
│   │   ├── marketplace/route.ts     ← Demo data (India context)
│   │   └── news/route.ts            ← RSS feed aggregator
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                     ← Shell + brand context state
│   └── providers.tsx                ← QueryClientProvider
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx
│   │   └── BrandPill.tsx
│   ├── market/
│   │   ├── MarketPanel.tsx
│   │   ├── PriceHero.tsx
│   │   └── MetricsGrid.tsx
│   ├── marketplace/
│   │   ├── MarketplacePanel.tsx
│   │   ├── MetricCard.tsx
│   │   └── RegionBars.tsx
│   ├── news/
│   │   ├── NewsPanel.tsx
│   │   └── NewsItem.tsx
│   └── ui/
│       ├── LiveIndicator.tsx
│       ├── ErrorCard.tsx
│       ├── LoadingPulse.tsx
│       ├── ProvenanceStamp.tsx
│       ├── MercedesStar.tsx         ← SVG component (chrome gradient)
│       └── AmgLogo.tsx              ← SVG component (speed stripes)
├── hooks/
│   ├── useMarketData.ts
│   ├── useMarketplaceData.ts
│   └── useNewsData.ts
├── lib/
│   ├── queryClient.ts
│   ├── rssParser.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── public/
│   └── logos/                       ← SVG brand assets
├── src-tauri/                       ← Tauri stub (future)
│   └── tauri.conf.json
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 4. Data Sources

### 4.1 Source A — Share Market Performance (Real)
- **Endpoint:** Yahoo Finance unofficial API — `https://query1.finance.yahoo.com/v8/finance/chart/MBG.DE`
- **Ticker:** `MBG.DE` (Mercedes-Benz Group AG on Frankfurt XETRA)
- **Fields exposed:** Last price (EUR), daily change (EUR + %), day high, day low, 52W high, 52W low, market cap, volume
- **India context:** INR equivalent calculated server-side using EUR/INR rate (also from Yahoo Finance: `EURINR=X`)
- **Poll interval:** 30 seconds via TanStack Query `refetchInterval`
- **Abort:** AbortController passed to every fetch; cancelled on brand-switch or unmount
- **Fallback:** If endpoint errors, MarketPanel isolates to `ErrorCard` — other panels continue

### 4.2 Source B — Marketplace Telemetry (Demo Mode, India)
- **Status:** No public free API exists for Indian automotive marketplace data
- **Implementation:** Server-side demo data seeded with realistic India values, refreshed with minor variance each poll to simulate liveness
- **Fields:** Live listings count, average listing price (₹), days-on-market average, VAHAN registration count, registrations by state (MH, KA, DL, TN, TS, GJ)
- **Label:** Every sub-panel carries a visible "Demo Data" gold badge + provenance stamp: `Source: VAHAN · CarDekho India · Market Intelligence Composite`
- **Future swap:** Replace demo handler with real CarDekho / VAHAN API call — 10-line change in `marketplace/route.ts`
- **Poll interval:** 5 minutes

### 4.3 Source C — Live News Stream (Real)
- **RSS feeds (India-specific, free, no auth):**
  - Autocar India: `https://www.autocarindia.com/feed`
  - ET Auto: `https://auto.economictimes.indiatimes.com/rss/topstories`
  - Overdrive India: `https://www.overdrive.in/feed/`
  - BS Motoring: `https://www.bsmotoring.com/rss.xml`
- **Parsing:** `fast-xml-parser` on the server — zero client-side XML
- **Fields:** Original headline (unedited), publisher name, ISO timestamp (displayed as IST), raw text snippet (first 200 chars, unedited), direct outbound link to original article
- **Constraint:** No summarisation, no AI processing. Text rendered verbatim.
- **Poll interval:** 2 minutes
- **Per-source color badges:** Autocar (amber), ET Auto (green), Overdrive (blue), BS Motoring (gold)

---

## 5. State & Data Management

### 5.1 TanStack Query
- Single `QueryClient` in `providers.tsx` with `staleTime: 0` (always refetch on mount)
- Each panel has its own query key: `['market', brand]`, `['marketplace', brand]`, `['news', brand]`
- Brand switching invalidates all three queries instantly
- `refetchInterval` set per source (30s / 5min / 2min)

### 5.2 AbortController
- Each API route fetch wrapped in `AbortController`
- Passed via `signal` to `fetch()`
- TanStack Query's `signal` prop forwarded from `queryFn` — auto-cancels in-flight requests on query invalidation or component unmount

### 5.3 Error Isolation
- Each panel (`MarketPanel`, `MarketplacePanel`, `NewsPanel`) has independent error boundary
- On error: panel shows `ErrorCard` with "External Connection Interrupted" + last-fetched timestamp
- Other panels continue functioning independently
- Errors do not propagate up

---

## 6. Animation System (Framer Motion)

| Animation | Trigger | Spec |
|---|---|---|
| Connecting overlay | Page load | Mercedes star pulses, progress bar fills, fades out after 1.6s |
| Top bar slide-down | Mount | `translateY(-52px → 0)` spring, 500ms |
| Scan line | Market panel mount | Single horizontal sweep, 1.4s |
| Panel entrance | Mount, staggered | Left: `translateX(-24px → 0)`, Right panels: `translateX(24px → 0)`, 700ms spring |
| Metric tile reveal | Mount, staggered | `translateY(6px → 0) + opacity`, 70ms between each |
| Price count-up | Data load | `0 → €58.42` ease-out cubic, 950ms |
| INR equivalent | Alongside price | Updates in sync with price count-up |
| Marketplace card scale | Mount | `scale(0.97 → 1)`, staggered 80ms |
| Region progress bars | After mount +400ms | `width: 0 → N%`, 1.2s spring |
| News item slide-in | Mount, staggered | `translateX(12px → 0) + opacity`, 120ms between items |
| Live price tick | Every 8s | Price flashes green (up) or red (down), 600ms fade |
| Watermark star | Continuous | Slow rotation 80s/rev |
| Card hover | Hover | `translateY(-2px)` + shadow deepening, spring |
| News item hover | Hover | Left border appears silver, padding-left springs from 13px → 18px |

---

## 7. Component Contracts

### `MercedesStar` (`size`, `variant`)
- `variant: 'chrome'` — full radial gradient (brand identity row, loading overlay)
- `variant: 'outline'` — stroke only (pill icon, watermark)
- SVG, no external dependency, always renders

### `AmgLogo` (`height`, `color`)
- Three diagonal parallelograms + "AMG" bold text
- Purely SVG, no font dependency

### `ErrorCard` (`source`, `lastFetched`)
- Shown when any panel's query errors
- Displays: "External Connection Interrupted" + source name + last successful fetch time
- Does not affect sibling panels

### `ProvenanceStamp` (`source`, `live`)
- Fixed footer on every data panel
- `live=true` → green animated dot + source label
- `live=false` (demo) → gold static dot + "Demo Data" badge

### `LiveIndicator`
- Double ripple rings + core dot
- Used in TopBar and NewsPanel header

---

## 8. Brand Switcher

- **Phase 1 (this build):** Mercedes India active, all others disabled
- **Disabled pills:** BMW India (blue), Stellantis (red), Hyundai India (navy) — rendered at 50–60% opacity, no click handler
- **Architecture:** `activeBrand` state lives in `page.tsx`, passed as context; all three query keys include brand — switching brand invalidates all queries and triggers AbortController cancellation

---

## 9. India Scope

All data is scoped to India:
- Stock: EUR price + real-time INR equivalent (`EUR/INR` from Yahoo Finance)
- Market cap displayed in both EUR and ₹ Crore
- Marketplace: listings, prices, registrations all in Indian context (₹, VAHAN, state codes)
- News: only India-focused RSS feeds (Autocar India, ET Auto, Overdrive, BS Motoring)
- Clock: IST (UTC+5:30) always shown in top bar
- Region breakdown: MH, KA, DL, TN, TS, GJ

---

## 10. Environment Variables

```bash
# .env.local.example
YAHOO_FINANCE_BASE=https://query1.finance.yahoo.com   # no key needed (unofficial)
NEWS_CACHE_TTL_S=120                                   # 2 min cache for RSS
MARKET_CACHE_TTL_S=30                                  # 30s cache for stock
# Future: add CarDekho API key here when partnership sourced
# CARDEKHO_API_KEY=
# VAHAN_API_KEY=
```

---

## 11. Error Handling Rules

1. Yahoo Finance down → MarketPanel shows `ErrorCard`, price shows "N/A — Source Interrupted"
2. RSS feed down for one source → that source's items omitted, others still shown
3. All RSS feeds down → NewsPanel shows `ErrorCard`
4. Demo marketplace route always succeeds (no external dependency)
5. Network timeout: 8s AbortController timeout on all external fetches

---

## 12. Tauri Readiness

`src-tauri/tauri.conf.json` created with:
- `devUrl: "http://localhost:3000"`
- Window title: "MSXI India Intelligence"
- Window size: 1440×900 min
- No decorations (custom titlebar)
- `allowlist` for HTTP requests to Yahoo Finance and RSS domains

Actual Tauri wrapping deferred to a future phase — the web app ships first.

---

## 13. Out of Scope (This Build)

- Authentication / login
- BMW, Stellantis, Hyundai data wiring (pills are stubs only)
- Historical charts / sparklines
- PDF export
- CarDekho real API (pending partnership)
- Push notifications
- Electron packaging
