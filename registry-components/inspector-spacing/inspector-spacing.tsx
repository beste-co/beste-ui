"use client";

import { LinkIcon, type LucideIcon, SquareDashedIcon, UnlinkIcon } from "lucide-react";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** The row itself presses, so it answers hover like any other trigger in the family. */
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

/** The four edges, in CSS shorthand order. */
const EDGES = [
  { key: "top", label: "Top" },
  { key: "right", label: "Right" },
  { key: "bottom", label: "Bottom" },
  { key: "left", label: "Left" },
] as const;

type EdgeKey = (typeof EDGES)[number]["key"];

/** Four edge values. Anything missing counts as zero. */
type SpacingValue = Partial<Record<EdgeKey, number>>;

/** Everything a length cannot contain. Kept out of the field as it is typed. */
const NON_NUMERIC = /[^0-9.,-]/g;

function clamp(value: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, value));
}

function edgeValue(value: SpacingValue, edge: EdgeKey) {
  return value[edge] ?? 0;
}

/** Whether all four edges hold the same number, which is what "linked" means. */
function isUniform(value: SpacingValue) {
  const [first, ...rest] = EDGES.map((edge) => edgeValue(value, edge.key));
  return rest.every((entry) => entry === first);
}

/**
 * Collapse the four edges the way the CSS shorthand does: one number when they
 * all agree, two when the pairs do, four otherwise. That keeps the row short
 * enough for the label to stay whole, and anyone who has written CSS can already
 * read it.
 */
function summarize(value: SpacingValue): number[] {
  const [top, right, bottom, left] = EDGES.map((edge) => edgeValue(value, edge.key));
  const t = top ?? 0;
  const r = right ?? 0;
  const b = bottom ?? 0;
  const l = left ?? 0;
  if (t === r && r === b && b === l) return [t];
  if (t === b && r === l) return [t, r];
  return [t, r, b, l];
}

interface InspectorSpacingProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: SpacingValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: SpacingValue;
  /** Fires on every accepted keystroke and every step. */
  onValueChange?: (value: SpacingValue) => void;
  /** Fires once an edit is finished — Enter, or leaving a field. */
  onValueCommit?: (value: SpacingValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Smallest value an edge may hold.
   * @defaultValue 0 */
  min?: number;
  /**
   * Largest value an edge may hold.
   * @defaultValue 999 */
  max?: number;
  /**
   * Amount one arrow key press moves an edge.
   * @defaultValue 1 */
  step?: number;
  /** Muted unit after the summary, e.g. "px", "rem". */
  suffix?: string;

  /**
   * Start with the edges tied together. Defaults to on when the incoming value
   * already has four equal edges, which is the usual starting point.
   */
  defaultLinked?: boolean;
  /** Controlled link state, if the toggle belongs to your own state. */
  linked?: boolean;
  onLinkedChange?: (linked: boolean) => void;
  /** Drop the link toggle and always edit the four edges separately. */
  hideLink?: boolean;

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
  /** Accessible name for the group. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorSpacingDemo: InspectorSpacingProps = {
  label: "Padding",
  className: "w-72",
  defaultValue: { top: 16, right: 24, bottom: 16, left: 24 },
  suffix: "px",
};

export function InspectorSpacing({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOpenChange,
  min = 0,
  max = 999,
  step = 1,
  suffix,
  defaultLinked,
  linked: linkedProp,
  onLinkedChange,
  hideLink = false,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorSpacingProps) {
  const [internalValue, setInternalValue] = React.useState<SpacingValue>(defaultValue ?? {});
  const value = valueProp ?? internalValue;

  const [internalLinked, setInternalLinked] = React.useState(
    defaultLinked ?? isUniform(valueProp ?? defaultValue ?? {}),
  );
  const linked = linkedProp ?? internalLinked;

  /** Which edge is being typed into, and the raw text in it. */
  const [draft, setDraft] = React.useState<{ edge: EdgeKey; text: string } | null>(null);

  const valueRef = React.useRef(value);
  valueRef.current = value;
  const committedRef = React.useRef(value);

  const write = (next: SpacingValue) => {
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const commit = () => {
    const current = valueRef.current;
    const previous = committedRef.current;
    if (EDGES.every((edge) => edgeValue(current, edge.key) === edgeValue(previous, edge.key))) {
      return;
    }
    committedRef.current = current;
    onValueCommit?.(current);
  };

  /** Set one edge, or all four while they are tied together. */
  const setEdge = (edge: EdgeKey, raw: number) => {
    const amount = clamp(raw, min, max);
    if (linked) {
      write({ top: amount, right: amount, bottom: amount, left: amount });
      return;
    }
    write({ ...valueRef.current, [edge]: amount });
  };

  const toggleLinked = () => {
    const next = !linked;
    if (linkedProp === undefined) setInternalLinked(next);
    onLinkedChange?.(next);
    // Tying them together has to agree on a number, and the top edge is the one
    // the eye starts on.
    if (next) {
      const amount = clamp(edgeValue(valueRef.current, "top"), min, max);
      write({ top: amount, right: amount, bottom: amount, left: amount });
      commit();
    }
  };

  const acceptDraft = (edge: EdgeKey) => {
    const raw = draft?.edge === edge ? draft.text : undefined;
    setDraft(null);
    if (raw !== undefined) {
      const parsed = Number.parseFloat(raw.replace(",", "."));
      if (Number.isFinite(parsed)) setEdge(edge, parsed);
    }
    commit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, edge: EdgeKey) => {
    const current = edgeValue(valueRef.current, edge);
    const amount = step * (event.shiftKey ? 10 : 1);

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setDraft(null);
      setEdge(edge, current + amount);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setDraft(null);
      setEdge(edge, current - amount);
    } else if (event.key === "Enter") {
      event.preventDefault();
      acceptDraft(edge);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setDraft(null);
    }
  };

  /**
   * One edge field. Its place in the cross is what says which edge it is, so it
   * carries no letter — that lettering is exactly what made the row unreadable.
   */
  const field = (edge: EdgeKey, edgeLabel: string) => (
    <input
      key={edge}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck={false}
      value={draft?.edge === edge ? draft.text : String(edgeValue(value, edge))}
      disabled={disabled}
      aria-label={`${ariaLabel ?? label} ${edgeLabel.toLowerCase()}`}
      title={edgeLabel}
      // Letters have no business in a length: they are dropped as they are typed,
      // rather than accepted and then quietly discarded on blur. What is left
      // still allows the half-typed states — empty, a lone minus, a trailing
      // separator — that a number field has to pass through.
      onChange={(event) => setDraft({ edge, text: event.target.value.replace(NON_NUMERIC, "") })}
      onBlur={() => acceptDraft(edge)}
      onKeyDown={(event) => handleKeyDown(event, edge)}
      data-slot={`inspector-spacing-${edge}`}
      className={cn(
        "h-7 w-12 shrink-0 rounded-md border border-border bg-background px-1",
        "text-center font-mono text-sm font-medium tabular-nums text-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      )}
    />
  );

  const summary = summarize(value);

  return (
    <Popover onOpenChange={onOpenChange}>
      {/*
        The row is the trigger, not the summary inside it: that is what lets the
        editor take the trigger width and open flush with the row. Nothing else in
        the row presses, so a single button is legal and unambiguous.
      */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-spacing"
          data-disabled={disabled}
          className={cn(
            "group/inspector-spacing flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-spacing-label"
            className="flex min-w-0 shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span className="ml-auto flex min-w-0 items-center gap-1.5">
            <span
              data-slot="inspector-spacing-summary"
              className="truncate font-mono text-sm font-medium tabular-nums text-foreground select-none"
            >
              {summary.join(" ")}
            </span>
            {suffix ? (
              <span aria-hidden="true" className="text-sm font-medium text-foreground/70 select-none">
                {suffix}
              </span>
            ) : null}
            <SquareDashedIcon className="size-4 shrink-0 text-foreground/70" />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-56 p-2"
      >
        {/*
          No heading: the editor opens flush under a row that already reads
          "Padding … 16 24 px", so repeating the label and the unit inside it only
          spent the panel's height.

          A plus, built as a column with a row through it, rather than a 3x3 grid.
          One `gap` then sets all four distances at once, so each field sits the
          same span away from the centre — a grid gave the middle cell whatever
          width was left over, which pushed left and right out while top and bottom
          stayed tight against it. It also shrink-wraps, so the panel carries no
          empty corners.
        */}
        {/*
          The four fields stand on a ground of their own, the way the position pad
          does: they describe the space around a box, and a shape like that needs a
          surface to be a shape *on*. It also puts the fields' own `bg-background`
          to work — raised against the muted ground instead of invisible against the
          panel it used to share a colour with.
        */}
        <div
          data-slot="inspector-spacing-ground"
          className="flex justify-center rounded-md bg-muted p-3"
        >
          <div
            data-slot="inspector-spacing-fields"
            className="flex w-fit flex-col items-center gap-1.5"
          >
            {field("top", "Top")}

            <div className="flex items-center gap-1.5">
              {field("left", "Left")}

              {/* The box the four numbers surround, drawn as one. */}
              {hideLink ? (
                <span
                  aria-hidden="true"
                  className="size-7 shrink-0 rounded-md border border-dashed border-border"
                />
              ) : (
                <button
                  type="button"
                  onClick={toggleLinked}
                  disabled={disabled}
                  aria-pressed={linked}
                  aria-label={linked ? "Edit each edge separately" : "Tie the edges together"}
                  title={linked ? "Edit each edge separately" : "Tie the edges together"}
                  data-slot="inspector-spacing-link"
                  className={cn(
                    "flex size-7 shrink-0 cursor-pointer items-center justify-center",
                    "rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    linked
                      ? "border border-border bg-foreground/10 text-foreground"
                      : "border border-dashed border-border text-foreground/70 hover:bg-foreground/10 hover:text-foreground",
                  )}
                >
                  {linked ? <LinkIcon className="size-3.5" /> : <UnlinkIcon className="size-3.5" />}
                </button>
              )}

              {field("right", "Right")}
            </div>

            {field("bottom", "Bottom")}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
