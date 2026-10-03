"use client";

import { cn } from "@/lib/utils";

type Grade = "A+" | "A" | "B+" | "B" | "C" | "D" | "F";

interface Education14Props {
  grade?: Grade;
  assignment?: string;
  score?: string;
  feedback?: string;
  bordered?: boolean;
  className?: string;
}

export const education14Demo: Education14Props = {
  grade: "A",
  assignment: "The ethics of automation",
  score: "92 / 100",
  bordered: false,
};

export function Education14({
  grade = "B",
  assignment,
  score,
  feedback,
  bordered = false,
  className,
}: Education14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-3 rounded-xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        {assignment && (
          <span className="truncate text-sm text-muted-foreground">
            {assignment}
          </span>
        )}
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-5xl font-medium leading-none tracking-tight text-card-foreground">
            {grade}
          </span>
          {score && (
            <span className="text-sm tabular-nums text-muted-foreground">
              {score}
            </span>
          )}
        </div>
        {feedback && (
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
}
