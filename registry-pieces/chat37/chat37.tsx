"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Chat37Props {
  name?: string;
  durationSec?: number;
  bars?: number;
  secMs?: number;
  holdMs?: number;
  tone?: Tone;
  className?: string;
}

const buttonClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

export const chat37Demo: Chat37Props = {
  name: "Erykah Badu",
  durationSec: 14,
  tone: "sky",
};

function format(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function Chat37({
  name = "Voice message",
  durationSec = 12,
  bars = 48,
  secMs = 380,
  holdMs = 2200,
  tone = "sky",
  className,
}: Chat37Props) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const finished = elapsed >= durationSec;
    const id = setTimeout(
      () => setElapsed((e) => (e >= durationSec ? 0 : e + 1)),
      finished ? holdMs : secMs
    );
    return () => clearTimeout(id);
  }, [elapsed, paused, durationSec, secMs, holdMs]);

  // Amplitude swells toward the end so the last peaks run the full height.
  const heights = Array.from({ length: bars }, (_, i) => {
    const t = bars > 1 ? i / (bars - 1) : 1;
    const swell = 0.4 + 0.6 * Math.pow(t, 1.3);
    const detail =
      0.55 + 0.45 * Math.abs(Math.sin(i * 1.9) * 0.6 + Math.sin(i * 0.7) * 0.4);
    return Math.max(18, Math.min(100, Math.round(swell * detail * 145)));
  });
  const progress = elapsed / durationSec;
  const playing = !paused && elapsed < durationSec;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1">
        <span className="px-1 text-xs text-muted-foreground">{name}</span>
        <div className="flex items-center gap-3 rounded-2xl rounded-bl-md bg-muted p-2.5 shadow-sm">
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPaused((p) => !p)}
            className={cn(
              "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-90",
              buttonClasses[tone]
            )}
          >
            {playing ? (
              <Pause className="size-4" aria-hidden="true" />
            ) : (
              <Play className="ml-0.5 size-4" aria-hidden="true" />
            )}
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div
              className="flex h-6 items-center justify-between gap-px"
              aria-hidden="true"
            >
              {heights.map((h, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-0.5 rounded-full transition-colors duration-300 motion-reduce:transition-none",
                    i / bars < progress ? barClasses[tone] : "bg-muted-foreground/30"
                  )}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {format(elapsed)} / {format(durationSec)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
