# Projects Section & Details Page — Implementation Plan

---

## Tech Stack Requirements

- **Framework:** Next.js 14+ (App Router)
- **Animation:** Framer Motion (scroll + UI transitions), GSAP (complex slider choreography), Lenis (smooth scroll)
- **Markdown:** `remark` + `remark-html` + `rehype-sanitize` for safe rendering
- **Styling:** Tailwind CSS
- **Performance:** ISR for project detail pages, `next/video` or native `<video>` with lazy loading

---

## Part 1 — Projects Section (Homepage)

---

### 1.1 Database Schema

```ts
{
  id: string                  // slug-friendly unique id — e.g. "medisync"
  title: string               // Project display name
  description: string         // Internal reference only — never rendered in UI
  readmeLink: string          // Raw GitHub README URL for the details page
  thumbnail: string           // Static image URL — shown before video loads or when not in focus
  githubLink: string          // CTA — links to GitHub repo
  liveLink: string            // CTA — "Open" button target
  videoPreviewLink: string    // Direct video file URL (MP4) — autoplay when in focus
  youtubeLink: string         // CTA — YouTube demo video
  order: number               // Controls left-to-right render order (ascending)
}
```

Store in MongoDB. Fetch via a single `GET /api/projects` route, sorted by `order` ascending. Cache with `revalidate: 3600`.

---

### 1.2 Section Entry Animation

When the user scrolls to the Projects section, only the **center card** is visible initially. It enters by rising from below the viewport — `y: 120, opacity: 0` → `y: 0, opacity: 1` — using a smooth spring via Framer Motion triggered by `useInView`. Once the center card has settled into position (approximately 600ms after entry), the left and right adjacent cards fade and slide in simultaneously from their respective sides — left card from `x: -60, opacity: 0`, right card from `x: 60, opacity: 0`. This sequence — center first, flanking cards second — must be strictly ordered.

Use GSAP's `ScrollTrigger` with `start: "top 60%"` on the section container to fire this sequence at the right scroll position without being too eager or too late.

---

### 1.3 Slider Layout & Visual Structure

The slider renders three cards visible at a time — left, center, right — in an Apple TV-style centered carousel. The center card is significantly larger and fully opaque. Left and right cards are partially visible (approximately 20–25% of each card showing at the edges), at reduced opacity (around 60%), and slightly scaled down (scale ~0.92). This size and opacity differential creates the depth hierarchy that communicates which project is "active."

The slider is a circular list — after the last project, it wraps back to the first. There is no end state.

All three visible card containers should be full viewport height or a defined tall fixed height (e.g., `80vh`). The cards bleed to the left and right edges of the viewport with no padding — exactly like the Apple TV reference. Do not constrain the slider inside a centered container with horizontal padding.

---

### 1.4 Video Behavior

Only the **center card** plays video. Left and right cards display the `thumbnail` image as a static placeholder.

When the center card transitions (user click or auto-advance):
1. The outgoing center card's video pauses immediately.
2. The incoming center card's video begins playing from the start after the slide animation completes — not during.
3. The `<video>` element uses `autoplay`, `muted`, `playsInline`, and `loop: false`. Loop is false because the video ending triggers the auto-advance.

When a video ends, automatically advance to the next project using the same slide animation as a manual click. This is the primary auto-advance mechanism — no separate timer needed.

On hover over the center card, the video pauses and two buttons appear — "Explore" and "Open" — with a clean fade-in animation. On mouse leave, buttons fade out and the video resumes. Do not show any overlay or dim the video on hover — the buttons appear over the clean video with no background treatment.

---

### 1.5 Slide Transition Animation

Use GSAP for the slide transition — not CSS transitions — for frame-perfect control.

On advance to the next project (rightward slide):
- Current center card animates to the left position: scale down, reduce opacity, translate left.
- Incoming right card animates to center: scale up, full opacity, translate left into center.
- Far left card (now off-screen) is repositioned to the right side instantaneously (no animation) and becomes the new right card — circular rotation.

On advance to the previous project (leftward slide), mirror the above.

Duration: approximately 550ms per transition. Easing: `power2.inOut` in GSAP terms — not linear, not bouncy.

The left and right partial cards are clickable. Clicking the left partial card triggers a leftward slide. Clicking the right partial card triggers a rightward slide. These click zones are the entire visible portion of the partial card — not a button.

Debounce all slide triggers with a 600ms cooldown to prevent rapid-fire transitions during animation.

---

### 1.6 Hover Buttons — "Explore" and "Open"

Both buttons appear only when the center card is hovered. They are rendered in the lower-center area of the card — not overlaid as an afterthought but positioned deliberately within the card's lower third.

- **"Explore"** — opens `/projects/{id}` in a new tab. Uses the `readmeLink` to render the detail page.
- **"Open"** — opens `liveLink` in a new tab.

Button design: minimal pill buttons, white or near-white background with dark text, no heavy shadows. They should feel like they belong to the clean video, not imposed on top of it. Entry animation: `opacity: 0, y: 8` → `opacity: 1, y: 0` with a 100ms stagger between the two buttons. Exit animation is the reverse.

---

### 1.7 Feature / Problem Cards Row (Below Slider)

Directly beneath the project slider, a second horizontal scrolling row renders smaller cards. Each card represents a specific problem solved or feature implemented, linked to a particular project.

**Schema for feature cards:**

```ts
{
  id: string
  projectId: string         // references the parent project
  headline: string          // e.g. "Real-time Queue with Redis"
  subtext: string           // one concise sentence explaining the problem or impact
  image: string             // visual — screenshot, diagram, or icon illustration
  ctaLabel: string          // e.g. "See how →" or "Read more"
  ctaLink: string           // links to the relevant section of the project detail page
  order: number
}
```

This row uses the same horizontal slider behavior as the project slider — circular, auto-advancing, with left/right navigation — but at a smaller scale. Cards are approximately 320×200px. No video — image only.

**Card design requirements:**
- Image occupies the top 55% of the card, full bleed with `object-fit: cover`.
- Bottom 45% contains the headline in bold, subtext in muted small font, and the CTA link.
- A subtle accent line or color chip in the top-left corner indicates which project this feature belongs to — color-coded by project. This lets the recruiter connect features to projects at a glance.
- Clean rounded corners, soft shadow, white background (light mode) or dark card (dark mode).
- On hover: card lifts `translateY: -4px`, CTA arrow shifts right 3px.

The feature card row does not need to sync with the project slider — it is an independent scroll track. However, optionally, when the project slider changes the active project, the feature card row can smooth-scroll to show that project's feature cards first.

---

### 1.8 Lenis Integration

Wrap the entire page scroll in Lenis for smooth inertial scrolling. Initialize Lenis in a client component at the layout level — not per-section. Pass the Lenis scroll instance to GSAP's `ScrollTrigger` via `ScrollTrigger.scrollerProxy` so that GSAP's scroll-based animations read from Lenis's virtual scroll position rather than native scroll. This is the critical integration step — without it, GSAP ScrollTrigger and Lenis will conflict and produce jittery scroll behavior.

Update Lenis on every animation frame inside the GSAP ticker:
```
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)
```

Do not use `requestAnimationFrame` separately for Lenis when GSAP is present — use the GSAP ticker exclusively to avoid double-ticking.

---

### 1.9 Performance Rules for the Slider

- Render only 3 video elements in the DOM at any time — the center card's active video and the two adjacent cards' thumbnail images. Do not render all project videos into the DOM simultaneously.
- When a slide transition occurs, update which video element is "active" — swap `src` on the existing video element rather than mounting/unmounting video elements. This avoids the browser's video decode initialization cost on every slide.
- Use `loading="lazy"` on all thumbnail images.
- Preload the next project's video `src` as a `<link rel="preload" as="video">` tag when the current project's video is at 80% completion — so the next video is ready before it's needed.

---

## Part 2 — Project Details Page

---

### 2.1 Route Structure

```
/projects/[id]/page.tsx     ← dynamic route, one page per project
```

The `[id]` param matches the `id` field in the project schema (e.g., `/projects/medisync`).

---

### 2.2 Data Fetching — ISR Architecture

Fetch the README from GitHub's raw content API in a Next.js Server Component. Use `fetch` with `next: { revalidate: 86400 }` — ISR with a 24-hour cache. This means the README is fetched from GitHub once per day at most, and all subsequent visits are served from the cache.

```
Fetch URL pattern:
https://raw.githubusercontent.com/{username}/{repo}/main/README.md
```

The `readmeLink` field in the project schema should store this raw URL directly — no computation needed at render time.

At build time, use `generateStaticParams` to pre-render all project detail pages for the projects seeded in the database. This ensures zero wait time on first visit — pages are statically generated at build, then revalidated every 24 hours via ISR.

```
generateStaticParams → fetches all project IDs from DB → returns [{id: "medisync"}, ...]
```

---

### 2.3 README Rendering Pipeline

The README is fetched as raw Markdown text. It must be processed through a pipeline before rendering:

**Step 1 — Image path correction**
Before parsing, run a string replacement pass on the raw markdown to convert all relative image paths to absolute GitHub URLs. Pattern: any `![...](./{path})` or `![...](images/{path})` is replaced with `![...](https://raw.githubusercontent.com/{username}/{repo}/main/{path})`. This step must happen before the markdown parser runs — not after.

**Step 2 — Parse Markdown to HTML**
Use `remark` with `remark-gfm` (GitHub Flavored Markdown support — tables, strikethrough, task lists) and `remark-html` to convert markdown to an HTML string.

**Step 3 — Sanitize HTML**
Pass the HTML string through `rehype-sanitize` with a whitelist that allows standard HTML elements (headings, paragraphs, lists, tables, images, links, code, blockquote) but strips all `<script>`, `onclick`, and other executable content. This is non-negotiable for security — never skip sanitization.

**Step 4 — Extract Table of Contents**
Before or after parsing, extract all heading elements (h1–h3) from the markdown source using a regex or AST walk. Build a flat array of `{ text, level, slug }` objects where `slug` is the URL-safe version of the heading text. These become the sidebar navigation items. Inject matching `id` attributes into the rendered heading HTML elements so anchor links work.

**Step 5 — Render**
Pass the sanitized HTML string to the page component as a prop. Render using `dangerouslySetInnerHTML` — this is acceptable here because the content has been sanitized in Step 3. Apply Tailwind Typography (`@tailwindcss/typography`) prose styles with a custom theme override for the portfolio's visual language.

---

### 2.4 Page Layout

```
[ Navbar — sticky top ]
[ Hero Video — centered, autoplay, muted, full-width constrained ]
[ CTA Button Row ]
[ Main Content Area — two column ]
  [ Left: Sticky Sidebar TOC ]     [ Right: Rendered README ]
[ Footer ]
```

**Hero Video**
The `videoPreviewLink` from the project schema plays at the top of the page — centered, constrained to a max-width of approximately 900px, with rounded corners and a subtle shadow. Autoplay, muted, loop. No controls. This is a preview — the YouTube link CTA opens the full video.

**CTA Button Row**
Centered below the video. Buttons rendered in a single horizontal line:
- GitHub (links to `githubLink`)
- Live Preview (links to `liveLink`)
- YouTube Demo (links to `youtubeLink`, only rendered if field is non-empty)
- Leave a Review (opens a modal — same review/testimonial submission modal used in the Testimonials section)

All buttons are pill-shaped, minimal, consistent with the portfolio's button design system.

**Sidebar TOC**
Sticky, left-aligned, visible only on desktop (hidden on mobile — replaced with a dropdown at the top of the content area). Each TOC item is a link that smooth-scrolls to its heading. The active heading is highlighted as the user scrolls through the README content — tracked via Intersection Observer on each heading element. On click, Lenis handles the smooth scroll to the target anchor.

**README Content Area**
Right column, approximately 70% of the content area width on desktop. Full width on mobile. Styled with `@tailwindcss/typography` prose class with overrides for:
- Heading font weight and size scaling
- Code block background color matching the portfolio theme
- Image max-width and border-radius
- Link color matching the accent color
- Table styling — alternating row backgrounds, no harsh borders

**Large README handling:** If the README content exceeds approximately 50,000 characters, render it in chunks using dynamic import or progressive hydration to avoid a blocking parse on the main thread. For most project READMEs this threshold will not be hit, but include the guard.

---

### 2.5 Loading State

While the page is generating (on first ISR miss), show a skeleton layout matching the final page structure exactly:
- A pulsing gray rectangle where the video will be (same dimensions).
- Three gray pill skeletons for the CTA buttons.
- A sidebar skeleton with 5–6 gray lines of varying width.
- The content area shows a block of pulsing gray lines — varying widths to simulate paragraphs.

No spinner, no "Loading..." text. The skeleton ensures zero layout shift when content arrives.

---

### 2.6 Error Fallback

If the GitHub API is unreachable or the README fetch fails:
- Show the project title and description prominently.
- Show the CTA buttons (GitHub, Live, YouTube) — these do not depend on the README fetch.
- Show a message: *"README could not be loaded. View it directly on GitHub →"* with a link to the repo.
- Do not show a broken page or an empty white area.

---

### 2.7 Mobile UX Requirements

- The sidebar TOC is hidden on mobile. Replace with a sticky horizontal chip row at the top of the content area listing section names — scrollable horizontally. Clicking a chip smooth-scrolls to that section.
- The hero video scales to full viewport width on mobile with a maintained aspect ratio.
- The CTA button row wraps to two rows on narrow screens — never overflows.
- All README images are `max-width: 100%` and never overflow their container.
- Touch scroll on the README content must not be hijacked by Lenis — Lenis should release control for elements with `overflow: auto` or `overflow: scroll`. Configure this with Lenis's `prevent` option for the README content container.

---

## Part 3 — File Structure

```
/components/Projects/
  index.tsx                      ← section shell + data fetch
  ProjectSlider.tsx              ← GSAP-powered main slider
  ProjectCard.tsx                ← individual project card (center + flanking variants)
  ProjectVideo.tsx               ← video element with autoplay logic
  HoverButtons.tsx               ← "Explore" + "Open" buttons with Framer animation
  FeatureCardRow.tsx             ← secondary feature/problem card slider
  FeatureCard.tsx                ← individual feature card

/app/projects/[id]/
  page.tsx                       ← ISR detail page
  loading.tsx                    ← skeleton loading state
  error.tsx                      ← error fallback

/lib/
  fetchReadme.ts                 ← fetches raw markdown from GitHub with ISR config
  processMarkdown.ts             ← full pipeline: image fix → parse → sanitize → TOC extract
  extractTOC.ts                  ← heading extractor utility
  fixImagePaths.ts               ← relative → absolute GitHub URL converter

/components/ProjectDetail/
  DetailLayout.tsx               ← two-column layout shell
  SidebarTOC.tsx                 ← sticky desktop sidebar
  MobileTOCStrip.tsx             ← horizontal chip row for mobile
  RenderedReadme.tsx             ← dangerouslySetInnerHTML wrapper with prose styles
  DetailCTARow.tsx               ← CTA buttons row
  DetailHeroVideo.tsx            ← top-of-page video player

/app/api/projects/
  route.ts                       ← GET all projects from MongoDB, sorted by order
```

---

## Part 4 — Animation Performance Rules

These rules apply globally across both the section and detail page and are non-negotiable.

**Only animate GPU-composited properties.** Every animation must use only `transform` (translate, scale, rotate) and `opacity`. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` — these trigger layout recalculation and cause frame drops.

**No animation on scroll without `will-change`.** Any element that animates on scroll must have `will-change: transform` set in CSS before the animation begins. Remove it after the animation completes to free GPU memory.

**GSAP `killTweensOf` on unmount.** Every GSAP animation created in a React component must be killed in the cleanup function of its `useEffect` to prevent memory leaks and orphaned animations on route change.

**Framer Motion `AnimatePresence` for mount/unmount transitions.** Any component that conditionally renders (hover buttons, tooltip, modal) must be wrapped in `AnimatePresence` so exit animations complete before the element is removed from the DOM.

**Lenis `destroy()` on page unmount.** The Lenis instance must be destroyed in the root layout's cleanup to prevent the smooth scroll behavior from persisting across route changes in the Next.js App Router.

**Video `preload="none"` by default.** All video elements that are not currently in focus should have `preload="none"` to prevent the browser from downloading multiple video files simultaneously. Only the active center card's video should use `preload="auto"`.