"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Form36Props {
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  finePrint?: string;
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

export const form36Demo: Form36Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Get the launch note",
  placeholder: "you@practice.com",
  submitLabel: "Join",
  finePrint: "One email when we open the doors. Nothing else.",
};

export function Form36({ label, placeholder, submitLabel, finePrint, surface = "card", bordered = true, inverted = false, className }: Form36Props) {
  const emailId = useId();

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-96 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        {label && (
          <label htmlFor={emailId} className="text-sm font-medium">
            {label}
          </label>
        )}

        <div className="mt-2 flex gap-2">
          <input
            id={emailId}
            type="email"
            placeholder={placeholder}
            className="h-10 min-w-0 flex-1 rounded-md border border-current/15 bg-background px-3 text-sm text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            className="h-10 shrink-0 cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {submitLabel}
          </button>
        </div>

        {finePrint && <p className="mt-2 text-sm text-current/60">{finePrint}</p>}
      </div>
    </div>
  );
}
