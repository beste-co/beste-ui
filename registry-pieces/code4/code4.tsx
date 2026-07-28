"use client";

import { cn } from "@/lib/utils";

type DiffKind = "add" | "remove" | "context";

interface DiffLine {
  kind: DiffKind;
  text: string;
}

interface Code4Props {
  lines?: DiffLine[];
  className?: string;
}

export const code4Demo: Code4Props = {
  lines: [
    { kind: "context", text: "function greet(name) {" },
    { kind: "remove", text: "  return 'Hi ' + name;" },
    { kind: "add", text: "  return `Hello, ${name}!`;" },
    { kind: "context", text: "}" },
  ],
};

const lineClasses: Record<DiffKind, string> = {
  add: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  remove: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  context: "text-muted-foreground",
};

const prefixMap: Record<DiffKind, string> = {
  add: "+",
  remove: "-",
  context: " ",
};

export function Code4({ lines = [], className }: Code4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 overflow-hidden rounded-lg border border-border bg-card font-mono text-xs leading-relaxed shadow-sm">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn("flex gap-2 px-3 py-1", lineClasses[line.kind])}
          >
            <span className="w-3 shrink-0 select-none" aria-hidden="true">
              {prefixMap[line.kind]}
            </span>
            <code className="flex-1 truncate">{line.text}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
