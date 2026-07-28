"use client";

import { cn } from "@/lib/utils";

interface ImportLine {
  names: string[];
  source: string;
}

interface Code6Props {
  imports?: ImportLine[];
  className?: string;
}

export const code6Demo: Code6Props = {
  imports: [
    { names: ["useState", "useEffect"], source: "react" },
    { names: ["Button"], source: "@/ui/button" },
    { names: ["cn"], source: "@/lib/utils" },
  ],
};

export function Code6({ imports = [], className }: Code6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm leading-relaxed shadow-sm">
        {imports.map((line, i) => (
          <div key={i} className="flex flex-wrap items-baseline gap-x-1 truncate">
            <span className="text-violet-600 dark:text-violet-400">import</span>
            <span className="text-muted-foreground">{"{"}</span>
            <span className="text-amber-600 dark:text-amber-400">
              {line.names.join(", ")}
            </span>
            <span className="text-muted-foreground">{"}"}</span>
            <span className="text-violet-600 dark:text-violet-400">from</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {`"${line.source}"`}
            </span>
            <span className="text-muted-foreground">;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
