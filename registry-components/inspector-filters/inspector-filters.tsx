"use client";

import { CheckIcon, CopyIcon, type LucideIcon } from "lucide-react";
import * as React from "react";
import { InspectorColor } from "@/components/beste/component/inspector-color";
import { InspectorSlider } from "@/components/beste/component/inspector-slider";
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

/**
 * The picture the preview is filtered. A gradient rather than a photograph, so the
 * component carries no asset and works offline: it has a hue sweep for saturate and
 * hue-rotate to act on, and light and dark ends for brightness and contrast.
 */
const PREVIEW_IMAGE =
  "linear-gradient(120deg, #0f172a 0%, #fb7185 35%, #fdba74 55%, #22d3ee 80%, #f8fafc 100%)";

/** The one filter that is not a single number: an offset, a blur and a colour. */
interface DropShadowValue {
  /** Horizontal offset in px. */
  x?: number;
  /** Vertical offset in px. */
  y?: number;
  /** Blur radius in px. Unlike a box shadow, there is no spread and no inset. */
  blur?: number;
  /** Any CSS colour, alpha included. */
  color?: string;
}

/**
 * A filter stack, in the pieces CSS takes it in — all ten of them. Each one is at
 * its own no-op by default, which is what lets the row say "None" without a
 * separate flag, and what keeps the written stack down to what was actually changed.
 */
interface FiltersValue {
  /** Blur radius in px. */
  blur?: number;
  /** Brightness in percent, where 100 is unchanged. */
  brightness?: number;
  /** Contrast in percent, where 100 is unchanged. */
  contrast?: number;
  /** Saturation in percent, where 100 is unchanged. */
  saturate?: number;
  /** Hue rotation in degrees. */
  hueRotate?: number;
  /** Greyscale in percent, where 0 is unchanged. */
  grayscale?: number;
  /** Inversion in percent, where 0 is unchanged. */
  invert?: number;
  /** Sepia in percent, where 0 is unchanged. */
  sepia?: number;
  /** Opacity in percent, where 100 is unchanged. */
  opacity?: number;
  /**
   * A shadow cast by the shape rather than the box, which is the whole reason it is
   * a filter and not a `box-shadow`: it follows a PNG's transparency or an SVG's
   * outline. Left out of the stack until it is given something to draw.
   */
  dropShadow?: DropShadowValue;
}

/** Every key the stack understands, `dropShadow` included. */
type FilterKey = keyof FiltersValue;

interface Piece {
  /** Numeric pieces only; `dropShadow` is handled on its own. */
  key: Exclude<FilterKey, "dropShadow">;
  label: string;
  /** The value at which this piece does nothing. */
  neutral: number;
  min: number;
  max: number;
  step: number;
  /** How the number reads, and how it is written into `filter`. */
  unit: "px" | "%" | "deg";
}

/*
 * In the order CSS applies them, which is the order they are written. The three
 * that only ever wash a picture out — greyscale, sepia, invert — sit after the ones
 * that shape it, and opacity comes last of the numbers because it acts on whatever
 * the others left behind.
 *
 * The ranges are not all 0 to 200: brightness, contrast and saturation are
 * multipliers with no ceiling in the spec, while greyscale, sepia, invert and
 * opacity are fractions that the spec itself clamps at 100%. A slider that lets a
 * reader ask for 150% greyscale is a slider that lies to them.
 */
const PIECES: Piece[] = [
  { key: "blur", label: "Blur", neutral: 0, min: 0, max: 40, step: 0.5, unit: "px" },
  { key: "brightness", label: "Brightness", neutral: 100, min: 0, max: 200, step: 1, unit: "%" },
  { key: "contrast", label: "Contrast", neutral: 100, min: 0, max: 200, step: 1, unit: "%" },
  { key: "saturate", label: "Saturation", neutral: 100, min: 0, max: 200, step: 1, unit: "%" },
  { key: "hueRotate", label: "Hue", neutral: 0, min: 0, max: 360, step: 1, unit: "deg" },
  { key: "grayscale", label: "Grayscale", neutral: 0, min: 0, max: 100, step: 1, unit: "%" },
  { key: "sepia", label: "Sepia", neutral: 0, min: 0, max: 100, step: 1, unit: "%" },
  { key: "invert", label: "Invert", neutral: 0, min: 0, max: 100, step: 1, unit: "%" },
  { key: "opacity", label: "Opacity", neutral: 100, min: 0, max: 100, step: 1, unit: "%" },
];

const DEFAULT_SHADOW: Required<DropShadowValue> = {
  x: 0,
  y: 0,
  blur: 0,
  color: "#00000040",
};

/** How long the copy button stays ticked, in ms. */
const COPIED_MS = 1400;

/** The CSS function each piece is written as. */
const CSS_NAMES: Record<Exclude<FilterKey, "dropShadow">, string> = {
  blur: "blur",
  brightness: "brightness",
  contrast: "contrast",
  saturate: "saturate",
  hueRotate: "hue-rotate",
  grayscale: "grayscale",
  sepia: "sepia",
  invert: "invert",
  opacity: "opacity",
};

function amount(value: FiltersValue, piece: Piece) {
  return value[piece.key] ?? piece.neutral;
}

function shadowOf(value: FiltersValue) {
  return { ...DEFAULT_SHADOW, ...value.dropShadow };
}

/**
 * A shadow with no offset and no blur is a shadow nobody can see, whatever colour it
 * is, so that is this piece's no-op — the same rule the numbers follow, rather than
 * a flag saying whether it counts.
 */
function hasShadow(value: FiltersValue) {
  const shadow = shadowOf(value);
  return shadow.x !== 0 || shadow.y !== 0 || shadow.blur !== 0;
}

/**
 * The `filter` this describes. Pieces sitting at their no-op are left out rather
 * than written as `brightness(100%)`: the shortest honest string is also the one a
 * reader can check at a glance, and `none` is what CSS calls an empty stack.
 *
 * The shadow is written last, after the numbers, because it should fall from the
 * picture the rest of the stack produced and not from the one it started as.
 */
function toCss(value: FiltersValue, pieces: Piece[], shadow: boolean): string {
  const written = pieces
    .filter((piece) => amount(value, piece) !== piece.neutral)
    .map((piece) => {
      const raw = amount(value, piece);
      const printed = piece.unit === "%" ? `${raw}%` : `${raw}${piece.unit}`;
      return `${CSS_NAMES[piece.key]}(${printed})`;
    });

  if (shadow && hasShadow(value)) {
    const { x, y, blur, color } = shadowOf(value);
    written.push(`drop-shadow(${x}px ${y}px ${blur}px ${color})`);
  }

  return written.length > 0 ? written.join(" ") : "none";
}

interface InspectorFiltersProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: FiltersValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: FiltersValue;
  /** Fires on every adjustment, including each frame of a drag. */
  onValueChange?: (value: FiltersValue) => void;
  /**
   * Fires once an adjustment is finished — a slider released. Use it for work too
   * expensive to run per frame.
   */
  onValueCommit?: (value: FiltersValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Which pieces to offer. Leaving one out also leaves it out of the CSS, so a
   * caller cannot end up shipping a value nobody can edit. The order is always the
   * one CSS applies them in, not the order given here.
   * @defaultValue the nine numeric filters, and the drop shadow */
  pieces?: FilterKey[];
  /** Notation the shadow's colour is written back in. */
  format?: "hex" | "oklch" | "rgb";
  /**
   * What the preview is filtered. Any CSS image: pass the picture this stack will
   * actually be applied to and the editor stops being a demonstration.
   */
  preview?: string;

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

export const inspectorFiltersDemo: InspectorFiltersProps = {
  label: "Filters",
  className: "w-72",
  defaultValue: { brightness: 105, contrast: 110, saturate: 120, sepia: 15 },
};

export function InspectorFilters({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOpenChange,
  pieces,
  format = "hex",
  preview = PREVIEW_IMAGE,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorFiltersProps) {
  const [internalValue, setInternalValue] = React.useState<FiltersValue>(defaultValue ?? {});
  const value = valueProp ?? internalValue;

  const valueRef = React.useRef(value);
  valueRef.current = value;

  const active = React.useMemo(
    () => (pieces ? PIECES.filter((piece) => pieces.includes(piece.key)) : PIECES),
    [pieces],
  );
  const withShadow = pieces ? pieces.includes("dropShadow") : true;
  const shadow = shadowOf(value);

  const writeShadow = (patch: Partial<DropShadowValue>, complete: boolean) => {
    write({ dropShadow: { ...shadowOf(valueRef.current), ...patch } }, complete);
  };

  const write = (patch: Partial<FiltersValue>, complete: boolean) => {
    const next = { ...valueRef.current, ...patch };
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete) onValueCommit?.(next);
  };

  const css = toCss(value, active, withShadow);
  const changed =
    active.filter((piece) => amount(value, piece) !== piece.neutral).length +
    (withShadow && hasShadow(value) ? 1 : 0);

  /*
   * Copying reports back rather than assuming: the tick only appears once the
   * clipboard has actually taken the string, since a browser may refuse it and a
   * tick that lied would be worse than no tick. Same handler as inspector-easing's,
   * kept here rather than shared, for the same reason the tone and size tables are.
   */
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPIED_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
    } catch {
      // No clipboard, or permission refused. The value is on screen either way.
    }
  };

  return (
    <Popover onOpenChange={onOpenChange}>
      {/*
        The row is the trigger, so the editor can take the trigger width and open
        flush with it. What the row shows is the stack applied to something, because
        four numbers do not add up to an impression and a filter is nothing but one.
      */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-filters"
          data-disabled={disabled}
          className={cn(
            "group/inspector-filters flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-filters-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span className="ml-auto flex min-w-0 items-center gap-2">
            <span
              data-slot="inspector-filters-summary"
              className={cn(
                "truncate text-sm font-medium select-none",
                changed === 0 ? "text-foreground/70" : "text-foreground",
              )}
            >
              {changed === 0 ? "None" : `${changed} active`}
            </span>
            <span
              aria-hidden="true"
              data-slot="inspector-filters-preview"
              className="size-5 shrink-0 overflow-hidden rounded-sm border border-border"
            >
              {/* The filter goes on an inner layer: filtering the box would take its
                  own border with it. */}
              <span
                className="block size-full"
                style={{ backgroundImage: preview, filter: css === "none" ? undefined : css }}
              />
            </span>
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        // Three parts, not one scrolling column: the panel itself does not scroll, so
        // the preview and the string stay where they are while the settings between
        // them move. A fixed cap rather than the popover's own available-height
        // variable, which the Base UI variant has no equivalent for.
        className="flex max-h-[min(20rem,45vh)] w-[var(--radix-popover-trigger-width)] min-w-64 flex-col overflow-hidden p-0"
      >
        {/*
          The preview, pinned: it is the only thing here worth judging, and a filter is
          judged while the slider is moving. Scrolling it away at the moment it matters
          most is the one thing this panel must not do — which is also why it is kept
          shallow, since anything pinned inside a short panel is taken from the list.
        */}
        <div className="shrink-0 p-2">
          <div
            aria-hidden="true"
            data-slot="inspector-filters-preview-large"
            className="h-16 w-full overflow-hidden rounded-lg border border-border"
          >
            <span
              className="block size-full"
              style={{ backgroundImage: preview, filter: css === "none" ? undefined : css }}
            />
          </div>
        </div>

        {/*
          The settings scroll. Ten filters is more than a panel can hold at once, and
          `min-h-0` is what lets this shrink inside the column: a flex child defaults
          to its content's height and would otherwise push the footer off the bottom
          instead of scrolling.
        */}
        <div
          data-slot="inspector-filters-scroll"
          className="min-h-0 flex-1 overflow-y-auto px-2 pb-2"
        >
          {/* The editor is the family stacked up, in the order CSS applies them. */}
          <div className="flex flex-col gap-1">
            {active.map((piece) => (
              <InspectorSlider
                key={piece.key}
                label={piece.label}
                size="sm"
                min={piece.min}
                max={piece.max}
                step={piece.step}
                ticks={false}
                value={amount(value, piece)}
                onValueChange={(next) => write({ [piece.key]: next }, false)}
                onValueCommit={(next) => write({ [piece.key]: next }, true)}
                formatValue={(next) =>
                  piece.unit === "%" ? `${Math.round(next)}%` : `${next}${piece.unit}`
                }
              />
            ))}
          </div>

          {/*
            The shadow gets a section of its own, since it is four settings rather than
            one and would otherwise read as four unrelated sliders at the bottom of the
            list. No spread and no inset here, unlike inspector-shadow: `drop-shadow()`
            has neither, and offering knobs CSS will ignore is worse than not having
            them.
          */}
          {withShadow ? (
            <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
              <span
                data-slot="inspector-filters-shadow-label"
                className="px-3 text-sm font-medium text-foreground/70 select-none"
              >
                Drop shadow
              </span>

              <InspectorSlider
                label="Offset X"
                size="sm"
                min={-40}
                max={40}
                step={1}
                ticks={false}
                value={shadow.x}
                onValueChange={(next) => writeShadow({ x: next }, false)}
                onValueCommit={(next) => writeShadow({ x: next }, true)}
                formatValue={(next) => `${Math.round(next)}px`}
              />
              <InspectorSlider
                label="Offset Y"
                size="sm"
                min={-40}
                max={40}
                step={1}
                ticks={false}
                value={shadow.y}
                onValueChange={(next) => writeShadow({ y: next }, false)}
                onValueCommit={(next) => writeShadow({ y: next }, true)}
                formatValue={(next) => `${Math.round(next)}px`}
              />
              <InspectorSlider
                label="Shadow blur"
                size="sm"
                min={0}
                max={40}
                step={1}
                ticks={false}
                value={shadow.blur}
                onValueChange={(next) => writeShadow({ blur: next }, false)}
                onValueCommit={(next) => writeShadow({ blur: next }, true)}
                formatValue={(next) => `${Math.round(next)}px`}
              />
              <InspectorColor
                label="Shadow color"
                size="sm"
                alpha
                format={format}
                value={shadow.color}
                onValueChange={(next) => writeShadow({ color: next }, false)}
                onValueCommit={(next) => writeShadow({ color: next }, true)}
              />
            </div>
          ) : null}
        </div>

        {/*
          The string itself, which is the one part of a filter stack that is easy to
          get wrong by hand: the order matters, and so does leaving the no-ops out.
          Hence a way to take it, and hence it staying put while the settings scroll —
          a copy button that has to be scrolled to is a copy button nobody finds.
        */}
        <div className="group/inspector-filters-css flex shrink-0 items-center gap-1 border-t border-border p-2">
          <span
            data-slot="inspector-filters-css"
            className="min-w-0 flex-1 truncate text-sm text-foreground/70 select-none"
          >
            {css}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
            title={copied ? "Copied" : "Copy"}
            data-slot="inspector-filters-copy"
            className={cn(
              "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md",
              "text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground",
              "opacity-0 outline-none group-hover/inspector-filters-css:opacity-100 focus-visible:opacity-100",
              "focus-visible:ring-2 focus-visible:ring-ring/50",
              // Once it has done its job it stays put, so the mark that says so is
              // not pulled out from under the pointer.
              copied && "opacity-100",
            )}
          >
            {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
