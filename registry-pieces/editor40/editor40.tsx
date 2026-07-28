"use client";

import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Action {
  label: string;
  preferred?: boolean;
}

interface Editor40Props {
  line?: string;
  actions?: Action[];
  className?: string;
}

export const editor40Demo: Editor40Props = {
  line: "const value = user.prfile.name;",
  actions: [
    { label: "Rename to 'profile'", preferred: true },
    { label: "Add missing property 'prfile'" },
    { label: "Disable rule for this line" },
  ],
};

export function Editor40({
  line = "",
  actions = [],
  className,
}: Editor40Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-2 font-mono text-xs shadow-sm">
          <button
            type="button"
            aria-label="Quick fixes"
            className="flex size-6 shrink-0 items-center justify-center rounded bg-amber-100 text-amber-600 transition-colors hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-400"
          >
            <Lightbulb className="size-3.5 fill-current" aria-hidden="true" />
          </button>
          <code className="min-w-0 flex-1 break-words text-card-foreground">
            {line}
          </code>
        </div>
        <ul className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-md">
          {actions.map((a, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs"
            >
              <span className="truncate text-card-foreground">{a.label}</span>
              {a.preferred && (
                <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  Preferred
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
