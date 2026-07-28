"use client";

import { Braces, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai43Props {
  content?: string;
  filename?: string;
  className?: string;
}

export const ai43Demo: Ai43Props = {
  filename: "response.json",
  content: `{
  "answer": "Use Redis INCR",
  "sources": 3,
  "latency_ms": 420
}`,
};

export function Ai43({
  filename = "response.json",
  content = "{}",
  className,
}: Ai43Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <Braces
              className="size-3 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="font-mono text-xs text-card-foreground">
              {filename}
            </span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Copy"
          >
            <Copy className="size-3" />
          </button>
        </div>
        <pre className="max-h-28 overflow-hidden whitespace-pre px-3 py-2 font-mono text-xs leading-relaxed text-card-foreground">
          {content}
        </pre>
      </div>
    </div>
  );
}
