"use client";

import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav9Props {
  crumbs?: string[];
  className?: string;
}

export const nav9Demo: Nav9Props = {
  crumbs: ["Docs", "API reference", "Webhooks"],
};

export function Nav9({ crumbs = [], className }: Nav9Props) {
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
        <Home
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <div key={idx} className="flex items-center gap-1 truncate">
              <ChevronRight
                className="size-3.5 shrink-0 text-muted-foreground/60"
                aria-hidden="true"
              />
              <span
                className={cn(
                  "truncate",
                  isLast
                    ? "font-semibold text-card-foreground"
                    : "text-muted-foreground"
                )}
              >
                {c}
              </span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
