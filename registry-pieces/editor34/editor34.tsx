"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Match {
  file: string;
  count: number;
}

interface Editor34Props {
  oldName?: string;
  newName?: string;
  matches?: Match[];
  className?: string;
}

export const editor34Demo: Editor34Props = {
  oldName: "greet",
  newName: "sayHello",
  matches: [
    { file: "greet.ts", count: 1 },
    { file: "app.tsx", count: 4 },
    { file: "welcome.tsx", count: 2 },
  ],
};

export function Editor34({
  oldName = "old",
  newName = "new",
  matches = [],
  className,
}: Editor34Props) {
  const total = matches.reduce((sum, m) => sum + m.count, 0);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="rounded bg-rose-100 px-1.5 py-0.5 font-semibold text-rose-700 line-through dark:bg-rose-950 dark:text-rose-300">
            {oldName}
          </span>
          <ArrowRight
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {newName}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {total} refs
          </span>
        </div>
        <ul className="flex flex-col gap-0.5 border-t border-border pt-2 font-mono text-xs">
          {matches.map((m, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2"
            >
              <span className="truncate text-card-foreground">{m.file}</span>
              <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-xs font-semibold tabular-nums text-card-foreground">
                {m.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
