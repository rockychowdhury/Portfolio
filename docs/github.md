
Github :

 - Top Languages graph
 - Total Repo
 - total contribution + graph
 - github achievements 
 - Pined repositories
# GitHub Section — Design & Implementation Specification

---

## Overview

The GitHub section serves as **proof of work** — a living, data-driven showcase that goes beyond listing technologies. It answers the recruiter's unspoken question: *does this person actually build things consistently?* Data is fetched live from the GitHub REST and GraphQL APIs. The section is structured in three visual layers: a **Metrics Bar**, a **Stats Grid**, and a **Pinned Repositories Showcase**.

---

## Data Sources

All data comes from GitHub's official APIs, called through Next.js API route handlers (never directly from the client).

```
REST API    → https://api.github.com/users/{username}
             → https://api.github.com/users/{username}/repos
             → Provides: repo count, followers, stars, forks, languages

GraphQL API → https://api.github.com/graphql
             → Provides: contribution calendar, pinned repos,
               total commits, streak data, achievements

WakaTime    → https://wakatime.com/api/v1/users/current/stats
             → Provides: hours per language, editor time, coding activity
               (requires WakaTime API key stored as env variable)
```

Use a GitHub Personal Access Token (read-only, public scope) stored in `.env.local` and consumed only inside API routes. Cache all responses with `revalidate: 3600`. This keeps the section fast and avoids GitHub's rate limits on every page visit.

---

## Section Structure

```
[ Section Headline ]
[ Metrics Bar — 5 key numbers ]
[ Two-column grid ]
  [ Left  → Contribution Heatmap + Streak ]
  [ Right → Top Languages + WakaTime ]
[ GitHub Achievements Row ]
[ Pinned Repositories Grid ]
```

---

## 1. Section Headline

**Heading:** "Open Source & Activity" or simply "GitHub"
**Subtext:** One line — something like *59 repositories. Consistent commits. Real projects.*

The word "consistent" here is deliberate — consistency is the single most impressive signal for a fresher's GitHub profile. The subtext should be dynamically generated from live data, not hardcoded.

---

## 2. Metrics Bar

A horizontal strip of 5 large animated numbers — the fastest read in the entire section. Recruiters who spend only 10 seconds on the section will at minimum absorb this row.

```
[ 59 Repos ]  [ X Total Stars ]  [ X Commits (2025) ]  [ 11 Followers ]  [ X PRs Merged ]
```

Each number:
- Animates upward via count-up on scroll-in (Framer Motion + `useInView`).
- Has a small icon above it (repo icon, star, git-commit, person, git-merge) in a muted accent color.
- Has a label beneath in a smaller, lighter font.
- Separated by faint vertical dividers.

On mobile this collapses to a 3-column grid with the remaining two stats on a second row below, centered.

---

## 3. Two-Column Stats Grid

### Left Column — Contribution Heatmap + Streak

**Contribution Heatmap**

A full-width heatmap spanning the last 52 weeks — the same visual language as GitHub's contribution graph, but styled to match the portfolio's design system. Each cell is a small square colored from near-transparent to full accent color based on daily contribution count.

Sourced from the GraphQL `contributionCalendar` query, which returns a week-by-week breakdown with contribution counts per day.

Behavior and details:
- Cells animate in as a left-to-right wave on scroll entry — each column fades and scales in with a staggered delay proportional to its column index. The entire animation completes in about 1 second.
- On hover, a tooltip shows: date, contribution count, and a contextual label (e.g., "5 contributions — above average").
- Month labels sit above the grid. Day labels (Mon, Wed, Fri) sit to the left, just like GitHub's native graph.
- The most active week is subtly highlighted with a slightly brighter cell color or a faint ring around the column.

**Streak Stats**

Directly below the heatmap, two stats sit side by side in pill-shaped chips:

```
[ 🔥 Current Streak: X days ]     [ 🏆 Longest Streak: Y days ]
```

If the current streak is 0, dim it with reduced opacity rather than hiding it — honesty in a portfolio reads better than a gap.

**Total Contributions This Year**

A single bold number just above the heatmap, right-aligned — e.g., *"1,247 contributions in 2025."* This number counts up on entry.

---

### Right Column — Languages & WakaTime

**Top Languages Breakdown**

A vertical list of the top 5–6 languages by usage across all repos, each shown as:

```
Python      ████████████░░░░  62%
JavaScript  ██████░░░░░░░░░░  28%
TypeScript  ███░░░░░░░░░░░░░  7%
Other       █░░░░░░░░░░░░░░░  3%
```

Each bar animates `scaleX` from 0 to its target width on scroll entry, staggered by 80ms per bar. The percentage label appears at the end of the bar after it finishes drawing.

Language colors should match the official GitHub language color palette (there is a well-known community JSON file for this — `github-colors` on npm). Python is blue, JavaScript is yellow, TypeScript is blue-tinted, etc.

**WakaTime Coding Activity**

Below the languages, a compact WakaTime widget — not an embed, but a custom-built component using the API data. Show:

```
[ Total Hours Coded (all time or last 6 months) ]
[ Most used editor: VS Code ]
[ Most active day of week: Tuesday ]
[ Average daily coding time: X hrs ]
```

This adds a layer of personality and specificity that GitHub's API alone cannot provide. Recruiters find it memorable — it signals that you track your craft seriously.

If WakaTime data is unavailable (key missing or API down), this sub-section gracefully collapses — the language breakdown fills the space.

---

## 4. GitHub Achievements Row

GitHub's achievements system (Arctic Code Vault, Pull Shark, Quickdraw, etc.) provides small trophy-like badges. Display the ones you have earned in a horizontal scrollable row.

```
[ 🏔️ Arctic Code Vault ]  [ 🦈 Pull Shark ]  [ ⚡ Quickdraw ]  ...
```

Each badge:
- Is rendered as a circular icon with the achievement name below it.
- On hover, expands slightly and shows a short description tooltip (e.g., *"Opened a pull request within 5 minutes of a repo being created"*).
- Animates in with a staggered scale-up from 0 on scroll entry — like trophies being placed on a shelf one by one.

These are fetched from the GitHub GraphQL API via the `profileAchievements` field. If the user has no achievements, this row is hidden entirely.

---

## 5. Pinned Repositories Showcase

This is the most content-rich part of the section and the one recruiters spend the most time on. Show exactly the repositories you have pinned on your GitHub profile — fetched dynamically via the GraphQL `pinnedItems` query.

### Card Layout (per repository)

```
┌───────────────────────────────────────────┐
│  [Language color dot]  Python             │
│                                           │
│  MediSync                                 │
│  Healthcare scheduling platform with      │
│  real-time queue management               │
│                                           │
│  ⭐ Stars   🍴 Forks   👁 Watchers         │
│                                           │
│  [ Tech Pill ]  [ Tech Pill ]  [ Tech ]   │
│                                           │
│  Last commit: 2 days ago                  │
└───────────────────────────────────────────┘
```

**Key decisions per card:**

- **Repository name** is large and bold — it is the headline.
- **Description** comes from the repo's GitHub description field. Keep it to 2 lines max with ellipsis overflow. Encourage setting good descriptions on GitHub itself.
- **Language dot + name** matches the GitHub language color system.
- **Tech Pills** are derived from the repository's topics (GitHub Topics feature). These are the tags you set on each repo — set them deliberately (e.g., `fastapi`, `postgresql`, `docker`, `redis`). They render as small colored pill badges.
- **Last commit** is a relative timestamp (e.g., "3 days ago") — this signals the project is alive, not abandoned.
- **Star/Fork/Watcher counts** are shown with their respective icons. For a fresher portfolio these numbers may be low — display them anyway. Hiding them looks suspicious; showing them with good code quality elsewhere compensates.

### Card Grid Layout

- Desktop: 3 columns (or 2 columns if cards are wide).
- Tablet: 2 columns.
- Mobile: 1 column, full width.

### Card Animations

- Cards enter with a staggered slide-up and fade — each card delayed by 100ms after the previous.
- On hover: the card lifts (`translateY: -4px`), border brightens slightly, and a very subtle glow appears behind it.
- The repository name underlines on hover to signal it is a clickable link (opens the GitHub repo in a new tab).

### Featured Project Callout

If MediSync (or your strongest project) should be visually distinguished, make its card span full width or double width in the grid — a "featured" card treatment. It gets a slightly larger description, a visible tech stack list, and optionally a small screenshot or a status badge (e.g., *"In Progress"* or *"Live"*).

---

## Animation Summary (Framer Motion)

| Element | Animation | Trigger |
|---|---|---|
| Metrics Bar numbers | Count-up, simultaneous | Section enters viewport |
| Heatmap cells | Left-to-right wave fade-in | Section enters viewport |
| Language bars | `scaleX` 0 → target, staggered | Section enters viewport |
| Achievement badges | Scale-up stagger, shelf effect | Section enters viewport |
| Pinned repo cards | Slide-up + fade, staggered | Section enters viewport |
| Card hover | `translateY -4px` + glow | Mouse enter |
| Heatmap cell hover | Scale up + tooltip | Mouse enter |

All scroll-triggered animations use `once: true` — they play once and do not repeat on scroll-up. This is intentional: replaying animations on every scroll direction feels amateur.

---

## Loading & Error States

**Loading:** Every card and every stat area should have a skeleton placeholder that exactly matches the final layout's dimensions. Use Tailwind's `animate-pulse` with rounded shapes. The heatmap skeleton should be a grid of faint gray squares. The repo card skeletons should match the card height. No layout shift when data arrives.

**Error:** If the GitHub API call fails (token expired, rate limited), show a graceful fallback — the section remains visible with a small *"Live stats temporarily unavailable"* label in place of each failed data block. The pinned repo cards can fall back to a static array of your top projects defined in a local config file, so the section never goes completely dark.

**Empty states:** If a repo has no description, show a default placeholder text. If no achievements, hide the row. If WakaTime is unavailable, collapse that block.

---

## Implementation Notes

**Recommended file structure:**
```
/components/GitHub/
  index.tsx                ← section shell + data orchestration
  MetricsBar.tsx
  ContributionHeatmap.tsx
  StreakChips.tsx
  LanguageBreakdown.tsx
  WakaTimeWidget.tsx
  AchievementsRow.tsx
  PinnedRepoCard.tsx
  PinnedRepoGrid.tsx
  skeletons/               ← one skeleton component per main block
```

**Data fetching strategy:** Use a single Next.js API route `/api/github` that fans out to all required GitHub REST and GraphQL endpoints in parallel using `Promise.all`, assembles the full data shape, and returns it as one JSON response. The client makes one request, not five. This keeps the client-side code clean and hides your token.

**GitHub Topics as tech stack:** Go to each pinned repo on GitHub right now and add relevant topic tags (`fastapi`, `postgresql`, `redis`, `docker`, `nextjs`, etc.). These become the tech pills on each card — they are pulled live from the API, so what you set on GitHub is what appears in the portfolio.

**Pin deliberately:** The GraphQL `pinnedItems` query returns exactly what you have pinned on your profile. Pin your best 4–6 repos. Remove any tutorial or starter repos from pinned. MediSync, PetCarePlus, and QuickFood should be among them.

**Relative timestamps:** Use `date-fns`'s `formatDistanceToNow` to convert commit timestamps to human-readable relative time. This is a small detail that makes the section feel live and maintained.