"use client";

import { cn } from "@/lib/utils";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Card7Props {
  method?: Method;
  path?: string;
  summary?: string;
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

export const card7Demo: Card7Props = {
  method: "POST",
  path: "/v1/payment_intents",
  summary: "Create a payment intent",
};

export function Card7({
  method = "GET",
  path = "/",
  summary,
  className,
}: Card7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 font-mono text-xs font-bold",
              methodClasses[method]
            )}
          >
            {method}
          </span>
          <code className="flex-1 truncate font-mono text-sm text-card-foreground">
            {path}
          </code>
        </div>
        {summary && (
          <span className="text-xs text-muted-foreground">{summary}</span>
        )}
      </div>
    </div>
  );
}
