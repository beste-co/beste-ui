"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Priority = "low" | "medium" | "high";

interface Card5Props {
  task?: string;
  priority?: Priority;
  done?: boolean;
  due?: string;
  duePrefix?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const priorityClasses: Record<Priority, string> = {
  low: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
};

const priorityLabel: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
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

export const card5Demo: Card5Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  task: "Review Q2 roadmap with design team",
  priority: "high",
  due: "Tomorrow",
  duePrefix: "Due",
  done: false,
};

export function Card5({
  task,
  priority = "medium",
  done = false,
  due,
  duePrefix = "Due",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Card5Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-start gap-3 rounded-lg px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <button
          type="button"
          aria-label={done ? "Mark incomplete" : "Mark complete"}
          aria-pressed={done}
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
            done
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-current/15 bg-current/10 hover:border-emerald-500"
          )}
        >
          {done && <Check className="size-3" aria-hidden="true" />}
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className={cn(
              "text-sm leading-snug",
              done
                ? "text-current/60 line-through"
                : ""
            )}
          >
            {task}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium",
                priorityClasses[priority]
              )}
            >
              {priorityLabel[priority]}
            </span>
            {due && (
              <span className="text-xs text-current/60">
                {duePrefix} {due}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
