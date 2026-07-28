"use client";

import { Clipboard, Keyboard } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "sky"
  | "emerald"
  | "rose";

interface Upload11Props {
  title?: string;
  hint?: string;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-foreground/15 text-foreground",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  rose: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
};

export const upload11Demo: Upload11Props = {
  title: "Paste an image from your clipboard",
  hint: "Screenshot, copy, and press the shortcut to drop it here.",
  tone: "primary",
};

export function Upload11({
  title,
  hint,
  tone = "primary",
  className,
}: Upload11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-5 py-6 text-center">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            tileClasses[tone]
          )}
        >
          <Clipboard className="size-5" aria-hidden="true" />
        </div>
        {title && (
          <span className="text-sm font-semibold text-card-foreground">
            {title}
          </span>
        )}
        {hint && (
          <span className="text-balance text-xs text-muted-foreground">
            {hint}
          </span>
        )}
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground shadow-sm">
          <Keyboard className="size-3" aria-hidden="true" />
          <kbd className="font-mono font-semibold text-card-foreground">⌘</kbd>
          <span>+</span>
          <kbd className="font-mono font-semibold text-card-foreground">V</kbd>
        </div>
      </div>
    </div>
  );
}
