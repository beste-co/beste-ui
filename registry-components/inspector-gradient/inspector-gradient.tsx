"use client";

import { type LucideIcon, MinusIcon, PlusIcon } from "lucide-react";
import * as React from "react";
import { InspectorAngle } from "@/components/beste/component/inspector-angle";
import { InspectorColor } from "@/components/beste/component/inspector-color";
import { InspectorSegmented } from "@/components/beste/component/inspector-segmented";
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

const COUNT_BUTTON =
  "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

type GradientKind = "linear" | "radial" | "conic";

/** One stop: a colour and how far along the gradient it sits, 0 to 100. */
interface GradientStop {
  color: string;
  /** Percentage along the gradient. Omit it and the stop is spaced evenly. */
  position?: number;
}

/** A gradient, in the pieces CSS takes it in. */
interface GradientValue {
  /**
   * Which gradient function to write.
   * @defaultValue "linear" */
  kind?: GradientKind;
  /** Angle in degrees, as CSS means it: zero points up, growing clockwise. */
  angle?: number;
  /**
   * The stops, in order. A bare string is a colour with no position of its own,
   * which is what makes the simple case simple; give a stop a position and it
   * holds that share of the gradient.
   */
  stops?: (string | GradientStop)[];
}

const DEFAULT_STOPS: GradientStop[] = [
  { color: "#fb7185", position: 0 },
  { color: "#8b5cf6", position: 100 },
];

const DEFAULT_KIND: GradientKind = "linear";
const DEFAULT_ANGLE = 135;

function clamp(value: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, value));
}

/** Handle diameter in px. Mirrors the `size-4` utility on the handle element. */
const HANDLE_SIZE = 16;

/**
 * Where a handle sits along the ramp. The travel is the ramp minus one handle,
 * offset by half of one, so a stop at 0 or 100 has its dot flush with the end
 * rather than hanging over it. That is how a track with a round thumb is always
 * laid out; the alternative — clamping a straight percentage — buys the same
 * tidy ends at the cost of a dead zone at each one, where dragging moves the
 * value but not the dot.
 */
function handleOffset(position: number) {
  const fraction = clamp(position, 0, 100) / 100;
  return `calc(${HANDLE_SIZE / 2}px + ${fraction} * (100% - ${HANDLE_SIZE}px))`;
}

/**
 * Give every stop a position. Anything without one is spread evenly across the
 * run, which is exactly what the browser does when no stop is placed, so a list
 * of plain colours looks the same before and after it is touched.
 */
function normalizeStops(stops: (string | GradientStop)[] | undefined): GradientStop[] {
  const list = (stops ?? []).map((stop) =>
    typeof stop === "string" ? { color: stop } : stop,
  );
  if (list.length === 0) return DEFAULT_STOPS;
  if (list.length === 1) {
    const only = list[0] as GradientStop;
    return [{ color: only.color, position: only.position ?? 0 }];
  }
  return list.map((stop, index) => ({
    color: stop.color,
    position: stop.position ?? (index / (list.length - 1)) * 100,
  }));
}

/**
 * The CSS this describes. A radial gradient takes no angle, and a conic one turns
 * from its start rather than along a line, which is why the angle only reaches two
 * of the three.
 *
 * Stops are written in the order given, not sorted: a stop placed before the one
 * ahead of it is how a hard edge — a stripe — is made, and sorting would quietly
 * take that away.
 */
function toCss(kind: GradientKind, angle: number, stops: GradientStop[]): string {
  const list = stops
    .map((stop) => `${stop.color} ${Math.round(stop.position ?? 0)}%`)
    .join(", ");
  if (kind === "radial") return `radial-gradient(circle at center, ${list})`;
  if (kind === "conic") return `conic-gradient(from ${angle}deg at center, ${list})`;
  return `linear-gradient(${angle}deg, ${list})`;
}

interface InspectorGradientProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: GradientValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: GradientValue;
  /**
   * Fires on every adjustment, including each frame of a drag. Stops are always
   * written back with explicit positions, whatever shape they arrived in.
   */
  onValueChange?: (value: GradientValue) => void;
  /**
   * Fires once an adjustment is finished — a handle, angle or colour released, a
   * stop added or removed. Use it for work too expensive to run per frame.
   */
  onValueCommit?: (value: GradientValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Which kinds to offer. Pass one to fix the gradient to it and drop the choice
   * from the editor.
   * @defaultValue ["linear", "radial", "conic"] */
  kinds?: GradientKind[];
  /**
   * Fewest stops the gradient may hold.
   * @defaultValue 2 */
  minStops?: number;
  /**
   * Most stops the gradient may hold.
   * @defaultValue 7 */
  maxStops?: number;
  /** Notation the stops are written back in. */
  format?: "hex" | "oklch" | "rgb";
  /** Carry an alpha channel through the stops. */
  alpha?: boolean;
  /** Preset colours offered inside a stop's picker. */
  swatches?: string[];

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

export const inspectorGradientDemo: InspectorGradientProps = {
  label: "Gradient",
  className: "w-72",
  /*
   * A sunset, and uneven on purpose: the peach holds the opening 40% on its own.
   * Each neighbouring pair is a short hue travel at even chroma, which is what
   * keeps a ramp clear of the muddy middle a long jump lands in.
   */
  defaultValue: {
    kind: "linear",
    angle: 135,
    stops: [
      { color: "#fdba74", position: 0 },
      { color: "#fb7185", position: 40 },
      { color: "#8b5cf6", position: 100 },
    ],
  },
};

export function InspectorGradient({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOpenChange,
  kinds = ["linear", "radial", "conic"],
  minStops = 2,
  maxStops = 7,
  format = "hex",
  alpha = false,
  swatches,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorGradientProps) {
  const [internalValue, setInternalValue] = React.useState<GradientValue>(defaultValue ?? {});
  const value = valueProp ?? internalValue;

  const kind = value.kind ?? DEFAULT_KIND;
  const angle = value.angle ?? DEFAULT_ANGLE;
  const stops = React.useMemo(() => normalizeStops(value.stops), [value.stops]);

  /** Which stop the colour and position rows are pointed at. */
  const [selected, setSelected] = React.useState(0);
  const selectedIndex = Math.min(selected, stops.length - 1);
  const selectedStop = stops[selectedIndex] ?? stops[0];

  const stripRef = React.useRef<HTMLDivElement>(null);
  const stopsRef = React.useRef(stops);
  stopsRef.current = stops;
  const dragRef = React.useRef<{ index: number; pointerId: number } | null>(null);
  const frameRef = React.useRef(0);
  const pendingXRef = React.useRef(0);

  const write = (patch: Partial<GradientValue>, complete: boolean) => {
    const next: GradientValue = { kind, angle, stops: stopsRef.current, ...patch };
    if (patch.stops) stopsRef.current = normalizeStops(patch.stops);
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete) onValueCommit?.(next);
  };

  const setStop = (index: number, patch: Partial<GradientStop>, complete: boolean) => {
    const next = stopsRef.current.map((stop, position) =>
      position === index ? { ...stop, ...patch } : stop,
    );
    write({ stops: next }, complete);
  };

  /* ------------------------------------------------------------ add/remove -- */

  /**
   * A new stop lands in the widest gap, carrying its left neighbour's colour:
   * that is the one place where adding one changes the gradient least, so the
   * reader sees a handle appear rather than the whole ramp shift.
   */
  const addStop = () => {
    const current = stopsRef.current;
    if (current.length >= maxStops) return;

    let at = 0;
    let widest = -1;
    for (let index = 0; index < current.length - 1; index++) {
      const gap = (current[index + 1]?.position ?? 0) - (current[index]?.position ?? 0);
      if (gap > widest) {
        widest = gap;
        at = index;
      }
    }

    const left = current[at];
    const right = current[at + 1];
    if (!left) return;
    const position = right
      ? ((left.position ?? 0) + (right.position ?? 0)) / 2
      : clamp((left.position ?? 0) + 10, 0, 100);

    const next = [...current];
    next.splice(at + 1, 0, { color: left.color, position });
    setSelected(at + 1);
    write({ stops: next }, true);
  };

  const removeStop = () => {
    const current = stopsRef.current;
    if (current.length <= minStops) return;
    const next = current.filter((_, index) => index !== selectedIndex);
    setSelected(Math.max(0, selectedIndex - 1));
    write({ stops: next }, true);
  };

  /* ----------------------------------------------------------- handle drag -- */

  /*
   * Deliberately not memoised. A frame is only ever scheduled from the pointer
   * move that precedes it, so the closure it runs with is the current one — and a
   * memoised version would have captured the first render's `kind` and `angle`
   * and written those back, undoing whatever the reader had changed before
   * reaching for a handle.
   */
  const runFrame = () => {
    frameRef.current = 0;
    const drag = dragRef.current;
    const strip = stripRef.current;
    if (!drag || !strip) return;

    const rect = strip.getBoundingClientRect();
    // The pointer is read against the same inset travel the handle is drawn on,
    // so the dot stays under the finger and both ends remain reachable.
    const travel = rect.width - HANDLE_SIZE;
    if (travel <= 0) return;
    const offset = pendingXRef.current - rect.left - HANDLE_SIZE / 2;
    const position = clamp((offset / travel) * 100, 0, 100);
    setStop(drag.index, { position: Math.round(position * 10) / 10 }, false);
  };

  const handleHandleDown = (event: React.PointerEvent<HTMLButtonElement>, index: number) => {
    if (disabled || event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { index, pointerId: event.pointerId };
    setSelected(index);
  };

  const handleHandleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    pendingXRef.current = event.clientX;
    // One update per frame, however many pointer events arrive.
    if (!frameRef.current) frameRef.current = requestAnimationFrame(runFrame);
  };

  const handleHandleUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    write({ stops: stopsRef.current }, true);
  };

  const handleHandleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.shiftKey ? 10 : 1;
    const current = stopsRef.current[index]?.position ?? 0;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setStop(index, { position: clamp(current + step, 0, 100) }, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setStop(index, { position: clamp(current - step, 0, 100) }, true);
    }
  };

  React.useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /* ---------------------------------------------------------------- render -- */

  const kindOptions = React.useMemo(
    () =>
      kinds.map((entry) => ({
        value: entry,
        label: entry === "linear" ? "Linear" : entry === "radial" ? "Radial" : "Conic",
      })),
    [kinds],
  );
  const showKinds = kindOptions.length > 1;
  // Only a line and a turn have a direction; a radial gradient spreads from a point.
  const showAngle = kind !== "radial";

  const preview = toCss(kind, angle, stops);
  // The strip is read left to right whatever the gradient's own direction, so the
  // handles always line up with what they move.
  const stripCss = toCss("linear", 90, stops);

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-gradient"
          data-disabled={disabled}
          className={cn(
            "group/inspector-gradient flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-gradient-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          {/*
            Wider than the square swatch the other rows carry, since a gradient
            needs some length before the transition reads at all — but the same
            height as them, so the row still scans as one line of controls.
          */}
          <span
            aria-hidden="true"
            data-slot="inspector-gradient-preview"
            className="ml-auto h-5 w-24 shrink-0 rounded-md border border-border"
            style={{ backgroundImage: preview }}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-2"
      >
        {/*
          The gradient as it will actually render — its own kind and its own
          direction — and big enough to judge. Everything below it is a control,
          so this is the only place the reader sees the thing itself.
        */}
        <div
          aria-hidden="true"
          data-slot="inspector-gradient-preview-large"
          className="mb-3 h-24 w-full rounded-lg border border-border"
          style={{ backgroundImage: preview }}
        />

        {/*
          The ramp is where a stop's share is set: drag a handle and the colour
          either side of it gets more or less of the gradient. It stays a thin
          track on purpose — it is a scale being marked up, not a second preview,
          and the height it gives up goes to the real one above.
        */}
        <div
          ref={stripRef}
          data-slot="inspector-gradient-ramp"
          className="relative mb-4 h-3 w-full rounded-full border border-border"
          style={{ backgroundImage: stripCss }}
        >
          {stops.map((stop, index) => {
            const isSelected = index === selectedIndex;

            return (
              <button
                // Keyed by position in the list: keying by colour or offset would
                // remount the handle mid-drag and drop the pointer capture.
                key={index}
                type="button"
                disabled={disabled}
                aria-label={`Stop ${index + 1}, ${Math.round(stop.position ?? 0)}%`}
                aria-pressed={isSelected}
                data-slot="inspector-gradient-handle"
                onPointerDown={(event) => handleHandleDown(event, index)}
                onPointerMove={handleHandleMove}
                onPointerUp={handleHandleUp}
                onPointerCancel={handleHandleUp}
                onKeyDown={(event) => handleHandleKeyDown(event, index)}
                onFocus={() => setSelected(index)}
                className={cn(
                  "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2",
                  "cursor-ew-resize touch-none rounded-full",
                  "border-2 border-white shadow-md ring-1 ring-black/20 outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  // The grab area reaches past the dot, since a 12px track leaves
                  // the pointer little to aim at.
                  "before:absolute before:-inset-1.5 before:rounded-full before:content-['']",
                  // Two stops may share one position — that is how a hard edge is
                  // made — so the selected one comes forward and stays grabbable.
                  isSelected ? "z-10 ring-2 ring-foreground" : "z-0",
                )}
                style={{
                  left: handleOffset(stop.position ?? 0),
                  backgroundColor: stop.color,
                }}
              />
            );
          })}
        </div>

        {/*
          The editor is the family stacked up: the kind, the direction, then the
          selected stop's colour and where it sits.
        */}
        <div className="flex flex-col gap-1">
          {showKinds ? (
            <InspectorSegmented
              label="Type"
              size="sm"
              options={kindOptions}
              value={kind}
              onValueChange={(next) => write({ kind: next as GradientKind }, true)}
            />
          ) : null}

          {showAngle ? (
            <InspectorAngle
              label="Angle"
              size="sm"
              value={angle}
              onValueChange={(next) => write({ angle: next }, false)}
              onValueCommit={(next) => write({ angle: next }, true)}
            />
          ) : null}

          <InspectorColor
            label={`Stop ${selectedIndex + 1}`}
            size="sm"
            alpha={alpha}
            format={format}
            swatches={swatches}
            value={selectedStop?.color}
            onValueChange={(next) => setStop(selectedIndex, { color: next }, false)}
            onValueCommit={(next) => setStop(selectedIndex, { color: next }, true)}
          />

          <InspectorSlider
            label="Position"
            size="sm"
            min={0}
            max={100}
            step={1}
            ticks={false}
            value={selectedStop?.position ?? 0}
            onValueChange={(next) => setStop(selectedIndex, { position: next }, false)}
            onValueCommit={(next) => setStop(selectedIndex, { position: next }, true)}
            formatValue={(next) => `${Math.round(next)}%`}
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2">
          <span className="text-sm text-foreground/70 select-none">
            {`${stops.length} stop${stops.length === 1 ? "" : "s"}`}
          </span>
          <span className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={removeStop}
              disabled={disabled || stops.length <= minStops}
              aria-label="Remove the selected stop"
              className={COUNT_BUTTON}
            >
              <MinusIcon className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={addStop}
              disabled={disabled || stops.length >= maxStops}
              aria-label="Add a stop"
              className={COUNT_BUTTON}
            >
              <PlusIcon className="size-3.5" />
            </button>
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
