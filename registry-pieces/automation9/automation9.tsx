"use client";

import { Filter, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Automation9Filter {
  field: string;
  op: string;
  value: string;
}

interface Automation9Props {
  match?: "all" | "any";
  filters?: Automation9Filter[];
  headerLabel?: string;
  addFilterLabel?: string;
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

export const automation9Demo: Automation9Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  match: "all",
  headerLabel: "Only run if",
  addFilterLabel: "Add filter",
  filters: [
    { field: "status", op: "is", value: '"paid"' },
    { field: "amount", op: ">", value: "100" },
    { field: "currency", op: "is", value: '"USD"' },
  ],
};

export function Automation9({
  match = "all",
  filters = [],
  headerLabel = "Only run if",
  addFilterLabel = "Add filter",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation9Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Filter
              className="size-3.5 text-current/60"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
              {headerLabel}
            </span>
          </div>
          <div className="inline-flex overflow-hidden rounded-sm border border-current/15 text-xs">
            <span
              className={cn(
                "px-1.5 py-0.5",
                match === "all"
                  ? "bg-foreground text-background"
                  : "text-current/60"
              )}
            >
              all
            </span>
            <span
              className={cn(
                "px-1.5 py-0.5",
                match === "any"
                  ? "bg-foreground text-background"
                  : "text-current/60"
              )}
            >
              any
            </span>
          </div>
        </div>
        <ul className="flex flex-col gap-1">
          {filters.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-1 rounded-sm border border-current/15 bg-current/5 px-2 py-1 font-mono text-xs"
            >
              <span className="font-semibold">
                {f.field}
              </span>
              <span className="text-current/60">{f.op}</span>
              <span className="text-sky-600 dark:text-sky-400">{f.value}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="inline-flex w-fit items-center gap-1 text-xs text-current/60 hover:text-foreground"
        >
          <Plus className="size-3" aria-hidden="true" />
          {addFilterLabel}
        </button>
      </div>
    </div>
  );
}
