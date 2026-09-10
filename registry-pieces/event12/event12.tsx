"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface CountdownUnit {
  value: string;
  label: string;
}

interface Event12Props {
  title?: string;
  units?: CountdownUnit[];
  caption?: string;
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

export const event12Demo: Event12Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Opens to everyone in",
  units: [
    { value: "12", label: "days" },
    { value: "06", label: "hrs" },
    { value: "48", label: "min" },
  ],
  caption: "Early access closes when the counter runs out.",
};

export function Event12({ title, units = [], caption, surface = "card", bordered = true, inverted = false, className }: Event12Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-80 rounded-md p-5 text-center shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        {title && <p className="text-sm text-current/60">{title}</p>}

        <div className="mt-3 flex items-stretch justify-center divide-x divide-border">
          {units.map((unit, index) => (
            <div key={index} className="flex-1 px-2">
              <p className="text-3xl font-light tracking-tight tabular-nums">
                {unit.value}
              </p>
              <p className="mt-0.5 text-sm text-current/60">{unit.label}</p>
            </div>
          ))}
        </div>

        {caption && (
          <p className="mt-4 border-t border-current/15 pt-3 text-sm leading-relaxed text-current/60">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
