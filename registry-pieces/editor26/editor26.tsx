"use client";

import { cn } from "@/lib/utils";

interface ColorLine {
  key: string;
  value: string;
}

interface Editor26Props {
  colors?: ColorLine[];
  className?: string;
}

export const editor26Demo: Editor26Props = {
  colors: [
    { key: "--primary", value: "#f43f5e" },
    { key: "--accent", value: "#8b5cf6" },
    { key: "--surface", value: "#0ea5e9" },
  ],
};

export function Editor26({ colors = [], className }: Editor26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className="flex w-full max-w-80 flex-col gap-0.5 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs leading-relaxed shadow-sm">
        {colors.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-4 shrink-0 select-none text-right text-muted-foreground/60"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <code>
              <span className="text-sky-600 dark:text-sky-400">{c.key}</span>
              <span className="text-muted-foreground">: </span>
              <span
                className="inline-block size-3 translate-y-0.5 rounded-sm ring-1 ring-inset ring-border"
                style={{ backgroundColor: c.value }}
                aria-hidden="true"
              />
              <span className="text-card-foreground"> {c.value}</span>
              <span className="text-muted-foreground">;</span>
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}
