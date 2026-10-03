"use client";

import { cn } from "@/lib/utils";

interface Calendar28Props {
  quarter?: string;
  milestones?: { label: string; when: string }[];
  bordered?: boolean;
  className?: string;
}

export const calendar28Demo: Calendar28Props = {
  quarter: "Q2 roadmap",
  milestones: [
    { label: "Kickoff", when: "Apr 01" },
    { label: "Beta", when: "May 27" },
    { label: "GA launch", when: "Jun 17" },
  ],
  bordered: false,
};

export function Calendar28({
  quarter,
  milestones = [],
  bordered = false,
  className,
}: Calendar28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {quarter && (
          <span className="text-xs font-semibold text-muted-foreground">
            {quarter}
          </span>
        )}
        <div className="relative h-1.5 rounded-full bg-muted">
          {milestones.map((_, idx) => {
            const pct = (idx / Math.max(1, milestones.length - 1)) * 100;
            return (
              <span
                key={idx}
                className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-primary bg-card"
                style={{ left: `calc(${pct}% - 0.375rem)` }}
                aria-hidden="true"
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-0.5 text-center"
            >
              <span className="font-semibold text-card-foreground">
                {m.label}
              </span>
              <span className="tabular-nums text-muted-foreground">{m.when}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
