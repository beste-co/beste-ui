"use client";

import type { LucideIcon } from "lucide-react";
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

/** A point on a surface, in percent from its top left corner. */
interface PositionValue {
  x?: number;
  y?: number;
}

/** The thirds, which is where a position is wanted nine times out of ten. */
const THIRDS = [0, 50, 100];
/**
 * Spacing of the dashed guide lines, in percent. A quarter divides the pad the way
 * the nine spots do, so every one of them lands on a crossing.
 */
const GRID_STEP = 25;
const GRID_LINES = Array.from(
  { length: Math.floor(100 / GRID_STEP) + 1 },
  (_, step) => step * GRID_STEP,
  // The middle is left out: the origin draws that line itself, and a dashed one
  // underneath a solid one is just a line nobody can see.
).filter((line) => line !== 50);
/** How close to a third counts as on it, in percent of the pad. */
const SNAP_TOLERANCE = 4;
/** Multiplier applied to a key press while Shift is held. */
const COARSE_FACTOR = 10;
/** Handle diameter in px. Mirrors the `size-3` utility on the handle element. */
const HANDLE_SIZE = 12;
/** How far the point's travel, and so the grid drawn under it, keeps from the edge. */
const INSET = HANDLE_SIZE / 2;

const NAMES: Record<string, string> = {
  "0,0": "top left",
  "50,0": "top",
  "100,0": "top right",
  "0,50": "left",
  "50,50": "center",
  "100,50": "right",
  "0,100": "bottom left",
  "50,100": "bottom",
  "100,100": "bottom right",
};

function clamp(value: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, value));
}

function snapTo(value: number) {
  for (const third of THIRDS) {
    if (Math.abs(value - third) <= SNAP_TOLERANCE) return third;
  }
  return value;
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

/**
 * How a point reads. The nine named spots get their name, because that is what
 * CSS calls them and what a reader recognises; anything else is two numbers.
 */
function summarize(x: number, y: number) {
  const named = NAMES[`${Math.round(x)},${Math.round(y)}`];
  if (named) return named;
  return `${Math.round(x)}% ${Math.round(y)}%`;
}

/**
 * Where the handle sits inside the pad: the travel is the pad minus one handle,
 * offset by half of one, so a point in a corner has its dot flush with the corner
 * rather than hanging over it.
 */
function handleOffset(percent: number) {
  return `calc(${INSET}px + ${clamp(percent, 0, 100) / 100} * (100% - ${HANDLE_SIZE}px))`;
}

interface InspectorPositionProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: PositionValue;
  /** Initial value in uncontrolled mode. Defaults to the centre. */
  defaultValue?: PositionValue;
  /** Fires on every frame of a drag, and on every key press. */
  onValueChange?: (value: PositionValue) => void;
  /**
   * Fires once a change is finished — the pad released, a key released, a named
   * spot pressed. Use it for work too expensive to run per frame.
   */
  onValueCommit?: (value: PositionValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Pull the point onto the thirds when it comes within a few percent of them.
   * Hold Shift while dragging to place it exactly instead.
   * @defaultValue true */
  snap?: boolean;
  /**
   * Smallest increment a key press moves, in percent.
   * @defaultValue 1 */
  step?: number;
  /**
   * What the pad shows behind the point. Any CSS image: pass the picture being
   * positioned and the pad becomes the thing itself rather than a diagram of it.
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

  /**
   * Name of the underlying range inputs, so the row can take part in a form. The
   * two axes submit as `{name}-x` and `{name}-y`.
   */
  name?: string;
  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorPositionDemo: InspectorPositionProps = {
  label: "Focal Point",
  className: "w-72",
  defaultValue: { x: 50, y: 30 },
};

export function InspectorPosition({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOpenChange,
  snap = true,
  step = 1,
  preview,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  className,
  "aria-label": ariaLabel,
}: InspectorPositionProps) {
  const [internalValue, setInternalValue] = React.useState<PositionValue>(defaultValue ?? {});
  const value = valueProp ?? internalValue;
  const x = clamp(value.x ?? 50, 0, 100);
  const y = clamp(value.y ?? 50, 0, 100);

  const padRef = React.useRef<HTMLDivElement>(null);
  const pointRef = React.useRef({ x, y });
  pointRef.current = { x, y };
  /** Last point handed to `onValueCommit`. */
  const committedRef = React.useRef({ x, y });
  const draggingRef = React.useRef(false);
  const frameRef = React.useRef(0);
  const pendingRef = React.useRef({ x: 0, y: 0, precise: false });

  const apply = (next: PositionValue, complete: boolean) => {
    const point = {
      x: round(clamp(next.x ?? pointRef.current.x, 0, 100)),
      y: round(clamp(next.y ?? pointRef.current.y, 0, 100)),
    };
    const moved = point.x !== pointRef.current.x || point.y !== pointRef.current.y;
    pointRef.current = point;
    if (moved) {
      if (valueProp === undefined) setInternalValue(point);
      onValueChange?.(point);
    }
    if (complete && (point.x !== committedRef.current.x || point.y !== committedRef.current.y)) {
      committedRef.current = point;
      onValueCommit?.(point);
    }
  };

  const commit = () => {
    const point = pointRef.current;
    if (point.x === committedRef.current.x && point.y === committedRef.current.y) return;
    committedRef.current = point;
    onValueCommit?.(point);
  };

  /* ---------------------------------------------------------------- drag -- */

  /*
   * Deliberately not memoised, for the same reason inspector-gradient's is not: a
   * frame is only ever scheduled from the pointer move before it, so the closure
   * it runs with is the current one.
   */
  const runFrame = () => {
    frameRef.current = 0;
    const pad = padRef.current;
    if (!pad) return;

    const rect = pad.getBoundingClientRect();
    // The pointer is read against the same inset travel the handle is drawn on, so
    // the dot stays under the finger and every corner stays reachable.
    const travelX = rect.width - HANDLE_SIZE;
    const travelY = rect.height - HANDLE_SIZE;
    if (travelX <= 0 || travelY <= 0) return;

    const { x: pointerX, y: pointerY, precise } = pendingRef.current;
    const rawX = clamp(((pointerX - rect.left - INSET) / travelX) * 100, 0, 100);
    const rawY = clamp(((pointerY - rect.top - INSET) / travelY) * 100, 0, 100);
    const pull = snap && !precise;

    apply({ x: pull ? snapTo(rawX) : rawX, y: pull ? snapTo(rawY) : rawY }, false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    padRef.current?.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    pendingRef.current = { x: event.clientX, y: event.clientY, precise: event.shiftKey };
    runFrame();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    pendingRef.current = { x: event.clientX, y: event.clientY, precise: event.shiftKey };
    // One update per frame, however many pointer events arrive.
    if (!frameRef.current) frameRef.current = requestAnimationFrame(runFrame);
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    commit();
  };

  React.useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /* ------------------------------------------------------------ keyboard -- */

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, axis: "x" | "y") => {
    if (disabled) return;
    const amount = step * (event.shiftKey ? COARSE_FACTOR : 1);
    const current = pointRef.current[axis];
    let next: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = current + amount;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = current - amount;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      case "PageUp":
        next = 50;
        break;
      default:
        return;
    }

    event.preventDefault();
    apply({ [axis]: next }, false);
  };

  const axis = (which: "x" | "y") => (
    /*
     * A native range per axis carries the role, the value and the keyboard, and
     * takes part in a form. The pad above is only a pointer surface, which is why
     * it holds no widget role of its own.
     */
    <input
      key={which}
      name={name ? `${name}-${which}` : undefined}
      type="range"
      className="sr-only"
      min={0}
      max={100}
      step={step}
      value={which === "x" ? x : y}
      disabled={disabled}
      aria-label={`${ariaLabel ?? label}, ${which === "x" ? "horizontal" : "vertical"}`}
      aria-valuetext={`${Math.round(which === "x" ? x : y)} percent`}
      onChange={(event) => apply({ [which]: event.currentTarget.valueAsNumber }, false)}
      onKeyDown={(event) => handleKeyDown(event, which)}
      onKeyUp={commit}
    />
  );

  return (
    /*
     * The two range inputs sit beside the Popover rather than inside it: a button
     * may not contain a control, and putting them in the editor would mean the
     * keyboard and the form only reached the value while it happened to be open.
     */
    <>
      <Popover onOpenChange={onOpenChange}>
          {/*
          The row is the trigger, so the editor can take the trigger width and open
          flush with it. The row carries the same pad in miniature: two numbers say
          where the point is, but only a picture says where that is on the surface.
        */}
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={ariaLabel}
            data-slot="inspector-position"
            data-disabled={disabled}
            className={cn(
              "group/inspector-position flex w-full cursor-pointer items-center gap-2 text-left",
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
              data-slot="inspector-position-label"
              className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
            >
              {Icon ? <Icon className="size-4 shrink-0" /> : null}
              <span className="truncate">{label}</span>
            </span>

            <span className="ml-auto flex min-w-0 items-center gap-2">
              <span
                data-slot="inspector-position-value"
                className="truncate text-sm font-medium text-foreground select-none"
              >
                {summarize(x, y)}
              </span>
              <span
                aria-hidden="true"
                data-slot="inspector-position-preview"
                className="relative size-5 shrink-0 rounded-sm border border-border bg-background"
              >
                <span
                  className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
                  style={{ left: `${x}%`, top: `${y}%` }}
                />
              </span>
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
            The pad is the control: press anywhere in it and the point goes there,
            drag and it follows. The nine dots are targets rather than buttons, since
            the snap already lands on them and a button over each one would swallow
            the drag that starts on it.
          */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer surface for the range inputs below it */}
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pointer surface for the range inputs below it */}
          <div
            ref={padRef}
            data-slot="inspector-position-pad"
            aria-hidden="true"
            className={cn(
              "relative aspect-square w-full cursor-crosshair touch-none overflow-hidden",
              "rounded-md bg-muted bg-cover bg-center",
            )}
            style={preview ? { backgroundImage: preview } : undefined}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/*
              A dashed grid every quarter of the pad, which is close enough to read a
              point off and coarse enough to stay out of its way. It stops where the
              point's travel stops rather than running to the edge, so the grid and
              the point measure the same square — and dashed rather than solid
              because this is something to read the point against, not a divider.
            */}
            {GRID_LINES.map((line) => (
              <React.Fragment key={line}>
                <span
                  className="pointer-events-none absolute border-t border-dashed border-foreground/15"
                  style={{ top: handleOffset(line), left: INSET, right: INSET }}
                />
                <span
                  className="pointer-events-none absolute border-l border-dashed border-foreground/15"
                  style={{ left: handleOffset(line), top: INSET, bottom: INSET }}
                />
              </React.Fragment>
            ))}

            {/*
              The origin: solid where the guides are dashed, and at nearly three
              times their weight, because the middle of the pad is a fact about the
              surface rather than another interval — a cross the reader measures
              everything else against has to win against the grid it sits on, not
              blend into it. Its own half-pixel is translated away, since a hairline
              placed *at* the centre would sit just under it.
            */}
            <span
              className="pointer-events-none absolute h-px -translate-y-1/2 bg-foreground/40"
              style={{ top: handleOffset(50), left: INSET, right: INSET }}
            />
            <span
              className="pointer-events-none absolute w-px -translate-x-1/2 bg-foreground/40"
              style={{ left: handleOffset(50), top: INSET, bottom: INSET }}
            />

            {THIRDS.map((dotY) =>
              THIRDS.map((dotX) => (
                <span
                  key={`${dotX}-${dotY}`}
                  className="pointer-events-none absolute size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25"
                  style={{ left: handleOffset(dotX), top: handleOffset(dotY) }}
                />
              )),
            )}

            {/*
              The point is two tones, not one: a `foreground` core so it inverts with
              the theme and never washes out on the muted pad, wrapped in a
              `background` ring so it still separates from a preview image that could
              be any colour underneath. A hardcoded white dot could only ever be right
              against one of those two.
            */}
            <span
              data-slot="inspector-position-point"
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-2 ring-background"
              style={{ left: handleOffset(x), top: handleOffset(y) }}
            />
          </div>
        </PopoverContent>
      </Popover>

      {axis("x")}
      {axis("y")}
    </>
  );
}
