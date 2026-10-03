"use client";

import { cn } from "@/lib/utils";

type LogLevel = "debug" | "info" | "warn" | "error";

interface Monitoring8Props {
  timestamp?: string;
  level?: LogLevel;
  source?: string;
  message?: string;
  bordered?: boolean;
  className?: string;
}

const levelStyles: Record<LogLevel, { text: string; label: string }> = {
  debug: {
    text: "text-slate-500 dark:text-slate-400",
    label: "Debug",
  },
  info: {
    text: "text-sky-600 dark:text-sky-400",
    label: "Info",
  },
  warn: {
    text: "text-amber-600 dark:text-amber-400",
    label: "Warn",
  },
  error: {
    text: "text-rose-600 dark:text-rose-400",
    label: "Error",
  },
};

export const monitoring8Demo: Monitoring8Props = {
  level: "warn",
  source: "auth.session",
  message: "Token refresh retry 2 of 3",
  bordered: false,
};

export function Monitoring8({
  timestamp,
  level = "info",
  source,
  message,
  bordered = false,
  className,
}: Monitoring8Props) {
  const styles = levelStyles[level];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-2 overflow-hidden rounded-md bg-card px-3 py-2 text-xs shadow-sm", bordered && "border border-border")}>
        {timestamp && (
          <span className="shrink-0 tabular-nums text-muted-foreground">
            {timestamp}
          </span>
        )}
        <span className={cn("shrink-0 font-semibold", styles.text)}>
          {styles.label}
        </span>
        {source && (
          <span className="shrink-0 text-muted-foreground">{source}</span>
        )}
        <span className="min-w-0 flex-1 truncate text-card-foreground">
          {message}
        </span>
      </div>
    </div>
  );
}
