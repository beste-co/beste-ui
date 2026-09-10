"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Automation16Header {
  key: string;
  value: string;
}

interface Automation16Props {
  method?: string;
  url?: string;
  headersLabel?: string;
  headers?: Automation16Header[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const METHOD_PRESETS: Record<string, string> = {
  GET: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  POST: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  PUT: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  PATCH: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  DELETE: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};
const DEFAULT_METHOD_CLASSES = "bg-current/10 text-current/60";


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

export const automation16Demo: Automation16Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  method: "POST",
  url: "https://api.beste.co/v1/invoices",
  headersLabel: "Headers",
  headers: [
    { key: "Authorization", value: "Bearer ••••" },
    { key: "Content-Type", value: "application/json" },
    { key: "Idempotency-Key", value: "{{run.id}}" },
  ],
};

export function Automation16({
  method = "POST",
  url = "https://example.com",
  headersLabel = "Headers",
  headers = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation16Props) {
  const methodClasses = METHOD_PRESETS[method] ?? DEFAULT_METHOD_CLASSES;
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-md shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-1.5 border-b border-current/15 px-3 py-2">
          <span
            className={cn(
              "shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-xs font-bold",
              methodClasses
            )}
          >
            {method}
          </span>
          <span className="flex-1 truncate font-mono text-xs">
            {url}
          </span>
        </div>
        <div className="flex flex-col px-3 py-2">
          <span className="pb-1 text-xs font-semibold uppercase tracking-wide text-current/60">
            {headersLabel}
          </span>
          <ul className="flex flex-col gap-0.5">
            {headers.map((h, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-2 font-mono text-xs"
              >
                <span className="truncate text-current/60">
                  {h.key}
                </span>
                <span className="truncate">
                  {h.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
