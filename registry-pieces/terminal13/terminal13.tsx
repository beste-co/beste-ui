"use client";

import { cn } from "@/lib/utils";

interface Terminal13Props {
  command?: string;
  output?: string;
  className?: string;
}

export const terminal13Demo: Terminal13Props = {
  command: "npx sirius-cli@latest init",
  output: "✓ Workspace ready. Open the dashboard to invite your team.",
};

export function Terminal13({
  command,
  output,
  className,
}: Terminal13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 overflow-hidden rounded-md bg-foreground text-background shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-background/15 px-3 py-2">
          <span className="size-2.5 rounded-full bg-rose-400" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-amber-400" aria-hidden="true" />
          <span
            className="size-2.5 rounded-full bg-emerald-400"
            aria-hidden="true"
          />
        </div>
        <div className="p-4 font-mono text-sm leading-relaxed">
          {command && (
            <p className="flex gap-2">
              <span className="select-none text-background/50" aria-hidden="true">
                $
              </span>
              <span className="text-background">{command}</span>
            </p>
          )}
          {output && <p className="mt-2 text-background/60">{output}</p>}
        </div>
      </div>
    </div>
  );
}
