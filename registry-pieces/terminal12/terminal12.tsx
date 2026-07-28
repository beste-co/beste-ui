"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestItem {
  name: string;
  passed: boolean;
}

interface Terminal12Props {
  tests?: TestItem[];
  duration?: string;
  className?: string;
}

export const terminal12Demo: Terminal12Props = {
  tests: [
    { name: "renders the label", passed: true },
    { name: "fires onClick", passed: true },
    { name: "respects disabled state", passed: false },
  ],
  duration: "1.24s",
};

export function Terminal12({
  tests = [],
  duration,
  className,
}: Terminal12Props) {
  const passed = tests.filter((test) => test.passed).length;
  const failed = tests.length - passed;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-72 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs shadow-sm">
        <div className="flex flex-col gap-1.5 p-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center gap-2">
              {test.passed ? (
                <Check
                  className="size-3.5 shrink-0 text-emerald-400"
                  aria-hidden="true"
                />
              ) : (
                <X
                  className="size-3.5 shrink-0 text-rose-400"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "truncate",
                  test.passed ? "text-zinc-400" : "text-zinc-100"
                )}
              >
                {test.name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-zinc-800 px-3 py-2">
          <span className="text-emerald-400">{passed} passed</span>
          {failed > 0 && <span className="text-rose-400">{failed} failed</span>}
          {duration && (
            <span className="ml-auto text-zinc-500">{duration}</span>
          )}
        </div>
      </div>
    </div>
  );
}
