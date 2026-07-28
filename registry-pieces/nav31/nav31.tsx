"use client";

import { ChevronRight, Home } from "lucide-react";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  active?: boolean;
}

interface Nav31Props {
  items?: Crumb[];
  className?: string;
}

export const nav31Demo: Nav31Props = {
  items: [
    { label: "Projects" },
    { label: "Beste Co." },
    { label: "Settings", active: true },
  ],
};

export function Nav31({ items = [], className }: Nav31Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <nav
        aria-label="Breadcrumb"
        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm"
      >
        <Home
          className="size-3.5 text-muted-foreground"
          aria-hidden="true"
        />
        <ChevronRight
          className="size-3 text-muted-foreground"
          aria-hidden="true"
        />
        {items.map((item, index) => (
          <Fragment key={index}>
            <span
              className={cn(
                "text-sm",
                item.active
                  ? "font-semibold text-card-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
            {index < items.length - 1 && (
              <ChevronRight
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </Fragment>
        ))}
      </nav>
    </div>
  );
}
