# ClawBuddy — Audit & Backend Integration Plan

## Part 1 — Audit of the current app

### Framework & architecture
- TanStack Start v1 (React 19, Vite 8), file-based routing under `src/routes/`, Cloudflare-style edge server runtime.
- Single route: `src/routes/index.tsx` — one page with six client-side tabs (Command Deck, Agents, Task Board, AI Log, Council, Meetings). No nested routes, no loaders.
- `@tanstack/react-query` is installed but **not used anywhere** — no queries, no fetching layer.
- UI: shadcn/ui + Tailwind v4 tokens in `src/styles.css`, `motion` animations, `recharts` for meeting charts, `dompurify` for summary markdown.

### Backend / Cloud status
- **Lovable Cloud (Supabase) is NOT connected.** No `src/integrations/supabase/*`, no `supabase/` folder, no Supabase env vars, no `@supabase/supabase-js` dependency.
- **Tables: none** (no database exists yet).
- **Edge Functions: none.**
- **Authentication: not implemented.** No auth routes, no `_authenticated/` gate, no session handling. The dashboard is fully public.
- **API calls the frontend makes today: zero.** No `fetch`, no server functions, no server routes. Everything renders from in-memory constants.

### Where mock data lives
All of it in one file: **`src/lib/clawbuddy-data.ts`** (418 lines) — types plus hardcoded arrays:
- `agents: Agent[]` — 3 agents (status, currentActivity, tasksCompleted, accuracy, skills, accent)
- `activityEvents: ActivityEvent[]` — 9 feed rows keyed by `minutesAgo`
- `columns` + `initialTasks: Task[]` — kanban columns and 10 tasks (column, progress, priority)
- `logEntries: LogEntry[]` — 9 entries, category `observation | general | reminder | fyi`
- `councilSessions: CouncilSession[]` — 2 debates with participants + messages
- `meetings: Meeting[]` + `meetingTypeColors` + `totalMeetingsAllTime` — 10 meetings with summary, action_items, ai_insights, sentiment, external domains
- Helpers: `formatDuration`

There are **no data hooks** — components import the constants directly. Relative times are derived from `minutesAgo` integers via `relativeTime` in `src/components/clawbuddy/shared.tsx`, not from real timestamps.

### Which components consume mock data
| File | Imports | Local state |
| --- | --- | --- |
| `Header.tsx` | `agents` | none |
| `CommandDeck.tsx` | `agents`, `activityEvents`, `initialTasks` | none |
| `AgentProfiles.tsx` | `agents` | selected agent dialog |
| `TaskBoard.tsx` | `agents`, `columns`, `initialTasks` | `useState(initialTasks)` — drag-and-drop mutates local state only, changes are lost on reload |
| `AiLog.tsx` | `agents`, `logEntries` | category/agent filters |
| `Council.tsx` | `agents`, `councilSessions` | expanded card |
| `Meetings.tsx` | `meetings`, `meetingTypeColors`, `formatDuration`, `totalMeetingsAllTime` | search, filters, expanded row, action-item checkboxes (local only) |
| `shared.tsx` | `AgentStatus` type | — |

### What must change to go real
1. Enable Lovable Cloud (database + auth + secrets).
2. Replace `minutesAgo` / `duration_display` derived fields with real `timestamptz` columns and compute display client-side.
3. Introduce a data layer (TanStack Query + server functions) so each component reads from queries instead of module constants.
4. Persist mutations that are currently local-only: task drag-and-drop (`column`), meeting action-item checkboxes (`done`).
5. Add auth + RLS so the dashboard is per-user/per-org rather than global.
6. Add an ingestion path so the real OpenClaw/ClawBuddy agent runtime writes agent status, tasks, logs, council messages into the database.

## Part 2 — Target architecture

```text
Browser (ClawBuddy UI)
  |  TanStack Query -> createServerFn (RPC, same origin, bearer-authed)
  v
TanStack Start server layer  [holds OPENCLAW_API_KEY / gateway URL]
  |  outbound HTTPS, mTLS or signed request
  v
ClawBuddy / OpenClaw gateway  -> real agents
  |  webhook POST (HMAC-signed)
  v
/api/public/openclaw/webhook (TanStack server route, signature-verified)
  |  service-role write
  v
Supabase (Postgres + RLS)  -> Realtime subscription -> dashboard updates live
```

Important stack note: this project is TanStack Start, which already has its own
server runtime. The correct server-side integration layer here is
`createServerFn` + server routes under `src/routes/api/`, **not** Supabase Edge
Functions — they play the exact same role as Edge Functions do in a Vite/SPA
Lovable project (secrets stay server-side, never bundled to the client). Edge
Functions would add a second deploy target with no benefit. Everything below
maps 1:1 onto the Edge-Function architecture you described.

### Read path
Supabase is the single source of truth the dashboard reads. Two flavours:
- Live data (agents, tasks, logs, council): browser Supabase client + Realtime, RLS-scoped to the user's org — instant updates, no polling.
- Aggregates/KPIs (Meetings charts, counts): `createServerFn` with `requireSupabaseAuth`, so heavy grouping happens server-side.

### Write path
- Dashboard-initiated actions (assign task, move kanban column, open a council session, tick an action item) → authed `createServerFn` → validate with Zod → write to Supabase → if the action must reach a real agent, the same handler calls the OpenClaw gateway with the server-held credential.
- Agent-initiated updates (status changes, progress, new log lines, council replies) → OpenClaw gateway POSTs to `/api/public/openclaw/webhook` → HMAC verified against `OPENCLAW_WEBHOOK_SECRET` → `supabaseAdmin` upsert → Realtime pushes to the UI.

### Proposed schema (all `public`, RLS on, explicit GRANTs)
- `organizations`, `org_members(user_id, org_id, role)`
- `user_roles(user_id, role app_role)` + `has_role()` security-definer fn (roles never on profiles)
- `agents(id, org_id, external_id, name, emoji, subtitle, type, role, status, current_activity, last_seen_at, tasks_completed, accuracy, skills text[], accent)`
- `agent_events(id, org_id, agent_id, action, created_at)` → activity feed
- `tasks(id, org_id, agent_id, title, column, progress, priority, created_at, updated_at)`
- `agent_logs(id, org_id, agent_id, category, message, created_at)`
- `council_sessions(id, org_id, question, status)`, `council_participants(session_id, agent_id, sent, limit, done)`, `council_messages(id, session_id, agent_id, idx, text, created_at)`
- `meetings(...)` + `meeting_action_items(id, meeting_id, task, assignee, done)`
- Optional `agent_commands(id, org_id, agent_id, kind, payload, status)` as the outbound audit log for anything sent to OpenClaw.

RLS pattern: members select/mutate rows where `org_id` is in their memberships; only `service_role` writes ingestion tables; no broad `anon` policies.

### Files to change (nothing implemented yet)
| Now | Becomes |
| --- | --- |
| `src/lib/clawbuddy-data.ts` mock arrays | deleted; types move to generated `Database` types + a thin `src/lib/clawbuddy-types.ts` for view models. `meetingTypeColors`, `formatDuration`, `columns` stay (presentation constants) |
| direct `agents` import in `Header`, `CommandDeck`, `AgentProfiles` | `useAgents()` hook → Supabase select + Realtime |
| `activityEvents` in `CommandDeck` | `useAgentEvents(limit)` |
| `initialTasks` + local `useState` in `TaskBoard` | `useTasks()` + `moveTask` server fn (optimistic update, then persist `column`) |
| `logEntries` in `AiLog` | `useAgentLogs({ category, agentId })` — filters pushed into the query |
| `councilSessions` in `Council` | `useCouncilSessions()` + `useCouncilMessages(sessionId)` |
| `meetings`, `totalMeetingsAllTime` in `Meetings` | `useMeetings(filters)` + `getMeetingStats` server fn; action-item toggle → `toggleActionItem` server fn |
| `relativeTime(minutesAgo)` in `shared.tsx` | `relativeTime(isoTimestamp)` using `date-fns` |
| n/a | `src/lib/openclaw.server.ts` (gateway client, reads secrets inside handlers), `src/lib/agents.functions.ts`, `src/lib/tasks.functions.ts`, `src/lib/meetings.functions.ts`, `src/routes/api/public/openclaw/webhook.ts` |
| n/a | `/auth` route + `src/routes/_authenticated/` subtree; dashboard moves to `/dashboard`, `/` becomes a public landing page |

### Security posture
- `OPENCLAW_API_URL`, `OPENCLAW_API_KEY`, `OPENCLAW_WEBHOOK_SECRET` stored as Cloud secrets, read via `process.env[...]` **inside handler bodies only**. Never `VITE_`-prefixed, never imported into a component, never returned in a response.
- Gateway stays private: outbound calls only, from the server layer. The single inbound surface is the signed webhook route; HMAC over the raw body with a timing-safe compare, plus a timestamp/replay window. No public unauthenticated endpoints.
- `supabaseAdmin` (service role) used only in the verified webhook and admin maintenance — never for ordinary reads.
- Least privilege: RLS on every table, org-scoped policies, `authenticated`-only GRANTs, no `anon` SELECT on agent/task/log data, Zod validation on every server-fn input, and role checks via `has_role()` for destructive agent commands.
- Rate-limit both the webhook and command server fns; log every outbound agent command to `agent_commands`.

### Suggested rollout
1. Enable Cloud; migration for schema + GRANTs + RLS + a small seed so the UI is never empty.
2. Auth (`/auth`, `_authenticated/dashboard`, session-aware header) — no behaviour change to the tabs yet.
3. Read migration tab by tab: Command Deck → Agents → Task Board → AI Log → Council → Meetings.
4. Persist mutations (kanban moves, action items) + Realtime.
5. OpenClaw outbound client + signed webhook ingestion; retire remaining mock arrays.

Open questions before implementation: is ClawBuddy multi-tenant (orgs) or single-user? Does the OpenClaw gateway support outbound webhooks, or must we poll it? And are Meetings sourced from OpenClaw too, or from a separate provider such as Fathom?
