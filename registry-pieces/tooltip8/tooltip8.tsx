"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "emerald"
  | "violet"
  | "rose"
  | "amber";

interface Tooltip8Props {
  name?: string;
  hex?: string;
  tone?: Tone;
  className?: string;
}

const swatchClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500",
  ocean: "bg-gradient-to-br from-sky-500 to-indigo-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

export const tooltip8Demo: Tooltip8Props = {
  name: "Sunset",
  hex: "#F97066",
  tone: "sunset",
};

export function Tooltip8({
  name,
  hex,
  tone = "primary",
  className,
}: Tooltip8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card py-1.5 pl-2 pr-3 shadow-lg">
          <span
            className={cn(
              "size-6 rounded-md border border-border shadow-sm",
              swatchClasses[tone]
            )}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            {name && (
              <span className="text-xs font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {hex && (
              <span className="font-mono text-xs text-muted-foreground">
                {hex}
              </span>
            )}
          </div>
        </div>
        <div
          className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-card"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
