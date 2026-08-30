import { useState } from "react";
import { motion } from "motion/react";
import { agents, type Agent } from "@/lib/clawbuddy-data";
import { GlassPanel, MotionGrid, StatusDot, fadeItem } from "./shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const accentText: Record<Agent["accent"], string> = {
  primary: "text-primary",
  amber: "text-amber",
  cyan: "text-cyan",
};

const accentBg: Record<Agent["accent"], string> = {
  primary: "bg-primary/10",
  amber: "bg-amber/10",
  cyan: "bg-cyan/10",
};

export function AgentProfiles() {
  const [selected, setSelected] = useState<Agent | null>(null);

  return (
    <>
      <MotionGrid className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => (
          <motion.div key={a.id} variants={fadeItem}>
            <GlassPanel hover className="flex h-full flex-col">
              <div className="flex items-start gap-3">
                <span className={`grid size-12 place-items-center rounded-xl text-2xl ${accentBg[a.accent]}`} aria-hidden>
                  {a.emoji}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">{a.name}</h3>
                  <p className="text-xs text-muted-foreground">{a.subtitle}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={accentText[a.accent]}>
                  {a.type}
                </Badge>
                <Badge variant="secondary">{a.role}</Badge>
                <span className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                  <StatusDot status={a.status} />
                  {a.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
                  <p className="text-data text-xl font-semibold">{a.tasksCompleted.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Tasks completed</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
                  <p className={`text-data text-xl font-semibold ${accentText[a.accent]}`}>{a.accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {a.skills.map((s) => (
                  <span key={s} className="rounded-md border border-border/60 px-2 py-1 text-xs text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>

              <Button variant="outline" className="mt-5 w-full" onClick={() => setSelected(a)}>
                View Details
              </Button>
            </GlassPanel>
          </motion.div>
        ))}
      </MotionGrid>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="glass-card">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span aria-hidden>{selected.emoji}</span>
                  {selected.name}
                </DialogTitle>
                <DialogDescription>{selected.subtitle}</DialogDescription>
              </DialogHeader>
              <dl className="text-data space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Role</dt>
                  <dd>{selected.role}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd>{selected.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Current activity</dt>
                  <dd>{selected.currentActivity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tasks completed</dt>
                  <dd>{selected.tasksCompleted.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Accuracy</dt>
                  <dd>{selected.accuracy}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Last seen</dt>
                  <dd>{selected.lastSeen}</dd>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
