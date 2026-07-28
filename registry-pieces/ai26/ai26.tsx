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

interface Ai26Props {
  label?: string;
  dims?: number;
  values?: number[];
  tone?: Tone;
  className?: string;
}

const posClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const ai26Demo: Ai26Props = {
  label: "embedding.vec",
  dims: 1536,
  values: [
    0.42, -0.18, 0.67, 0.05, -0.31, 0.54, 0.22, -0.09, 0.38, -0.48, 0.71, 0.13,
    -0.22, 0.58, -0.05, 0.34,
  ],
  tone: "violet",
};

export function Ai26({
  label = "vector",
  dims = 1536,
  values = [],
  tone = "violet",
  className,
}: Ai26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-card-foreground">{label}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {dims.toLocaleString()} dims
          </span>
        </div>
        <div className="relative flex h-12 items-stretch gap-0.5">
          {values.map((v, i) => {
            const h = Math.min(100, Math.abs(v) * 100);
            const positive = v >= 0;
            return (
              <div key={i} className="flex flex-1 flex-col">
                <div className="flex flex-1 items-end">
                  {positive && (
                    <span
                      className={cn("w-full rounded-t-sm", posClasses[tone])}
                      style={{ height: `${h}%` }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex flex-1 items-start">
                  {!positive && (
                    <span
                      className="w-full rounded-b-sm bg-muted-foreground/40"
                      style={{ height: `${h}%` }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            );
          })}
          <span
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border"
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>[0]</span>
          <span>cosine similarity ready</span>
          <span>[{values.length - 1}]</span>
        </div>
      </div>
    </div>
  );
}
