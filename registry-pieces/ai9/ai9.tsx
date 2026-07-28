"use client";

import { cn } from "@/lib/utils";

interface Ai9Props {
  prompts?: string[];
  className?: string;
}

export const ai9Demo: Ai9Props = {
  prompts: [
    "Summarize this doc",
    "Draft a reply",
    "Extract action items",
    "Translate to Turkish",
  ],
};

export function Ai9({ prompts = [], className }: Ai9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-wrap items-center justify-center gap-1.5">
        {prompts.map((p, i) => (
          <button
            key={i}
            type="button"
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-card-foreground shadow-sm transition-colors hover:bg-muted"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
