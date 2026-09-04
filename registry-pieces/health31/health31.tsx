"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Health31Props {
  baseBpm?: number;
  variance?: number;
  sweepMs?: number;
  className?: string;
}

export const health31Demo: Health31Props = {
  baseBpm: 62,
};

const TRACE =
  "M0 30 H36 L42 30 L48 10 L54 50 L60 26 L66 30 H156 L162 30 L168 10 L174 50 L180 26 L186 30 H240";

export function Health31({
  baseBpm = 64,
  variance = 4,
  sweepMs = 3600,
  className,
}: Health31Props) {
  const [bpm, setBpm] = useState(baseBpm);

  useEffect(() => {
    setBpm(baseBpm);
    const id = setInterval(() => {
      const drift = Math.round((Math.random() - 0.5) * 2 * variance);
      setBpm(baseBpm + drift);
    }, 1600);
    return () => clearInterval(id);
  }, [baseBpm, variance]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes health31-scroll { from { transform: translateX(0); } to { transform: translateX(-14rem); } }
@keyframes health31-beat { 0%, 100% { transform: scale(1); } 18% { transform: scale(1.18); } 36% { transform: scale(1); } 54% { transform: scale(1.1); } }
`}</style>

      <div className="flex w-full max-w-72 flex-col items-center gap-1">
        <p className="flex items-center gap-2">
          <Heart
            className="size-5 text-rose-500"
            style={{ animation: "health31-beat 1200ms ease-in-out infinite" }}
            aria-hidden="true"
          />
          <span className="text-4xl font-semibold tabular-nums text-foreground">
            {bpm}
          </span>
          <span className="self-end pb-1 text-sm text-muted-foreground">bpm</span>
        </p>

        <div className="w-full overflow-hidden" aria-hidden="true">
          <div
            className="flex w-max"
            style={{ animation: `health31-scroll ${sweepMs}ms linear infinite` }}
          >
            {[0, 1, 2].map((i) => (
              <svg
                key={i}
                viewBox="0 0 240 60"
                className="h-14 w-56 shrink-0 text-rose-500"
              >
                <path
                  d={TRACE}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
