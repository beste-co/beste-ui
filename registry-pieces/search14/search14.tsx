"use client";

import { Flame, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search14Props {
  placeholder?: string;
  trending?: string[];
  label?: string;
  className?: string;
}

export const search14Demo: Search14Props = {
  placeholder: "Search docs and guides…",
  label: "Trending",
  trending: [
    "migrate to v3",
    "webhook retries",
    "api rate limits",
    "team roles",
  ],
};

export function Search14({
  placeholder = "Search…",
  trending = [],
  label = "Trending",
  className,
}: Search14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            {placeholder}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Flame
              className="size-3 text-orange-500"
              aria-hidden="true"
            />
            {label}
          </span>
          {trending.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs text-card-foreground hover:bg-muted"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
