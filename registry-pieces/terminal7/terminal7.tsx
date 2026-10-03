"use client";

import { cn } from "@/lib/utils";

type Level = "info" | "warn" | "error" | "ok";

interface LogEntry {
  time?: string;
  level: Level;
  message: string;
}

interface Terminal7Props {
  logs?: LogEntry[];
  bordered?: boolean;
  className?: string;
}

const levelClasses: Record<Level, string> = {
  info: "text-sky-400",
  warn: "text-amber-400",
  error: "text-rose-400",
  ok: "text-emerald-400",
};

const levelLabel: Record<Level, string> = {
  info: "info",
  warn: "warn",
  error: "error",
  ok: "ok",
};

export const terminal7Demo: Terminal7Props = {
  logs: [
    { level: "ok", message: "Server ready" },
    { level: "info", message: "Compiled /dashboard" },
    { level: "warn", message: "Slow query" },
    { level: "error", message: "Failed to reach cache" },
  ],
  bordered: false,
};

export function Terminal7({ logs = [], bordered = false, className }: Terminal7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1 rounded-lg bg-zinc-950 p-3 font-mono text-xs shadow-sm", bordered && "border border-zinc-800")}>
        {logs.map((log, index) => (
          <div key={index} className="flex items-baseline gap-2">
            {log.time && (
              <span className="shrink-0 tabular-nums text-zinc-600">
                {log.time}
              </span>
            )}
            <span
              className={cn(
                "w-10 shrink-0 font-semibold",
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
