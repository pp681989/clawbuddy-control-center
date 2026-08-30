export type AgentStatus = "active" | "idle" | "error" | "offline";

export type Agent = {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  type: string;
  role: string;
  status: AgentStatus;
  currentActivity: string;
  lastSeen: string;
  tasksCompleted: number;
  accuracy: number;
  skills: string[];
  accent: "primary" | "amber" | "cyan";
};

export const agents: Agent[] = [
  {
    id: "alpha",
    name: "Agent Alpha",
    emoji: "🤖",
    subtitle: "Autonomous build & refactor specialist",
    type: "Code Agent",
    role: "Lead Engineer",
    status: "active",
    currentActivity: "Refactoring billing module",
    lastSeen: "just now",
    tasksCompleted: 1284,
    accuracy: 98.4,
    skills: ["TypeScript", "Code review", "Test generation", "Refactoring", "CI triage"],
    accent: "primary",
  },
  {
    id: "dispatch",
    name: "Dispatch Bot",
    emoji: "📋",
    subtitle: "Routes work across the agent fleet",
    type: "Coordinator",
    role: "Operations Director",
    status: "idle",
    currentActivity: "Awaiting new task intake",
    lastSeen: "4m ago",
    tasksCompleted: 842,
    accuracy: 95.1,
    skills: ["Task routing", "Scheduling", "Escalation", "Capacity planning"],
    accent: "amber",
  },
  {
    id: "audit",
    name: "Audit Bot",
    emoji: "🛡️",
    subtitle: "Verifies output quality and compliance",
    type: "Quality Agent",
    role: "Compliance Officer",
    status: "active",
    currentActivity: "Scanning 12 pull requests",
    lastSeen: "just now",
    tasksCompleted: 611,
    accuracy: 99.2,
    skills: ["Policy checks", "Security review", "Data hygiene", "Reporting"],
    accent: "cyan",
  },
];

export type ActivityEvent = {
  id: string;
  agentId: string;
  action: string;
  minutesAgo: number;
};

export const activityEvents: ActivityEvent[] = [
  { id: "a1", agentId: "alpha", action: "Merged PR #481 — checkout retry logic", minutesAgo: 2 },
  { id: "a2", agentId: "audit", action: "Flagged 1 policy violation in export job", minutesAgo: 7 },
  { id: "a3", agentId: "dispatch", action: "Assigned 3 tasks to Agent Alpha", minutesAgo: 14 },
  { id: "a4", agentId: "alpha", action: "Generated 42 unit tests for pricing service", minutesAgo: 28 },
  { id: "a5", agentId: "audit", action: "Approved release candidate 2.14.0", minutesAgo: 46 },
  { id: "a6", agentId: "dispatch", action: "Escalated stalled task to human review", minutesAgo: 71 },
  { id: "a7", agentId: "alpha", action: "Resolved failing CI pipeline on main", minutesAgo: 96 },
  { id: "a8", agentId: "audit", action: "Completed weekly compliance sweep", minutesAgo: 140 },
  { id: "a9", agentId: "dispatch", action: "Rebalanced queue after capacity spike", minutesAgo: 188 },
];

export type Priority = "low" | "medium" | "high" | "urgent";
export type ColumnId = "todo" | "doing" | "input" | "done";

export type Task = {
  id: string;
  title: string;
  agentId: string;
  column: ColumnId;
  progress?: number;
  priority: Priority;
};

export const columns: { id: ColumnId; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "doing", label: "Doing" },
  { id: "input", label: "Needs Input" },
  { id: "done", label: "Done" },
];

export const initialTasks: Task[] = [
  { id: "t1", title: "Migrate auth service to v3 SDK", agentId: "alpha", column: "todo", priority: "high" },
  { id: "t2", title: "Draft Q3 agent capacity forecast", agentId: "dispatch", column: "todo", priority: "medium" },
  { id: "t3", title: "Add rate limiting to public API", agentId: "alpha", column: "todo", priority: "urgent" },
  { id: "t4", title: "Refactor billing module", agentId: "alpha", column: "doing", progress: 68, priority: "high" },
  { id: "t5", title: "Scan open pull requests", agentId: "audit", column: "doing", progress: 41, priority: "medium" },
  { id: "t6", title: "Rebalance task queue", agentId: "dispatch", column: "doing", progress: 87, priority: "low" },
  { id: "t7", title: "Confirm data retention policy", agentId: "audit", column: "input", priority: "urgent" },
  { id: "t8", title: "Approve vendor access request", agentId: "dispatch", column: "input", priority: "medium" },
  { id: "t9", title: "Ship release 2.14.0", agentId: "alpha", column: "done", priority: "high" },
  { id: "t10", title: "Weekly compliance sweep", agentId: "audit", column: "done", priority: "low" },
];

export type LogCategory = "observation" | "general" | "reminder" | "fyi";

export type LogEntry = {
  id: string;
  agentId: string;
  category: LogCategory;
  message: string;
  minutesAgo: number;
};

export const logEntries: LogEntry[] = [
  { id: "l1", agentId: "alpha", category: "observation", message: "Checkout latency dropped 22% after retry refactor.", minutesAgo: 3 },
  { id: "l2", agentId: "audit", category: "reminder", message: "SOC2 evidence bundle due in 4 days.", minutesAgo: 11 },
  { id: "l3", agentId: "dispatch", category: "general", message: "Queue depth normalized to 14 open tasks.", minutesAgo: 22 },
  { id: "l4", agentId: "audit", category: "fyi", message: "New policy pack v9 loaded into rule engine.", minutesAgo: 38 },
  { id: "l5", agentId: "alpha", category: "observation", message: "Test coverage on pricing service now 91%.", minutesAgo: 55 },
  { id: "l6", agentId: "dispatch", category: "reminder", message: "Human review needed on stalled task T-118.", minutesAgo: 88 },
  { id: "l7", agentId: "alpha", category: "general", message: "Nightly build finished in 6m 12s.", minutesAgo: 132 },
  { id: "l8", agentId: "audit", category: "observation", message: "Two exports contained unmasked emails; blocked.", minutesAgo: 174 },
  { id: "l9", agentId: "dispatch", category: "fyi", message: "Capacity headroom at 38% for next sprint.", minutesAgo: 240 },
];

export type CouncilMessage = {
  id: string;
  agentId: string;
  index: number;
  minutesAgo: number;
  text: string;
};

export type CouncilSession = {
  id: string;
  question: string;
  status: "concluded" | "in progress";
  participants: { agentId: string; sent: number; limit: number; done: boolean }[];
  messages: CouncilMessage[];
};

export const councilSessions: CouncilSession[] = [
  {
    id: "c1",
    question: "Should we ship the new pricing engine before the audit completes?",
    status: "concluded",
    participants: [
      { agentId: "alpha", sent: 2, limit: 2, done: true },
      { agentId: "audit", sent: 2, limit: 2, done: true },
      { agentId: "dispatch", sent: 1, limit: 2, done: true },
    ],
    messages: [
      { id: "c1m1", agentId: "alpha", index: 1, minutesAgo: 120, text: "Engine is feature complete and covered at 91%. Shipping behind a flag lets us collect real traffic data this week." },
      { id: "c1m2", agentId: "audit", index: 2, minutesAgo: 112, text: "Two data-handling checks are still open. A flagged rollout is acceptable only if EU traffic stays excluded." },
      { id: "c1m3", agentId: "dispatch", index: 3, minutesAgo: 104, text: "I can gate EU accounts at the router and keep rollout at 10% until audit clears." },
      { id: "c1m4", agentId: "alpha", index: 4, minutesAgo: 99, text: "Agreed — flagged 10% rollout, EU excluded, full launch after audit sign-off." },
      { id: "c1m5", agentId: "audit", index: 5, minutesAgo: 95, text: "Approved under those constraints. I'll report back within 48 hours." },
    ],
  },
  {
    id: "c2",
    question: "What is the right escalation threshold for stalled agent tasks?",
    status: "in progress",
    participants: [
      { agentId: "dispatch", sent: 2, limit: 3, done: false },
      { agentId: "alpha", sent: 1, limit: 3, done: false },
      { agentId: "audit", sent: 1, limit: 3, done: false },
    ],
    messages: [
      { id: "c2m1", agentId: "dispatch", index: 1, minutesAgo: 40, text: "Current threshold of 6 hours produces too many false escalations on long-running builds." },
      { id: "c2m2", agentId: "alpha", index: 2, minutesAgo: 34, text: "Suggest measuring progress deltas instead of wall clock — escalate when progress stalls 45 minutes." },
      { id: "c2m3", agentId: "audit", index: 3, minutesAgo: 26, text: "Any threshold must still guarantee a human sees compliance-tagged tasks within 2 hours." },
      { id: "c2m4", agentId: "dispatch", index: 4, minutesAgo: 18, text: "Then two tiers: progress-based for standard work, hard 2h cap for compliance-tagged." },
    ],
  },
];

export type MeetingType = "standup" | "sales" | "interview" | "all-hands" | "1-on-1" | "planning" | "team" | "external";

export type Meeting = {
  id: string;
  title: string;
  date: string;
  duration_minutes: number;
  duration_display: string;
  attendees: string[];
  summary: string;
  action_items: { task: string; assignee: string; done: boolean }[];
  ai_insights: string;
  meeting_type: MeetingType;
  sentiment: "positive" | "neutral" | "mixed";
  has_external_participants: boolean;
  external_domains: string[];
  fathom_url: string | null;
  share_url: string | null;
};

export const meetingTypeColors: Record<MeetingType, string> = {
  "1-on-1": "#60a5fa",
  external: "#a78bfa",
  sales: "#34d399",
  team: "#fb923c",
  standup: "#818cf8",
  planning: "#2dd4bf",
  interview: "#f472b6",
  "all-hands": "#facc15",
};

export function formatDuration(min: number) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export const meetings: Meeting[] = [
  {
    id: "m1",
    title: "Weekly Standup with Engineering",
    date: "2026-08-28T10:00:00Z",
    duration_minutes: 30,
    duration_display: "30m",
    attendees: ["Alice", "Bob", "Charlie"],
    summary:
      "**Sprint progress reviewed.** Backend API is 80% complete; the pricing service refactor landed behind a flag.\n\n- Frontend blocked on the new schema until Thursday\n- QA environment stabilized after CI fix",
    action_items: [
      { task: "Review PR #42", assignee: "Alice", done: false },
      { task: "Update API docs", assignee: "Bob", done: true },
    ],
    ai_insights: "30 min meeting with 3 attendees — tight agenda, no overruns.",
    meeting_type: "standup",
    sentiment: "positive",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: null,
  },
  {
    id: "m2",
    title: "Standup — Platform Squad",
    date: "2026-08-26T09:30:00Z",
    duration_minutes: 25,
    duration_display: "25m",
    attendees: ["Dana", "Eli", "Fern", "Gus"],
    summary: "**Queue depth normalized.** Dispatch routing changes reduced stalled tasks by 40%.",
    action_items: [{ task: "Document new escalation tiers", assignee: "Dana", done: false }],
    ai_insights: "Recurring meeting, consistently under 30 minutes.",
    meeting_type: "standup",
    sentiment: "neutral",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: null,
  },
  {
    id: "m3",
    title: "Discovery Call — Northwind Logistics",
    date: "2026-08-27T14:00:00Z",
    duration_minutes: 45,
    duration_display: "45m",
    attendees: ["Priya", "Sam", "M. Okafor", "L. Tran"],
    summary:
      "**Strong fit for agent automation.** Northwind runs 200+ manual dispatch decisions daily and wants an audit trail.\n\nBudget approved for a Q4 pilot.",
    action_items: [
      { task: "Send pilot scoping doc", assignee: "Priya", done: false },
      { task: "Prepare security questionnaire", assignee: "Sam", done: false },
    ],
    ai_insights: "High buying intent — pricing raised by the prospect twice.",
    meeting_type: "sales",
    sentiment: "positive",
    has_external_participants: true,
    external_domains: ["northwind-logistics.com"],
    fathom_url: "https://example.com/recording/m3",
    share_url: "https://example.com/share/m3",
  },
  {
    id: "m4",
    title: "Renewal Review — Halcyon Retail",
    date: "2026-08-21T16:30:00Z",
    duration_minutes: 55,
    duration_display: "55m",
    attendees: ["Priya", "R. Bell", "T. Ibarra"],
    summary: "**Renewal at risk.** Halcyon wants clearer reporting before committing to a 12-month term.",
    action_items: [
      { task: "Build custom reporting mock", assignee: "Priya", done: false },
      { task: "Escalate to account exec", assignee: "Sam", done: true },
    ],
    ai_insights: "Sentiment cooled in the final 10 minutes around pricing.",
    meeting_type: "sales",
    sentiment: "mixed",
    has_external_participants: true,
    external_domains: ["halcyonretail.io"],
    fathom_url: "https://example.com/recording/m4",
    share_url: null,
  },
  {
    id: "m5",
    title: "Interview — Senior Platform Engineer",
    date: "2026-08-25T13:00:00Z",
    duration_minutes: 60,
    duration_display: "1h",
    attendees: ["Bob", "Fern", "Candidate"],
    summary: "**Strong systems depth.** Candidate designed a multi-tenant queue at previous role; weaker on frontend.",
    action_items: [{ task: "Schedule final loop", assignee: "Fern", done: false }],
    ai_insights: "60 min meeting with 3 attendees — balanced speaking time.",
    meeting_type: "interview",
    sentiment: "positive",
    has_external_participants: true,
    external_domains: ["gmail.com"],
    fathom_url: null,
    share_url: null,
  },
  {
    id: "m6",
    title: "All-Hands — August Business Update",
    date: "2026-08-14T15:00:00Z",
    duration_minutes: 75,
    duration_display: "1h 15m",
    attendees: ["Alice", "Bob", "Charlie", "Dana", "Eli", "Fern", "Gus", "Priya"],
    summary: "**Revenue up 18% QoQ.** Agent platform adoption is the top company priority for Q4.",
    action_items: [{ task: "Publish recording to intranet", assignee: "Gus", done: true }],
    ai_insights: "Largest meeting of the month by attendee count.",
    meeting_type: "all-hands",
    sentiment: "positive",
    has_external_participants: false,
    external_domains: [],
    fathom_url: "https://example.com/recording/m6",
    share_url: "https://example.com/share/m6",
  },
  {
    id: "m7",
    title: "1-on-1 — Alice & Bob",
    date: "2026-08-24T11:00:00Z",
    duration_minutes: 30,
    duration_display: "30m",
    attendees: ["Alice", "Bob"],
    summary: "**Growth conversation.** Bob wants more ownership of the audit pipeline next quarter.",
    action_items: [{ task: "Draft ownership plan", assignee: "Alice", done: false }],
    ai_insights: "Recurring 1-on-1, cadence stable at weekly.",
    meeting_type: "1-on-1",
    sentiment: "positive",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: null,
  },
  {
    id: "m8",
    title: "1-on-1 — Dana & Priya",
    date: "2026-08-18T09:00:00Z",
    duration_minutes: 25,
    duration_display: "25m",
    attendees: ["Dana", "Priya"],
    summary: "**Handoff quality.** Sales-to-ops handoffs need a shared checklist to avoid rework.",
    action_items: [{ task: "Create handoff checklist", assignee: "Dana", done: false }],
    ai_insights: "Action item carried over from two prior sessions.",
    meeting_type: "1-on-1",
    sentiment: "neutral",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: null,
  },
  {
    id: "m9",
    title: "Q4 Roadmap Planning",
    date: "2026-08-12T13:30:00Z",
    duration_minutes: 90,
    duration_display: "1h 30m",
    attendees: ["Alice", "Charlie", "Dana", "Eli", "Priya"],
    summary: "**Three bets chosen:** agent council, meeting intelligence, and compliance automation.",
    action_items: [
      { task: "Write roadmap brief", assignee: "Charlie", done: false },
      { task: "Size compliance work", assignee: "Eli", done: false },
      { task: "Confirm hiring plan", assignee: "Alice", done: true },
    ],
    ai_insights: "Longest meeting this month — consider splitting into two sessions.",
    meeting_type: "planning",
    sentiment: "positive",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: "https://example.com/share/m9",
  },
  {
    id: "m10",
    title: "Team Sync — Agent Reliability",
    date: "2026-08-07T10:30:00Z",
    duration_minutes: 40,
    duration_display: "40m",
    attendees: ["Bob", "Fern", "Gus"],
    summary: "**Reliability review.** Two incidents traced to unbounded retries; fix scheduled.",
    action_items: [{ task: "Add retry ceiling", assignee: "Bob", done: true }],
    ai_insights: "40 min meeting with 3 attendees — focused on incident follow-ups.",
    meeting_type: "team",
    sentiment: "neutral",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: null,
  },
];

export const totalMeetingsAllTime = 247;
