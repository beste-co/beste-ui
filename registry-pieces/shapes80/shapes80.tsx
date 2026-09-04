"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Shapes80Props {
  durationMs?: number;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
};

const orbits = [
  { inset: "inset-0", size: "size-2.5", opacity: "opacity-100" },
  { inset: "inset-4", size: "size-2", opacity: "opacity-70" },
  { inset: "inset-8", size: "size-1.5", opacity: "opacity-40" },
];

export const shapes80Demo: Shapes80Props = {
  tone: "primary",
};

export function Shapes80({
  durationMs = 3600,
  tone = "primary",
  className,
}: Shapes80Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes shapes80-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes shapes80-counter { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
@keyframes shapes80-breathe { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.25); opacity: 0.5; } }
`}</style>

      <div
        className={cn("relative size-32", toneClasses[tone])}
        aria-hidden="true"
      >
        <svg viewBox="0 0 128 128" className="absolute inset-0 size-full">
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity="0.35"
            style={{
              transformOrigin: "center",
              animation: `shapes80-counter ${durationMs * 4}ms linear infinite`,
            }}
          />
        </svg>

        {orbits.map((orbit, i) => (
          <div
            key={orbit.inset}
            className={cn("absolute", orbit.inset)}
            style={{
              animation: `shapes80-orbit ${durationMs + i * 900}ms linear infinite`,
            }}
          >
            <span
              className={cn(
                "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current",
                orbit.size,
                orbit.opacity
              )}
            />
          </div>
        ))}

        <span
          className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
          style={{ animation: "shapes80-breathe 2400ms ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}
