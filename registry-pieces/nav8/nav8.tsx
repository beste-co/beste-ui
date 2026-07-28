"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav8Props {
  crumbs?: string[];
  className?: string;
}

export const nav8Demo: Nav8Props = {
  crumbs: ["Docs", "API reference", "Webhooks", "Retries"],
};

export function Nav8({ crumbs = [], className }: Nav8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <nav
        aria-label="Breadcrumb"
        className="flex w-full max-w-80 items-center gap-1 text-sm"
      >
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <div
              key={idx}
              className="flex items-center gap-1 truncate"
            >
              <span
                className={cn(
                  "truncate",
                  isLast
                    ? "font-semibold text-card-foreground"
                    : "text-muted-foreground hover:text-card-foreground"
                )}
              >
                {c}
              </span>
              {!isLast && (
                <ChevronRight
                  className="size-3.5 shrink-0 text-muted-foreground/60"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
