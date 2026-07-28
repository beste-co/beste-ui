"use client";

import { Highlighter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Highlight {
  text: string;
  tone: "amber" | "sky" | "emerald" | "rose";
}

interface Education18Props {
  lesson?: string;
  highlights?: Highlight[];
  note?: string;
  className?: string;
}

const toneClasses: Record<Highlight["tone"], string> = {
  amber: "bg-amber-500/25 text-amber-900 dark:text-amber-100",
  sky: "bg-sky-500/25 text-sky-900 dark:text-sky-100",
  emerald: "bg-emerald-500/25 text-emerald-900 dark:text-emerald-100",
  rose: "bg-rose-500/25 text-rose-900 dark:text-rose-100",
};

export const education18Demo: Education18Props = {
  lesson: "Lesson 6 · Hooks in depth",
  highlights: [
    {
      text: "useEffect runs after the DOM commit, not during render.",
      tone: "amber",
    },
    {
      text: "Cleanup runs before the next effect, and on unmount.",
      tone: "sky",
    },
  ],
  note: "Ask Priya about the stale-closure example in office hours.",
};

export function Education18({
  lesson,
  highlights = [],
  note,
  className,
}: Education18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <Highlighter className="size-3.5" aria-hidden="true" />
          </div>
          {lesson && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {lesson}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          {highlights.map((h, idx) => (
            <span
              key={idx}
              className={cn(
                "rounded px-2 py-1 text-xs leading-snug",
                toneClasses[h.tone]
              )}
            >
              {h.text}
            </span>
          ))}
        </div>
        {note && (
          <span className="border-t border-dashed border-border pt-2 text-xs italic text-muted-foreground">
            {note}
          </span>
        )}
      </div>
    </div>
  );
}
