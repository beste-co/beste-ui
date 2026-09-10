"use client";

import { Blocks, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Editor47Props {
  title?: string;
  description?: string;
  buttonLabel?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const buttonClasses: Record<Tone, string> = {
  neutral: "bg-current/10 text-foreground hover:bg-current/10",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-current/90",
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
  sky: "bg-sky-600 text-white hover:bg-sky-700",
  violet: "bg-violet-600 text-white hover:bg-violet-700",
  amber: "bg-amber-600 text-white hover:bg-amber-700",
  rose: "bg-rose-600 text-white hover:bg-rose-700",
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

export const editor47Demo: Editor47Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Your page looks empty",
  description: "Start by adding your first block.",
  buttonLabel: "Add Block",
  tone: "emerald",
};

export function Editor47({
  title,
  description,
  buttonLabel,
  tone = "emerald",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor47Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-xs flex-col items-center gap-5 rounded-xl px-6 py-10 text-center shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div
          className="flex size-10 items-center justify-center rounded-lg bg-current/10"
          aria-hidden="true"
        >
          <Blocks className="size-4 text-current/60" />
        </div>
        {(title || description) && (
          <div className="flex flex-col items-center gap-0.5">
            {title && (
              <span className="text-sm font-medium">
                {title}
              </span>
            )}
            {description && (
              <p className="text-xs text-current/60">{description}</p>
            )}
          </div>
        )}
        {buttonLabel && (
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              buttonClasses[tone]
            )}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
