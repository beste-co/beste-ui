"use client";

import {
  AlertTriangle,
  Info,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Level = "info" | "warn" | "error";

interface Browser25Props {
  level?: Level;
  time?: string;
  source?: string;
  message?: string;
  className?: string;
}

const levelConfig: Record<
  Level,
  { Icon: typeof Info; text: string; bubble: string }
> = {
  info: {
    Icon: Info,
    text: "text-sky-400",
    bubble: "bg-sky-500/20",
  },
  warn: {
    Icon: AlertTriangle,
    text: "text-amber-400",
    bubble: "bg-amber-500/20",
  },
  error: {
    Icon: TriangleAlert,
    text: "text-rose-400",
    bubble: "bg-rose-500/20",
  },
};

export const browser25Demo: Browser25Props = {
  level: "error",
  time: "12:04:18",
  source: "app.js:247",
  message: "Uncaught TypeError: Cannot read properties of undefined",
};

export function Browser25({
  level = "info",
  time,
  source,
  message,
  className,
}: Browser25Props) {
  const cfg = levelConfig[level];
  const Icon = cfg.Icon;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-start gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 shadow-md">
        <div
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm",
            cfg.bubble
          )}
        >
          <Icon className={cn("size-3", cfg.text)} aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {time && <span className="tabular-nums">{time}</span>}
            {source && (
              <span className="truncate">{source}</span>
            )}
          </div>
          <span className={cn("leading-snug", cfg.text)}>{message}</span>
        </div>
      </div>
    </div>
  );
}
