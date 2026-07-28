"use client";

import { type LucideIcon, MinusIcon, PlusIcon } from "lucide-react";
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

const STEP_BUTTON =
  "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

/** Multiplier applied while Shift is held, matching inspector-slider. */
const COARSE_FACTOR = 10;
/** Delay before a held button starts repeating, then the gap between repeats. */
const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 60;

function clamp(value: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, value));
}

/** Decimal places implied by `step`, so 0.25 reads as "1.25" and not "1.2500001". */
function stepDecimals(step: number) {
  if (!Number.isFinite(step) || step <= 0) return 0;
  const text = String(step);
  const exponent = /e-(\d+)$/.exec(text);
  if (exponent) {
    const mantissa = text.split("e")[0]?.split(".")[1]?.length ?? 0;
    return Number(exponent[1]) + mantissa;
  }
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

interface InspectorStepperProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: number;
  /** Initial value in uncontrolled mode. Falls back to `min`. */
  defaultValue?: number;
  /** Fires on every step, key press and accepted keystroke. */
  onValueChange?: (value: number) => void;
  /**
   * Fires once a change is finished — a button release, a key release, a typed
   * value accepted on Enter or blur — and only when the value actually changed.
   */
  onValueCommit?: (value: number) => void;

  /**
   * Minimum value.
   * @defaultValue 0 */
  min?: number;
  /**
   * Maximum value.
   * @defaultValue 100 */
  max?: number;
  /**
   * Amount one step moves. Also sets how many decimals the value shows.
   * @defaultValue 1 */
  step?: number;
  /** Muted unit after the number, e.g. "px", "%", "ms". */
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

  /** Name of the underlying input, so the row can take part in a form. */
  name?: string;
  /** Id of the input. Generated when omitted, to tie the label to it. */
  id?: string;
  className?: string;
  /** Accessible name. Falls back to the visible label. */
  "aria-label"?: string;
}

export const inspectorStepperDemo: InspectorStepperProps = {
  label: "Columns",
  className: "w-72",
  min: 1,
  max: 6,
  defaultValue: 3,
};

export function InspectorStepper({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  suffix,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorStepperProps) {
  const decimals = React.useMemo(() => stepDecimals(step), [step]);

  const quantize = React.useCallback(
    (raw: number) => {
      const bounded = clamp(raw, min, max);
      if (!(step > 0)) return bounded;
      const stepped = min + Math.round((bounded - min) / step) * step;
      return clamp(Number(stepped.toFixed(decimals)), min, max);
    },
    [min, max, step, decimals],
  );

  const [internalValue, setInternalValue] = React.useState(() =>
    quantize(defaultValue ?? min),
  );
  const value = valueProp === undefined ? internalValue : quantize(valueProp);

  /** Non-null only while the field is being typed into. */
  const [draft, setDraft] = React.useState<string | null>(null);

  const valueRef = React.useRef(value);
  valueRef.current = value;
  /** Last value reported through `onValueCommit`. */
  const committedRef = React.useRef(value);
  const repeatRef = React.useRef<{ timeout: number; interval: number }>({
    timeout: 0,
    interval: 0,
  });

  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const apply = (raw: number) => {
    const next = quantize(raw);
    if (next === valueRef.current) return;
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const commit = () => {
    if (valueRef.current === committedRef.current) return;
    committedRef.current = valueRef.current;
    onValueCommit?.(valueRef.current);
  };

  /* ------------------------------------------------------------- stepping -- */

  const stopRepeat = React.useCallback(() => {
    window.clearTimeout(repeatRef.current.timeout);
    window.clearInterval(repeatRef.current.interval);
    repeatRef.current = { timeout: 0, interval: 0 };
  }, []);

  React.useEffect(() => stopRepeat, [stopRepeat]);

  // Holding a button keeps stepping, which beats clicking twenty times to cross
  // a range. The repeat is torn down on release, on cancel and on unmount.
  const startRepeat = (direction: 1 | -1, coarse: boolean) => {
    const amount = step * (coarse ? COARSE_FACTOR : 1) * direction;
    apply(valueRef.current + amount);
    stopRepeat();
    repeatRef.current.timeout = window.setTimeout(() => {
      repeatRef.current.interval = window.setInterval(() => {
        apply(valueRef.current + amount);
      }, REPEAT_INTERVAL);
    }, REPEAT_DELAY);
  };

  const endRepeat = () => {
    if (!repeatRef.current.timeout && !repeatRef.current.interval) return;
    stopRepeat();
    commit();
  };

  /* ------------------------------------------------------------- keyboard -- */

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const coarse = event.shiftKey ? COARSE_FACTOR : 1;
    let next: number | null = null;

    switch (event.key) {
      case "ArrowUp":
        next = valueRef.current + step * coarse;
        break;
      case "ArrowDown":
        next = valueRef.current - step * coarse;
        break;
      case "PageUp":
        next = valueRef.current + step * COARSE_FACTOR;
        break;
      case "PageDown":
        next = valueRef.current - step * COARSE_FACTOR;
        break;
      case "Home":
        next = min;
        break;
      case "End":
        next = max;
        break;
      case "Enter":
        event.preventDefault();
        acceptDraft();
        return;
      case "Escape":
        event.preventDefault();
        setDraft(null);
        return;
      default:
        return;
    }

    event.preventDefault();
    setDraft(null);
    apply(next);
  };

  /* ---------------------------------------------------------------- typing -- */

  const acceptDraft = () => {
    const raw = draft;
    setDraft(null);
    if (raw === null) return;
    const parsed = Number.parseFloat(raw.replace(",", "."));
    if (Number.isFinite(parsed)) apply(parsed);
    commit();
  };

  const handleDraftChange = (raw: string) => {
    // The field has to allow the half-typed states — empty, a lone minus, a
    // trailing separator — so the value only moves once the text is a number.
    setDraft(raw);
    const parsed = Number.parseFloat(raw.replace(",", "."));
    if (Number.isFinite(parsed)) apply(parsed);
  };

  /* ---------------------------------------------------------------- render -- */

  const display = draft ?? value.toFixed(decimals);
  // Widen the field to the longest value it can hold, so stepping never nudges
  // the layout, and add room for a minus sign when the range goes negative.
  const columns =
    Math.max(String(Math.trunc(min)).length, String(Math.trunc(max)).length) +
    (decimals > 0 ? decimals + 1 : 0);

  return (
    <div
      data-slot="inspector-stepper"
      data-disabled={disabled}
      className={cn(
        "group/inspector-stepper flex items-center gap-2",
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
        htmlFor={inputId}
        data-slot="inspector-stepper-label"
        className="flex min-w-0 flex-1 cursor-text items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </label>

      <div data-slot="inspector-stepper-controls" className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          aria-label={`Decrease ${ariaLabel ?? label}`}
          disabled={disabled || value <= min}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            startRepeat(-1, event.shiftKey);
          }}
          onPointerUp={endRepeat}
          onPointerLeave={endRepeat}
          onPointerCancel={endRepeat}
          className={STEP_BUTTON}
        >
          <MinusIcon className="size-3.5" />
        </button>

        <input
          id={inputId}
          name={name}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={display}
          disabled={disabled}
          aria-label={ariaLabel}
          onChange={(event) => handleDraftChange(event.target.value)}
          onBlur={acceptDraft}
          onKeyDown={handleKeyDown}
          data-slot="inspector-stepper-value"
          style={{ width: `${columns}ch` }}
          className="min-w-6 bg-transparent text-center font-mono text-sm font-medium tabular-nums text-foreground outline-none"
        />

        {suffix ? (
          <span
            data-slot="inspector-stepper-suffix"
            aria-hidden="true"
            className="shrink-0 pr-0.5 text-sm font-medium text-foreground/70 select-none"
          >
            {suffix}
          </span>
        ) : null}

        <button
          type="button"
          aria-label={`Increase ${ariaLabel ?? label}`}
          disabled={disabled || value >= max}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            startRepeat(1, event.shiftKey);
          }}
          onPointerUp={endRepeat}
          onPointerLeave={endRepeat}
          onPointerCancel={endRepeat}
          className={STEP_BUTTON}
        >
          <PlusIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
