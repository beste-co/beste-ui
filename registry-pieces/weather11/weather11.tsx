"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Snowflake, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Condition = "sun" | "cloud" | "rain" | "snow";

interface Frame {
  label: string;
  temp: number;
  condition: Condition;
}

interface Weather11Props {
  place?: string;
  frames?: Frame[];
  unit?: "C" | "F";
  intervalMs?: number;
  className?: string;
}

const icons: Record<Condition, typeof Sun> = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  snow: Snowflake,
};

const iconClasses: Record<Condition, string> = {
  sun: "text-amber-500",
  cloud: "text-slate-400",
  rain: "text-sky-500",
  snow: "text-sky-400",
};

const captions: Record<Condition, string> = {
  sun: "Clear sky",
  cloud: "Mostly cloudy",
  rain: "Light rain",
  snow: "Light snow",
};

export const weather11Demo: Weather11Props = {
  place: "Lisbon",
  frames: [
    { label: "Now", temp: 21, condition: "sun" },
    { label: "15:00", temp: 19, condition: "cloud" },
    { label: "18:00", temp: 17, condition: "rain" },
    { label: "21:00", temp: 15, condition: "cloud" },
  ],
};

export function Weather11({
  place = "Somewhere",
  frames = [],
  unit = "C",
  intervalMs = 2800,
  className,
}: Weather11Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (frames.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % frames.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [frames.length, intervalMs]);

  const frame = frames[index] ?? { label: "Now", temp: 0, condition: "sun" as Condition };
  const Icon = icons[frame.condition];
  const falling = frame.condition === "rain" || frame.condition === "snow";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes weather11-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes weather11-drift { from { transform: translateX(-0.25rem); } to { transform: translateX(0.25rem); } }
@keyframes weather11-drop { 0% { opacity: 0; transform: translateY(-0.25rem); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(0.75rem); } }
@keyframes weather11-rise { from { opacity: 0; transform: translateY(0.5rem); } to { opacity: 1; transform: none; } }
`}</style>

      <div className="flex w-full max-w-64 flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-card-foreground">{place}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground tabular-nums">
            {frame.label}
          </span>
        </div>

        <div className="relative flex h-16 items-center justify-center">
          <Icon
            key={`icon-${index}`}
            className={cn("size-10", iconClasses[frame.condition])}
            style={{
              animation:
                frame.condition === "sun"
                  ? "weather11-spin 14s linear infinite"
                  : "weather11-drift 3.4s ease-in-out infinite alternate",
            }}
            aria-hidden="true"
          />
          {falling && (
            <span
              className="absolute inset-x-0 bottom-0 flex justify-center gap-2"
              aria-hidden="true"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-2 w-0.5 rounded-full",
                    frame.condition === "rain" ? "bg-sky-500" : "bg-sky-300"
                  )}
                  style={{
                    animation: `weather11-drop 1100ms ease-in ${i * 220}ms infinite`,
                  }}
                />
              ))}
            </span>
          )}
        </div>

        <div key={`temp-${index}`} style={{ animation: "weather11-rise 450ms ease-out" }}>
          <p className="text-4xl font-semibold tabular-nums text-card-foreground">
            {frame.temp}
            <span className="ml-1 align-top text-xl text-muted-foreground">
              &deg;{unit}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            {captions[frame.condition]}
          </p>
        </div>

        <div className="flex gap-1" aria-hidden="true">
          {frames.map((f, i) => (
            <span
              key={f.label}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-500 motion-reduce:transition-none",
                i === index ? "bg-foreground" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
