"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Monitoring11Props {
  data?: number[];
  tone?: Tone;
  className?: string;
}

const wrapperClasses: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const cellClasses = [
  "bg-muted",
  "bg-current/15",
  "bg-current/35",
  "bg-current/65",
  "bg-current",
];

const defaultData = [
  0, 1, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1,
  1, 2, 3, 2, 1, 2, 3, 4, 3, 2, 1, 0,
  0, 1, 1, 2, 2, 3, 4, 4, 3, 2, 2, 1,
  1, 0, 1, 2, 3, 3, 4, 3, 2, 1, 1, 2,
  2, 1, 0, 1, 2, 2, 3, 4, 4, 3, 2, 1,
  0, 1, 2, 1, 1, 2, 3, 3, 2, 1, 0, 1,
  1, 0, 1, 2, 1, 2, 2, 3, 2, 1, 1, 0,
];

export const monitoring11Demo: Monitoring11Props = {
  data: defaultData,
  tone: "emerald",
};

export function Monitoring11({
  data = defaultData,
  tone = "emerald",
  className,
}: Monitoring11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "rounded-lg border border-border bg-card p-3 shadow-sm",
          wrapperClasses[tone]
        )}
      >
        <div className="grid grid-cols-12 gap-0.5" aria-hidden="true">
          {data.slice(0, 84).map((level, i) => (
            <span
              key={i}
              className={cn(
                "size-2.5 rounded-sm",
                cellClasses[Math.min(4, Math.max(0, level))]
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
