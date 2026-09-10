"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "foreground" | "primary" | "muted";

interface Browser1Props {
  url?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  foreground: "bg-foreground",
  primary: "bg-primary",
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

export const browser1Demo: Browser1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  url: "https://stripe.com",
  tone: "muted",
};

export function Browser1({
  url,
  tone = "foreground",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Browser1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-56 items-center gap-2 rounded-lg px-3 py-2 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <Globe
          className="size-3.5 shrink-0 text-current/60"
          aria-hidden="true"
        />
        <span className="flex-1 truncate text-xs font-medium">
          {url}
        </span>
        <span
          className={cn(
            "h-3 w-0.5 shrink-0 animate-pulse",
            toneClasses[tone]
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
