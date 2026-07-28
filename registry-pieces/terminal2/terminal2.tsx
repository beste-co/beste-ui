"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Terminal2Props {
  command?: string;
  className?: string;
}

export const terminal2Demo: Terminal2Props = {
  command: "pnpm dlx shadcn@latest add button",
};

export function Terminal2({ command = "", className }: Terminal2Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* noop */
    }
  };

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-2 rounded-lg border border-border bg-muted py-1.5 pl-3 pr-1.5 shadow-sm">
        <span
          className="shrink-0 select-none text-xs font-medium text-muted-foreground"
          aria-hidden="true"
        >
          ›
        </span>
        <code className="flex-1 truncate font-mono text-xs text-card-foreground">
          {command}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="flex size-7 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-card hover:text-card-foreground"
          aria-label={copied ? "Copied" : "Copy command"}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
