"use client";

import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

interface Nav10Props {
  tail?: string[];
  className?: string;
}

export const nav10Demo: Nav10Props = {
  tail: ["Design tokens", "Color scales"],
};

export function Nav10({
  tail = [],
  className,
}: Nav10Props) {
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
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-muted-foreground hover:text-card-foreground"
          aria-label="More crumbs"
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
          <ChevronDown className="size-3" aria-hidden="true" />
        </button>
        <ChevronRight
          className="size-3.5 shrink-0 text-muted-foreground/60"
          aria-hidden="true"
        />
        {tail.map((c, idx) => {
          const isLast = idx === tail.length - 1;
          return (
            <div key={idx} className="flex items-center gap-1 truncate">
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
