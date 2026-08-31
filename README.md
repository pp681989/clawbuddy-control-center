# ClawBuddy Mission Control

# Lovable Prompt: ClawBuddy LiteKit — AI Agent Command Center

## What to Build

Build **ClawBuddy** — a sleek, dark-themed AI agent command center dashboard. This is a standalone React app that serves as mission control for AI agents. Think of it as a "NASA mission control" for your AI workforce. It should feel premium, futuristic, and data-rich.

This is a **demo/starter kit** — all data is mock/local state. No backend needed. The dashboard should feel alive with animations, glowing accents, and real-time-looking updates.

---

## Design System

```

Background:          #0a0a0f (near-black with slight blue tint)

Surface cards:       rgba(17, 24, 39, 0.7) with backdrop-filter: blur(16px)

Surface border:      rgba(255, 255, 255, 0.06)

Primary accent:      #10b981 (Emerald green — the signature color)

Cyan accent:         #06b6d4 (for "live" and "active" states)

Amber accent:        #f59e0b (warnings, pending)

Red accent:          #ef4444 (errors, alerts)

Text primary:        #f9fafb

Text secondary:      #9ca3af

Text muted:          #6b7280

Font (headings):     Space Grotesk (import from Google Fonts)

Font (mono/data):    JetBrains Mono (import from Google Fonts)

Glow effects:        CSS box-shadow with primary/cyan at 20-40% opacity

Card style:          Glass-morphic — use a reusable "glass-card" CSS class:

                     background: rgba(17, 24, 39, 0.7);

                     backdrop-filter: blur(16px);

                     border: 1px solid rgba(255, 255, 255, 0.06);

                     border-radius: 12px;

Animations:          Framer Motion for all transitions (stagger, fade, slide)

Icons:               Lucide React

UI components:       shadcn/ui (Badge, Tabs, Select, ScrollArea, Dialog, Button, Input, Toggle)

Charts:              Recharts (PieChart, BarChart) — used in Meeting Intelligence tab

Sanitization:        DOMPurify — sanitize markdown summaries in meeting details

Date formatting:     date-fns (format, parseISO, isAfter, subDays)

```

---

## Page Layout

Single page app with a **top header** and **tabbed content area**:

```

┌──────────────────────────────────────────────────────────────────────────┐

│  🐾 ClawBuddy                              🟢 Agent Alpha: Online  [⚙️] │

│  AI Agent Command Center                    Last seen: just now         │

├──────────────────────────────────────────────────────────────────────────┤

│  [Command Deck] [Agents] [Task Board] [AI Log] [Council] [Meetings]    │

├──────────────────────────────────────────────────────────────────────────┤

│                                                                          │

│                     (Tab content area)                                   │

│                                                                          │

└──────────────────────────────────────────────────────────────────────────┘

```

---

## TAB 1: Command Deck (Dashboard Overview)

The landing tab. A grid of metric cards + recent activity.

### Row 1: Metric Cards (4 cards, horizontal)

Each card: glass-card, icon with emerald glow, large number, small trend indicator.

### Row 2: Recent Activity Feed (Left 60%) + Agent Status (Right 40%)

**Activity Feed:** Scrollable list of recent events with agent emoji, action text, relative timestamp. Newest at top. Glass-card container.

**Agent Status Panel:** Small cards for each agent with colored status dot (green=active, yellow=idle, red=error, gray=offline), agent name, current activity, last seen.

---

## TAB 2: Agent Profiles

Grid of agent profile cards (3 columns desktop, 1 mobile). Each card shows emoji, name, subtitle, type, role, status, tasks completed, accuracy, skills list, and a "View Details" button.

Three agents pre-populated:

| Agent | Emoji | Type | Role | Accent Color |

|-------|-------|------|------|-------------|

| Agent Alpha | 🤖 | Code Agent | Lead Engineer | Emerald #10b981 |

| Dispatch Bot | 📋 | Coordinator | Operations Director | Amber #f59e0b |

| Audit Bot | 🛡️ | Quality Agent | Compliance Officer | Cyan #06b6d4 |

Users can customize these agent names and roles to match their own AI workforce.

---

## TAB 3: Task Board (Kanban)

A 4-column kanban board: To Do, Doing, Needs Input, Done.

Task cards: glass-card, title, assigned agent emoji, progress percentage (if doing), priority badge (low/medium/high/urgent as colored dots). Cards should be draggable between columns. Pre-populate with 10 mock tasks spread across all 4 columns.

---

## TAB 4: AI Log

A chronological feed of agent log entries with category badges: `observation` (emerald), `general` (gray), `reminder` (amber), `fyi` (cyan). Filter dropdown to show one category at a time. Pre-populate with 8-10 log entries from different agents.

---

## TAB 5: Council

Structured debate sessions between agents. Show 2 example council sessions. Each session: collapsible card with question, participant chips (emoji + name + sent/limit + status icon), status badge, message feed when expanded. Messages show agent emoji, name, message number (#1, #2, #3), and relative timestamp.

---

## TAB 6: Meeting Intelligence

A full meeting tracking dashboard. Pre-populate with 8-10 mock meetings.

### Row 1: KPI Cards (4 cards, horizontal)

Each card: glass-card style, icon with emerald glow, large number.

- **Total Meetings** — Calendar icon, number (e.g. 247)

- **This Week** — TrendingUp icon, number (e.g. 8)

- **Open Action Items** — CheckSquare icon, number (e.g. 12)

- **Avg Duration** — Clock icon, formatted (e.g. "34m")

### Row 2: Charts (2 columns)

- **Left: Meeting Type Distribution** — Recharts donut/pie chart with 6+ meeting types, each with a distinct color: 1-on-1 (#60a5fa), external (#a78bfa), sales (#34d399), team (#fb923c), standup (#818cf8), planning (#2dd4bf). Legend below.

- **Right: Monthly Trend** — Recharts bar chart. Group meetings by month, emerald bars.

### Row 3: Search + Filters

- Full-width search input with Search icon — filters meetings by title

- Filter pills: meeting type multi-select, date range (7d/30d/90d/All), "Has Action Items" toggle, "External Only" toggle

- Sort dropdown: Most Recent, Oldest First, Longest Duration

### Row 4: Meeting Feed

Scrollable list of meeting cards (paginated, 25 per page):

**Each card shows:**

- Meeting type badge (colored pill)

- Title (bold)

- Date (relative or absolute)

- Duration ("45m" or "1h 15m")

- Attendee avatars (circular initials, max 3 shown + "+N" overflow)

- Action item count badge (if any)

- Globe icon if has external participants

**Click to expand** — slides open detail panel:

- Full summary text (mock markdown)

- Action items list with checkboxes

- AI insights line (muted, Sparkles icon)

- Attendee list, external domains

- "Open Recording" and "Share Link" buttons

- "Send To..." dropdown: Action Items, Proposals, Lead Magnets

### Mock Data Shape

```json

{

  "type": "meeting",

  "title": "Weekly Standup with Engineering",

  "date": "2026-02-25T10:00:00Z",

  "duration_minutes": 30,

  "duration_display": "30m",

  "attendees": ["Alice", "Bob", "Charlie"],

  "summary": "Discussed sprint progress. Backend API 80% complete...",

  "action_items": [

    {"task": "Review PR #42", "assignee": "Alice", "done": false},

    {"task": "Update docs", "assignee": "Bob", "done": true}

  ],

  "ai_insights": "30 min meeting with 3 attendees",

  "meeting_type": "standup",

  "sentiment": "positive",

  "has_external_participants": false,

  "external_domains": [],

  "fathom_url": null,

  "share_url": null

}

```

Pre-populate with diverse meeting types: 2 standups, 2 sales calls (with external attendees), 1 interview, 1 all-hands, 2 1-on-1s, 1 planning session, 1 team meeting.

---

## Header Component

Left: Paw icon (🐾) + "ClawBuddy" in bold + subtitle "AI Agent Command Center"

Right: Active agent status — colored dot + agent name + current activity + last seen

Glass-card background with subtle emerald glow on left border. The status dot should pulse gently when the agent is active.

---

## Animations & Polish

1. Page load: Tabs fade in with stagger (50ms delay between each)

2. Tab switch: Content crossfades (200ms)

3. Cards: Hover effect — subtle lift + border glow intensifies

4. Status dots: Pulse animation for active agents (2s loop)

5. Metric cards: Numbers count up on first render

6. Log entries: Slide in from left with stagger

7. Task cards: Subtle scale on hover (1.02x)

8. Council expand: Smooth height animation with message stagger

9. Unread badge: Gentle bounce when count > 0

---

## Responsive

- Desktop (>1024px): Full layout, 3-column agent grid, side-by-side dashboard panels

- Tablet (768-1024px): 2-column agent grid, stack dashboard panels vertically

- Mobile (<768px): Single column everything, kanban columns horizontal scroll

---

## Important Notes

1. No backend. Everything runs on local mock data and React state.

2. The vibe is "premium dark dashboard." Think GitHub Dark, Linear, Vercel.

3. Glass-morphism is the signature look. Every card gets backdrop blur.

4. Emerald (#10b981) is THE accent color. Cyan is secondary.

5. Performance: Keep animations subtle and GPU-friendly.

6. Branding: The app is called "ClawBuddy" with the paw icon (🐾).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://clawbuddy-control-center.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f61520b2-eeac-42fc-95c1-dd595ab4f7eb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
