"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "foreground" | "sky" | "emerald";

interface Badge4Props {
  name?: string;
  handle?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
};

const checkStrokeClasses: Record<Tone, string> = {
  primary: "stroke-primary-foreground",
  foreground: "stroke-background",
  sky: "stroke-white",
  emerald: "stroke-white",
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

export const badge4Demo: Badge4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  name: "Beste",
  handle: "@withbeste",
  tone: "sky",
};

export function Badge4({
  name = "Account",
  handle,
  tone = "sky",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Badge4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="text-sm font-semibold">
          {name}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={cn("size-5 shrink-0 fill-current", toneClasses[tone])}
          aria-label="Verified"
        >
          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <path
            d="m9 12 2 2 4-4"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={checkStrokeClasses[tone]}
          />
        </svg>
        {handle && (
          <span className="text-xs text-current/60">{handle}</span>
        )}
      </div>
    </div>
  );
}
