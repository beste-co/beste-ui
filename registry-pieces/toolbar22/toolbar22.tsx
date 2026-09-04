"use client";

import { useEffect, useState } from "react";
import { Mic, Pause, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toolbar22Props {
  label?: string;
  bars?: number;
  className?: string;
}

export const toolbar22Demo: Toolbar22Props = {
  label: "Recording screen",
  bars: 14,
};

function format(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function Toolbar22({
  label = "Recording",
  bars = 12,
  className,
}: Toolbar22Props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes toolbar22-bar { 0%, 100% { transform: scaleY(0.28); } 50% { transform: scaleY(1); } }
`}</style>

      <div className="flex w-full max-w-72 items-center gap-3 rounded-full border border-border bg-card p-2 pl-3 shadow-md">
        <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-500 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2.5 rounded-full bg-rose-500" />
        </span>

        <span className="text-sm font-medium tabular-nums text-card-foreground">
          {format(seconds)}
        </span>
        <span className="sr-only">{label}</span>

        <span
          className="flex h-6 flex-1 items-center justify-center gap-0.5"
          aria-hidden="true"
        >
          {Array.from({ length: bars }).map((_, i) => (
            <span
              key={i}
              className="h-4 w-0.5 rounded-full bg-muted-foreground"
              style={{
                animation: `toolbar22-bar ${700 + (i % 4) * 130}ms ease-in-out ${i * 70}ms infinite`,
              }}
            />
          ))}
        </span>

        <span className="flex items-center gap-1">
          <button
            type="button"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground motion-reduce:transition-none"
            aria-label="Mute microphone"
          >
            <Mic className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground motion-reduce:transition-none"
            aria-label="Pause recording"
          >
            <Pause className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-rose-500 text-white transition-opacity hover:opacity-90 motion-reduce:transition-none"
            aria-label="Stop recording"
          >
            <Square className="size-3.5 fill-current" aria-hidden="true" />
          </button>
        </span>
      </div>
    </div>
  );
}
