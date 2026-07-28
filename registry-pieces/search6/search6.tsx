"use client";

import { Clock, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search6Props {
  placeholder?: string;
  recents?: string[];
  className?: string;
}

export const search6Demo: Search6Props = {
  placeholder: "Search workspace…",
  recents: [
    "invoice template",
    "onboarding checklist",
    "Q1 roadmap",
    "kickoff notes",
  ],
};

export function Search6({
  placeholder = "Search…",
  recents = [],
  className,
}: Search6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <Search
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            {placeholder}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 p-2">
          <span className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent
          </span>
          {recents.map((item, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
            >
              <Clock
                className="size-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="flex-1 truncate text-card-foreground">
                {item}
              </span>
              <button
                type="button"
                className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-card-foreground"
                aria-label={`Remove ${item}`}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
