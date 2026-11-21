"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Search35Props {
  title?: string;
  /** The page address on the right of the header */
  path?: string;
  /** A setting with a green status, e.g. Auto-generate On */
  toggle?: { label: string; status: string };
  trailLabel?: string;
  /** The breadcrumb as shown; the last entry is the current page */
  trail?: string[];
  field?: { label: string; value: string };
  /** A quiet line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const search35Demo: Search35Props = {
  title: "Breadcrumb",
  toggle: { label: "Auto-generate", status: "On" },
  trail: ["Home", "Features", "Integrations"],
  framed: true,
};

export function Search35({ title, path, toggle, trailLabel, trail = [], field, note, framed = true, fill = false, className }: Search35Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || path) && (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-semibold">{title}</span>
              {path && <span className="truncate text-muted-foreground">{path}</span>}
            </div>
          )}
          {toggle && (
            <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5">
              <span className="text-sm">{toggle.label}</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{toggle.status}</span>
            </div>
          )}
          {trail.length > 0 && (
            <div className="flex flex-col gap-1.5 border-t border-border pt-2.5">
              {trailLabel && <span className="text-muted-foreground">{trailLabel}</span>}
              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted px-2.5 py-2.5 text-sm">
                {trail.map((crumb, index) => (
                  <Fragment key={index}>
                    {index > 0 && (
                      <span aria-hidden="true" className="text-muted-foreground/70">
                        /
                      </span>
                    )}
                    <span className={cn(index === trail.length - 1 ? "font-medium" : "border-b border-foreground/25")}>{crumb}</span>
                  </Fragment>
                ))}
              </div>
            </div>
          )}
          {field && (
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground">{field.label}</span>
              <div className="truncate rounded-lg bg-background px-2.5 py-2 text-sm ring-1 ring-border">{field.value}</div>
            </div>
          )}
          {note && (
            <div className="flex items-center gap-1.5 border-t border-border pt-2.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
