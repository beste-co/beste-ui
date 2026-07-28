"use client";

import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education12Props {
  score?: number;
  total?: number;
  passing?: number;
  timeTaken?: string;
  result?: "passed" | "failed";
  className?: string;
}

export const education12Demo: Education12Props = {
  score: 8,
  total: 10,
  passing: 7,
  timeTaken: "12:42",
  result: "passed",
};

export function Education12({
  score = 0,
  total = 1,
  passing = 1,
  timeTaken,
  result = "passed",
  className,
}: Education12Props) {
  const pct = Math.round((score / Math.max(1, total)) * 100);
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
          "flex w-full max-w-72 flex-col items-center gap-2 rounded-xl border p-4 text-center shadow-sm",
          passed
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-rose-500/50 bg-rose-500/5"
        )}
      >
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full text-white shadow-md",
            passed ? "bg-emerald-500" : "bg-rose-500"
          )}
        >
          <Trophy className="size-5" aria-hidden="true" />
        </div>
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            passed
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-rose-700 dark:text-rose-300"
          )}
        >
          {passed ? "You passed" : "Try again"}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-card-foreground">
            {score}
          </span>
          <span className="text-2xl font-bold text-muted-foreground">
            / {total}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {pct}% · Passing mark {passing}/{total}
        </span>
        {timeTaken && (
          <span className="text-xs text-muted-foreground">
            Finished in {timeTaken}
          </span>
        )}
      </div>
    </div>
  );
}
