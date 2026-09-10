"use client";

import { Check, ChevronLeft, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface DetailRow {
  label: string;
  value: string;
}

interface Browser35Props {
  time?: string;
  title?: string;
  status?: string;
  headline?: string;
  rows?: DetailRow[];
  action?: string;
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

export const browser35Demo: Browser35Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  time: "09:41",
  title: "Appointment",
  status: "Confirmed",
  headline: "Wednesday, 14 May · 09:00",
  rows: [
    { label: "With", value: "Dr Amelia Frost" },
    { label: "Room", value: "Clinic 2, ground floor" },
    { label: "Bring", value: "Referral letter" },
  ],
  action: "Add to calendar",
};

export function Browser35({
  time,
  title,
  status,
  headline,
  rows = [],
  action,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Browser35Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div
        className={cn(
          "w-full max-w-60 overflow-hidden rounded-md shadow-xl",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-current/15 bg-current/10 px-4 py-2">
          <span className="font-mono text-xs tabular-nums text-current/60">{time}</span>
          <Wifi className="size-3 text-current/60" aria-hidden="true" />
        </div>

        <div className="flex items-center gap-2 border-b border-current/15 px-4 py-3">
          <ChevronLeft className="size-4 text-current/60" aria-hidden="true" />
          {title && <p className="text-sm font-semibold">{title}</p>}
        </div>

        <div className="p-4">
          {status && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
              <Check className="size-3" aria-hidden="true" />
              {status}
            </span>
          )}
          {headline && (
            <p className="mt-2 text-sm font-medium leading-snug">{headline}</p>
          )}

          {rows.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 border-t border-current/15 pt-3">
              {rows.map((row, index) => (
                <div key={index} className="flex items-baseline justify-between gap-3">
                  <span className="shrink-0 text-xs text-current/60">{row.label}</span>
                  <span className="truncate text-xs">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {action && (
            <span className="mt-4 flex h-9 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground">
              {action}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
