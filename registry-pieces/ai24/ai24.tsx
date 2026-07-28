"use client";

import { Brain, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai24Props {
  title?: string;
  thoughts?: string[];
  duration?: string;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
};

export const ai24Demo: Ai24Props = {
  title: "Thought for 8 seconds",
  duration: "8s",
  thoughts: [
    "User wants to rate limit 100 req/min per key.",
    "Leaky bucket gives smoother traffic than fixed window.",
    "Redis INCR with TTL is the simplest implementation.",
  ],
  tone: "violet",
};

export function Ai24({
  title = "Chain of thought",
  thoughts = [],
  tone = "violet",
  className,
}: Ai24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5 rounded-md border border-dashed border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Brain
              className={cn("size-3.5", iconClasses[tone])}
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-card-foreground">
              {title}
            </span>
          </div>
          <ChevronDown
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col gap-1 border-l border-border pl-2.5">
          {thoughts.map((t, i) => (
            <p
              key={i}
              className="text-xs italic leading-snug text-muted-foreground"
            >
              {t}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
