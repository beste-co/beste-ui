"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "rose" | "emerald" | "violet";

interface Editor13Props {
  name?: string;
  code?: string;
  tone?: Tone;
  className?: string;
}

const tonePairs: Record<Tone, { bg: string; text: string; caret: string }> = {
  primary: {
    bg: "bg-primary",
    text: "text-primary-foreground",
    caret: "bg-primary",
  },
  foreground: {
    bg: "bg-foreground",
    text: "text-background",
    caret: "bg-foreground",
  },
  rose: { bg: "bg-rose-500", text: "text-white", caret: "bg-rose-500" },
  emerald: {
    bg: "bg-emerald-500",
    text: "text-white",
    caret: "bg-emerald-500",
  },
  violet: {
    bg: "bg-violet-500",
    text: "text-white",
    caret: "bg-violet-500",
  },
};

export const editor13Demo: Editor13Props = {
  name: "Ayşe",
  code: "  return greet(name);",
  tone: "rose",
};

export function Editor13({
  name = "Collaborator",
  code = "",
  tone = "rose",
  className,
}: Editor13Props) {
  const cfg = tonePairs[tone];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-0 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs shadow-sm">
        <span className="text-card-foreground">{code}</span>
        <div className="relative ml-0.5 flex flex-col items-start">
          <span
            className={cn(
              "absolute -top-5 whitespace-nowrap rounded-sm px-1.5 py-0.5 font-sans text-xs font-semibold shadow-sm",
              cfg.bg,
              cfg.text
            )}
          >
            {name}
          </span>
          <span
            className={cn("h-3.5 w-0.5 animate-pulse", cfg.caret)}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
