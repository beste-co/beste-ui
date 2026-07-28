"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search12Props {
  placeholder?: string;
  action?: string;
  helper?: string;
  className?: string;
}

export const search12Demo: Search12Props = {
  placeholder: "Search over 12,000 templates…",
  action: "Search",
  helper: "Try “marketing landing”, “saas pricing”, or “portfolio”.",
};

export function Search12({
  placeholder = "Search…",
  action = "Search",
  helper,
  className,
}: Search12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-2">
        <div className="flex w-full items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-5 shadow-md">
          <Search
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            {placeholder}
          </span>
          <button
            type="button"
            className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            {action}
          </button>
        </div>
        {helper && (
          <span className="text-center text-xs text-muted-foreground">
            {helper}
          </span>
        )}
      </div>
    </div>
  );
}
