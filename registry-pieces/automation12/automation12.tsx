"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Automation12Props {
  status?: "success" | "failed";
  runLabel?: string;
  statusCode?: string;
  duration?: string;
  body?: string;
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

export const automation12Demo: Automation12Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  status: "success",
  runLabel: "Test run",
  statusCode: "200 OK",
  duration: "142 ms",
  body: `{
  "id": "evt_8a2k4f",
  "type": "payment.succeeded",
  "amount": 4200,
  "currency": "usd"
}`,
};

export function Automation12({
  status = "success",
  runLabel = "Test run",
  statusCode = "200 OK",
  duration,
  body = "{}",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation12Props) {
  const success = status === "success";

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-md shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between gap-2 border-b border-current/15 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full",
                success
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
              )}
              aria-hidden="true"
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <span className="text-xs font-semibold">
              {runLabel}
            </span>
            <span
              className={cn(
                "font-mono text-xs font-semibold",
                success
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              )}
            >
              {statusCode}
            </span>
          </div>
          {duration && (
            <span className="font-mono text-xs text-current/60">
              {duration}
            </span>
          )}
        </div>
        <pre className="max-h-28 overflow-hidden whitespace-pre bg-current/5 px-3 py-2 font-mono text-xs leading-relaxed">
          {body}
        </pre>
      </div>
    </div>
  );
}
