"use client";

import { cn } from "@/lib/utils";

interface Shapes50Props {
  className?: string;
}

export const shapes50Demo: Shapes50Props = {};

const ROWS: { title: string; body: string }[] = [
  { title: "w-3/4", body: "w-full" },
  { title: "w-1/2", body: "w-3/4" },
  { title: "w-2/3", body: "w-5/6" },
];

export function Shapes50({ className }: Shapes50Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 flex-col gap-2.5 rounded-md border border-border bg-card p-3"
        aria-hidden="true"
      >
        {ROWS.map((row, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="size-7 shrink-0 rounded-md bg-muted" />
            <div className="flex flex-1 flex-col gap-1">
              <span
                className={cn("h-1.5 rounded-full bg-foreground/70", row.title)}
              />
              <span
                className={cn("h-1 rounded-full bg-muted", row.body)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
