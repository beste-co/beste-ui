"use client";

import { cn } from "@/lib/utils";

type Mood = "great" | "good" | "okay" | "low" | "bad";

interface Health17Props {
  today?: Mood;
  week?: Mood[];
  note?: string;
  label?: string;
  className?: string;
}

const moodConfig: Record<Mood, { emoji: string; label: string }> = {
  great: { emoji: "😄", label: "Great" },
  good: { emoji: "🙂", label: "Good" },
  okay: { emoji: "😐", label: "Okay" },
  low: { emoji: "😕", label: "Low" },
  bad: { emoji: "😢", label: "Bad" },
};

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

export const health17Demo: Health17Props = {
  today: "good",
  week: ["okay", "good", "great", "low", "good", "good", "great"],
  note: "4 of 7 days above neutral this week.",
  label: "Mood today",
};

export function Health17({
  today = "okay",
  week = [],
  note,
  label = "Mood today",
  className,
}: Health17Props) {
  const config = moodConfig[today];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-label={config.label}>
            {config.emoji}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            <span className="text-sm font-semibold text-card-foreground">
              {config.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1" aria-hidden="true">
          {week.map((m, idx) => {
            const c = moodConfig[m];
            return (
              <div
                key={idx}
                className="flex flex-1 flex-col items-center gap-0.5"
              >
                <span className="text-xs text-muted-foreground">
                  {weekdays[idx]}
                </span>
                <span className="flex h-8 items-center justify-center text-xl">
                  {c.emoji}
                </span>
              </div>
            );
          })}
        </div>
        {note && (
          <span className="border-t border-border pt-2 text-xs text-muted-foreground">
            {note}
          </span>
        )}
      </div>
    </div>
  );
}
