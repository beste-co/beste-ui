"use client";

import { cn } from "@/lib/utils";

interface Module {
  week: number;
  title: string;
  done?: boolean;
}

interface Education23Props {
  courseTitle?: string;
  weeks?: Module[];
  bordered?: boolean;
  className?: string;
}

export const education23Demo: Education23Props = {
  courseTitle: "Syllabus",
  weeks: [
    { week: 1, title: "Fundamentals of composition", done: true },
    { week: 2, title: "State & reactivity", done: true },
    { week: 3, title: "Hooks in depth", done: true },
    { week: 4, title: "Performance patterns" },
  ],
  bordered: false,
};

export function Education23({
  courseTitle,
  weeks = [],
  bordered = false,
  className,
}: Education23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {courseTitle && (
          <span className="text-xs font-semibold text-muted-foreground">
            {courseTitle}
          </span>
        )}
        <div className="flex flex-col divide-y divide-border">
          {weeks.map((w, idx) => (
            <div key={idx} className="flex items-center gap-3 py-1.5">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                  w.done
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-muted text-muted-foreground"
                )}
              >
                W{w.week}
              </span>
              <span
                className={cn(
                  "flex-1 truncate text-sm",
                  w.done
                    ? "text-muted-foreground line-through"
                    : "text-card-foreground"
                )}
              >
                {w.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
