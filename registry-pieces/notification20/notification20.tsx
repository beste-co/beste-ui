"use client";

import type { LucideIcon } from "lucide-react";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Notification20Props {
  icon?: LucideIcon;
  title?: string;
  meta?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
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

export const notification20Demo: Notification20Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  icon: UserPlus,
  title: "Access request",
  meta: "Joep Beving wants the records role",
  primaryLabel: "Approve",
  secondaryLabel: "Decline",
};

export function Notification20({
  icon: Icon = UserPlus,
  title,
  meta,
  primaryLabel,
  secondaryLabel,
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Notification20Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-80 rounded-md p-4 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-start gap-3">
          <Icon
            className="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            {title && (
              <p className="truncate text-sm font-semibold">{title}</p>
            )}
            {meta && <p className="text-sm leading-relaxed text-current/60">{meta}</p>}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {primaryLabel && (
            <button
              type="button"
              className="h-8 flex-1 cursor-pointer rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {primaryLabel}
            </button>
          )}
          {secondaryLabel && (
            <button
              type="button"
              className={cn("h-8 flex-1 cursor-pointer rounded-md bg-transparent text-sm font-medium transition-colors hover:bg-current/10", bordered && "border border-current/15")}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
