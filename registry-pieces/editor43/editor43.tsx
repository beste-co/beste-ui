"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Frame {
  fn: string;
  file: string;
  line: number;
  current?: boolean;
}

interface Editor43Props {
  title?: string;
  frames?: Frame[];
  className?: string;
}

export const editor43Demo: Editor43Props = {
  title: "Call stack",
  frames: [
    { fn: "renderList", file: "list.tsx", line: 42, current: true },
    { fn: "Dashboard", file: "dashboard.tsx", line: 14 },
    { fn: "App", file: "app.tsx", line: 8 },
  ],
};

export function Editor43({
  title = "Call stack",
  frames = [],
  className,
}: Editor43Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center gap-1 border-b border-border px-3 py-1.5">
          <ChevronDown
            className="size-3 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
        </div>
        <ul className="flex flex-col">
          {frames.map((f, i) => (
            <li
              key={i}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 font-mono text-xs",
                f.current && "bg-amber-100 dark:bg-amber-950/60"
              )}
            >
              <span
                className={cn(
                  "text-violet-600 dark:text-violet-400",
                  f.current && "font-semibold"
                )}
              >
                {f.fn}
              </span>
              <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                <span className="truncate">{f.file}</span>
                <span>:</span>
                <span className="tabular-nums">{f.line}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
