"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Surface = "muted" | "none";

interface Editor62Props {
  section?: string;
  device?: string;
  headingLabel?: string;
  heading?: string;
  descriptionLabel?: string;
  description?: string;
  editingLabel?: string;
  savedLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  /** The panel behind the card: soft muted (default) or none */
  surface?: Surface;
  className?: string;
}

export const editor62Demo: Editor62Props = {
  section: "Hero",
  heading: "Skin care that takes its time",
  description: "Facials, brows and skin consultations in Lisbon.",
  surface: "muted",
  framed: true,
};

const STYLES = `
@keyframes editor62-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
.editor62-caret { animation: editor62-blink 1.1s step-end infinite; }
@media (prefers-reduced-motion: reduce) { .editor62-caret { animation: none; } }
`;

const TYPE_MS = 130;
const ERASE_MS = 35;
const HOLD_MS = 4400;
const PAUSE_MS = 900;

export function Editor62({
  section,
  device,
  headingLabel,
  heading = "",
  descriptionLabel,
  description,
  editingLabel,
  savedLabel,
  framed = true,
  fill = false,
  surface = "muted",
  className,
}: Editor62Props) {
  const [count, setCount] = useState(0);
  const [erasing, setErasing] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (still) return;
    const total = heading.length;
    let delay: number;
    let next: () => void;
    if (!erasing && count < total) {
      delay = count === 0 ? PAUSE_MS : TYPE_MS;
      next = () => setCount((value) => value + 1);
    } else if (!erasing) {
      delay = HOLD_MS;
      next = () => setErasing(true);
    } else if (count > 0) {
      delay = ERASE_MS;
      next = () => setCount((value) => value - 1);
    } else {
      delay = 0;
      next = () => setErasing(false);
    }
    const id = setTimeout(next, delay);
    return () => clearTimeout(id);
  }, [count, erasing, heading, still]);

  const shown = still ? heading : heading.slice(0, count);
  const saved = still || (!erasing && count >= heading.length && heading.length > 0);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>

      <div
        className={cn(
          "flex items-center justify-center rounded-2xl",
          surface === "muted" && "bg-muted p-6",
          fill ? "w-full" : "w-full max-w-md"
        )}
      >
        <div
          className={cn(
            "w-full max-w-90",
            framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
          )}
        >
          <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg")}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-semibold">{section}</span>
              {device && <span className="shrink-0 text-muted-foreground">{device}</span>}
            </div>

            {headingLabel && <span className="text-muted-foreground">{headingLabel}</span>}
            <div className="flex h-9 items-center rounded-lg border border-border px-2.5 text-sm font-semibold ring-3 ring-foreground/5">
              <span className="overflow-hidden whitespace-pre">{shown}</span>
              <span className="editor62-caret ml-px h-4 w-0.5 shrink-0 bg-chart-1" aria-hidden="true" />
            </div>

            {descriptionLabel && <span className="text-muted-foreground">{descriptionLabel}</span>}
            {description && (
              <div className="rounded-lg border border-border px-2.5 py-2 leading-normal">{description}</div>
            )}

            {(editingLabel || savedLabel) && (
            <div className="relative mt-0.5 h-4 text-muted-foreground">
              <span
                className={cn(
                  "absolute inset-y-0 left-0 flex items-center transition-opacity duration-500 motion-reduce:transition-none",
                  saved ? "opacity-0" : "opacity-100"
                )}
              >
                {editingLabel}
              </span>
              <span
                className={cn(
                  "absolute inset-y-0 left-0 flex items-center gap-1.5 transition-opacity duration-500 motion-reduce:transition-none",
                  saved ? "opacity-100" : "opacity-0"
                )}
              >
                <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
                <span className="truncate">{savedLabel}</span>
              </span>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
