"use client";

import { ChevronDownIcon, type LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the block. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/**
 * Padding and label metrics. The open height comes from `rows` rather than from a
 * preset; `--inspector-height` is here for the closed state, where the block has to
 * measure exactly what a row of the family measures.
 */
type Size = "sm" | "default" | "lg";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent has-[textarea:focus-visible]:border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

interface InspectorTextareaProps {
  /** Label rendered above the field, inside the block. */
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
   * Fires once the edit is finished — leaving the field — and only when the value
   * actually changed. Use it for work too expensive to run per keystroke.
   */
  onValueCommit?: (value: string) => void;

  /** Ghost text shown while the field is empty. */
  placeholder?: string;
  /**
   * Lines the field opens at. It grows past this as text is typed, where the
   * browser supports sizing a field to its content.
   * @defaultValue 3 */
  rows?: number;
  /** Keep the field at `rows` and scroll instead of growing. */
  fixedHeight?: boolean;
  /**
   * Let the block be folded away, leaving its header. A paragraph is several rows
   * tall and usually written once, so the panel around it is otherwise mostly a
   * scroll past something nobody is editing.
   */
  collapsible?: boolean;
  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /**
   * Whether it starts open in uncontrolled mode.
   * @defaultValue true */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Longest the value may be. Setting it also puts a count beside the label,
   * which is the only reason a reader can tell how much room is left.
   */
  maxLength?: number;

  /** Block interaction and dim the block. */
  disabled?: boolean;
  /** Show the value but refuse edits. */
  readOnly?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare until focus.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Padding preset.
   * @defaultValue "default" */
  size?: Size;

  /** Name of the field, so the block can take part in a form. */
  name?: string;
  /** Id of the field. One is generated when it is not given. */
  id?: string;
  className?: string;
  /** Accessible name. Falls back to the visible label. */
  "aria-label"?: string;
}

export const inspectorTextareaDemo: InspectorTextareaProps = {
  label: "Description",
  className: "w-72",
  collapsible: true,
  defaultValue: "A short line about the section, shown under the heading.",
  placeholder: "Optional",
  maxLength: 160,
};

export function InspectorTextarea({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  placeholder,
  rows = 3,
  fixedHeight = false,
  collapsible = false,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  maxLength,
  disabled = false,
  readOnly = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorTextareaProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp ?? internalValue;

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = collapsible ? (openProp ?? internalOpen) : true;

  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  const toggleOpen = () => {
    if (!collapsible) return;
    const next = !open;
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  /** Last value handed to `onValueCommit`, so a commit only reports real edits. */
  const committedRef = React.useRef(value);

  const setValue = (next: string) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const commit = () => {
    if (value === committedRef.current) return;
    committedRef.current = value;
    onValueCommit?.(value);
  };

  const count = maxLength ? (
    /* A limit nobody can see is a trap, so the count comes with it. It is also the
       one thing worth reading while the block is folded. */
    <span
      data-slot="inspector-textarea-count"
      aria-hidden="true"
      className="ml-auto shrink-0 font-mono text-sm tabular-nums text-foreground/70 select-none"
    >
      {`${value.length}/${maxLength}`}
    </span>
  ) : null;

  return (
    /*
     * The family's rows are one line tall by construction, and a paragraph is not.
     * So this is the first block in the set: the same surface, tones and tokens,
     * but the label sits above the field rather than beside it, and the height
     * comes from the text.
     *
     * The root is a `div` rather than one big `<label>`: a label may not contain
     * interactive content, so a collapsible block's header could not legally live
     * inside one. Pressing the label still puts the caret in the field, which is the
     * part that was worth keeping.
     */
    <div
      data-slot="inspector-textarea"
      data-disabled={disabled}
      data-open={open || undefined}
      className={cn(
        "group/inspector-textarea flex flex-col gap-1.5",
        "rounded-(--inspector-radius) p-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        // Closed, the block measures exactly what a row of the family measures, so a
        // folded block sits in a stack of settings without a step in the edge.
        !open && "h-(--inspector-height) justify-center py-0",
        "has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-ring/50 has-[textarea:focus-visible]:ring-offset-2 has-[textarea:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {/*
        The header is one press target while the block folds, and a plain label while
        it does not: a closed block has no field to point a label at, and a label that
        focuses something invisible is worse than no label.
      */}
      {collapsible ? (
        <button
          type="button"
          onClick={toggleOpen}
          disabled={disabled}
          aria-expanded={open}
          aria-controls={fieldId}
          data-slot="inspector-textarea-trigger"
          className={cn(
            "flex w-full cursor-pointer items-center gap-2 text-left",
            "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
        >
          <span
            data-slot="inspector-textarea-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          {count}

          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 text-foreground/70 motion-safe:transition-transform",
              count ? "" : "ml-auto",
              open && "rotate-180",
            )}
          />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <label
            htmlFor={fieldId}
            data-slot="inspector-textarea-label"
            className="flex min-w-0 cursor-text items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0 self-center" /> : null}
            <span className="truncate">{label}</span>
          </label>

          {count}
        </div>
      )}

      {/*
        Hidden while closed rather than unmounted: there is exactly one field here, it
        costs nothing to leave in place, and it carries a `name` — a folded block that
        dropped its value out of the surrounding form would be a trap.
      */}
      <textarea
        hidden={!open}
        value={value}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        id={fieldId}
        aria-label={ariaLabel}
        onChange={(event) => setValue(event.target.value)}
        onBlur={commit}
        data-slot="inspector-textarea-field"
        className={cn(
          "w-full resize-none bg-transparent text-sm font-medium text-foreground",
          "outline-none placeholder:font-normal placeholder:text-muted-foreground",
          "read-only:cursor-default",
          // Grows with its content where the browser supports it, and falls back
          // to exactly `rows` lines where it does not.
          fixedHeight ? "field-sizing-fixed" : "field-sizing-content",
        )}
      />
    </div>
  );
}
