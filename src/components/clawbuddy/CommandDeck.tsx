import { motion } from "motion/react";
import { Activity, Bot, CheckSquare, Gauge, TrendingUp } from "lucide-react";
import { activityEvents, agents, initialTasks } from "@/lib/clawbuddy-data";
import { CountUp, GlassPanel, MotionGrid, StatusDot, fadeItem, relativeTime } from "./shared";
import { ScrollArea } from "@/components/ui/scroll-area";

const metrics = [
  { label: "Active Agents", value: 2, icon: Bot, trend: "+1 this week", decimals: 0, suffix: "" },
  { label: "Tasks Completed", value: 2737, icon: CheckSquare, trend: "+184 vs last week", decimals: 0, suffix: "" },
  { label: "Fleet Accuracy", value: 97.6, icon: Gauge, trend: "+0.8 pts", decimals: 1, suffix: "%" },
  { label: "Open Tasks", value: initialTasks.filter((t) => t.column !== "done").length, icon: Activity, trend: "3 need input", decimals: 0, suffix: "" },
];

export function CommandDeck() {
  return (
    <div className="space-y-5">
      <MotionGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <motion.div key={m.label} variants={fadeItem}>
            <GlassPanel hover className="h-full">
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary glow-primary">
                  <m.icon className="size-5" />
                </span>
                <span className="flex items-center gap-1 text-xs text-primary">
                  <TrendingUp className="size-3.5" />
                  {m.trend}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold">
                <CountUp value={m.value} decimals={m.decimals} suffix={m.suffix} />
              </p>
              <p className="text-sm text-muted-foreground">{m.label}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </MotionGrid>

      <div className="grid gap-4 lg:grid-cols-5">
        <GlassPanel className="lg:col-span-3">
          <h2 className="text-base font-semibold">Recent Activity</h2>
          <p className="text-xs text-muted-foreground">Live event stream across the fleet</p>
          <ScrollArea className="mt-4 h-[22rem] pr-3">
            <motion.ul variants={{ show: { transition: { staggerChildren: 0.04 } } }} initial="hidden" animate="show" className="space-y-2">
              {activityEvents.map((e) => {
                const agent = agents.find((a) => a.id === e.agentId)!;
                return (
                  <motion.li
                    key={e.id}
                    variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}
                    className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/30 p-3"
                  >
                    <span className="text-lg" aria-hidden>
                      {agent.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{e.action}</p>
                      <p className="text-data text-xs text-muted-foreground">
                        {agent.name} · {relativeTime(e.minutesAgo)}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </ScrollArea>
        </GlassPanel>

        <GlassPanel className="lg:col-span-2">
          <h2 className="text-base font-semibold">Agent Status</h2>
          <p className="text-xs text-muted-foreground">Current assignments</p>
          <ul className="mt-4 space-y-3">
            {agents.map((a) => (
              <li key={a.id} className="glass-card glass-hover flex items-center gap-3 p-3">
                <span className="text-xl" aria-hidden>
                  {a.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusDot status={a.status} />
                    <span className="truncate text-sm font-semibold">{a.name}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{a.currentActivity}</p>
                </div>
                <span className="text-data text-xs text-muted-foreground">{a.lastSeen}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>
    </div>
  );
}
