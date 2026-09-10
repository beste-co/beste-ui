"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Block {
  start: string;
  label: string;
  tone: "focus" | "meeting" | "break" | "admin";
}

interface Calendar19Props {
  date?: string;
  blocks?: Block[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const toneClasses: Record<Block["tone"], string> = {
  focus: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  meeting: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  break: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  admin: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const calendar19Demo: Calendar19Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Calendar19Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {date && (
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {date}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          {blocks.map((b, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-right font-mono text-xs text-current/60">
                {b.start}
              </span>
              <div
                className={cn(
                  "flex min-h-8 flex-1 items-center rounded-md px-2.5 py-1",
                  toneClasses[b.tone]
                )}
              >
                <span className="text-sm font-medium">
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
