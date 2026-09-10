"use client";

import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "emerald"
  | "violet";

interface Education1Props {
  title?: string;
  instructor?: string;
  lessons?: number;
  lessonsLabel?: string;
  hours?: string;
  progress?: number;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const thumbClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500",
  ocean: "bg-gradient-to-br from-sky-500 to-indigo-500",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sunset: "bg-orange-500",
  ocean: "bg-indigo-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
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

export const education1Demo: Education1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Design systems for shipping teams",
  instructor: "Beste Sözen",
  lessons: 24,
  lessonsLabel: "lessons",
  hours: "6h 42m",
  progress: 58,
  tone: "primary",
};

export function Education1({
  title,
  instructor,
  lessons,
  lessonsLabel = "lessons",
  hours,
  progress = 0,
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Education1Props) {
  const pct = Math.max(0, Math.min(100, progress));

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-xl shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div
          className={cn(
            "relative flex aspect-video items-center justify-center",
            thumbClasses[tone]
          )}
        >
          <GraduationCap className="size-8 text-white/80" aria-hidden="true" />
          <span className="absolute bottom-2 right-2 rounded-md bg-background/80 px-2 py-0.5 font-mono text-xs text-foreground">
            {lessons} {lessonsLabel}
          </span>
        </div>
        <div className="flex flex-col gap-2 p-3">
          {title && (
            <span className="line-clamp-2 text-sm font-semibold leading-snug">
              {title}
            </span>
          )}
          <div className="flex items-center gap-2 text-xs text-current/60">
            {instructor && <span>{instructor}</span>}
            {hours && (
              <>
                <span aria-hidden="true">·</span>
                <span>{hours}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-1 flex-1 overflow-hidden rounded-full bg-current/10"
              aria-hidden="true"
            >
              <div
                className={cn("h-full rounded-full", barClasses[tone])}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-xs text-current/60">
              {pct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
