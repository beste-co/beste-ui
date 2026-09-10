"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "foreground" | "sunset" | "emerald" | "sky" | "violet";

interface Notification3Props {
  appName?: string;
  title?: string;
  description?: string;
  time?: string;
  image?: string;
  alt?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const iconTileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
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

export const notification3Demo: Notification3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  appName: "Linear",
  title: "New issue assigned",
  description: "ENG-482 · Crash on checkout submit",
  time: "now",
  image: "https://oud.pics/sm/l/linear.jpeg",
  alt: "Linear",
  tone: "violet",
};

export function Notification3({
  appName = "Linear",
  title,
  description,
  time = "now",
  image,
  alt,
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Notification3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("flex w-full max-w-80 items-start gap-3 rounded-2xl p-3 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div
          className={cn(
            "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl",
            !image && iconTileClasses[tone]
          )}
        >
          {image ? (
            <img src={image} alt={alt ?? appName} className="absolute inset-0 size-full object-cover" />
          ) : (
            <Sparkles className="size-5" aria-hidden="true" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
              {appName}
            </span>
            <span className="text-xs text-current/60">{time}</span>
          </div>
          {title && <span className="text-sm font-semibold">{title}</span>}
          {description && (
            <span className="truncate text-sm text-current/60">{description}</span>
          )}
        </div>
      </div>
    </div>
  );
}
