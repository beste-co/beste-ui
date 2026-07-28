"use client";

import { Command, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav18Props {
  label?: string;
  className?: string;
}

export const nav18Demo: Nav18Props = {
  label: "Search or jump to…",
};

export function Nav18({
  label = "Search or jump to…",
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
        className="inline-flex w-full max-w-72 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted"
      >
        <Search className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-left">{label}</span>
        <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-card-foreground">
          <Command className="size-3" aria-hidden="true" />
          K
        </span>
      </button>
    </div>
  );
}
