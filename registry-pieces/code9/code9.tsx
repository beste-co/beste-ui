"use client";

import { cn } from "@/lib/utils";

interface StackFrame {
  fn: string;
  file: string;
  line: number;
  column: number;
}

interface Code9Props {
  error?: string;
  frames?: StackFrame[];
  className?: string;
}

export const code9Demo: Code9Props = {
  error: "TypeError: Cannot read 'name' of undefined",
  frames: [
    { fn: "greet", file: "src/utils.ts", line: 14, column: 12 },
    { fn: "handler", file: "src/server.ts", line: 42, column: 8 },
    { fn: "processRequest", file: "src/api.ts", line: 88, column: 4 },
  ],
};

export function Code9({ error, frames = [], className }: Code9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-96 rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs leading-relaxed shadow-sm">
        {error && (
          <div className="truncate text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}
        {frames.map((frame, i) => (
          <div key={i} className="flex gap-2 truncate text-muted-foreground">
            <span className="select-none" aria-hidden="true">
              at
            </span>
            <span className="text-card-foreground">{frame.fn}</span>
            <span className="truncate">
              ({frame.file}
              <span className="text-amber-600 dark:text-amber-400">
                :{frame.line}:{frame.column}
              </span>
              )
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
