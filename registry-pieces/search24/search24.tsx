"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface ResultRow {
  title: string;
  meta: string;
  kind: string;
}

interface Search24Props {
  query?: string;
  groupLabel?: string;
  results?: ResultRow[];
  footer?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const search24Demo: Search24Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  query: "rowan",
  groupLabel: "Members",
  results: [
    { title: "Rowan Blake", meta: "Active · Clinic 2", kind: "Member" },
    { title: "Rowan Blake · Intake notes", meta: "Updated 3 days ago", kind: "Document" },
    { title: "Invoice #4821", meta: "Rowan Blake · Paid", kind: "Billing" },
  ],
  footer: "3 of 11 matches shown",
};

export function Search24({ query, groupLabel, results = [], footer, surface = "card", bordered = true, inverted = false, className }: Search24Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div
        className={cn(
          "w-full max-w-96 overflow-hidden rounded-md shadow-xl",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-current/15 px-4 py-3">
          <Search className="size-4 shrink-0 text-current/60" aria-hidden="true" />
          <span className="flex-1 truncate text-sm">{query}</span>
          <span className="h-4 w-px shrink-0 bg-current" aria-hidden="true" />
        </div>

        {groupLabel && (
          <p className="px-4 pt-3 font-mono text-xs uppercase tracking-widest text-current/60">
            {groupLabel}
          </p>
        )}

        <div className="flex flex-col p-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 rounded-md px-2 py-2",
                index === 0 && "bg-current/10"
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{result.title}</p>
                <p className="truncate text-xs text-current/60">{result.meta}</p>
              </div>
              <span className="shrink-0 rounded-full border border-current/15 px-2 py-0.5 text-xs text-current/60">
                {result.kind}
              </span>
            </div>
          ))}
        </div>

        {footer && (
          <p className="border-t border-current/15 px-4 py-2 text-xs text-current/60">{footer}</p>
        )}
      </div>
    </div>
  );
}
