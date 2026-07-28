"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sky" | "emerald";

interface Badge4Props {
  name?: string;
  handle?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
};

const checkStrokeClasses: Record<Tone, string> = {
  primary: "stroke-primary-foreground",
  foreground: "stroke-background",
  sky: "stroke-white",
  emerald: "stroke-white",
};

export const badge4Demo: Badge4Props = {
  name: "Beste",
  handle: "@withbeste",
  tone: "sky",
};

export function Badge4({
  name = "Account",
  handle,
  tone = "sky",
  className,
}: Badge4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
        <span className="text-sm font-semibold text-card-foreground">
          {name}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={cn("size-5 shrink-0 fill-current", toneClasses[tone])}
          aria-label="Verified"
        >
          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <path
            d="m9 12 2 2 4-4"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={checkStrokeClasses[tone]}
          />
        </svg>
        {handle && (
          <span className="text-xs text-muted-foreground">{handle}</span>
        )}
      </div>
    </div>
  );
}
