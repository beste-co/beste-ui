"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "aurora"
  | "emerald";

interface Stats11Props {
  value?: string;
  label?: string;
  caption?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  neutral: "border border-border bg-card text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-br from-rose-500 via-orange-500 to-amber-400 text-white",
  ocean: "bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 text-white",
  aurora: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-400 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-400 text-white",
};

export const stats11Demo: Stats11Props = {
  value: "1M+",
  label: "Active developers",
  caption: "Using Beste across 140 countries",
  tone: "neutral",
};

export function Stats11({
  value = "0",
  label,
  caption,
  tone = "neutral",
  className,
}: Stats11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-72 flex-col items-center gap-1 rounded-xl px-4 py-4 text-center shadow-lg shadow-black/20",
          toneClasses[tone]
        )}
      >
        <span className="text-5xl font-black tabular-nums leading-none tracking-tight">
          {value}
        </span>
        {label && (
          <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
            {label}
          </span>
        )}
        {caption && (
          <span className="text-xs leading-snug opacity-80">{caption}</span>
        )}
      </div>
    </div>
  );
}
