"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search22Props {
  placeholder?: string;
  shortcut?: string;
  bordered?: boolean;
  className?: string;
}

export const search22Demo: Search22Props = {
  placeholder: "Search docs, blocks, components...",
  bordered: false,
};

export function Search22({
  placeholder = "Search",
  shortcut,
  bordered = false,
  className,
}: Search22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <button
        type="button"
        className={cn("group inline-flex w-full max-w-sm items-center gap-2 rounded-full bg-background/60 py-2 pl-3 pr-3 text-sm text-muted-foreground shadow-sm transition-colors hover:border-foreground/30 hover:bg-background", bordered && "border border-border")}
      >
        <Search className="size-4 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
        <span className="flex-1 truncate text-left">{placeholder}</span>
        {shortcut && (
          <kbd className="hidden shrink-0 items-center rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
            {shortcut}
          </kbd>
        )}
      </button>
    </div>
  );
}
