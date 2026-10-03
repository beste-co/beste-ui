"use client";

import { cn } from "@/lib/utils";

interface Editor16Props {
  prefix?: string;
  lines?: string[];
  bordered?: boolean;
  className?: string;
}

export const editor16Demo: Editor16Props = {
  prefix: "const ",
  lines: ["name = 'Hania';", "role = 'design';", "team = 'core';"],
  bordered: false,
};

export function Editor16({
  prefix = "",
  lines = [],
  bordered = false,
  className,
}: Editor16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-md bg-card shadow-sm", bordered && "border border-border")}>
        <pre className="px-3 py-2 text-xs leading-relaxed">
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
