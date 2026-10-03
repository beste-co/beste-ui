"use client";

import { Command, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav18Props {
  label?: string;
  bordered?: boolean;
  className?: string;
}

export const nav18Demo: Nav18Props = {
  label: "Search or jump to…",
  bordered: false,
};

export function Nav18({
  label = "Search or jump to…",
  bordered = false,
  className,
}: Nav18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <button
        type="button"
        className={cn("inline-flex w-full max-w-72 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted", bordered ? "border border-border bg-card" : "bg-muted hover:bg-muted-foreground/15")}
      >
        <Search className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-left">{label}</span>
        <span className={cn("inline-flex shrink-0 items-center gap-0.5 rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold text-card-foreground", bordered && "border border-border")}>
          <Command className="size-3" aria-hidden="true" />
          K
        </span>
      </button>
    </div>
  );
}
