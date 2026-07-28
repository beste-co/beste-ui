"use client";

import { CheckIcon, ChevronsUpDownIcon, type LucideIcon, SearchIcon, XIcon } from "lucide-react";
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

/** Number of options above which the search field earns its place. */
const SEARCH_THRESHOLD = 8;

interface InspectorComboboxOption {
  /** Reported on selection, and what a controlled value is matched against. */
  value: string;
  /** How it reads. Falls back to `value`. */
  label?: string;
  /** Second line under the label, for an option a name cannot explain on its own. */
  description?: string;
  /** Leading mark. A glyph for a kind of thing, a swatch for a colour. */
  icon?: LucideIcon;
  swatch?: string;
  /** Heading this option sits under. Options keep the order they are given in. */
  group?: string;
  /**
   * Extra words the search matches against — a synonym, a code, a country's other
   * name — none of which have to be in the label to be worth typing.
   */
  keywords?: string[];
  disabled?: boolean;
}

/** A string when choosing one, an array when `multiple` is set. */
type ComboboxValue = string | string[];

interface InspectorComboboxProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** The options on offer. */
  options?: (string | InspectorComboboxOption)[];

  /**
   * Controlled selection: a string, or an array of them with `multiple`. Pair it
   * with `onValueChange`.
   */
  value?: ComboboxValue;
  /** Initial selection in uncontrolled mode. */
  defaultValue?: ComboboxValue;
  /**
   * Fires on every selection. The argument is a string, or an array of them when
   * `multiple` is set — narrow it at the call site, which knows which it asked for.
   */
  onValueChange?: (value: ComboboxValue) => void;
  /** Fires when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /** Choose several. The row then counts them and the list keeps itself open. */
  multiple?: boolean;
  /** Ceiling on how many may be chosen at once, with `multiple`. */
  max?: number;

  /**
   * Show the search field. Defaults to on once there are more than eight options,
   * which is the point at which reading the list stops being faster than typing.
   */
  searchable?: boolean;
  /** Ghost text for the search field. */
  searchPlaceholder?: string;
  /** Shown in the row while nothing is selected. */
  placeholder?: string;
  /** Message shown when nothing matches the search. */
  emptyMessage?: string;
  /** Offer a clear button at the foot of the list once something is selected. */
  clearable?: boolean;

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

export const inspectorComboboxDemo: InspectorComboboxProps = {
  label: "Link to",
  className: "w-72",
  defaultValue: "pricing",
  searchable: true,
  options: [
    { value: "home", label: "Home", group: "Pages" },
    { value: "pricing", label: "Pricing", group: "Pages" },
    { value: "about", label: "About", group: "Pages" },
    { value: "contact", label: "Contact", group: "Pages" },
    { value: "blog", label: "Blog index", group: "Pages" },
    { value: "changelog", label: "Changelog", group: "Pages" },
    { value: "docs", label: "Documentation", group: "Pages", keywords: ["help", "guide"] },
    { value: "cart", label: "Cart", group: "Shop" },
    { value: "checkout", label: "Checkout", group: "Shop" },
    { value: "account", label: "Account", group: "Shop" },
  ],
};

/**
 * The select for a list too long to read. inspector-select is the right row for a
 * handful of choices; past that the reader knows what they are looking for and
 * wants to type it, which is a filter field and a keyboard that walks the results.
 *
 * The row is the trigger outright, so the list can take the trigger's width and
 * open flush with the row — the same shape inspector-icon and inspector-media
 * settled on.
 */
export function InspectorCombobox({
  label,
  icon: Icon,
  options = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  onOpenChange,
  multiple = false,
  max,
  searchable,
  searchPlaceholder = "Search",
  placeholder = "",
  emptyMessage = "Nothing found",
  clearable = false,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorComboboxProps) {
  const items = React.useMemo(
    () => options.map((entry) => (typeof entry === "string" ? { value: entry } : entry)),
    [options],
  );

  const [internalValue, setInternalValue] = React.useState<ComboboxValue>(
    defaultValue ?? (multiple ? [] : ""),
  );
  const value = valueProp ?? internalValue;
  const selected = React.useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value],
  );

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);

  const listId = React.useId();
  const showSearch = searchable ?? items.length > SEARCH_THRESHOLD;

  const matches = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => {
      const haystack = [item.value, item.label, item.description, ...(item.keywords ?? [])];
      return haystack.some((part) => part?.toLowerCase().includes(needle));
    });
  }, [items, query]);

  /*
   * Group headings are derived rather than configured: an option says which group
   * it belongs to, and the first option of each group brings its heading with it.
   * That keeps the order the caller wrote and needs no second data structure for
   * the search to filter.
   */
  const rows = React.useMemo(
    () =>
      matches.map((item, index) => ({
        item,
        index,
        heading: item.group && item.group !== matches[index - 1]?.group ? item.group : null,
      })),
    [matches],
  );

  const atCeiling = multiple && max !== undefined && selected.length >= max;

  const commit = (next: ComboboxValue) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const select = (option: InspectorComboboxOption) => {
    if (option.disabled) return;

    if (!multiple) {
      commit(option.value);
      setOpen(false);
      onOpenChange?.(false);
      return;
    }

    // Values come back in the options' own order, never in press order, so a
    // stored array can be compared against the next one without sorting first.
    const has = selected.includes(option.value);
    if (!has && atCeiling) return;
    const nextSet = new Set(selected);
    if (has) nextSet.delete(option.value);
    else nextSet.add(option.value);
    commit(items.filter((entry) => nextSet.has(entry.value)).map((entry) => entry.value));
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
    if (next) {
      // A list opens on a clean search, with the cursor on what is already chosen.
      setQuery("");
      const first = items.findIndex((item) => selected.includes(item.value));
      setActiveIndex(first === -1 ? 0 : first);
    }
  };

  const move = (delta: number) => {
    if (matches.length === 0) return;
    setActiveIndex((current) => {
      let next = current;
      // Step over disabled options rather than resting on one: an active row that
      // does nothing on Enter is a dead end the keyboard cannot see.
      for (let attempt = 0; attempt < matches.length; attempt += 1) {
        next = (next + delta + matches.length) % matches.length;
        if (!matches[next]?.disabled) break;
      }
      return next;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(Math.max(matches.length - 1, 0));
        break;
      case "Enter": {
        const target = matches[activeIndex];
        if (!target) return;
        event.preventDefault();
        select(target);
        break;
      }
      default:
        break;
    }
  };

  const summary = React.useMemo(() => {
    if (selected.length === 0) return placeholder;
    const labels = items
      .filter((item) => selected.includes(item.value))
      .map((item) => item.label ?? item.value);
    if (labels.length === 0) return placeholder;
    // One name reads better than "1 selected"; several do not fit, and a count is
    // the one summary that stays true at any width.
    if (labels.length === 1) return labels[0];
    return `${labels.length} selected`;
  }, [items, placeholder, selected]);

  /** Focus target when there is no search field to take it. */
  const listRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (open && !showSearch) listRef.current?.focus();
  }, [open, showSearch]);

  const activeId = matches[activeIndex] ? `${listId}-option-${activeIndex}` : undefined;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-combobox"
          data-disabled={disabled}
          className={cn(
            "group/inspector-combobox flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-combobox-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span
            data-slot="inspector-combobox-value"
            className={cn(
              "ml-auto min-w-0 truncate text-sm font-medium select-none",
              selected.length > 0 ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {summary}
          </span>

          <ChevronsUpDownIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-foreground/70"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-56 p-2"
      >
        {showSearch ? (
          <div className="relative mb-2">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-foreground/70" />
            <input
              type="text"
              role="combobox"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              aria-label={`Search ${label}`}
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={activeId}
              autoComplete="off"
              className={cn(
                "h-8 w-full rounded-md border border-border bg-transparent pr-2 pl-8",
                "text-sm outline-none placeholder:text-muted-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring/50",
              )}
            />
          </div>
        ) : null}

        {matches.length === 0 ? (
          <p className="px-1 py-2 text-sm text-foreground/70 select-none">{emptyMessage}</p>
        ) : (
          <div
            id={listId}
            ref={listRef}
            role="listbox"
            aria-label={label}
            aria-multiselectable={multiple || undefined}
            aria-activedescendant={showSearch ? undefined : activeId}
            tabIndex={showSearch ? -1 : 0}
            onKeyDown={showSearch ? undefined : handleKeyDown}
            className="flex max-h-64 flex-col gap-0.5 overflow-y-auto outline-none"
          >
            {rows.map(({ item, index, heading }) => {
              const isSelected = selected.includes(item.value);
              const isActive = index === activeIndex;
              const OptionIcon = item.icon;
              const blocked = item.disabled || (!isSelected && atCeiling);

              return (
                <React.Fragment key={item.value}>
                  {heading ? (
                    <span className="px-2 pt-2 pb-1 text-sm font-medium text-foreground/70 select-none">
                      {heading}
                    </span>
                  ) : null}

                  {/*
                    Options are not buttons: focus stays on the search field so
                    typing never leaves it, and the active option is named by
                    `aria-activedescendant` instead. A press still works because a
                    pointer does not need focus to land.
                  */}
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard works the list from the field above, which is where focus stays */}
                  <div
                    id={`${listId}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={blocked || undefined}
                    onClick={() => select(item)}
                    onPointerMove={() => setActiveIndex(index)}
                    className={cn(
                      "flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5",
                      "text-sm select-none",
                      isActive ? "bg-accent text-accent-foreground" : "text-foreground",
                      blocked && "pointer-events-none opacity-40",
                    )}
                  >
                    {item.swatch ? (
                      <span
                        aria-hidden="true"
                        className="size-3.5 shrink-0 rounded-full border border-border"
                        style={{ background: item.swatch }}
                      />
                    ) : null}
                    {OptionIcon ? <OptionIcon className="size-4 shrink-0" /> : null}

                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{item.label ?? item.value}</span>
                      {item.description ? (
                        <span className="truncate text-sm text-foreground/70">
                          {item.description}
                        </span>
                      ) : null}
                    </span>

                    {isSelected ? (
                      <CheckIcon aria-hidden="true" className="ml-auto size-4 shrink-0" />
                    ) : null}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/*
          Clearing sits with the choosing, as it does in inspector-icon: it is the
          same decision, and a word says it in a way a glyph in the row cannot.
        */}
        {clearable && selected.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              commit(multiple ? [] : "");
              if (!multiple) {
                setOpen(false);
                onOpenChange?.(false);
              }
            }}
            data-slot="inspector-combobox-clear"
            className={cn(
              "mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5",
              "border-t border-border pt-2 text-sm font-medium text-foreground/70 select-none",
              "transition-colors hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            <XIcon className="size-3.5" />
            Clear {label}
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
