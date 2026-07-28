"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "sunset";

interface Ai35Props {
  prompt?: string;
  model?: string;
  tone?: Tone;
  className?: string;
}

const runClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  amber: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
};

export const ai35Demo: Ai35Props = {
  prompt: "Explain rate limiting strategies with simple examples.",
  model: "claude-sonnet",
  tone: "violet",
};

export function Ai35({
  prompt = "Write a prompt…",
  model = "model",
  tone = "violet",
  className,
}: Ai35Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            {model}
          </span>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm",
              runClasses[tone]
            )}
          >
            <Play className="size-3 fill-current" aria-hidden="true" />
            Run
          </button>
        </div>
        <p className="rounded-sm bg-muted px-2 py-1.5 text-xs leading-snug text-card-foreground">
          {prompt}
        </p>
      </div>
    </div>
  );
}
