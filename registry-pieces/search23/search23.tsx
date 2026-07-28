"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search23Props {
  placeholder?: string;
  shortcut?: string;
  className?: string;
}

export const search23Demo: Search23Props = {
  placeholder: "Search members, invoices, notes…",
  shortcut: "⌘K",
};

export function Search23({
  placeholder = "Search…",
  shortcut,
  className,
}: Search23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-md border border-border bg-card px-4 py-3 shadow-xl">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="flex-1 truncate text-sm text-muted-foreground">
          {placeholder}
        </span>
        {shortcut && (
          <kbd className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            {shortcut}
          </kbd>
        )}
      </div>
    </div>
  );
}
