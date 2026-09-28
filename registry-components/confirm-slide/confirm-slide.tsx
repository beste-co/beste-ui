"use client";

import { ChevronsRight } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** What the slide commits to: a destructive action or an ordinary one. */
type Tone = "default" | "destructive";

/** Track size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export interface ConfirmSlideProps {
  /** Written on the track, and the thumb's accessible name. */
  label: string;
  /** Shown once the slide completes. */
  confirmedLabel?: string;
  /** A lucide icon component, or any node, on the thumb. */
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  onConfirm?: () => void;
  /** Whether the slide shows its confirmed state. Pair with `onConfirmedChange` to control it. */
  confirmed?: boolean;
  defaultConfirmed?: boolean;
  onConfirmedChange?: (confirmed: boolean) => void;
  /** Ms before the confirmed state resets on its own. `null` keeps it. */
  resetAfter?: number | null;
  /** The description read after the label. */
  hint?: string;
  disabled?: boolean;
  tone?: Tone;
  size?: Size;
  className?: string;
}

export const confirmSlideDemo: ConfirmSlideProps = {
  label: "Slide to delete the album",
  confirmedLabel: "Album deleted",
  tone: "destructive",
  onConfirm: () => console.log("Deleted Blue Lines by Massive Attack"),
  className: "w-full max-w-sm",
};

// Same spring as inspector-slider: overshoots a hair, then settles, with no animation library
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

/** Share of the track past which letting go completes the slide. */
const COMPLETE_AT = 0.9;
/** A flick this fast (px/ms) toward the end completes from halfway. */
const FLICK = 0.9;
/** Share of the track per arrow key; held keys repeat, so a held Right arrow slides it through. */
const KEY_STEP = 0.08;

const toneStyles: Record<Tone, { track: string; fill: string; thumb: string; ink: string; ring: string }> = {
  default: {
    track: "bg-muted",
    fill: "bg-foreground/10",
    thumb: "bg-foreground text-background",
    ink: "var(--foreground)",
    ring: "focus-visible:outline-ring",
  },
  destructive: {
    track: "bg-destructive/10 dark:bg-destructive/20",
    fill: "bg-destructive/15 dark:bg-destructive/25",
    thumb: "bg-destructive text-white",
    ink: "var(--destructive)",
    ring: "focus-visible:outline-destructive",
  },
};

// The thumb and the inset around it drive every other measure through custom properties
const sizeStyles: Record<Size, { root: string; label: string; icon: string }> = {
  sm: { root: "h-10 [--slide-thumb:--spacing(8)]", label: "text-sm", icon: "size-4" },
  default: { root: "h-12 [--slide-thumb:--spacing(10)]", label: "text-sm", icon: "size-4.5" },
  lg: { root: "h-14 [--slide-thumb:--spacing(12)]", label: "text-base", icon: "size-5" },
};

function renderIcon(icon: ConfirmSlideProps["icon"], className: string) {
  if (!icon) return <ChevronsRight className={className} />;
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "render" in icon)) {
    const Icon = icon as React.ComponentType<{ className?: string }>;
    return <Icon className={className} />;
  }
  return icon as React.ReactNode;
}

export function ConfirmSlide({
  label,
  confirmedLabel = "Done",
  icon,
  onConfirm,
  confirmed: confirmedProp,
  defaultConfirmed = false,
  onConfirmedChange,
  resetAfter = 1800,
  hint = "Slide the thumb to the end to confirm",
  disabled = false,
  tone = "default",
  size = "default",
  className,
}: ConfirmSlideProps) {
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

  const [dragging, setDragging] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const hintId = React.useId();
  const state = React.useRef({ p: confirmed ? 1 : 0, travel: 0, pointer: -1, startX: 0, startP: 0, samples: [] as { x: number; t: number }[] });
  const callbacks = React.useRef({ onConfirm });
  callbacks.current = { onConfirm };

  // Progress lives in custom properties, so a drag costs no React renders
  const write = React.useCallback((p: number, motion: "drag" | "spring" = "spring") => {
    const root = rootRef.current;
    const s = state.current;
    s.p = Math.min(1, Math.max(0, p));
    if (!root) return;
    root.dataset.motion = motion;
    root.style.setProperty("--slide-p", String(s.p));
    root.style.setProperty("--slide-x", `${s.p * s.travel}px`);
    thumbRef.current?.setAttribute("aria-valuenow", String(Math.round(s.p * 100)));
  }, []);

  // Travel is the track's inner width less the thumb, measured whenever the track changes size
  React.useEffect(() => {
    const root = rootRef.current;
    const thumb = thumbRef.current;
    if (!root || !thumb) return;
    const measure = () => {
      const inset = thumb.offsetLeft;
      state.current.travel = Math.max(0, root.clientWidth - thumb.offsetWidth - inset * 2);
      root.style.setProperty("--slide-x", `${state.current.p * state.current.travel}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // A controlled change, or a reset, lands the thumb where the state says
  React.useEffect(() => {
    if (!dragging) write(confirmed ? 1 : 0);
  }, [confirmed, dragging, write]);

  React.useEffect(() => {
    if (!confirmed || resetAfter === null) return;
    const timer = window.setTimeout(() => setConfirmed(false), resetAfter);
    return () => window.clearTimeout(timer);
  }, [confirmed, resetAfter, setConfirmed]);

  // A light runs across the label at rest; the Web Animations API needs no keyframes in CSS
  React.useEffect(() => {
    const el = labelRef.current;
    if (!el || confirmed || disabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = el.animate([{ backgroundPosition: "100% 0" }, { backgroundPosition: "-100% 0" }], {
      duration: 2600,
      iterations: Number.POSITIVE_INFINITY,
      easing: "ease-in-out",
    });
    return () => animation.cancel();
  }, [confirmed, disabled]);

  const complete = () => {
    write(1);
    if (confirmed) return;
    setConfirmed(true);
    callbacks.current.onConfirm?.();
    if (typeof navigator !== "undefined") navigator.vibrate?.(14);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || confirmed || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
    const s = state.current;
    s.pointer = event.pointerId;
    s.startX = event.clientX;
    s.startP = s.p;
    s.samples = [{ x: event.clientX, t: event.timeStamp }];
    setDragging(true);
    write(s.p, "drag");
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (event.pointerId !== s.pointer || s.travel === 0) return;
    s.samples.push({ x: event.clientX, t: event.timeStamp });
    if (s.samples.length > 6) s.samples.shift();
    write(s.startP + (event.clientX - s.startX) / s.travel, "drag");
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (event.pointerId !== s.pointer) return;
    s.pointer = -1;
    setDragging(false);
    const first = s.samples[0];
    const last = s.samples[s.samples.length - 1];
    const velocity = first && last && last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0;
    if (s.p >= COMPLETE_AT || (s.p > 0.5 && velocity > FLICK)) complete();
    else write(0);
  };

  // Holding Right slides it through on key repeat; End, Enter and Space complete at once for assistive technology
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || confirmed) return;
    const s = state.current;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = s.p + KEY_STEP;
      if (next >= 1) complete();
      else write(next);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "Home") {
      event.preventDefault();
      write(0);
    } else if (event.key === "End" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      complete();
    }
  };

  // Letting go of the arrow before the end springs the thumb back, as letting go of the pointer does
  const onKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === "ArrowRight" || event.key === "ArrowUp") && !confirmed && state.current.p < 1) write(0);
  };

  const t = toneStyles[tone];
  const s = sizeStyles[size];
  const phase = confirmed ? "confirmed" : dragging ? "dragging" : "idle";
  const shimmer = `linear-gradient(110deg, color-mix(in oklab, ${t.ink} 55%, transparent) 40%, ${t.ink} 50%, color-mix(in oklab, ${t.ink} 55%, transparent) 60%)`;

  return (
    <div
      ref={rootRef}
      data-slot="confirm-slide"
      data-phase={phase}
      data-motion="spring"
      data-disabled={disabled || undefined}
      className={cn(
        "group/slide relative isolate flex min-w-fit select-none items-center overflow-hidden rounded-full p-1",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        t.track,
        s.root,
        className,
      )}
      style={{ "--slide-p": confirmed ? 1 : 0, "--slide-ease": SPRING_EASE } as React.CSSProperties}
    >
      {/* In flow and invisible, so the track is never narrower than its longest label next to the thumb */}
      <span aria-hidden="true" className={cn("invisible grid whitespace-nowrap ps-[calc(var(--slide-thumb)_+_--spacing(3))] pe-4 font-medium", s.label)}>
        <span className="col-start-1 row-start-1">{label}</span>
        <span className="col-start-1 row-start-1">{confirmedLabel}</span>
      </span>

      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-y-1 left-1 rounded-full",
          "group-data-[motion=spring]/slide:motion-safe:transition-[width] group-data-[motion=spring]/slide:motion-safe:duration-500 group-data-[motion=spring]/slide:ease-(--slide-ease)",
          t.fill,
        )}
        style={{ width: "calc(var(--slide-x, 0px) + var(--slide-thumb))" }}
      />

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap ps-[calc(var(--slide-thumb)_+_--spacing(3))] pe-4 font-medium",
          "group-data-[motion=spring]/slide:motion-safe:transition-opacity group-data-[motion=spring]/slide:motion-safe:duration-300",
          s.label,
        )}
        style={{ opacity: confirmed ? 0 : "clamp(0, calc(1 - var(--slide-p) * 1.8), 1)" }}
      >
        <span ref={labelRef} className="bg-clip-text text-transparent" style={{ backgroundImage: shimmer, backgroundSize: "250% 100%", backgroundPosition: "100% 0" }}>
          {label}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap pe-[calc(var(--slide-thumb)_+_--spacing(3))] ps-4 font-medium",
          "opacity-0 motion-safe:transition-[opacity,translate] motion-safe:duration-500 motion-safe:translate-y-1",
          "group-data-[phase=confirmed]/slide:translate-y-0 group-data-[phase=confirmed]/slide:opacity-100",
          s.label,
        )}
        style={{ color: t.ink, transitionTimingFunction: SPRING_EASE }}
      >
        {confirmedLabel}
      </span>

      <div
        ref={thumbRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-describedby={confirmed ? undefined : hintId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={confirmed ? 100 : 0}
        aria-valuetext={confirmed ? confirmedLabel : "Not confirmed"}
        aria-disabled={disabled || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        className={cn(
          "absolute top-1 left-1 z-10 grid size-(--slide-thumb) touch-none place-items-center rounded-full shadow-sm outline-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "cursor-grab active:cursor-grabbing group-data-[phase=confirmed]/slide:cursor-default group-data-[disabled]/slide:cursor-not-allowed",
          "group-data-[motion=spring]/slide:motion-safe:transition-[translate,scale] group-data-[motion=spring]/slide:motion-safe:duration-500 group-data-[motion=spring]/slide:ease-(--slide-ease)",
          "group-data-[phase=dragging]/slide:scale-105",
          t.thumb,
          t.ring,
        )}
        style={{ translate: "var(--slide-x, 0px) 0" }}
      >
        <span className="relative grid place-items-center">
          <span
            className={cn(
              "grid place-items-center motion-safe:transition-[opacity,scale] motion-safe:duration-300",
              "group-data-[phase=confirmed]/slide:scale-50 group-data-[phase=confirmed]/slide:opacity-0",
            )}
          >
            {renderIcon(icon, s.icon)}
          </span>
          {confirmed && (
            <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("absolute", s.icon)} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                pathLength={1}
                className="[stroke-dasharray:1] [stroke-dashoffset:0] motion-safe:transition-[stroke-dashoffset] motion-safe:delay-150 motion-safe:duration-500 motion-safe:starting:[stroke-dashoffset:1]"
              />
            </svg>
          )}
        </span>
      </div>

      <span id={hintId} className="sr-only">
        {hint}
      </span>
      <span className="sr-only" aria-live="polite">
        {confirmed ? confirmedLabel : ""}
      </span>
    </div>
  );
}
