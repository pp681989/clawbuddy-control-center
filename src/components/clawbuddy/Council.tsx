import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { agents, councilSessions } from "@/lib/clawbuddy-data";
import { GlassPanel, relativeTime } from "./shared";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Council() {
  const [open, setOpen] = useState<string | null>(councilSessions[0]!.id);

  return (
    <div className="space-y-4">
      {councilSessions.map((s) => {
        const expanded = open === s.id;
        return (
          <GlassPanel key={s.id} className="p-0">
            <button
              onClick={() => setOpen(expanded ? null : s.id)}
              className="flex w-full items-start gap-3 p-5 text-left"
              aria-expanded={expanded}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      s.status === "concluded"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-cyan/40 bg-cyan/10 text-cyan",
                    )}
                  >
                    {s.status}
                  </Badge>
                  <span className="text-data text-xs text-muted-foreground">{s.messages.length} messages</span>
                </div>
                <h3 className="mt-2 text-base font-semibold">{s.question}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.participants.map((p) => {
                    const agent = agents.find((a) => a.id === p.agentId)!;
                    return (
                      <span
                        key={p.agentId}
                        className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-2.5 py-1 text-xs"
                      >
                        <span aria-hidden>{agent.emoji}</span>
                        {agent.name}
                        <span className="text-data text-muted-foreground">
                          {p.sent}/{p.limit}
                        </span>
                        {p.done ? (
                          <CheckCircle2 className="size-3.5 text-primary" />
                        ) : (
                          <Loader2 className="size-3.5 animate-spin text-cyan" />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
              <ChevronDown className={cn("mt-1 size-5 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} />
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <motion.ul
                    variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                    initial="hidden"
                    animate="show"
                    className="space-y-2.5 border-t border-border/60 p-5"
                  >
                    {s.messages.map((m) => {
                      const agent = agents.find((a) => a.id === m.agentId)!;
                      return (
                        <motion.li
                          key={m.id}
                          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                          className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/30 p-3"
                        >
                          <span className="text-lg" aria-hidden>
                            {agent.emoji}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold">{agent.name}</span>
                              <span className="text-data text-xs text-primary">#{m.index}</span>
                              <span className="text-data text-xs text-muted-foreground">{relativeTime(m.minutesAgo)}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
                          </div>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        );
      })}
    </div>
  );
}
