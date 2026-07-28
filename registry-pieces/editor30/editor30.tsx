"use client";

import { cn } from "@/lib/utils";

type ChangeKind = "added" | "modified" | "removed" | "unchanged";

interface GutterLine {
  line: number;
  code: string;
  kind: ChangeKind;
}

interface Editor30Props {
  lines?: GutterLine[];
  className?: string;
}

export const editor30Demo: Editor30Props = {
  lines: [
    { line: 10, code: "import { greet } from './greet';", kind: "unchanged" },
    { line: 11, code: "", kind: "unchanged" },
    { line: 12, code: "const user = { name: 'Ayşe' };", kind: "added" },
    {
      line: 13,
      code: "const msg = greet(user.name);",
      kind: "modified",
    },
    { line: 14, code: "console.log(msg);", kind: "unchanged" },
    { line: 15, code: "", kind: "removed" },
  ],
};

const kindClass: Record<ChangeKind, string> = {
  added: "bg-emerald-500",
  modified: "bg-sky-500",
  removed: "bg-rose-500",
  unchanged: "bg-transparent",
};

export function Editor30({ lines = [], className }: Editor30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card py-1 font-mono text-xs leading-relaxed shadow-sm">
        {lines.map((l, i) => (
          <div key={i} className="flex items-center gap-0">
            <span
              className={cn("h-5 w-1 shrink-0", kindClass[l.kind])}
              aria-hidden="true"
            />
            <span
              className="w-7 shrink-0 select-none text-right text-muted-foreground/60"
              aria-hidden="true"
            >
              {l.line}
            </span>
            <code className="ml-3 flex-1 truncate text-card-foreground">
              {l.code || "\u00A0"}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}
