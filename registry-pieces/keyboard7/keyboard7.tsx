"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sky" | "emerald" | "violet" | "amber";

interface Keyboard7Props {
  keyLabel?: string;
  caption?: string;
  tone?: Tone;
  className?: string;
}

const ringClasses: Record<Tone, string> = {
  primary: "bg-primary/30",
  foreground: "bg-foreground/30",
  sky: "bg-sky-500/30",
  emerald: "bg-emerald-500/30",
  violet: "bg-violet-500/30",
  amber: "bg-amber-500/30",
};

const capClasses: Record<Tone, string> = {
  primary: "border-primary bg-primary text-primary-foreground",
  foreground: "border-foreground bg-foreground text-background",
  sky: "border-sky-500 bg-sky-500 text-white",
  emerald: "border-emerald-500 bg-emerald-500 text-white",
  violet: "border-violet-500 bg-violet-500 text-white",
  amber: "border-amber-500 bg-amber-500 text-white",
};

export const keyboard7Demo: Keyboard7Props = {
  keyLabel: "Space",
  caption: "Press to continue",
  tone: "violet",
};

export function Keyboard7({
  keyLabel = "Space",
  caption,
  tone = "primary",
  className,
}: Keyboard7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <span
            className={cn(
              "absolute inline-flex size-14 animate-ping rounded-xl opacity-75",
              ringClasses[tone]
            )}
            aria-hidden="true"
          />
          <kbd
            className={cn(
              "relative flex h-12 min-w-32 items-center justify-center rounded-xl border border-b-2 px-4 font-mono text-sm font-semibold shadow-lg",
              capClasses[tone]
            )}
          >
            {keyLabel}
          </kbd>
        </div>
        {caption && (
          <span className="text-xs font-medium text-muted-foreground">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
