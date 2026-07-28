"use client";

import { Copy, Webhook } from "lucide-react";
import { cn } from "@/lib/utils";

interface Automation6Props {
  url?: string;
  method?: "POST" | "GET" | "PUT" | "DELETE";
  lastReceived?: string;
  secretSet?: boolean;
  headerLabel?: string;
  signedLabel?: string;
  className?: string;
}

const methodClasses = {
  POST: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  GET: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  PUT: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  DELETE: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

export const automation6Demo: Automation6Props = {
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
  className,
}: Automation6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Webhook
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {headerLabel}
          </span>
          {secretSet && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span
                className="size-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              {signedLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 overflow-hidden rounded-sm border border-border bg-muted/50 pl-1.5 pr-1 py-1">
          <span
            className={cn(
              "shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-xs font-bold",
              methodClasses[method]
            )}
          >
            {method}
          </span>
          <span className="flex-1 truncate font-mono text-xs text-card-foreground">
            {url}
          </span>
          <button
            type="button"
            className="flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-card hover:text-foreground"
            aria-label="Copy URL"
          >
            <Copy className="size-3" />
          </button>
        </div>
        {lastReceived && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
