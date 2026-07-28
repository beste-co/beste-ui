"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sunset" | "violet";

interface Progress5Props {
  segments?: number;
  filled?: number;
  tone?: Tone;
  label?: string;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sunset: "bg-orange-500",
  violet: "bg-violet-500",
};

export const progress5Demo: Progress5Props = {
  segments: 6,
  filled: 4,
  tone: "emerald",
  label: "Onboarding",
};

export function Progress5({
  segments = 5,
  filled = 0,
  tone = "primary",
  label,
  className,
}: Progress5Props) {
  const total = Math.max(1, segments);
  const clamped = Math.max(0, Math.min(filled, total));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1.5">
        {(label || true) && (
          <div className="flex items-baseline justify-between">
            {label && (
              <span className="text-sm font-medium text-card-foreground">
                {label}
              </span>
            )}
            <span className="ml-auto text-xs tabular-nums text-muted-foreground">
              {clamped} / {total}
            </span>
          </div>
        )}
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 flex-1 rounded-sm transition-colors",
                i < clamped ? toneClasses[tone] : "bg-muted"
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
