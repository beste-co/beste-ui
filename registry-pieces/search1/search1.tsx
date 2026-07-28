"use client";

import { Search } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Search1Props {
  placeholder?: string;
  shortcut?: string[];
  className?: string;
}

export const search1Demo: Search1Props = {
  placeholder: "Search anything...",
  shortcut: ["⌘", "K"],
};

export function Search1({
  placeholder = "Search...",
  shortcut,
  className,
}: Search1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        <Search
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="flex-1 truncate text-sm text-muted-foreground">
          {placeholder}
        </span>
        {shortcut && shortcut.length > 0 && (
          <div className="flex items-center gap-0.5" aria-hidden="true">
            {shortcut.map((key, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <span className="text-xs text-muted-foreground/60">+</span>
                )}
                <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-border border-b-2 bg-muted px-1 font-mono text-xs font-medium text-muted-foreground">
                  {key}
                </kbd>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
