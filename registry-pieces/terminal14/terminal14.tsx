"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Phase = "typing" | "output" | "hold";

interface Terminal14Props {
  command?: string;
  lines?: string[];
  success?: string;
  charMs?: number;
  lineMs?: number;
  holdMs?: number;
  className?: string;
}

export const terminal14Demo: Terminal14Props = {
  command: "beste deploy --prod",
  lines: [
    "Building 42 pages",
    "Uploading assets (3.1 MB)",
    "Warming edge cache in 12 regions",
    "Running smoke tests",
  ],
  success: "Deployed to https://beste.co in 14s",
};

export function Terminal14({
  command = "npm run build",
  lines = [],
  success = "Done",
  charMs = 45,
  lineMs = 450,
  holdMs = 2600,
  className,
}: Terminal14Props) {
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);
  const outputCount = lines.length + 1;

  useEffect(() => {
    if (phase === "typing") {
      if (typed >= command.length) {
        const id = setTimeout(() => setPhase("output"), 500);
        return () => clearTimeout(id);
      }
      const id = setTimeout(
        () => setTyped((c) => c + 1),
        typed === 0 ? 700 : charMs
      );
      return () => clearTimeout(id);
    }
    if (phase === "output") {
      if (shown >= outputCount) {
        setPhase("hold");
        return;
      }
      const id = setTimeout(() => setShown((n) => n + 1), lineMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setTyped(0);
      setShown(0);
      setPhase("typing");
    }, holdMs);
    return () => clearTimeout(id);
  }, [phase, typed, shown, command.length, outputCount, charMs, lineMs, holdMs]);

  const finished = shown >= outputCount;
  const cursor = (
    <span
      className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-background motion-reduce:animate-none"
      style={{ animation: "terminal14-blink 1s step-end infinite" }}
      aria-hidden="true"
    />
  );

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes terminal14-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } } @keyframes terminal14-in { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="w-full max-w-80 overflow-hidden rounded-md bg-foreground text-background shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-background/15 px-3 py-2">
          <span className="size-2.5 rounded-full bg-rose-400" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-amber-400" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
        </div>
        <div className="h-40 overflow-hidden p-4 font-mono text-sm leading-relaxed">
          <p className="flex gap-2">
            <span className="select-none text-background/50" aria-hidden="true">
              $
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="invisible" aria-hidden="true">
                {command}
              </span>
              <span className="absolute inset-0 truncate">
                {command.slice(0, typed)}
                {phase === "typing" && cursor}
              </span>
            </span>
          </p>
          {lines.slice(0, shown).map((line, i) => (
            <p
              key={i}
              className="truncate text-background/60"
              style={{ animation: "terminal14-in 300ms ease-out" }}
            >
              {line}
            </p>
          ))}
          {shown >= outputCount && (
            <p
              className="flex gap-2 text-emerald-400"
              style={{ animation: "terminal14-in 300ms ease-out" }}
            >
              <span aria-hidden="true">✓</span>
              <span className="truncate">{success}</span>
            </p>
          )}
          {finished && (
            <p className="flex gap-2">
              <span className="select-none text-background/50" aria-hidden="true">
                $
              </span>
              {cursor}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
