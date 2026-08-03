"use client";

import { cn } from "@/lib/utils";

interface BreakdownRow {
  label: string;
  percent: number;
}

interface Chart7Props {
  title?: string;
  caption?: string;
  items?: BreakdownRow[];
  className?: string;
}

export const chart7Demo: Chart7Props = {
  title: "Where the week went",
  caption: "Booked hours by appointment type",
  items: [
    { label: "Consultations", percent: 42 },
    { label: "Follow-ups", percent: 28 },
    { label: "Assessments", percent: 19 },
    { label: "Admin", percent: 11 },
  ],
};

export function Chart7({ title, caption, items = [], className }: Chart7Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 shadow-xl">
        {title && <p className="text-base font-semibold text-card-foreground">{title}</p>}
        {caption && <p className="mt-0.5 text-sm text-muted-foreground">{caption}</p>}

        <div className="mt-4 flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm text-card-foreground">{item.label}</span>
                <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                  {item.percent}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", index === 0 ? "bg-primary" : "bg-primary/35")}
                  style={{ width: `${item.percent}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
