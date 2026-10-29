# MSXI India Intelligence: product, architecture and security review

**Date:** 29 Oct 2026 · **Codebase:** `~/Desktop/Projects/MSXI - NEWS PORTAL` (about 3,900 lines, not a git repo)

**Evidence key:** **[V]** = VERIFIED (I saw it in the code or tested it live from your Mac on 29 Oct 2026). **[A]** = ASSUMED (inferred, needs your confirmation).

---

## 0. Ten-line summary

1. **What it is:** a nicely designed Next.js 14 dashboard. It shows **real RSS news headlines** and a parent-company market cap. **Every sales, state, review and "culture" number is hardcoded** in one file, `config/telemetry.config.ts`. [V]
2. **Rating: 3/10 as a product, 6.5/10 as a UI or portfolio piece.** The polish is real. The data proposition is not there yet.
3. **Strength 1:** a clean, cinematic UI with a sensible component structure, TanStack Query and per-panel error states.
4. **Strength 2:** the news aggregator is real and works. It merges, sorts and removes duplicates server-side.
5. **Strength 3:** you have real domain access (automotive services work), and you clearly know which data matters: VAHAN, FADA and state-level registrations.
6. **Risk 1 (critical):** the UI labels fabricated data as **"VAHAN & FADA VERIFIED"**, **"Verified Reviews"** and **"Active VAHAN Stream"**, and it shows **invented quotes attributed to real, named journalists**. Showing this to a paying customer is misrepresentation.
7. **Risk 2 (critical):** the app is **branded as an MSXI internal tool**: MSXI logo, "MSX International Internal Use Only", "MSXI Consultant", and a spec that says it was built for MSXI consultants. MSXI may have a strong claim to it.
8. **Risk 3 (high):** the data plumbing is fragile. **Only 3 of 12 India feeds and 8 of 15 global feeds returned articles today.** Yahoo returned 429 and Stooq now serves a bot challenge, so the market cap is showing a **hardcoded fallback marked as live**.
9. **The real market:** monthly brand-wise retail data is **free** from FADA within about 6 days of month-end. Paid India data tools already exist at **about ₹35–40k per year** (EVreporter, Autobei/ACG). Anything "live" has to be differentiated by **analysis**, not by access.
10. **Single most important next step:** before writing any more code, **read your MSXI contract and talk to HR** about IP and side work. Until that's clear, nothing you build on this codebase is safely yours to sell.

---

## STEP 1: What the app actually does today

### 1.1 Stack and structure [V]

| Layer | What's there | Evidence |
|---|---|---|
| Framework | Next.js **14.2.5** App Router, React 18.3 | `package.json:18-20` |
| UI | Tailwind 3, Framer Motion 11, lucide icons. Recharts is installed but **unused** | `package.json` |
| State | Zustand (persists only brand and theme to localStorage) | `lib/store.ts:30-33` |
| Data fetching | TanStack Query, `staleTime: 0`. Market polls every 30s, news every 120s | `lib/queryClient.ts:7`, `hooks/useMarketData.ts:13`, `hooks/useNewsData.ts:14` |
| Server | 7 API routes in `app/api/*` | see below |
| Hosting | Netlify (site id `6409aafc…`); the `.netlify` build folder is present | `.netlify/state.json`, `netlify.toml` |
| Database / auth / payments | **None.** `.env.example` has commented-out Supabase/YouTube/Google keys | `.env.example:2-5` |
| Tests | **None** | — |

**How the parts connect:** the pages under `app/(dashboard)/*` call 2 hooks (`useMarketData` and `useNewsData`), which call `/api/market` and `/api/news`. `/api/market` merges a live-ish stock price with the hardcoded `BRAND_TELEMETRY`. `/api/states`, `/api/sentiment`, `/api/culture` and `/api/compare` just return slices of the same hardcoded object, and **no page calls them**. The pages read everything through `/api/market` instead. [V]

### 1.2 Where data comes from, where it's stored, how often it refreshes

| Data shown | Real source | Stored | Refresh | Status |
|---|---|---|---|---|
| News headlines and snippets | 27 RSS feeds (`config/feeds.config.ts:12-45`) | In-memory `Map`, 60s (`app/api/news/route.ts:7-8`) | Client polls 2 min | **Real** [V]. Only about 11/27 feeds returned articles today [V] |
| Parent market cap (EUR and ₹) | Yahoo unofficial chart API, then Stooq CSV, then **hardcoded price** | In-memory `Map`, 30s (`app/api/market/route.ts:17-18`) | Client polls 30s | **Effectively fake today**: Yahoo gave 429 and Stooq a JS bot-wall, so the fallback at `route.ts:97` is shown [V from my Mac; Netlify's IP may differ, A] |
| EUR/INR | Same as above, fallback `91.5` | — | — | Same |
| Outstanding shares | Hardcoded `SHARES` | `app/api/market/route.ts:12-15` | Never | Static, and probably stale given buybacks [A] |
| Monthly sales, 6-month trend, YoY, luxury share, annual run-rate | **Hardcoded** | `config/telemetry.config.ts:6-17, 75-86` | Never | **Fabricated** [V] |
| Top 5 states and registrations | **Hardcoded** | `telemetry.config.ts:18-24, 87-93` | Never | **Fabricated**, labelled "VAHAN" [V] |
| Owner rating, review count, pros/cons | **Hardcoded** | `telemetry.config.ts:25-36, 94-105` | Never | **Fabricated**, labelled "verified owners, Team-BHP & CarWale" [V] |
| "YouTube expert reviews" | **Hardcoded quotes attributed to real journalists**, `videoUrl: 'https://youtube.com'` | `telemetry.config.ts:37-62, 106-131` | Never | **Fabricated** [V] |
| Car culture, enthusiast index | **Hardcoded** | `telemetry.config.ts:63-71, 132-140` | Never | Opinion presented as an index [V] |
| Stock chart on `/market` | **Hardcoded array, same for BMW and Mercedes** | `app/(dashboard)/market/page.tsx:14-19` | Never | Labelled "LIVE TICKER CHART" (`:61`) [V] |

**A reality check on the fabricated numbers:** the app says Mercedes India's annual run-rate is 17,408 with YoY +9.8%, and BMW's is 14,172 with +11.2% (`telemetry.config.ts:15-16, 84-85`). Public figures for **CY2025: Mercedes-Benz India 19,007 units (down about 3%)**, and **BMW Group India 18,001 (BMW 17,271 + MINI 730, up 14%)**. So the hardcoded numbers are wrong in level and **wrong in direction** for Mercedes. Any dealer would catch this in the first meeting.

### 1.3 Finished vs half-built vs placeholder

| Finished | Half-built | Placeholder / fake |
|---|---|---|
| News aggregation and region filter | Market-cap fetch (fallbacks hide failures) | Settings page: Save does nothing (`settings/page.tsx:12-15`) |
| Brand switcher (2 brands) | `/api/news` pagination and `sources` params (the client never uses them) | Bell icon and badge (`TopBar.tsx:41-44`) |
| UI shell, sidebar, IST clock | `/api/health` (DB status is the hardcoded `'ok'`, `health/route.ts:8`) | `/market` chart; "Live Connection Healthy" (`market/page.tsx:134`) |
| | | Stellantis/Hyundai/Tata "Coming soon" |
| | | Unused API routes: states, sentiment, culture, compare |
| | | User identity hardcoded as "Soham Mondal · MSXI Consultant" (`Sidebar.tsx:79-80`) |

**Things I couldn't determine. Please tell me:**
- Is the Netlify site **live and public** right now, and at what URL? Is it password-protected?
- Was any of this built **on MSXI time, an MSXI laptop, or for an MSXI request**? The spec (`docs/superpowers/specs/…design.md:10`) says "for MSXI consultants to use during live OEM meetings."
- You left target users and budget as placeholders. I've assumed **"dealer/supplier sales and strategy people in India"** and **"under ₹2,000/month."**

---

## STEP 2: Evaluation

### 2.1 Product: problem, users, differentiation

**The problem you describe** ("one place for live sales, brand data, news, current affairs") is real but **already solved, cheaply or for free**, at the level the app works at:

| Need | Who already serves it | Price |
|---|---|---|
| Monthly OEM-wise retail market share | **FADA** monthly press release with OEM annexure (from VAHAN) | Free |
| Monthly model-wise sales write-ups | Autopunditz, Rushlane, Autocar India, Team-BHP sales threads | Free |
| Industry news | ETAuto, Autocar Professional, Google News alerts | Free (some paywalled) |
| Monthly / state-wise data, Excel | EVreporter (EV only) | ₹35,000/yr + GST |
| Indian auto market subscription | Autobei / ACG | from ₹39,999/yr |
| Global OEM / production / pricing data | MarkLines, JATO, S&P Mobility | Enterprise pricing, far beyond your budget [A] |

**Honest verdict: the current angle (news + headline sales numbers + brand vibes) is not differentiated.** A two-brand luxury dashboard with stock market cap is also aimed at the wrong buyer. Indian dealers and suppliers don't make decisions on Mercedes-Benz Group AG's market cap in EUR.

**Where a differentiated angle *might* exist** (to be validated, not built):
- **Granularity plus interpretation for a narrow niche.** For example: "RTO / district-level registration trends for [segment] in [3 states], with a 1-page 'what changed and why' every week." FADA gives national OEM share; very few give *district-level movement explained* to a regional dealer group or a component supplier's sales team.
- **Your edge** would be the analysis and the speed, not the data pipe.

### 2.2 Feature ratings

| Feature | Rating | Why |
|---|---|---|
| News stream (brand / general / region) | **Weak-to-OK** | Real data. But 16/27 feeds are dead or blocked, India coverage is mostly 3 feeds, keyword matching is noisy (below), and the expanded article collapses whenever IDs regenerate |
| Brand keyword filter | **Weak** | `'eq'`, `'sl'`, `'ix'`, `'m2'` (`config/brands.config.ts:18,22,49-50`) give false positives. `'luxury car india'` is in **both** brands (`:29,:57`). BMW includes Rolls-Royce and MINI (`:46`) |
| Market cap card | **Broken in practice** | It falls back to a fixed price while still showing as "live" (`app/api/market/route.ts:96-98`, `MarketPanel.tsx:266`) |
| Monthly sales and trend | **Broken (fabricated)** | `telemetry.config.ts` |
| State leaderboard | **Broken (fabricated)** | Labelled "VAHAN", but it isn't VAHAN data |
| Sentiment / reviews | **Broken (fabricated, with false attribution)** | — |
| Car culture | **Weak** | Static editorial; the "enthusiast index" has no method |
| Compare | **Broken** | Static, plus an "MSXI Consultant Consensus Verdict" (`compare/page.tsx:96`) |
| Settings | **Broken** | Does nothing |
| Search (topbar) | **Weak** | Only the News page search filters anything, and only headlines |
| UI / visual design | **Strong** | Genuinely good. Desktop only, though: a fixed 55/45 grid and `min-h-[800px]` (`app/(dashboard)/page.tsx:11`) |

**Missing features users would expect:** real monthly brand × state × fuel data; a time series longer than 6 months; segment and model level; CSV/Excel export; a source and "as-of date" on every number; alerts ("X's share in Karnataka dropped 3 pts"); mobile view; login and saved views; more than 2 brands (the mass market is where the dealers are).

### 2.3 Gaps

- **Product:** wrong buyer (luxury-parent stock), no defined user, no recurring "job" the app does better than FADA + WhatsApp.
- **Data:** no real sales data at all; nothing historical; no storage (all in memory), so no trends can ever be computed.
- **UX:** desktop only; fake "Live" indicators everywhere train users to distrust everything; no dates on numbers.
- **Reliability:** an in-memory cache on serverless means every cold start fans out 27 fetches with 8s timeouts (`lib/rssParser.ts:21`); a total feed failure is **masked** by a fake "Live feed connecting…" item (`app/api/news/route.ts:52-61`); the market data silently falls back to fixed prices.

### 2.4 Promises you CAN keep today

- "Aggregates automotive news headlines from about 10 Indian and global publications, with links to the originals, refreshed roughly every few minutes."
- "Shows the parent group's approximate market cap when the price source is reachable." (Only once failure is shown honestly.)
- "A design prototype of an India auto intelligence dashboard." That's it.

### 2.5 Promises you CANNOT keep

| Claim currently on screen | Reality |
|---|---|
| "OFFICIAL OEM BRIEFING · LIVE INTEL · VAHAN & FADA VERIFIED" (`MarketPanel.tsx:54`) | Nothing comes from VAHAN or FADA |
| "Verified Reviews", "142 verified owners surveyed on Team-BHP & CarWale" (`MarketplacePanel.tsx:32,69`) | Invented |
| Quotes by named journalists (`telemetry.config.ts:40,48,56,109,117,125`) | Invented. **This is the most dangerous item in the codebase** |
| "Active VAHAN Stream" (`states/page.tsx:74`) | Static object |
| "LIVE TICKER CHART" (`market/page.tsx:61`) | Static array |
| "Live" in the footer, always (`Footer.tsx:8`) | Hardcoded `live={true}` |
| "Aggregating 29 sources" (`news/page.tsx:96`) | 27 configured, about 11 working |
| **"Live sales data" in general** | Indian sales data is **monthly** (FADA, OEM wholesale). VAHAN registrations update about daily but **lag the sale**, exclude some states or RTOs [A], and differ from the OEM's wholesale "sales". Nothing about Indian car sales is "live" in the stock-ticker sense |

### 2.6 Scope and potential (side business, 4–5 h/week)

- **Best case (about 10–15% likely [A]):** within 6–9 months, a paid weekly brief or report for a niche with 15–40 paying individuals or 2–4 small B2B clients, earning ₹15k–60k/month. The app becomes the back-office tool you use to produce it, not the thing you sell.
- **Most likely:** you get positive "this looks amazing" feedback and almost no payments. The product drifts, feeds rot, and you stop after 3–4 months. Learning value is high; income about ₹0–5k/month.
- **Worst case:** you show or sell the current version. A customer acts on fabricated numbers, a journalist or publication spots their name on a fake quote, or MSXI asserts IP or conflict of interest. That could cost you reputation and potentially your job.

---

## STEP 3: Data sources

| Source | Provides | Update frequency | Cost | Legal / ToS | Reliability and gotchas |
|---|---|---|---|---|---|
| **FADA monthly retail press release** (fada.in → press releases) | Category totals and **OEM-wise retail share** (from VAHAN), YoY | Monthly, about 6th of the next month | Free | Public PDF. Quoting with attribution is fine. **Republishing full tables inside a paid product: ask FADA in writing** | Very reliable for national OEM share. PDF parsing is fiddly. Not state × brand. Historically excluded states not on VAHAN 4 |
| **VAHAN public dashboard** (vahan.parivahan.gov.in/vahan4dashboard) | Registrations by maker, state, RTO, fuel, class | Roughly daily | Free | **No official API; no explicit permission for automated scraping.** Access rules have been shifting (see links). Keep scraping low-rate and personal; get legal advice before selling derived data | Rich, but the UI is JS-heavy and breaks scrapers. Some states/RTOs lag or are missing [A]. **Registration ≠ sale date** |
| **India Data Portal / data.gov.in** VAHAN datasets | Historical registration datasets | Irregular | Free | Usually under the Government Open Data License (commercial use with attribution allowed). **Check each dataset's licence** | Good for history and backfill; not timely |
| **OEM press releases / investor reports** | Quarterly or annual brand totals (luxury OEMs report like this) | Quarterly / annual | Free | Public, quote with attribution | Authoritative but coarse |
| **SIAM** | Industry wholesale (dispatch) numbers | Monthly | Summaries free; detailed data paid | Paid data has licence restrictions | Not all luxury OEMs report monthly to SIAM [A] |
| **RSS feeds** (Autocar India, MotorBeam, Carscoops, etc.) | Headlines, snippets, links | Minutes to hours | Free | Showing headline + short snippet + link is common practice. **Don't store or republish full text**. Check each site's terms. **Don't spoof a browser User-Agent** (`lib/rssParser.ts:7`); identify your bot honestly | 16/27 feeds dead or blocked today. ET Auto blocks (403). Prune and monitor |
| **Google News RSS search** (per brand) | Broad headline coverage | Minutes | Free | Personal/non-commercial use. Treat as a discovery feed, not a product backbone | Good coverage boost for India brand news |
| **Yahoo Finance (unofficial)** | Prices | Real-time-ish | Free | No public API; terms restrict automated and commercial use | 429 today. **Drop it** |
| **Licensed market-data API** (e.g. EODHD, Twelve Data, Alpha Vantage paid tiers) | EOD/intraday prices for MBG.DE, BMW.DE, Tata Motors, M&M, Maruti | EOD is enough | Free to low tiers; check **commercial-use clauses** | Licensed | Only worth it if your buyer cares about stocks. Indian dealers mostly don't |
| **Paid: EVreporter, Autobei/ACG** | Monthly and state-wise Excel | Monthly | ₹35–40k/yr | Licence terms forbid resale | Useful to *benchmark* quality; not to resell |
| **Team-BHP / CarWale reviews / YouTube** | Opinions | — | — | Scraping forum content to sell is legally risky. The **YouTube Data API** is legal for metadata (title, link, views), and you'd link out rather than quote | Never invent quotes. If you show reviews, embed or link the real video |

**Legally risky — flagged:** (1) scraping VAHAN for resale without permission; (2) republishing paid or press-release tables wholesale; (3) Yahoo scraping for a commercial product; (4) scraping forums for "sentiment"; (5) using **OEM logos** (`public/logos/*`) in a paid product. Writing brand names in plain text is fine. Logos imply endorsement, so drop them.

---

## STEP 4: Security and reliability

No secrets are in the code or env (checked `.env.local`, `.env.example`, all source) [V]. The app collects no user personal data today [V].

| # | Severity | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | **Critical** (integrity / legal) | Fabricated data presented as verified, including fake quotes from named journalists | `config/telemetry.config.ts`; labels in `MarketPanel.tsx:54`, `MarketplacePanel.tsx:32,69`, `states/page.tsx:27,71-74` | Delete `youtubeReviews`, sentiment and culture data now. Replace other numbers with real sourced data or a big **"SAMPLE DATA — NOT REAL"** banner. Add `source` and `asOf` fields to every metric |
| 2 | **Critical** | `next@14.2.5`: `npm audit` reports a **critical** advisory set (cache poisoning, authorization bypass, Server Components DoS, request smuggling, and more) | `npm audit` [V] | Upgrade to the latest patched 14.2.x at minimum (`npm i next@14 eslint-config-next@14`), or move to the current major. Re-run `npm audit`. Also bump `fast-xml-parser` (moderate) and fix `nanoid` (high, transitive) |
| 3 | **High** | Silent fallbacks shown as "live": the market cap uses a hardcoded price, and news returns a fake "connecting…" item when every feed fails | `app/api/market/route.ts:96-98`; `app/api/news/route.ts:52-61`; `Footer.tsx:8` | Return `{stale: true, asOf}` and show "Last updated X ago" or an ErrorCard. Never render `live` unless the data is <N min old from a real fetch |
| 4 | **High** | **Unvalidated `brand` param crashes the route**: `?brand=foo` makes `config` undefined, then `config.newsKeywords` throws a 500 | `app/api/news/route.ts:12,18,27` | Validate against `Object.keys(BRAND_CONFIGS)`; return 400. Use `zod` for all query params |
| 5 | **High** | Unsafe outbound links: `item.url` comes from third-party RSS and goes straight into `href`. A `javascript:` URL from a compromised feed would run on click (React 18 only warns) | `lib/rssParser.ts:49-51` → `NewsPanel.tsx:232`, `news/page.tsx:60` | Accept only `http:`/`https:` (`new URL(link).protocol`); otherwise drop the item |
| 6 | **High** | One bad date drops a whole feed: `new Date(pubDate).toISOString()` throws on invalid dates, the `catch` returns `[]` | `lib/rssParser.ts:60,65-66` | Parse defensively; on invalid, fall back to fetch time and flag it |
| 7 | **Medium** | No rate limiting or abuse protection. Each cache miss fans out 27 external fetches. Anyone can hammer `/api/news`, and your server then hammers 27 publishers and Yahoo | `app/api/news/route.ts:28-30` | Move fetching to a **scheduled job** (Netlify Scheduled Function or GitHub Actions cron every 15–30 min). Store the results; API routes only read storage. Add a basic per-IP limit |
| 8 | **Medium** | In-memory caches on serverless don't persist across instances and cold starts. Users get slow first loads (up to 8s) and inconsistent data | `news/route.ts:7`, `market/route.ts:17` | Persist to Supabase / Netlify Blobs / a JSON file in the repo updated by cron |
| 9 | **Medium** | No storage means no history, no backups and no audit trail of what was shown when | — | Store dated snapshots (one row per source × date). Back up the DB weekly (Supabase PITR or a `pg_dump` cron) |
| 10 | **Medium** | Stooq fallback is broken. It now returns a JS bot challenge [V]; even when it worked, `lines[0]` is likely the **oldest** row in the full-history CSV [A] | `app/api/market/route.ts:56-62` | Delete it. Use one licensed source or drop stock data |
| 11 | **Medium** | Spoofed Chrome User-Agent and `Referer: finance.yahoo.com` when scraping | `lib/rssParser.ts:7`, `market/route.ts:6-9` | Use an honest UA (`MSXIBriefBot/0.1 (+contact email)`). Spoofing weakens any good-faith argument |
| 12 | **Low** | Unstable IDs (`${source}-${idx}-${Date.now()}`) re-key every item on cache refresh, so open items collapse and animations replay | `lib/rssParser.ts:56` | Hash the URL or guid for the id |
| 13 | **Low** | `/api/health` reports `database: 'ok'` with no database, and pings a feed without timeout handling or a UA | `app/api/health/route.ts:8,13` | Report real checks or remove |
| 14 | **Low** | Inconsistent response shapes (array vs `{data,pagination}`) | `news/route.ts:53 vs 64` | One shape always |
| 15 | **Low** | Duplicate config (`lib/brandConfig.ts` duplicates `config/brands.config.ts`), duplicate India-source list (`NewsPanel.tsx:21-25` vs `feeds.config.ts` `region`), `Record<BrandId, any>` | — | Single source of truth; type the telemetry |
| 16 | **Low** | No logging or monitoring of feed health | — | Log per-feed status each cron run; a simple "feed health" table; email yourself when >30% of feeds fail |
| 17 | **Low** | `.claude/settings.local.json` allows `Bash(curl *)` | `.claude/settings.local.json:5` | Fine locally; don't commit it if you open-source |

**Authentication:** none exists. That's fine for a public news page, **not fine** for anything paid or anything carrying "Confidential / Internal Use Only" labels (`Footer.tsx:11-13`). If the Netlify site is public, those labels plus the MSXI logo are themselves a problem. When you add paid access, use a managed auth (Supabase Auth or Clerk); don't roll your own.

**Indian data protection (DPDP Act 2023 + DPDP Rules 2025, notified Nov 2025):** today you hold no personal data, so there are no obligations yet. **As soon as you collect emails (newsletter, login), you're a Data Fiduciary.** You'll need a clear notice (what, why, how long), consent, a way to withdraw or delete, reasonable security, and breach handling. Most obligations phase in by **about May 2027**. Build them in from day one: they're cheap (a privacy page, unsubscribe/delete links, encrypted managed DB, no unnecessary fields). Use an email provider that handles unsubscribe.

---

## STEP 5: Legal and practical risks

### 5.1 Data licensing and scraping
- Safe-ish: headlines + links from RSS, FADA/OEM press figures **quoted with attribution**, OGD-licensed datasets.
- Grey: automated VAHAN scraping, especially for resale. Get permission or legal advice before charging for it.
- Avoid: Yahoo scraping commercially, forum scraping, republishing paid data, **OEM logos**, and **any invented quote**.

### 5.2 Accuracy disclaimer (put this on every page and every report)
> "Figures are compiled from public sources (FADA, VAHAN dashboard, company releases) as of [date]. Registration data differs from manufacturer wholesale figures and may be incomplete for some states. This is not investment, legal or business advice. Verify with the original source before making decisions. Errors: [email]."

Also: put a visible **"Source · as of date"** on every number, a **methodology page**, and a **corrections log**.

### 5.3 Your MSXI employment: check these before selling anything
This matters more than usual, because the **codebase is explicitly an MSXI tool**: the name "MSXI India Intelligence" (`app/layout.tsx:10-11`), the MSXI logo (`Sidebar.tsx:24`), "MSXI Consultant" (`Sidebar.tsx:80`), "MSX International Internal Use Only" (`Footer.tsx:13`), and the spec's stated purpose (`docs/…design.md:10`).

Look in your appointment letter, employee handbook, IT policy and code of conduct for:
1. **IP / invention assignment.** Does it cover work "related to the company's business" or made "during employment", even off-hours? An automotive data tool at an automotive services company is very likely "related".
2. **Use of company resources.** Was any of it built on an MSXI laptop, network, time or Claude licence? Did any MSXI or client data (e.g. BMW/Mercedes work) inform it? If yes, MSXI's claim is strong.
3. **Moonlighting / outside work clause.** Does it require **prior written approval** for any paid side work?
4. **Confidentiality.** You must not use client names, client data, pricing or internal methods. Your work on OEM programs and parts benchmarks is exactly that kind of material.
5. **Conflict of interest / non-solicit.** Selling intelligence to OEMs, dealers or suppliers who are (or could be) MSXI clients is the most likely conflict.
6. **Post-employment non-compete.** These are generally unenforceable in India (Indian Contract Act s.27). **Restrictions during employment are enforceable**, though, and that's your situation.

**Two clean paths:**
- **(a) Pitch it internally.** Offer it to your MSXI manager as an internal tool. It's low risk and good for your career, but it stops being your business.
- **(b) Get written HR approval (an NOC) for a side project that doesn't serve MSXI clients.** Then **rebuild clean**: new repo, new name, no MSXI branding, no logos, nothing from work, and a dated git history from that point on.

Ask: HR or your reporting manager first (in writing), then a lawyer for a 30-minute contract review (roughly a few thousand rupees [A]).

### 5.4 Charging money in India (ask a Chartered Accountant; budget for one consult)
- **Start as a sole proprietor** using your PAN; no company needed initially. Udyam (MSME) registration is free and optional but helps with bank and gateway onboarding.
- **GST:** registration is generally required once service turnover crosses **₹20 lakh/yr** (₹10 lakh in some special-category states). Exports of services and certain interstate cases have their own rules. Ask the CA for your case.
- **Income tax:** side income is added to your salary. You'll likely file ITR-3 or ITR-4 (presumptive), and may owe **advance tax** quarterly.
- **Payments:** Razorpay, Cashfree or Instamojo accept individuals and proprietors (PAN + bank + KYC). They require a site with **Terms, Privacy, Refund/Cancellation and Contact pages**. For the first 5 customers, a UPI or bank transfer with a simple invoice is fine.
- **Who to ask:** a CA (GST and tax), a lawyer (employment contract and terms of service), MSXI HR (approval).

---

## STEP 6: Improvements, prioritised

Effort: **H** = hours, **D** = days of your 4–5 h/week, **W** = weeks. Cost is incremental per month.

### 6.1 Fix before showing anyone

| # | Task | Effort | Impact | Cost |
|---|---|---|---|---|
| 1 | Resolve the MSXI IP/side-work question (Step 5.3) | H (reading) + days of waiting | **High** | ₹0 to lawyer fee |
| 2 | Delete fake quotes, reviews and culture; banner or remove every hardcoded metric; remove "VERIFIED", "Live" and "Confidential" labels | 2–3 H | **High** | ₹0 |
| 3 | Remove MSXI branding and OEM logos; rename the product | 1–2 H | **High** | ₹0 |
| 4 | Upgrade Next (critical CVEs), run `npm audit fix` | 1–2 H | High | ₹0 |
| 5 | Validate params, sanitize URLs, honest stale/error states, fix the date crash | 3–4 H | Med-High | ₹0 |
| 6 | Prune dead feeds; add Google News per-brand search; per-feed health log | 2–3 H | Medium | ₹0 |

### 6.2 Features (only after validation, Step 7)

| Feature | Effort | Impact | Cost | Note |
|---|---|---|---|---|
| **Real monthly data pipeline**: FADA PDF → table (manual entry first, script later) | D | **High** | ₹0 | The core of any real product |
| Persistent storage + cron fetch (Supabase free tier or JSON-in-repo + GitHub Actions) | D | High | ₹0 (free tiers) [A] | Unlocks history, trends, reliability |
| **Weekly brief** (email/PDF): 5 numbers that moved + 5 stories that matter + "so what" | D (template), then about 2 H/week | **High** | ₹0–₹1k (email tool free tiers) | This is likely the product |
| State / district view from VAHAN (only after legal check) | W | High for regional buyers | ₹0 | Your most likely differentiator |
| Export CSV/Excel | H | Medium | ₹0 | Cheap, expected by B2B |
| Alerts (share change > X pts, new launch in segment) | D | Medium | ₹0 | Needs history first |
| Comparison tool (real data, N brands) | D | Medium | ₹0 | Replace the static Compare page |
| More brands / mass market | D | High | ₹0 | Dealers are mostly mass-market |
| Mobile layout | D | Medium | ₹0 | Execs read on phones |
| Auth + paid gating | D | Only once someone pays | ₹0–small | Don't build before then |

### 6.3 Using AI properly

**Good uses:**
- Classifying news by brand, segment and topic (launch / price / policy / EV / dealer). Replaces the brittle keyword regex.
- De-duplicating the same story across outlets.
- Drafting the **"what changed"** text from numbers *you supply*, with you editing before sending.
- Summarising a linked article in 2 lines **with a link**.

A small, cheap model is enough at this volume (e.g. Claude Haiku). Batch it in the cron job, not per page view. At a few hundred headlines a day the cost should be small, but check current API pricing [A].

**Unreliable uses — don't:**
- Generating or "estimating" any number.
- "Sentiment scores" from a handful of articles.
- Forecasting sales.
- Writing quotes.
- Anything presented without a source link.

**Rules:**
- AI text is always labelled "AI-summarised".
- AI never sees or outputs figures that aren't in its input.
- Spot-check 10% of outputs weekly.

### 6.4 Performance, testing, code quality

| Task | Effort | Impact |
|---|---|---|
| Move fetching off the request path (cron + storage) | D | High: fast pages, polite to publishers |
| Unit tests for `rssParser` (bad dates, Atom, single-item, `javascript:` links) and keyword matching | 3–4 H | Medium |
| One end-to-end smoke test (page loads, shows N items, no "Live" when stale) | 2 H | Medium |
| Delete unused routes, Recharts, the duplicate brand config; type `BRAND_TELEMETRY` | 1–2 H | Low-Med |
| `git init` now, with a first commit before you change anything | 10 min | High: you currently have no history |

---

## STEP 7: Making money

### 7.1 Models and realistic prices
These are estimates [A]. Validate by asking, not by assuming.

| Model | Price range (India) | Fit for you |
|---|---|---|
| **Weekly niche brief** (email/PDF) | Free tier → ₹300–1,000/month individual; ₹3–10k/month team licence | **Best fit**: low build, tests demand directly |
| **Custom monthly report** for one dealer group / supplier (state or district cuts + commentary) | ₹10k–50k per report or per month | Good, but needs real data access and MSXI clearance (client overlap) |
| Self-serve SaaS dashboard | ₹1–5k/month per seat | Poor fit now: high build and support load, competes with ₹35–40k/yr incumbents |
| White-label dashboards | ₹50k+ setup | Poor fit: enterprise sales cycle, conflicts with your job |
| Consulting | Hourly / project | **Likely direct conflict with MSXI**. Avoid while employed unless approved |

### 7.2 Cheapest test before building more
1. Pick **one niche + one region**, e.g. "used-car / multi-brand dealers in Bengaluru", "2W/EV dealers in Maharashtra", or "tier-2 component suppliers' sales heads".
2. Hand-make **one 1-page brief** in Google Docs from FADA + VAHAN dashboard + 5 headlines + your 3 "so-what" bullets. 3–4 hours.
3. Send it to **20–30 target people** on LinkedIn or WhatsApp. Ask: "Would you pay ₹500/month for this every Monday?" Better: **"First month ₹299, pay via UPI if you want it."**
4. **Signal = money, not compliments.** 3+ pre-payments in 3 weeks means continue. 0 means change the niche or the format.

### 7.3 First 5 paying users
- **Where:** LinkedIn (dealer principals, sales GMs, supplier BD managers), local dealer association groups, Team-BHP / industry forums (as a contributor, not spamming), your college alumni in auto OEMs and suppliers (outside MSXI's clients).
- **What to say:**
  > "Hi [name], I put together a 1-page Monday brief on [segment] registrations in [state]: which brands gained or lost share last week and the 5 stories that matter. Here's this week's (attached). If it's useful, it's ₹299 for the next 4 issues. Reply 'yes' and I'll send UPI details. If it's not useful, I'd love one line on what would make it useful."
- **Don't** mention MSXI. **Don't** pitch to MSXI's clients or contacts you met through work.

### 7.4 What NOT to do or spend on yet
- No paid data licences, no paid domain/branding exercises, no Tauri/desktop app (spec §12), no auth or payments integration, no more brands, no mobile app.
- No company registration, GST or trademark until you have revenue that requires it.
- No ads.
- Don't show the current version to any prospect.
- Don't sell anything until MSXI approval is clear.

---

## STEP 8: 30 / 60 / 90-day roadmap (about 4–5 h/week)

### Days 1–30: clean up and get permission (about 18 h)
- **Week 1:** `git init`; read your contract; email HR or your manager for clarity. Remove fake data, MSXI branding, logos and fake "Live" labels; upgrade Next.
- **Week 2:** Fix the security items (#4–6 in Step 4). Prune feeds. Add an honest "as of" on everything.
- **Week 3:** Hand-make brief #1 from FADA + VAHAN + news.
- **Week 4:** Send it to 20–30 people in **one** niche. Log every response.
- **Milestone:** a clean repo; a written answer from HR; brief #1 sent to 20+ people.
- **Success:** HR says OK (or OK with conditions), **and** 3+ people say "yes, I'd pay" or pre-pay.
- **Stop or pivot:** HR says no → offer it internally or keep it as a portfolio piece. 0 interested out of 20 → try one different niche before quitting.

### Days 31–60: deliver manually, automate only the pain (about 18 h)
- Send the brief **weekly, by hand** (about 2 h/week).
- Use the remaining 2–3 h/week to automate the most painful step: usually FADA → table, or news classification with a small AI model in a cron job, with storage.
- Collect UPI payments; issue simple invoices; write Terms/Privacy pages.
- **Milestone:** 4 consecutive weekly issues; history stored.
- **Success:** 5+ paying, under 2 cancellations, and you can produce an issue in ≤2 h.
- **Stop:** <3 paying after 8 issues → stop selling. Keep it as a portfolio project and write a case study.

### Days 61–90: decide what it is (about 18 h)
- If B2B interest appeared: do **one** custom report for a paying client (only if it's no MSXI conflict).
- Add the dashboard back **only** as the subscriber view of the brief's data (real numbers, sourced, dated), plus CSV export.
- Talk to a CA before revenue nears thresholds or when a company wants a GST invoice.
- **Milestone:** a pricing page; 1 B2B conversation.
- **Success:** ₹10k+/month recurring, or 1 B2B report sold, with ≤5 h/week effort. Continue for another 90 days.
- **Stop:** <₹3k/month and growth stalled → archive it, keep the portfolio piece, put the hours into your career. That's not a failure; your salary trajectory as an early-career engineer is worth more than a ₹3k side income.

---

## The 5 questions I most need you to answer

1. **Was any part of this built on MSXI time, an MSXI device, or at someone's request at MSXI?** And what exactly does your contract say about IP and outside work?
2. **Is the Netlify deployment public right now, and has anyone outside you (colleagues, clients, recruiters) seen it?**
3. **Who exactly is the first buyer?** Pick one: dealers (which segment, which state), component suppliers' sales teams, analysts, or investors. And what decision would they make with this on Monday morning?
4. **What's your monthly budget and your goal number?** (e.g. "₹2k/month cost, ₹20k/month income within a year")
5. **Do you have any legitimate access to data others don't** (outside MSXI): a dealer relative, an association contact, a regional network? That's the only thing that could make this genuinely differentiated.

---

## Sources (web research, 29 Oct 2026)
- FADA monthly retail press releases (OEM-wise annexure): [July 2026 release](https://www.fada.in/images/press-release/16a7445b80cd73FADA%20Releases%20July%202026%20Vehicle%20Retail%20Data.pdf), [FY2026/March 2026](https://fada.in/images/press-release/169d329fc83770FADA%20releases%20FY%202026%20and%20March%202026%20Vehicle%20Retail%20Data.pdf), [FADA first OEM retail share (Autocar Pro)](https://autocarpro.in/news-national/uptick-in-july-retail-sales-fada-releases-retail-market-share-for-first-time-56994)
- Actual CY2025 luxury sales: [Mercedes-Benz India 19,007, down 3% (Business Today)](https://www.businesstoday.in/amp/auto/story/mercedes-benz-india-sees-3-drop-in-sales-as-entry-luxury-portfolio-shrinks-511066-2026-01-15), [BMW Group India 18,001 (BMW press)](https://www.press.bmwgroup.com/india/article/detail/T0454848EN/unstoppable-high-performance-drive-bmw-group-india-delivers-record-breaking-annual-sales-with-high), [IANS](https://ianslive.in/bmw-group-india-clocks-highest-ever-car-sales-of-18001-units-in-2025--20260108182330)
- Competitor pricing: [EVreporter data plans](https://data.evreporter.com/pricing/), [Autobei/ACG subscription](https://www.autobei.com/autoreports/subscription/), [Segmenty India](https://www.segmenty.com/India.html), [Counterpoint](https://counterpointresearch.com/research_portal/automotive-subscription-services-in-india), [Autopunditz](https://www.autopunditz.com/post/indian-car-sales-figures-april-2016)
- VAHAN access and data-sharing: [IFF on NIC/MoRTH data sharing](https://internetfreedom.in/who-reads-your-vehicle-record-nic-gave-us-numbers-morth-gave-us-a-generic-webpage/), [IFF on VAHAN data sales](https://internetfreedom.in/less-than-2-for-your-name-and-home-address-how-vahan-and-sarathi-data-is-being-sold-online/), [Down To Earth on VAHAN data gaps](https://www.downtoearth.org.in/air/driving-on-broken-data-why-indias-clean-air-and-ev-push-cannot-outrun-vahans-cracks), [India Data Portal VAHAN dataset](https://ckandev.indiadataportal.com/dataset/vahan-vehicle-registrations), [Techenclave on NIC sharing ending](https://techenclave.com/news/items/iff-nic-says-vehicle-data-sharing-with-private-entities-ended-on-1-october)
- DPDP Rules 2025: [Wikipedia summary](https://en.wikipedia.org/wiki/Digital_Personal_Data_Protection_Rules,_2025), [S.S. Rana](https://ssrana.in/articles/meity-notifies-final-digital-personal-data-protection-rules-2025/), [KPMG guidance (PDF)](https://assets.kpmg.com/content/dam/kpmgsites/in/pdf/2025/11/dpdp-rules-2025-guidance-to-dpdp-act-implementation.pdf)
- Yahoo Finance unofficial API terms: [Scrapfly guide](https://scrapfly.io/blog/posts/guide-to-yahoo-finance-api), [Portfolio Performance forum: API discontinued](https://forum.portfolio-performance.info/t/yahoo-finance-api-discontinued/1724)
- Live checks I ran from your Mac: per-feed HTTP status and item counts for all 27 feeds; Yahoo chart endpoint returned **429**; Stooq returned a **JS proof-of-work challenge page**; `npm audit --omit=dev` showed **critical** for `next`, **high** for `nanoid`, and **moderate** for `fast-xml-parser`.
