"use client";

import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Browser10Props {
  message?: string;
  rejectLabel?: string;
  acceptLabel?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const acceptClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-current/90",
  violet: "bg-violet-500 text-white hover:bg-violet-500/90",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-500/90",
  sky: "bg-sky-500 text-white hover:bg-sky-500/90",
  amber: "bg-amber-500 text-white hover:bg-amber-500/90",
  rose: "bg-rose-500 text-white hover:bg-rose-500/90",
};

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
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

export const browser10Demo: Browser10Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  message: "We use cookies to measure traffic and improve your experience.",
  rejectLabel: "Reject",
  acceptLabel: "Accept",
  tone: "primary",
};

export function Browser10({
  message = "This site uses cookies.",
  rejectLabel = "Reject",
  acceptLabel = "Accept",
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Browser10Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-start gap-3 rounded-lg px-3 py-2.5 shadow-md", surfaceTone, bordered && "border border-current/15")}>
        <Cookie
          className={cn("mt-0.5 size-5 shrink-0", iconClasses[tone])}
          aria-hidden="true"
        />
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs leading-snug">
            {message}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className={cn(
                "rounded-md px-2 py-1 text-xs font-semibold transition-colors",
                acceptClasses[tone]
              )}
            >
              {acceptLabel}
            </button>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs font-medium text-current/60 transition-colors hover:bg-current/10 hover:text-current"
            >
              {rejectLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
