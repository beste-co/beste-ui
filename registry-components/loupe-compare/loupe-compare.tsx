"use client";

import { ChevronsLeftRight, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Frame treatment around the pictures. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Handle and label size. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

export interface CompareImage {
  src: string;
  alt: string;
  /** Extra classes on this picture, e.g. a filter to fake a before state. */
  className?: string;
}

export interface LoupeCompareProps {
  /** Shown on the start side of the divider: left, or top when vertical. */
  before: CompareImage;
  /** Shown on the end side of the divider. */
  after: CompareImage;
  /** Divider position from the start edge, 0 to 100. Pair with `onValueChange` to control it. */
  value?: number;
  /** @defaultValue 50 */
  defaultValue?: number;
  /** Every move of the divider. */
  onValueChange?: (value: number) => void;
  /** Once per gesture: on release, after a click or a key press. */
  onValueCommit?: (value: number) => void;
  /** @defaultValue "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** `drag` moves the divider on press; `hover` lets a mouse move it without pressing. @defaultValue "drag" */
  mode?: "drag" | "hover";
  /** Width to height, as a number or a CSS ratio like "3/2". @defaultValue "3/2" */
  aspectRatio?: number | string;
  /** Captions on each side; `false` hides them. */
  labels?: { before?: string; after?: string } | false;
  /** @defaultValue "muted" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  disabled?: boolean;
  /** @defaultValue "Compare before and after" */
  "aria-label"?: string;
  className?: string;
}

const PAINTING = "https://images.unsplash.com/photo-1783676167814-13057079dd43?q=80&w=1600&auto=format&fit=crop";

export const loupeCompareDemo: LoupeCompareProps = {
  before: { src: PAINTING, alt: "Wheat field with cypresses, as an archive print", className: "grayscale sepia-[0.35] contrast-[0.9] brightness-[1.05]" },
  after: { src: PAINTING, alt: "Wheat field with cypresses, restored to full color" },
  labels: { before: "Archive print", after: "Restored" },
  defaultValue: 42,
  aspectRatio: "3/2",
  className: "w-full max-w-2xl",
};

/** The inspector family's spring, used when a click or a key jumps the divider. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";
const JUMP_MS = 520;

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted",
  outline: "border border-border bg-muted",
  ghost: "bg-transparent",
};

const sizeStyles: Record<Size, { handle: string; icon: string; label: string; inset: string }> = {
  sm: { handle: "size-8", icon: "size-4", label: "px-2 py-0.5 text-sm", inset: "3" },
  default: { handle: "size-10", icon: "size-4", label: "px-2.5 py-1 text-sm", inset: "4" },
  lg: { handle: "size-12", icon: "size-5", label: "px-3 py-1 text-base", inset: "5" },
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * A before and after comparison: two pictures stacked, the top one revealed up to a
 * divider you drag, click, hover or move from the keyboard. Nothing reflows; the reveal is a clip-path.
 */
export function LoupeCompare({
  before,
  after,
  value,
  defaultValue = 50,
  onValueChange,
  onValueCommit,
  orientation = "horizontal",
  mode = "drag",
  aspectRatio = "3/2",
  labels = { before: "Before", after: "After" },
  tone = "muted",
  size = "default",
  disabled = false,
  "aria-label": ariaLabel = "Compare before and after",
  className,
}: LoupeCompareProps) {
  const vertical = orientation === "vertical";
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const position = React.useRef(clamp(value ?? defaultValue));
  const dragging = React.useRef(false);
  const jumpTimer = React.useRef(0);
  const callbacks = React.useRef({ onValueChange, onValueCommit });
  callbacks.current = { onValueChange, onValueCommit };
  const [loaded, setLoaded] = React.useState({ before: false, after: false });
  const beforeRef = React.useRef<HTMLImageElement>(null);
  const afterRef = React.useRef<HTMLImageElement>(null);

  // Position lives in one custom property, so moving the divider costs no renders
  const paint = React.useCallback((next: number, jump = false) => {
    const root = rootRef.current;
    if (!root) return;
    if (jump) {
      root.dataset.jump = "true";
      window.clearTimeout(jumpTimer.current);
      jumpTimer.current = window.setTimeout(() => {
        if (rootRef.current) rootRef.current.dataset.jump = "false";
      }, JUMP_MS);
    }
    root.style.setProperty("--compare", String(next));
    const input = inputRef.current;
    if (input) {
      input.value = String(Math.round(next));
      input.setAttribute("aria-valuetext", `${Math.round(next)}% before, ${Math.round(100 - next)}% after`);
    }
  }, []);

  const set = React.useCallback(
    (next: number, jump: boolean) => {
      const clamped = clamp(next);
      position.current = clamped;
      paint(clamped, jump);
      callbacks.current.onValueChange?.(clamped);
      return clamped;
    },
    [paint],
  );

  useIsoLayoutEffect(() => {
    paint(position.current);
  }, [paint]);

  // A controlled value moves the divider unless the reader is dragging it
  useIsoLayoutEffect(() => {
    if (value === undefined || dragging.current) return;
    const next = clamp(value);
    if (next === position.current) return;
    position.current = next;
    paint(next, true);
  }, [value, paint]);

  React.useEffect(() => () => window.clearTimeout(jumpTimer.current), []);

  // Pictures served from cache may finish before hydration and never fire onLoad
  React.useEffect(() => {
    const done = (img: HTMLImageElement | null) => Boolean(img?.complete && img.naturalWidth > 0);
    setLoaded((current) => ({ before: current.before || done(beforeRef.current), after: current.after || done(afterRef.current) }));
  }, []);

  const ready = loaded.before && loaded.after;

  const fractionAt = (event: { clientX: number; clientY: number }) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return position.current;
    return vertical ? ((event.clientY - rect.top) / rect.height) * 100 : ((event.clientX - rect.left) / rect.width) * 100;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = true;
    rootRef.current?.setAttribute("data-dragging", "true");
    inputRef.current?.focus({ preventScroll: true });
    set(fractionAt(event), true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (dragging.current) {
      // Once the pointer moves, the divider follows it directly instead of springing
      if (rootRef.current) rootRef.current.dataset.jump = "false";
      set(fractionAt(event), false);
    } else if (mode === "hover" && event.pointerType === "mouse") {
      set(fractionAt(event), false);
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    rootRef.current?.setAttribute("data-dragging", "false");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    callbacks.current.onValueCommit?.(position.current);
  };

  const onMouseLeave = () => {
    if (mode === "hover" && !dragging.current) callbacks.current.onValueCommit?.(position.current);
  };

  const s = sizeStyles[size];
  const initial = position.current;
  const ratio = typeof aspectRatio === "number" ? String(aspectRatio) : aspectRatio;
  const jumpMotion =
    "group-data-[jump=true]/compare:motion-safe:transition-[clip-path,translate] group-data-[jump=true]/compare:motion-safe:duration-[520ms] group-data-[jump=true]/compare:motion-safe:ease-(--compare-ease)";
  const picture = "absolute inset-0 size-full object-cover select-none transition-opacity duration-700 motion-reduce:transition-none";
  const Grip = vertical ? ChevronsUpDown : ChevronsLeftRight;
  const beforeLabel = labels === false ? undefined : labels.before;
  const afterLabel = labels === false ? undefined : labels.after;
  const pill = cn("pointer-events-none absolute rounded-full bg-black/45 font-medium text-white backdrop-blur-sm select-none", s.label);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: pointer surface for the native range input inside
    <div
      ref={rootRef}
      data-slot="loupe-compare"
      data-orientation={orientation}
      data-jump="false"
      data-dragging="false"
      data-ready={ready}
      data-disabled={disabled || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group/compare relative isolate w-full overflow-hidden rounded-2xl select-none",
        vertical ? "touch-pan-x cursor-row-resize" : "touch-pan-y cursor-col-resize",
        "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60",
        toneStyles[tone],
        className,
      )}
      style={{ aspectRatio: ratio, "--compare": initial, "--compare-ease": SPRING_EASE } as React.CSSProperties}
    >
      {/* The after picture fills the frame; the before one sits on top, clipped to the divider */}
      {/* biome-ignore lint/performance/noImgElement: plain img so the component works outside Next */}
      <img
        ref={afterRef}
        src={after.src}
        alt={after.alt}
        draggable={false}
        onLoad={() => setLoaded((current) => ({ ...current, after: true }))}
        className={cn(picture, ready ? "opacity-100" : "opacity-0", after.className)}
      />
      {/* biome-ignore lint/performance/noImgElement: plain img so the component works outside Next */}
      <img
        ref={beforeRef}
        src={before.src}
        alt={before.alt}
        draggable={false}
        onLoad={() => setLoaded((current) => ({ ...current, before: true }))}
        className={cn(picture, jumpMotion, ready ? "opacity-100" : "opacity-0", before.className)}
        style={{
          clipPath: vertical
            ? "inset(0 0 calc(100% - var(--compare) * 1%) 0)"
            : "inset(0 calc(100% - var(--compare) * 1%) 0 0)",
        }}
      />

      {!ready && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-foreground/5 motion-reduce:animate-none" />}

      {/* Captions fade out as the divider reaches them, so they never sit on the wrong side */}
      {beforeLabel && (
        <span
          aria-hidden="true"
          className={cn(pill, "top-(--pad) left-(--pad) transition-opacity duration-300")}
          style={
            {
              "--pad": `calc(var(--spacing) * ${s.inset})`,
              opacity: ready ? "clamp(0, (var(--compare) - 12) / 14, 1)" : 0,
            } as React.CSSProperties
          }
        >
          {beforeLabel}
        </span>
      )}
      {afterLabel && (
        <span
          aria-hidden="true"
          className={cn(pill, vertical ? "bottom-(--pad) left-(--pad)" : "top-(--pad) right-(--pad)", "transition-opacity duration-300")}
          style={
            {
              "--pad": `calc(var(--spacing) * ${s.inset})`,
              opacity: ready ? "clamp(0, (88 - var(--compare)) / 14, 1)" : 0,
            } as React.CSSProperties
          }
        >
          {afterLabel}
        </span>
      )}

      {/* The divider: a hairline across the frame with a round handle */}
      {/* A full-frame layer moved by its own size, so the percentage is the frame's */}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0", jumpMotion)}
        style={{ translate: vertical ? "0 calc(var(--compare) * 1%)" : "calc(var(--compare) * 1%) 0" }}
      >
        <span className={cn("absolute bg-white/90 shadow-[0_0_6px_rgb(0_0_0/0.35)]", vertical ? "inset-x-0 top-0 h-0.5 -translate-y-1/2" : "inset-y-0 left-0 w-0.5 -translate-x-1/2")} />
        <span
          className={cn(
            "absolute grid place-items-center rounded-full bg-white text-neutral-900 shadow-lg shadow-black/25 ring-1 ring-black/5",
            "transition-[scale] duration-300 group-hover/compare:scale-105 group-data-[dragging=true]/compare:scale-110",
            vertical ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" : "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
            s.handle,
          )}
          style={{ transitionTimingFunction: SPRING_EASE }}
        >
          <Grip className={s.icon} />
        </span>
      </div>

      {/* The real control: role, value, keyboard and assistive technology all live here */}
      <input
        ref={inputRef}
        type="range"
        className="sr-only"
        min={0}
        max={100}
        step={1}
        defaultValue={String(Math.round(initial))}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-orientation={orientation}
        onKeyDown={(event) => {
          // Page keys take a tenth; on a vertical divider, up moves it up rather than raising the value
          const steps: Record<string, number> = { PageUp: 10, PageDown: -10 };
          if (vertical) Object.assign(steps, { ArrowUp: -1, ArrowDown: 1 });
          const step = steps[event.key];
          if (step === undefined) return;
          event.preventDefault();
          const next = set(position.current + step, true);
          callbacks.current.onValueCommit?.(next);
        }}
        onChange={(event) => callbacks.current.onValueCommit?.(set(Number(event.currentTarget.value), true))}
      />
    </div>
  );
}
