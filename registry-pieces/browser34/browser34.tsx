"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "emerald" | "amber" | "muted";

interface Row {
  name: string;
  status: string;
  tone?: Tone;
}

interface Browser34Props {
  url?: string;
  rows?: Row[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const pillStyles: Record<Tone, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600",
  amber: "bg-amber-500/10 text-amber-600",
  muted: "bg-current/10 text-current/60",
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

export const browser34Demo: Browser34Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  url: "app.sirius.care/members",
  rows: [
    { name: "Rowan Blake", status: "Active", tone: "emerald" },
    { name: "Amelia Frost", status: "Intake", tone: "amber" },
    { name: "Noah Reyes", status: "Discharged", tone: "muted" },
  ],
};

export function Browser34({ url, rows = [], surface = "card", bordered = true, inverted = false, className }: Browser34Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 overflow-hidden rounded-md shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2 border-b border-current/15 bg-current/10 px-3 py-2">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-rose-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </div>
          {url && (
            <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-md border border-current/15 bg-background px-2.5 py-1 text-foreground">
              <Lock
                className="size-3 shrink-0 text-current/60"
                aria-hidden="true"
              />
              <span className="truncate font-mono text-xs text-current/60">
                {url}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-md border border-current/15 px-3 py-2"
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-current/10 text-xs font-semibold text-current/60"
                aria-hidden="true"
              >
                {row.name.charAt(0)}
              </span>
              <span className="flex-1 truncate text-sm">
                {row.name}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                  pillStyles[row.tone ?? "muted"]
                )}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
