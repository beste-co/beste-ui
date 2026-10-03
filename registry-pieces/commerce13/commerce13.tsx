"use client";

import { BadgeCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce13Props {
  reviewer?: string;
  initials?: string;
  rating?: number;
  date?: string;
  title?: string;
  body?: string;
  verified?: boolean;
  bordered?: boolean;
  className?: string;
}

export const commerce13Demo: Commerce13Props = {
  reviewer: "Hania Rani",
  initials: "HR",
  rating: 5,
  title: "Exactly as described",
  body: "Sizing runs true and the leather softens beautifully after a week. Would buy again.",
  bordered: false,
};

export function Commerce13({
  reviewer = "Customer",
  initials,
  rating = 5,
  date,
  title,
  body,
  verified,
  bordered = false,
  className,
}: Commerce13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-card-foreground"
            aria-hidden="true"
          >
            {initials ?? reviewer.charAt(0)}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-1">
              <span className="truncate text-xs font-semibold text-card-foreground">
                {reviewer}
              </span>
              {verified && (
                <BadgeCheck
                  className="size-3 text-sky-500"
                  aria-hidden="true"
                />
              )}
            </div>
            {date && (
              <span className="text-xs text-muted-foreground">{date}</span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3",
                  i < rating
                    ? "fill-amber-500 text-amber-500"
                    : "text-muted-foreground/40"
                )}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        {title && (
          <span className="text-sm font-semibold text-card-foreground">
            {title}
          </span>
        )}
        {body && (
          <p className="text-xs leading-snug text-muted-foreground">{body}</p>
        )}
      </div>
    </div>
  );
}
