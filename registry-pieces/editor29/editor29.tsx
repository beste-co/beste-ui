"use client";

import { cn } from "@/lib/utils";

interface Editor29Props {
  className?: string;
}

export const editor29Demo: Editor29Props = {};

const hintClass =
  "rounded-sm bg-muted px-1 font-mono text-xs font-medium italic text-muted-foreground";

export function Editor29({ className }: Editor29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className="flex w-full max-w-80 flex-col gap-0.5 overflow-hidden whitespace-normal rounded-md border border-border bg-card px-3 py-2 font-mono text-xs leading-relaxed shadow-sm">
        <div className="flex items-baseline gap-3">
          <span className="w-4 shrink-0 select-none text-right tabular-nums text-muted-foreground/60">
            1
          </span>
          <code className="min-w-0 flex-1 break-words">
            <span className="text-violet-600 dark:text-violet-400">const</span>
            <span className="text-card-foreground"> user </span>
            <span className="text-muted-foreground">= </span>
            <span className="text-sky-600 dark:text-sky-400">createUser</span>
            <span className="text-card-foreground">(</span>
            <span className={hintClass}>name:</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {' "Ayşe"'}
            </span>
            <span className="text-card-foreground">, </span>
            <span className={hintClass}>role:</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {' "admin"'}
            </span>
            <span className="text-card-foreground">);</span>
          </code>
        </div>
        <div className="mt-1 flex items-center gap-1.5 border-t border-border pt-1 text-xs text-muted-foreground">
          <span className={hintClass}>name</span>
          <span>inlay parameter hints</span>
        </div>
      </pre>
    </div>
  );
}
