"use client";

import { LinkIcon, type LucideIcon, Unlink2Icon } from "lucide-react";
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

/** Anything but a digit, a separator or a sign has no business in a length. */
const NON_NUMERIC = /[^0-9.,-]/g;

/** A box: the two numbers that give it a size. */
interface Dimensions {
  width?: number;
  height?: number;
}

interface InspectorDimensionsProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: Dimensions;
  /** Initial value in uncontrolled mode. */
  defaultValue?: Dimensions;
  /** Fires on every accepted edit. */
  onValueChange?: (value: Dimensions) => void;
  /** Fires once an edit is finished — the field left, or Enter pressed. */
  onValueCommit?: (value: Dimensions) => void;

  /**
   * Range both numbers answer to.
   * @defaultValue 0 to 9999, in steps of 1 */
  min?: number;
  max?: number;
  step?: number;
  /**
   * How many decimals a value keeps, which matters here because a locked edit
   * divides.
   * @defaultValue 2 */
  precision?: number;
  /**
   * Unit printed after the pair, once, since both numbers are in it.
   * @defaultValue "px" */
  suffix?: string;

  /**
   * Whether the two are tied together. Pair it with `onLockedChange`. While they
   * are, editing one scales the other by the ratio they had when the lock closed.
   */
  locked?: boolean;
  /** Initial lock state in uncontrolled mode. */
  defaultLocked?: boolean;
  onLockedChange?: (locked: boolean) => void;
  /** Take the lock away, for a pair whose numbers are genuinely unrelated. */
  lockable?: boolean;

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

  /** Name of the fields, so the pair can take part in a form. */
  name?: string;
  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorDimensionsDemo: InspectorDimensionsProps = {
  label: "Size",
  className: "w-72",
  defaultValue: { width: 1280, height: 720 },
  defaultLocked: true,
  // Whole pixels. The default of two decimals is right for a pair in the abstract and
  // wrong for this one: with the lock closed, every edit divides, so a demo at the
  // default reads back "1160.28 px" — a width nobody would type.
  precision: 0,
};

/**
 * Width and height, and the lock between them.
 *
 * The family had one number (inspector-unit), four (inspector-spacing) and a
 * ratio (inspector-aspect), but not the pair — which is the row a canvas, an
 * image or a section is sized with, and the one every panel was hand-building out
 * of two fields and a handler that kept them in step.
 *
 * The ratio is captured when the lock closes rather than read live, so a pair
 * scaled down and back up lands on the numbers it started from instead of drifting
 * a pixel per edit.
 */
export function InspectorDimensions({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 9999,
  step = 1,
  precision = 2,
  suffix = "px",
  locked: lockedProp,
  defaultLocked = false,
  onLockedChange,
  lockable = true,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  className,
  "aria-label": ariaLabel,
}: InspectorDimensionsProps) {
  const [internalValue, setInternalValue] = React.useState<Dimensions>(
    defaultValue ?? { width: min, height: min },
  );
  const value = valueProp ?? internalValue;

  const [internalLocked, setInternalLocked] = React.useState(defaultLocked);
  const locked = lockable && (lockedProp ?? internalLocked);

  const valueRef = React.useRef(value);
  valueRef.current = value;

  const widthId = React.useId();
  const heightId = React.useId();

  const round = React.useCallback(
    (raw: number) => {
      const factor = 10 ** precision;
      return Math.round(raw * factor) / factor;
    },
    [precision],
  );

  const clamp = React.useCallback(
    (raw: number) => Math.min(max, Math.max(min, raw)),
    [max, min],
  );

  /*
   * The ratio the lock is holding. A ref rather than state: nothing renders from
   * it, and reading it live off the current pair would mean each locked edit
   * measured a box the previous locked edit had already rounded.
   */
  const ratioRef = React.useRef(1);
  const captureRatio = React.useCallback(() => {
    const { width, height } = valueRef.current;
    ratioRef.current = width && height ? width / height : 1;
  }, []);

  // The pair may already be locked on the first render, and it may be handed a
  // different pair before the first edit; either way the held ratio has to be the
  // one on screen at the moment the lock is closed.
  const wasLocked = React.useRef(locked);
  React.useEffect(() => {
    if (locked && !wasLocked.current) captureRatio();
    wasLocked.current = locked;
  }, [captureRatio, locked]);

  const write = (patch: Dimensions, complete: boolean) => {
    const next = { ...valueRef.current, ...patch };
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete) onValueCommit?.(next);
  };

  /** Sets one edge, and the other with it while the lock is closed. */
  const setEdge = (edge: "width" | "height", raw: number, complete: boolean) => {
    const primary = round(clamp(raw));
    if (!locked) {
      write({ [edge]: primary }, complete);
      // An unlocked edit is what the lock will hold if it closes next, so the
      // ratio follows the pair while it is free rather than being measured once.
      captureRatio();
      return;
    }
    const ratio = ratioRef.current || 1;
    const partner =
      edge === "width" ? round(clamp(primary / ratio)) : round(clamp(primary * ratio));
    write(
      edge === "width" ? { width: primary, height: partner } : { height: primary, width: partner },
      complete,
    );
  };

  const toggleLock = () => {
    const next = !locked;
    if (next) captureRatio();
    if (lockedProp === undefined) setInternalLocked(next);
    onLockedChange?.(next);
  };

  return (
    <div
      data-slot="inspector-dimensions"
      data-disabled={disabled}
      data-locked={locked || undefined}
      className={cn(
        "group/inspector-dimensions flex items-center gap-2",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      <label
        htmlFor={widthId}
        data-slot="inspector-dimensions-label"
        className="flex min-w-0 flex-1 cursor-text items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </label>

      {/*
        The pair is one thing, so it is held together as one: both fields size to
        their own text and sit a hair either side of the sign.

        They were both as wide as the largest number they could hold, right-aligned,
        which kept the row from shifting as digits were typed — and cost more than it
        bought. A four-digit width holding "659" put four blank characters between the
        sign and the number, so the row read as three loose things rather than as
        1160.28 × 659. Growing by a character when a digit is added is the smaller
        price, and `tabular-nums` keeps even that from wobbling mid-number.
      */}
      <div
        data-slot="inspector-dimensions-pair"
        className="flex shrink-0 items-center gap-1"
      >
        <Edge
          id={widthId}
          name={name ? `${name}-width` : undefined}
          ariaLabel={`${ariaLabel ?? label} width`}
          disabled={disabled}
          step={step}
          value={value.width}
          fallback={min}
          onEdit={(raw, complete) => setEdge("width", raw, complete)}
        />

        {/* A multiplication sign, not the letter: this is 1280 × 720, and the letter
            x sits at a different height and a different weight in every face. */}
        <span
          aria-hidden="true"
          data-slot="inspector-dimensions-separator"
          className="shrink-0 text-sm text-foreground/70 select-none"
        >
          ×
        </span>

        <Edge
          id={heightId}
          name={name ? `${name}-height` : undefined}
          ariaLabel={`${ariaLabel ?? label} height`}
          disabled={disabled}
          step={step}
          value={value.height}
          fallback={min}
          onEdit={(raw, complete) => setEdge("height", raw, complete)}
        />
      </div>

      {suffix ? (
        <span
          data-slot="inspector-dimensions-suffix"
          className="shrink-0 text-sm font-medium text-foreground/70 select-none"
        >
          {suffix}
        </span>
      ) : null}

      {lockable ? (
        <button
          type="button"
          onClick={toggleLock}
          disabled={disabled}
          aria-pressed={locked}
          aria-label={locked ? `Unlink ${label}` : `Link ${label}`}
          title={locked ? "Ratio locked" : "Ratio unlocked"}
          data-slot="inspector-dimensions-lock"
          className={cn(
            "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md",
            "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            locked
              ? "bg-foreground/10 text-foreground"
              : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground",
          )}
        >
          {locked ? <LinkIcon className="size-3.5" /> : <Unlink2Icon className="size-3.5" />}
        </button>
      ) : null}
    </div>
  );
}

/**
 * One of the two numbers. Local to this file: it is not a row of the family, it is
 * half of one, and the pair has to behave identically for the lock to read as a
 * lock rather than as two fields that sometimes agree.
 */
function Edge({
  id,
  name,
  ariaLabel,
  disabled,
  step,
  value,
  fallback,
  onEdit,
}: {
  id: string;
  name?: string;
  ariaLabel: string;
  disabled: boolean;
  step: number;
  value: number | undefined;
  fallback: number;
  onEdit: (raw: number, complete: boolean) => void;
}) {
  /** What is in the field while it is being typed in, if anything. */
  const [draft, setDraft] = React.useState<string | null>(null);

  const accept = () => {
    if (draft === null) return;
    // A comma is a decimal point everywhere the metric system is.
    const parsed = Number.parseFloat(draft.replace(",", "."));
    setDraft(null);
    if (Number.isNaN(parsed)) return;
    onEdit(parsed, true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      accept();
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
      onEdit((value ?? fallback) + step * factor, true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setDraft(null);
      onEdit((value ?? fallback) - step * factor, true);
    }
  };

  return (
    <input
      id={id}
      name={name}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck={false}
      value={draft ?? String(value ?? fallback)}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(event) => setDraft(event.target.value.replace(NON_NUMERIC, ""))}
      onBlur={accept}
      onKeyDown={handleKeyDown}
      data-slot="inspector-dimensions-field"
      className={cn(
        // As wide as the number in it, with a floor so an empty field is still
        // somewhere to press. The alignment no longer decides anything — the box is
        // the text — but it stays right so a value that hits the floor leans towards
        // the sign rather than away from it.
        "field-sizing-content min-w-[2ch] shrink-0",
        "bg-transparent text-right font-mono text-sm font-medium tabular-nums",
        "text-foreground outline-none",
      )}
    />
  );
}
