"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestCase {
  name: string;
  duration?: number;
  fails?: boolean;
}

interface Code15Props {
  filename?: string;
  tests?: TestCase[];
  runMs?: number;
  holdMs?: number;
  bordered?: boolean;
  className?: string;
}

export const code15Demo: Code15Props = {
  filename: "checkout.test.ts",
  tests: [
    { name: "renders cart summary" },
    { name: "applies coupon code" },
    { name: "calculates shipping", fails: true },
    { name: "charges saved card" },
  ],
  bordered: false,
};

export function Code15({
  filename = "app.test.ts",
  tests = [],
  runMs = 650,
  holdMs = 2600,
  bordered = false,
  className,
}: Code15Props) {
  const [done, setDone] = useState(0);
  const total = tests.length;

  useEffect(() => {
    if (!total) return;
    if (done < total) {
      const id = setTimeout(() => setDone((d) => d + 1), done === 0 ? 500 : runMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setDone(0), holdMs);
    return () => clearTimeout(id);
  }, [done, total, runMs, holdMs]);

  const finished = total > 0 && done >= total;
  const failed = tests.slice(0, done).filter((t) => t.fails).length;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes code15-pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }`}</style>
      <div className={cn("relative w-full max-w-80 overflow-hidden rounded-md bg-card shadow-xl", bordered && "border border-border")}>
        <div className="absolute inset-x-0 top-0 h-0.5 bg-muted" aria-hidden="true">
          <span
            className={cn(
              "block h-full transition-all ease-out motion-reduce:transition-none",
              finished ? (failed ? "bg-rose-500" : "bg-emerald-500") : "bg-primary"
            )}
            style={{
              width: `${(done / Math.max(1, total)) * 100}%`,
              transitionDuration: `${runMs}ms`,
            }}
          />
        </div>

        <div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2">
          <span className="font-mono text-xs text-muted-foreground">{filename}</span>
          <span
            className={cn(
              "text-xs font-medium",
              !finished && "text-muted-foreground",
              finished && (failed ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400")
            )}
          >
            {finished ? (failed ? "Failed" : "Passed") : "Running"}
          </span>
        </div>

        <ul className="flex flex-col gap-1 px-3 py-3 font-mono text-sm">
          {tests.map((test, i) => {
            const isDone = i < done;
            const isRunning = i === done && !finished;
            return (
              <li key={i} className="flex h-6 items-center gap-2.5">
                <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
                  {isDone ? (
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full text-white",
                        test.fails ? "bg-rose-500" : "bg-emerald-500"
                      )}
                      style={{ animation: "code15-pop 300ms ease-out" }}
                    >
                      {test.fails ? <X className="size-3" /> : <Check className="size-3" />}
                    </span>
                  ) : isRunning ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground motion-reduce:animate-none" />
                  ) : (
                    <span className={cn("size-3.5 rounded-full", bordered ? "border border-border" : "bg-muted")} />
                  )}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate transition-colors",
                    isDone && test.fails && "text-rose-600 dark:text-rose-400",
                    isDone && !test.fails && "text-card-foreground",
                    !isDone && "text-muted-foreground"
                  )}
                >
                  {test.name}
                </span>
                {test.duration !== undefined && (
                  <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {isDone ? `${test.duration} ms` : ""}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
