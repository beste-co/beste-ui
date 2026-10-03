"use client";

import { Clipboard } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "sky"
  | "emerald"
  | "rose";

interface Upload11Props {
  title?: string;
  hint?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-600 dark:text-violet-300",
  sky: "text-sky-600 dark:text-sky-300",
  emerald: "text-emerald-600 dark:text-emerald-300",
  rose: "text-rose-600 dark:text-rose-300",
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

export const upload11Demo: Upload11Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  title: "Paste an image from your clipboard",
  hint: "Screenshot, copy, and press the shortcut to drop it here.",
  tone: "primary",
};

export function Upload11({
  title,
  hint,
  tone = "primary",
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Upload11Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-3 rounded-xl border border-dashed border-current/15 bg-current/5 px-5 py-6 text-center">
        <Clipboard
          className={cn("size-6 shrink-0", iconClasses[tone])}
          aria-hidden="true"
        />
        {title && (
          <span className="text-sm font-semibold">
            {title}
          </span>
        )}
        {hint && (
          <span className="text-balance text-xs text-current/60">
            {hint}
          </span>
        )}
        <div className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-current/60 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
          <kbd className="font-semibold">⌘</kbd>
          <span>+</span>
          <kbd className="font-semibold">V</kbd>
        </div>
      </div>
    </div>
  );
}
