"use client";

import { Check, GitBranch, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Branch {
  name: string;
  ahead?: number;
  current?: boolean;
}

interface Editor24Props {
  current?: string;
  branches?: Branch[];
  className?: string;
}

export const editor24Demo: Editor24Props = {
  current: "feat/onboarding",
  branches: [
    { name: "feat/onboarding", current: true },
    { name: "main" },
    { name: "feat/ai-suggest", ahead: 3 },
    { name: "chore/cleanup" },
  ],
};

export function Editor24({
  current,
  branches = [],
  className,
}: Editor24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col overflow-hidden rounded-md border border-border bg-card shadow-md">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-xs text-muted-foreground">
            Switch branch…
          </span>
        </div>
        <ul className="flex flex-col py-1">
          {branches.map((b) => {
            const isCurrent = b.name === current || b.current;
            return (
              <li
                key={b.name}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 font-mono text-xs transition-colors hover:bg-muted"
                )}
              >
                <GitBranch
                  className="size-3 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "flex-1 truncate",
                    isCurrent
                      ? "font-semibold text-card-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {b.name}
                </span>
                {typeof b.ahead === "number" && b.ahead > 0 && (
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-semibold tabular-nums text-card-foreground">
                    ↑{b.ahead}
                  </span>
                )}
                {isCurrent && (
                  <Check
                    className="size-3 shrink-0 text-emerald-500"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
