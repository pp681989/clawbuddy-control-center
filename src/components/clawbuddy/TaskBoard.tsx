import { useState } from "react";
import { motion } from "motion/react";
import { agents, columns, initialTasks, type ColumnId, type Priority, type Task } from "@/lib/clawbuddy-data";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const priorityDot: Record<Priority, string> = {
  low: "bg-muted-foreground",
  medium: "bg-cyan",
  high: "bg-amber",
  urgent: "bg-destructive",
};

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<ColumnId | null>(null);

  const move = (id: string, column: ColumnId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, column, progress: column === "doing" ? (t.progress ?? 10) : undefined }
          : t,
      ),
    );
  };

  return (
    <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.column === col.id);
        return (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(col.id);
            }}
            onDragLeave={() => setOver((c) => (c === col.id ? null : c))}
            onDrop={() => {
              if (dragging) move(dragging, col.id);
              setDragging(null);
              setOver(null);
            }}
            className={cn(
              "glass-card min-w-[16rem] flex-1 p-4 transition-colors",
              over === col.id && "border-primary/50",
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{col.label}</h3>
              <span className="text-data rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {colTasks.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {colTasks.map((t) => {
                const agent = agents.find((a) => a.id === t.agentId)!;
                return (
                  <motion.div
                    key={t.id}
                    layout
                    draggable
                    onDragStart={() => setDragging(t.id)}
                    onDragEnd={() => setDragging(null)}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "glass-card cursor-grab p-3 active:cursor-grabbing",
                      dragging === t.id && "opacity-60",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", priorityDot[t.priority])} title={t.priority} />
                      <p className="flex-1 text-sm font-medium">{t.title}</p>
                      <span className="text-base" aria-hidden>
                        {agent.emoji}
                      </span>
                    </div>
                    {t.column === "doing" && typeof t.progress === "number" && (
                      <div className="mt-3">
                        <Progress value={t.progress} className="h-1.5" />
                        <p className="text-data mt-1 text-xs text-muted-foreground">{t.progress}% complete</p>
                      </div>
                    )}
                    <p className="text-data mt-2 text-xs capitalize text-muted-foreground">{t.priority} priority</p>
                  </motion.div>
                );
              })}
              {colTasks.length === 0 && (
                <p className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                  Drop tasks here
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
