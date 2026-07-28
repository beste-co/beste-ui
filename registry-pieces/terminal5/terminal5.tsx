"use client";

import { cn } from "@/lib/utils";

interface Terminal5Props {
  label?: string;
  percent?: number;
  segments?: number;
  className?: string;
}

export const terminal5Demo: Terminal5Props = {
  label: "Installing dependencies",
  percent: 72,
  segments: 12,
};

export function Terminal5({
  label,
  percent = 0,
  segments = 12,
  className,
}: Terminal5Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const filled = Math.round((clamped / 100) * segments);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-xs shadow-sm">
        <div className="flex items-center justify-between gap-2">
          {label && <span className="truncate text-zinc-300">{label}</span>}
          <span className="shrink-0 tabular-nums text-emerald-400">
            {clamped}%
          </span>
        </div>
        <div className="flex gap-0.5" aria-hidden="true">
          {Array.from({ length: segments }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-2 flex-1",
                index < filled ? "bg-emerald-400" : "bg-zinc-800"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
