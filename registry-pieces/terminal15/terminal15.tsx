"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Level = "info" | "warn" | "ok";

interface LogLine {
  text: string;
  level?: Level;
}

interface Terminal15Props {
  title?: string;
  lines?: LogLine[];
  intervalMs?: number;
  holdMs?: number;
  className?: string;
}

const VISIBLE = 6;
const LINE_REM = 1.5;

const textClasses: Record<Level, string> = {
  info: "text-background/70",
  warn: "text-amber-400",
  ok: "text-emerald-400",
};

const dotClasses: Record<Level, string> = {
  info: "bg-background/40",
  warn: "bg-amber-400",
  ok: "bg-emerald-400",
};

export const terminal15Demo: Terminal15Props = {
  title: "beste-web / production",
  lines: [
    { text: "Cloning repository main@8f2c1d" },
    { text: "Installing dependencies" },
    { text: "Compiling 42 routes" },
    { text: "Unused env var NEXT_TELEMETRY", level: "warn" },
    { text: "Build finished in 38s", level: "ok" },
    { text: "Uploading 312 static assets" },
    { text: "Provisioning edge functions" },
    { text: "Warming cache in 12 regions" },
    { text: "Health check passed", level: "ok" },
    { text: "Deployed to production", level: "ok" },
  ],
};

function stamp(index: number, intervalMs: number): string {
  const seconds = 14 * 60 + 2 + Math.floor((index * intervalMs) / 1000);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `09:${m}:${s}`;
}

export function Terminal15({
  title = "deploy.log",
  lines = [],
  intervalMs = 500,
  holdMs = 2600,
  className,
}: Terminal15Props) {
  const [count, setCount] = useState(lines.length ? 1 : 0);

  useEffect(() => {
    if (!lines.length) return;
    if (count === 0) {
      const id = setTimeout(() => setCount(1), 500);
      return () => clearTimeout(id);
    }
    if (count < lines.length) {
      const id = setTimeout(() => setCount((c) => c + 1), intervalMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setCount(0), holdMs);
    return () => clearTimeout(id);
  }, [count, lines.length, intervalMs, holdMs]);

  const start = Math.max(0, count - VISIBLE - 1);
  const visible = lines.slice(start, count);
  const overflow = visible.length > VISIBLE ? 1 : 0;
  const finished = count === lines.length;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes terminal15-in { from { opacity: 0; transform: translateY(0.5rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="w-full max-w-80 overflow-hidden rounded-md bg-foreground text-background shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-background/15 px-3 py-2">
          <span className="size-2.5 rounded-full bg-rose-400" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-amber-400" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="ml-2 truncate font-mono text-xs text-background/50">
            {title}
          </span>
          <span
            className={cn(
              "ml-auto size-1.5 shrink-0 rounded-full",
              finished ? "bg-emerald-400" : "animate-pulse bg-sky-400 motion-reduce:animate-none"
            )}
            aria-hidden="true"
          />
        </div>
        <div className="p-4 font-mono text-sm">
          <div className="relative h-36 overflow-hidden">
            {visible.map((line, p) => {
              const index = start + p;
              const level = line.level ?? "info";
              return (
                <div
                  key={index}
                  className="absolute inset-x-0 flex h-6 items-center gap-2 transition-all duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    top: `${(p - overflow) * LINE_REM}rem`,
                    opacity: p < overflow ? 0 : 1,
                    animation: "terminal15-in 300ms ease-out",
                  }}
                >
                  <span
                    className={cn("size-1.5 shrink-0 rounded-full", dotClasses[level])}
                    aria-hidden="true"
                  />
                  <span className="shrink-0 tabular-nums text-background/40">
                    {stamp(index, intervalMs)}
                  </span>
                  <span className={cn("truncate", textClasses[level])}>{line.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
