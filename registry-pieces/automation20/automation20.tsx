"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Automation20Group {
  label: string;
  variables: string[];
}

interface Automation20Props {
  heading?: string;
  groups?: Automation20Group[];
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

export const automation20Demo: Automation20Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  heading: "Available variables",
  groups: [
    {
      label: "Trigger",
      variables: ["event.type", "event.created_at"],
    },
    {
      label: "Customer",
      variables: ["customer.email", "customer.name"],
    },
  ],
};

export function Automation20({
  heading = "Available variables",
  groups = [],
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Automation20Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="text-xs font-medium">{heading}</span>
        <div className="flex flex-col gap-1.5">
          {groups.map((g) => (
            <div key={g.label} className="flex flex-col gap-1">
              <span className="text-xs text-current/60">{g.label}</span>
              <div className="flex flex-wrap gap-1">
                {g.variables.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center rounded-sm bg-violet-500/15 px-1.5 py-0.5 text-xs font-medium text-violet-600 dark:text-violet-400"
                  >
                    {"{{"}
                    {v}
                    {"}}"}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
