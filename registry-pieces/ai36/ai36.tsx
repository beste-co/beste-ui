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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
  sunset: "text-rose-500",
};

export const ai36Demo: Ai36Props = {
  name: "Research Copilot",
  description: "Searches papers and drafts literature reviews on request.",
  tools: 4,
  tone: "primary",
  bordered: false,
};

export function Ai36({
  name = "Assistant",
  description,
  tools = 0,
  tone = "primary",
  bordered = false,
  className,
}: Ai36Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 gap-2.5 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <Bot className={cn("mt-0.5 size-5 shrink-0", iconClasses[tone])} aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {name}
            </span>
            <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
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
