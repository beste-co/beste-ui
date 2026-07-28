"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai11Props {
  label?: string;
  tone?: Tone;
  className?: string;
}

const dotClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500",
  amber: "bg-gradient-to-br from-amber-500 to-orange-500",
};

export const ai11Demo: Ai11Props = {
  label: "Thinking",
  tone: "violet",
};

export function Ai11({
  label = "Thinking",
  tone = "violet",
  className,
}: Ai11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "size-1.5 animate-pulse rounded-full",
                dotClasses[tone]
              )}
              style={{
                animationDelay: `${i * 180}ms`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
