"use client";

import { Pin, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedQuery {
  name: string;
  query?: string;
  pinned?: boolean;
}

interface Search21Props {
  placeholder?: string;
  saved?: SavedQuery[];
  bordered?: boolean;
  className?: string;
}

export const search21Demo: Search21Props = {
  placeholder: "Search issues…",
  saved: [
    { name: "My open issues", pinned: true },
    { name: "This week's bugs" },
    { name: "Stale PRs" },
  ],
  bordered: false,
};

export function Search21({
  placeholder = "Search…",
  saved = [],
  bordered = false,
  className,
}: Search21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-xl bg-card shadow-md", bordered && "border border-border")}>
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            {placeholder}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 p-2">
          {saved.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-md px-2 py-1.5"
            >
              {item.pinned ? (
                <Pin
                  className="size-3.5 shrink-0 text-amber-500"
                  aria-hidden="true"
                />
              ) : (
                <Star
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-card-foreground">
                  {item.name}
                </span>
                {item.query && (
                  <span className="truncate text-xs text-muted-foreground">
                    {item.query}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
