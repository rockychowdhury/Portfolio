# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website. Currently in the **planning/architecture phase** — no source code has been created yet. The project is being built with **Next.js** and uses **Framer Motion** for scroll-driven animations.

## Architecture & Tech Stack

- **Framework:** Next.js (App Router, `'use client'` components)
- **Animation:** Framer Motion (`useScroll`, `useTransform`, `motion` components)
- **Styling:** Tailwind + shadcn/ui
- **Data layer:** Plain TypeScript arrays in `/data/*.ts` files
- **Database:** Mongodb (store projects, blogs, skills, courses etc)


## Key Design Specifications

All design specifications live in `docs/`. The most important file is:

- **`docs/projects.md`** — Complete specification for the Projects section: a scroll-driven cinematic experience with a floating browser window (3D flip transitions), giant background typography, and an "All Projects" grid below with staggered card animations.

The planned sections of the portfolio (from `docs/portfolioPlan.md`):
- Navbar (docs/navbar.md)
- Hero section (docs/hero.md)
- Skills (grouped, scrollable, clickable filter)
- Problem Solving & GitHub stats (docs/problem-solving.md)
- Projects (docs/projects.md) — the most fleshed-out spec
- Blogs (docs/blogs.md)
- Journey — timeline view (docs/journey.md)
- Education & Courses (docs/education-courses.md)
- About & Contact (docs/contact.md)
- Footer (docs/footer.md) — minimal

Most of these `.md` files are currently empty placeholders.

## Planned File Structure

Per `docs/projects.md`, component structure should follow:
```
/components/projects/
  FeaturedProjects.tsx
  BrowserWindow.tsx
  BackgroundText.tsx
  ProjectMeta.tsx
  ProjectCard.tsx
  AllProjects.tsx
/data/
  projects.ts
/sections/
  ProjectsSection.tsx
```

## External Resources

Content about the user should be sourced from:
- Resume: `docs/Rocky's-Resume.pdf`
- GitHub: https://github.com/rockychowdhury
- LinkedIn: https://www.linkedin.com/in/rockychowdhury1/
- Existing portfolio: https://rocky-chowdhury.netlify.app/ (repo: github.com/rockychowdhury/Portfolio-2.0-)
- Competitive programming: LeetCode (Rocky20809), Codeforces (__Cipher__), Codechef (rocky20809)
