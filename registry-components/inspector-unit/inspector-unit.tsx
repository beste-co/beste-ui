"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface InspectorUnitOption {
  /** The unit as CSS writes it: `px`, `%`, `rem`, `auto`. */
  value: string;
  /** How it reads in the menu. Falls back to `value`. */
  label?: string;
  /**
   * A unit that is the whole value, with no number in front of it — `auto`,
   * `inherit`, `min-content`. The number field steps aside while one is chosen,
   * rather than sitting there holding a figure that means nothing.
   */
  valueless?: boolean;
  /** Range this unit answers to, when it differs from the row's own. */
  min?: number;
  max?: number;
  step?: number;
}

/** A length: a number and the unit that gives it meaning. */
interface UnitValue {
  value?: number;
  unit?: string;
}

interface InspectorUnitProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: UnitValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: UnitValue;
  /** Fires on every accepted edit and on every unit change. */
  onValueChange?: (value: UnitValue) => void;
  /**
   * Fires once an edit is finished — the field left or Enter pressed, a unit
   * chosen. Use it for work too expensive to run per keystroke.
   */
  onValueCommit?: (value: UnitValue) => void;

  /**
   * The units on offer. Plain strings are enough when the unit is its own label.
   * @defaultValue ["px", "%", "rem"] */
  units?: (string | InspectorUnitOption)[];

  /**
   * Range the number answers to, for units that do not name their own.
   * @defaultValue 0 to 9999, in steps of 1 */
  min?: number;
  max?: number;
  step?: number;
  /**
   * How many decimals a value keeps. Anything typed past this is rounded on
   * commit, so what the field shows is what the caller was handed.
   * @defaultValue 2 */
  precision?: number;

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

  /** Name of the number field, so the row can take part in a form. */
  name?: string;
  /** Id of the number field, for an external `<label htmlFor>`. */
  id?: string;
  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorUnitDemo: InspectorUnitProps = {
  label: "Width",
  className: "w-72",
  defaultValue: { value: 100, unit: "%" },
  units: ["px", "%", "rem", { value: "auto", label: "auto", valueless: true }],
};

export function InspectorUnit({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  units = ["px", "%", "rem"],
  min = 0,
  max = 9999,
  step = 1,
  precision = 2,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorUnitProps) {
  const options = React.useMemo(
    () => units.map((entry) => (typeof entry === "string" ? { value: entry } : entry)),
    [units],
  );

  const [internalValue, setInternalValue] = React.useState<UnitValue>(
    defaultValue ?? { value: min, unit: options[0]?.value },
  );
  const value = valueProp ?? internalValue;
  const unit = value.unit ?? options[0]?.value ?? "";
  const active = options.find((option) => option.value === unit);

  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  /*
   * A unit may narrow the range: 0 to 100 reads as a percentage and 0 to 9999 does
   * not, and one shared range would have to be wrong for one of them.
   */
  const bounds = {
    min: active?.min ?? min,
    max: active?.max ?? max,
    step: active?.step ?? step,
  };

  /** What is in the field while it is being typed in, if anything. */
  const [draft, setDraft] = React.useState<string | null>(null);
  const valueRef = React.useRef(value);
  valueRef.current = value;

  const write = (patch: Partial<UnitValue>, complete: boolean) => {
    const next = { ...valueRef.current, ...patch };
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete) onValueCommit?.(next);
  };

  const round = (raw: number) => {
    const factor = 10 ** precision;
    return Math.round(raw * factor) / factor;
  };

  const acceptDraft = () => {
    if (draft === null) return;
    // A comma is a decimal point everywhere the metric system is, and a field that
    // silently drops what was typed is worse than one that reads it.
    const parsed = Number.parseFloat(draft.replace(",", "."));
    setDraft(null);
    if (Number.isNaN(parsed)) return;
    write({ value: round(Math.min(bounds.max, Math.max(bounds.min, parsed))) }, true);
  };

  const nudge = (amount: number) => {
    const current = valueRef.current.value ?? bounds.min;
    write(
      { value: round(Math.min(bounds.max, Math.max(bounds.min, current + amount))) },
      true,
    );
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
    // The arrows work the field the way they work a stepper, since a length is a
    // number first and a string second.
    const factor = event.shiftKey ? 10 : 1;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setDraft(null);
      nudge(bounds.step * factor);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setDraft(null);
      nudge(-bounds.step * factor);
    }
  };

  const valueless = Boolean(active?.valueless);
  const shown = draft ?? String(value.value ?? bounds.min);

  return (
    <div
      data-slot="inspector-unit"
      data-disabled={disabled}
      className={cn(
        "group/inspector-unit flex items-center gap-2",
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
        htmlFor={fieldId}
        data-slot="inspector-unit-label"
        className="flex min-w-0 flex-1 cursor-text items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </label>

      {/* The number steps aside for a unit that is the whole value. */}
      {valueless ? null : (
        <input
          id={fieldId}
          name={name}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={shown}
          disabled={disabled}
          aria-label={ariaLabel ?? label}
          onChange={(event) => setDraft(event.target.value.replace(NON_NUMERIC, ""))}
          onBlur={acceptDraft}
          onKeyDown={handleKeyDown}
          data-slot="inspector-unit-value"
          className={cn(
            "w-12 shrink-0 bg-transparent text-right font-mono text-sm font-medium tabular-nums",
            "text-foreground outline-none",
          )}
        />
      )}

      {/*
        The same Select the rest of the family uses, stripped of its own frame: it
        sits inside a row that already has one, so the trigger keeps the chevron and
        gives up the border, the shadow and the padding. The unit menu could have been
        a native `<select>` — four options four characters wide hardly need more — but
        then one control in the set would open a menu that looked like nothing else in
        it, on a machine where that menu is the operating system's.

        No `position` on the content, deliberately: the base codemod treats that
        attribute on SelectContent as a hard flag, and shadcn's own default is the one
        wanted here anyway. Passing it would buy nothing and cost this component a
        hand-maintained Base UI override.
      */}
      <Select
        value={unit}
        disabled={disabled}
        // Radix keeps a hidden native select for this, so the unit submits beside the
        // number rather than being the one half of a length a form never sees.
        name={name ? `${name}-unit` : undefined}
        onValueChange={(next) => {
          setDraft(null);
          write({ unit: next }, true);
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label={`${ariaLabel ?? label} unit`}
          data-slot="inspector-unit-select"
          className={cn(
            "h-6 w-auto shrink-0 gap-1 border-0 bg-transparent px-1 py-0 shadow-none",
            "cursor-pointer text-sm font-medium text-foreground/70",
            "transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end" className="min-w-24">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="cursor-pointer">
              {option.label ?? option.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
