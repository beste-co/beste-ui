"use client";

import { CheckIcon, ImageOffIcon, type LucideIcon, SquareDashedIcon, XIcon } from "lucide-react";
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

interface InspectorVariant {
  /** Reported on selection, and what a controlled value is matched against. */
  value: string;
  /** How it reads, under its picture. Falls back to `value`. */
  label?: string;
  /**
   * A picture of the variant, by URL — usually a rendered screenshot of the thing
   * being chosen. This is the ordinary case: the whole point of the row is that the
   * choice has to be *seen*, and the truest picture of a layout is that layout.
   * A plain `img` fills the box; `fit` says how.
   */
  image?: string;
  /**
   * A picture drawn in markup instead — a few boxes standing for a layout, an
   * `svg`, a live miniature of the real component. Reach for it when there is no
   * screenshot to point at, or when the choice is an abstraction (an easing, a
   * density) that no photograph would show. `image` wins when both are given.
   */
  preview?: React.ReactNode;
  /** A line under the label, for a choice a picture and a name cannot settle. */
  description?: string;
  disabled?: boolean;
}

interface InspectorVariantsProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** The choices on offer. */
  options?: InspectorVariant[];

  /** Controlled selection, by `value`. Pair it with `onValueChange`. */
  value?: string;
  /** Initial selection in uncontrolled mode. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires when the grid opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Choices per row in the grid.
   * @defaultValue 3 */
  columns?: number;
  /**
   * Shape of each picture, as an aspect ratio.
   * @defaultValue "4 / 3" */
  ratio?: string;
  /**
   * How an `image` fills its box. `cover` crops it to the shape, which is right
   * for a screenshot; `contain` fits the whole thing in, which is right for a
   * diagram or an icon on transparency that would lose its edges to a crop.
   * @defaultValue "cover" */
  fit?: "cover" | "contain";
  /**
   * Print the name (and any description) under each picture. Turn it off for a set
   * whose pictures say everything — thumbnails of the real thing, where the names
   * are filenames or numbers nobody reads — and the grid becomes pictures alone.
   * The names do not go anywhere: each cell keeps them as its accessible name and
   * its tooltip, and the row still says which one is chosen.
   * @defaultValue true */
  captioned?: boolean;
  /** Offer a clear button at the foot of the grid once something is selected. */
  clearable?: boolean;
  /** Shown in the row while nothing is selected. */
  placeholder?: string;

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

/**
 * What goes inside a box, decided once for both sizes of box: the URL if there is
 * one, the markup if there is not, and a dashed square if there is neither. The row
 * thumbnail and the grid cell used to each make this call, which is how a variant
 * ends up looking like one thing in the list and another in the row.
 *
 * A plain `img`, never a framework one: a registry component takes no view on which
 * image pipeline the project has.
 */
function Picture({
  option,
  fit,
  failed,
  onFail,
  fallbackClassName,
}: {
  option: InspectorVariant;
  fit: "cover" | "contain";
  failed: boolean;
  onFail: () => void;
  fallbackClassName: string;
}) {
  if (option.image && !failed) {
    return (
      // biome-ignore lint/performance/noImgElement: a registry component takes no view on the project's image pipeline
      // biome-ignore lint/a11y/noNoninteractiveElementInteractions: onError is the browser reporting a failed load, not a gesture
      <img
        src={option.image}
        alt=""
        loading="lazy"
        decoding="async"
        onError={onFail}
        className={cn("size-full", fit === "contain" ? "object-contain" : "object-cover")}
      />
    );
  }

  if (option.preview) return option.preview;

  // A failed URL is marked rather than left blank: an empty box reads as a variant
  // with nothing in it, which is a different thing from a picture that did not load.
  const Fallback = option.image && failed ? ImageOffIcon : SquareDashedIcon;
  return <Fallback className={fallbackClassName} />;
}

export const inspectorVariantsDemo: InspectorVariantsProps = {
  label: "Template",
  className: "w-72",
  defaultValue: "gallery",
  options: [
    {
      value: "editorial",
      label: "Editorial",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&q=60&auto=format&fit=crop",
    },
    {
      value: "gallery",
      label: "Gallery",
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=320&q=60&auto=format&fit=crop",
    },
    {
      value: "portfolio",
      label: "Portfolio",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=320&q=60&auto=format&fit=crop",
    },
  ],
};

/**
 * The choice that has to be seen to be made: a layout, a chart type, a card shape,
 * a background pattern. Names cannot settle these — "split" and "overlay" mean
 * whatever the reader guesses until they see them side by side — and a select full
 * of words is where every panel starts before someone gives up and builds a grid of
 * thumbnails by hand.
 *
 * It is the shape inspector-icon and inspector-media settled on, generalised: the
 * row is the trigger, the grid is width-matched to it, and clearing is a word at
 * the foot rather than a glyph in the row. The pictures are the caller's, so the
 * component never has to know what a variant looks like.
 */
export function InspectorVariants({
  label,
  icon: Icon,
  options = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  onOpenChange,
  columns = 3,
  ratio = "4 / 3",
  fit = "cover",
  captioned = true,
  clearable = false,
  placeholder = "",
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorVariantsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp ?? internalValue;
  const [open, setOpen] = React.useState(false);

  /*
   * Which images did not load, by option value. Kept here rather than in each cell
   * so the row and the grid agree about a broken URL, and so a picture that failed
   * once is not retried on every open.
   */
  const [failed, setFailed] = React.useState<Set<string>>(() => new Set());
  const markFailed = React.useCallback((entry: string) => {
    setFailed((current) => (current.has(entry) ? current : new Set(current).add(entry)));
  }, []);

  const selected = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const select = (next: string) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    setOpen(false);
    onOpenChange?.(false);
  };

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
          data-slot="inspector-variants"
          data-disabled={disabled}
          className={cn(
            "group/inspector-variants flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-variants-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span
            data-slot="inspector-variants-value"
            className={cn(
              "ml-auto min-w-0 truncate text-sm font-medium select-none",
              selected ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {selected ? (selected.label ?? selected.value) : placeholder}
          </span>

          {/*
            The chosen picture at row scale, framed like inspector-media's
            thumbnail: it holds a picture, and a picture wants an edge.
          */}
          <span
            aria-hidden="true"
            data-slot="inspector-variants-thumb"
            className="flex h-5 w-6 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-background"
          >
            {selected ? (
              <Picture
                option={selected}
                fit={fit}
                failed={failed.has(selected.value)}
                onFail={() => markFailed(selected.value)}
                fallbackClassName="size-3.5 text-muted-foreground/60"
              />
            ) : (
              <SquareDashedIcon className="size-3.5 text-muted-foreground/60" />
            )}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-2"
      >
        {options.length === 0 ? (
          <p className="px-1 py-2 text-sm text-foreground/70 select-none">Nothing to choose from</p>
        ) : (
          // biome-ignore lint/a11y/useSemanticElements: a fieldset wants a legend, and the name for this set is the row that opened it
          <div
            role="group"
            aria-label={ariaLabel ?? label}
            className="grid max-h-72 gap-2 overflow-y-auto"
            style={{ gridTemplateColumns: `repeat(${Math.max(columns, 1)}, minmax(0, 1fr))` }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => select(option.value)}
                  disabled={option.disabled}
                  aria-pressed={isSelected}
                  // Named whether or not the caption is printed: with captions off
                  // the picture is all there is, and `alt=""` on it is right — it
                  // is decoration for a choice the button itself names.
                  aria-label={option.label ?? option.value}
                  title={option.label ?? option.value}
                  data-slot="inspector-variants-option"
                  className={cn(
                    "group/variant flex cursor-pointer flex-col gap-1.5 rounded-lg p-1 text-left",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    "disabled:pointer-events-none disabled:opacity-40",
                  )}
                >
                  <span
                    style={{ aspectRatio: ratio }}
                    className={cn(
                      "relative flex w-full items-center justify-center overflow-hidden rounded-md border",
                      "bg-background transition-colors",
                      isSelected
                        ? "border-foreground/30 ring-2 ring-ring/40"
                        : "border-border group-hover/variant:border-foreground/20",
                    )}
                  >
                    <Picture
                      option={option}
                      fit={fit}
                      failed={failed.has(option.value)}
                      onFail={() => markFailed(option.value)}
                      fallbackClassName="size-5 text-muted-foreground/60"
                    />

                    {isSelected ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-foreground text-background"
                      >
                        <CheckIcon className="size-3" />
                      </span>
                    ) : null}
                  </span>

                  {captioned ? (
                    <span className="flex min-w-0 flex-col px-0.5">
                      <span
                        className={cn(
                          "truncate text-sm font-medium select-none",
                          isSelected ? "text-foreground" : "text-foreground/70",
                        )}
                      >
                        {option.label ?? option.value}
                      </span>
                      {option.description ? (
                        <span className="truncate text-sm text-foreground/70 select-none">
                          {option.description}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}

        {clearable && value ? (
          <button
            type="button"
            onClick={() => select("")}
            data-slot="inspector-variants-clear"
            className={cn(
              "mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5",
              "border-t border-border pt-2 text-sm font-medium text-foreground/70 select-none",
              "transition-colors hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            <XIcon className="size-3.5" />
            Remove {label}
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
