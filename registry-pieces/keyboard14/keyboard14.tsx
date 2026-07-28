"use client";

import { cn } from "@/lib/utils";

interface Keyboard14Props {
  prompt?: string;
  keyLabel?: string;
  hint?: string;
  className?: string;
}

export const keyboard14Demo: Keyboard14Props = {
  prompt: "Press space to continue",
  keyLabel: "Space",
  hint: "or click anywhere",
};

export function Keyboard14({
  prompt,
  keyLabel = "Space",
  hint,
  className,
}: Keyboard14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        {prompt && (
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {prompt}
          </span>
        )}
        <div className="relative">
          <span
            className="absolute inset-x-2 -bottom-1 h-2 rounded-b-xl bg-muted-foreground/20 blur-sm"
            aria-hidden="true"
          />
          <kbd className="relative flex h-11 w-48 items-center justify-center rounded-xl border border-border border-b-4 bg-gradient-to-b from-card to-muted font-mono text-sm font-medium tracking-widest text-card-foreground shadow-sm">
            {keyLabel}
          </kbd>
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
