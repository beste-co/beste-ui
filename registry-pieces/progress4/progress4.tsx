"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "foreground" | "muted";

interface Progress4Props {
  label?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  muted: "bg-current/40",
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

export const progress4Demo: Progress4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Thinking",
  tone: "primary",
};

export function Progress4({
  label,
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Progress4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "size-1.5 rounded-full animate-pulse",
                toneClasses[tone]
              )}
              style={{
                animationDelay: `${i * 160}ms`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
        {label && (
          <span className="text-xs font-medium text-current/60">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
