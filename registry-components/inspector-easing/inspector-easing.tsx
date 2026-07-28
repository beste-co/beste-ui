"use client";

import { CheckIcon, CopyIcon, type LucideIcon } from "lucide-react";
import * as React from "react";
import { InspectorSelect } from "@/components/beste/component/inspector-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** The row itself presses, so it answers hover like any other trigger in the family. */
const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted hover:bg-muted-foreground/15",
  outline: "border border-border hover:bg-muted",
  ghost: "border border-transparent hover:border-border hover:bg-muted",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

/** The four numbers `cubic-bezier()` takes, in its order. */
type EasingValue = [number, number, number, number];

interface EasingPreset {
  value: EasingValue;
  label: string;
}

/**
 * The presets: the five CSS keywords, then the two shapes people reach for that
 * CSS has no word for. The last two leave the 0..1 band on purpose, which is what
 * the extra room above and below the box is for.
 */
const PRESETS: EasingPreset[] = [
  { label: "Linear", value: [0, 0, 1, 1] },
  { label: "Ease", value: [0.25, 0.1, 0.25, 1] },
  { label: "Ease in", value: [0.42, 0, 1, 1] },
  { label: "Ease out", value: [0, 0, 0.58, 1] },
  { label: "Ease in out", value: [0.42, 0, 0.58, 1] },
  { label: "Back out", value: [0.34, 1.56, 0.64, 1] },
  { label: "Anticipate", value: [0.68, -0.55, 0.27, 1.55] },
];

const DEFAULT_VALUE: EasingValue = [0.25, 0.1, 0.25, 1];

/** How far past 0 and 1 a control point may reach. */
const OVERSHOOT = 0.6;
/** Smallest increment a key press moves. */
const STEP = 0.01;
/** Multiplier applied to a key press while Shift is held. */
const COARSE_FACTOR = 10;
/** Handle diameter in px. Mirrors the `size-3` utility on the handle elements. */
const HANDLE_SIZE = 12;
/** Distance the preview keeps from each end, in px, as room for an overshoot. */
const PREVIEW_INSET = 24;
/** How long one run of the preview takes, in ms. */
const PREVIEW_DURATION = 1400;
/** How long the copy button stays ticked, in ms. */
const COPIED_MS = 1400;
/** Pause between runs, in ms. */
const PREVIEW_REST = 350;

function clamp(value: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, value));
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function same(a: EasingValue, b: EasingValue) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/** One axis of a cubic bezier whose first and last points are 0 and 1. */
function bezier(t: number, p1: number, p2: number) {
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * p1 + 3 * inverse * t * t * p2 + t * t * t;
}

function bezierSlope(t: number, p1: number, p2: number) {
  const inverse = 1 - t;
  return (
    3 * inverse * inverse * p1 +
    6 * inverse * t * (p2 - p1) +
    3 * t * t * (1 - p2)
  );
}

/**
 * The progress this curve reports at a moment in time. `cubic-bezier` is a
 * parametric curve, so the moment has to be solved for before it can be read:
 * Newton-Raphson converges in a handful of steps, and bisection covers the flat
 * stretches where the slope is too small to trust.
 *
 * This is what CSS itself does with the same four numbers, which is the only way
 * the preview below can be the same motion the value describes rather than an
 * impression of it.
 */
function progressAt(time: number, [x1, y1, x2, y2]: EasingValue) {
  if (time <= 0) return 0;
  if (time >= 1) return 1;

  let t = time;
  for (let step = 0; step < 8; step++) {
    const error = bezier(t, x1, x2) - time;
    if (Math.abs(error) < 1e-6) return bezier(t, y1, y2);
    const slope = bezierSlope(t, x1, x2);
    if (Math.abs(slope) < 1e-6) break;
    t -= error / slope;
  }

  let lo = 0;
  let hi = 1;
  t = time;
  for (let step = 0; step < 24; step++) {
    const at = bezier(t, x1, x2);
    if (Math.abs(at - time) < 1e-6) break;
    if (at > time) hi = t;
    else lo = t;
    t = (lo + hi) / 2;
  }
  return bezier(t, y1, y2);
}

/** The curve as an SVG path in a 0..1 box, with y measured downwards. */
function curvePath([x1, y1, x2, y2]: EasingValue) {
  return `M 0 1 C ${x1} ${1 - y1} ${x2} ${1 - y2} 1 0`;
}

interface InspectorEasingProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: EasingValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: EasingValue;
  /** Fires on every frame of a drag, and on every key press. */
  onValueChange?: (value: EasingValue) => void;
  /**
   * Fires once a change is finished — a handle released, a preset chosen. Use it
   * for work too expensive to run per frame.
   */
  onValueCommit?: (value: EasingValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Which presets to offer. Pass an empty list to drop the menu and leave only
   * the curve.
   * @defaultValue the five CSS keywords plus two overshooting shapes */
  presets?: EasingPreset[];
  /** Drop the strip that runs the motion under the curve. */
  hidePreview?: boolean;

  /** Block interaction and dim the row. */
  disabled?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare until hover.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Row height preset.
   * @defaultValue "default" */
  size?: Size;

  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorEasingDemo: InspectorEasingProps = {
  label: "Easing",
  className: "w-72",
  defaultValue: [0.34, 1.56, 0.64, 1],
};

export function InspectorEasing({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOpenChange,
  presets = PRESETS,
  hidePreview = false,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorEasingProps) {
  const [internalValue, setInternalValue] = React.useState<EasingValue>(
    defaultValue ?? DEFAULT_VALUE,
  );
  const value = valueProp ?? internalValue;

  const valueRef = React.useRef(value);
  valueRef.current = value;
  const committedRef = React.useRef(value);

  const gridRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{ point: 1 | 2; pointerId: number } | null>(null);
  const frameRef = React.useRef(0);
  const pendingRef = React.useRef({ x: 0, y: 0 });

  const apply = (next: EasingValue, complete: boolean) => {
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete) {
      committedRef.current = next;
      onValueCommit?.(next);
    }
  };

  const commit = () => {
    if (same(valueRef.current, committedRef.current)) return;
    committedRef.current = valueRef.current;
    onValueCommit?.(valueRef.current);
  };

  const setPoint = (point: 1 | 2, x: number, y: number, complete: boolean) => {
    const next = [...valueRef.current] as EasingValue;
    // Time only runs forwards, so a control point's x stays inside the run; its y
    // may leave it, which is exactly what an overshoot is.
    next[point === 1 ? 0 : 2] = round(clamp(x, 0, 1));
    next[point === 1 ? 1 : 3] = round(clamp(y, -OVERSHOOT, 1 + OVERSHOOT));
    apply(next, complete);
  };

  /* ---------------------------------------------------------------- drag -- */

  /* Deliberately not memoised, for the same reason inspector-gradient's is not. */
  const runFrame = () => {
    frameRef.current = 0;
    const drag = dragRef.current;
    const grid = gridRef.current;
    if (!drag || !grid) return;

    const rect = grid.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (pendingRef.current.x - rect.left) / rect.width;
    // The box holds the overshoot band above and below the run, so the reachable
    // y is wider than the grid's own 0..1.
    const span = 1 + OVERSHOOT * 2;
    const y = 1 + OVERSHOOT - ((pendingRef.current.y - rect.top) / rect.height) * span;
    setPoint(drag.point, x, y, false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>, point: 1 | 2) => {
    if (disabled || event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
    dragRef.current = { point, pointerId: event.pointerId };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    pendingRef.current = { x: event.clientX, y: event.clientY };
    // One update per frame, however many pointer events arrive.
    if (!frameRef.current) frameRef.current = requestAnimationFrame(runFrame);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    commit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, point: 1 | 2) => {
    if (disabled) return;
    const amount = STEP * (event.shiftKey ? COARSE_FACTOR : 1);
    const current = valueRef.current;
    const x = point === 1 ? current[0] : current[2];
    const y = point === 1 ? current[1] : current[3];

    switch (event.key) {
      case "ArrowRight":
        setPoint(point, x + amount, y, true);
        break;
      case "ArrowLeft":
        setPoint(point, x - amount, y, true);
        break;
      case "ArrowUp":
        setPoint(point, x, y + amount, true);
        break;
      case "ArrowDown":
        setPoint(point, x, y - amount, true);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  React.useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /* ------------------------------------------------------------- preview -- */

  /*
   * The run is moved by hand rather than by a CSS animation: the same solver that
   * draws the curve places it, so what plays is the value itself, and a changed
   * curve takes effect on the next frame instead of on the next loop.
   *
   * Two numbers go out each frame, written to the panel so everything below it can
   * read them by inheritance: `--inspector-easing-t` is where the run is in time,
   * `--inspector-easing-run` is how far along it has got. Time is the honest half
   * of the pair, and having it is what lets the strip show a plain linear dot for
   * comparison and the curve show where on itself the motion currently is. Custom
   * properties, so a run costs no renders at all.
   */
  const [previewOn, setPreviewOn] = React.useState(false);

  const publish = (time: number, progress: number) => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.style.setProperty("--inspector-easing-t", String(time));
    panel.style.setProperty("--inspector-easing-run", String(progress));
  };

  React.useEffect(() => {
    if (!previewOn || hidePreview) return;
    if (typeof window === "undefined") return;

    // Reduced motion gets the finished state rather than a dead strip: the trail
    // full and both dots at the end says what the range is without moving.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      publish(1, 1);
      return;
    }

    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) % (PREVIEW_DURATION + PREVIEW_REST);
      const time = clamp(elapsed / PREVIEW_DURATION, 0, 1);
      publish(time, progressAt(time, valueRef.current));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [previewOn, hidePreview]);

  /* ---------------------------------------------------------------- render -- */

  const [x1, y1, x2, y2] = value;
  const matched = presets.find((preset) => same(preset.value, value));
  const css = `cubic-bezier(${value.map((part) => part.toFixed(2)).join(", ")})`;

  /*
   * Copying reports back rather than assuming: the tick only appears once the
   * clipboard has actually taken the string, since a browser may refuse it and a
   * tick that lied would be worse than no tick.
   */
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPIED_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
    } catch {
      // No clipboard, or permission refused. The value is on screen either way.
    }
  };

  /** Where a control point sits in the box, as a percentage of it. */
  const box = (x: number, y: number) => ({
    left: `${x * 100}%`,
    top: `${((1 + OVERSHOOT - y) / (1 + OVERSHOOT * 2)) * 100}%`,
  });

  const handle = (point: 1 | 2) => {
    const x = point === 1 ? x1 : x2;
    const y = point === 1 ? y1 : y2;

    return (
      <button
        type="button"
        disabled={disabled}
        aria-label={`Control point ${point}, x ${x.toFixed(2)}, y ${y.toFixed(2)}`}
        data-slot="inspector-easing-handle"
        onPointerDown={(event) => handlePointerDown(event, point)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(event) => handleKeyDown(event, point)}
        className={cn(
          "absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
          "cursor-grab touch-none border-2 border-background bg-foreground shadow-md",
          "outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring",
          // The grab area reaches past the dot, which is small on purpose: it has
          // to sit exactly on a curve to be read against it.
          "before:absolute before:-inset-2 before:rounded-full before:content-['']",
        )}
        style={box(x, y)}
      />
    );
  };

  return (
    <Popover
      onOpenChange={(open) => {
        // The preview only runs while it is on screen.
        setPreviewOn(open);
        onOpenChange?.(open);
      }}
    >
      {/*
        The row is the trigger, so the editor can take the trigger width and open
        flush with it. The row draws the curve small: a name tells a reader which
        preset this is, and the shape tells them what it does.
      */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-easing"
          data-disabled={disabled}
          className={cn(
            "group/inspector-easing flex w-full cursor-pointer items-center gap-2 text-left",
            "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
            "[--inspector-radius:var(--radius-xl)] transition-colors",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
            sizeStyles[size],
            toneStyles[tone],
            className,
          )}
        >
          <span
            data-slot="inspector-easing-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span className="ml-auto flex min-w-0 items-center gap-2">
            <span
              data-slot="inspector-easing-value"
              className="truncate text-sm font-medium text-foreground select-none"
            >
              {matched?.label ?? "Custom"}
            </span>
            {/*
              A sparkline of the same curve. The viewBox is the overshoot band, so a
              shape that leaves the run still fits inside the glyph.
            */}
            <svg
              aria-hidden="true"
              viewBox={`0 ${-OVERSHOOT} 1 ${1 + OVERSHOOT * 2}`}
              preserveAspectRatio="none"
              data-slot="inspector-easing-spark"
              className="h-5 w-8 shrink-0 rounded-sm border border-border bg-background"
            >
              <path
                d={curvePath(value)}
                fill="none"
                stroke="currentColor"
                strokeWidth={0.06}
                vectorEffect="non-scaling-stroke"
                className="text-foreground"
              />
            </svg>
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-2"
      >
        {/*
          The curve, drawn in a box taller than the run so an overshoot has room to
          be seen rather than clipped. The band outside 0..1 is tinted, which is
          how a reader knows the curve has left it.
        */}
        <div
          ref={panelRef}
          className={cn(
            "overflow-hidden rounded-md border border-border bg-background",
            // Where the run rests when nothing is playing.
            "[--inspector-easing-run:0] [--inspector-easing-t:0]",
          )}
        >
          <div
            data-slot="inspector-easing-grid"
            className="relative aspect-square w-full"
          >
            {/*
              Everything is drawn inside an area inset by half a handle, which is the
              same reason the gradient ramp and the position pad inset theirs: a
              control point at 0 or 1 sits *on* the edge of the run, and without the
              margin its dot would be cut in half by the box. The pointer is read
              against this element too, so what is measured is what is drawn.
            */}
            <div ref={gridRef} className="absolute" style={{ inset: HANDLE_SIZE / 2 }}>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bg-muted/60"
                style={{ top: 0, height: `${(OVERSHOOT / (1 + OVERSHOOT * 2)) * 100}%` }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bg-muted/60"
                style={{ bottom: 0, height: `${(OVERSHOOT / (1 + OVERSHOOT * 2)) * 100}%` }}
              />

              <svg
                aria-hidden="true"
                viewBox={`0 ${-OVERSHOOT} 1 ${1 + OVERSHOOT * 2}`}
                preserveAspectRatio="none"
                className="absolute inset-0 size-full"
              >
                {/* The handles' arms, from each end of the run to its control point. */}
                <path
                  d={`M 0 1 L ${x1} ${1 - y1}`}
                  stroke="currentColor"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  className="text-muted-foreground/50"
                />
                <path
                  d={`M 1 0 L ${x2} ${1 - y2}`}
                  stroke="currentColor"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  className="text-muted-foreground/50"
                />
                <path
                  d={curvePath(value)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  className="text-foreground"
                />
              </svg>

              {/* The ends of the run are fixed at 0,0 and 1,1 and only mark themselves. */}
              <span
                aria-hidden="true"
                className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground"
                style={box(0, 0)}
              />
              <span
                aria-hidden="true"
                className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground"
                style={box(1, 1)}
              />

              {/*
                The same moment, on the curve. Time across, progress up, which is a
                point on the path by definition: it ties the dot below to the shape
                above, so the strip stops being a separate thing that merely agrees
                with the curve. Kept out of the pointer's way, since it crosses the
                handles.
              */}
              {previewOn && !hidePreview ? (
                <span
                  aria-hidden="true"
                  data-slot="inspector-easing-marker"
                  className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/70 ring-2 ring-background"
                  style={{
                    left: "calc(var(--inspector-easing-t) * 100%)",
                    top: `calc((${1 + OVERSHOOT} - var(--inspector-easing-run)) / ${1 + OVERSHOOT * 2} * 100%)`,
                  }}
                />
              ) : null}

              {handle(1)}
              {handle(2)}
            </div>
          </div>

          {/*
            The motion itself, because a curve can be read but only a thing moving
            on it shows what the reader is choosing. It sits on the bottom edge of
            the same panel rather than floating under it: this is the curve
            happening, not a second thing to look at, and a gap between the two
            would have said otherwise.
          */}
          {hidePreview ? null : (
            <div
              aria-hidden="true"
              data-slot="inspector-easing-preview"
              className="relative h-6 w-full border-t border-border bg-muted"
            >
              {/*
                The run is inset from both ends, so a curve that overshoots has
                somewhere to overshoot into instead of being clipped at the wall.

                The ground it covers comes first: an overshoot shows here as the
                trail reaching past the end and coming back.
              */}
              <span
                className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-foreground/15"
                style={{
                  left: `${PREVIEW_INSET}px`,
                  width: `calc(var(--inspector-easing-run) * (100% - ${PREVIEW_INSET * 2}px))`,
                }}
              />

              {/*
                A plain linear dot, covering the same distance in the same time. On
                its own an eased dot is just a dot moving; against this one the ease
                is the distance between the two, which is the thing being chosen.
                They meet at both ends, where the ring closes over the dot.
              */}
              <span
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-muted-foreground/40"
                style={{
                  left: `calc(${PREVIEW_INSET}px + var(--inspector-easing-t) * (100% - ${PREVIEW_INSET * 2}px))`,
                }}
              />

              <span
                data-slot="inspector-easing-run"
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
                style={{
                  left: `calc(${PREVIEW_INSET}px + var(--inspector-easing-run) * (100% - ${PREVIEW_INSET * 2}px))`,
                }}
              />
            </div>
          )}
        </div>

        {presets.length > 0 ? (
          <div className="mt-2 flex flex-col gap-1">
            <InspectorSelect
              label="Preset"
              size="sm"
              placeholder="Custom"
              options={presets.map((preset) => ({
                value: preset.label,
                label: preset.label,
              }))}
              value={matched?.label ?? ""}
              onValueChange={(next) => {
                const preset = presets.find((entry) => entry.label === next);
                if (preset) apply(preset.value, true);
              }}
            />
          </div>
        ) : null}

        {/*
          The value as CSS takes it, and a way to take it: the button only appears
          on hover, since it is an offer rather than a step, but it comes back for
          focus so the keyboard is not left without it.
        */}
        <div className="group/inspector-easing-css mt-2 flex items-center gap-1 border-t border-border pt-2">
          <span
            data-slot="inspector-easing-css"
            className="min-w-0 flex-1 truncate text-sm text-foreground/70 select-none"
          >
            {css}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
            title={copied ? "Copied" : "Copy"}
            data-slot="inspector-easing-copy"
            className={cn(
              "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md",
              "text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground",
              "opacity-0 outline-none group-hover/inspector-easing-css:opacity-100 focus-visible:opacity-100",
              "focus-visible:ring-2 focus-visible:ring-ring/50",
              // Once it has done its job it stays put, so the mark that says so is
              // not pulled out from under the pointer.
              copied && "opacity-100",
            )}
          >
            {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
