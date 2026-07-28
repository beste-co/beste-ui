"use client";

import { File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorTab {
  filename: string;
  active?: boolean;
  dirty?: boolean;
}

interface Editor6Props {
  tabs?: EditorTab[];
  className?: string;
}

export const editor6Demo: Editor6Props = {
  tabs: [
    { filename: "index.tsx" },
    { filename: "button.tsx", active: true, dirty: true },
    { filename: "card.tsx" },
    { filename: "theme.css" },
  ],
};

export function Editor6({ tabs = [], className }: Editor6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-end gap-0.5 border-b border-border">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 rounded-t-md border border-b-0 px-3 py-1.5 font-mono text-xs",
              tab.active
                ? "border-border bg-card text-card-foreground"
                : "border-transparent text-muted-foreground hover:bg-muted/50"
            )}
          >
            <File
              className="size-3 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="max-w-24 truncate">{tab.filename}</span>
            {tab.dirty ? (
              <span
                className="size-1.5 shrink-0 rounded-full bg-sky-500"
                aria-label="Unsaved"
              />
            ) : (
              <button
                type="button"
                aria-label={`Close ${tab.filename}`}
                className="flex size-3.5 items-center justify-center rounded-sm transition-colors hover:bg-muted"
              >
                <X className="size-2.5" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
