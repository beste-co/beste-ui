"use client";

import { CheckCircle2, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type LessonStatus = "done" | "current" | "locked";

interface Education2Props {
  index?: number;
  title?: string;
  duration?: string;
  status?: LessonStatus;
  className?: string;
}

export const education2Demo: Education2Props = {
  index: 3,
  title: "Composing tokens with Tailwind",
  duration: "18 min",
  status: "current",
};

export function Education2({
  index = 1,
  title,
  duration,
  status = "current",
  className,
}: Education2Props) {
  const padded = index.toString().padStart(2, "0");

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 items-center gap-3 rounded-lg border bg-card p-3 shadow-sm",
          status === "current"
            ? "border-primary ring-2 ring-primary/20"
            : "border-border"
        )}
      >
        {status === "done" ? (
          <CheckCircle2
            className="size-6 shrink-0 text-emerald-500"
            aria-hidden="true"
          />
        ) : status === "current" ? (
          <PlayCircle
            className="size-6 shrink-0 text-primary"
            aria-hidden="true"
          />
        ) : (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs font-semibold text-muted-foreground">
            {padded}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          {title && (
            <span
              className={cn(
                "truncate text-sm font-medium",
                status === "locked"
                  ? "text-muted-foreground"
                  : "text-card-foreground"
              )}
            >
              {title}
            </span>
          )}
          {duration && (
            <span className="text-xs text-muted-foreground">{duration}</span>
          )}
        </div>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {padded}
        </span>
      </div>
    </div>
  );
}
