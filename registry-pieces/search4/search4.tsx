"use client";

import { CornerDownLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search4Props {
  query?: string;
  suggestions?: string[];
  className?: string;
}

export const search4Demo: Search4Props = {
  query: "ship",
  suggestions: [
    "shipping address",
    "shipping labels API",
    "shipping zones setup",
  ],
};

function highlight(text: string, q: string) {
  if (!q) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      <span className="text-card-foreground">{text.slice(0, idx)}</span>
      <span className="font-semibold text-card-foreground">
        {text.slice(idx, idx + q.length)}
      </span>
      <span className="text-muted-foreground">
        {text.slice(idx + q.length)}
      </span>
    </>
  );
}

export function Search4({
  query = "",
  suggestions = [],
  className,
}: Search4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-card-foreground">
            {query}
          </span>
        </div>
        {suggestions.length > 0 && (
          <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-md">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground",
                  idx === 0 && "bg-muted/50"
                )}
              >
                <Search
                  className="size-3 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="flex-1 truncate">
                  {highlight(item, query)}
                </span>
                {idx === 0 && (
                  <CornerDownLeft
                    className="size-3 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
