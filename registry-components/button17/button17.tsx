"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "dark";

interface Button17Props {
  /** The text written to the clipboard */
  value: string;
  /** Display text (defaults to value) */
  label?: string;
  /** Muted, non-copied prefix rendered before the label (e.g. "$" for shell commands) */
  prefix?: string;
  /** How long the copied state is shown, in ms */
  resetDelay?: number;
  /** Surface tone: bordered background (default) or solid dark */
  tone?: Tone;
  /** Called after a successful copy */
  onCopy?: () => void;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, { root: string; hint: string }> = {
  neutral: {
    root: "border-border bg-background text-foreground hover:bg-muted/50",
    hint: "text-muted-foreground group-hover/button17:text-foreground",
  },
  dark: {
    root: "border-transparent bg-foreground text-background hover:bg-foreground/90",
    hint: "text-background/60 group-hover/button17:text-background",
  },
};

export const button17Demo: Button17Props = {
  value: "npx shadcn@latest init",
  prefix: "$",
};

/**
 * Click-to-copy chip for install commands, API keys, coupon codes, etc.
 * Copies `value` to the clipboard and flips the icon to a check while the
 * copied state is active. The state change is announced politely to screen
 * readers via a visually-hidden live region.
 */
export function Button17({
  value,
  label,
  prefix,
  resetDelay = 1500,
  tone = "neutral",
  onCopy,
  className,
}: Button17Props) {
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  // A new value invalidates the current copied state.
  React.useEffect(() => {
    setCopied(false);
  }, [value]);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.();
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), resetDelay);
    } catch {
      // Clipboard write can fail in insecure contexts, fail silently.
    }
  };

  const styles = toneStyles[tone];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? "Copied to clipboard" : `Copy "${value}" to clipboard`}
      className={cn(
        "group/button17 inline-flex w-fit cursor-pointer items-center gap-3 rounded-md border px-4 py-2.5 font-mono text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        styles.root,
        className
      )}
    >
      <span className="flex items-center gap-2 whitespace-nowrap">
        {prefix && (
          <span aria-hidden="true" className={cn("select-none transition-colors", styles.hint)}>
            {prefix}
          </span>
        )}
        {label ?? value}
      </span>
      <span className="relative flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
        <Copy
          className={cn(
            "absolute size-4 transition-all duration-200",
            styles.hint,
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100"
          )}
        />
        <Check
          className={cn(
            "absolute size-4 text-emerald-600 transition-all duration-200",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0"
          )}
        />
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
