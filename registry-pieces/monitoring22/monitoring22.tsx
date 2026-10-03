"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Level = "warn" | "down";
type Phase = "fill" | "hold" | "clear";

interface Incident {
  index: number;
  level: Level;
}

interface Monitoring22Props {
  title?: string;
  uptime?: string;
  range?: string;
  rows?: number;
  cols?: number;
  incidents?: Incident[];
  cellMs?: number;
  holdMs?: number;
  bordered?: boolean;
  className?: string;
}

export const monitoring22Demo: Monitoring22Props = {
  title: "API",
  uptime: "99.98% uptime",
  incidents: [
    { index: 23, level: "warn" },
    { index: 61, level: "down" },
  ],
  bordered: false,
};

export function Monitoring22({
  title = "Service",
  uptime = "100% uptime",
  range,
  rows = 7,
  cols = 12,
  incidents = [],
  cellMs = 40,
  holdMs = 2500,
  bordered = false,
  className,
}: Monitoring22Props) {
  const total = rows * cols;
  const [lit, setLit] = useState(0);
  const [phase, setPhase] = useState<Phase>("fill");

  useEffect(() => {
    if (phase === "fill") {
      if (lit >= total) {
        setPhase("hold");
        return;
      }
      const id = setTimeout(() => setLit((n) => n + 1), lit === 0 ? 400 : cellMs);
      return () => clearTimeout(id);
    }
    if (phase === "hold") {
      const id = setTimeout(() => {
        setLit(0);
        setPhase("clear");
      }, holdMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setPhase("fill"), 800);
    return () => clearTimeout(id);
  }, [phase, lit, total, cellMs, holdMs]);

  const levelAt = (i: number): Level | "up" =>
    incidents.find((inc) => inc.index === i)?.level ?? "up";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes monitoring22-in { from { transform: scale(0.4); opacity: 0.4; } to { transform: none; opacity: 1; } }`}</style>
      <div className={cn("flex w-full max-w-72 flex-col gap-3 rounded-xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-sm font-medium text-card-foreground">{title}</span>
          <span className="shrink-0 text-sm font-medium tabular-nums text-emerald-500">
            {uptime}
          </span>
        </div>

        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          aria-hidden="true"
        >
          {Array.from({ length: total }, (_, i) => {
            const on = i < lit;
            const level = levelAt(i);
            return (
              <span
                key={i}
                className={cn(
                  "aspect-square rounded-sm",
                  !on && "bg-muted transition-colors duration-500 ease-in-out motion-reduce:transition-none",
                  on && level === "up" && "bg-emerald-500",
                  on && level === "warn" && "bg-amber-500",
                  on && level === "down" && "bg-rose-500"
                )}
                style={on ? { animation: "monitoring22-in 300ms ease-out" } : undefined}
              />
            );
          })}
        </div>

        {range && (
          <span className="text-xs text-muted-foreground">{range}</span>
        )}
      </div>
    </div>
  );
}
