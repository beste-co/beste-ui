"use client";

import { cn } from "@/lib/utils";

interface Monitoring13Props {
  critical?: number;
  warning?: number;
  info?: number;
  bordered?: boolean;
  className?: string;
}

export const monitoring13Demo: Monitoring13Props = {
  critical: 12,
  warning: 4,
  info: 28,
  bordered: false,
};

export function Monitoring13({
  critical = 0,
  warning = 0,
  info = 0,
  bordered = false,
  className,
}: Monitoring13Props) {
  const total = Math.max(1, critical + warning + info);
  const segments = [
    { count: critical, bar: "bg-rose-500", dot: "bg-rose-500" },
    { count: warning, bar: "bg-amber-500", dot: "bg-amber-500" },
    { count: info, bar: "bg-sky-500", dot: "bg-sky-500" },
  ];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-2 rounded-lg bg-card px-3 py-2.5 shadow-sm", bordered && "border border-border")}>
        <div
          className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          {segments.map((s, i) => (
            <span
              key={i}
              className={s.bar}
              style={{ width: `${(s.count / total) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          {segments.map((s, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span
                className={cn("size-1.5 rounded-full", s.dot)}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold tabular-nums text-card-foreground">
                {s.count}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
