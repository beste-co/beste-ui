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
  className?: string;
}

export const code15Demo: Code15Props = {
  filename: "checkout.test.ts",
  tests: [
    { name: "renders cart summary", duration: 18 },
    { name: "applies coupon code", duration: 42 },
    { name: "rejects expired coupon", duration: 31 },
    { name: "calculates shipping", duration: 124, fails: true },
    { name: "charges saved card", duration: 87 },
  ],
};

export function Code15({
  filename = "app.test.ts",
  tests = [],
  runMs = 650,
  holdMs = 2600,
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
  const passed = tests.slice(0, done).filter((t) => !t.fails).length;
  const failed = done - passed;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes code15-pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }`}</style>
      <div className="relative w-full max-w-80 overflow-hidden rounded-md border border-border bg-card shadow-xl">
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
              "inline-flex items-center gap-1.5 text-xs font-medium",
              !finished && "text-muted-foreground",
              finished && (failed ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400")
            )}
          >
            {finished ? (
              failed ? "Failed" : "Passed"
            ) : (
              <>
                <Loader2 className="size-3 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                Running
              </>
            )}
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
                    <span className="size-3.5 rounded-full border border-border" />
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
                <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {isDone && test.duration !== undefined ? `${test.duration} ms` : ""}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs tabular-nums">
          <span className="text-card-foreground">
            <span className={passed ? "text-emerald-600 dark:text-emerald-400" : undefined}>
              {passed} passed
            </span>
            <span className="text-muted-foreground">, </span>
            <span className={failed ? "text-rose-600 dark:text-rose-400" : undefined}>
              {failed} failed
            </span>
          </span>
          <span className="text-muted-foreground">
            {done} of {total}
          </span>
        </div>
      </div>
    </div>
  );
}
