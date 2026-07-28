"use client";

import { Check, type LucideIcon, Trash2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "destructive" | "dark" | "primary";
type Rounded = "full" | "lg" | "md" | "none";

const roundedStyles: Record<Rounded, string> = {
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
  none: "rounded-none",
};

interface Button14Props {
  /** Idle label (e.g. "Hold to delete") */
  label: string;
  /** Label shown once the hold completes */
  confirmLabel?: string;
  /** How long the button must be held, in ms */
  holdDuration?: number;
  /** How long the confirmed state is shown before resetting, in ms; 0 disables the reset */
  resetDelay?: number;
  /** Leading icon in the idle state (defaults to Trash2) */
  icon?: LucideIcon;
  /** Fill tone: destructive (default), dark, or primary */
  tone?: Tone;
  /** Corner radius (defaults to full) */
  rounded?: Rounded;
  /** Called once, when the hold completes */
  onConfirm?: () => void;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<
  Tone,
  { idle: string; confirmedBorder: string; fill: string; fillText: string }
> = {
  destructive: {
    idle: "border-destructive/40 text-destructive hover:border-destructive",
    confirmedBorder: "border-destructive",
    fill: "bg-destructive",
    // shadcn's current default theme ships no --destructive-foreground (its
    // own destructive button uses text-white), so don't rely on that token.
    fillText: "text-white",
  },
  dark: {
    idle: "border-foreground/30 text-foreground hover:border-foreground",
    confirmedBorder: "border-foreground",
    fill: "bg-foreground",
    fillText: "text-background",
  },
  primary: {
    idle: "border-primary/40 text-primary hover:border-primary",
    confirmedBorder: "border-primary",
    fill: "bg-primary",
    fillText: "text-primary-foreground",
  },
};

export const button14Demo: Button14Props = {
  label: "Hold to delete",
  confirmLabel: "Deleted",
};

/**
 * Icon + rolling label pair, rendered twice: once in the idle colors and once
 * inside the sweeping fill (clipped), so the text color flips exactly where
 * the fill edge passes over it.
 */
function Content({
  confirmed,
  icon: Icon,
  label,
  confirmLabel,
}: {
  confirmed: boolean;
  icon: LucideIcon;
  label: string;
  confirmLabel: string;
}) {
  return (
    <>
      {confirmed ? <Check className="size-4 shrink-0" /> : <Icon className="size-4 shrink-0" />}
      <span className="relative block overflow-hidden whitespace-nowrap">
        <span
          className={cn(
            "block transition-transform duration-300 ease-out",
            confirmed && "-translate-y-full"
          )}
        >
          {label}
        </span>
        <span
          aria-hidden={!confirmed}
          className={cn(
            "absolute inset-0 block translate-y-full transition-transform duration-300 ease-out",
            confirmed && "translate-y-0"
          )}
        >
          {confirmLabel}
        </span>
      </span>
    </>
  );
}

export function Button14({
  label,
  confirmLabel = "Done",
  holdDuration = 1200,
  resetDelay = 2000,
  icon: Icon = Trash2,
  tone = "destructive",
  rounded = "full",
  onConfirm,
  className,
}: Button14Props) {
  const [state, setState] = React.useState<"idle" | "holding" | "confirmed">("idle");
  const holdTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const start = () => {
    if (state !== "idle") return;
    setState("holding");
    holdTimer.current = setTimeout(() => {
      setState("confirmed");
      onConfirm?.();
      if (resetDelay > 0) {
        resetTimer.current = setTimeout(() => setState("idle"), resetDelay);
      }
    }, holdDuration);
  };

  const cancel = () => {
    if (state !== "holding") return;
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setState("idle");
  };

  const styles = toneStyles[tone];
  const holding = state === "holding";
  const confirmed = state === "confirmed";
  const filled = holding || confirmed;

  const content = (
    <Content confirmed={confirmed} icon={Icon} label={label} confirmLabel={confirmLabel} />
  );

  return (
    <button
      type="button"
      onPointerDown={(e) => {
        // Only the primary button/touch starts a hold.
        if (e.button === 0) start();
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onBlur={cancel}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") cancel();
      }}
      className={cn(
        "relative inline-flex w-fit cursor-pointer touch-none select-none items-center gap-2 overflow-hidden border-2 bg-background px-6 py-2.5 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        roundedStyles[rounded],
        styles.idle,
        confirmed && styles.confirmedBorder,
        className
      )}
    >
      {/* Base layer: idle colors */}
      <span className="inline-flex items-center gap-2">{content}</span>

      {/* Fill bar: sweeps for the full hold duration, snaps back on release.
          It clips a color-flipped copy of the content so the text changes
          color exactly where the fill edge passes. */}
      <span
        aria-hidden="true"
        className={cn("absolute inset-y-0 left-0 overflow-hidden", styles.fill)}
        style={{
          width: filled ? "100%" : "0%",
          transitionProperty: "width",
          transitionDuration: holding ? `${holdDuration}ms` : confirmed ? "0ms" : "200ms",
          transitionTimingFunction: holding ? "linear" : "ease-out",
        }}
      >
        <span
          className={cn("absolute inset-y-0 left-0 flex items-center gap-2 px-6", styles.fillText)}
        >
          {content}
        </span>
      </span>
    </button>
  );
}
