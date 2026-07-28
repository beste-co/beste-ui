"use client";

import { type LucideIcon, MoveHorizontalIcon, MoveVerticalIcon } from "lucide-react";
import * as React from "react";
import { InspectorSegmented } from "@/components/beste/component/inspector-segmented";
import { InspectorSelect } from "@/components/beste/component/inspector-select";
import { InspectorTabs } from "@/components/beste/component/inspector-tabs";
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

/** Where things sit along an axis. */
type Place = "start" | "center" | "end";
/** How the spare room along the main axis is handed out. */
type Distribute = "packed" | "between" | "around" | "evenly";
type Direction = "row" | "column";

interface AlignValue {
  /** Along the main axis — the one `direction` names. */
  justify?: Place;
  /** Across it. */
  align?: Place | "stretch";
  /** Which way the main axis runs. */
  direction?: Direction;
  /**
   * What happens to the spare room on the main axis. `packed` leaves it where
   * `justify` says; the rest ignore `justify`, because they are answers to the
   * same question.
   */
  distribute?: Distribute;
}

const PLACES: Place[] = ["start", "center", "end"];

const PLACE_WORDS: Record<Place | "stretch", string> = {
  start: "Start",
  center: "Center",
  end: "End",
  stretch: "Stretch",
};

/** Vertical placement reads as top/middle/bottom, which is what a reader says. */
const VERTICAL_WORDS: Record<Place, string> = {
  start: "top",
  center: "middle",
  end: "bottom",
};

const DISTRIBUTE_WORDS: Record<Distribute, string> = {
  packed: "Packed",
  between: "Space between",
  around: "Space around",
  evenly: "Space evenly",
};

/** What each value is called in CSS, which is what `toCss` writes. */
const CSS_PLACE: Record<Place | "stretch", string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

const CSS_DISTRIBUTE: Record<Distribute, string> = {
  packed: "",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

/**
 * The CSS the value stands for. Exported because a panel that sets alignment has
 * to write it somewhere, and every consumer otherwise rebuilds this mapping — the
 * one part of the component that is not about the picking.
 */
export function alignToCss(value: AlignValue): {
  flexDirection: Direction;
  justifyContent: string;
  alignItems: string;
} {
  const distribute = value.distribute ?? "packed";
  return {
    flexDirection: value.direction ?? "row",
    justifyContent:
      distribute === "packed"
        ? CSS_PLACE[value.justify ?? "start"]
        : CSS_DISTRIBUTE[distribute],
    alignItems: CSS_PLACE[value.align ?? "start"],
  };
}

interface InspectorAlignProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: AlignValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: AlignValue;
  onValueChange?: (value: AlignValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Offer the direction, which decides which axis `justify` is on.
   * @defaultValue true */
  directional?: boolean;
  /**
   * Offer space-between and its neighbours.
   * @defaultValue true */
  distributable?: boolean;
  /**
   * Offer `stretch` across the cross axis.
   * @defaultValue true */
  stretchable?: boolean;

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

export const inspectorAlignDemo: InspectorAlignProps = {
  label: "Align",
  className: "w-72",
  defaultValue: { justify: "center", align: "center", direction: "row", distribute: "packed" },
};

/**
 * Where the contents of a box sit in it.
 *
 * The nine cells are the value, which is what makes this different from
 * inspector-position: that one is a point on a picture and takes any pair of
 * numbers, this one is a pair of keywords with three settings each, and a pad that
 * snaps is the wrong shape for a value that was never continuous.
 *
 * The grid is drawn in **visual** terms — left/centre/right by top/middle/bottom —
 * and mapped onto `justify` and `align` afterwards, because those two swap places
 * the moment the direction is a column, and a reader picking a corner should not
 * have to hold that in their head.
 */
export function InspectorAlign({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onOpenChange,
  directional = true,
  distributable = true,
  stretchable = true,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorAlignProps) {
  const [internalValue, setInternalValue] = React.useState<AlignValue>(
    defaultValue ?? { justify: "start", align: "start", direction: "row", distribute: "packed" },
  );
  const value = valueProp ?? internalValue;
  const [open, setOpen] = React.useState(false);

  const direction = value.direction ?? "row";
  const distribute = value.distribute ?? "packed";
  const justify = value.justify ?? "start";
  const align = value.align ?? "start";

  const write = (patch: Partial<AlignValue>) => {
    const next = { ...value, ...patch };
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  /*
   * The two mappings between what is drawn and what is stored. `justify` is on the
   * main axis, which is horizontal in a row and vertical in a column, so the grid's
   * own axes have to be translated in both directions.
   */
  const horizontal: Place = direction === "row" ? justify : placeOf(align);
  const vertical: Place = direction === "row" ? placeOf(align) : justify;

  const pick = (h: Place, v: Place) => {
    const main = direction === "row" ? h : v;
    const cross = direction === "row" ? v : h;
    // Choosing a cell is choosing where things are packed, so it takes the
    // distribution back off `space-between` rather than setting a value the CSS
    // will then ignore.
    write({ justify: main, align: cross, distribute: "packed" });
  };

  const summary =
    distribute === "packed"
      ? `${PLACE_WORDS[direction === "row" ? justify : align]} ${
          VERTICAL_WORDS[direction === "row" ? placeOf(align) : justify]
        }`.trim()
      : DISTRIBUTE_WORDS[distribute];

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
          data-slot="inspector-align"
          data-disabled={disabled}
          className={cn(
            "group/inspector-align flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-align-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span
            data-slot="inspector-align-value"
            className="ml-auto min-w-0 truncate text-sm font-medium text-foreground select-none"
          >
            {summary}
          </span>

          {/* The same picture the cells are drawn with, at row scale: three bars
              sitting where the value puts them. */}
          <span
            aria-hidden="true"
            data-slot="inspector-align-glyph"
            className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-border"
          >
            <Bars horizontal={horizontal} vertical={vertical} direction={direction} compact />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-2"
      >
        {/*
          The pad on its own surface at the top, the way inspector-shadow gives its
          preview one: it is the control the editor is for, and the settings under it
          are qualifications of the choice made here.
        */}
        <div className="mb-2 flex justify-center rounded-md bg-muted/50 py-3">
          {/* A group, not a `grid`: the ARIA grid pattern wants rows and cells and
              a keyboard that walks them, and these are nine buttons Tab already
              reaches in the order they read. */}
          {/* biome-ignore lint/a11y/useSemanticElements: a fieldset wants a legend, and the name for this set is the row that opened it */}
          <div
            role="group"
            aria-label={`${ariaLabel ?? label} placement`}
            className="grid grid-cols-3 gap-1"
          >
            {PLACES.map((v) =>
              PLACES.map((h) => {
                const isActive = distribute === "packed" && h === horizontal && v === vertical;
                return (
                  <button
                    key={`${h}-${v}`}
                    type="button"
                    onClick={() => pick(h, v)}
                    aria-pressed={isActive}
                    aria-label={`${PLACE_WORDS[h]} ${VERTICAL_WORDS[v]}`}
                    title={`${PLACE_WORDS[h]} ${VERTICAL_WORDS[v]}`}
                    className={cn(
                      "flex size-10 cursor-pointer items-center justify-center rounded-md border",
                      "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      isActive
                        ? "border-foreground/20 bg-foreground/10"
                        : "border-border bg-background hover:bg-accent",
                    )}
                  >
                    <Bars horizontal={h} vertical={v} direction={direction} />
                  </button>
                );
              }),
            )}
          </div>
        </div>

        {/*
          Pieces of the family rather than three hand-built label-and-buttons blocks,
          which is what this was and what made it read as a stack of loose parts with
          headings of their own.

          Which piece each one is follows from the choice it holds: four options read
          one at a time are a menu, two read together are a segmented row, and the one
          that needs no name at all is a tab strip.
        */}
        <div className="flex flex-col gap-1">
          {/*
            Direction carries no label, unlike the two rows under it. It is not a
            setting the reader looks up by name — it says which way the pad above is
            being read, so it belongs to the pad rather than to the list, and the two
            words are their own label. A tab strip is the shape for that; a labelled
            row would be claiming it is the first of three settings.
          */}
          {directional ? (
            <InspectorTabs
              aria-label="Direction"
              size="sm"
              tabs={[
                { value: "row", label: "Row", icon: MoveHorizontalIcon },
                { value: "column", label: "Column", icon: MoveVerticalIcon },
              ]}
              value={direction}
              onValueChange={(next) => write({ direction: next as Direction })}
            />
          ) : null}

          {distributable ? (
            <InspectorSelect
              label="Distribute"
              size="sm"
              options={(Object.keys(DISTRIBUTE_WORDS) as Distribute[]).map((entry) => ({
                value: entry,
                label: DISTRIBUTE_WORDS[entry],
              }))}
              value={distribute}
              onValueChange={(next) => write({ distribute: next as Distribute })}
            />
          ) : null}

          {stretchable ? (
            <InspectorSegmented
              label="Cross axis"
              size="sm"
              options={[
                { value: "place", label: "Place" },
                { value: "stretch", label: "Stretch" },
              ]}
              value={align === "stretch" ? "stretch" : "place"}
              onValueChange={(next) =>
                // Coming back off stretch lands on the middle rather than on
                // whatever it was before: the grid has to have a cell to light up,
                // and nothing was stored while it was stretched.
                write({ align: next === "stretch" ? "stretch" : "center" })
              }
            />
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** `stretch` has no cell of its own, so the grid reads it as the middle. */
function placeOf(value: Place | "stretch"): Place {
  return value === "stretch" ? "center" : value;
}

/**
 * Three bars sitting where the value puts them. The preview is the same picture at
 * two scales, which is what lets the row show the value without a second language
 * for it.
 */
function Bars({
  horizontal,
  vertical,
  direction,
  compact = false,
}: {
  horizontal: Place;
  vertical: Place;
  direction: Direction;
  compact?: boolean;
}) {
  const justifyClass: Record<Place, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };
  const alignClass: Record<Place, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  };

  return (
    <span
      className={cn(
        "flex size-full",
        compact ? "gap-px p-0.5" : "gap-0.5 p-1.5",
        direction === "row" ? "flex-row" : "flex-col",
        direction === "row" ? justifyClass[horizontal] : justifyClass[vertical],
        direction === "row" ? alignClass[vertical] : alignClass[horizontal],
      )}
    >
      {[3, 5, 2].map((length, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: three fixed bars, and the list never changes
          key={index}
          className={cn(
            "shrink-0 rounded-[1px] bg-foreground/70",
            direction === "row" ? "w-0.5" : "h-0.5",
          )}
          style={
            direction === "row"
              ? { height: compact ? length + 2 : length * 2 }
              : { width: compact ? length + 2 : length * 2 }
          }
        />
      ))}
    </span>
  );
}
