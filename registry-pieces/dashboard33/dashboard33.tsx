"use client";

import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "flat";

interface Kpi {
  label: string;
  value: string;
  delta?: string;
  direction?: Direction;
}

interface Dashboard33Props {
  title?: string;
  range?: string;
  items?: Kpi[];
  className?: string;
}

const deltaStyles: Record<Direction, string> = {
  up: "text-emerald-500",
  down: "text-rose-500",
  flat: "text-muted-foreground",
};

export const dashboard33Demo: Dashboard33Props = {
  title: "This week",
  range: "Mon – Sun",
  items: [
    { label: "Booked", value: "142", delta: "+9", direction: "up" },
    { label: "No-shows", value: "3", delta: "-4", direction: "down" },
    { label: "Hours", value: "96", delta: "0", direction: "flat" },
  ],
};

export function Dashboard33({ title, range, items = [], className }: Dashboard33Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-96 rounded-md border border-border bg-card shadow-xl">
        <div className="flex items-baseline justify-between gap-3 border-b border-border px-5 py-3">
          {title && <p className="text-sm font-semibold text-card-foreground">{title}</p>}
          {range && <span className="text-xs text-muted-foreground">{range}</span>}
        </div>

        <div className="grid grid-cols-3 divide-x divide-border">
          {items.map((item, index) => (
            <div key={index} className="px-5 py-4">
              <p className="truncate text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-2xl font-light tracking-tight tabular-nums text-card-foreground">
                {item.value}
              </p>
              {item.delta && (
                <p
                  className={cn(
                    "mt-0.5 text-xs font-medium tabular-nums",
                    deltaStyles[item.direction ?? "flat"]
                  )}
                >
                  {item.delta}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
