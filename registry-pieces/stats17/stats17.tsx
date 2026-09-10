"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Side {
  label: string;
  value: string;
  caption: string;
}

interface Stats17Props {
  title?: string;
  before?: Side;
  after?: Side;
  footnote?: string;
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

export const stats17Demo: Stats17Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Time to first booking",
  before: { label: "Before", value: "9 days", caption: "across three systems" },
  after: { label: "After", value: "4 hours", caption: "on one workspace" },
  footnote: "Median across eleven practices that switched last quarter.",
};

export function Stats17({ title, before, after, footnote, surface = "card", bordered = true, inverted = false, className }: Stats17Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-96 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        {title && <p className="text-sm font-semibold">{title}</p>}

        <div className="mt-4 flex items-center gap-4">
          {before && (
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs uppercase tracking-widest text-current/60">
                {before.label}
              </p>
              <p className="mt-1 text-2xl font-light tracking-tight tabular-nums text-current/60">
                {before.value}
              </p>
              <p className="mt-0.5 text-xs text-current/60">{before.caption}</p>
            </div>
          )}

          <ArrowRight className="size-4 shrink-0 text-current/60" aria-hidden="true" />

          {after && (
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs uppercase tracking-widest text-primary">
                {after.label}
              </p>
              <p className="mt-1 text-2xl font-light tracking-tight tabular-nums">
                {after.value}
              </p>
              <p className="mt-0.5 text-xs text-current/60">{after.caption}</p>
            </div>
          )}
        </div>

        {footnote && (
          <p className="mt-4 border-t border-current/15 pt-3 text-sm leading-relaxed text-current/60">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}
