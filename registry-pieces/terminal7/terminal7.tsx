"use client";

import { cn } from "@/lib/utils";

type Level = "info" | "warn" | "error" | "ok";

interface LogEntry {
  time: string;
  level: Level;
  message: string;
}

interface Terminal7Props {
  logs?: LogEntry[];
  className?: string;
}

const levelClasses: Record<Level, string> = {
  info: "text-sky-400",
  warn: "text-amber-400",
  error: "text-rose-400",
  ok: "text-emerald-400",
};

const levelLabel: Record<Level, string> = {
  info: "INFO",
  warn: "WARN",
  error: "ERR",
  ok: "OK",
};

export const terminal7Demo: Terminal7Props = {
  logs: [
    { time: "12:04:01", level: "ok", message: "Server ready on port 3000" },
    { time: "12:04:03", level: "info", message: "Compiled /dashboard in 240ms" },
    { time: "12:04:06", level: "warn", message: "Slow query took 412ms" },
    { time: "12:04:09", level: "error", message: "Failed to reach cache" },
  ],
};

export function Terminal7({ logs = [], className }: Terminal7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs shadow-sm">
        {logs.map((log, index) => (
          <div key={index} className="flex items-baseline gap-2">
            <span className="shrink-0 tabular-nums text-zinc-600">
              {log.time}
            </span>
            <span
              className={cn(
                "w-9 shrink-0 font-semibold",
                levelClasses[log.level]
              )}
            >
              {levelLabel[log.level]}
            </span>
            <span className="flex-1 truncate text-zinc-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
