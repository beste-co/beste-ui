"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Notification1Props {
  title?: string;
  description?: string;
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

export const notification1Demo: Notification1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Payment successful",
  description: "Your invoice has been sent to billing@beste.co",
  action: "View receipt →",
};

export function Notification1({
  title,
  description,
  action,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Notification1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-start gap-3 rounded-lg p-3 shadow-lg", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {title && (
            <span className="text-sm font-semibold">
              {title}
            </span>
          )}
          {description && (
            <span className="text-xs leading-snug text-current/60">
              {description}
            </span>
          )}
          {action && (
            <button
              type="button"
              className="mt-1 self-start text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              {action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
