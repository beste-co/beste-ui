"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/*
 * The hover and open surfaces are translucent tints rather than `bg-accent`,
 * which is the same colour as `bg-muted` in a light theme and would read as no
 * change at all. Tinting also blends when the row sits on a card.
 *
 * Every surface is declared twice, plain and `dark:`. That is not redundant: the
 * shadcn select trigger ships its own `dark:bg-input/30` and
 * `dark:hover:bg-input/50`, and a `dark:`-prefixed rule outranks an unprefixed
 * one, so a plain `bg-muted` alone would lose in dark mode.
 */
const toneStyles: Record<Tone, string> = {
  muted:
    "border-transparent bg-muted dark:bg-muted hover:bg-muted-foreground/15 dark:hover:bg-muted-foreground/15 data-[state=open]:bg-muted-foreground/20 dark:data-[state=open]:bg-muted-foreground/20",
  outline:
    "border-border bg-transparent dark:bg-transparent hover:bg-muted dark:hover:bg-muted data-[state=open]:bg-muted dark:data-[state=open]:bg-muted",
  ghost:
    "border-transparent bg-transparent dark:bg-transparent hover:bg-muted dark:hover:bg-muted data-[state=open]:bg-muted dark:data-[state=open]:bg-muted",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

interface InspectorSelectOption {
  /** Value reported on selection. An empty string is not a valid option value. */
  value: string;
  /** Text shown in the row and in the menu. Falls back to `value`. */
  label?: string;
  /** Second line under the label, in the menu only. */
  description?: string;
  /** Leading icon, shown in the menu and in the row once selected. */
  icon?: LucideIcon;
  /** Leading colour dot in any CSS colour — palettes, themes, brand colours. */
  swatch?: string;
  /**
   * Heading this option sits under. Consecutive options that share a group form
   * one section, so the authored order is always preserved.
   */
  group?: string;
  disabled?: boolean;
}

/** One section of the menu: a run of options under an optional heading. */
interface OptionSection {
  label?: string;
  options: InspectorSelectOption[];
}

/**
 * Normalize the options and slice them into sections. Kept outside the component
 * so it stays a pure function of its input and can be memoized on `options`.
 */
function buildSections(entries: (string | InspectorSelectOption)[]): OptionSection[] {
  const sections: OptionSection[] = [];

  for (const entry of entries) {
    const option = typeof entry === "string" ? { value: entry } : entry;
    // An empty value is the "nothing selected" sentinel and throws if used for
    // an item, so drop the entry rather than take the whole menu down with it.
    if (!option.value) continue;

    const current = sections[sections.length - 1];
    if (current && current.label === option.group) {
      current.options.push(option);
    } else {
      sections.push({ label: option.group, options: [option] });
    }
  }

  return sections;
}

interface InspectorSelectProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Plain strings for simple lists, or objects for icons, swatches and groups. */
  options?: (string | InspectorSelectOption)[];

  /** Controlled value. Pair it with `onValueChange`. */
  value?: string;
  /** Initial value in uncontrolled mode. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Shown in place of the value until something is selected.
   * @defaultValue "Select" */
  placeholder?: string;
  /**
   * Menu text when there is nothing to choose from.
   * @defaultValue "No options" */
  emptyMessage?: string;
  /**
   * Menu width: match the row, or size to the longest option.
   * @defaultValue "trigger" */
  menuWidth?: "trigger" | "auto";

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

  /** Name of the underlying form control, so the row can take part in a form. */
  name?: string;
  /** Id of the trigger, for an external `<label htmlFor>`. */
  id?: string;
  className?: string;
  /**
   * Accessible name. Omit it and the row reads as "{label}, {value}", which is
   * usually what you want — the visible label and the value are both announced.
   */
  "aria-label"?: string;
}

export const inspectorSelectDemo: InspectorSelectProps = {
  label: "Blend mode",
  className: "w-72",
  defaultValue: "screen",
  options: [
    { value: "normal", label: "Normal" },
    {
      value: "multiply",
      label: "Multiply",
      group: "Darken",
      description: "Keeps the darker pixels",
    },
    { value: "color-burn", label: "Color burn", group: "Darken" },
    {
      value: "screen",
      label: "Screen",
      group: "Lighten",
      description: "Keeps the lighter pixels",
    },
    { value: "color-dodge", label: "Color dodge", group: "Lighten" },
  ],
};

export function InspectorSelect({
  label,
  icon: Icon,
  options = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  onOpenChange,
  placeholder = "Select",
  emptyMessage = "No options",
  menuWidth = "trigger",
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorSelectProps) {
  const sections = React.useMemo(() => buildSections(options), [options]);

  // The row draws its own trigger content, so it has to know the value in both
  // modes. Keeping the fallback an empty string means the underlying select is
  // controlled from the first render and never switches modes mid-life.
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp ?? internalValue;

  const selected = React.useMemo(() => {
    if (!value) return undefined;
    for (const section of sections) {
      for (const option of section.options) {
        if (option.value === value) return option;
      }
    }
    return undefined;
  }, [sections, value]);

  const handleValueChange = (next: string | null) => {
    // Base UI reports null when a selection is cleared; this row never clears,
    // but guard it so a null can never reach `onValueChange`.
    if (next === null) return;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const SelectedIcon = selected?.icon;

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      onOpenChange={onOpenChange}
      disabled={disabled}
      name={name}
    >
      <SelectTrigger
        id={id}
        size="default"
        aria-label={ariaLabel}
        className={cn(
          // Family tokens, mirrored from inspector-slider so a column of rows
          // lines up whatever the mix of controls.
          "[--inspector-radius:var(--radius-xl)]",
          sizeStyles[size],
          "w-full cursor-pointer justify-between gap-2 py-0 shadow-none select-none",
          "rounded-(--inspector-radius) px-(--inspector-pad) data-[size=default]:h-(--inspector-height)",
          "text-sm font-medium transition-colors",
          "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // The trigger appends the chevron as its own last child. Bring it up to
          // full opacity and turn it over while the menu is open.
          "[&>svg:last-child]:opacity-100 [&>svg:last-child]:transition-transform data-[state=open]:[&>svg:last-child]:rotate-180",
          toneStyles[tone],
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5 text-foreground/70">
          {Icon ? <Icon className="size-4 shrink-0" /> : null}
          <span className="truncate">{label}</span>
        </span>

        <span
          className={cn(
            "ml-auto flex min-w-0 items-center gap-1.5",
            selected ? "text-foreground" : "text-foreground/70",
          )}
        >
          {selected?.swatch ? (
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-full border border-border"
              style={{ backgroundColor: selected.swatch }}
            />
          ) : null}
          {SelectedIcon ? <SelectedIcon className="size-4 shrink-0" /> : null}
          <span className="truncate">
            {selected ? (selected.label ?? selected.value) : placeholder}
          </span>
        </span>
      </SelectTrigger>

      {/*
        No `sideOffset` of its own: the wrapper already nudges a popper-positioned
        menu down by 4px, so adding one on top only pushed the menu away from the
        row it belongs to. This is the gap every other select in the app has.
      */}
      <SelectContent
        position="popper"
        align="start"
        className={cn(
          "[--inspector-radius:var(--radius-xl)] rounded-(--inspector-radius)",
          // The menu is portaled out of the row, so it carries its own copy of
          // the radius token instead of inheriting one.
          menuWidth === "trigger" && "w-(--radix-select-trigger-width)",
        )}
      >
        {sections.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-foreground/70 select-none">{emptyMessage}</div>
        ) : (
          sections.map((section, index) => (
            <React.Fragment key={`${index}-${section.label ?? ""}`}>
              {index > 0 ? <SelectSeparator /> : null}
              <SelectGroup>
                {section.label ? (
                  <SelectLabel className="text-sm font-medium select-none">{section.label}</SelectLabel>
                ) : null}
                {section.options.map((option) => {
                  const OptionIcon = option.icon;
                  // A described option is two lines tall, so its leading mark
                  // lines up with the first line instead of the block.
                  const leadingAlign = option.description ? "mt-0.5" : undefined;

                  return (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      className={cn(
                        "cursor-pointer rounded-md",
                        option.description && "items-start *:[span]:last:items-start",
                      )}
                    >
                      {option.swatch ? (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-3 shrink-0 rounded-full border border-border",
                            leadingAlign,
                          )}
                          style={{ backgroundColor: option.swatch }}
                        />
                      ) : null}
                      {OptionIcon ? (
                        <OptionIcon className={cn("size-4 shrink-0", leadingAlign)} />
                      ) : null}
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate">{option.label ?? option.value}</span>
                        {option.description ? (
                          <span className="truncate text-sm text-foreground/70 select-none">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </React.Fragment>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
