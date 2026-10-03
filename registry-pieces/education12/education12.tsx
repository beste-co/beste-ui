"use client";

import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education12Props {
  score?: number;
  total?: number;
  passing?: number;
  timeTaken?: string;
  result?: "passed" | "failed";
  bordered?: boolean;
  className?: string;
}

export const education12Demo: Education12Props = {
  score: 8,
  total: 10,
  timeTaken: "12:42",
  result: "passed",
  bordered: false,
};

export function Education12({
  score = 0,
  total = 1,
  passing,
  timeTaken,
  result = "passed",
  bordered = false,
  className,
}: Education12Props) {
  const passed = result === "passed";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-72 flex-col items-center gap-2 rounded-xl p-4 text-center shadow-sm",
          bordered && "border",
          passed
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-rose-500/50 bg-rose-500/5"
        )}
      >
        <Trophy
          className={cn(
            "size-6 shrink-0",
            passed ? "text-emerald-500" : "text-rose-500"
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "text-xs font-semibold",
            passed
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-rose-700 dark:text-rose-300"
          )}
        >
          {passed ? "You passed" : "Try again"}
        </span>
        <div className="flex items-baseline gap-2 tabular-nums">
          <span className="text-2xl font-bold text-card-foreground">
            {score}
          </span>
          <span className="text-2xl font-bold text-muted-foreground">
            / {total}
          </span>
        </div>
        {passing !== undefined && (
          <span className="text-xs tabular-nums text-muted-foreground">
            Passing mark {passing} of {total}
          </span>
        )}
        {timeTaken && (
          <span className="text-xs tabular-nums text-muted-foreground">
            Finished in {timeTaken}
          </span>
        )}
      </div>
    </div>
  );
}
