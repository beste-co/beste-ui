"use client";

import { Check, Copy, RotateCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Ai12Props {
  language?: string;
  code?: string;
  className?: string;
}

export const ai12Demo: Ai12Props = {
  language: "ts",
  code: "const slug = (s: string) =>\n  s.toLowerCase().replace(/\\s+/g, '-');",
};

export function Ai12({
  language = "code",
  code = "",
  className,
}: Ai12Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
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
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {language}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy"}
              className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
            >
              {copied ? (
                <Check className="size-3 text-emerald-500" aria-hidden="true" />
              ) : (
                <Copy className="size-3" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              aria-label="Regenerate"
              className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
            >
              <RotateCw className="size-3" aria-hidden="true" />
            </button>
          </div>
        </div>
        <pre className="overflow-auto px-3 py-2 font-mono text-xs leading-relaxed text-card-foreground">
          {code}
        </pre>
      </div>
    </div>
  );
}
