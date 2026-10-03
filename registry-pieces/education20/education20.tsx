"use client";

import { cn } from "@/lib/utils";

interface TranscriptLine {
  timestamp: string;
  speaker?: string;
  text: string;
  active?: boolean;
}

interface Education20Props {
  lesson?: string;
  lines?: TranscriptLine[];
  bordered?: boolean;
  className?: string;
}

export const education20Demo: Education20Props = {
  lesson: "Transcript",
  lines: [
    {
      timestamp: "12:31",
      text: "So whenever you see a generic constraint like `T extends`, ask yourself what the caller will pass.",
    },
    {
      timestamp: "12:42",
      text: "This pattern prevents us from widening the type back to unknown.",
      active: true,
    },
    {
      timestamp: "12:58",
      text: "What happens if we omit the constraint entirely?",
    },
  ],
  bordered: false,
};

export function Education20({
  lesson,
  lines = [],
  bordered = false,
  className,
}: Education20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {lesson && (
          <span className="text-xs font-semibold text-muted-foreground">
            {lesson}
          </span>
        )}
        <div className="flex flex-col">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-3 rounded-md px-1 py-1 text-xs",
                line.active && "bg-sky-500/10"
              )}
            >
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {line.timestamp}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                {line.speaker && (
                  <span className="text-xs font-semibold text-card-foreground">
                    {line.speaker}
                  </span>
                )}
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
