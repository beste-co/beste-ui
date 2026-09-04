"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Stats18Props {
  label?: string;
  values?: number[];
  prefix?: string;
  suffix?: string;
  caption?: string;
  intervalMs?: number;
  tone?: Tone;
  className?: string;
}

const numberClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
};

const dotClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const stats18Demo: Stats18Props = {
  label: "Active listeners",
  values: [24810, 24893, 24871, 24962, 25040, 24988],
  caption: "Updating every few seconds",
  tone: "emerald",
};

function Digit({ value }: { value: number }) {
  return (
    <span className="inline-flex h-9 overflow-hidden">
      <span
        className="flex flex-col transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateY(-${value * 2.25}rem)` }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="flex h-9 items-center justify-center">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Stats18({
  label = "Metric",
  values = [0],
  prefix = "",
  suffix = "",
  caption,
  intervalMs = 2400,
  tone = "emerald",
  className,
}: Stats18Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (values.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % values.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [values.length, intervalMs]);

  const current = values[index] ?? 0;
  const previous = values[(index - 1 + values.length) % values.length] ?? current;
  const delta = current - previous;
  const chars = Math.round(current).toLocaleString("en-US").split("");

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes stats18-pop { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-64 flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="relative flex size-2" aria-hidden="true">
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:animate-none",
                dotClasses[tone]
              )}
            />
            <span
              className={cn(
                "relative inline-flex size-2 rounded-full",
                dotClasses[tone]
              )}
            />
          </span>
        </div>

        <div className="flex items-end gap-2">
          <span className="sr-only">
            {prefix}
            {Math.round(current).toLocaleString("en-US")}
            {suffix}
          </span>
          <span
            className={cn(
              "inline-flex items-baseline text-3xl font-semibold tabular-nums",
              numberClasses[tone]
            )}
            aria-hidden="true"
          >
            {prefix && <span className="mr-0.5 text-xl">{prefix}</span>}
            {chars.map((ch, i) =>
              /\d/.test(ch) ? (
                <Digit key={chars.length - i} value={Number(ch)} />
              ) : (
                <span key={chars.length - i} className="inline-flex h-9 items-center">
                  {ch}
                </span>
              )
            )}
            {suffix && <span className="ml-0.5 text-xl">{suffix}</span>}
          </span>

          {values.length > 1 && (
            <span
              key={index}
              className={cn(
                "mb-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
                delta >= 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}
              style={{ animation: "stats18-pop 500ms ease-out" }}
            >
              {delta >= 0 ? (
                <TrendingUp className="size-3" aria-hidden="true" />
              ) : (
                <TrendingDown className="size-3" aria-hidden="true" />
              )}
              {delta >= 0 ? "+" : ""}
              {delta.toLocaleString("en-US")}
            </span>
          )}
        </div>

        {caption && (
          <span className="text-xs text-muted-foreground">{caption}</span>
        )}
      </div>
    </div>
  );
}
