"use client";

import { Clock, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education6Props {
  title?: string;
  students?: string;
  rating?: string;
  updated?: string;
  className?: string;
}

export const education6Demo: Education6Props = {
  title: "Full-stack TypeScript · Spring cohort",
  students: "12,480 enrolled",
  rating: "4.8",
  updated: "Updated last week",
};

export function Education6({
  title,
  students,
  rating,
  updated,
  className,
}: Education6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        {title && (
          <span className="text-sm font-semibold leading-snug text-card-foreground">
            {title}
          </span>
        )}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {students && (
            <div className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Users className="size-3" aria-hidden="true" />
                Students
              </span>
              <span className="font-semibold text-card-foreground">
                {students.split(" ")[0]}
              </span>
            </div>
          )}
          {rating && (
            <div className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Star
                  className="size-3 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                Rating
              </span>
              <span className="font-semibold text-card-foreground">
                {rating}
              </span>
            </div>
          )}
          {updated && (
            <div className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock className="size-3" aria-hidden="true" />
                Updated
              </span>
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
