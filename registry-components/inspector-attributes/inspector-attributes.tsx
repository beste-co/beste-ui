"use client";

import { type LucideIcon, PlusIcon, XIcon } from "lucide-react";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** The row itself is the trigger, so it answers hover like any other in the family. */
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

/**
 * What a name may be made of: letters, digits, dash, underscore, colon, dot. It
 * covers `data-*`, a custom property, an HTML attribute and an `og:` meta name,
 * and it is what makes a space in a pasted name disappear rather than be accepted
 * and then silently break the markup.
 */
const INVALID_KEY = /[^\w:.-]/g;

interface Attribute {
  key: string;
  value: string;
}

/**
 * The pairs as an object, which is what they are for. Later entries win, and empty
 * names are dropped — a half-typed line is not an attribute yet.
 */
export function attributesToRecord(entries: Attribute[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const entry of entries) {
    const key = entry.key.trim();
    if (key) out[key] = entry.value;
  }
  return out;
}

interface InspectorAttributesProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: Attribute[];
  /** Initial value in uncontrolled mode. */
  defaultValue?: Attribute[];
  onValueChange?: (value: Attribute[]) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /** Ghost text for the two fields. */
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  /**
   * Names worth offering, shown as pressable chips under the pairs: one press adds
   * that name with an empty value. Names already in the list drop out of the row, so
   * it also says what is left. They stay suggestions rather than becoming a menu of
   * allowed names — the point of this row is the names nobody anticipated.
   */
  suggestions?: string[];
  /** Ceiling on how many pairs there may be. */
  max?: number;

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

  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorAttributesDemo: InspectorAttributesProps = {
  label: "Attributes",
  className: "w-72",
  defaultValue: [
    { key: "data-analytics-id", value: "hero-cta" },
    { key: "aria-describedby", value: "hero-note" },
  ],
  suggestions: ["data-testid", "data-analytics-id", "aria-describedby", "rel"],
};

/**
 * The pairs nobody could have put in the panel in advance: `data-*` hooks, an ARIA
 * relationship, a custom property, an `og:` name.
 *
 * It is a list, and this family threw out a list once — so it is worth being exact
 * about the difference. What was rejected was a record widget: drag handles,
 * per-row accordions, a `renderEditor`. This holds two text fields per line and
 * nothing else. There is no reordering, because an attribute set has no order; no
 * per-row editor, because a name and a value are the whole record; and the row
 * above it stays a single line that counts them.
 */
export function InspectorAttributes({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onOpenChange,
  keyPlaceholder = "name",
  valuePlaceholder = "value",
  suggestions,
  max,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorAttributesProps) {
  const [internalValue, setInternalValue] = React.useState<Attribute[]>(defaultValue ?? []);
  const value = valueProp ?? internalValue;
  const [open, setOpen] = React.useState(false);

  const write = (next: Attribute[]) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const patch = (index: number, changes: Partial<Attribute>) => {
    write(value.map((entry, at) => (at === index ? { ...entry, ...changes } : entry)));
  };

  const atCeiling = max !== undefined && value.length >= max;

  const add = () => {
    if (atCeiling) return;
    write([...value, { key: "", value: "" }]);
  };

  /** Adds a suggested name with an empty value, ready to be filled in. */
  const addNamed = (key: string) => {
    if (atCeiling) return;
    write([...value, { key, value: "" }]);
  };

  const remove = (index: number) => {
    write(value.filter((_, at) => at !== index));
  };

  /*
   * Which names are used more than once. Computed rather than prevented: a reader
   * editing `data-id` into `data-idx` passes through a duplicate on the way, and a
   * field that refuses the keystroke makes that edit impossible.
   */
  const duplicates = React.useMemo(() => {
    const seen = new Map<string, number>();
    for (const entry of value) {
      const key = entry.key.trim();
      if (!key) continue;
      seen.set(key, (seen.get(key) ?? 0) + 1);
    }
    return new Set([...seen.entries()].filter(([, count]) => count > 1).map(([key]) => key));
  }, [value]);

  /** Suggested names not already in the list, which is what is worth offering. */
  const unusedSuggestions = React.useMemo(() => {
    if (!suggestions?.length) return [];
    const taken = new Set(value.map((entry) => entry.key.trim()).filter(Boolean));
    return suggestions.filter((name) => !taken.has(name));
  }, [suggestions, value]);

  const named = value.filter((entry) => entry.key.trim()).length;
  const summary =
    named === 0
      ? "None"
      : named === 1
        ? (value.find((entry) => entry.key.trim())?.key ?? "1 attribute")
        : `${named} attributes`;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        onOpenChange?.(next);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-attributes"
          data-disabled={disabled}
          className={cn(
            "group/inspector-attributes flex w-full cursor-pointer items-center gap-2 text-left",
            "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
            "[--inspector-radius:var(--radius-xl)] transition-colors",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
            sizeStyles[size],
            toneStyles[tone],
            className,
          )}
        >
          <span
            data-slot="inspector-attributes-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span
            data-slot="inspector-attributes-value"
            className={cn(
              "ml-auto min-w-0 truncate text-sm font-medium select-none",
              named === 0 ? "text-muted-foreground" : "text-foreground",
              // One name is shown as itself, and a name is a code value.
              named === 1 && "font-mono",
            )}
          >
            {summary}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-72 p-3"
      >
        <div className="flex flex-col gap-3">
          {value.length === 0 ? (
            <p className="text-sm text-foreground/70 select-none">
              Nothing here yet. Names go on the left, values on the right.
            </p>
          ) : (
            /*
             * The padding and the matching negative margin are what give the focus
             * ring somewhere to be drawn. `overflow-y-auto` clips its own children,
             * and a ring sits *outside* the field it belongs to, so without this the
             * ring on the first, last and left-most field was sliced off against the
             * scroll box — most visibly on the name field, whose ring met the edge on
             * two sides at once.
             */
            <div className="-mx-1 -my-1 flex max-h-64 flex-col gap-1.5 overflow-y-auto px-1 py-1">
              {value.map((entry, index) => {
                const clashes = duplicates.has(entry.key.trim());

                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: the pairs have no id, and a key made from the name would remount the field being typed in
                    key={index}
                    className="flex items-center gap-1.5"
                  >
                    <input
                      type="text"
                      value={entry.key}
                      disabled={disabled}
                      placeholder={keyPlaceholder}
                      autoComplete="off"
                      spellCheck={false}
                      aria-label={`${ariaLabel ?? label} name ${index + 1}`}
                      aria-invalid={clashes || undefined}
                      title={clashes ? "Used more than once" : undefined}
                      onChange={(event) =>
                        patch(index, { key: event.target.value.replace(INVALID_KEY, "") })
                      }
                      className={cn(
                        "h-8 min-w-0 flex-1 rounded-md border bg-transparent px-2",
                        "font-mono text-sm text-foreground outline-none",
                        "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
                        clashes ? "border-destructive" : "border-border",
                      )}
                    />

                    <input
                      type="text"
                      value={entry.value}
                      disabled={disabled}
                      placeholder={valuePlaceholder}
                      autoComplete="off"
                      spellCheck={false}
                      aria-label={`${ariaLabel ?? label} value ${index + 1}`}
                      onChange={(event) => patch(index, { value: event.target.value })}
                      className={cn(
                        "h-8 min-w-0 flex-1 rounded-md border border-border bg-transparent px-2",
                        "font-mono text-sm text-foreground outline-none",
                        "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
                      )}
                    />

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={disabled}
                      aria-label={`Remove ${entry.key.trim() || `attribute ${index + 1}`}`}
                      className={cn(
                        // Framed like the two fields it sits with, and the same
                        // height as them: bare, it read as a mark floating beside the
                        // line rather than as the third control on it.
                        "flex size-8 shrink-0 cursor-pointer items-center justify-center",
                        "rounded-md border border-border bg-transparent",
                        "text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground",
                        "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        "disabled:pointer-events-none disabled:opacity-40",
                      )}
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/*
            Suggestions as pressable names, not as a `<datalist>`.

            The native one was doing three things wrong at once: it painted its own
            dropper glyph inside the field, it opened a menu drawn by the browser in
            the browser's own language rather than this one, and it hid the whole
            feature behind a field the reader has to click into to discover. Pressing
            a name here adds the pair outright, which is what the reader wanted from
            the suggestion anyway; used names drop out of the list, so it also says
            what is left.
          */}
          {unusedSuggestions.length > 0 ? (
            <div
              data-slot="inspector-attributes-suggestions"
              className="flex flex-wrap gap-1"
            >
              {unusedSuggestions.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => addNamed(name)}
                  disabled={disabled || atCeiling}
                  title={`Add ${name}`}
                  className={cn(
                    "flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-md px-2",
                    "bg-foreground/5 font-mono text-sm text-foreground/70 select-none",
                    "transition-colors hover:bg-foreground/10 hover:text-foreground",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    "disabled:pointer-events-none disabled:opacity-40",
                  )}
                >
                  <PlusIcon className="size-3 shrink-0" />
                  <span className="truncate">{name}</span>
                </button>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={add}
            disabled={disabled || atCeiling}
            data-slot="inspector-attributes-add"
            className={cn(
              "flex w-full cursor-pointer items-center justify-center gap-1.5",
              "border-t border-border pt-2 text-sm font-medium text-foreground/70 select-none",
              "transition-colors hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:opacity-40",
            )}
          >
            <PlusIcon className="size-3.5" />
            Add attribute
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
