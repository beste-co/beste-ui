"use client";

import { Check, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai22Arg {
  key: string;
  value: string;
}

interface Ai22Props {
  fn?: string;
  args?: Ai22Arg[];
  status?: "running" | "done";
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

const dotClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const ai22Demo: Ai22Props = {
  fn: "search_docs",
  args: [
    { key: "query", value: '"rate limiting"' },
    { key: "limit", value: "5" },
  ],
  status: "done",
  tone: "violet",
};

export function Ai22({
  fn = "function",
  args = [],
  status = "running",
  tone = "violet",
  className,
}: Ai22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-md border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Wrench
              className={cn("size-3.5", iconClasses[tone])}
              aria-hidden="true"
            />
            <span className="font-mono text-xs font-semibold text-card-foreground">
              {fn}
            </span>
          </div>
          {status === "done" ? (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="size-3" />
              done
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <span
                className={cn(
                  "size-1.5 animate-pulse rounded-full",
                  dotClasses[tone]
                )}
                aria-hidden="true"
              />
              running
            </span>
          )}
        </div>
        <div className="flex flex-col gap-0.5 border-t border-border pt-1.5 font-mono text-xs">
          {args.map((a) => (
            <div key={a.key} className="flex gap-1.5">
              <span className="text-muted-foreground">{a.key}:</span>
              <span className="truncate text-sky-600 dark:text-sky-400">
                {a.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
