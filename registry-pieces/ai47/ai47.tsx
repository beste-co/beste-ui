"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Tool {
  label: string;
  ms?: number;
}

interface Ai47Props {
  tools?: Tool[];
  answer?: string;
  gapMs?: number;
  holdMs?: number;
  className?: string;
}

export const ai47Demo: Ai47Props = {
  tools: [
    { label: "Searching docs", ms: 800 },
    { label: "Reading file", ms: 1100 },
    { label: "Running query", ms: 1400 },
    { label: "Writing answer", ms: 900 },
  ],
  answer:
    "Churn rose 2.1% in August, mostly from trial accounts that never connected a data source.",
};

export function Ai47({
  tools = [],
  answer = "",
  gapMs = 300,
  holdMs = 2800,
  className,
}: Ai47Props) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(true);
  const done = step >= tools.length;

  useEffect(() => {
    if (!tools.length) return;
    if (done) {
      const id = setTimeout(() => {
        setStep(0);
        setRunning(true);
      }, holdMs);
      return () => clearTimeout(id);
    }
    if (running) {
      const id = setTimeout(() => setRunning(false), tools[step]?.ms ?? 1000);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setStep((s) => s + 1);
      setRunning(true);
    }, gapMs);
    return () => clearTimeout(id);
  }, [step, running, done, tools, gapMs, holdMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes ai47-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes ai47-in { from { opacity: 0; transform: translateY(0.375rem); } to { opacity: 1; transform: none; } }
`}</style>

      <div className="flex w-full max-w-72 flex-col gap-4">
        <ul className="flex flex-col gap-2.5">
          {tools.map((tool, i) => {
            const resolved = i < step;
            const active = i === step && running && !done;
            return (
              <li key={i} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span
                    className={cn(
                      "truncate transition-colors duration-300 motion-reduce:transition-none",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {tool.label}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {resolved ? `${((tool.ms ?? 1000) / 1000).toFixed(1)}s` : ""}
                  </span>
                </div>
                <span className="block h-px w-full bg-border" aria-hidden="true">
                  <span
                    className={cn(
                      "block h-full origin-left bg-foreground",
                      resolved ? "scale-x-100" : "scale-x-0"
                    )}
                    style={
                      active
                        ? {
                            animation: `ai47-fill ${tool.ms ?? 1000}ms linear forwards`,
                          }
                        : undefined
                    }
                  />
                </span>
              </li>
            );
          })}
        </ul>

        <div className="relative">
          <p className="invisible text-sm leading-snug" aria-hidden="true">
            {answer}
          </p>
          {done && (
            <p
              className="absolute inset-0 text-sm leading-snug text-foreground"
              style={{ animation: "ai47-in 400ms ease-out" }}
            >
              {answer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
