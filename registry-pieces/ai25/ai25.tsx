"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

type Segment =
  | { type: "text"; value: string }
  | { type: "var"; value: string };

interface Ai25Props {
  name?: string;
  segments?: Segment[];
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const varClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  violet:
    "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  emerald:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

export const ai25Demo: Ai25Props = {
  segments: [
    { type: "text", value: "You are a helpful assistant. The user asked: " },
    { type: "var", value: "question" },
    { type: "text", value: ". Answer in " },
    { type: "var", value: "tone" },
    { type: "text", value: " tone." },
  ],
  tone: "primary",
  bordered: false,
};

export function Ai25({
  name,
  segments = [],
  tone = "primary",
  bordered = false,
  className,
}: Ai25Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {name && (
          <span className="text-xs text-muted-foreground">{name}.prompt</span>
        )}
        <div className={cn("rounded-md bg-card p-3 text-xs leading-relaxed shadow-sm", bordered && "border border-border")}>
          {segments.map((s, i) => (
            <Fragment key={i}>
              {s.type === "text" ? (
                <span className="text-card-foreground">{s.value}</span>
              ) : (
                <span
                  className={cn(
                    "inline-flex items-center rounded-sm px-1 font-semibold",
                    varClasses[tone]
                  )}
                >
                  {"{{"}
                  {s.value}
                  {"}}"}
                </span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
