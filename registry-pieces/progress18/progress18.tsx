"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";
type Phase = "filling" | "done" | "reset";

interface Progress18Props {
  label?: string;
  doneLabel?: string;
  segments?: number;
  stepMs?: number;
  holdMs?: number;
  tone?: Tone;
  className?: string;
}

const fillClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

export const progress18Demo: Progress18Props = {
  label: "Syncing library",
  doneLabel: "Library synced",
  segments: 10,
  tone: "sky",
};

export function Progress18({
  label = "Syncing",
  doneLabel = "Synced",
  segments = 10,
  stepMs = 240,
  holdMs = 2200,
  tone = "sky",
  className,
}: Progress18Props) {
  const [filled, setFilled] = useState(0);
  const [phase, setPhase] = useState<Phase>("filling");

  useEffect(() => {
    if (phase === "filling") {
      if (filled >= segments) {
        setPhase("done");
        return;
      }
      const id = setTimeout(
        () => setFilled((f) => f + 1),
        filled === 0 ? 500 : stepMs
      );
      return () => clearTimeout(id);
    }
    if (phase === "done") {
      const id = setTimeout(() => {
        setFilled(0);
        setPhase("reset");
      }, holdMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setPhase("filling"), 600);
    return () => clearTimeout(id);
  }, [phase, filled, segments, stepMs, holdMs]);

  const percent = Math.round((filled / Math.max(1, segments)) * 100);
  const isDone = phase === "done";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes progress18-pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-card-foreground">
            {isDone ? doneLabel : label}
          </span>
          <span className="flex h-5 items-center text-sm tabular-nums text-muted-foreground">
            {isDone ? (
              <span
                className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                style={{ animation: "progress18-pop 350ms ease-out" }}
                aria-hidden="true"
              >
                <Check className="size-3" />
              </span>
            ) : (
              `${percent}%`
            )}
          </span>
        </div>

        <div className="flex gap-1" aria-hidden="true">
          {Array.from({ length: segments }, (_, i) => (
            <span
              key={i}
              className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
            >
              <span
                className={cn(
                  "block h-full origin-left rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none",
                  isDone ? "bg-emerald-500" : fillClasses[tone],
                  i < filled ? "scale-x-100" : "scale-x-0"
                )}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
