"use client";

import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Input1Props {
  placeholder?: string;
  cta?: string;
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

export const input1Demo: Input1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  placeholder: "you@company.com",
  cta: "Subscribe",
};

export function Input1({
  placeholder = "Enter your email",
  cta = "Submit",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Input1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-1 rounded-lg p-1 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex flex-1 items-center gap-2 px-2.5">
          <Mail
            className="size-3.5 shrink-0 text-current/60"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-current/60">
            {placeholder}
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
