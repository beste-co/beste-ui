"use client";

import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Legal2Props {
  label?: string;
  name?: string;
  role?: string;
  dateLine?: string;
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

export const legal2Demo: Legal2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Sign here",
  name: "Beste Sözen",
  role: "Principal, Beste Design Studio",
  dateLine: "Date: __ / __ / ____",
};

export function Legal2({
  label = "Sign here",
  name,
  role,
  dateLine = "Date: __ / __ / ____",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Legal2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg p-4 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="relative flex h-20 items-end border-b-2 border-dashed border-muted-foreground/40 px-2 pb-1">
          <span
            className="absolute -left-1 -top-1 -rotate-12 rounded-md bg-rose-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm"
            aria-hidden="true"
          >
            <PenLine
              className="mr-1 inline-block size-3"
              aria-hidden="true"
            />
            {label}
          </span>
          <span className="text-current/25">×</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col">
            {name && (
              <span className="font-medium">{name}</span>
            )}
            {role && (
              <span className="text-current/60">{role}</span>
            )}
          </div>
          <span className="font-mono text-current/60">{dateLine}</span>
        </div>
      </div>
    </div>
  );
}
