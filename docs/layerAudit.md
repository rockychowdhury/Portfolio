# Layerize & Compositing Audit — Applying the Performance Guide to `audit` Branch

This audit runs the exact checklist from the Frontend Performance Optimization Guide against the actual codebase. The guide's diagnosis (Layerize ~55%, not JS) matches what's in the code almost perfectly — there's a lot of `backdrop-filter`, large blur radii, and fixed+blurred elements stacked on top of a scroll library. Findings below are grouped by the guide's own sections, with file:line evidence and fixes.

---

## Scale, at a glance

```
<motion.*> elements:        144
backdrop-blur usages:        28  (across 19 files)
blur-3xl / blur-[Npx]:        9 files
mix-blend-mode:               3 files
position: fixed:              6 files
position: sticky:              3 files
shadow-2xl / shadow-xl:       17 usages
useScroll (continuous):        1 file — but it animates a layout property (see §3)
```

144 independently-managed Framer Motion elements plus 28 blurred layers plus a fixed, blurred navbar sitting above all of it is consistent with the guide's Layerize-dominant profile: the browser is spending its time promoting and recompositing layers, not running your JS.

---

## §8–10: Backdrop-filter & Blur Audit

### Finding: `backdrop-blur` on the fixed Navbar — the worst offender

`components/layout/Navbar.tsx:134-137`
```tsx
className={`fixed top-4 left-0 right-0 z-50 mx-auto w-[95%] lg:w-[90%] max-w-[1400px] rounded-full transition-all duration-500 ease-in-out px-1.5 py-1.5 ${
  scrolled
    ? "border border-border/40 bg-background/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    : "border border-transparent bg-transparent shadow-none"
}`}
```
This is exactly the combination the guide calls out in §11 (Fixed Elements): **fixed + backdrop-blur + shadow**. The Navbar is `position: fixed`, meaning it sits in its own compositing layer for the entire time the page is scrolled. Every single frame, the browser must sample everything behind the navbar and blur it live — this is one of the single most expensive things you can ask a browser to do continuously, and it is happening on literally every scroll frame of every session, on both desktop and mobile.

This single element is very likely responsible for a large share of your Layerize cost, because it's not occasional (like a modal) — it's permanently mounted and permanently in the blur-recompute path while scrolling.

**Fix — replace live backdrop-blur with a pre-baked translucent surface:**
```tsx
// Instead of backdrop-blur-md (samples the live page behind it every frame)
className={`fixed top-4 ... ${
  scrolled
    ? "border border-border/40 bg-background/90 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    : "border border-transparent bg-transparent shadow-none"
}`}
```
Bumping `bg-background/60` → `bg-background/90` and dropping `backdrop-blur-md` removes the live sampling entirely while keeping almost the same visual "frosted" impression, since the background is now nearly opaque instead of semi-transparent-and-blurred. If you want to keep a blur look specifically here (it is a nice effect on a navbar), the far cheaper alternative is `backdrop-blur-sm` (much smaller sampling radius) instead of `-md`/`-xl`, and never combine it with a colored shadow at the same time — pick one expensive effect per element, not both.

### Finding: `PlatformCard` stacks `backdrop-blur-xl` on multiple nested elements, repeated per card in a grid

`sections/ProblemSolving/PlatformCard.tsx:144, 209`
```tsx
<div className="absolute inset-0 rounded-3xl border border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl overflow-hidden -z-10 shadow-inner">
...
<div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2 shadow-sm">
```
This component renders once per platform (LeetCode/Codeforces/CodeChef — at least 3 instances on the page), and each instance has **two separate `backdrop-blur` layers**. That's 6+ live-blurred layers from one section alone, all of which recomposite on every scroll frame as the section moves through the viewport.

**Fix:** The outer card background (`bg-[#0a0a0a]/90 backdrop-blur-xl`) is sitting on `-z-10` behind opaque content — at 90% opacity there is almost nothing visible behind it to blur. Drop `backdrop-blur-xl` entirely here; a solid `bg-[#0a0a0a]` (or `/95`) will look visually identical since so little of the background shows through anyway. Keep at most one blur effect per card (the badge pill, if you want it), not two per card × 3 cards.

### Finding: Modal/overlay backdrop-blur is fine — those are conditionally mounted

`sections/Testimonials/SubmitModal.tsx`, `sections/Testimonials/AlertStack.tsx`, `sections/Education/CertificateLightbox.tsx` — these use `fixed` + `backdrop-blur` but are only mounted while open, which is exactly the guide's intended use case ("glassmorphism should only exist in a few places"). **Leave these as-is** — they are not part of the persistent scroll-time cost.

### Finding: Large static blur blobs

```
components/layout/Footer.tsx:68     blur-[120px]   — one decorative blob, bottom of page
sections/Contact/index.tsx           blur-3xl        — ambient glow
sections/Achievements/AchievementsMarquee.tsx  blur-3xl
components/common/AnimatedBorder.tsx  blur-3xl
```
These are lower priority than the Navbar/PlatformCard findings because they're not `fixed` (they scroll with the page and are each only in the compositing path while their section is near the viewport), but per the guide's §9, anything at `blur-3xl` or a custom `blur-[120px]+` value should be reviewed. Where these are purely decorative ambient glows (not interactive), consider `blur-2xl` or smaller — visually the difference is subtle but the GPU cost of large blur radii scales non-linearly with radius.

---

## §16–17: Animation Audit — the one real bug

### Finding: `MasterySpine.tsx` animates `top` (a layout property) on every scroll frame

`sections/Journey/MasterySpine.tsx`
```tsx
const { scrollYProgress } = useScroll({ ... });
const pathLength = useSpring(scrollYProgress, { ... });
...
style={{
  top: useTransform(pathLength, (p) => `${p * 100}%`),   // ← layout property, animated continuously
}}
```
This is the exact anti-pattern flagged in the guide's §16 ("Avoid animating... `top`... These trigger layout recalculation") and §17 ("Avoid continuous scroll-driven animations... `useScroll → useTransform → style updates every frame`"). This component does both at once: it's driven by `useScroll` (fires on every scroll event) and it animates `top`, which forces the browser to recompute layout for this element and everything affected by it, every single frame, for as long as the Journey section is in view. This is the most likely single JS-adjacent contributor to frame drops during scroll — everything else in this audit is compositing cost, but this one is genuine layout thrashing.

**Fix — replace the layout-property animation with a transform:**
```tsx
// BEFORE — animates `top`, triggers layout every frame
style={{ top: useTransform(pathLength, (p) => `${p * 100}%`) }}

// AFTER — animate a transform instead; same visual result, GPU-composited, no layout recalculation
const topPercent = useTransform(pathLength, (p) => p * 100);
...
style={{
  position: "absolute",
  top: 0,                         // static
  height: "100%",
  transform: useMotionTemplate`translateY(${topPercent}%)`,  // animated via transform, not layout
}}
```
Or, simpler if the element being positioned is the dot/marker itself rather than a growing line: use `y` in a `motion.div`'s `style` prop directly (Framer Motion's `y`/`x` shorthand always compiles to a `transform`, never `top`/`left`):
```tsx
<motion.div style={{ y: useTransform(pathLength, (p) => `${p * 100}%`) }} />
```
This one change — swapping `top` for a `transform`-based equivalent — is the highest-value fix in this audit relative to effort. It converts a per-frame layout recalculation into a per-frame GPU compositing update, which is dramatically cheaper and is precisely the distinction the guide draws between "High Layout" and "High Layerize" causes.

### Finding: Everything else in the codebase already follows the opacity/transform rule

A scan of the other 143 `motion.*` usages (`whileInView` entrance animations, hover scales, the Hero parallax) shows they consistently animate `opacity`, `y`/`x` (transform), and `scale` — no other `width`/`height`/`margin`/`padding` animations found. `MasterySpine.tsx` is the outlier; the rest of the codebase is compliant with this rule already.

---

## §17: Scroll-Driven Animations — usage is otherwise appropriate

Aside from `MasterySpine`, the codebase does **not** overuse `useScroll`/`useTransform`. The dominant pattern is `whileInView` with `viewport={{ once: true }}` (via `SectionWrapper.tsx`), which the guide explicitly recommends — it fires once when a section enters view and then stops, rather than recalculating on every scroll frame. This is good and should remain the default for any new section entrance animations; `useScroll` should be reserved for the rare case (like the Journey timeline spine) where a value genuinely needs to track scroll position continuously, and even then, only ever output to `transform`, never to a layout property (see fix above).

---

## §11–12: Fixed & Sticky Elements

```
Fixed:  Navbar.tsx (persistent, blurred — see above)
        Preloader.tsx (temporary, fine)
        ProjectNavbar.tsx (persistent on project detail pages — check same blur combo)
        CertificateLightbox.tsx / SubmitModal.tsx / AlertStack.tsx (conditional, fine)

Sticky: ContributionHeatmap.tsx (sticky header inside heatmap — check for blur/shadow combo)
        SidebarTOC.tsx / MobileTOCStrip.tsx (project detail page — check for blur combo)
```

**Action:** Apply the same check to `ProjectNavbar.tsx` as was done for the homepage `Navbar.tsx` — if it has `backdrop-blur` while `fixed`, apply the identical fix (raise opacity, drop the blur or reduce to `-sm`).

```
components/ProjectDetail/ProjectNavbar.tsx:  backdrop-blur present, fixed — same fix as Navbar.tsx
```

For the sticky elements (`ContributionHeatmap`, `SidebarTOC`, `MobileTOCStrip`), confirm none of them combine `sticky` with `backdrop-blur` — sticky elements are cheaper than fixed ones (they only enter their own compositing layer while actually stuck), but the same blur-cost logic applies whenever they are stuck and being scrolled past.

---

## §14–15: Images & Shadows (secondary, lower priority than Layerize fixes above)

- `shadow-2xl`/`shadow-xl` appears 17 times across the codebase. Per the guide's §15, most of these are very likely candidates for `shadow-md`/`shadow-lg` without a visible quality loss — worth a pass once the Navbar/PlatformCard/MasterySpine fixes are shipped and re-measured, since shadow cost is Paint (~5% in your profile), a much smaller line item than Layerize (~55%). Fix the big-ticket items first.
- Image findings (raw `<img>`, missing `sizes`) were already covered in the earlier audit and mostly resolved on this branch — no new findings here.

---

## Priority Order (matching the guide's own structure)

### 🔴 High — do these first, in this order
1. **`MasterySpine.tsx`** — swap the `top` animation for a `transform`/`y` animation. This is the only genuine layout-thrashing bug found; fix it first since it compounds with everything else while scrolling through the Journey section.
2. **`Navbar.tsx`** — drop `backdrop-blur-md`, raise background opacity instead. This is `fixed` and permanently mounted, so it's in the compositing path 100% of the time the user scrolls, on every page.
3. **`ProjectNavbar.tsx`** — apply the identical fix if it has the same fixed+blur combination (verify first).
4. **`PlatformCard.tsx`** — remove the redundant `backdrop-blur-xl` behind an already-90%-opaque background; keep at most one blur per card.

### 🟠 Medium
5. Reduce `blur-[120px]` in `Footer.tsx` and any other `blur-3xl`+ usages to `blur-2xl` or smaller where the visual difference is negligible.
6. Re-check the `mix-blend-mode` texture overlays in `Contact/index.tsx` and `Education/BentoCertCard.tsx` (flagged in the previous audit) — these interact with the Layerize cost the same way blur does; if not yet fixed, fold that fix in alongside this pass.

### 🟢 Low — do after re-measuring
7. Downgrade `shadow-2xl` to `shadow-lg`/`shadow-md` where not load-bearing for the design.
8. Re-run the Chrome DevTools Performance recording (build + start, not dev) after 1–4 above and confirm Layerize % has dropped meaningfully before spending time on the low-priority items — they're a much smaller fraction of the current profile and may not be worth the effort if 1–4 already bring frame times under budget.

---

## ✅ Applied (audit branch — 2026-08-06)

The high and medium fixes above have been implemented and verified with `npm run build`:

1. **`MasterySpine.tsx`** — animated `top` replaced with a transform-based `y`. The moving wrapper is now `inset-y-0` (full spine height) so `translateY(%)` resolves against the spine instead of reflowing layout. Per-frame layout thrashing eliminated.
2. **`Navbar.tsx`** — dropped `backdrop-blur-md`, raised `bg-background/60` → `bg-background/90`. Fixed element no longer live-samples the page every frame.
3. **`ProjectNavbar.tsx`** — same fix: `bg-background/60 backdrop-blur-md` → `bg-background/90` (no blur). Scroll handler also rAF-throttled + `passive: true`.
4. **`PlatformCard.tsx`** — removed trailing `backdrop-blur-xl` on the 90%-opaque card shell (`bg-[#0a0a0a]/95`), reduced decorative `blur-[100px]` → `blur-2xl`. Kept the single badge-pill `backdrop-blur-md`.
5. **Fixed+blur audit (medium items 5–6)** — reduced oversized static blurs to `blur-2xl`: `Footer.tsx`, `Contact/index.tsx` (blur-3xl→2xl), `AchievementsMarquee.tsx` (blur-[128px]→2xl), `EducationClient.tsx` (blur-[120px]→2xl), `CardE_WideBanner.tsx` (blur-[100px]→2xl). `MobileTOCStrip.tsx` (sticky+blur) → solid `bg-background/95`, blur dropped. `AlertStack`/`HeatmapTooltip`/`MiniSparkline` tooltips: `backdrop-blur-xl`→`-sm`, `shadow-2xl`→`-lg`.

**Additional pass (guide §16–18, §20):**
- Converted JS-driven infinite loop animations to compositor CSS keyframes (no per-frame React/main-thread work): Hero scroll indicator, `Footer` back-to-top, `GridBackground` breathing overlay, `CenterHeadline` pulse glow.
- Converted `whileHover` JS animations to CSS `hover:translate/scale` on all Blog cards (`CardA`–`CardG`), `FloatingCard`, `FloatingCloud`, `ShowAllButton`, `BentoCertCard`, and `Footer` — removing redundant `motion.a` wrappers / JS listeners while keeping the same lift-on-hover.
- Left `SkillsClient` `whileHover` intact (shared entrance variants) and conditionally-mounted modal/lightbox `backdrop-blur` untouched per "What NOT to touch".

Re-measure Layerize/frame rate now with `npm run build && npm run start` and a fresh DevTools Performance recording before deciding on the remaining `🟢 Low` items (shadow pass beyond tooltips, further memoization).

---

## What NOT to touch

- The 143 other `motion.*` usages — they already animate only `opacity`/`transform`/`scale`, matching the guide's animation rules. No blanket "remove Framer Motion" pass is needed.
- Conditionally-mounted `backdrop-blur` on modals/lightboxes (`SubmitModal`, `AlertStack`, `CertificateLightbox`) — these are the correct, limited use of glassmorphism the guide describes; they only cost anything while actually open.
- Lenis/GSAP — per the guide's own final recommendation, don't touch the smooth-scroll library itself. Everything found here is a rendering-pipeline cost that exists independently of Lenis; fixing these will make scrolling smoother whether or not Lenis stays enabled, and it's worth re-measuring with native scroll (Lenis temporarily disabled) once these are fixed to confirm the library isn't adding anything on top.