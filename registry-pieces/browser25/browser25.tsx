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
  bordered?: boolean;
  className?: string;
}

const levelConfig: Record<
  Level,
  { Icon: typeof Info; text: string }
> = {
  info: {
    Icon: Info,
    text: "text-sky-400",
  },
  warn: {
    Icon: AlertTriangle,
    text: "text-amber-400",
  },
  error: {
    Icon: TriangleAlert,
    text: "text-rose-400",
  },
};

export const browser25Demo: Browser25Props = {
  level: "error",
  source: "app.js:247",
  message: "Uncaught TypeError: Cannot read properties of undefined",
  bordered: false,
};

export function Browser25({
  level = "info",
  time,
  source,
  message,
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 items-start gap-2 rounded-md bg-zinc-950 px-3 py-2 text-xs text-zinc-100 shadow-md", bordered && "border border-zinc-800")}>
        <Icon
          className={cn("mt-0.5 size-4 shrink-0", cfg.text)}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {(time || source) && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              {time && <span className="tabular-nums">{time}</span>}
              {source && <span className="truncate">{source}</span>}
            </div>
          )}
          <span className={cn("leading-snug", cfg.text)}>{message}</span>
        </div>
      </div>
    </div>
  );
}
