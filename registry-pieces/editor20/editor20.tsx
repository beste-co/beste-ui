"use client";

import { cn } from "@/lib/utils";

interface BlameLine {
  line: number;
  author: string;
  time: string;
  hash: string;
  code: string;
}

interface Editor20Props {
  lines?: BlameLine[];
  className?: string;
}

export const editor20Demo: Editor20Props = {
  lines: [
    {
      line: 40,
      author: "Ayşe",
      time: "3d ago",
      hash: "a1b2c3d",
      code: "const greet = (name: string) =>",
    },
    {
      line: 41,
      author: "Merve",
      time: "today",
      hash: "9f0e4c2",
      code: "  `Merhaba, ${name}!`;",
    },
    {
      line: 42,
      author: "Ayşe",
      time: "3d ago",
      hash: "a1b2c3d",
      code: "",
    },
  ],
};

export function Editor20({ lines = [], className }: Editor20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card py-1 font-mono text-xs leading-relaxed shadow-sm">
        {lines.map((l, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-0.5"
          >
            <span
              className="w-5 shrink-0 select-none text-right text-muted-foreground/60"
              aria-hidden="true"
            >
              {l.line}
            </span>
            <code className="w-40 shrink-0 truncate text-card-foreground">
              {l.code || "\u00A0"}
            </code>
            <span className="ml-auto flex shrink-0 items-center gap-1 text-muted-foreground">
              <span className="text-card-foreground">{l.author}</span>
              <span>·</span>
              <span>{l.time}</span>
              <span>·</span>
              <span className="rounded-sm bg-muted px-1 tabular-nums">
                {l.hash.slice(0, 7)}
              </span>
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}
