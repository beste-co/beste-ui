"use client";

import { Sparkles } from "lucide-react";
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

interface Ai17Props {
  title?: string;
  bullets?: string[];
  source?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

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

export const ai17Demo: Ai17Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Weekly summary",
  bullets: [
    "Onboarding ships to GA on Tuesday",
    "Pricing experiment lifts conversion by 14%",
    "Two critical bugs filed, one already patched",
  ],
  source: "Synthesized from 3 documents",
  tone: "violet",
};

export function Ai17({
  title = "Summary",
  bullets = [],
  source,
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai17Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md px-3 py-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-1.5">
          <Sparkles
            className={cn("size-3.5", iconClasses[tone])}
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {title}
          </span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm leading-snug"
            >
              <span
                className="mt-1.5 size-1 shrink-0 rounded-full bg-current"
                aria-hidden="true"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {source && (
          <span className="border-t border-current/15 pt-2 text-xs text-current/60">
            {source}
          </span>
        )}
      </div>
    </div>
  );
}
