"use client";

import { Github, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card28Props {
  name?: string;
  handle?: string;
  stack?: string[];
  contributions?: string;
  streak?: string;
  initials?: string;
  image?: string;
  className?: string;
}

export const card28Demo: Card28Props = {
  name: "Jules Park",
  handle: "jules.dev",
  stack: ["TypeScript", "Go", "Postgres", "Terraform"],
  contributions: "1,284 commits this year",
  streak: "12-day streak",
  initials: "JP",
  image:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop",
};

export function Card28({
  name,
  handle,
  stack = [],
  contributions,
  streak,
  initials = "??",
  image,
  className,
}: Card28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-900 font-mono text-xs font-bold text-slate-100 dark:bg-slate-100 dark:text-slate-900">
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
              <span className="inline-flex items-center gap-1 truncate font-mono text-xs text-muted-foreground">
                <Github className="size-3" aria-hidden="true" />
                {handle}
              </span>
            )}
          </div>
          <Terminal
            className="size-4 text-emerald-500"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {stack.map((s, idx) => (
            <span
              key={idx}
              className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
          {contributions && <span>{contributions}</span>}
          {streak && (
            <span className="rounded-full bg-orange-500/15 px-2 py-0.5 font-semibold text-orange-700 dark:text-orange-300">
              🔥 {streak}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
