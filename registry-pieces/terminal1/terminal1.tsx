"use client";

import { cn } from "@/lib/utils";

interface Terminal1Props {
  prompt?: string;
  command?: string;
  bordered?: boolean;
  className?: string;
}

export const terminal1Demo: Terminal1Props = {
  prompt: "$",
  command: "npx beste-ui@latest init",
  bordered: false,
};

export function Terminal1({
  prompt = "$",
  command,
  bordered = false,
  className,
}: Terminal1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 items-center gap-2 rounded-lg bg-zinc-950 px-3 py-2.5 font-mono text-xs text-zinc-50 shadow-sm", bordered && "border border-zinc-800")}>
        <span className="shrink-0 text-emerald-400">{prompt}</span>
        <span className="flex-1 truncate">{command}</span>
        <span
          className="h-3.5 w-1.5 shrink-0 animate-pulse bg-emerald-400"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
