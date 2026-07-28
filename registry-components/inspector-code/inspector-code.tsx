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

/** How wide a tab press is, in spaces. */
const TAB = "  ";

interface InspectorCodeProps {
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

  /**
   * What this is, shown as a chip beside the label: `css`, `html`, `svg`, `json`.
   * It is a sign, not a parser — nothing here validates against it.
   */
  language?: string;
  /** Ghost text shown while the field is empty. */
  placeholder?: string;
  /**
   * Lines the field opens at. It scrolls past this rather than growing, because a
   * pasted stylesheet would otherwise push the whole drawer out of reach.
   * @defaultValue 6 */
  rows?: number;
  /**
   * Let the block be folded away, leaving its header. A snippet is the tallest thing
   * in a drawer and usually the least often touched, so the panel around it is mostly
   * a scroll past something nobody is editing.
   */
  collapsible?: boolean;
  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /**
   * Whether it starts open in uncontrolled mode.
   * @defaultValue true */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Let long lines wrap instead of scrolling sideways. */
  wrap?: boolean;
  /** Longest the value may be. */
  maxLength?: number;

  /** Block interaction and dim the block. */
  disabled?: boolean;
  /** Show the code but refuse edits. */
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

/**
 * The two marks in the header, which the collapsible and plain headers both carry.
 * Local, and components rather than repeated markup so the two headers cannot drift
 * apart the way the row thumbnail and the grid cell did in inspector-variants.
 */
function LanguageChip({ language }: { language: string }) {
  return (
    <span
      data-slot="inspector-code-language"
      className="shrink-0 rounded-sm bg-foreground/10 px-1.5 text-sm font-medium text-foreground/70 select-none"
    >
      {language}
    </span>
  );
}

/** A line count rather than a character count: it is what tells a reader whether the
    field is holding what they pasted, and it is the one thing worth reading while the
    block is folded. */
function LineCount({ lines }: { lines: number }) {
  return (
    <span
      data-slot="inspector-code-lines"
      aria-hidden="true"
      className="ml-auto shrink-0 font-mono text-sm tabular-nums text-foreground/70 select-none"
    >
      {lines}
    </span>
  );
}

export const inspectorCodeDemo: InspectorCodeProps = {
  label: "Custom CSS",
  className: "w-72",
  language: "css",
  collapsible: true,
  defaultValue: ".hero {\n  letter-spacing: -0.02em;\n}",
  placeholder: "/* Anything valid here reaches the page */",
};

export function InspectorCode({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  language,
  placeholder,
  rows = 6,
  collapsible = false,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  wrap = false,
  maxLength,
  disabled = false,
  readOnly = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorCodeProps) {
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

  /**
   * Tab indents rather than leaving the field. A code field is the one place where
   * that trade is worth making, and Escape is left as the way out so the keyboard
   * is never actually trapped.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.currentTarget.blur();
      return;
    }
    if (event.key !== "Tab" || event.shiftKey || readOnly) return;

    event.preventDefault();
    const field = event.currentTarget;
    const { selectionStart, selectionEnd } = field;
    const next = `${value.slice(0, selectionStart)}${TAB}${value.slice(selectionEnd)}`;
    setValue(maxLength ? next.slice(0, maxLength) : next);
    // Put the caret after the indent, on the frame the new value lands.
    requestAnimationFrame(() => {
      field.selectionStart = selectionStart + TAB.length;
      field.selectionEnd = selectionStart + TAB.length;
    });
  };

  const lines = value ? value.split("\n").length : 0;

  return (
    /*
     * A block rather than a row, like inspector-textarea: code is many lines by
     * definition. What it does not share is the font — this is the one place in the
     * family where monospace is the point rather than a habit, since indentation and
     * alignment are half of how code is read.
     *
     * The root is a `div` rather than the whole block being one `<label>`, as
     * inspector-textarea is. That is not a style choice: a label may not contain
     * interactive content, so a collapsible block's header could not legally live
     * inside one — the same reason inspector-group lays its reset button beside the
     * header trigger instead of inside it.
     */
    <div
      data-slot="inspector-code"
      data-disabled={disabled}
      data-open={open || undefined}
      className={cn(
        "group/inspector-code flex flex-col gap-1.5",
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
          data-slot="inspector-code-trigger"
          className={cn(
            "flex w-full cursor-pointer items-center gap-2 text-left",
            "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
        >
          <span
            data-slot="inspector-code-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          {language ? <LanguageChip language={language} /> : null}
          <LineCount lines={lines} />

          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 text-foreground/70 motion-safe:transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <label
            htmlFor={fieldId}
            data-slot="inspector-code-label"
            className="flex min-w-0 cursor-text items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </label>

          {language ? <LanguageChip language={language} /> : null}
          <LineCount lines={lines} />
        </div>
      )}

      {/*
        Hidden while closed rather than unmounted, which is where this parts company
        with inspector-group. That one unmounts because it holds arbitrary rows, each
        with state and effects of its own; here there is exactly one field, it costs
        nothing to leave in place, and it carries a `name` — a folded block that
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
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        wrap={wrap ? "soft" : "off"}
        onChange={(event) => setValue(event.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        data-slot="inspector-code-field"
        className={cn(
          "w-full resize-none bg-transparent font-mono text-sm text-foreground",
          "outline-none placeholder:text-muted-foreground",
          "read-only:cursor-default",
          // Fixed height on purpose: a pasted file would otherwise push everything
          // under it out of the drawer.
          "field-sizing-fixed",
          wrap ? "whitespace-pre-wrap" : "overflow-x-auto whitespace-pre",
        )}
      />
    </div>
  );
}
