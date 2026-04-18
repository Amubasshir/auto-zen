# AutoZen Project Specification (project_spec.md)

## Product Name

**AutoZen**

---

# Core Problem

New AI automation learners often lose structure, continuity, and motivation while following a long roadmap.

Problems:

- Random, unstructured learning
- No progress tracking
- No “what do I do today?” guidance
- Resources scattered across tools
- Projects not tracked as portfolio assets
- Progress lost across devices
- Learners quit before finishing

---

# Solution

AutoZen is an authenticated learning tracking dashboard for AI automation learners following a structured 6-month roadmap.

It combines:

- Roadmap tracking
- Daily Today view
- Cloud-synced progress
- Streaks
- Custom resources
- Notes
- Project portfolio tracking
- Inactivity recovery

---

# Target Users

Primary:

- AI automation learners

Secondary (future):

- Freelancers
- Internal automation teams
- Agencies onboarding juniors

---

# MVP Scope (V1)

Included:

- Authentication
- Onboarding
- Today View
- Progress Dashboard
- Month / Week / Item tracking
- Custom Resources
- Notes
- Project Portfolio
- Streak Tracking
- Inactivity Recovery
- Cloud Sync

Explicitly Excluded:

- Journal (V2)
- AI coach (V2)
- Team mode (V2)
- Marketplace (V2)
- Community (V2)

---

# Core Features

## 1. Authentication

Use:

- NextAuth v5 (Auth.js)

Providers:

- Email/password
- GitHub OAuth

User actions:

- Sign up
- Sign in
- Log out
- Resume progress across devices

Protected data:

- Progress
- Notes
- Custom resources
- Portfolio projects
- Streaks

---

## 2. Onboarding

After signup ask:

- Learning path
  - No-Code
  - Developer

- Weekly hours

- Weekly learning target

- Start date

Generate:

- Personalized pacing
- Today queue

Store in user profile.

---

## 3. Header Bar

Show:

- AutoZen logo
- Global progress %
- Overall progress bar
- Current streak
- Resume last item
- User avatar menu

---

## 4. Left Sidebar

Contains:

- Dashboard
- Today
- 6 month roadmap

Each month card shows:

- Month title
- Mini progress bar
- Done / Total count

Bottom:

- 28-day activity grid

---

## 5. Today View

Default screen.

Show:

- Recommended learning item
- Resume unfinished item
- Pending tasks
- Estimated time
- Streak status

---

## 6. Dashboard Overview

Show:

- Overall progress
- Items completed
- Months started
- Current streak

---

## 7. Month View

Contains:

- Month goal
- Milestone
- Progress bar
- 4 week sections

---

## 8. Week Sections

Each week has:

- Expand/collapse
- Item list
- Notes button
- Add Resource button

---

## 9. Item Tracking

Each item has:

- Checkbox
- Item title
- Task progress
- Open detail

Updates:

- Item progress
- Week progress
- Month progress
- Global progress
- Streak

Cloud synced.

---

## 10. Custom Resources

Fields:

- Title
- URL

Type:

- YouTube
- Docs
- Course
- Article
- GitHub Repo

Difficulty:

- Beginner
- Intermediate
- Advanced

Duration

Subtasks:

- tasks[]

Features:

- edit
- delete
- included in progress math

Stored per user.

---

## 11. Notes

Per week notes.

Auto-save.

User can:

- create note
- edit note
- clear note content

Show:

- Last saved timestamp

Stored in DB.

---

## 12. Project Portfolio Tracker

Fields:

- Title

Status:

- Planned
- In Progress
- Completed

Optional:

- GitHub URL
- Demo URL
- Loom URL
- Case Study
- Completion Date

Stored per user.

---

## 13. Streak System

Counts:

- Item completion
- Task completion
- Project progress

Logic:

- yesterday + today = streak +1
- missed day = reset

---

## 14. Inactivity Recovery

3 days inactive:

- Resume prompt

5 days inactive:

- Falling behind warning

7+ days:

- Restart suggestion

---

# Data Models

## Static Roadmap (Hardcoded Seed Data)

### Month

```ts id="a1x7mn"
type Month = {
  id: string;
  monthNumber: number;
  title: string;
  goal: string;
  milestone: string;
  color: string;
  weeks: Week[];
};
```

### Week

```ts id="b2y8po"
type Week = {
  id: string;
  monthId: string;
  weekNumber: number;
  title: string;
  items: Item[];
};
```

### Item

```ts id="c3z9qr"
type Item = {
  id: string;
  weekId: string;
  title: string;
  url?: string;
  tasks: Task[];
};
```

### Task

```ts id="d4u1st"
type Task = {
  id: string;
  itemId: string;
  label: string;
};
```

---

## User

```ts id="e5v2tu"
type User = {
  id: string;

  name?: string;
  image?: string;

  email: string;
  passwordHash?: string;
  githubId?: string;

  pathType: 'no-code' | 'developer';

  weeklyHours: number;
  weeklyTarget: number;
  startDate: string;

  createdAt: Date;
};
```

---

## Session

```ts id="f6w3uv"
type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};
```

---

## Account

```ts id="g7x4vw"
type Account = {
  id: string;
  userId: string;

  provider: string;
  providerAccountId: string;

  accessToken?: string;
  refreshToken?: string;
};
```

---

## RoadmapProgress

```ts id="h8y5wx"
type RoadmapProgress = {
  id: string;

  userId: string;

  completedItems: Record<string, boolean>;

  completedTasks: Record<string, Record<string, boolean>>;
  // outer key = itemId, inner key = taskId

  lastActiveItem: string;
};
```

---

## CustomResource

```ts id="i9z6xy"
type CustomResource = {
  id: string;
  userId: string;
  weekId: string;

  title: string;
  url: string;

  type: string;
  difficulty: string;
  duration: string;

  tasks: string[];

  createdAt: Date;
};
```

---

## Note

```ts id="j1a7yz"
type Note = {
  id: string;
  userId: string;
  weekId: string;

  content: string;

  updatedAt: Date;
};
```

---

## ProjectPortfolio

```ts id="k2b8za"
type ProjectPortfolio = {
  id: string;
  userId: string;

  title: string;

  status: 'planned' | 'in-progress' | 'completed';

  githubUrl?: string;
  demoUrl?: string;
  loomUrl?: string;

  caseStudy?: string;

  completedAt?: Date;
};
```

---

## Streak

```ts id="l3c9ab"
type Streak = {
  userId: string;

  count: number;

  lastDate: string;

  activeDays: string[];
};
```

---

# Persistence Strategy

## Primary

MongoDB Atlas

Source of truth.

---

## Optional localStorage Cache

Used only for:

- optimistic UI writes
- temporary offline drafts

Keys:

```ts id="m4d1bc"
az - cache - progress;
az - cache - notes;
az - cache - drafts;
```

Rule:

localStorage is write-ahead only.

Server response always overwrites local cache.

Server is always source of truth.

Conflict resolution:

- pending writes sync
- server confirms
- local replaced

---

# Tech Stack

Frontend:

- Next.js 16.2.4
- React 19.2.4
- React DOM 19.2.4
- TypeScript

Authentication:

- NextAuth v5

Database:

- MongoDB Atlas

ODM:

- Mongoose

UI:

- Tailwind v4
- ShadCN UI

---

# App Architecture

```text id="n5e2cd"
AutoZen
├── Next.js App Router
├── NextAuth v5
├── MongoDB Atlas
├── Mongoose Models
├── Progress APIs
├── Resource APIs
├── Notes APIs
├── Project APIs
└── localStorage write-ahead cache
```

---

# API Routes

```text id="o6f3de"
Authentication
POST   /api/auth/signup
POST   /api/auth/login

Progress
GET    /api/progress
PATCH  /api/progress

Resources
GET    /api/resources
POST   /api/resources
PATCH  /api/resources/:id
DELETE /api/resources/:id

Notes
GET    /api/notes
POST   /api/notes
PATCH  /api/notes/:id

Projects
GET    /api/projects
POST   /api/projects
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

---

# Success Metrics

Measure:

- Weekly active learners
- Roadmap completion rate
- Streak retention
- Projects completed
- Month 6 completion rate

---

# Product Goal

Help learners go from:

“I’m consuming random AI automation content…”

to

“I’m following a structured path, syncing progress across devices, building projects, and becoming an AI Automation Builder.”
