"use client";

import { Subtitles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptLine {
  timestamp: string;
  speaker: string;
  text: string;
  active?: boolean;
}

interface Education20Props {
  lesson?: string;
  lines?: TranscriptLine[];
  className?: string;
}

export const education20Demo: Education20Props = {
  lesson: "Transcript · 12:48 of 28:14",
  lines: [
    {
      timestamp: "12:31",
      speaker: "Prof. Vasquez",
      text: "So whenever you see a generic constraint like `T extends`, ask yourself what the caller will pass.",
    },
    {
      timestamp: "12:42",
      speaker: "Prof. Vasquez",
      text: "This pattern prevents us from widening the type back to unknown.",
      active: true,
    },
    {
      timestamp: "12:58",
      speaker: "Priya",
      text: "What happens if we omit the constraint entirely?",
    },
  ],
};

export function Education20({
  lesson,
  lines = [],
  className,
}: Education20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-sky-500/15 text-sky-500">
            <Subtitles className="size-3.5" aria-hidden="true" />
          </div>
          {lesson && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {lesson}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-3 rounded-md px-1 py-1 text-xs",
                line.active && "bg-sky-500/10"
              )}
            >
              <span className="shrink-0 font-mono text-muted-foreground">
                {line.timestamp}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-xs font-semibold text-card-foreground">
                  {line.speaker}
                </span>
                <span
                  className={cn(
                    "leading-snug",
                    line.active ? "text-card-foreground" : "text-muted-foreground"
                  )}
                >
                  {line.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
