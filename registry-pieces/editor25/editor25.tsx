"use client";

import { cn } from "@/lib/utils";

interface Line {
  text: string;
  overflow?: number;
}

interface Editor25Props {
  lines?: Line[];
  limit?: number;
  className?: string;
}

export const editor25Demo: Editor25Props = {
  limit: 80,
  lines: [
    { text: "const message = `Hello`;" },
    { text: "const longer = `Shipping the biggest onboarding upgrade yet`;" },
    { text: "const wrapped = items.map((i) => i.name).join(', ') + '!'" },
  ],
};

export function Editor25({
  lines = [],
  limit = 80,
  className,
}: Editor25Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative w-full max-w-80 overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-3 py-1 font-mono text-xs text-muted-foreground">
          <span>col guide</span>
          <span className="tabular-nums">{limit}</span>
        </div>
        <div className="relative">
          <span
            className="pointer-events-none absolute top-0 h-full w-px bg-rose-500/60"
            style={{ left: "75%" }}
            aria-hidden="true"
          />
          <pre className="px-3 py-2 font-mono text-xs leading-relaxed">
            {lines.map((l, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className="w-4 shrink-0 select-none text-right text-muted-foreground/60"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <code className="flex-1 truncate text-card-foreground">
                  {l.text}
                </code>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
