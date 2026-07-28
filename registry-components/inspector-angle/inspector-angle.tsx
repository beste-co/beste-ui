"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent hover:border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

const FULL_TURN = 360;
/** Multiplier applied to a key press while Shift is held. */
const COARSE_FACTOR = 10;

function wrap(angle: number) {
  return ((angle % FULL_TURN) + FULL_TURN) % FULL_TURN;
}

interface InspectorAngleProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /**
   * Controlled angle in degrees, measured the way CSS measures a gradient: zero
   * points up, and the value grows clockwise. Values wrap, so 370 is 10.
   */
  value?: number;
  /** Initial angle in uncontrolled mode. */
  defaultValue?: number;
  /** Fires on every frame of a drag, and on every key press. */
  onValueChange?: (value: number) => void;
  /**
   * Fires once a change is finished — the dial released, a key released. Use it
   * for work too expensive to run per frame.
   */
  onValueCommit?: (value: number) => void;

  /**
   * Smallest increment a key press moves.
   * @defaultValue 1 */
  step?: number;
  /**
   * Degrees the dial snaps to while Shift is held during a drag.
   * @defaultValue 15 */
  snapStep?: number;

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

  /** Name of the underlying range input, so the row can take part in a form. */
  name?: string;
  /** Id of the underlying range input, for an external `<label htmlFor>`. */
  id?: string;
  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorAngleDemo: InspectorAngleProps = {
  label: "Angle",
  className: "w-72",
  defaultValue: 135,
};

export function InspectorAngle({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  step = 1,
  snapStep = 15,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorAngleProps) {
  const [internalValue, setInternalValue] = React.useState(() => wrap(defaultValue ?? 0));
  const angle = wrap(valueProp ?? internalValue);

  const dialRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const angleRef = React.useRef(angle);
  angleRef.current = angle;
  /** Last angle handed to `onValueCommit`. */
  const committedRef = React.useRef(angle);
  const draggingRef = React.useRef(false);
  const frameRef = React.useRef(0);
  const pendingRef = React.useRef({ x: 0, y: 0, snap: false });

  const apply = (next: number) => {
    const wrapped = wrap(next);
    if (wrapped === angleRef.current) return;
    angleRef.current = wrapped;
    if (valueProp === undefined) setInternalValue(wrapped);
    onValueChange?.(wrapped);
  };

  const commit = () => {
    if (angleRef.current === committedRef.current) return;
    committedRef.current = angleRef.current;
    onValueCommit?.(angleRef.current);
  };

  /* ---------------------------------------------------------------- drag -- */

  const runFrame = React.useCallback(() => {
    frameRef.current = 0;
    const dial = dialRef.current;
    if (!dial) return;

    const rect = dial.getBoundingClientRect();
    const { x, y, snap } = pendingRef.current;
    const dx = x - (rect.left + rect.width / 2);
    const dy = y - (rect.top + rect.height / 2);

    // Zero points up and the value grows clockwise, which is what CSS means by an
    // angle — the main thing an angle here ends up feeding.
    const degrees = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const snapped = snap && snapStep > 0 ? Math.round(degrees / snapStep) * snapStep : degrees;
    apply(Math.round(snapped * 10) / 10);
  }, [snapStep]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    dialRef.current?.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    inputRef.current?.focus({ preventScroll: true });
    pendingRef.current = { x: event.clientX, y: event.clientY, snap: event.shiftKey };
    runFrame();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    pendingRef.current = { x: event.clientX, y: event.clientY, snap: event.shiftKey };
    // One update per frame, however many pointer events arrive.
    if (!frameRef.current) frameRef.current = requestAnimationFrame(runFrame);
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    commit();
  };

  React.useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /* ------------------------------------------------------------ keyboard -- */

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const amount = step * (event.shiftKey ? COARSE_FACTOR : 1);
    let next: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = angleRef.current + amount;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = angleRef.current - amount;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = FULL_TURN - step;
        break;
      case "PageUp":
        next = angleRef.current + (snapStep || amount);
        break;
      case "PageDown":
        next = angleRef.current - (snapStep || amount);
        break;
      default:
        return;
    }

    event.preventDefault();
    apply(next);
  };

  return (
    <div
      data-slot="inspector-angle"
      data-disabled={disabled}
      className={cn(
        "group/inspector-angle flex items-center gap-2",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      <label
        htmlFor={id}
        data-slot="inspector-angle-label"
        className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </label>

      <span
        data-slot="inspector-angle-value"
        className="ml-auto shrink-0 font-mono text-sm font-medium tabular-nums text-foreground select-none"
      >
        {`${Math.round(angle)}°`}
      </span>

      {/*
        The dial is the pointer surface, and dragging it sets the angle from where
        the pointer sits relative to its centre — the gesture an angle actually has.
        The accessible control is the range input beside it, which is why this
        carries no widget role of its own.
      */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer surface for the range input beside it */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pointer surface for the range input beside it */}
      <div
        ref={dialRef}
        data-slot="inspector-angle-dial"
        aria-hidden="true"
        className={cn(
          "relative size-5 shrink-0 cursor-grab touch-none rounded-full",
          "border border-border bg-background active:cursor-grabbing",
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/*
          A needle from the centre out, rotated. Turning the whole layer keeps the
          maths to one transform and stays on the compositor.
        */}
        <span
          className="absolute inset-0 flex justify-center"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <span className="h-1/2 w-px rounded-full bg-foreground" />
        </span>
        <span className="absolute inset-0 m-auto size-1 rounded-full bg-foreground" />
      </div>

      {/*
        A native range carries the role, the value and the keyboard, and takes part
        in a form. Its own key handling is taken over so Shift and Page steps read
        in degrees.
      */}
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="range"
        className="sr-only"
        min={0}
        max={FULL_TURN}
        step={step}
        value={angle}
        disabled={disabled}
        aria-label={ariaLabel ?? label}
        aria-valuetext={`${Math.round(angle)} degrees`}
        onChange={(event) => apply(event.currentTarget.valueAsNumber)}
        onKeyDown={handleKeyDown}
        onKeyUp={commit}
      />
    </div>
  );
}
