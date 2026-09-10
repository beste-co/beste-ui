"use client";

import { Copy, Webhook } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Automation6Props {
  url?: string;
  method?: "POST" | "GET" | "PUT" | "DELETE";
  lastReceived?: string;
  secretSet?: boolean;
  headerLabel?: string;
  signedLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const methodClasses = {
  POST: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  GET: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  PUT: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  DELETE: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
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

export const automation6Demo: Automation6Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  url: "https://hooks.beste.co/wf/8a2k4f1m9n",
  method: "POST",
  lastReceived: "Last event 14s ago",
  secretSet: true,
  headerLabel: "Webhook",
  signedLabel: "Signed",
};

export function Automation6({
  url = "https://example.com/webhook",
  method = "POST",
  lastReceived,
  secretSet,
  headerLabel = "Webhook",
  signedLabel = "Signed",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation6Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-1.5">
          <Webhook
            className="size-3.5 text-current/60"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {headerLabel}
          </span>
          {secretSet && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-current/60">
              <span
                className="size-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              {signedLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 overflow-hidden rounded-sm border border-current/15 bg-current/5 pl-1.5 pr-1 py-1">
          <span
            className={cn(
              "shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-xs font-bold",
              methodClasses[method]
            )}
          >
            {method}
          </span>
          <span className="flex-1 truncate font-mono text-xs">
            {url}
          </span>
          <button
            type="button"
            className="flex size-6 shrink-0 items-center justify-center rounded-sm text-current/60 hover:bg-current/10 hover:text-foreground"
            aria-label="Copy URL"
          >
            <Copy className="size-3" />
          </button>
        </div>
        {lastReceived && (
          <div className="flex items-center gap-1.5 text-xs text-current/60">
            <span
              className="size-1.5 animate-pulse rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            {lastReceived}
          </div>
        )}
      </div>
    </div>
  );
}
