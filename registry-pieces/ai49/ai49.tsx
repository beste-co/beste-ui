"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";
type Mode = "listening" | "thinking" | "speaking";

interface Ai49Props {
  dots?: number;
  modeMs?: number;
  tone?: Tone;
  className?: string;
}

const dotClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

const modes: Mode[] = ["listening", "thinking", "speaking"];

const labels: Record<Mode, string> = {
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
};

export const ai49Demo: Ai49Props = {
  tone: "primary",
};

export function Ai49({
  dots = 5,
  modeMs = 2600,
  tone = "primary",
  className,
}: Ai49Props) {
  const [index, setIndex] = useState(0);
  const mode = modes[index] ?? "listening";

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % modes.length),
      modeMs
    );
    return () => clearInterval(id);
  }, [modeMs]);

  // The same five dots carry every state, only their motion changes.
  function dotAnimation(i: number): string {
    if (mode === "listening") {
      return `ai49-breathe 2200ms ease-in-out ${i * 140}ms infinite`;
    }
    if (mode === "thinking") {
      return `ai49-bob 1200ms ease-in-out ${i * 110}ms infinite`;
    }
    return `ai49-stretch ${620 + (i % 3) * 110}ms ease-in-out ${(i * 90) % 360}ms infinite`;
  }

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes ai49-breathe { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
@keyframes ai49-bob { 0%, 100% { opacity: 0.35; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-0.375rem); } }
@keyframes ai49-stretch { 0%, 100% { opacity: 0.45; transform: scaleX(1); } 50% { opacity: 1; transform: scaleX(1.9); } }
@keyframes ai49-in { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }
`}</style>

      <div className="flex flex-col items-center gap-5">
        <div key={mode} className="flex h-6 items-center gap-2.5" aria-hidden="true">
          {Array.from({ length: dots }, (_, i) => (
            <span
              key={i}
              className={cn("size-2 rounded-full", dotClasses[tone])}
              style={{ animation: dotAnimation(i) }}
            />
          ))}
        </div>

        <span
          key={`${mode}-label`}
          className="text-sm font-medium tracking-wide text-foreground"
          style={{ animation: "ai49-in 350ms ease-out" }}
        >
          {labels[mode]}
        </span>
      </div>
    </div>
  );
}
