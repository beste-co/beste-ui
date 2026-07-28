"use client";

import { cn } from "@/lib/utils";

interface Dashboard23Segment {
  label: string;
  value: number;
}

interface Dashboard23Props {
  title?: string;
  total?: string;
  segments?: Dashboard23Segment[];
  className?: string;
}

const PALETTE = [
  { bar: "bg-violet-500", dot: "bg-violet-500" },
  { bar: "bg-sky-500", dot: "bg-sky-500" },
  { bar: "bg-emerald-500", dot: "bg-emerald-500" },
  { bar: "bg-amber-500", dot: "bg-amber-500" },
  { bar: "bg-rose-500", dot: "bg-rose-500" },
];

export const dashboard23Demo: Dashboard23Props = {
  title: "Traffic by device",
  total: "9,420 sessions",
  segments: [
    { label: "Mobile", value: 58 },
    { label: "Desktop", value: 32 },
    { label: "Tablet", value: 8 },
    { label: "Other", value: 2 },
  ],
};

export function Dashboard23({
  title = "Split",
  total,
  segments = [],
  className,
}: Dashboard23Props) {
  const sum = segments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
          {total && (
            <span className="font-mono text-xs text-muted-foreground">
              {total}
            </span>
          )}
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-sm">
          {segments.map((s, i) => {
            const pct = (s.value / sum) * 100;
            const cls = PALETTE[i % PALETTE.length]!;
            return (
              <span
                key={s.label}
                className={cls.bar}
                style={{ width: `${pct}%` }}
                aria-hidden="true"
              />
            );
          })}
        </div>
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {segments.map((s, i) => {
            const pct = Math.round((s.value / sum) * 100);
            const cls = PALETTE[i % PALETTE.length]!;
            return (
              <li
                key={s.label}
                className="flex items-center gap-1.5 text-xs"
              >
                <span
                  className={cn("size-2 rounded-sm", cls.dot)}
                  aria-hidden="true"
                />
                <span className="text-card-foreground">{s.label}</span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
