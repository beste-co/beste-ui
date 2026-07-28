"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor8Props {
  prefix?: string;
  ghost?: string;
  className?: string;
}

export const editor8Demo: Editor8Props = {
  prefix: "const greet = (name: string) => `Hello, ",
  ghost: "${name}!`;",
};

export function Editor8({
  prefix = "",
  ghost = "",
  className,
}: Editor8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card px-3 py-2 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Sparkles
            className="size-3 text-violet-500"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            AI Suggestion
          </span>
        </div>
        <pre className="overflow-auto font-mono text-xs leading-relaxed">
          <code>
            <span className="text-card-foreground">{prefix}</span>
            <span className="italic text-muted-foreground/60">{ghost}</span>
            <span
              className="ml-0.5 inline-block h-3 w-px translate-y-0.5 animate-pulse bg-foreground align-middle"
              aria-hidden="true"
            />
          </code>
        </pre>
      </div>
    </div>
  );
}
