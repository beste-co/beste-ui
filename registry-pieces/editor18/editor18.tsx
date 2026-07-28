"use client";

import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Editor18Props {
  scopes?: string[];
  className?: string;
}

export const editor18Demo: Editor18Props = {
  scopes: ["Dashboard", "render()", "if (isReady)"],
};

export function Editor18({ scopes = [], className }: Editor18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center gap-1 border-b border-border bg-muted/60 px-3 py-1 font-mono text-xs">
          {scopes.map((s, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <ChevronRight
                  className="size-3 shrink-0 text-muted-foreground/60"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "truncate",
                  i === scopes.length - 1
                    ? "font-semibold text-card-foreground"
                    : "text-muted-foreground"
                )}
              >
                {s}
              </span>
            </Fragment>
          ))}
        </div>
        <pre className="px-3 py-2 font-mono text-xs leading-relaxed text-muted-foreground">
          {"    // hidden lines…\n    const ready = useReady();\n    if (!ready) return null;"}
        </pre>
      </div>
    </div>
  );
}
