"use client";

import { cn } from "@/lib/utils";

interface DebugLine {
  line: number;
  code: string;
  breakpoint?: boolean;
  hits?: number;
  current?: boolean;
}

interface Editor41Props {
  lines?: DebugLine[];
  className?: string;
}

export const editor41Demo: Editor41Props = {
  lines: [
    { line: 40, code: "const users = load();" },
    { line: 41, code: "for (const user of users) {", breakpoint: true, hits: 12 },
    { line: 42, code: "  render(user);", current: true },
    { line: 43, code: "}" },
  ],
};

export function Editor41({ lines = [], className }: Editor41Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card font-mono text-xs leading-relaxed shadow-sm">
        {lines.map((l) => (
          <div
            key={l.line}
            className={cn(
              "flex items-center gap-2 px-2 py-0.5",
              l.current && "bg-amber-100 dark:bg-amber-950/60"
            )}
          >
            <span className="flex size-3 shrink-0 items-center justify-center">
              {l.breakpoint && (
                <span
                  className="size-2.5 rounded-full bg-rose-500"
                  aria-hidden="true"
                />
              )}
            </span>
            <span
              className="w-4 shrink-0 select-none text-right tabular-nums text-muted-foreground/60"
              aria-hidden="true"
            >
              {l.line}
            </span>
            <code className="flex-1 truncate text-card-foreground">
              {l.code || "\u00A0"}
            </code>
            {typeof l.hits === "number" && (
              <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-xs font-semibold tabular-nums text-card-foreground">
                {l.hits}×
              </span>
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}
