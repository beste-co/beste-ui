"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Ai20Props {
  index?: number;
  source?: string;
  excerpt?: string;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const chipClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-violet-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const ai20Demo: Ai20Props = {
  index: 3,
  source: "beste.co/docs/onboarding",
  excerpt: "The onboarding flow now ships with three new interactive steps.",
  tone: "primary",
  bordered: false,
};

export function Ai20({
  index = 1,
  source = "source",
  excerpt,
  tone = "primary",
  bordered = false,
  className,
}: Ai20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-start gap-3 rounded-md bg-card px-3 py-2.5 shadow-sm", bordered && "border border-border")}>
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            chipClasses[tone]
          )}
          aria-hidden="true"
        >
          {index}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {excerpt && (
            <p className="text-xs leading-snug text-card-foreground">
              "{excerpt}"
            </p>
          )}
          <span className="truncate text-xs text-muted-foreground">
            {source}
          </span>
        </div>
      </div>
    </div>
  );
}
