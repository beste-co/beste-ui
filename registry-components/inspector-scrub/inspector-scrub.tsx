"use client";

import { type LucideIcon, MoveHorizontalIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** The row is the track, so it answers hover the way inspector-slider's does. */
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

/** Anything but a digit, a separator or a sign has no business in a number. */
const NON_NUMERIC = /[^0-9.,-]/g;

interface InspectorScrubProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: number;
  /** Initial value in uncontrolled mode. */
  defaultValue?: number;
  /** Fires on every change, including each step of a drag. */
  onValueChange?: (value: number) => void;
  /** Fires when a drag ends or an edit is committed. */
  onValueCommit?: (value: number) => void;

  /**
   * Hard bounds, both optional, which is the point of this row. A z-index, an X
   * offset or a letter-spacing has no honest maximum, and a slider that invents one
   * is a slider whose whole range is a lie. What is given here the value is held to.
   */
  min?: number;
  max?: number;
  /**
   * The range the **bar** is drawn against, which the value is free to leave. It is
   * how an endless number gets a picture: the fill shows where the value sits in the
   * span you would usually be working in, pins at the end once it is past that, and
   * the number keeps going. Give both or neither.
   *
   * Falls back to `min` and `max`, so a row with hard bounds already looks like a
   * slider, and a row with none has no bar at all rather than a made-up one.
   */
  softMin?: number;
  softMax?: number;
  /**
   * What one step of the drag is worth, and what the arrows move by.
   * @defaultValue 1 */
  step?: number;
  /**
   * How many decimals the reported value keeps.
   * @defaultValue 2 */
  precision?: number;
  /**
   * Pixels of drag per step. Lower is faster; the default asks for four pixels a
   * step, which is quick enough to cross a range and slow enough to land on a
   * number.
   * @defaultValue 4 */
  sensitivity?: number;
  /** Printed after the number, e.g. `px`, `%`, `em`. */
  suffix?: string;

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

  /** Name of the field, so the row can take part in a form. */
  name?: string;
  /** Id of the field, for an external `<label htmlFor>`. */
  id?: string;
  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorScrubDemo: InspectorScrubProps = {
  label: "Letter spacing",
  className: "w-72",
  defaultValue: 0,
  step: 0.01,
  precision: 2,
  suffix: "em",
  sensitivity: 8,
  // The span worth working in, not a limit: letter-spacing lives between these two
  // and is free to leave, which is what the bar is drawn against.
  softMin: -0.1,
  softMax: 0.4,
};

/**
 * A number with no ends, dragged from its own label.
 *
 * inspector-slider needs a range to be a slider and inspector-stepper needs a press
 * per step; neither is right for the values that have no maximum worth naming — a
 * z-index, an X offset, a letter-spacing, a line-height. Those are the ones a
 * design tool lets you scrub: press the label, pull sideways, and the number runs
 * with you.
 *
 * The label is the handle rather than the number, which reads backwards until you
 * try it: the number is the thing being read while it changes, and putting the
 * cursor on top of it is putting your hand over the readout.
 */
export function InspectorScrub({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min,
  max,
  softMin,
  softMax,
  step = 1,
  precision = 2,
  sensitivity = 4,
  suffix = "",
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorScrubProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? 0);
  const value = valueProp ?? internalValue;

  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  const valueRef = React.useRef(value);
  valueRef.current = value;

  const [dragging, setDragging] = React.useState(false);
  /** What is in the field while it is being typed in, if anything. */
  const [draft, setDraft] = React.useState<string | null>(null);

  const round = React.useCallback(
    (raw: number) => {
      const factor = 10 ** precision;
      return Math.round(raw * factor) / factor;
    },
    [precision],
  );

  const clamp = React.useCallback(
    (raw: number) => {
      let next = raw;
      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);
      return next;
    },
    [max, min],
  );

  const write = (raw: number, complete: boolean) => {
    const next = round(clamp(raw));
    if (next !== valueRef.current) {
      valueRef.current = next;
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    }
    if (complete) onValueCommit?.(valueRef.current);
  };

  /*
   * The drag keeps its own continuous position and only the reported value is
   * quantized, which is the family's rule for every draggable row: the pointer must
   * not feel like it is fighting the grid, and a value that jumps a step for every
   * two pixels reads as a fault rather than as precision.
   */
  const drag = React.useRef({ x: 0, raw: 0 });

  /*
   * The bar, when there is a span to draw it against.
   *
   * This is the whole answer to what a slider does with a number that has no ends:
   * the fill is drawn against a range the value may leave, so it is a picture of
   * "where you usually are" rather than a claim about what the value can be. Past
   * either end it pins, and the number goes on alone. With no span given there is no
   * bar, because a bar over an unknown range would have to invent one.
   */
  const spanFrom = softMin ?? min;
  const spanTo = softMax ?? max;
  const hasBar = spanFrom !== undefined && spanTo !== undefined && spanTo > spanFrom;
  const fraction = hasBar
    ? Math.min(1, Math.max(0, (value - spanFrom) / (spanTo - spanFrom)))
    : 0;
  /** Past the end the fill has nothing left to say, so the row says it instead. */
  const beyond = hasBar && (value > spanTo || value < spanFrom);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled || event.button !== 0) return;
    /*
     * The field is the one part of the row that does not drag. Everywhere else is
     * the track, but a press on a text field has to put a caret in it, and a number
     * you can drag but not click into is a number you cannot type.
     */
    if (event.target instanceof HTMLInputElement) return;
    /*
     * No `preventDefault` here on purpose: it would stop the label doing the one
     * thing a label does, and a press that does not travel has to still put the
     * caret in the field. Dragging cannot select text anyway, since every static
     * string in the family is `select-none`.
     */
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, raw: valueRef.current };
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!dragging) return;
    // Read the modifiers off the live event, not off the press: a reader reaches
    // for Shift halfway through a drag, once they can see they are overshooting.
    const factor = event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
    const travelled = (event.clientX - drag.current.x) / Math.max(sensitivity, 1);
    write(drag.current.raw + travelled * step * factor, false);
  };

  const endDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!dragging) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
    onValueCommit?.(valueRef.current);
  };

  const acceptDraft = () => {
    if (draft === null) return;
    const parsed = Number.parseFloat(draft.replace(",", "."));
    setDraft(null);
    if (Number.isNaN(parsed)) return;
    write(parsed, true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      acceptDraft();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setDraft(null);
      return;
    }
    const factor = event.shiftKey ? 10 : 1;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setDraft(null);
      write(valueRef.current + step * factor, true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setDraft(null);
      write(valueRef.current - step * factor, true);
    }
  };

  return (
    /*
     * The row is the track, as it is in inspector-slider: a press anywhere on it but
     * the field starts a drag, and the whole surface answers hover, so there is
     * nothing to find before the gesture is available.
     *
     * What it does not borrow from the slider is the mapping. A slider is positional
     * — where you press *is* the value — which only works when the ends are known.
     * Here the drag is relative: it moves the number by how far the pointer travels,
     * so pressing the middle of the row does not throw the value at the middle of a
     * range that does not exist.
     */
    <div
      data-slot="inspector-scrub"
      data-disabled={disabled}
      data-dragging={dragging || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        "group/inspector-scrub relative flex items-center gap-2 overflow-hidden",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)] transition-colors",
        "cursor-ew-resize touch-none",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        dragging && "bg-muted-foreground/15",
        className,
      )}
    >
      {/*
        The fill. Pinned at the end rather than clipped: once the value is past the
        soft range there is nothing left for the bar to say, and the number beside it
        is the one still moving. The border marks that moment, so a bar sitting at
        full does not read the same as a value that merely reached the top.
      */}
      {hasBar ? (
        <span
          aria-hidden="true"
          data-slot="inspector-scrub-fill"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 bg-foreground/10",
            beyond && "border-r-2 border-foreground/30",
          )}
          style={{ width: `${fraction * 100}%` }}
        />
      ) : null}

      {/*
        Still a `<label>`, so a press that does not travel puts the caret in the field
        and the visible text is the accessible name. It is no longer the only thing
        that drags, but it is the thing that says the row does.
      */}
      <label
        htmlFor={fieldId}
        data-slot="inspector-scrub-label"
        className={cn(
          "relative flex min-w-0 flex-1 items-center gap-1.5",
          "text-sm font-medium transition-colors select-none",
          "cursor-ew-resize",
          dragging ? "text-foreground" : "text-foreground/70 group-hover/inspector-scrub:text-foreground",
        )}
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>

        {/*
          What to do with the row, in a slot it already occupies: always in the flow
          and only ever faded, so nothing jumps sideways the moment a pointer arrives.
        */}
        <MoveHorizontalIcon
          aria-hidden="true"
          data-slot="inspector-scrub-grip"
          className={cn(
            "size-3.5 shrink-0 transition-opacity",
            dragging ? "opacity-100" : "opacity-0 group-hover/inspector-scrub:opacity-100",
          )}
        />
      </label>

      <input
        id={fieldId}
        name={name}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        role="spinbutton"
        aria-label={ariaLabel ?? label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={suffix ? `${value}${suffix}` : undefined}
        value={draft ?? String(value)}
        disabled={disabled}
        onChange={(event) => setDraft(event.target.value.replace(NON_NUMERIC, ""))}
        onBlur={acceptDraft}
        onKeyDown={handleKeyDown}
        data-slot="inspector-scrub-value"
        className={cn(
          // `relative` to sit over the fill, and its own cursor: this is the one
          // part of the row that takes a caret rather than a drag.
          "relative w-16 shrink-0 cursor-text bg-transparent",
          "text-right font-mono text-sm font-medium tabular-nums",
          "text-foreground outline-none",
        )}
      />

      {suffix ? (
        <span
          data-slot="inspector-scrub-suffix"
          className="relative shrink-0 text-sm font-medium text-foreground/70 select-none"
        >
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
