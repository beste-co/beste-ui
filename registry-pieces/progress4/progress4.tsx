"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "muted";

interface Progress4Props {
  label?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  muted: "bg-muted-foreground",
};

export const progress4Demo: Progress4Props = {
  label: "Thinking",
  tone: "primary",
};

export function Progress4({
  label,
  tone = "primary",
  className,
}: Progress4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "size-1.5 rounded-full animate-pulse",
                toneClasses[tone]
              )}
              style={{
                animationDelay: `${i * 160}ms`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
        {label && (
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
