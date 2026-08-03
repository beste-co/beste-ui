"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
  className?: string;
}

export const search24Demo: Search24Props = {
  query: "rowan",
  groupLabel: "Members",
  results: [
    { title: "Rowan Blake", meta: "Active · Clinic 2", kind: "Member" },
    { title: "Rowan Blake · Intake notes", meta: "Updated 3 days ago", kind: "Document" },
    { title: "Invoice #4821", meta: "Rowan Blake · Paid", kind: "Billing" },
  ],
  footer: "3 of 11 matches shown",
};

export function Search24({ query, groupLabel, results = [], footer, className }: Search24Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-96 overflow-hidden rounded-md border border-border bg-card shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="flex-1 truncate text-sm text-card-foreground">{query}</span>
          <span className="h-4 w-px shrink-0 bg-foreground" aria-hidden="true" />
        </div>

        {groupLabel && (
          <p className="px-4 pt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {groupLabel}
          </p>
        )}

        <div className="flex flex-col p-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 rounded-md px-2 py-2",
                index === 0 && "bg-muted"
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-card-foreground">{result.title}</p>
                <p className="truncate text-xs text-muted-foreground">{result.meta}</p>
              </div>
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                {result.kind}
              </span>
            </div>
          ))}
        </div>

        {footer && (
          <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">{footer}</p>
        )}
      </div>
    </div>
  );
}
