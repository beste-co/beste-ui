"use client";

import { cn } from "@/lib/utils";

interface Block {
  start: string;
  label: string;
  tone: "focus" | "meeting" | "break" | "admin";
}

interface Calendar19Props {
  date?: string;
  blocks?: Block[];
  className?: string;
}

const toneClasses: Record<Block["tone"], string> = {
  focus: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  meeting: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  break: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  admin: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
};

export const calendar19Demo: Calendar19Props = {
  date: "Mon · Apr 27",
  blocks: [
    { start: "09:00", label: "Focus · API refactor", tone: "focus" },
    { start: "10:30", label: "Standup", tone: "meeting" },
    { start: "11:00", label: "Focus · API refactor", tone: "focus" },
    { start: "12:00", label: "Lunch", tone: "break" },
    { start: "13:00", label: "Design review", tone: "meeting" },
    { start: "14:30", label: "Email & admin", tone: "admin" },
  ],
};

export function Calendar19({
  date,
  blocks = [],
  className,
}: Calendar19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {date && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {date}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          {blocks.map((b, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-right font-mono text-xs text-muted-foreground">
                {b.start}
              </span>
              <div
                className={cn(
                  "flex min-h-8 flex-1 items-center rounded-md px-2.5 py-1",
                  toneClasses[b.tone]
                )}
              >
                <span className="text-sm font-medium text-card-foreground">
                  {b.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
