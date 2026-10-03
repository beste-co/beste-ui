"use client";

import { cn } from "@/lib/utils";

interface Education6Props {
  title?: string;
  students?: string;
  rating?: string;
  updated?: string;
  bordered?: boolean;
  className?: string;
}

export const education6Demo: Education6Props = {
  title: "Full-stack TypeScript",
  students: "12,480 enrolled",
  rating: "4.8",
  updated: "Updated last week",
  bordered: false,
};

export function Education6({
  title,
  students,
  rating,
  updated,
  bordered = false,
  className,
}: Education6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {title && (
          <span className="text-sm font-semibold leading-snug text-card-foreground">
            {title}
          </span>
        )}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {students && (
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Students</span>
              <span className="font-semibold tabular-nums text-card-foreground">
                {students.split(" ")[0]}
              </span>
            </div>
          )}
          {rating && (
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-semibold tabular-nums text-card-foreground">
                {rating}
              </span>
            </div>
          )}
          {updated && (
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Updated</span>
              <span className="font-semibold text-card-foreground">
                Last week
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
