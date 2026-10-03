"use client";

import { cn } from "@/lib/utils";

interface Card28Props {
  name?: string;
  handle?: string;
  stack?: string[];
  contributions?: string;
  streak?: string;
  initials?: string;
  image?: string;
  bordered?: boolean;
  className?: string;
}

export const card28Demo: Card28Props = {
  name: "Jon Hopkins",
  handle: "jon.hopkins",
  stack: ["TypeScript", "Go", "Postgres"],
  contributions: "1,284 commits this year",
  initials: "JH",
  image:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop",
  bordered: false,
};

export function Card28({
  name,
  handle,
  stack = [],
  contributions,
  streak,
  initials = "??",
  image,
  bordered = false,
  className,
}: Card28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-900 text-xs font-bold text-slate-100 dark:bg-slate-100 dark:text-slate-900">
            {image ? (
              <img
                src={image}
                alt={name ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {handle && (
              <span className="truncate text-xs text-muted-foreground">
                {handle}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {stack.map((s, idx) => (
            <span
              key={idx}
              className={cn("rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground", bordered && "border border-border")}
            >
              {s}
            </span>
          ))}
        </div>
        {(contributions || streak) && (
          <div className="flex items-center justify-between gap-2 border-t border-border pt-2 text-xs text-muted-foreground">
            {contributions && (
              <span className="tabular-nums">{contributions}</span>
            )}
            {streak && (
              <span className="rounded-full bg-orange-500/15 px-2 py-0.5 font-semibold text-orange-700 dark:text-orange-300">
                {streak}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
