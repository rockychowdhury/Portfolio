# Projects Section — Layout & Animation Specification
### Personal Portfolio — Next.js Implementation Guide

---

## Overview

The Projects section is split into **two distinct parts**:

1. **Featured Projects Showcase** — A scroll-driven cinematic experience with a floating browser window, internal content scrolling, and large typographic background text that transitions between project names.
2. **All Projects Grid** — A clean card-based layout listing the remaining non-featured projects.

---

## Part 1: Featured Projects Showcase

### Concept

As the user scrolls down through a tall scroll container (much taller than the viewport), a **pinned scene** stays fixed on screen. Inside it, a browser-style mockup window floats in the center, showing the live homepage of a featured project. Behind it, the project name is rendered in **massive, full-width typography** that slowly drifts and morphs as the scroll progresses.

The transition between projects is the hero moment: the browser window **flips on the Y-axis** (like turning a page) while the background text **slides/fades** from one project name to the next.

---

### Layout Structure

```
<section id="featured-projects"> (scroll container — height: 500vh or more)
  │
  └── <div class="sticky-scene"> (position: sticky; top: 0; height: 100vh)
        │
        ├── <div class="bg-project-name">   ← Giant background text (z-index: 0)
        │     "PROJECT NAME"
        │
        ├── <div class="browser-window">    ← Floating mockup (z-index: 10)
        │     ├── Browser chrome bar (dots + URL)
        │     └── <iframe> or <div> with scrollable project screenshot/content
        │
        └── <div class="project-meta">     ← Label, number, tags (z-index: 10)
              ├── Project number (e.g. 01)
              ├── Project title
              └── Tech stack tags
```

---

### Scroll Mechanics (Scroll-Driven Animation)

Use `scrollYProgress` from **Framer Motion's `useScroll`** with `useTransform` to map scroll position to animation values.

Divide the total scroll into equal segments — one per featured project.

**Example with 3 featured projects and `500vh` scroll height:**

| Scroll Range | Active Project | Animation State |
|---|---|---|
| 0% – 30% | Project 1 | Window scrolls internally, BG text drifts |
| 28% – 33% | Transition | Window flips (rotateY 0→90°), BG text exits |
| 33% – 63% | Project 2 | New window content appears (rotateY 90→0°), new BG text |
| 61% – 66% | Transition | Flip again |
| 66% – 100% | Project 3 | Same cycle |

---

### Browser Window — Anatomy & Behavior

#### Static anatomy
```
┌─────────────────────────────────────────────┐
│  ● ● ●   [ https://yourproject.com ]        │  ← Chrome bar
├─────────────────────────────────────────────┤
│                                             │
│   [Project homepage screenshot/embed]       │
│   scrolls top → bottom during scroll phase  │
│                                             │
└─────────────────────────────────────────────┘
```

- **Size:** ~55vw × ~65vh, centered in viewport
- **Border radius:** 12–16px
- **Shadow:** `0 40px 120px rgba(0,0,0,0.6)` for dramatic depth
- **Chrome bar:** dark (`#1a1a1a`), three colored dots (red/yellow/green), monospaced URL text
- **Perspective wrapper:** wrap in a `div` with `perspective: 1200px` to enable 3D flip

#### Internal scroll behavior
During the "active" scroll phase of each project, the content inside the window scrolls upward — simulating the user browsing the project. Achieve this by translating a `<div>` (containing a tall screenshot or a live `<iframe>`) from `translateY(0)` to `translateY(-40%)` using `useTransform`.

---

### Flip Transition — Y-Axis Card Flip

During the transition scroll range between two projects:

**Phase A — Exit (current project):**
```
rotateY: 0deg → 90deg
opacity: 1 → 0  (fade at 90deg, the "edge")
scale: 1 → 0.95
```

**Phase B — Enter (next project):**
```
rotateY: -90deg → 0deg
opacity: 0 → 1
scale: 0.95 → 1
```

Swap the content (project data) exactly when `rotateY` hits 90°/−90° — the window is edge-on, completely invisible, so the content swap is invisible to the user.

```tsx
// Pseudocode
const rotateY = useTransform(scrollYProgress, [0.28, 0.33], [0, 90]);
const nextRotateY = useTransform(scrollYProgress, [0.33, 0.38], [-90, 0]);
```

Use `style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}` on the parent.

---

### Background Text — Giant Typography

A full-width project name rendered behind everything.

**Behavior during active phase:**
- Slowly translates horizontally: `translateX: -2% → 2%` (subtle parallax drift)
- Opacity: fades in at section enter, holds, fades out at transition

**Behavior during transition:**
- Exits: `translateY: 0 → -6%`, `opacity: 1 → 0`
- Next name enters: `translateY: 6% → 0`, `opacity: 0 → 1`

**Styling:**
```css
font-size: clamp(80px, 14vw, 180px);
font-weight: 900;
letter-spacing: -0.04em;
text-transform: uppercase;
color: transparent;
-webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.12);
/* or use a very low-opacity fill */
color: rgba(255, 255, 255, 0.05);
user-select: none;
white-space: nowrap;
position: absolute;
width: 100%;
text-align: center;
z-index: 0;
```

The text can overflow horizontally — this is intentional. It gives the feeling of scale and depth.

---

### Project Meta — Side Labels

Alongside the browser window, display:

```
Left side (vertical, rotated):          Right side:
  [ 01 / 03 ]                             #Next.js  #PostgreSQL  #Tailwind
  (project counter)
```

Or below the window:
```
Project Name ————————————————— 01
Short one-line description
```

These fade in/out in sync with the background text transition.

---

### Navigation Dots / Progress Indicator

A small row of dots or dashes (like a carousel indicator), centered at the bottom of the sticky scene. The active dot fills/expands. This gives users a hint of how many featured projects exist.

```
  ● ○ ○    ← Project 1 active
```

---

## Part 2: All Projects Grid

Below the scroll-driven featured section, render a standard grid of project cards.

### Layout

```
<section id="all-projects">
  <h2>All Projects</h2>
  <div class="projects-grid">
    [ Card ] [ Card ] [ Card ]
    [ Card ] [ Card ] [ Card ]
  </div>
</section>
```

- **Grid:** `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`
- **Gap:** `1.5rem`
- Cards animate in with a staggered fade+slide-up on scroll into view

### Card Anatomy

```
┌───────────────────────────┐
│  [ Project Thumbnail ]    │  ← 16:9 image, hover zooms slightly
├───────────────────────────┤
│  Project Name             │
│  Short description        │
│  #tag  #tag  #tag         │
│                           │
│  [GitHub ↗]  [Live ↗]    │
└───────────────────────────┘
```

- On hover: card lifts (`translateY: -4px`), border brightens, thumbnail zooms (`scale: 1.04`)
- Thumbnail: use `next/image` with `objectFit: cover`

---

## Next.js Implementation Notes

### Dependencies

```bash
npm install framer-motion
```

> Framer Motion's `useScroll`, `useTransform`, and `motion` components are the core of the featured section animation.

### File Structure

```
/components
  /projects
    FeaturedProjects.tsx      ← sticky scroll scene
    BrowserWindow.tsx         ← the mockup window component
    BackgroundText.tsx        ← giant text layer
    ProjectMeta.tsx           ← title, tags, counter
    ProjectCard.tsx           ← card for the grid
    AllProjects.tsx           ← grid section

/data
  projects.ts                 ← project data array

/sections
  ProjectsSection.tsx         ← composes both parts
```

### Data Shape

```ts
// /data/projects.ts

export type Project = {
  id: string;
  title: string;
  description: string;
  url: string;               // live URL for iframe or screenshot
  screenshotUrl: string;     // static screenshot image path
  techStack: string[];
  featured: boolean;         // true → goes into scroll showcase
  githubUrl?: string;
  liveUrl?: string;
};
```

### Core Scroll Hook Pattern

```tsx
// FeaturedProjects.tsx
'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

const FEATURED = projects.filter(p => p.featured);

export default function FeaturedProjects() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    // tall scroll container
    <div ref={containerRef} style={{ height: `${FEATURED.length * 150}vh` }}>
      {/* sticky scene pinned for the full scroll */}
      <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
        <BackgroundText scrollYProgress={scrollYProgress} projects={FEATURED} />
        <BrowserWindow scrollYProgress={scrollYProgress} projects={FEATURED} />
        <ProjectMeta scrollYProgress={scrollYProgress} projects={FEATURED} />
      </div>
    </div>
  );
}
```

### Determining Active Project Index

```tsx
// Derived from scroll: map scrollYProgress to current project index
// Each project occupies 1/N of the scroll range
const segmentSize = 1 / FEATURED.length;

const activeIndex = useTransform(scrollYProgress, (v) =>
  Math.min(Math.floor(v / segmentSize), FEATURED.length - 1)
);
```

### Flip Animation per Project

```tsx
// BrowserWindow.tsx
// For project at index `i`, its active scroll range is:
const start = i / FEATURED.length;
const end = (i + 1) / FEATURED.length;
const transitionWidth = 0.05; // 5% of total scroll for flip

const rotateY = useTransform(
  scrollYProgress,
  // exit flip
  [end - transitionWidth, end],
  [0, 90]
);
```

### Performance Considerations

- **Prefer screenshots over iframes** for the browser window content. Live `<iframe>` elements are expensive, cause layout shifts, and may be blocked by CORS. Use `next/image` with a tall screenshot and animate its `translateY` instead.
- Use `will-change: transform` on the browser window element.
- Wrap the sticky section in `<Suspense>` and mark it `'use client'`.
- For the grid, use Framer Motion's `whileInView` for staggered card entry — no custom scroll tracking needed.

### Card Stagger Animation

```tsx
// AllProjects.tsx
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
>
  {allProjects.map(p => (
    <motion.div key={p.id} variants={cardVariants}>
      <ProjectCard project={p} />
    </motion.div>
  ))}
</motion.div>
```

---

## Visual & Aesthetic Direction

| Property | Recommendation |
|---|---|
| **Background** | Near-black (`#0a0a0a` or `#080808`) |
| **BG text color** | White at 4–8% opacity, or outlined (`-webkit-text-stroke`) |
| **Browser chrome** | Dark glass (`rgba(20,20,20,0.9)`) with subtle border (`rgba(255,255,255,0.08)`) |
| **Window shadow** | Deep, large-blur shadow (`0 60px 160px rgba(0,0,0,0.7)`) |
| **Accent color** | Single accent (e.g. electric blue `#3b82f6`, or amber `#f59e0b`) for tags, active dots |
| **Typography** | Display: something heavy and wide (e.g. **Bebas Neue**, **Anton**, **Clash Display**); Body: clean sans |
| **Section heading** | "Featured Projects" or just "Projects" — small, uppercase, letter-spaced label style above the scroll area |

---

## Summary Checklist

- [ ] `FeaturedProjects.tsx` — scroll container + sticky scene
- [ ] `BrowserWindow.tsx` — 3D perspective wrapper, chrome bar, internal scroll content, flip animation
- [ ] `BackgroundText.tsx` — full-width giant typography, cross-fade between project names
- [ ] `ProjectMeta.tsx` — project title, description, tags, counter indicator
- [ ] `AllProjects.tsx` — responsive grid with staggered scroll-in animation
- [ ] `ProjectCard.tsx` — thumbnail, name, description, tech tags, links
- [ ] `/data/projects.ts` — data layer with `featured` flag
- [ ] Tall screenshots generated/prepared for each featured project
- [ ] Mobile fallback: on small screens, collapse featured showcase into a simpler horizontal swipe carousel or a vertically stacked card list (the 3D flip + sticky scroll is a desktop-first experience)