"use client";

import { Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  label: string;
  recent?: boolean;
}

interface Browser15Props {
  query?: string;
  suggestions?: Suggestion[];
  className?: string;
}

export const browser15Demo: Browser15Props = {
  query: "react",
  suggestions: [
    { label: "react server components" },
    { label: "react query vs swr" },
    { label: "react 19 release notes", recent: true },
    { label: "react suspense patterns" },
  ],
};

export function Browser15({
  query = "",
  suggestions = [],
  className,
}: Browser15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-card-foreground">
            {query}
          </span>
          <span
            className="h-4 w-px animate-pulse bg-foreground"
            aria-hidden="true"
          />
        </div>
        <ul className="flex flex-col py-1">
          {suggestions.map((s, i) => {
            const Icon = s.recent ? Clock : Search;
            return (
              <li
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <Icon
                  className="size-3 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="truncate text-card-foreground">
                  {s.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
