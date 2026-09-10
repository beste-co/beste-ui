"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Status = "up" | "degraded" | "down";

interface Dashboard25Service {
  name: string;
  status: Status;
  uptime: string;
}

interface Dashboard25Props {
  heading?: string;
  upLabel?: string;
  degradedLabel?: string;
  downLabel?: string;
  services?: Dashboard25Service[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const DOT: Record<Status, string> = {
  up: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-rose-500",
};


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

export const dashboard25Demo: Dashboard25Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  heading: "Services",
  upLabel: "Operational",
  degradedLabel: "Degraded",
  downLabel: "Outage",
  services: [
    { name: "API", status: "up", uptime: "99.99%" },
    { name: "Ingest", status: "degraded", uptime: "99.82%" },
    { name: "Billing", status: "up", uptime: "99.97%" },
    { name: "Workers", status: "up", uptime: "99.95%" },
  ],
};

export function Dashboard25({
  heading = "Services",
  upLabel = "Operational",
  degradedLabel = "Degraded",
  downLabel = "Outage",
  services = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard25Props) {
  const labels: Record<Status, string> = {
    up: upLabel,
    degraded: degradedLabel,
    down: downLabel,
  };
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
          {heading}
        </span>
        <ul className="flex flex-col divide-y divide-border">
          {services.map((s) => (
            <li
              key={s.name}
              className="flex items-center justify-between gap-2 py-1.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="relative flex size-2" aria-hidden="true">
                  {s.status !== "down" && (
                    <span
                      className={cn(
                        "absolute inset-0 animate-ping rounded-full opacity-60",
                        DOT[s.status]
                      )}
                    />
                  )}
                  <span
                    className={cn("relative size-2 rounded-full", DOT[s.status])}
                  />
                </span>
                <span className="truncate text-xs font-medium">
                  {s.name}
                </span>
                <span className="truncate text-xs text-current/60">
                  {labels[s.status]}
                </span>
              </div>
              <span className="shrink-0 font-mono text-xs tabular-nums">
                {s.uptime}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
