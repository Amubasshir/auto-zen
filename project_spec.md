# AutoZen Project Specification

## Product Name

**AutoZen**

## Core Problem

New AI automation learners often fail not because the learning path is bad, but because they lose structure while following it.

Common problems:

- Watch random YouTube tutorials without continuity
- Jump between tools (n8n, agents, Python, APIs) without a roadmap
- Learn unplanned and forget where they left off
- Don’t know what to study today
- Add resources in scattered places (bookmarks, Notion, notes, browser tabs)
- Build projects but don’t track them as portfolio assets
- Lose momentum and quit halfway through

This creates:

- fragmented learning
- low completion rates
- no measurable progress
- weak portfolio outcomes
- slower path to becoming an AI Automation Builder

## Solution

AutoZen is a structured learning tracking dashboard built specifically for AI automation learners following a 6-month roadmap.

It combines:

- Structured roadmap tracking
- Daily learning guidance
- Progress tracking
- Streak & consistency system
- Custom resource management
- Project portfolio tracking
- Notes and reflection

AutoZen helps learners stay on track, finish the roadmap, and turn learning into real project outcomes.

## Target Users

### Primary User

**AI automation learners**
People following a structured path to become an AI Automation Builder in ~6 months.

### Secondary User (future)

- AI automation freelancers
- Internal automation teams
- Automation agencies onboarding juniors

## MVP Scope (V1)

### Included in MVP

- 6-month roadmap tracking
- Month → Week → Item → Task progress tracking
- Today View (daily learning dashboard)
- Progress dashboard
- Streak tracking
- Custom learning resources
- Notes
- Project portfolio tracker
- Inactivity recovery prompts
- Local-first persistence (browser storage)

### Excluded from MVP (Later Versions)

- Journal module
- AI coaching assistant
- Team collaboration
- User accounts
- Cloud sync
- Social/community features
- Paid marketplace/templates

## Core Features

## 1. Onboarding

First-time user setup:

Questions:

- Which path are you following?
  - No-Code Path
  - Developer Path

- Hours per week available

- Weekly learning target

- Start date

Based on this:

- initialize roadmap
- personalize pacing
- generate “Today” learning queue

## 2. Header Bar

Persistent header:

Shows:

- AutoZen logo/title
- Overall Progress Bar
- Global completion %
- Current Streak (🔥)
- Resume Last Item quick button

## 3. Left Sidebar

Contains:

- Dashboard
- Today
- 6 Month roadmap navigation

Each month card shows:

- Month title
- Progress bar
- Done/Total count

Bottom:

- 28-day activity grid

## 4. Today View (Primary Daily Screen)

This is the default screen.

Shows:

- Today’s recommended learning item
- Continue unfinished item
- Pending tasks
- Time estimate for today
- Streak status
- Resume where you left off

## 5. Dashboard Overview

Shows:

- Overall Progress %
- Items Completed
- Months Started
- Current Streak

Below:

6 month cards grid:

Each shows:

- Goal
- Progress
- Milestone
- Open Month button

## 6. Month View

Each month contains:

- Month goal
- Month milestone
- Month progress bar

Below:

4 Week Sections

## 7. Week Sections

Each week includes:

- Expand/collapse section
- Item list
- Notes button
- Add Resource button

## 8. Item Tracking

Each learning item contains:

- Checkbox complete/incomplete
- Item title
- Task progress (ex: 3/6)
- Open Detail

Inside item detail:

- Resource link
- Task checklist
- Mark complete

Completing updates:

- Item progress
- Week progress
- Month progress
- Global progress
- Streak

## 9. Custom Resource Feature

Users can add their own resources per week.

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

Estimated duration

Optional custom tasks

## 10. Notes

Per-week notes.

Freeform text.

Auto-save.

## 11. Project Portfolio Tracker

Track projects built from roadmap.

Each project stores:

- Title

- Project type

- Status
  - Planned
  - In Progress
  - Completed

- GitHub URL

- Demo URL

- Loom URL

- Case Study Notes

- Completion date

## 12. Streak System

Actions that count:

- Complete item
- Complete task
- Add project progress

Logic:

- Activity today + yesterday → streak +1
- Miss a day → reset

## 13. Inactivity Recovery

After 3 days:

- Resume where you left off

After 5 days:

- You’re falling behind

After 7+ days:

- Offer restart plan

## Data Model

## Static Roadmap Data

### Month

```ts
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

```ts
type Week = {
  id: string;
  monthId: string;
  weekNumber: number;
  title: string;
  items: Item[];
};
```

### Item

```ts
type Item = {
  id: string;
  weekId: string;
  title: string;
  url?: string;
  tasks: Task[];
};
```

### Task

```ts
type Task = {
  id: string;
  itemId: string;
  label: string;
};
```

## User State Data

### User

```ts
type User = {
  pathType: 'no-code' | 'developer';
  weeklyHours: number;
  weeklyTarget: number;
  startDate: string;
};
```

### RoadmapProgress

```ts
type RoadmapProgress = {
  completedItems: Record<string, boolean>;
  completedTasks: Record<string, boolean>;
  lastActiveItem: string;
};
```

### CustomResource

```ts
type CustomResource = {
  id: string;
  weekId: string;
  title: string;
  url: string;
  type: string;
  difficulty: string;
  duration: string;
  tasks: string[];
  createdAt: string;
};
```

### Note

```ts
type Note = {
  id: string;
  weekId: string;
  content: string;
  updatedAt: string;
};
```

### ProjectPortfolio

```ts
type ProjectPortfolio = {
  id: string;
  title: string;
  status: string;
  githubUrl?: string;
  demoUrl?: string;
  loomUrl?: string;
  caseStudy?: string;
  completedAt?: string;
};
```

### Streak

```ts
type Streak = {
  count: number;
  lastDate: string;
  activeDays: string[];
};
```

## Persistence Strategy

Use localStorage only.

Keys:

```ts
az: user;
az: progress;
az: tasks;
az: notes;
az: streak;
az: custom;
az: projects;
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind v4
- ShadCN UI
- localStorage

## Future V2+

- AI learning coach
- Cloud sync
- Team mode
- Marketplace
- Community features

## Success Metrics

Measure:

- Weekly active learners
- Roadmap completion rate
- Streak retention
- Custom resources added
- Projects completed
- Month 6 completion rate

## Product Goal

Help learners go from:

“I’m consuming random AI automation content…”

to

“I’m following a structured path, finishing projects, building a portfolio, and becoming an AI Automation Builder.”
