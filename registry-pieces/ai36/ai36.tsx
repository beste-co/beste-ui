"use client";

import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "sunset";

interface Ai36Props {
  name?: string;
  description?: string;
  tools?: number;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  amber: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
};

export const ai36Demo: Ai36Props = {
  name: "Research Copilot",
  description: "Searches papers and drafts literature reviews on request.",
  tools: 4,
  tone: "sky",
};

export function Ai36({
  name = "Assistant",
  description,
  tools = 0,
  tone = "violet",
  className,
}: Ai36Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md shadow-sm",
            tileClasses[tone]
          )}
          aria-hidden="true"
        >
          <Bot className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {name}
            </span>
            <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              {tools} tools
            </span>
          </div>
          {description && (
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
