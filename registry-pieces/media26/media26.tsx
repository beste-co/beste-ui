"use client";

import { useEffect, useState } from "react";
import { Music, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Track {
  title: string;
  artist: string;
  duration: number;
}

interface Media26Props {
  tracks?: Track[];
  tickMs?: number;
  stepSeconds?: number;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const fillClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

export const media26Demo: Media26Props = {
  tracks: [
    { title: "Feeling Good", artist: "Nina Simone", duration: 177 },
    { title: "So What", artist: "Miles Davis", duration: 205 },
    { title: "Hyperballad", artist: "Björk", duration: 219 },
  ],
  tone: "primary",
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Media26({
  tracks = [],
  tickMs = 400,
  stepSeconds = 8,
  tone = "primary",
  className,
}: Media26Props) {
  const [playing, setPlaying] = useState(true);
  const [state, setState] = useState({ index: 0, elapsed: 0 });

  useEffect(() => {
    if (!playing || !tracks.length) return;
    const id = setInterval(() => {
      setState((s) => {
        const duration = tracks[s.index]?.duration ?? 0;
        const next = s.elapsed + stepSeconds;
        if (next >= duration) {
          return { index: (s.index + 1) % tracks.length, elapsed: 0 };
        }
        return { ...s, elapsed: next };
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [playing, tracks, tickMs, stepSeconds]);

  const track = tracks[state.index];
  const duration = track?.duration ?? 1;
  const percent = Math.min(100, (state.elapsed / duration) * 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes media26-fade { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-80 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <span
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-lg",
            tileClasses[tone]
          )}
          aria-hidden="true"
        >
          <Music className="size-5" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div
            key={state.index}
            className="flex min-w-0 flex-col"
            style={{ animation: "media26-fade 600ms ease-out" }}
          >
            <span className="truncate text-sm font-medium text-card-foreground">
              {track?.title ?? "Nothing playing"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {track?.artist ?? ""}
            </span>
          </div>

          <div className="h-1 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div
              className={cn(
                "h-full rounded-full transition-all ease-linear motion-reduce:transition-none",
                fillClasses[tone]
              )}
              style={{ width: `${percent}%`, transitionDuration: `${tickMs}ms` }}
            />
          </div>

          <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
            <span>{formatTime(state.elapsed)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className={cn(
            "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full shadow-sm transition-transform hover:scale-105",
            tileClasses[tone]
          )}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="ml-0.5 size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
