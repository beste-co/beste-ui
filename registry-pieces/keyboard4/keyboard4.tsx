"use client";

import { cn } from "@/lib/utils";

interface Keyboard4Props {
  keyLabel?: string;
  caption?: string;
  className?: string;
}

export const keyboard4Demo: Keyboard4Props = {
  keyLabel: "⌘",
  caption: "Command",
};

export function Keyboard4({
  keyLabel = "⌘",
  caption,
  className,
}: Keyboard4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <span
            className="absolute inset-x-1 -bottom-1 h-2 rounded-b-xl bg-muted-foreground/20 blur-sm"
            aria-hidden="true"
          />
          <kbd className="relative flex size-20 items-center justify-center rounded-xl border border-border border-b-4 bg-gradient-to-b from-card to-muted font-mono text-4xl font-semibold text-card-foreground shadow-sm">
            {keyLabel}
          </kbd>
        </div>
        {caption && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
