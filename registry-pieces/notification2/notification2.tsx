"use client";

import { AlertTriangle, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Severity = "error" | "warning" | "info";

interface Notification2Props {
  title?: string;
  description?: string;
  severity?: Severity;
  dismissible?: boolean;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const severityConfig: Record<
  Severity,
  { icon: typeof Info; color: string }
> = {
  error: {
    icon: TriangleAlert,
    color: "text-rose-600 dark:text-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: Info,
    color: "text-sky-600 dark:text-sky-400",
  },
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

export const notification2Demo: Notification2Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  title: "Your card was declined",
  description: "Update the payment method on file to retry the charge.",
  severity: "error",
  dismissible: true,
};

export function Notification2({
  title,
  description,
  severity = "info",
  dismissible = false,
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Notification2Props) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-start gap-3 rounded-lg p-3 shadow-lg", surfaceTone, bordered && "border border-current/15")}>
        <Icon
          className={cn("mt-0.5 size-5 shrink-0", config.color)}
          aria-hidden="true"
        />
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
        </div>
        {dismissible && (
          <button
            type="button"
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-current/60 transition-colors hover:bg-current/10 hover:text-current"
            aria-label="Dismiss"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
