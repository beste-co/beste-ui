"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav13Props {
  segments?: string[];
  className?: string;
}

export const nav13Demo: Nav13Props = {
  segments: ["acme-studio", "marketing-site", "docs", "overview.mdx"],
};

export function Nav13({ segments = [], className }: Nav13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center overflow-hidden rounded-md border border-border bg-card shadow-sm">
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          return (
            <div
              key={idx}
              className={cn(
                "flex items-center font-mono text-xs",
                isLast ? "flex-1" : ""
              )}
            >
              <button
                type="button"
                className={cn(
                  "truncate px-2 py-1.5 transition-colors",
                  isLast
                    ? "flex-1 text-left font-semibold text-card-foreground"
                    : "text-muted-foreground hover:text-card-foreground"
                )}
              >
                {seg}
              </button>
              {!isLast && (
                <span
                  className="text-muted-foreground/50"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
              {isLast && (
                <ChevronDown
                  className="mx-2 size-3 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
