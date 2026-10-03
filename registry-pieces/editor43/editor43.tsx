"use client";

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
  bordered?: boolean;
  className?: string;
}

export const editor43Demo: Editor43Props = {
  title: "Call stack",
  frames: [
    { fn: "renderList", file: "list.tsx", line: 42, current: true },
    { fn: "Dashboard", file: "dashboard.tsx", line: 14 },
    { fn: "App", file: "app.tsx", line: 8 },
  ],
  bordered: false,
};

export function Editor43({
  title = "Call stack",
  frames = [],
  bordered = false,
  className,
}: Editor43Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-md bg-card shadow-sm", bordered && "border border-border")}>
        <div className="border-b border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          {title}
        </div>
        <ul className="flex flex-col">
          {frames.map((f, i) => (
            <li
              key={i}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-xs",
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
