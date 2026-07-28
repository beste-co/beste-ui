"use client";

import { cn } from "@/lib/utils";

interface Input25Props {
  code?: string;
  language?: string;
  className?: string;
}

export const input25Demo: Input25Props = {
  code: "const answer = 42;\nreturn answer * 2;",
  language: "typescript",
};

export function Input25({
  code = "",
  language = "text",
  className,
}: Input25Props) {
  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-foreground shadow-sm">
        <div className="flex items-center justify-between border-b border-background/20 px-3 py-1.5 text-xs">
          <span className="font-semibold uppercase tracking-wide text-background/70">
            {language}
          </span>
          <span
            className="size-1.5 rounded-full bg-emerald-400"
            aria-hidden="true"
          />
        </div>
        <div className="flex font-mono text-xs">
          <div className="flex flex-col items-end gap-0.5 border-r border-background/15 bg-background/5 p-2 text-background/40">
            {lines.map((_, idx) => (
              <span key={idx}>{idx + 1}</span>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-0.5 p-2 text-background">
            {lines.map((line, idx) => (
              <span key={idx} className="whitespace-pre">
                {line || " "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
