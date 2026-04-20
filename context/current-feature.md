## Current feature

Session 12 — Streak System + Real Activity Grid

## Status

Completed

## Goals

- Create `actions/streak.ts` with `fetchStreak()` server action
- Create `app/api/streak/route.ts` for GET streak data
- Refactor `app/dashboard/layout.tsx` into server wrapper + `DashboardShell` client component
- Update `Sidebar` to accept real `activeDays: string[]` and `streakCount: number` props (replacing mock)
- Update `Header` to accept real `streakCount: number` prop (replacing mock)
- Wire `InactivityBanner` in Today page to real `lastDate` from streak doc

## Files to touch

- `actions/streak.ts` — new
- `app/api/streak/route.ts` — new
- `app/dashboard/layout.tsx` — server wrapper fetches streak + progress
- `components/dashboard/DashboardShell.tsx` — new client component (sidebar toggle state)
- `components/dashboard/sidebar.tsx` — accept real activeDays/streak props
- `components/dashboard/header.tsx` — accept real streak prop
- `app/dashboard/today/page.tsx` — compute real daysSinceActive from streak

## References

- `lib/db/models/Streak.ts`
- `actions/progress.ts` (touchStreak already wired here)

# History

<!-- Keep this updated, Earliest to latest -->

- **2026-04-18** — Bootstrapped Next.js project with create-next-app (Next.js 16, React 19, TypeScript, Tailwind CSS v4, React Compiler enabled)
- **2026-04-18** — Created `CLAUDE.md` for Claude Code guidance
- **2026-04-18** — Set up `context/` directory with project context files (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `current-feature.md`)
- **2026-04-19** — Created `lib/mock-data.ts` with mock user, months, and activity grid data
- **2026-04-19** — Initialized ShadCN UI (base-nova style) with `cn()` utility and Button component
- **2026-04-19** — Built dark zen theme in `globals.css` with custom oklch color palette mapped to both ShadCN and Tailwind v4
- **2026-04-19** — Configured Geist, Geist Mono, and Instrument Serif fonts via `next/font/google`
- **2026-04-19** — Built dashboard layout with collapsible sidebar, header bar, and dashboard overview page
- **2026-04-19** — Dashboard UI Phase 1 completed: sidebar, header, stats grid, roadmap table, today card, zen quote
