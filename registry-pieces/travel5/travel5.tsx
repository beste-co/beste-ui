"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Travel5Props {
  from?: string;
  fromCode?: string;
  to?: string;
  toCode?: string;
  duration?: string;
  tone?: Tone;
  className?: string;
}

const lineClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const travel5Demo: Travel5Props = {
  from: "Istanbul",
  fromCode: "IST",
  to: "Tokyo",
  toCode: "HND",
  duration: "11h 05m · Nonstop",
  tone: "primary",
};

export function Travel5({
  from,
  fromCode,
  to,
  toCode,
  duration,
  tone = "primary",
  className,
}: Travel5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-lg font-bold text-card-foreground">
              {fromCode}
            </span>
            <span className="text-xs text-muted-foreground">{from}</span>
          </div>
          <div className="flex flex-1 items-center justify-center px-3">
            <svg
              viewBox="0 0 200 40"
              className={cn("w-full", lineClasses[tone])}
              aria-hidden="true"
            >
              <path
                d="M 4 32 Q 100 -12 196 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle cx="4" cy="32" r="3" fill="currentColor" />
              <circle cx="196" cy="32" r="3" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-lg font-bold text-card-foreground">
              {toCode}
            </span>
            <span className="text-xs text-muted-foreground">{to}</span>
          </div>
        </div>
        {duration && (
          <span className="text-center text-sm font-medium text-muted-foreground">
            {duration}
          </span>
        )}
      </div>
    </div>
  );
}
