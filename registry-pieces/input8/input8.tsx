"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Input8Props {
  keys?: string[];
  label?: string;
  hint?: string;
  recording?: boolean;
  tone?: Tone;
  className?: string;
}

const recordingClasses: Record<Tone, string> = {
  neutral: "border-foreground ring-foreground/20",
  primary: "border-primary ring-primary/20",
  foreground: "border-foreground ring-foreground/20",
  sky: "border-sky-500 ring-sky-500/20",
  emerald: "border-emerald-500 ring-emerald-500/20",
  violet: "border-violet-500 ring-violet-500/20",
  amber: "border-amber-500 ring-amber-500/20",
  rose: "border-rose-500 ring-rose-500/20",
};

const dotClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const input8Demo: Input8Props = {
  keys: ["⌘", "Shift", "K"],
  label: "Keyboard shortcut",
  hint: "Press any combination",
  recording: true,
  tone: "primary",
};

export function Input8({
  keys = [],
  label,
  hint,
  recording = false,
  tone = "primary",
  className,
}: Input8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2">
        {label && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border bg-card px-2.5 py-2 shadow-sm",
            recording
              ? cn("ring-2", recordingClasses[tone])
              : "border-border"
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {keys.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                No shortcut set
              </span>
            ) : (
              keys.map((k, idx) => (
                <span
                  key={idx}
                  className="flex min-w-6 items-center justify-center rounded-md border border-b-2 border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-card-foreground shadow-[inset_0_-1px_0_var(--border)]"
                >
                  {k}
                </span>
              ))
            )}
          </div>
          {recording && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground"
              aria-live="polite"
            >
              <span
                className={cn(
                  "size-1.5 animate-pulse rounded-full",
                  dotClasses[tone]
                )}
                aria-hidden="true"
              />
              REC
            </span>
          )}
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
