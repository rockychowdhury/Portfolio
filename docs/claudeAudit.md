# Code Review Audit — `rockychowdhury/Portfolio` (Next.js 16 App Router)

**Repo:** github.com/rockychowdhury/Portfolio (`main`)
**Stack:** Next.js 16.2.3, React 19.2.4, Mongoose 9, Framer Motion 12, GSAP 3 + Lenis (smooth scroll), Tailwind 4
**Reviewed:** `app/`, `components/`, `sections/`, `lib/`, `middleware.ts`, `next.config.ts`
**Focus:** Server/Client component boundaries, data caching, async/main-thread work, scroll performance (freeze/shake/jank/frame drops), preload & re-render optimization, image rendering, and other findings.

---

## 1. Executive Summary

The app is functionally rich but architecturally inverted relative to how Next.js 16's App Router is meant to be used: **the entire homepage tree is client-rendered**, data is fetched **after** the page mounts (client-side `useEffect` + `fetch`) instead of on the server, and route-level caching is mostly disabled (`revalidate = 0` / `force-dynamic`) even for content that changes rarely. This combination is the root cause of most of the symptoms reported — slow first paint, visible skeleton→content pop-in (layout shift = "UI shake"), scroll jank, and main-thread contention during load.

| Area | Verdict | Severity |
|---|---|---|
| Server vs Client component split | Almost everything is `"use client"` (95 of 159 files); `app/page.tsx` itself is a client component | 🔴 Critical |
| Data fetching & caching | Every homepage section double-fetches on the client with no shared cache; API routes largely opt out of caching | 🔴 Critical |
| Scroll smoothness (Lenis/GSAP) | Correctly built RAF loop, but fighting layout shift + large repainted layers, not the library itself | 🟠 High |
| Images | Next/Image adopted in ~4 places only; 13 raw `<img>` tags; two 2.5–5.5 MB JPGs used as `background-image` | 🟠 High |
| Preload / re-render | Preloader gates the whole tree behind client state; parent-level `useState` re-renders cascade to all sections | 🟠 High |
| Security / misc | Hard-coded admin password in `middleware.ts`; `any` typing throughout | 🟡 Medium |

---

## 2. Server vs Client Component Usage

### 2.1 Finding: The homepage is a fully client-rendered SPA wearing an App Router costume

```
95 / 159 .ts/.tsx files under app|components|sections|lib carry "use client"
```

`app/page.tsx` (the route itself) is marked `"use client"`:

```tsx
// app/page.tsx
"use client";
...
export default function Home() {
  const [features, setFeatures] = useState<any[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  useEffect(() => {
    fetch("/api/features").then(...)
  }, []);
  ...
}
```

This defeats the primary benefit of App Router: server components can fetch data during render and stream fully-formed HTML. Instead, the server sends an empty shell, the client boots React, mounts, fires a `useEffect`, waits for `/api/features`, and only then decides *which section components even exist on the page*. Every section listed in `sectionMap` (`SkillsSection`, `ProjectsSection`, `GitHub`, `Education`, `Blogs`, `AchievementsSection`, `Journey`, `Testimonials`, `ContactSection`) is also `"use client"` and independently re-fetches its own data (see §3).

**Contrast — the one part of the app that does this correctly:** `app/projects/[id]/page.tsx` is a proper **async Server Component**:

```tsx
// app/projects/[id]/page.tsx
export const revalidate = 86400;
export async function generateStaticParams() { ... }
export async function generateMetadata({ params }) { ... }
export default async function ProjectDetailPage({ params }) {
  await connectDB();
  const projectDoc = await Project.findById(id).lean();
  ...
}
```

This page fetches Mongo data on the server, pre-renders all known IDs at build time via `generateStaticParams`, revalidates once a day, and ships real HTML with correct `<meta>` tags on first response. **This is the pattern the rest of the app should follow.**

### 2.2 Why this matters beyond "best practice"

- **No SSR content = worse SEO/OG tags** for a portfolio site whose entire purpose is to be shared/found (LinkedIn, recruiters, Google). `generateMetadata` is used on the project detail route but the homepage's metadata is static and can't reflect real data.
- **No streaming.** Next 16 supports `loading.tsx` + `<Suspense>` boundaries to stream partial HTML while slower data resolves. None of the homepage sections use this — instead there's a single `loadingFeatures` boolean gating *the entire page* to a blank `min-h-screen` div (`app/page.tsx`).
- **Client JS bundle bloat.** Every section pulls in Framer Motion / GSAP / data-shaping logic into the client bundle even though most of that content is static-ish text and could be server-rendered with client "islands" only for the interactive/animated bits.

### 2.3 Recommendations

1. **Convert `app/page.tsx` to an async Server Component.** Fetch `features` (and ideally all section data) on the server in parallel:
   ```tsx
   // app/page.tsx (Server Component)
   export default async function Home() {
     const features = await getFeatures(); // direct DB/service call, not fetch("/api/...")
     return (
       <>
         <Navbar features={features} />
         <HeroSection /* pass server data as props */ />
         <Suspense fallback={<SkillsSkeleton />}>
           <SkillsSection />
         </Suspense>
         ...
       </>
     );
   }
   ```
2. **Split every section into Server shell + Client island.** E.g. `GitHubSection` (server) fetches the GitHub stats and renders static markup; only the interactive heatmap tooltip/hover logic (`ContributionHeatmap`) needs `"use client"`. Same pattern for `Education`, `Journey`, `AchievementsSection`, `Blogs`, `SkillsSection`.
3. **Wrap each section in its own `<Suspense>` boundary** with a matching skeleton, instead of one global `loadingFeatures` gate. This lets fast sections (e.g., static `Footer`) paint immediately while slower DB-backed sections (`GitHub`, `ProblemSolving`) stream in independently — no more "whole page waits for the slowest fetch."
4. **Keep `"use client"` only where it's earned:** forms (`ContactSection`, `SubmitModal`), anything using `useState`/`useEffect`/`framer-motion`/`gsap`/pointer events, and the Lenis provider. Presentational/data-shaping logic should stay on the server.
5. Audit `import { IGitHubProfile } from "@/lib/db/models/..."` style imports inside client files (`GitHubStrip.tsx`, `Education/index.tsx`, `Testimonials/index.tsx`, `Blogs/index.tsx`). These happen to be TypeScript `interface`s (erased at compile time), so they're currently harmless, but standardize on `import type { ... }` for these so a future accidental value/class export from a Mongoose model file can't leak server code (and a Mongoose connection) into the client bundle.

---

## 3. Data Fetching & Caching

### 3.1 Finding: Client-side fetch waterfall, duplicated per section, largely uncached

Every homepage section fetches its own data independently in a `useEffect`, after mount:

```
components/Projects/index.tsx           → fetch("/api/projects")
components/portfolio/ProblemSolving/index.tsx → fetch(`/api/stats/problem-solving?_=${Date.now()}`, { cache: "no-store" })
components/portfolio/Blogs/index.tsx     → fetch("/api/blogs/list?featured=true")
components/portfolio/HeroSection.tsx     → fetch("/api/stats") then fetch("/api/stats?refresh=true")
components/portfolio/AchievementsSection.tsx → fetch("/api/achievements")
components/portfolio/SkillsSection.tsx   → fetch("/api/skills")
components/portfolio/Education/index.tsx → fetch("/api/education?limit=all")
components/portfolio/Journey/index.tsx   → fetch("/api/journey")
components/portfolio/Testimonials/index.tsx → fetch("/api/testimonials/list")
components/portfolio/GitHub/index.tsx    → fetch("/api/github")
app/page.tsx                             → fetch("/api/features")
```

That's **11 separate client-initiated round trips**, none of them coordinated, none of them sharing a cache (no SWR/React Query/`use()` + server cache — just raw `fetch` in `useEffect`). Two problems stack on top of this:

**(a) Cache-busting defeats the browser/CDN cache on purpose.**
```tsx
// components/portfolio/ProblemSolving/index.tsx
const res = await fetch(`/api/stats/problem-solving?_=${new Date().getTime()}`, {
  cache: 'no-store'
});
```
The `?_=timestamp` query param plus `cache: 'no-store'` guarantees this request is never served from cache, even though the underlying API route already implements its own 1-hour Mongo-backed staleness window (see below). This section will *never* benefit from HTTP caching, ever.

**(b) API routes largely opt out of Next's fetch/route cache:**

```
app/api/skills/route.ts:5                → revalidate = 0
app/api/education/route.ts:5             → revalidate = 0
app/api/certifications/route.ts:5        → revalidate = 0
app/api/testimonials/list/route.ts:5     → revalidate = 0
app/api/stats/route.ts:11                → dynamic = "force-dynamic"
app/api/stats/problem-solving/route.ts:11 → revalidate = 0 (but has its own manual cache, see below)
app/api/features/route.ts:4              → dynamic = "force-dynamic"
app/api/github/route.ts:10               → dynamic = "force-dynamic"
app/api/projects/route.ts:5              → revalidate = 3600   ✅
app/api/feature-cards/route.ts:5         → revalidate = 3600   ✅
app/api/journey/route.ts:5               → revalidate = 86400  ✅
```
Most of this content (skills list, education, testimonials, journey, features) changes rarely — it's edited through the `/admin` panel, not per-request. Forcing every request to hit Mongo (`revalidate = 0` / `force-dynamic`) for data that changes on a human's schedule is unnecessary load and unnecessary latency on every page view.

**(c) There's a good pattern already in the codebase — it's just not used consistently.** `app/api/github/route.ts` and `app/api/stats/problem-solving/route.ts` implement a sensible **stale-while-revalidate via MongoDB**: read a cached document, return it immediately if fresh, otherwise refetch from the GitHub/LeetCode/Codeforces APIs and update the cache. That's the right idea for *third-party rate-limited APIs*. But it's undermined by the `revalidate = 0` on the Next.js route itself and the `no-store`/cache-busting on the client, so the Mongo-level cache is doing all the work while Next's own caching layer contributes nothing.

### 3.2 Recommendations

1. **Fetch data on the server, in parallel, at the top of the page/section — not in `useEffect`.** Once sections become Server Components (§2), replace `fetch("/api/x")` with direct calls to the same data-access functions the API route uses (e.g. `connectDB()` + `Model.find()`), or `fetch` the internal route with Next's `fetch` cache options:
   ```tsx
   // Server Component
   const [skills, education, testimonials] = await Promise.all([
     getSkills(),       // direct DB call, or
     fetch(`${baseUrl}/api/education`, { next: { revalidate: 3600 } }).then(r => r.json()),
     fetch(`${baseUrl}/api/testimonials/list`, { next: { revalidate: 300 } }).then(r => r.json()),
   ]);
   ```
   `Promise.all` turns 11 sequential/independent client round trips into one parallel server-side batch that resolves before any HTML is sent.
2. **Set real `revalidate` values based on how often content actually changes**, not `0`/`force-dynamic` by default:
   - `skills`, `education`, `certifications`, `journey`, `features` → edited via admin panel only → `revalidate: 3600` or higher, or better: **on-demand revalidation** (`revalidateTag`/`revalidatePath`) triggered from the admin mutation routes, so the cache invalidates the instant an admin saves a change instead of waiting for a timer.
   - `testimonials/list` → keep short (`revalidate: 60–300`) since it's user-submitted, but drop it to a positive number instead of `0`.
   - `stats`, `github`, `stats/problem-solving` → keep `force-dynamic` at the *route* level only if you truly want per-request freshness; otherwise let the existing Mongo-cache-with-TTL pattern be the sole source of truth and set `revalidate` to match the TTL (e.g. `revalidate: 3600` to mirror `REFRESH_INTERVAL_MS`), so Next's cache and the Mongo cache agree instead of one bypassing the other.
3. **Remove the `?_=timestamp` + `cache: 'no-store'` combo** in `ProblemSolving/index.tsx`. It's actively fighting both the browser cache and the Mongo-level cache that route already has. If this section truly needs to reflect a background refresh, use `router.refresh()` or a `revalidateTag` webhook instead of manually cache-busting every request.
4. **Introduce `next: { tags: [...] }` on fetches, and call `revalidateTag(...)` from the admin `PUT`/`POST`/`DELETE` handlers** (`app/admin/*`, `app/api/resources/*`). This is the single highest-leverage change: content only actually changes when you edit it in `/admin`, so cache invalidation should be event-driven, not polling/time-based.
5. If you want to keep a couple of these as client-fetched (e.g., genuinely live stats), at minimum de-duplicate with a shared fetcher (SWR or React Query) so multiple mounts/remounts of a section don't refire the same request, and so navigation back to the page can serve from an in-memory cache instantly.

---

## 4. Async Operations & Main-Thread Work

### 4.1 What's already good

- `Navbar`'s scroll handler is properly throttled with a `requestAnimationFrame` gate (`components/portfolio/Navbar.tsx`):
  ```tsx
  let ticking = false;
  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { /* work */ ticking = false; });
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  ```
  This is the correct pattern — keep it, and use it as the template for other scroll/pointer listeners below.
- `HeroSection`'s mousemove handler is similarly RAF-throttled and uses `{ passive: true }`.
- `lib/db/connect.ts` correctly caches the Mongoose connection on `global` across hot reloads/serverless invocations — no connection-storm risk.

### 4.2 Finding: Section-level fetches are not parallelized and block user-visible content

Because every section fetches independently in its own `useEffect` (see §3), the browser's main thread does: parse → hydrate → run 11 independent effects → 11 separate network requests → 11 separate `setState` calls, each of which triggers a re-render + layout recalculation as loading skeletons resolve into real content at different times. This is a major contributor to the "UI shake"/jank symptom — it's not one big freeze, it's *staggered layout shifts* as each section pops in independently over 1–3 seconds after first paint.

### 4.3 Finding: Double-fetch pattern in `HeroSection`

```tsx
// components/portfolio/HeroSection.tsx
useEffect(() => {
  fetch("/api/stats").then(...)                 // 1. cached value, fast
  fetch("/api/stats?refresh=true").then(...)     // 2. forces live refresh, immediately after
}, []);
```
Firing the "refresh" request immediately alongside the cached one means every single page load pays for a full live-stats refresh (hitting LeetCode/Codeforces/GitHub APIs) regardless of whether the cache was actually stale. This should be conditional — only fire the refresh call if the cached response indicates staleness, or better, move this entirely server-side with the TTL check already implemented in `app/api/stats/route.ts`.

### 4.4 Recommendations

1. Move data fetching to the server (§2/§3) so the client never needs to orchestrate multiple sequential fetch-then-render passes — the HTML arrives already populated.
2. For any fetches that must remain client-side (truly live/interactive data), use `Promise.all` to run them concurrently instead of N independent `useEffect`s each with their own loading state, and consider a single shared loading boundary instead of N staggered skeleton→content transitions.
3. In `HeroSection`, only issue the `?refresh=true` call if the first response's `updatedAt` is older than your staleness window (mirror the check that already exists server-side in `app/api/stats/route.ts`), or drop the client-side refresh entirely and rely on the server route's own TTL logic.
4. For expensive client-side computation (e.g. `ContributionHeatmap`'s week/month grid building, `aggregateLanguages`/`calculateStreaks` helpers if ever run client-side), keep using `useMemo` (already done in `ContributionHeatmap.tsx`) and make sure equivalent aggregation in API route helpers (`app/api/github/helpers/*`) stays server-side only — confirmed correct today, just flagging to keep it that way as the codebase evolves.

---

## 5. Scroll Performance (freeze / stutter / UI shake / lag / frame drops)

### 5.1 What's already good

`components/SmoothScrollProvider.tsx` is a genuinely well-built Lenis + GSAP integration:
```tsx
const lenis = new Lenis({ lerp: 0.06, wheelMultiplier: 0.9, touchMultiplier: 1.5, infinite: false });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```
- Driving Lenis through GSAP's own ticker instead of a second, competing `requestAnimationFrame` loop is exactly right — avoids the classic "two RAF loops racing each other" cause of scroll stutter.
- Lenis is explicitly **disabled on mobile/touch** (`isMobile` check), which avoids a very common mobile "scroll freeze" bug where smooth-scroll libraries fight the browser's native touch/momentum scrolling. Good defensive choice.
- It's disabled on `/admin` routes so the admin panel gets native scrolling.

**So the scroll library itself is not the source of the freeze/shake/jank.** The causes are elsewhere, and they're compositing/layout problems that happen to be most visible *while* scrolling because that's when the browser is under the most pressure to hit 60fps.

### 5.2 Root cause A: Multi-megabyte images painted as CSS backgrounds inside animated sections

```
public/assets/papers/darktexture.jpg   → 5.5 MB
public/assets/papers/whitetexture.jpg  → 2.5 MB
```
used as raw CSS background-images with blend modes:
```tsx
// components/portfolio/ContactSection.tsx
className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none
  opacity-[0.6] dark:opacity-[0.6] mix-blend-multiply dark:mix-blend-screen
  bg-[url('/assets/papers/whitetexture.jpg')] dark:bg-[url('/assets/papers/darktexture.jpg')]"

// components/portfolio/Education/BentoCertCard.tsx — same pattern, twice
```
This is expensive for three independent reasons:
1. **Download weight** — an 8 MB combined payload (both light/dark variants are in the DOM; only one is visually shown but both may load) for a decorative background texture is disproportionate on any connection, and directly delays Largest Contentful Paint for whatever section it sits in.
2. **`mix-blend-mode` forces the browser to composite that layer against everything beneath it on every paint**, which is one of the more GPU-expensive CSS properties, especially at full-bleed (`inset-0`) size. When this sits inside a section that's also being transformed/faded by Lenis's smooth scroll + Framer Motion's `whileInView`, the browser has to recomposite this large blended layer on every scroll frame.
3. Because these are raw `bg-[url(...)]` Tailwind arbitrary values, **Next's Image Optimization pipeline never touches them** — no resizing, no modern format (WebP/AVIF), no responsive `sizes`. A 5.5 MB JPEG ships in full to every device, phone or desktop.

**This is very likely your primary "scroll shake / lag / frame drop" source** in the sections that use it (`Contact`, `Education`).

**Recommendation:**
- Re-encode both textures as WebP/AVIF at a realistic display resolution (a tileable/cover background rarely needs to be larger than ~1600px on the long edge) — this alone should take ~8 MB down to a few hundred KB.
- Where possible, replace the `bg-[url()]` Tailwind arbitrary-value pattern with `next/image` using `fill` + `style={{ objectFit: 'cover' }}`, so Next serves a correctly sized, modern-format, cached asset instead of the raw file.
- Reconsider `mix-blend-mode` at full-section size; if the goal is a subtle paper-grain texture, a much smaller tileable texture (e.g. 256×256, `background-repeat`) with the same blend mode achieves the identical visual effect at a fraction of the compositing cost.
- Add `will-change: opacity` (not `transform`, to avoid creating unnecessary layers) only on the element actually animated by Framer Motion's `whileInView`, and remove it after the animation settles (Framer Motion does this automatically for `transform`/`opacity` — just make sure you're not layering a second, manually-animated background on top of it, which is what's happening here).

### 5.3 Root cause B: Layout shift from staggered client-fetched sections (see §3/§4)

Each section renders a skeleton (fixed or `min-h-screen` height) and then swaps to real content once its independent `fetch` resolves. If the skeleton's height doesn't exactly match the resolved content's height — which is common when the resolved content includes variable-length text (testimonials, blog cards, GitHub stats) — the browser has to reflow every subsequent section down the page. If this happens while the user is mid-scroll (very likely, since it happens on the first 1–3 seconds after load, which is exactly when someone starts scrolling), it reads exactly like "the page shakes/jumps while scrolling." Fixing the data-fetching architecture in §2/§3 (server-rendered content, no staggered pop-in) removes this class of shift by construction.

### 5.4 Root cause C: `ScrollTrigger` is registered but unused — verify no dead weight, and use it deliberately if you add scroll-linked animation

```tsx
// components/SmoothScrollProvider.tsx
gsap.registerPlugin(ScrollTrigger);
```
`ScrollTrigger` is imported and registered globally, but a repo-wide search shows **no component actually creates a `ScrollTrigger.create()`/`scrub` instance** — GSAP itself is only otherwise used in `components/Projects/ProjectSlider.tsx` and `FeatureCardRow.tsx`, not via ScrollTrigger. This isn't currently causing jank (registering a plugin is cheap), but it's worth confirming intent: if scroll-linked GSAP animations are planned, make sure any future `ScrollTrigger.create()` calls pass `{ invalidateOnRefresh: true }` and are killed on unmount (the provider already does `ScrollTrigger.getAll().forEach(st => st.kill())` on cleanup, which is correct and should be preserved as more triggers are added).

### 5.5 Root cause D: Framer Motion `whileInView` fired on every section simultaneously

`SectionWrapper` (used to wrap most homepage sections) animates `opacity`/`y` `whileInView`:
```tsx
// components/portfolio/SectionWrapper.tsx
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-10%" }}
  transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
>
```
This is a reasonable, GPU-cheap animation (`opacity`/`transform` only, `once: true` so it doesn't re-trigger) — good. The risk is compounding: if 3–4 sections cross their `-10%` viewport margin in the same scroll frame (e.g., a fast scroll/fling on a long page), several independent Framer Motion animations, GSAP tweens (in `ProjectSlider`), and the Lenis RAF loop are all requesting work in the same frame budget. Individually cheap, collectively they can drop frames on lower-end devices. Recommend:
- Confirm `viewport={{ once: true }}` is used everywhere (it is, in `SectionWrapper`) so animations don't re-fire on scroll-up.
- Where a section has many independently-animated children (e.g., Testimonials' `FloatingCard`s, `PlatformCard`s in ProblemSolving), stagger via a single parent `variants`/`staggerChildren` rather than N independent `whileInView` observers, to reduce the number of concurrent IntersectionObservers and animation instances firing on fast scroll.

### 5.6 Summary checklist for "butter smooth" scroll

- [ ] Shrink/re-encode `darktexture.jpg` / `whitetexture.jpg`, or replace with a tiled small texture (§5.2)
- [ ] Move `bg-[url(...)]` texture usages to `next/image` where feasible (§5.2)
- [ ] Eliminate staggered client-fetch-driven layout shift by server-rendering section content (§2, §3)
- [ ] Consolidate per-child `whileInView` observers into staggered parent variants where a section has many animated children (§5.5)
- [ ] Keep the existing RAF-throttled scroll/pointer handler pattern (`Navbar`, `HeroSection`) as the standard for any new listeners

---

## 6. Preload & Re-render Optimization

### 6.1 Finding: The Preloader is a client-state gate around the entire app, not a route-level loading UI

```tsx
// app/page.tsx
let hasRunPreloader = false; // module-level mutable flag — see note below

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(hasRunPreloader);
  ...
  return (
    <>
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
      <Navbar preloaderDone={preloaderDone} features={features} />
      <motion.main
        animate={preloaderDone ? { opacity: 1 } : { opacity: 0 }}
        className={!preloaderDone ? "pointer-events-none" : ""}
      >
        ...
      </motion.main>
    </>
  );
}
```
Two issues here:

1. **Module-level mutable variable (`let hasRunPreloader = false`) used as cross-render state.** In the App Router, module scope can be shared across requests/instances in some execution environments (and is definitely shared across all component instances within a client session, including if `Home` were ever rendered twice, e.g. in a modal/parallel route). It also means the "has the preloader run" flag doesn't survive a hard refresh, which is presumably intended, but it's fragile — prefer `sessionStorage` (explicit, scoped to tab, survives soft navigations) if the intent is "don't replay the preloader within the same session."
2. **The entire `<main>` subtree mounts immediately, hidden via `opacity: 0` + `pointer-events-none`, while the Preloader animates on top.** This means all section components, their `useEffect` data fetches, and their initial renders are already happening *during* the preloader animation, competing for main-thread time with whatever animation the Preloader itself is running (check `Preloader.tsx`'s own `requestAnimationFrame` counter loop, lines ~140–150). This is very likely contributing to a perceived "freeze" right at the start of the page — the preloader animation and 11 concurrent data-fetch-triggered renders are sharing the same frame budget.

**Recommendation:** Once sections are server-rendered (§2), this problem shrinks a lot because there's no post-mount fetch-then-render cascade to compete with the preloader. In the meantime:
- Don't mount the real content invisibly underneath the preloader — mount a lightweight placeholder (or nothing) until `preloaderDone`, then mount `<main>` for real. `AnimatePresence`/conditional mount avoids paying render cost for content the user can't interact with yet anyway (`pointer-events-none`).
- Replace the module-level `let hasRunPreloader` with `sessionStorage.getItem('preloaderShown')`, read once in an effect (client-only, guarded with `typeof window !== 'undefined'`), to make the "already seen it this session" behavior explicit and predictable.

### 6.2 Finding: Prop-driven re-render cascade from `app/page.tsx`

`features` and `loadingFeatures` live in `Home`'s top-level `useState`. Every section component reading `features` (directly or via `sectionMap`) re-renders whenever this state changes — which happens exactly once here, so it's not currently a perf emergency, but it's the wrong ownership model going forward: as more shared client state gets added to `Home` (a common instinct when a page component is `"use client"`), every section subscribes to re-renders it doesn't need. Moving `features` to be server-fetched (§2) removes this entirely — it becomes a prop passed once from server-rendered markup, not client state.

### 6.3 Recommendations

1. Prefer `React.memo` for section components that receive stable/rarely-changing props (most of them, once server-fetched), so a change in one part of the tree (e.g. `ContactSection`'s form state) can't accidentally re-render sibling sections.
2. Keep animation/interaction state (form inputs, hover state, modal open/closed) scoped to the smallest component that needs it — already mostly true (e.g. `ContactSection` owns its own form state) — just make sure this discipline continues as sections are refactored.
3. For `HeroSection`'s animated counters (`useAnimatedCounter`), confirm the counter's own RAF loop is cancelled/cleaned up on unmount (worth a quick look at `useAnimatedCounter`'s implementation, not included in this review's file list — flagging for follow-up).

---

## 7. Image Rendering

### 7.1 Finding: `next/image` is used in only ~4 files; 13 raw `<img>` tags bypass it entirely

```
components/Projects/FeatureCard.tsx
components/Projects/ProjectSlider.tsx           (×2)
components/portfolio/Education/CertificateLightbox.tsx
components/portfolio/Education/BentoCertCard.tsx (×2)
components/portfolio/Testimonials/FloatingCard.tsx
app/admin/education/page.tsx
app/admin/testimonials/page.tsx
app/admin/journey/page.tsx
app/admin/achievements/page.tsx
```
Raw `<img>` tags skip Next's automatic resizing, format negotiation (AVIF/WebP), lazy-loading, and layout-shift prevention. For admin-only pages this is low priority (not public-facing, low traffic), but the public-facing ones matter:

- **`FloatingCard.tsx`** (Testimonials — user-submitted avatars): `<img src={testimonial.avatar_url} ... className="h-full w-full rounded-2xl object-cover" />` — no `width`/`height`, so the browser can't reserve layout space before the image loads, which is a direct contributor to layout shift during the Testimonials section's entrance animation.
- **`CertificateLightbox.tsx` / `BentoCertCard.tsx`** — certificate images shown in a lightbox/grid; good candidates for `next/image` with `fill` inside a sized container, getting automatic responsive `srcset` for free.
- **`ProjectSlider.tsx` / `FeatureCard.tsx`** — project preview media; if these are remote URLs, confirm they're covered by `next.config.ts`'s `remotePatterns` (currently: `images.unsplash.com`, `i.ibb.co`, `i.ibb.co.com`, `raw.githubusercontent.com`) before migrating, or add the correct pattern for wherever these images actually live.

### 7.2 Finding: `sizes` prop is set on only 3 of the `next/image` usages that exist

Without a `sizes` attribute, `next/image` falls back to assuming the image renders at its largest possible width, which can cause it to serve a larger source file than necessary on smaller viewports (defeats part of the point of responsive images).

### 7.3 Finding: Large video preview files served directly from `public/`

```
public/assets/projectpreview/pcppreview.mp4       17 MB
public/assets/projectpreview/petcarepreview.webm  13 MB
public/assets/projectpreview/employeepreview.webm 5.7 MB
```
These aren't images, but they're in the same "unoptimized static media" family and worth flagging alongside the image findings: 17 MB+ video files served directly from `public/` with no adaptive bitrate, no CDN-level range-request optimization beyond whatever the hosting platform does by default, will be slow on mobile/constrained connections and can stall the section they're in if `preload="auto"` or `autoplay` is set. Check `DetailHeroVideo.tsx`'s `<video>` tag for `preload` value — `preload="metadata"` (or `"none"` with a poster image, loading the real video on interaction) is usually the right default for a project preview that isn't guaranteed to be watched.

### 7.4 Recommendations

1. Migrate the 8 public-facing raw `<img>` usages to `next/image`, prioritizing `FloatingCard.tsx` (layout shift on every testimonial) and `BentoCertCard.tsx`/`CertificateLightbox.tsx` (largest images).
2. Add `sizes` to every `next/image` usage that isn't rendered at a fixed pixel size, matching your actual responsive breakpoints (e.g. `sizes="(max-width: 768px) 100vw, 50vw"`).
3. Confirm `priority` is set only on true above-the-fold, LCP-candidate images (currently correctly set on `HeroSection.tsx:556` and conditionally in `OptimizedImage.tsx`) — don't add it broadly, as marking too many images `priority` defeats lazy-loading elsewhere on the page.
4. Re-encode the paper textures per §5.2; audit video `preload`/poster strategy per §7.3.
5. Consider adding a `sharp`-based or CI-time image compression step for anything added to `public/assets/` going forward, since this repo clearly accumulates hand-dropped media (the two oversized textures being the clearest example).

---

## 8. Other Findings

### 8.1 🔴 Security: Hard-coded admin password in source control

```ts
// middleware.ts
if (urlPassword === "653194") {
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set("admin_auth", "true", { ... });
  return response;
}
```
This is out of scope for a performance/architecture review, but it's serious enough to flag regardless: the admin panel's entire access control is a 6-digit numeric password committed in plaintext to the repository, passed via URL query string (which gets logged by browsers, proxies, and analytics tools, and stays in browser history). Recommend moving this to an environment variable at minimum, and ideally to a real auth mechanism (signed session token / NextAuth / a hashed password compared server-side) — a 6-digit numeric code is brute-forceable in seconds even with basic rate limiting absent, and this one is publicly visible in the GitHub history besides.

### 8.2 🟡 Type safety: `any` used broadly for data models

`app/page.tsx`'s `features: any[]`, and similar `any` casts in `app/projects/[id]/page.tsx` (`(project as any).title`, etc.) forfeit compile-time safety exactly where it matters most — around data coming from Mongoose's `.lean()` calls, which is a well-known TypeScript pain point with Mongoose but solvable with a shared `PlainProject`/`PlainFeature` type derived from your Mongoose schemas (e.g. via `mongoose.InferSchemaType` or a manual DTO type), used consistently instead of `any`/`as any` scattered per call site.

### 8.3 🟡 Scratch/debug files shipped in the repo

`scratch/`, `test-check.js`, `test-db.js`, `test-put.js`, `test-put2.js` at the repo root appear to be ad-hoc debugging scripts. Not a runtime risk (not imported anywhere in `app/`), but worth moving into a `.gitignore`d directory or removing before portfolio visitors browse the source on GitHub (a portfolio's source code is itself part of the pitch to reviewers).

### 8.4 🟢 Things done well, worth preserving as the app evolves

- Lenis + GSAP ticker integration (§5.1)
- Mongoose connection caching via `global` (`lib/db/connect.ts`)
- `app/projects/[id]/page.tsx`'s server-rendering + ISR + `generateStaticParams` pattern — this should be the template copied to the homepage sections, not a one-off
- RAF-throttled scroll/pointer listeners in `Navbar.tsx` / `HeroSection.tsx`
- Mobile-aware disabling of smooth scroll to avoid touch-scroll conflicts
- `Suspense`-ready structure already exists via `loading.tsx` on the projects detail route — extend this pattern to the homepage

---

## 9. Prioritized Action Plan

**Phase 1 — highest impact, addresses root causes of scroll jank + slow first paint**
1. Re-encode/replace `darktexture.jpg` & `whitetexture.jpg` (§5.2) — cheapest fix, likely biggest felt improvement to scroll smoothness.
2. Convert `app/page.tsx` to a Server Component; fetch `features` (and ideally all section data) server-side with `Promise.all` (§2, §3).
3. Add per-section `<Suspense>` boundaries + skeletons instead of one global loading gate (§2.3, §6.1).

**Phase 2 — caching correctness**
4. Set real `revalidate` windows per data type; wire `revalidateTag`/`revalidatePath` into the admin mutation routes for instant invalidation (§3.2).
5. Remove the `no-store` + cache-busting timestamp in `ProblemSolving/index.tsx` (§3.2).

**Phase 3 — images & re-render hygiene**
6. Migrate remaining `<img>` tags to `next/image`, add `sizes` everywhere (§7).
7. Rework the Preloader to not mount hidden content underneath itself (§6.1); move `hasRunPreloader` to `sessionStorage`.

**Phase 4 — cleanup**
8. Fix the hard-coded admin password (§8.1) — flagged separately since it's a security item, not a performance one, but shouldn't wait long.
9. Replace `any` with real DTO types around Mongoose `.lean()` results (§8.2).
10. Remove/gitignore `scratch/` and root-level `test-*.js` debug files (§8.3).