"use client";

import { cn } from "@/lib/utils";

interface Chat11Props {
  emoji?: string;
  timestamp?: string;
  className?: string;
}

export const chat11Demo: Chat11Props = {
  emoji: "🎉",
  timestamp: "09:44",
};

export function Chat11({
  emoji = "👋",
  timestamp,
  className,
}: Chat11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-end gap-0.5">
        <span
          className="text-6xl leading-none drop-shadow-sm"
          aria-hidden="true"
        >
          {emoji}
        </span>
        {timestamp && (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
