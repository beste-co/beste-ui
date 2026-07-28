"use client";

import { cn } from "@/lib/utils";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Browser8Props {
  method?: Method;
  path?: string;
  status?: number;
  time?: string;
  size?: string;
  className?: string;
}

const methodClasses: Record<Method, string> = {
  GET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  POST: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  PATCH:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  DELETE: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
};

export const browser8Demo: Browser8Props = {
  method: "GET",
  path: "/api/users?page=2",
  status: 200,
  time: "142ms",
  size: "3.4 KB",
};

export function Browser8({
  method = "GET",
  path = "/",
  status = 200,
  time,
  size,
  className,
}: Browser8Props) {
  const statusClass =
    status < 300
      ? "text-emerald-600 dark:text-emerald-400"
      : status < 400
        ? "text-sky-600 dark:text-sky-400"
        : status < 500
          ? "text-amber-600 dark:text-amber-400"
          : "text-rose-600 dark:text-rose-400";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs shadow-sm">
        <span
          className={cn(
            "shrink-0 rounded px-1.5 py-0.5 font-bold",
            methodClasses[method]
          )}
        >
          {method}
        </span>
        <code className="flex-1 truncate text-card-foreground">{path}</code>
        <span
          className={cn("shrink-0 font-semibold tabular-nums", statusClass)}
        >
          {status}
        </span>
        {time && (
          <span className="shrink-0 tabular-nums text-muted-foreground">
            {time}
          </span>
        )}
        {size && (
          <span className="shrink-0 tabular-nums text-muted-foreground">
            {size}
          </span>
        )}
      </div>
    </div>
  );
}
