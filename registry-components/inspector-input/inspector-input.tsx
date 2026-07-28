"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** The subset of input types that reads sensibly as a settings row. */
type InspectorInputType = "text" | "number" | "email" | "url" | "tel" | "password" | "search";

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

/**
 * Number inputs bring spinners that fight the row's geometry, so they are turned
 * off and the row is driven by typing alone.
 */
const NO_SPINNERS =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

interface InspectorInputProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: string;
  /** Initial value in uncontrolled mode. */
  defaultValue?: string;
  /** Fires on every keystroke. */
  onValueChange?: (value: string) => void;
  /**
   * Fires once the edit is finished — Enter, or leaving the field — and only when
   * the value actually changed. Use it for work too expensive to run per
   * keystroke, such as a request or a re-render of something heavy.
   */
  onValueCommit?: (value: string) => void;

  /** Ghost text shown while the field is empty. */
  placeholder?: string;
  /**
   * Input type. `number` also hides the spinners and switches the on-screen
   * keyboard to a numeric one.
   * @defaultValue "text" */
  type?: InspectorInputType;
  /** Muted unit after the value, e.g. "px", "%", "ms". */
  suffix?: string;
  /**
   * Which end the text sits at. Short values read better tucked against the
   * right, the way the rest of the family shows a value; long ones, a URL say,
   * are easier to follow from the left.
   * @defaultValue "end" */
  align?: "start" | "end";
  maxLength?: number;

  /** Block interaction and dim the row. */
  disabled?: boolean;
  /** Show the value but refuse edits. */
  readOnly?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare until hover.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Row height preset.
   * @defaultValue "default" */
  size?: Size;

  /** Name of the input, so the row can take part in a form. */
  name?: string;
  /** Id of the input. The row is a `<label>`, so this is only for outside use. */
  id?: string;
  className?: string;
  /** Accessible name. Falls back to the visible label. */
  "aria-label"?: string;
}

export const inspectorInputDemo: InspectorInputProps = {
  label: "Class name",
  className: "w-72",
  defaultValue: "hero-section",
  placeholder: "Optional",
};

export function InspectorInput({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  placeholder,
  type = "text",
  suffix,
  align = "end",
  maxLength,
  disabled = false,
  readOnly = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorInputProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp ?? internalValue;

  /** Last value handed to `onValueCommit`, so a commit only reports real edits. */
  const committedRef = React.useRef(value);

  const setValue = (next: string) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const commit = (next: string) => {
    if (next === committedRef.current) return;
    committedRef.current = next;
    onValueCommit?.(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Committing on Enter, and not submitting: a settings row is rarely the
      // only field in its form.
      event.preventDefault();
      commit(value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setValue(committedRef.current);
    }
  };

  return (
    // The row is a label, so a press anywhere on it — the text included — puts the
    // caret in the field, and the visible label is the field's accessible name.
    <label
      data-slot="inspector-input"
      data-disabled={disabled}
      className={cn(
        "group/inspector-input flex items-center gap-2",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "cursor-text has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      <span
        data-slot="inspector-input-label"
        className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        id={id}
        aria-label={ariaLabel}
        inputMode={type === "number" ? "decimal" : undefined}
        spellCheck={type === "text" ? undefined : false}
        autoComplete={type === "text" ? "off" : undefined}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => commit(value)}
        onKeyDown={handleKeyDown}
        data-slot="inspector-input-field"
        className={cn(
          "min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground",
          "outline-none placeholder:font-normal placeholder:text-muted-foreground",
          "read-only:cursor-default",
          align === "end" ? "text-right" : "text-left",
          type === "number" && "font-mono tabular-nums",
          type === "number" && NO_SPINNERS,
        )}
      />

      {suffix ? (
        <span
          data-slot="inspector-input-suffix"
          aria-hidden="true"
          className="shrink-0 text-sm font-medium text-foreground/70 select-none"
        >
          {suffix}
        </span>
      ) : null}
    </label>
  );
}
