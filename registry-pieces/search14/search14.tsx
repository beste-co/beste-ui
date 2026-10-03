"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search14Props {
  placeholder?: string;
  trending?: string[];
  label?: string;
  bordered?: boolean;
  className?: string;
}

export const search14Demo: Search14Props = {
  placeholder: "Search docs and guides…",
  trending: ["migrate to v3", "webhook retries", "team roles"],
  bordered: false,
};

export function Search14({
  placeholder = "Search…",
  trending = [],
  label,
  bordered = false,
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
        <div className={cn("flex items-center gap-2 rounded-lg bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            {placeholder}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {label && (
            <span className="text-xs font-medium text-muted-foreground">
              {label}
            </span>
          )}
          {trending.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              className={cn("rounded-full bg-muted/60 px-2.5 py-1 text-xs text-card-foreground hover:bg-muted", bordered && "border border-border")}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
