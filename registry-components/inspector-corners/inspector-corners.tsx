"use client";

import { LinkIcon, type LucideIcon, UnlinkIcon } from "lucide-react";
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

/** Everything a radius cannot contain. Kept out of the field as it is typed. */
const NON_NUMERIC = /[^0-9.,-]/g;

/** The four corners, in the order the CSS shorthand takes them. */
const CORNERS = [
  { key: "topLeft", label: "Top left", cell: "col-start-1 row-start-1" },
  { key: "topRight", label: "Top right", cell: "col-start-3 row-start-1" },
  { key: "bottomRight", label: "Bottom right", cell: "col-start-3 row-start-3" },
  { key: "bottomLeft", label: "Bottom left", cell: "col-start-1 row-start-3" },
] as const;

type CornerKey = (typeof CORNERS)[number]["key"];

/** Four corner radii. Anything missing counts as zero. */
type CornersValue = Partial<Record<CornerKey, number>>;

function clamp(value: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, value));
}

function cornerValue(value: CornersValue, corner: CornerKey) {
  return value[corner] ?? 0;
}

/** Whether all four corners hold the same number, which is what "linked" means. */
function isUniform(value: CornersValue) {
  const [first, ...rest] = CORNERS.map((corner) => cornerValue(value, corner.key));
  return rest.every((entry) => entry === first);
}

/**
 * Collapse the four corners the way the `border-radius` shorthand does: one number
 * when they all agree, two when the diagonals do, four otherwise. It keeps the row
 * short, and it is the notation anyone who has written CSS already reads.
 */
function summarize(value: CornersValue): number[] {
  const [tl, tr, br, bl] = CORNERS.map((corner) => cornerValue(value, corner.key));
  const a = tl ?? 0;
  const b = tr ?? 0;
  const c = br ?? 0;
  const d = bl ?? 0;
  if (a === b && b === c && c === d) return [a];
  if (a === c && b === d) return [a, b];
  return [a, b, c, d];
}

interface InspectorCornersProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: CornersValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: CornersValue;
  /** Fires on every accepted keystroke and every step. */
  onValueChange?: (value: CornersValue) => void;
  /** Fires once an edit is finished — Enter, or leaving a field. */
  onValueCommit?: (value: CornersValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Smallest radius a corner may hold.
   * @defaultValue 0 */
  min?: number;
  /**
   * Largest radius a corner may hold.
   * @defaultValue 999 */
  max?: number;
  /**
   * Amount one arrow key press moves a corner.
   * @defaultValue 1 */
  step?: number;
  /** Muted unit after the summary, e.g. "px", "rem". */
  suffix?: string;

  /**
   * Start with the corners tied together. Defaults to on when the incoming value
   * already has four equal corners, which is the usual starting point.
   */
  defaultLinked?: boolean;
  /** Controlled link state, if the toggle belongs to your own state. */
  linked?: boolean;
  onLinkedChange?: (linked: boolean) => void;
  /** Drop the link toggle and always edit the four corners separately. */
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

export const inspectorCornersDemo: InspectorCornersProps = {
  label: "Radius",
  className: "w-72",
  defaultValue: { topLeft: 12, topRight: 12, bottomRight: 4, bottomLeft: 4 },
  suffix: "px",
};

export function InspectorCorners({
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
}: InspectorCornersProps) {
  const [internalValue, setInternalValue] = React.useState<CornersValue>(defaultValue ?? {});
  const value = valueProp ?? internalValue;

  const [internalLinked, setInternalLinked] = React.useState(
    defaultLinked ?? isUniform(valueProp ?? defaultValue ?? {}),
  );
  const linked = linkedProp ?? internalLinked;

  /** Which corner is being typed into, and the raw text in it. */
  const [draft, setDraft] = React.useState<{ corner: CornerKey; text: string } | null>(null);

  const valueRef = React.useRef(value);
  valueRef.current = value;
  const committedRef = React.useRef(value);

  const write = (next: CornersValue) => {
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const commit = () => {
    const current = valueRef.current;
    const previous = committedRef.current;
    if (CORNERS.every((c) => cornerValue(current, c.key) === cornerValue(previous, c.key))) return;
    committedRef.current = current;
    onValueCommit?.(current);
  };

  /** Set one corner, or all four while they are tied together. */
  const setCorner = (corner: CornerKey, raw: number) => {
    const amount = clamp(raw, min, max);
    if (linked) {
      write({ topLeft: amount, topRight: amount, bottomRight: amount, bottomLeft: amount });
      return;
    }
    write({ ...valueRef.current, [corner]: amount });
  };

  const toggleLinked = () => {
    const next = !linked;
    if (linkedProp === undefined) setInternalLinked(next);
    onLinkedChange?.(next);
    // Tying them together has to agree on a number, and the top left corner is
    // where both the eye and the shorthand start.
    if (next) {
      const amount = clamp(cornerValue(valueRef.current, "topLeft"), min, max);
      write({ topLeft: amount, topRight: amount, bottomRight: amount, bottomLeft: amount });
      commit();
    }
  };

  const acceptDraft = (corner: CornerKey) => {
    const raw = draft?.corner === corner ? draft.text : undefined;
    setDraft(null);
    if (raw !== undefined) {
      const parsed = Number.parseFloat(raw.replace(",", "."));
      if (Number.isFinite(parsed)) setCorner(corner, parsed);
    }
    commit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, corner: CornerKey) => {
    const current = cornerValue(valueRef.current, corner);
    const amount = step * (event.shiftKey ? 10 : 1);

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setDraft(null);
      setCorner(corner, current + amount);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setDraft(null);
      setCorner(corner, current - amount);
    } else if (event.key === "Enter") {
      event.preventDefault();
      acceptDraft(corner);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setDraft(null);
    }
  };

  const summary = summarize(value);

  return (
    <Popover onOpenChange={onOpenChange}>
      {/*
        The row is the trigger, so the editor can take the trigger width and open
        flush with the row. Nothing else in the row presses.
      */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-corners"
          data-disabled={disabled}
          className={cn(
            "group/inspector-corners flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-corners-label"
            className="flex min-w-0 shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span className="ml-auto flex min-w-0 items-center gap-1.5">
            <span
              data-slot="inspector-corners-summary"
              className="truncate font-mono text-sm font-medium tabular-nums text-foreground select-none"
            >
              {summary.join(" ")}
            </span>
            {suffix ? (
              <span aria-hidden="true" className="text-sm font-medium text-foreground/70 select-none">
                {suffix}
              </span>
            ) : null}
            {/* The glyph carries the current radius, so the row shows the shape it
                is describing and not only its numbers. */}
            <span
              aria-hidden="true"
              data-slot="inspector-corners-preview"
              className="size-4 shrink-0 border-2 border-muted-foreground"
              style={{
                borderRadius: CORNERS.map(
                  (corner) => `${Math.min(cornerValue(value, corner.key), 8)}px`,
                ).join(" "),
              }}
            />
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
          Each field sits on the corner it sets, so position carries the meaning.
          Every track is sized to its own content and one `gap` separates them, so
          the four fields stand the same distance from the middle — a track left at
          `1fr` would hand the middle whatever width was spare and pull the
          diagonals apart.

          The four stand on a ground of their own, the way the spacing editor and the
          position pad do: they describe a shape, and a shape needs a surface to be a
          shape *on*. It also puts the fields' own `bg-background` to work, raised
          against the muted ground rather than lost against a panel the same colour.
        */}
        <div
          data-slot="inspector-corners-ground"
          className="flex justify-center rounded-md bg-muted p-3"
        >
          <div
            data-slot="inspector-corners-fields"
            className="grid w-fit grid-cols-[auto_auto_auto] grid-rows-[auto_auto_auto] gap-1.5"
          >
            {CORNERS.map((corner) => (
              <input
                key={corner.key}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                value={
                  draft?.corner === corner.key
                    ? draft.text
                    : String(cornerValue(value, corner.key))
                }
                disabled={disabled}
                aria-label={`${ariaLabel ?? label} ${corner.label.toLowerCase()}`}
                title={corner.label}
                onChange={(event) =>
                  setDraft({ corner: corner.key, text: event.target.value.replace(NON_NUMERIC, "") })
                }
                onBlur={() => acceptDraft(corner.key)}
                onKeyDown={(event) => handleKeyDown(event, corner.key)}
                data-slot={`inspector-corners-${corner.key}`}
                className={cn(
                  corner.cell,
                  "h-7 w-12 shrink-0 rounded-md border border-border bg-background px-1",
                  "text-center font-mono text-sm font-medium tabular-nums text-foreground",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                )}
              />
            ))}

            {/* The middle holds the shape the four numbers round off. */}
            {hideLink ? (
              <span
                aria-hidden="true"
                className="col-start-2 row-start-2 size-7 shrink-0 rounded-md border border-dashed border-border"
              />
            ) : (
              <button
                type="button"
                onClick={toggleLinked}
                disabled={disabled}
                aria-pressed={linked}
                aria-label={linked ? "Edit each corner separately" : "Tie the corners together"}
                title={linked ? "Edit each corner separately" : "Tie the corners together"}
                data-slot="inspector-corners-link"
                className={cn(
                  "col-start-2 row-start-2 flex size-7 shrink-0 cursor-pointer items-center justify-center",
                  "rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  linked
                    ? "border border-border bg-foreground/10 text-foreground"
                    : "border border-dashed border-border text-foreground/70 hover:bg-foreground/10 hover:text-foreground",
                )}
              >
                {linked ? <LinkIcon className="size-3.5" /> : <UnlinkIcon className="size-3.5" />}
              </button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
