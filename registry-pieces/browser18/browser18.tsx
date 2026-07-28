"use client";

import { KeyRound, Mail } from "lucide-react";

import { cn } from "@/lib/utils";

interface Suggestion {
  label: string;
  meta?: string;
}

interface Browser18Props {
  suggestions?: Suggestion[];
  className?: string;
}

export const browser18Demo: Browser18Props = {
  suggestions: [
    { label: "hello@beste.co", meta: "Last used yesterday" },
    { label: "hello@beste.co", meta: "Saved on Apr 12" },
  ],
};

export function Browser18({
  suggestions = [],
  className,
}: Browser18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1.5">
        <div className="flex items-center gap-2 rounded-md border-2 border-primary bg-card px-3 py-2 shadow-sm">
          <Mail
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            Email address
          </span>
          <span
            className="h-4 w-px animate-pulse bg-primary"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-md">
          <div className="flex items-center gap-1 border-b border-border bg-muted px-3 py-1">
            <KeyRound
              className="size-3 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Saved logins
            </span>
          </div>
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="flex flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-muted"
            >
              <span className="text-sm font-medium text-card-foreground">
                {s.label}
              </span>
              {s.meta && (
                <span className="text-xs text-muted-foreground">{s.meta}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
