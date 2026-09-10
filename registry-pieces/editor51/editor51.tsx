"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Character = "serif" | "hairline" | "mono" | "editorial";

interface Editor51Props {
  setName?: string;
  heading?: string;
  traits?: string[];
  buttonLabel?: string;
  character?: Character;
  stepMs?: number;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const headingClasses: Record<Character, string> = {
  serif: "font-serif text-lg font-normal leading-snug",
  hairline: "text-lg font-medium leading-snug tracking-tight",
  mono: "text-base font-medium uppercase leading-snug tracking-wide",
  editorial: "font-serif text-lg font-semibold leading-tight",
};

const eyebrowClasses: Record<Character, string> = {
  serif: "text-xs uppercase tracking-widest text-current/60",
  hairline:
    "rounded-full border border-current/15 px-2 py-0.5 text-xs text-current/60",
  mono: "font-mono text-xs lowercase text-current/60",
  editorial:
    "text-xs font-semibold uppercase tracking-wider text-current/60",
};

/* The two solid buttons flip with the surface: a foreground fill on a foreground
   card would disappear. The other two draw themselves in `current` already. */
const buttonClasses = (inverted: boolean): Record<Character, string> => ({
  serif: "text-xs underline underline-offset-4",
  hairline:
    inverted
      ? "rounded-full bg-background px-3 py-1 text-xs font-medium text-foreground"
      : "rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background",
  mono: "rounded-none border border-foreground px-3 py-1 font-mono text-xs uppercase",
  editorial:
    inverted
      ? "rounded-sm bg-background px-3 py-1 text-xs font-semibold text-foreground"
      : "rounded-sm bg-foreground px-3 py-1 text-xs font-semibold text-background",
});

/* Auralis writes its eyebrow inside brackets; the others do not. */
const eyebrowText = (character: Character, setName: string) =>
  character === "mono" ? `(${setName.toLowerCase()})` : setName;

const STYLES = `
@keyframes editor51-in { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }
.editor51-in { animation: editor51-in 340ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .editor51-in { animation: none; } }
`;


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

export const editor51Demo: Editor51Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  setName: "Altair",
  heading: "Calm, photographic, serif",
  traits: ["Photographs that drift as you scroll", "Headings that settle in"],
  buttonLabel: "See the set",
  character: "serif",
  stepMs: 260,
};

export function Editor51({
  setName,
  heading,
  traits = [],
  buttonLabel,
  character = "serif",
  stepMs = 260,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor51Props) {
  const [settled, setSettled] = useState(0);
  const total = 3 + traits.length;

  useEffect(() => {
    if (settled >= total) return;
    const id = setTimeout(() => setSettled((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [settled, total, stepMs]);

  const step = (index: number) =>
    settled > index ? "editor51-in" : "invisible";

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{STYLES}</style>

      <div
        className={cn(
          "flex w-full max-w-72 flex-col gap-2.5 rounded-xl p-4 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        {setName && (
          <span
            className={cn("self-start", eyebrowClasses[character], step(0))}
          >
            {eyebrowText(character, setName)}
          </span>
        )}

        {heading && (
          <span
            className={cn(
              headingClasses[character],
              step(1)
            )}
          >
            {heading}
          </span>
        )}

        {traits.length > 0 && (
          <div className="flex flex-col gap-1">
            {traits.map((trait, index) => (
              <p
                key={trait}
                className={cn(
                  "text-xs text-current/60",
                  step(2 + index)
                )}
              >
                {trait}
              </p>
            ))}
          </div>
        )}

        {buttonLabel && (
          <button
            type="button"
            className={cn(
              "self-start",
              buttonClasses(inverted)[character],
              step(2 + traits.length)
            )}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
