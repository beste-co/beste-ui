"use client";

import { cn } from "@/lib/utils";

interface Editor27Props {
  bordered?: boolean;
  className?: string;
}

export const editor27Demo: Editor27Props = {
  bordered: false,
};

export function Editor27({ bordered = false, className }: Editor27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className={cn("flex w-full max-w-80 flex-col gap-0.5 rounded-md bg-card px-3 py-2 text-xs leading-relaxed shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-3">
          <span className="w-4 text-right text-muted-foreground/60">1</span>
          <code>
            <span className="text-violet-600 dark:text-violet-400">function</span>
            <span className="text-card-foreground"> render</span>
            <span className="rounded-sm bg-primary/30 text-card-foreground">
              (
            </span>
            <span className="text-card-foreground">items) </span>
            <span className="rounded-sm bg-primary/30 text-card-foreground">
              {"{"}
            </span>
          </code>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-4 text-right text-muted-foreground/60">2</span>
          <code className="text-card-foreground">  items.forEach(draw);</code>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-4 text-right text-muted-foreground/60">3</span>
          <code>
            <span className="rounded-sm bg-primary/30 text-card-foreground">
              {"}"}
            </span>
          </code>
        </div>
      </pre>
    </div>
  );
}
