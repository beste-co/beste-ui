"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "low" | "medium" | "high";

interface Card5Props {
  task?: string;
  priority?: Priority;
  done?: boolean;
  due?: string;
  duePrefix?: string;
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

export const card5Demo: Card5Props = {
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
  className,
}: Card5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <button
          type="button"
          aria-label={done ? "Mark incomplete" : "Mark complete"}
          aria-pressed={done}
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
            done
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-border bg-card hover:border-emerald-500"
          )}
        >
          {done && <Check className="size-3" aria-hidden="true" />}
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className={cn(
              "text-sm leading-snug",
              done
                ? "text-muted-foreground line-through"
                : "text-card-foreground"
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
              <span className="text-xs text-muted-foreground">
                {duePrefix} {due}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
