import { motion } from "motion/react";
import { Settings } from "lucide-react";
import { agents } from "@/lib/clawbuddy-data";
import { StatusDot } from "./shared";
import { Button } from "@/components/ui/button";

export function Header() {
  const lead = agents[0]!;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card relative flex flex-col gap-4 overflow-hidden p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <span className="absolute inset-y-0 left-0 w-px bg-primary glow-primary" aria-hidden />
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-2xl glow-primary" aria-hidden>
          🐾
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight">ClawBuddy</h1>
          <p className="text-sm text-muted-foreground">AI Agent Command Center</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-left sm:text-right">
          <div className="flex items-center gap-2 sm:justify-end">
            <StatusDot status={lead.status} />
            <span className="text-sm font-semibold">{lead.name}: Online</span>
          </div>
          <p className="text-data text-xs text-muted-foreground">
            {lead.currentActivity} · last seen {lead.lastSeen}
          </p>
        </div>
        <Button variant="outline" size="icon" aria-label="Settings">
          <Settings className="size-4" />
        </Button>
      </div>
    </motion.header>
  );
}
