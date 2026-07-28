"use client";

import { cn } from "@/lib/utils";

interface Code2Props {
  title?: string;
  lines?: string[];
  className?: string;
}

export const code2Demo: Code2Props = {
  title: "greet.ts",
  lines: [
    "export function greet(name: string) {",
    "  return `Hello, ${name}!`;",
    "}",
    "",
    "console.log(greet(\"Beste\"));",
  ],
};

export function Code2({ title, lines = [], className }: Code2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg">
        {title && (
          <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-1.5">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-rose-500" />
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span className="size-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="font-mono text-xs text-zinc-400">{title}</span>
            <span className="size-4" aria-hidden="true" />
          </div>
        )}
        <pre className="overflow-auto px-3 py-2 font-mono text-xs leading-relaxed text-zinc-50">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-3">
              <span
                className="w-4 shrink-0 select-none text-right text-zinc-600"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <code className="flex-1">{line || "\u00A0"}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
