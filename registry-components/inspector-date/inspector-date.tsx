"use client";

import { CalendarIcon, ClockIcon, type LucideIcon } from "lucide-react";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** A pressed row answers hover; a row holding a field does not. */
const triggerToneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted hover:bg-muted-foreground/15",
  outline: "border border-border hover:bg-muted",
  ghost: "border border-transparent hover:border-border hover:bg-muted",
};

const fieldToneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent hover:border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

/** What is being picked. */
type DateMode = "date" | "time" | "datetime";

/**
 * Month names for the row's own reading of a date.
 *
 * Deliberately not `toLocaleDateString`: that is resolved against the machine's
 * locale, and the machine rendering this on the server is not the one reading it, so
 * the first paint and the hydrated one would disagree — a mismatch that React
 * reports and that flickers in front of the reader. A caller who wants their locale
 * passes `formatValue`, where they can use `Intl` freely because it only ever runs
 * where they call it.
 */
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function pad(part: number) {
  return String(part).padStart(2, "0");
}

/**
 * `2026-08-01` into a date that is the first of August *here*.
 *
 * `new Date("2026-08-01")` is not that: a bare date string is parsed as UTC
 * midnight, so anywhere west of Greenwich it is the evening of July 31st, and a
 * calendar built on it highlights the wrong day. Handing the parts to the
 * constructor is what keeps the value local from end to end.
 */
function parseDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return undefined;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/** And back, in local terms. `toISOString` would undo the care taken above. */
function formatDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** The `HH:MM` half of a value, if it has one. */
function timePart(value: string) {
  return value.includes("T") ? (value.split("T")[1] ?? "") : "";
}

/** How a value reads on the row: `1 Aug 2026`, `14:30`, or both. */
function summarize(value: string, mode: DateMode) {
  if (!value) return "";
  if (mode === "time") return value;

  const date = parseDate(value);
  if (!date) return value;
  const printed = `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  if (mode !== "datetime") return printed;

  const time = timePart(value);
  return time ? `${printed}, ${time}` : printed;
}

interface InspectorDateProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. Defaults to the mode's own. */
  icon?: LucideIcon;

  /**
   * Controlled value, in the format the platform uses: `2026-07-25` for a date,
   * `14:30` for a time, `2026-07-25T14:30` for both. That is also what a form
   * submits and what `new Date()` parses, so nothing has to be converted twice.
   */
  value?: string;
  /** Initial value in uncontrolled mode. */
  defaultValue?: string;
  /** Fires whenever a day is picked, a time typed, or the value cleared. */
  onValueChange?: (value: string) => void;
  /** Fires when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * What is being picked.
   * @defaultValue "date" */
  mode?: DateMode;
  /** Earliest allowed value, in the same format. */
  min?: string;
  /** Latest allowed value, in the same format. */
  max?: string;
  /** Granularity in seconds, for the time half. */
  step?: number;
  /**
   * How the value reads on the row. Use it to bring your own locale, which is the
   * one thing this cannot do for you without guessing where it is running.
   */
  formatValue?: (value: string) => string;
  /** What the row reads while there is no value. */
  emptyLabel?: string;
  /** Offer a button that clears the value. */
  clearable?: boolean;
  /** Which day starts the week: 0 is Sunday, 1 is Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

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

  /** Name of the field, so the row can take part in a form. */
  name?: string;
  /** Id of the field. One is generated when it is left out. */
  id?: string;
  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorDateDemo: InspectorDateProps = {
  label: "Publish on",
  className: "w-72",
  defaultValue: "2026-08-01",
  clearable: true,
};

export function InspectorDate({
  label,
  icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onOpenChange,
  mode = "date",
  min,
  max,
  step,
  formatValue,
  emptyLabel = "Not set",
  clearable = false,
  weekStartsOn,
  disabled = false,
  readOnly = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorDateProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp ?? internalValue;

  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const Icon = icon ?? (mode === "time" ? ClockIcon : CalendarIcon);

  const setValue = (next: string) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const selected = mode === "time" ? undefined : parseDate(value);
  const time = timePart(value);
  const shown = formatValue ? formatValue(value) : summarize(value, mode);

  /** A day arrives from the calendar; the time half, if any, is carried over. */
  const pickDay = (day: Date | undefined) => {
    if (!day) {
      setValue("");
      return;
    }
    const date = formatDate(day);
    if (mode !== "datetime") {
      setValue(date);
      return;
    }
    setValue(`${date}T${time || "00:00"}`);
  };

  const pickTime = (next: string) => {
    if (mode === "time") {
      setValue(next);
      return;
    }
    const date = selected ? formatDate(selected) : formatDate(new Date());
    setValue(next ? `${date}T${next}` : date);
  };

  /*
   * A time has no calendar to show, so that mode keeps the platform's own field
   * inline rather than opening a panel over a single input. The other two are
   * triggers, since a month is worth a panel.
   */
  if (mode === "time") {
    return (
      <div
        data-slot="inspector-date"
        data-disabled={disabled}
        className={cn(
          "group/inspector-date flex items-center gap-2",
          "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
          "[--inspector-radius:var(--radius-xl)]",
          "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
          "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
          sizeStyles[size],
          fieldToneStyles[tone],
          className,
        )}
      >
        <label
          htmlFor={fieldId}
          data-slot="inspector-date-label"
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
        >
          <Icon className="size-4 shrink-0" />
          <span className="truncate">{label}</span>
        </label>

        <input
          id={fieldId}
          name={name}
          type="time"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={ariaLabel}
          onChange={(event) => setValue(event.target.value)}
          data-slot="inspector-date-field"
          className={cn(
            "min-w-0 shrink-0 cursor-pointer bg-transparent text-right",
            "text-sm font-medium text-foreground outline-none",
            "read-only:cursor-default",
          )}
        />
      </div>
    );
  }

  return (
    <Popover onOpenChange={onOpenChange}>
      {/*
        The row is the trigger, so the calendar opens flush with it. What the row
        shows is the date as anyone would write it down — plain text, not the stored
        `2026-08-01`, and in the same face as every other value in the family. A date
        is a word and a couple of numbers; setting it in monospace would be treating
        it as a code.
      */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled || readOnly}
          aria-label={ariaLabel}
          data-slot="inspector-date"
          data-disabled={disabled}
          className={cn(
            "group/inspector-date flex w-full cursor-pointer items-center gap-2 text-left",
            "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
            "[--inspector-radius:var(--radius-xl)] transition-colors",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
            readOnly && "cursor-default hover:bg-transparent",
            sizeStyles[size],
            triggerToneStyles[tone],
            className,
          )}
        >
          <span
            data-slot="inspector-date-label"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </span>

          <span
            data-slot="inspector-date-value"
            className={cn(
              "ml-auto min-w-0 truncate text-sm font-medium select-none",
              value ? "text-foreground" : "text-foreground/70",
            )}
          >
            {value ? shown : emptyLabel}
          </span>
        </button>
      </PopoverTrigger>

      {/*
        The panel is the calendar's own size, not the trigger's: a month is as wide as
        seven days and squeezing it into a narrow row would only make the days smaller
        than the fingers picking them.
      */}
      <PopoverContent align="start" side="bottom" sideOffset={8} className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={pickDay}
          // Opening on the month being edited rather than on today, since a value
          // that is already set is the reason the panel was opened.
          defaultMonth={selected}
          weekStartsOn={weekStartsOn}
          // The bounds are the same two strings, read the same local way.
          disabled={[
            ...(min && parseDate(min) ? [{ before: parseDate(min) as Date }] : []),
            ...(max && parseDate(max) ? [{ after: parseDate(max) as Date }] : []),
          ]}
          autoFocus
        />

        {mode === "datetime" ? (
          <div className="flex items-center gap-2 border-t border-border px-3 py-2">
            <label
              htmlFor={`${fieldId}-time`}
              className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
            >
              <ClockIcon className="size-4 shrink-0" />
              Time
            </label>
            <input
              id={`${fieldId}-time`}
              type="time"
              value={time}
              step={step}
              disabled={disabled}
              readOnly={readOnly}
              onChange={(event) => pickTime(event.target.value)}
              data-slot="inspector-date-time"
              className={cn(
                "ml-auto cursor-pointer bg-transparent text-right",
                "text-sm font-medium text-foreground outline-none",
                "read-only:cursor-default",
              )}
            />
          </div>
        ) : null}

        {clearable && value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            data-slot="inspector-date-clear"
            className={cn(
              "flex w-full cursor-pointer items-center justify-center border-t border-border px-3 py-2",
              "text-sm font-medium text-foreground/70 transition-colors outline-none select-none",
              "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            Clear
          </button>
        ) : null}
      </PopoverContent>

      {/*
        The value still submits with a form, which the button alone could not do: the
        control is a calendar now, so what carries the value is a field nobody sees.
      */}
      {name ? <input type="hidden" name={name} value={value} /> : null}
    </Popover>
  );
}
