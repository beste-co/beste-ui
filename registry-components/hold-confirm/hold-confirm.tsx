"use client";

import { Trash2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** What the hold commits to: a destructive action or an ordinary one. */
type Tone = "default" | "destructive";

/** Button size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export interface HoldConfirmProps {
  label: string;
  /** Shown while the button is held. Defaults to `label`. */
  holdingLabel?: string;
  /** Shown once the hold completes. */
  confirmedLabel?: string;
  /** A lucide icon component, or any node, before the label. */
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  /** How long the button must be held, in ms. */
  duration?: number;
  onConfirm?: () => void;
  onHoldStart?: () => void;
  /** Released before the hold completed. */
  onHoldCancel?: () => void;
  /** Whether the button shows its confirmed state. Pair with `onConfirmedChange` to control it. */
  confirmed?: boolean;
  defaultConfirmed?: boolean;
  onConfirmedChange?: (confirmed: boolean) => void;
  /** Ms before the confirmed state resets on its own. `null` keeps it. */
  resetAfter?: number | null;
  /** The description read after the label. */
  hint?: string;
  /** Screen readers that activate the button without a key press confirm at once instead of being locked out. */
  accessibleFallback?: boolean;
  disabled?: boolean;
  tone?: Tone;
  size?: Size;
  className?: string;
}

const toneStyles: Record<Tone, { base: string; fill: string; ring: string }> = {
  default: {
    base: "bg-muted text-foreground",
    fill: "bg-foreground text-background",
    ring: "focus-visible:outline-ring",
  },
  destructive: {
    base: "bg-destructive/10 text-destructive dark:bg-destructive/20",
    fill: "bg-destructive text-white",
    ring: "focus-visible:outline-destructive",
  },
};

const sizeStyles: Record<Size, { button: string; icon: string }> = {
  sm: { button: "h-8 gap-1.5 px-3 text-sm", icon: "size-4" },
  default: { button: "h-10 gap-2 px-4 text-sm", icon: "size-4" },
  lg: { button: "h-12 gap-2 px-5 text-base", icon: "size-5" },
};

// Same spring as inspector-slider: overshoots a hair, then settles, with no animation library
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

type Phase = "idle" | "holding" | "rewinding" | "confirmed";

function renderIcon(icon: HoldConfirmProps["icon"], className: string) {
  if (!icon) return null;
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "render" in icon)) {
    const Icon = icon as React.ComponentType<{ className?: string }>;
    return <Icon className={className} />;
  }
  return icon as React.ReactNode;
}

export const holdConfirmDemo: HoldConfirmProps = {
  label: "Delete the album",
  holdingLabel: "Keep holding",
  confirmedLabel: "Album deleted",
  icon: Trash2,
  duration: 1400,
  tone: "destructive",
  size: "lg",
  onConfirm: () => console.log("Deleted Blue Lines"),
};

export function HoldConfirm({
  label,
  holdingLabel,
  confirmedLabel = "Done",
  icon,
  duration = 1200,
  onConfirm,
  onHoldStart,
  onHoldCancel,
  confirmed: confirmedProp,
  defaultConfirmed = false,
  onConfirmedChange,
  resetAfter = 1800,
  hint = "Press and hold to confirm",
  accessibleFallback = true,
  disabled = false,
  tone = "default",
  size = "default",
  className,
}: HoldConfirmProps) {
  const [innerConfirmed, setInnerConfirmed] = React.useState(defaultConfirmed);
  const controlled = confirmedProp !== undefined;
  const confirmed = controlled ? confirmedProp : innerConfirmed;
  const setConfirmed = React.useCallback(
    (next: boolean) => {
      if (!controlled) setInnerConfirmed(next);
      onConfirmedChange?.(next);
    },
    [controlled, onConfirmedChange],
  );

  const [holding, setHolding] = React.useState(false);
  const [reduce, setReduce] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const hintId = React.useId();
  const loop = React.useRef({ frame: 0, start: 0, from: 0, progress: 0, mode: "idle" as Phase });
  const input = React.useRef<"pointer" | "keyboard" | null>(null);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Progress is one custom property written each frame, so holding costs no React renders
  const paint = React.useCallback((value: number) => {
    loop.current.progress = value;
    buttonRef.current?.style.setProperty("--hold", value.toFixed(4));
  }, []);

  const stop = () => cancelAnimationFrame(loop.current.frame);

  // Eases the fill from wherever it is back to empty
  const drain = React.useCallback(
    (length: number) => {
      const l = loop.current;
      cancelAnimationFrame(l.frame);
      if (reduce || l.progress <= 0) {
        l.mode = "idle";
        paint(0);
        return;
      }
      l.mode = "rewinding";
      l.from = l.progress;
      l.start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - l.start) / length);
        paint(l.from * (1 - t) ** 3);
        if (t < 1) l.frame = requestAnimationFrame(tick);
        else l.mode = "idle";
      };
      l.frame = requestAnimationFrame(tick);
    },
    [reduce, paint],
  );

  const complete = React.useCallback(() => {
    cancelAnimationFrame(loop.current.frame);
    loop.current.mode = "confirmed";
    paint(1);
    setHolding(false);
    input.current = null;
    if (typeof navigator !== "undefined") navigator.vibrate?.(12);
    setConfirmed(true);
    onConfirm?.();
  }, [paint, setConfirmed, onConfirm]);

  const begin = (source: "pointer" | "keyboard") => {
    if (disabled || confirmed || loop.current.mode === "holding") return;
    input.current = source;
    stop();
    const l = loop.current;
    l.mode = "holding";
    // A hold that starts mid-rewind picks up from where the fill is
    l.from = l.progress;
    l.start = performance.now();
    setHolding(true);
    onHoldStart?.();
    const tick = (now: number) => {
      const value = Math.min(1, l.from + (now - l.start) / duration);
      paint(value);
      if (value >= 1) complete();
      else l.frame = requestAnimationFrame(tick);
    };
    l.frame = requestAnimationFrame(tick);
  };

  const release = () => {
    const l = loop.current;
    if (l.mode !== "holding") return;
    stop();
    input.current = null;
    setHolding(false);
    onHoldCancel?.();
    // Early releases rewind faster than they filled
    drain(Math.max(160, l.progress * 420));
  };

  // Leave the confirmed state after `resetAfter`, or when the prop turns it off
  React.useEffect(() => {
    if (!confirmed) {
      if (loop.current.mode === "confirmed") drain(520);
      return;
    }
    loop.current.mode = "confirmed";
    paint(1);
    if (resetAfter == null) return;
    const timer = window.setTimeout(() => setConfirmed(false), resetAfter);
    return () => window.clearTimeout(timer);
  }, [confirmed, resetAfter, paint, setConfirmed, drain]);

  React.useEffect(() => () => cancelAnimationFrame(loop.current.frame), []);

  // A lost pointer or a hidden tab must not leave the hold running
  React.useEffect(() => {
    if (!holding) return;
    const cancel = () => release();
    window.addEventListener("blur", cancel);
    document.addEventListener("visibilitychange", cancel);
    return () => {
      window.removeEventListener("blur", cancel);
      document.removeEventListener("visibilitychange", cancel);
    };
  });

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    begin("pointer");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    // Holding a key must not also fire the native click
    event.preventDefault();
    if (!event.repeat) begin("keyboard");
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (input.current === "keyboard") release();
  };

  // A click with no pointer or key press behind it comes from assistive technology, which cannot hold
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.detail !== 0 || input.current !== null) return;
    if (accessibleFallback && !confirmed && !disabled) complete();
  };

  const t = toneStyles[tone];
  const s = sizeStyles[size];
  const phase: Phase = confirmed ? "confirmed" : holding ? "holding" : "idle";
  const text = confirmed ? confirmedLabel : holding ? (holdingLabel ?? label) : label;
  const iconNode = renderIcon(icon, s.icon);

  const faceFor = (value: string, done: boolean) => (
    <>
      {done ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(s.icon, "shrink-0")} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            pathLength={1}
            className="[stroke-dasharray:1] [stroke-dashoffset:0] motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500 motion-safe:starting:[stroke-dashoffset:1]"
          />
        </svg>
      ) : (
        iconNode && <span className="grid shrink-0 place-items-center">{iconNode}</span>
      )}
      <span className="whitespace-nowrap">{value}</span>
    </>
  );
  const face = faceFor(text, confirmed);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-describedby={confirmed ? undefined : hintId}
        data-phase={phase}
        data-tone={tone}
        onPointerDown={onPointerDown}
        onPointerUp={() => input.current === "pointer" && release()}
        onPointerCancel={() => input.current === "pointer" && release()}
        onLostPointerCapture={() => input.current === "pointer" && release()}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={() => input.current === "keyboard" && release()}
        onClick={onClick}
        onContextMenu={(event) => event.preventDefault()}
        className={cn(
          "group/hold relative isolate inline-flex cursor-pointer touch-manipulation select-none items-center justify-center overflow-hidden rounded-full font-medium outline-none [-webkit-touch-callout:none] [--hold:0]",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "motion-safe:transition-[scale] motion-safe:duration-300 data-[phase=holding]:scale-[0.97]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          t.base,
          t.ring,
          s.button,
          className,
        )}
        style={{ transitionTimingFunction: SPRING_EASE }}
      >
        {/* Every label stacked invisibly, so the button keeps the widest one's width and never jumps */}
        <span className="invisible grid gap-[inherit]" aria-hidden="true">
          <span className="col-start-1 row-start-1 flex items-center gap-[inherit]">{faceFor(label, false)}</span>
          <span className="col-start-1 row-start-1 flex items-center gap-[inherit]">{faceFor(holdingLabel ?? label, false)}</span>
          <span className="col-start-1 row-start-1 flex items-center gap-[inherit]">{faceFor(confirmedLabel, true)}</span>
        </span>
        {/* The label twice: the base one, and a filled copy clipped to the progress, so the text flips color as the fill passes it */}
        <span className="absolute inset-0 flex items-center justify-center gap-[inherit] px-[inherit]">{face}</span>
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-[inherit] px-[inherit] [clip-path:inset(0_calc((1-var(--hold))*100%)_0_0)]",
            t.fill,
          )}
        >
          {face}
        </span>
      </button>
      <span id={hintId} className="sr-only">
        {hint}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {confirmed ? confirmedLabel : ""}
      </span>
    </>
  );
}
