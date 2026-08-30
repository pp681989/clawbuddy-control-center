import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { AgentStatus } from "@/lib/clawbuddy-data";

export const statusColor: Record<AgentStatus, string> = {
  active: "text-primary",
  idle: "text-amber",
  error: "text-destructive",
  offline: "text-muted-foreground",
};

export function StatusDot({ status, className }: { status: AgentStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-2.5 shrink-0 rounded-full bg-current",
        statusColor[status],
        status === "active" && "pulse-dot",
        className,
      )}
      aria-label={status}
    />
  );
}

export function CountUp({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span className="text-data">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function relativeTime(minutesAgo: number) {
  if (minutesAgo < 1) return "just now";
  if (minutesAgo < 60) return `${Math.round(minutesAgo)}m ago`;
  if (minutesAgo < 60 * 24) return `${Math.floor(minutesAgo / 60)}h ago`;
  return `${Math.floor(minutesAgo / (60 * 24))}d ago`;
}

export function GlassPanel({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return <div className={cn("glass-card p-5", hover && "glass-hover", className)}>{children}</div>;
}

export const fadeStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export const fadeItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function MotionGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeStagger} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}
