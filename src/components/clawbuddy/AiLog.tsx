import { useState } from "react";
import { motion } from "motion/react";
import { agents, logEntries, type LogCategory } from "@/lib/clawbuddy-data";
import { GlassPanel, relativeTime } from "./shared";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const categoryStyle: Record<LogCategory, string> = {
  observation: "border-primary/40 text-primary bg-primary/10",
  general: "border-border text-muted-foreground bg-secondary",
  reminder: "border-amber/40 text-amber bg-amber/10",
  fyi: "border-cyan/40 text-cyan bg-cyan/10",
};

const categories: (LogCategory | "all")[] = ["all", "observation", "general", "reminder", "fyi"];

export function AiLog() {
  const [filter, setFilter] = useState<LogCategory | "all">("all");
  const entries = logEntries.filter((l) => filter === "all" || l.category === filter);

  return (
    <GlassPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">AI Log</h2>
          <p className="text-xs text-muted-foreground">{entries.length} entries</p>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as LogCategory | "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c} className="capitalize">
                {c === "all" ? "All categories" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.ul
        key={filter}
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="show"
        className="mt-5 space-y-2.5"
      >
        {entries.map((l) => {
          const agent = agents.find((a) => a.id === l.agentId)!;
          return (
            <motion.li
              key={l.id}
              variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0 } }}
              className="glass-card glass-hover flex items-start gap-3 p-3"
            >
              <span className="text-lg" aria-hidden>
                {agent.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{agent.name}</span>
                  <Badge variant="outline" className={cn("capitalize", categoryStyle[l.category])}>
                    {l.category}
                  </Badge>
                  <span className="text-data text-xs text-muted-foreground">{relativeTime(l.minutesAgo)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{l.message}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </GlassPanel>
  );
}
