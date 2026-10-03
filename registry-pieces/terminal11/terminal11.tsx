"use client";

import { cn } from "@/lib/utils";

interface Terminal11Props {
  prompt?: string;
  expression?: string;
  result?: string;
  bordered?: boolean;
  className?: string;
}

export const terminal11Demo: Terminal11Props = {
  prompt: ">",
  expression: "[1, 2, 3].map((n) => n * 2)",
  result: "[ 2, 4, 6 ]",
  bordered: false,
};

export function Terminal11({
  prompt = ">",
  expression,
  result,
  bordered = false,
  className,
}: Terminal11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-1 rounded-lg bg-zinc-950 px-3 py-2.5 font-mono text-xs shadow-sm", bordered && "border border-zinc-800")}>
        <div className="flex gap-2">
          <span className="shrink-0 text-violet-400">{prompt}</span>
          <span className="truncate text-zinc-50">{expression}</span>
        </div>
        {result && <span className="text-zinc-400">{result}</span>}
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-violet-400">{prompt}</span>
          <span
            className="h-3.5 w-1.5 animate-pulse bg-zinc-300"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
