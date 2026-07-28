"use client";

import { cn } from "@/lib/utils";

interface Keyboard13Props {
  sequence?: string[];
  caption?: string;
  className?: string;
}

export const keyboard13Demo: Keyboard13Props = {
  sequence: ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"],
  caption: "Unlock the secret",
};

export function Keyboard13({
  sequence = [],
  caption,
  className,
}: Keyboard13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-1">
          {sequence.map((key, idx) => (
            <kbd
              key={idx}
              className="flex size-7 items-center justify-center rounded-md border border-border border-b-2 bg-gradient-to-b from-card to-muted font-mono text-xs font-semibold text-card-foreground shadow-sm"
            >
              {key}
            </kbd>
          ))}
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
