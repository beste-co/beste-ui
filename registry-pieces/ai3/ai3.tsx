"use client";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ai3Props {
  model?: string;
  speed?: string;
  image?: string;
  alt?: string;
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

export const ai3Demo: Ai3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  model: "Claude Opus 4.6",
  speed: "Balanced",
  image: "https://oud.pics/sm/l/claude.png",
  alt: "Claude",
};

export function Ai3({
  model = "Model",
  speed,
  image,
  alt,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <button
        type="button"
        className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm transition-colors hover:bg-current/10", surfaceTone, bordered && "border border-current/15")}
      >
        {image ? (
          <span className="relative size-5 shrink-0 overflow-hidden rounded-full bg-current/10">
            <img
              src={image}
              alt={alt ?? model}
              className="absolute inset-0 size-full object-cover"
            />
          </span>
        ) : (
          <div className="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
            <Sparkles className="size-3" aria-hidden="true" />
          </div>
        )}
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold">
            {model}
          </span>
          {speed && (
            <span className="text-xs text-current/60">{speed}</span>
          )}
        </div>
        <ChevronDown
          className="size-3.5 text-current/60"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
