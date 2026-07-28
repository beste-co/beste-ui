"use client";

import { cn } from "@/lib/utils";

interface StatItem {
  value: string;
  label: string;
}

interface Stats3Props {
  items?: StatItem[];
  className?: string;
}

export const stats3Demo: Stats3Props = {
  items: [
    { value: "128K", label: "Users" },
    { value: "4.2M", label: "Events" },
    { value: "99.98%", label: "Uptime" },
  ],
};

export function Stats3({ items = [], className }: Stats3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center rounded-lg border border-border bg-card shadow-sm">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 px-3 py-3",
              i > 0 && "border-l border-border"
            )}
          >
            <span className="text-xl font-bold tabular-nums text-card-foreground">
              {item.value}
            </span>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
