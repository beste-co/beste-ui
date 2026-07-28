"use client";

import { cn } from "@/lib/utils";

interface Terminal8Props {
  dir?: string;
  branch?: string;
  dirty?: boolean;
  className?: string;
}

export const terminal8Demo: Terminal8Props = {
  dir: "beste-ui",
  branch: "main",
  dirty: true,
};

export function Terminal8({
  dir = "~",
  branch,
  dirty = false,
  className,
}: Terminal8Props) {
  const statusClass = dirty ? "text-amber-400" : "text-emerald-400";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-xs shadow-sm">
        <span className="text-emerald-400">➜</span>
        <span className="font-semibold text-sky-400">{dir}</span>
        {branch && (
          <span className="text-zinc-500">
            git:(<span className={statusClass}>{branch}</span>)
          </span>
        )}
        {branch && <span className={statusClass}>{dirty ? "✗" : "✓"}</span>}
        <span
          className="ml-0.5 h-3.5 w-1.5 animate-pulse bg-zinc-300"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
