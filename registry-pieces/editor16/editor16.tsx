"use client";

import { cn } from "@/lib/utils";

interface Editor16Props {
  prefix?: string;
  lines?: string[];
  className?: string;
}

export const editor16Demo: Editor16Props = {
  prefix: "const ",
  lines: ["name = 'Ayşe';", "role = 'design';", "team = 'core';"],
};

export function Editor16({
  prefix = "",
  lines = [],
  className,
}: Editor16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/50 px-3 py-1 font-mono text-xs text-muted-foreground">
          3 cursors
        </div>
        <pre className="px-3 py-2 font-mono text-xs leading-relaxed">
          {lines.map((line, i) => (
            <div key={i} className="flex items-center">
              <span className="text-card-foreground">{prefix}</span>
              <span
                className="h-3.5 w-0.5 animate-pulse bg-primary"
                aria-hidden="true"
              />
              <span className="text-card-foreground">{line}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
