"use client";

import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education30Props {
  title?: string;
  excerpt?: string;
  course?: string;
  answers?: number;
  unanswered?: number;
  bordered?: boolean;
  className?: string;
}

export const education30Demo: Education30Props = {
  title: "Ask me anything · Career pivots",
  excerpt: "Share your story and the thing you wish you knew earlier. I'll reply over the weekend.",
  course: "Mentor hours",
  answers: 38,
  bordered: false,
};

export function Education30({
  title,
  excerpt,
  course,
  answers = 0,
  unanswered = 0,
  bordered = false,
  className,
}: Education30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 shrink-0 text-sky-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {course && (
              <span className="truncate text-xs text-muted-foreground">
                {course}
              </span>
            )}
          </div>
        </div>
        {excerpt && (
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 border-t border-border pt-2 text-xs tabular-nums">
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
            <span
              className="size-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            {answers} answered
          </span>
          {unanswered > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300">
              <span
                className="size-1.5 rounded-full bg-amber-500"
                aria-hidden="true"
              />
              {unanswered} waiting
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
