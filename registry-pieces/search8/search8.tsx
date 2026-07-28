"use client";

import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search8Props {
  transcript?: string;
  status?: string;
  className?: string;
}

const barHeights = [
  "h-2",
  "h-4",
  "h-5",
  "h-3",
  "h-6",
  "h-4",
  "h-2",
  "h-5",
  "h-3",
  "h-4",
];

export const search8Demo: Search8Props = {
  transcript: "Find last month's sales report",
  status: "Listening…",
};

export function Search8({
  transcript,
  status = "Listening…",
  className,
}: Search8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-full border border-border bg-card py-2 pl-2 pr-4 shadow-md">
        <div className="relative flex size-9 shrink-0 items-center justify-center">
          <span
            className="absolute inline-flex size-full animate-ping rounded-full bg-rose-500/40"
            aria-hidden="true"
          />
          <span className="relative flex size-9 items-center justify-center rounded-full bg-rose-500 text-white">
            <Mic className="size-4" aria-hidden="true" />
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {transcript && (
            <span className="truncate text-sm font-medium text-card-foreground">
              {transcript}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{status}</span>
        </div>
        <div
          className="flex shrink-0 items-end gap-0.5"
          aria-hidden="true"
        >
          {barHeights.map((h, idx) => (
            <span
              key={idx}
              className={cn(
                "w-0.5 animate-pulse rounded-full bg-rose-500/80",
                h
              )}
              style={{ animationDelay: `${idx * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
