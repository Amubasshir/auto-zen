# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context Files

Read the following to get the full context of the projects:

- @context/general-guidelines.md
- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md

## Project Overview

AutoZen is an authenticated learning tracking dashboard for AI automation learners following a structured 6-month roadmap. Features include progress tracking, daily "Today" view, streaks, custom resources, notes, and project portfolio management.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

No test framework is configured yet.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI (planned, not yet installed)
- **Auth**: NextAuth v5 / Auth.js (planned)
- **Database**: MongoDB Atlas with Mongoose ODM (planned)
- **Caching**: localStorage write-ahead cache (server is source of truth)

## Architecture

**React Compiler** is enabled (`reactCompiler: true` in `next.config.ts`).

Path alias: `@/*` maps to the project root (`./`).

### Planned Route Structure

- App Router layout with persistent header bar (logo, global progress %, streak, user menu) and left sidebar (Dashboard, Today, 6-month roadmap, 28-day activity grid)
- Default landing: Today View

### Planned API Routes

- `POST /api/auth/signup`, `POST /api/auth/login` — Auth
- `GET/PATCH /api/progress` — Roadmap progress (per-user completion maps)
- `GET/POST/PATCH/DELETE /api/resources` — Custom resources per week
- `GET/POST/PATCH /api/notes` — Per-week auto-saving notes
- `GET/POST/PATCH/DELETE /api/projects` — Portfolio projects

### Data Models

All defined in `project_spec.md`: User, Session, Account, RoadmapProgress, CustomResource, Note, ProjectPortfolio, Streak. The roadmap itself (Month → Week → Item → Task) is hardcoded seed data.

### Persistence Strategy

- MongoDB Atlas is the source of truth
- localStorage used only for optimistic UI writes and offline drafts
- Server response always overwrites local cache
- localStorage keys prefixed `az-cache-`

## Project Spec

Full product specification lives in `project_spec.md` — consult it for feature requirements, data model definitions, and API contracts before implementing.
