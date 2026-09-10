"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Code1Props {
  code?: string;
  language?: string;
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

export const code1Demo: Code1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  code: "const greeting = \"Hello, Beste!\";",
  language: "ts",
};

export function Code1({
  code,
  language,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Code1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2 rounded-lg border border-current/15 bg-current/10 px-3 py-2 shadow-sm">
        <code className="flex-1 truncate font-mono text-sm">
          {code}
        </code>
        {language && (
          <span className={cn("shrink-0 rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold uppercase text-current/60", surfaceTone, bordered && "border border-current/15")}>
            {language}
          </span>
        )}
      </div>
    </div>
  );
}
