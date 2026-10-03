"use client";

import { cn } from "@/lib/utils";

interface Editor19Props {
  prefix?: string;
  selected?: string;
  suffix?: string;
  chars?: number;
  words?: number;
  bordered?: boolean;
  className?: string;
}

export const editor19Demo: Editor19Props = {
  prefix: "Ship ",
  selected: "production-ready components",
  suffix: " in a weekend.",
  chars: 27,
  words: 3,
  bordered: false,
};

export function Editor19({
  prefix = "",
  selected = "",
  suffix = "",
  chars = 0,
  words = 0,
  bordered = false,
  className,
}: Editor19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        <div className={cn("rounded-md bg-card px-3 py-2 font-sans text-sm leading-snug shadow-sm", bordered && "border border-border")}>
          <span className="text-card-foreground">{prefix}</span>
          <span className="rounded-sm bg-primary/25 text-card-foreground">
            {selected}
          </span>
          <span className="text-card-foreground">{suffix}</span>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-foreground px-3 py-1 text-xs tabular-nums text-background shadow-sm">
          <span>{chars} chars</span>
          <span className="opacity-50">·</span>
          <span>{words} words</span>
        </div>
      </div>
    </div>
  );
}
