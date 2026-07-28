"use client";

import { cn } from "@/lib/utils";

interface Dashboard11Entry {
  name: string;
  score: string;
}

interface Dashboard11Props {
  title?: string;
  entries?: Dashboard11Entry[];
  className?: string;
}

const MEDALS = [
  "bg-amber-500 text-amber-950",
  "bg-slate-300 text-slate-900",
  "bg-orange-700 text-orange-50",
];

export const dashboard11Demo: Dashboard11Props = {
  title: "Top performers",
  entries: [
    { name: "Ada L.", score: "12,840" },
    { name: "Marcus R.", score: "10,320" },
    { name: "Priya S.", score: "8,960" },
  ],
};

export function Dashboard11({
  title = "Leaderboard",
  entries = [],
  className,
}: Dashboard11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <div className="flex flex-col gap-1.5">
          {entries.slice(0, 3).map((e, i) => (
            <div key={e.name} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold",
                  MEDALS[i]
                )}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="flex-1 truncate text-xs font-medium text-card-foreground">
                {e.name}
              </span>
              <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-card-foreground">
                {e.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
