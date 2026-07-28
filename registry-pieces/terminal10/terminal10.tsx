"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Terminal10Props {
  label?: string;
  hint?: string;
  className?: string;
}

export const terminal10Demo: Terminal10Props = {
  label: "Installing packages",
  hint: "ctrl-c to cancel",
};

export function Terminal10({ label, hint, className }: Terminal10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-xs shadow-sm">
        <Loader2
          className="size-3.5 shrink-0 animate-spin text-emerald-400"
          aria-hidden="true"
        />
        {label && <span className="flex-1 truncate text-zinc-200">{label}</span>}
        {hint && <span className="shrink-0 text-zinc-600">{hint}</span>}
      </div>
    </div>
  );
}
