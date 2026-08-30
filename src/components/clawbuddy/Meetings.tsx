import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DOMPurify from "dompurify";
import { format, isAfter, parseISO, subDays } from "date-fns";
import {
  Calendar,
  CheckSquare,
  Clock,
  Globe,
  Link2,
  PlaySquare,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  formatDuration,
  meetings,
  meetingTypeColors,
  totalMeetingsAllTime,
  type Meeting,
  type MeetingType,
} from "@/lib/clawbuddy-data";
import { CountUp, GlassPanel, MotionGrid, fadeItem } from "./shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;
const RANGES = [
  { id: "7", label: "7d" },
  { id: "30", label: "30d" },
  { id: "90", label: "90d" },
  { id: "all", label: "All" },
];

function mdToHtml(md: string) {
  const html = md
    .split("\n")
    .map((line) => {
      const bolded = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (line.startsWith("- ")) return `<li>${bolded.slice(2)}</li>`;
      return line.trim() ? `<p>${bolded}</p>` : "";
    })
    .join("");
  return DOMPurify.sanitize(html);
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="text-data grid size-7 place-items-center rounded-full border border-border/60 bg-secondary text-[10px] font-semibold">
      {initials}
    </span>
  );
}

export function Meetings() {
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<MeetingType[]>([]);
  const [range, setRange] = useState("all");
  const [hasActions, setHasActions] = useState(false);
  const [externalOnly, setExternalOnly] = useState(false);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const allTypes = useMemo(
    () => Array.from(new Set(meetings.map((m) => m.meeting_type))) as MeetingType[],
    [],
  );

  const openActionItems = meetings.reduce(
    (n, m) => n + m.action_items.filter((a, i) => !(done[`${m.id}-${i}`] ?? a.done)).length,
    0,
  );
  const avgDuration = Math.round(
    meetings.reduce((n, m) => n + m.duration_minutes, 0) / meetings.length,
  );
  const thisWeek = meetings.filter((m) => isAfter(parseISO(m.date), subDays(new Date(2026, 7, 30), 7))).length;

  const typeData = allTypes.map((t) => ({
    name: t,
    value: meetings.filter((m) => m.meeting_type === t).length,
    color: meetingTypeColors[t],
  }));

  const monthData = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of meetings) {
      const key = format(parseISO(m.date), "yyyy-MM");
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map, ([key, count]) => ({ key, month: format(parseISO(`${key}-01`), "MMM yyyy"), count })).sort((a, b) =>
      a.key.localeCompare(b.key),
    );
  }, []);

  const filtered = useMemo(() => {
    let list = meetings.filter((m) => m.title.toLowerCase().includes(query.trim().toLowerCase()));
    if (types.length) list = list.filter((m) => types.includes(m.meeting_type));
    if (range !== "all") {
      const cutoff = subDays(new Date(2026, 7, 30), Number(range));
      list = list.filter((m) => isAfter(parseISO(m.date), cutoff));
    }
    if (hasActions) list = list.filter((m) => m.action_items.length > 0);
    if (externalOnly) list = list.filter((m) => m.has_external_participants);
    const sorted = [...list];
    if (sort === "recent") sorted.sort((a, b) => +parseISO(b.date) - +parseISO(a.date));
    if (sort === "oldest") sorted.sort((a, b) => +parseISO(a.date) - +parseISO(b.date));
    if (sort === "longest") sorted.sort((a, b) => b.duration_minutes - a.duration_minutes);
    return sorted;
  }, [query, types, range, hasActions, externalOnly, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const kpis = [
    { label: "Total Meetings", value: totalMeetingsAllTime, icon: Calendar, display: null as string | null },
    { label: "This Week", value: thisWeek, icon: TrendingUp, display: null },
    { label: "Open Action Items", value: openActionItems, icon: CheckSquare, display: null },
    { label: "Avg Duration", value: avgDuration, icon: Clock, display: formatDuration(avgDuration) },
  ];

  return (
    <div className="space-y-5">
      <MotionGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <motion.div key={k.label} variants={fadeItem}>
            <GlassPanel hover className="h-full">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary glow-primary">
                <k.icon className="size-5" />
              </span>
              <p className="mt-4 text-3xl font-bold">
                {k.display ?? <CountUp value={k.value} />}
              </p>
              <p className="text-sm text-muted-foreground">{k.label}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </MotionGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassPanel>
          <h2 className="text-base font-semibold">Meeting Type Distribution</h2>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3} stroke="none">
                  {typeData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {typeData.map((d) => (
              <li key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} · {d.value}
              </li>
            ))}
          </ul>
        </GlassPanel>

        <GlassPanel>
          <h2 className="text-base font-semibold">Monthly Trend</h2>
          <div className="mt-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData}>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "oklch(1 0 0 / 5%)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={72} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search meetings by title…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {allTypes.map((t) => (
            <Toggle
              key={t}
              size="sm"
              pressed={types.includes(t)}
              onPressedChange={(p) => {
                setTypes((prev) => (p ? [...prev, t] : prev.filter((x) => x !== t)));
                setPage(1);
              }}
              className="rounded-full border border-border/60 text-xs"
            >
              {t}
            </Toggle>
          ))}
          <span className="mx-1 h-6 w-px bg-border" />
          {RANGES.map((r) => (
            <Toggle
              key={r.id}
              size="sm"
              pressed={range === r.id}
              onPressedChange={() => {
                setRange(r.id);
                setPage(1);
              }}
              className="rounded-full border border-border/60 text-xs"
            >
              {r.label}
            </Toggle>
          ))}
          <span className="mx-1 h-6 w-px bg-border" />
          <Toggle
            size="sm"
            pressed={hasActions}
            onPressedChange={setHasActions}
            className="rounded-full border border-border/60 text-xs"
          >
            Has Action Items
          </Toggle>
          <Toggle
            size="sm"
            pressed={externalOnly}
            onPressedChange={setExternalOnly}
            className="rounded-full border border-border/60 text-xs"
          >
            External Only
          </Toggle>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="ml-auto w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="longest">Longest Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassPanel>

      <GlassPanel>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Meeting Feed</h2>
          <span className="text-data text-xs text-muted-foreground">{filtered.length} results</span>
        </div>

        <ScrollArea className="mt-4 max-h-[40rem] pr-3">
          <div className="space-y-3">
            {current.map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                expanded={expanded === m.id}
                onToggle={() => setExpanded(expanded === m.id ? null : m.id)}
                done={done}
                setDone={setDone}
              />
            ))}
            {current.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">No meetings match these filters.</p>
            )}
          </div>
        </ScrollArea>

        {pageCount > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-data text-xs text-muted-foreground">
              Page {page} of {pageCount}
            </span>
            <Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

function MeetingCard({
  meeting,
  expanded,
  onToggle,
  done,
  setDone,
}: {
  meeting: Meeting;
  expanded: boolean;
  onToggle: () => void;
  done: Record<string, boolean>;
  setDone: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const color = meetingTypeColors[meeting.meeting_type];
  const shown = meeting.attendees.slice(0, 3);
  const overflow = meeting.attendees.length - shown.length;

  return (
    <div className={cn("glass-card glass-hover overflow-hidden")}>
      <button onClick={onToggle} className="w-full p-4 text-left" aria-expanded={expanded}>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-data rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
          >
            {meeting.meeting_type}
          </span>
          {meeting.has_external_participants && <Globe className="size-3.5 text-cyan" />}
          {meeting.action_items.length > 0 && (
            <Badge variant="outline" className="border-amber/40 bg-amber/10 text-amber">
              {meeting.action_items.length} action items
            </Badge>
          )}
        </div>
        <h3 className="mt-2 text-sm font-semibold">{meeting.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="text-data text-xs text-muted-foreground">
            {format(parseISO(meeting.date), "MMM d, yyyy · HH:mm")}
          </span>
          <span className="text-data text-xs text-muted-foreground">{meeting.duration_display}</span>
          <span className="flex items-center -space-x-2">
            {shown.map((a) => (
              <Initials key={a} name={a} />
            ))}
            {overflow > 0 && (
              <span className="text-data grid size-7 place-items-center rounded-full border border-border/60 bg-secondary text-[10px]">
                +{overflow}
              </span>
            )}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border/60 p-4">
              <div
                className="space-y-2 text-sm text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: mdToHtml(meeting.summary) }}
              />

              {meeting.action_items.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action Items</h4>
                  <ul className="mt-2 space-y-2">
                    {meeting.action_items.map((a, i) => {
                      const key = `${meeting.id}-${i}`;
                      const checked = done[key] ?? a.done;
                      return (
                        <li key={key} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => setDone((p) => ({ ...p, [key]: !!v }))}
                            id={key}
                          />
                          <label htmlFor={key} className={cn("cursor-pointer", checked && "text-muted-foreground line-through")}>
                            {a.task} <span className="text-data text-xs text-muted-foreground">· {a.assignee}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <Sparkles className="mt-0.5 size-3.5 text-primary" />
                {meeting.ai_insights}
              </p>

              <div className="text-data grid gap-1 text-xs text-muted-foreground">
                <span>Attendees: {meeting.attendees.join(", ")}</span>
                {meeting.external_domains.length > 0 && <span>External: {meeting.external_domains.join(", ")}</span>}
                <span>Sentiment: {meeting.sentiment}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info(meeting.fathom_url ? "Opening recording…" : "No recording available")}
                >
                  <PlaySquare className="size-4" /> Open Recording
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success(meeting.share_url ? "Share link copied" : "Share link generated")}
                >
                  <Link2 className="size-4" /> Share Link
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">Send To…</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {["Action Items", "Proposals", "Lead Magnets"].map((d) => (
                      <DropdownMenuItem key={d} onClick={() => toast.success(`Sent to ${d}`)}>
                        {d}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
