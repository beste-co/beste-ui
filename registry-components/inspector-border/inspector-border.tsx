"use client";

import {
  type LucideIcon,
  PanelBottomIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PanelTopIcon,
} from "lucide-react";
import * as React from "react";
import { InspectorColor } from "@/components/beste/component/inspector-color";
import { InspectorSegmented } from "@/components/beste/component/inspector-segmented";
import { InspectorStepper } from "@/components/beste/component/inspector-stepper";
import { InspectorToggles } from "@/components/beste/component/inspector-toggles";
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

type BorderSide = "top" | "right" | "bottom" | "left";
type BorderStyle = "solid" | "dashed" | "dotted";

/** Sides in CSS order, which is also the order they are written back in. */
const SIDES: { value: BorderSide; icon: LucideIcon }[] = [
  { value: "top", icon: PanelTopIcon },
  { value: "right", icon: PanelRightIcon },
  { value: "bottom", icon: PanelBottomIcon },
  { value: "left", icon: PanelLeftIcon },
];

const STYLES: { value: BorderStyle; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
];

/** A border, in the pieces CSS takes it in. */
interface BorderValue {
  /**
   * Which sides are drawn. An empty list is no border at all, which is why the
   * width does not have to carry a zero to mean the same thing.
   */
  sides?: BorderSide[];
  /** Width in px, shared by every side that is drawn. */
  width?: number;
  /** Line style, shared by every side that is drawn. */
  style?: BorderStyle;
  /** Any CSS colour, alpha included. */
  color?: string;
}

const DEFAULT_BORDER: Required<BorderValue> = {
  sides: ["top", "right", "bottom", "left"],
  width: 1,
  style: "dashed",
  color: "#d4d4d8",
};

function resolve(value: BorderValue | undefined) {
  return { ...DEFAULT_BORDER, ...value };
}

/**
 * The shorthand each drawn side takes. Kept per side rather than as one
 * `border` because the whole point of this row is that the four sides differ.
 */
function sideCss(value: BorderValue | undefined, side: BorderSide, cap?: number) {
  const { sides, width, style, color } = resolve(value);
  if (!sides.includes(side)) return undefined;
  const drawn = cap === undefined ? width : Math.min(width, cap);
  return `${drawn}px ${style} ${color}`;
}

interface InspectorBorderProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: BorderValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: BorderValue;
  /** Fires on every adjustment, including each keystroke in the width field. */
  onValueChange?: (value: BorderValue) => void;
  /**
   * Fires once an adjustment is finished — a side toggled, a width committed, a
   * colour released. Use it for work too expensive to run per keystroke.
   */
  onValueCommit?: (value: BorderValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Widest the border may be, in px.
   * @defaultValue 12 */
  maxWidth?: number;
  /**
   * Which line styles to offer. Pass one to fix the style and drop the choice
   * from the editor.
   * @defaultValue ["solid", "dashed", "dotted"] */
  styles?: BorderStyle[];
  /** Notation the colour is written back in. */
  format?: "hex" | "oklch" | "rgb";
  /** Carry an alpha channel through the colour. */
  alpha?: boolean;

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

export const inspectorBorderDemo: InspectorBorderProps = {
  label: "Border",
  className: "w-72",
};

export function InspectorBorder({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOpenChange,
  maxWidth = 12,
  styles = ["solid", "dashed", "dotted"],
  format = "hex",
  alpha = false,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorBorderProps) {
  const [internalValue, setInternalValue] = React.useState<BorderValue>(defaultValue ?? {});
  const value = valueProp ?? internalValue;
  const border = resolve(value);

  const valueRef = React.useRef(value);
  valueRef.current = value;

  const write = (patch: Partial<BorderValue>, complete: boolean) => {
    const next = { ...valueRef.current, ...patch };
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete) onValueCommit?.(next);
  };

  const styleOptions = React.useMemo(
    () =>
      styles.map((entry) => ({
        value: entry,
        label: STYLES.find((option) => option.value === entry)?.label ?? entry,
      })),
    [styles],
  );

  const none = border.sides.length === 0;
  /*
   * Which sides are on is already drawn in the glyph beside this, so the words are
   * left to say the one thing the glyph cannot: how thick the line is and what it
   * is made of.
   */
  const summary = none ? "None" : `${border.width}px ${border.style}`;

  /* The glyph is small, so a 12px border would fill it. */
  const previewStyle: React.CSSProperties = {
    borderTop: sideCss(value, "top", 3),
    borderRight: sideCss(value, "right", 3),
    borderBottom: sideCss(value, "bottom", 3),
    borderLeft: sideCss(value, "left", 3),
  };

  return (
    <Popover onOpenChange={onOpenChange}>
      {/*
        The row is the trigger, so the editor can take the trigger width and open
        flush with it. A border is a thing to look at, so the row carries one drawn
        exactly as described beside the words.
      */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-border"
          data-disabled={disabled}
          className={cn(
            "group/inspector-border flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-border-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span className="ml-auto flex min-w-0 items-center gap-2">
            <span
              data-slot="inspector-border-summary"
              className={cn(
                "truncate text-sm font-medium select-none",
                none ? "text-foreground/70" : "text-foreground",
              )}
            >
              {summary}
            </span>
            <span
              aria-hidden="true"
              data-slot="inspector-border-preview"
              className="size-5 shrink-0 rounded-sm bg-background"
              style={previewStyle}
            />
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
          A larger box drawn from the value, since three of the four settings only
          mean something once they are seen together. The width is not capped here,
          which is the point of having it.
        */}
        <div className="mb-2 flex items-center justify-center rounded-md bg-background py-5">
          <span
            aria-hidden="true"
            className="size-12 rounded-md"
            style={{
              borderTop: sideCss(value, "top"),
              borderRight: sideCss(value, "right"),
              borderBottom: sideCss(value, "bottom"),
              borderLeft: sideCss(value, "left"),
            }}
          />
        </div>

        {/* The editor is the family stacked up: which sides, then how they look. */}
        <div className="flex flex-col gap-1">
          <InspectorToggles
            label="Sides"
            size="sm"
            options={SIDES}
            value={border.sides}
            onValueChange={(next) => write({ sides: next as BorderSide[] }, true)}
          />

          {styleOptions.length > 1 ? (
            <InspectorSegmented
              label="Style"
              size="sm"
              options={styleOptions}
              value={border.style}
              onValueChange={(next) => write({ style: next as BorderStyle }, true)}
            />
          ) : null}

          <InspectorStepper
            label="Width"
            size="sm"
            min={0}
            max={maxWidth}
            step={1}
            suffix="px"
            value={border.width}
            onValueChange={(next) => write({ width: next }, false)}
            onValueCommit={(next) => write({ width: next }, true)}
          />

          <InspectorColor
            label="Color"
            size="sm"
            alpha={alpha}
            format={format}
            value={border.color}
            onValueChange={(next) => write({ color: next }, false)}
            onValueCommit={(next) => write({ color: next }, true)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
