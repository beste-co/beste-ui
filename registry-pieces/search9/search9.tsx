"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sunset" | "ocean" | "violet";

interface Search9Props {
  prompt?: string;
  action?: string;
  tone?: Tone;
  className?: string;
}

const borderClasses: Record<Tone, string> = {
  primary: "from-primary via-primary to-primary/60",
  foreground: "from-foreground via-foreground to-foreground/60",
  sunset: "from-rose-500 via-orange-500 to-amber-500",
  ocean: "from-sky-500 via-indigo-500 to-violet-500",
  violet: "from-violet-500 via-fuchsia-500 to-rose-500",
};

const buttonClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-r from-rose-500 to-orange-500 text-white",
  ocean: "bg-gradient-to-r from-sky-500 to-indigo-500 text-white",
  violet: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white",
};

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sunset: "text-orange-500",
  ocean: "text-indigo-500",
  violet: "text-fuchsia-500",
};

export const search9Demo: Search9Props = {
  prompt: "Summarize last week's support tickets",
  action: "Ask AI",
  tone: "ocean",
};

export function Search9({
  prompt,
  action = "Ask AI",
  tone = "ocean",
  className,
}: Search9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "w-full max-w-80 rounded-xl bg-gradient-to-r p-px shadow-md",
          borderClasses[tone]
        )}
      >
        <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-2">
          <Sparkles
            className={cn("size-4 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-card-foreground">
            {prompt}
          </span>
          <button
            type="button"
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm hover:opacity-90",
              buttonClasses[tone]
            )}
          >
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}
