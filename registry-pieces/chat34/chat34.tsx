"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Chat34Props {
  question?: string;
  answer?: string;
  sourcesLabel?: string;
  sources?: string[];
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

export const chat34Demo: Chat34Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  question: "How many rooms were unused last Tuesday?",
  answer:
    "Three, all at Kingsway between 13:00 and 16:00. Two were held for a clinic that was cancelled on the Friday before.",
  sourcesLabel: "Answered from",
  sources: ["Rota", "Bookings", "Cancellations"],
};

export function Chat34({ question, answer, sourcesLabel, sources = [], surface = "card", bordered = true, inverted = false, className }: Chat34Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div
        className={cn(
          "w-full max-w-96 rounded-md p-5 shadow-xl",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        {question && (
          <p className="ml-auto w-fit max-w-[85%] rounded-md bg-current/10 px-3 py-2 text-sm">
            {question}
          </p>
        )}

        <div className="mt-3 flex gap-2.5">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Sparkles className="size-3.5" />
          </span>
          {answer && (
            <p className="text-sm leading-relaxed">{answer}</p>
          )}
        </div>

        {sources.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-current/15 pt-3">
            {sourcesLabel && (
              <span className="text-sm text-current/60">{sourcesLabel}</span>
            )}
            {sources.map((source, index) => (
              <span
                key={index}
                className="rounded-full border border-current/15 px-2 py-0.5 text-xs text-current/60"
              >
                {source}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
