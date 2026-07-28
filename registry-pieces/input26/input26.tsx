"use client";

import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input26Props {
  listening?: boolean;
  transcript?: string;
  className?: string;
}

export const input26Demo: Input26Props = {
  listening: true,
  transcript: "Remind me to buy coffee beans on my way home",
};

export function Input26({
  listening = false,
  transcript,
  className,
}: Input26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-full border border-border bg-card py-2 pl-3 pr-2 shadow-sm">
        <span className="flex-1 truncate text-sm text-card-foreground">
          {transcript}
          {listening && (
            <span
              className="ml-1 inline-block h-4 w-px animate-pulse bg-rose-500 align-middle"
              aria-hidden="true"
            />
          )}
        </span>
        <div className="flex shrink-0 items-end gap-0.5" aria-hidden="true">
          {[2, 4, 6, 3, 5].map((h, idx) => (
            <span
              key={idx}
              className="w-0.5 animate-pulse rounded-full bg-rose-500"
              style={{ height: `${h * 3}px`, animationDelay: `${idx * 120}ms` }}
            />
          ))}
        </div>
        <button
          type="button"
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            listening
              ? "bg-rose-500 text-white"
              : "bg-muted text-muted-foreground"
          )}
          aria-label={listening ? "Stop" : "Record"}
        >
          <Mic className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
