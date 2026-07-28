"use client";

import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Grade = "A+" | "A" | "B+" | "B" | "C" | "D" | "F";

interface Education14Props {
  grade?: Grade;
  assignment?: string;
  score?: string;
  feedback?: string;
  className?: string;
}

const gradeClasses: Record<Grade, string> = {
  "A+": "bg-emerald-500 text-white",
  A: "bg-emerald-500 text-white",
  "B+": "bg-sky-500 text-white",
  B: "bg-sky-500 text-white",
  C: "bg-amber-500 text-white",
  D: "bg-orange-500 text-white",
  F: "bg-rose-500 text-white",
};

export const education14Demo: Education14Props = {
  grade: "A",
  assignment: "Essay · The ethics of automation",
  score: "92 / 100",
  feedback: "Compelling thesis, strong citations. Tighten the conclusion.",
};

export function Education14({
  grade = "B",
  assignment,
  score,
  feedback,
  className,
}: Education14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-start gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div
          className={cn(
            "flex size-14 shrink-0 flex-col items-center justify-center rounded-xl shadow-md",
            gradeClasses[grade]
          )}
        >
          <span className="font-serif text-2xl font-bold">{grade}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Graded
            </span>
          </div>
          {assignment && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {assignment}
            </span>
          )}
          {score && (
            <span className="text-xs text-card-foreground">
              {score}
            </span>
          )}
          {feedback && (
            <span className="line-clamp-2 text-xs text-muted-foreground">
              {feedback}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
