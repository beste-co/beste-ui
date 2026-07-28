"use client";

import { cn } from "@/lib/utils";

interface Editor44Props {
  className?: string;
}

export const editor44Demo: Editor44Props = {};

const dot = <span className="text-muted-foreground/50">·</span>;
const arrow = <span className="text-muted-foreground/50">→</span>;

export function Editor44({ className }: Editor44Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className="flex w-full max-w-80 flex-col rounded-md border border-border bg-card px-3 py-2 font-mono text-xs leading-relaxed shadow-sm">
        <div className="flex items-baseline gap-3">
          <span className="w-4 shrink-0 text-right tabular-nums text-muted-foreground/60">
            1
          </span>
          <code>
            <span className="text-violet-600 dark:text-violet-400">
              function
            </span>
            {dot}
            <span className="text-sky-600 dark:text-sky-400">greet</span>
            <span className="text-card-foreground">(name)</span>
            {dot}
            <span className="text-card-foreground">{"{"}</span>
          </code>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="w-4 shrink-0 text-right tabular-nums text-muted-foreground/60">
            2
          </span>
          <code>
            {arrow}
            <span className="text-violet-600 dark:text-violet-400">return</span>
            {dot}
            <span className="text-emerald-600 dark:text-emerald-400">
              `Hello,{dot}
              ${"{name}"}!`
            </span>
            <span className="text-card-foreground">;</span>
          </code>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="w-4 shrink-0 text-right tabular-nums text-muted-foreground/60">
            3
          </span>
          <code className="text-card-foreground">{"}"}</code>
        </div>
      </pre>
    </div>
  );
}
