"use client";

import { ChevronDownIcon, type LucideIcon, XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the block. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/**
 * Padding and label metrics. The open height comes from the tags rather than from a
 * preset; `--inspector-height` is here for the closed state, where the block has to
 * measure exactly what a row of the family measures.
 */
type Size = "sm" | "default" | "lg";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent has-[input:focus-visible]:border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

/**
 * What ends a tag besides Enter. A comma is how anyone pastes a list, and the
 * tab and newline are what a spreadsheet cell brings with it.
 */
const SEPARATORS = /[,\n\r\t]/;

interface InspectorTagsProps {
  /** Label rendered above the tags, inside the block. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: string[];
  /** Initial value in uncontrolled mode. */
  defaultValue?: string[];
  /** Fires whenever a tag is added or removed, never mid-typing. */
  onValueChange?: (value: string[]) => void;

  /** Ghost text shown in the field while there is room for another tag. */
  placeholder?: string;
  /**
   * Most tags the block may hold. Setting it also puts a count beside the label,
   * since a limit nobody can see is a trap.
   */
  max?: number;
  /** Longest a single tag may be. */
  maxLength?: number;
  /**
   * Let the block be folded away, leaving its header. A long list of tags takes
   * several rows of a drawer and is usually written once, so the panel around it is
   * otherwise mostly a scroll past something nobody is editing. Folded, the header
   * still counts what is in there.
   */
  collapsible?: boolean;
  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /**
   * Whether it starts open in uncontrolled mode.
   * @defaultValue true */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Keep repeats. By default a tag already in the list is dropped. */
  allowDuplicates?: boolean;
  /**
   * Treat tags differing only in case as different. Off by default, so pasting
   * `React, react` leaves one tag.
   */
  caseSensitive?: boolean;

  /** Block interaction and dim the block. */
  disabled?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare until focus.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Padding preset.
   * @defaultValue "default" */
  size?: Size;

  /**
   * Name the tags submit under. Each tag becomes its own hidden input, which is
   * how a list reaches a server without being flattened into one string first.
   */
  name?: string;
  /** Id of the field. One is generated when it is left out. */
  id?: string;
  className?: string;
  /** Accessible name for the field. Falls back to the visible label. */
  "aria-label"?: string;
}

export const inspectorTagsDemo: InspectorTagsProps = {
  label: "Keywords",
  className: "w-72",
  collapsible: true,
  defaultValue: ["landing page", "saas", "pricing"],
  placeholder: "Add a keyword",
  max: 6,
};

export function InspectorTags({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder,
  max,
  maxLength,
  collapsible = false,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  allowDuplicates = false,
  caseSensitive = false,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorTagsProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue ?? []);
  const tags = valueProp ?? internalValue;

  /** What is being typed but is not a tag yet. */
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = collapsible ? (openProp ?? internalOpen) : true;

  const toggleOpen = () => {
    if (!collapsible) return;
    const next = !open;
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const full = max !== undefined && tags.length >= max;

  const setTags = (next: string[]) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const key = (tag: string) => (caseSensitive ? tag : tag.toLowerCase());

  /**
   * Takes one string that may hold several tags and adds whatever survives:
   * trimmed, deduped against both the list and the rest of the same paste, cut
   * off at `max`. Returning the count added lets the caller tell a full list
   * from a list of blanks.
   */
  const add = (raw: string) => {
    const parts = raw.split(SEPARATORS);
    const next = [...tags];
    const seen = new Set(next.map(key));

    for (const part of parts) {
      const tag = maxLength ? part.trim().slice(0, maxLength) : part.trim();
      if (!tag) continue;
      if (max !== undefined && next.length >= max) break;
      if (!allowDuplicates && seen.has(key(tag))) continue;
      seen.add(key(tag));
      next.push(tag);
    }

    if (next.length !== tags.length) setTags(next);
  };

  const remove = (index: number) => {
    setTags(tags.filter((_, position) => position !== index));
  };

  const handleChange = (raw: string) => {
    // A paste arrives as one change, so the separators in it are handled here
    // rather than in a paste handler: everything before the last separator is a
    // finished tag, and what follows keeps being typed.
    if (SEPARATORS.test(raw)) {
      const parts = raw.split(SEPARATORS);
      const trailing = parts.pop() ?? "";
      add(parts.join(","));
      setDraft(trailing.trim());
      return;
    }
    setDraft(maxLength ? raw.slice(0, maxLength) : raw);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Otherwise a block inside a form would submit it on the first tag.
      event.preventDefault();
      add(draft);
      setDraft("");
      return;
    }
    // Backspace on an empty field reaches back into the list, which is the one
    // gesture every tag field is expected to answer.
    if (event.key === "Backspace" && !draft && tags.length > 0) {
      event.preventDefault();
      remove(tags.length - 1);
    }
  };

  /*
   * How many are in there. With a ceiling it reads as a limit, which is what makes
   * the limit visible at all; without one it is only worth printing when the list can
   * be folded over, since then it is all the closed header has to say.
   */
  const count =
    max !== undefined || collapsible ? (
      <span
        data-slot="inspector-tags-count"
        aria-hidden="true"
        className="ml-auto shrink-0 font-mono text-sm tabular-nums text-foreground/70 select-none"
      >
        {max !== undefined ? `${tags.length}/${max}` : tags.length}
      </span>
    ) : null;

  return (
    /*
     * A block rather than a row: tags wrap, so the height comes from the content the
     * way inspector-textarea's does.
     *
     * The root is a `div`, not a `<label>`. It had to stop being one anyway: a label
     * may not contain interactive content, and this block is full of remove buttons —
     * which is exactly how a press on the block's empty space used to reach the first
     * tag's remove button and quietly delete it. The label is now the header text, and
     * says which field it names.
     */
    <div
      data-slot="inspector-tags"
      data-disabled={disabled}
      data-open={open || undefined}
      className={cn(
        "group/inspector-tags flex flex-col gap-1.5",
        "rounded-(--inspector-radius) p-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        // Closed, the block measures exactly what a row of the family measures.
        !open && "h-(--inspector-height) justify-center py-0",
        "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {collapsible ? (
        <button
          type="button"
          onClick={toggleOpen}
          disabled={disabled}
          aria-expanded={open}
          aria-controls={fieldId}
          data-slot="inspector-tags-trigger"
          className={cn(
            "flex w-full cursor-pointer items-center gap-2 text-left",
            "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
        >
          <span
            data-slot="inspector-tags-label"
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
        <div className="flex items-baseline gap-2">
          <label
            htmlFor={fieldId}
            data-slot="inspector-tags-label"
            className="flex min-w-0 cursor-text items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0 self-center" /> : null}
            <span className="truncate">{label}</span>
          </label>

          {count}
        </div>
      )}

      {/*
        Hidden while closed rather than unmounted: the hidden inputs below carry the
        list into the surrounding form, and a folded block that dropped them would be
        a trap.
      */}
      <div hidden={!open} className="flex flex-wrap items-center gap-1">
        {tags.map((tag, index) => (
          <span
            // Keyed by position: two tags can be equal when duplicates are kept,
            // and the key has to survive the one in front of it being removed.
            key={`${index}-${tag}`}
            data-slot="inspector-tags-tag"
            className="flex min-w-0 items-center gap-1 rounded-md bg-foreground/10 py-0.5 pr-1 pl-2 text-sm font-medium text-foreground select-none"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Remove ${tag}`}
              onClick={() => {
                remove(index);
                inputRef.current?.focus({ preventScroll: true });
              }}
              className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <XIcon className="size-3" />
            </button>
          </span>
        ))}

        {/*
          The field goes on sitting after the last tag, so adding several in a row
          never means aiming at anything. It disappears only when the list is
          full, since a field that cannot take a word is worse than no field.
        */}
        {full ? null : (
          <input
            ref={inputRef}
            id={fieldId}
            type="text"
            value={draft}
            placeholder={tags.length === 0 ? placeholder : undefined}
            maxLength={maxLength}
            disabled={disabled}
            aria-label={ariaLabel ?? label}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={handleKeyDown}
            // A typed word is a word the reader meant, so leaving the field keeps
            // it rather than throwing it away.
            onBlur={() => {
              if (!draft) return;
              add(draft);
              setDraft("");
            }}
            data-slot="inspector-tags-field"
            className="min-w-24 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
          />
        )}
      </div>

      {/* One input per tag, so the list arrives as a list. */}
      {name
        ? tags.map((tag, index) => (
            <input key={`${index}-${tag}-field`} type="hidden" name={name} value={tag} />
          ))
        : null}
    </div>
  );
}
