"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. */
type Size = "sm" | "default" | "lg";

/* -------------------------------------------------------------------------- */
/* Interaction tuning                                                         */
/* -------------------------------------------------------------------------- */

/** Pointer travel (CSS px) before a press stops being a click and becomes a drag. */
const DRAG_THRESHOLD = 3;
/** Cursor distance past the row edge that is ignored before the band stretches. */
const OVERDRAG_DEAD_ZONE = 32;
/** Cursor distance past the dead zone that maps to the full stretch. */
const OVERDRAG_RANGE = 200;
/** Widest the rubber band pulls, in px. */
const OVERDRAG_MAX = 8;
/** Drag sensitivity while Shift is held (precision mode). */
const PRECISION_FACTOR = 0.25;
/** Keyboard and wheel multiplier while Shift is held (coarse mode). */
const COARSE_FACTOR = 10;
/** Normalized distance within which the value is magnetically pulled to a tick. */
const SNAP_RADIUS = 0.03;
/** Trailing idle time (ms) before a wheel gesture counts as committed. */
const WHEEL_COMMIT_DELAY = 180;
/**
 * Window in which two clicks count as one sequence. Used to remember the value
 * from before a double-click, since `PointerEvent.detail` is specified as 0 and
 * cannot be relied on for a click count.
 */
const DOUBLE_CLICK_WINDOW = 500;
/** Gap kept between the handle and the label/readout before the handle gives way. */
const CROWD_BUFFER = 8;
/** Handle width in px. Mirrors the `w-1` utility on the handle element. */
const HANDLE_WIDTH = 4;
/** Distance the handle keeps from the rounded ends of the track. */
const HANDLE_INSET = 4;

/**
 * Spring-shaped easing sampled from a lightly under-damped spring. Click jumps,
 * keyboard steps and the rubber-band release all run on plain CSS transitions
 * with this curve (420ms, matching the `duration-[420ms]` utilities below), so
 * the component needs no animation library and the motion stays on the
 * compositor.
 */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

/** Fallback snap targets for continuous ranges: every decile plus both ends. */
const DECILE_FRACTIONS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** The measuring effects must not warn while this client component renders on the server. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function clamp(value: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, value));
}

/**
 * Decimal places implied by `step`, so a 0.05 step formats as "0.55" instead of
 * "0.5500000000000001". Handles exponential notation (1e-4) as well.
 */
function stepDecimals(step: number) {
  if (!Number.isFinite(step) || step <= 0) return 2;
  const text = String(step);
  const exponent = /e-(\d+)$/.exec(text);
  if (exponent) {
    const mantissaDecimals = text.split("e")[0]?.split(".")[1]?.length ?? 0;
    return Number(exponent[1]) + mantissaDecimals;
  }
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

const toneStyles: Record<Tone, { surface: string; fill: string }> = {
  muted: {
    surface: "bg-muted",
    fill: "bg-muted-foreground/10 group-data-[active=true]/inspector-slider:bg-muted-foreground/20",
  },
  outline: {
    surface: "border border-border",
    fill: "bg-muted group-data-[active=true]/inspector-slider:bg-muted-foreground/15",
  },
  ghost: {
    surface: "border border-transparent group-data-[active=true]/inspector-slider:border-border",
    fill: "bg-muted",
  },
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

/** Geometry and modifier state captured for the lifetime of one pointer gesture. */
interface DragSession {
  pointerId: number;
  startX: number;
  startY: number;
  /** Row geometry captured on press, so mid-drag layout shifts cannot warp the math. */
  left: number;
  right: number;
  /** Unscaled (CSS pixel) width of the row. */
  width: number;
  /** Scale factor of any ancestor transform — block previews scale their canvas. */
  scale: number;
  dragging: boolean;
  /** Whether Shift was held on the most recent frame (precision drag). */
  precise: boolean;
  /**
   * Cursor x and normalized position at the moment precision mode last changed.
   * Anchoring on the drawn fraction rather than on the (step-quantized) value
   * keeps the handle from hopping onto the grid when Shift is pressed.
   */
  anchorX: number;
  anchorFraction: number;
}

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface InspectorSliderProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: number;
  /** Initial value in uncontrolled mode. Falls back to `min`. */
  defaultValue?: number;
  /** Fires on every drag frame, click, key press, wheel tick and typed edit. */
  onValueChange?: (value: number) => void;
  /**
   * Fires once when a gesture ends and the value actually changed (pointer
   * release, key release, end of a wheel burst, typed edit). Use it for
   * expensive work such as persisting or re-rendering a WebGL scene.
   */
  onValueCommit?: (value: number) => void;

  /**
   * Minimum value.
   * @defaultValue 0 */
  min?: number;
  /**
   * Maximum value.
   * @defaultValue 1 */
  max?: number;
  /**
   * Smallest increment. Also drives readout precision and keyboard steps.
   * @defaultValue 0.01 */
  step?: number;
  /** Format the readout. Defaults to `value.toFixed(...)` plus `unit`. */
  formatValue?: (value: number) => string;
  /** Suffix appended to the default readout, e.g. "%", "px", "°". */
  unit?: string;

  /**
   * Tick marks inside the track: `true` for automatic (one per step up to 12,
   * otherwise deciles), a count, an explicit list of values, or `false`.
   * @defaultValue true */
  ticks?: boolean | number | number[];
  /**
   * Magnetically pull a click to the nearest tick. Dragging is never snapped —
   * it stays continuous and only `step` quantizes it.
   * @defaultValue true */
  snap?: boolean;
  /** Allow an exact value to be typed in, by double-clicking the row or pressing Enter. */
  editable?: boolean;
  /**
   * Adjust the value with the wheel while the row has keyboard focus.
   * @defaultValue true */
  wheel?: boolean;
  /** Value restored by Alt-click. Falls back to `defaultValue`, then `min`. */
  resetValue?: number;
  /** Block every interaction and dim the row. */
  disabled?: boolean;

  /**
   * Surface treatment: filled (default), hairline outline, or bare until hover.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Row height preset.
   * @defaultValue "default" */
  size?: Size;

  /** Name of the underlying range input, so the row can take part in a form. */
  name?: string;
  /** Id of the underlying range input, for an external `<label htmlFor>`. */
  id?: string;
  className?: string;
  /**
   * Classes for the label. Needed when the row sits on something other than a
   * theme surface — a colour ramp, say — and the muted default stops being
   * legible. Merged onto the element, so a text colour here simply wins.
   */
  labelClassName?: string;
  /**
   * Classes for the value readout. Note that the readout brightens to
   * `text-foreground` while the row is engaged, so an override that must hold
   * during hover and drag has to restate itself:
   * `"text-white group-data-[active=true]/inspector-slider:text-white"`.
   */
  valueClassName?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorSliderDemo: InspectorSliderProps = {
  label: "Blend",
  className: "w-72",
  min: 0,
  max: 1,
  step: 0.01,
  defaultValue: 0.55,
  editable: true,
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function InspectorSlider({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 1,
  step = 0.01,
  formatValue,
  unit,
  ticks = true,
  snap = true,
  editable = false,
  wheel = true,
  resetValue,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  labelClassName,
  valueClassName,
  "aria-label": ariaLabel,
}: InspectorSliderProps) {
  const span = max - min || 1;
  const decimals = React.useMemo(() => stepDecimals(step), [step]);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const readoutRef = React.useRef<HTMLSpanElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const editRef = React.useRef<HTMLInputElement>(null);

  /**
   * Props that internal callbacks read but must not depend on. Keeping them in
   * a ref lets every handler below stay referentially stable even when the
   * parent passes fresh inline callbacks on each render.
   */
  const latest = React.useRef({ onValueChange, onValueCommit, formatValue });
  useIsomorphicLayoutEffect(() => {
    latest.current = { onValueChange, onValueCommit, formatValue };
  });

  const quantize = React.useCallback(
    (raw: number) => {
      const bounded = clamp(raw, min, max);
      if (!(step > 0)) return bounded;
      const stepped = min + Math.round((bounded - min) / step) * step;
      return clamp(Number(stepped.toFixed(decimals)), min, max);
    },
    [min, max, step, decimals],
  );

  const format = React.useCallback(
    (value: number) => {
      const custom = latest.current.formatValue;
      return custom ? custom(value) : `${value.toFixed(decimals)}${unit ?? ""}`;
    },
    [decimals, unit],
  );

  /**
   * Value rendered by React. In controlled mode it tracks the prop; in
   * uncontrolled mode it is the mount value and never changes again — every
   * later update is written straight to the DOM, so dragging costs zero
   * renders. React only rewrites an attribute when its own previous and next
   * values differ, so those imperative writes are never clobbered.
   */
  const renderValue = quantize(valueProp ?? defaultValue ?? min);
  const mountValue = React.useRef(renderValue).current;

  /** Authoritative current value for all imperative work. */
  const valueRef = React.useRef(mountValue);
  /** Normalized position currently drawn, which during a drag is sub-step. */
  const fractionRef = React.useRef(clamp((mountValue - min) / span, 0, 1));
  /**
   * Frozen copy for the inline style, so SSR and the first paint are correct
   * while React never rewrites the property afterwards. A controlled parent
   * re-rendering mid-drag would otherwise pull the handle back onto the step
   * grid; every later update goes through `paint` instead.
   */
  const mountFraction = React.useRef(fractionRef.current).current;
  /** Last value handed to `onValueCommit`, so a gesture only commits real changes. */
  const commitBaseRef = React.useRef(mountValue);
  const sessionRef = React.useRef<DragSession | null>(null);
  const frameRef = React.useRef(0);
  const pendingXRef = React.useRef(0);
  const keyGestureRef = React.useRef(false);
  const wheelTimerRef = React.useRef(0);
  /** Set by Escape so a trailing blur cannot commit the abandoned draft. */
  const editCancelledRef = React.useRef(false);
  /** Distinguishes a real exit from edit mode from the initial mount. */
  const wasEditingRef = React.useRef(false);
  /** Start of the current click sequence, rewound when a double-click opens the editor. */
  const clickRef = React.useRef({ time: 0, value: mountValue });
  /** Normalized positions where the handle starts to overlap the label or readout. */
  const crowdRef = React.useRef({ left: 0.35, right: 0.75 });
  const flagsRef = React.useRef({
    hover: false,
    focus: false,
    press: false,
    drag: false,
    crowded: false,
  });

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  /* ---------------------------------------------------------------- ticks -- */

  const tickFractions = React.useMemo<number[]>(() => {
    if (ticks === false) return [];
    if (Array.isArray(ticks)) {
      return ticks
        .map((value) => (value - min) / span)
        .filter((fraction) => fraction > 0 && fraction < 1);
    }
    const stepsInRange = step > 0 ? Math.round(span / step) : 0;
    const count =
      typeof ticks === "number"
        ? Math.round(ticks)
        : stepsInRange > 1 && stepsInRange <= 12
          ? stepsInRange
          : 10;
    if (count < 2) return [];
    return Array.from({ length: count - 1 }, (_, index) => (index + 1) / count);
  }, [ticks, min, span, step]);

  const snapTargets = React.useMemo<number[]>(() => {
    if (!snap) return [];
    return [0, ...(tickFractions.length ? tickFractions : DECILE_FRACTIONS), 1];
  }, [snap, tickFractions]);

  const snapFraction = React.useCallback(
    (fraction: number) => {
      let best = fraction;
      let bestDistance = SNAP_RADIUS;
      for (const target of snapTargets) {
        const distance = Math.abs(target - fraction);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = target;
        }
      }
      return best;
    },
    [snapTargets],
  );

  /* ------------------------------------------------------------ painting -- */

  /**
   * Push the three visual states onto the root as data attributes. They are
   * mutually exclusive strings rather than independent booleans so the handle's
   * four looks can never fight each other in the cascade.
   */
  const writeState = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const flags = flagsRef.current;
    const active = flags.hover || flags.focus || flags.press;
    root.dataset.active = active ? "true" : "false";
    root.dataset.dragging = flags.drag ? "true" : "false";
    root.dataset.handle = !active
      ? "hidden"
      : flags.crowded
        ? "crowded"
        : flags.drag
          ? "dragging"
          : "idle";
  }, []);

  /**
   * Move the fill and the handle. One custom property drives both, as
   * compositor-only transforms. The fraction is deliberately independent of the
   * step grid so a drag can track the cursor continuously.
   */
  const paintFraction = React.useCallback(
    (fraction: number) => {
      const root = rootRef.current;
      if (!root) return;
      fractionRef.current = fraction;
      root.style.setProperty("--inspector-f", String(fraction));

      const crowd = crowdRef.current;
      flagsRef.current.crowded = fraction < crowd.left || fraction > crowd.right;
      writeState();
    },
    [writeState],
  );

  /** Update the readout text and the accessible value on the native input. */
  const paintValue = React.useCallback(
    (value: number) => {
      const text = format(value);
      if (readoutRef.current) readoutRef.current.textContent = text;

      const input = inputRef.current;
      if (input) {
        input.value = String(value);
        input.setAttribute("aria-valuetext", text);
      }
    },
    [format],
  );

  /** Write one value to the DOM, handle and readout in agreement. */
  const paint = React.useCallback(
    (value: number) => {
      paintFraction(clamp((value - min) / span, 0, 1));
      paintValue(value);
    },
    [paintFraction, paintValue, min, span],
  );

  /** Snap, store and broadcast a new value. Returns the value that was applied. */
  const apply = React.useCallback(
    (raw: number) => {
      const value = quantize(raw);
      const changed = value !== valueRef.current;
      valueRef.current = value;
      paint(value);
      if (changed) latest.current.onValueChange?.(value);
      return value;
    },
    [quantize, paint],
  );

  /**
   * Drag path. The handle follows the cursor at full resolution while the value
   * that is reported and displayed stays on the step grid, so a coarse step
   * (say 500) never turns the drag into a sequence of visible jumps. The release
   * settles the handle onto the grid position.
   */
  const applyFromDrag = React.useCallback(
    (fraction: number) => {
      paintFraction(fraction);
      const value = quantize(min + fraction * span);
      if (value === valueRef.current) return;
      valueRef.current = value;
      paintValue(value);
      latest.current.onValueChange?.(value);
    },
    [paintFraction, paintValue, quantize, min, span],
  );

  /** Close a gesture, reporting the net change once. */
  const endGesture = React.useCallback(() => {
    if (valueRef.current === commitBaseRef.current) return;
    commitBaseRef.current = valueRef.current;
    latest.current.onValueCommit?.(valueRef.current);
  }, []);

  const nudge = React.useCallback(
    (multiplier: number) => {
      const increment = step > 0 ? step : span / 100;
      apply(valueRef.current + increment * multiplier);
    },
    [apply, step, span],
  );

  /* ----------------------------------------------------------- typed edit -- */

  const startEditing = () => {
    if (disabled || !editable) return;
    setDraft(String(valueRef.current));
    setEditing(true);
  };

  /**
   * Double-click opens the editor. The number itself is not a hit area — a press
   * anywhere, the readout included, moves the value — so the two clicks that led
   * here are rewound first.
   */
  const handleDoubleClick = () => {
    if (disabled || !editable) return;
    apply(clickRef.current.value);
    startEditing();
  };

  const commitEdit = () => {
    setEditing(false);
    // Escape already closed the editor; a blur arriving afterwards must not
    // apply the abandoned draft.
    if (editCancelledRef.current) {
      editCancelledRef.current = false;
      return;
    }
    const parsed = Number.parseFloat(draft.replace(",", "."));
    if (!Number.isFinite(parsed)) return;
    apply(parsed);
    endGesture();
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      editCancelledRef.current = true;
      setEditing(false);
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (editing) {
      wasEditingRef.current = true;
      // focus() before select(): select() alone is not specified to move focus.
      editRef.current?.focus({ preventScroll: true });
      editRef.current?.select();
      return;
    }
    // Only act on a real exit from edit mode — never on mount, which would
    // steal focus on page load.
    if (!wasEditingRef.current) return;
    wasEditingRef.current = false;
    // The readout remounts with the value React last rendered, which is stale in
    // uncontrolled mode, so repaint it from the live value.
    paint(valueRef.current);
    inputRef.current?.focus({ preventScroll: true });
  }, [editing, paint]);

  /* -------------------------------------------------------------- pointer -- */

  /** One value update per frame, no matter how many pointer events arrive. */
  const runFrame = React.useCallback(() => {
    frameRef.current = 0;
    const session = sessionRef.current;
    if (!session?.dragging) return;

    const x = pendingXRef.current;
    const fraction = session.precise
      ? session.anchorFraction +
        (((x - session.anchorX) / session.scale) / session.width) * PRECISION_FACTOR
      : (x - session.left) / session.scale / session.width;

    // No magnetic snapping here: a drag is continuous, and only `step` limits
    // it. Snapping mid-drag would move the value in tick-sized jumps.
    applyFromDrag(clamp(fraction, 0, 1));

    // Rubber band: how far the cursor has run past the row, eased off.
    const past =
      x < session.left
        ? session.left - x
        : x > session.right
          ? x - session.right
          : 0;
    const overflow = Math.max(0, past - OVERDRAG_DEAD_ZONE);
    const pull = OVERDRAG_MAX * Math.sqrt(Math.min(overflow / OVERDRAG_RANGE, 1));
    const root = rootRef.current;
    root?.style.setProperty("--inspector-pull-w", `${pull}px`);
    root?.style.setProperty("--inspector-pull-x", x < session.left ? `${-pull}px` : "0px");
  }, [applyFromDrag]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Only the primary button starts a gesture.
    if (disabled || event.button !== 0 || !event.isPrimary) return;

    const root = rootRef.current;
    if (!root) return;

    event.preventDefault();
    root.setPointerCapture(event.pointerId);

    const rect = root.getBoundingClientRect();
    const width = root.offsetWidth || rect.width || 1;
    sessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      right: rect.right,
      width,
      scale: rect.width / width || 1,
      dragging: false,
      precise: event.shiftKey,
      anchorX: event.clientX,
      anchorFraction: fractionRef.current,
    };

    flagsRef.current.press = true;
    writeState();

    // Move focus so keyboard, wheel and screen-reader adjustments land here next.
    inputRef.current?.focus({ preventScroll: true });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const session = sessionRef.current;
    if (!session || event.pointerId !== session.pointerId) return;

    if (!session.dragging) {
      const travel = Math.hypot(event.clientX - session.startX, event.clientY - session.startY);
      if (travel <= DRAG_THRESHOLD) return;
      session.dragging = true;
      session.anchorX = event.clientX;
      session.anchorFraction = fractionRef.current;
      flagsRef.current.drag = true;
      writeState();
    }

    // Entering or leaving precision mode re-anchors, so the handle never jumps.
    if (event.shiftKey !== session.precise) {
      session.precise = event.shiftKey;
      session.anchorX = event.clientX;
      session.anchorFraction = fractionRef.current;
    }

    pendingXRef.current = event.clientX;
    if (!frameRef.current) frameRef.current = requestAnimationFrame(runFrame);
  };

  const finishGesture = (event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const session = sessionRef.current;
    if (!session || event.pointerId !== session.pointerId) return;
    sessionRef.current = null;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }

    const root = rootRef.current;
    flagsRef.current.drag = false;
    flagsRef.current.press = false;

    if (!cancelled && !session.dragging) {
      // A press that never became a drag is a click: Alt resets, otherwise the
      // value springs to the release point, magnetically pulled to the nearest
      // tick. Aiming is coarse when you tap, so snapping helps there — unlike
      // during a drag, where it would fight the cursor.
      if (event.altKey) {
        apply(resetValue ?? defaultValue ?? min);
      } else {
        // Remember what the value was before a fresh click sequence, so opening
        // the editor with a double-click can undo the clicks that got it there.
        const click = clickRef.current;
        if (event.timeStamp - click.time > DOUBLE_CLICK_WINDOW) click.value = valueRef.current;
        click.time = event.timeStamp;

        const raw = clamp((event.clientX - session.left) / session.scale / session.width, 0, 1);
        apply(min + (snapTargets.length ? snapFraction(raw) : raw) * span);
      }
    } else if (session.dragging) {
      // Settle the handle from its sub-step drag position onto the grid.
      paint(valueRef.current);
    }

    if (root) {
      // Releasing restores the transitions, so the band springs back to rest.
      root.style.setProperty("--inspector-pull-w", "0px");
      root.style.setProperty("--inspector-pull-x", "0px");
      const rect = root.getBoundingClientRect();
      flagsRef.current.hover =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
    }

    writeState();
    endGesture();
  };

  /* ------------------------------------------------------------- keyboard -- */

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (event.key === "Enter" && editable) {
      event.preventDefault();
      startEditing();
      return;
    }

    const increment = (step > 0 ? step : span / 100) * (event.shiftKey ? COARSE_FACTOR : 1);
    // Page steps scale with the range, as WAI-ARIA recommends, but never fall
    // below a single step on coarse sliders.
    const page = Math.max(step > 0 ? step : 0, span / 10);
    let next: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = valueRef.current + increment;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = valueRef.current - increment;
        break;
      case "PageUp":
        next = valueRef.current + page;
        break;
      case "PageDown":
        next = valueRef.current - page;
        break;
      case "Home":
        next = min;
        break;
      case "End":
        next = max;
        break;
      default:
        return;
    }

    event.preventDefault();
    keyGestureRef.current = true;
    apply(next);
  };

  const handleKeyUp = () => {
    if (!keyGestureRef.current) return;
    keyGestureRef.current = false;
    endGesture();
  };

  /**
   * Assistive-technology adjustments (VoiceOver swipes, Windows Narrator) change
   * the native input directly instead of firing a key event. The listener is
   * attached natively rather than through `onChange` because this component also
   * writes `input.value` imperatively, which leaves React's change tracker stale
   * and can make it swallow a synthetic change event.
   */
  React.useEffect(() => {
    const input = inputRef.current;
    if (!input || disabled) return;

    const onInput = () => {
      // Pointer drags and key steps are already handled and write the value
      // themselves; only unhandled (assistive) adjustments get here.
      if (sessionRef.current || keyGestureRef.current) return;
      const next = input.valueAsNumber;
      if (!Number.isFinite(next)) return;
      apply(next);
      endGesture();
    };

    input.addEventListener("input", onInput);
    return () => input.removeEventListener("input", onInput);
  }, [apply, endGesture, disabled]);

  /* ---------------------------------------------------------------- wheel -- */

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || !wheel || disabled) return;

    // Attached manually because React's onWheel is passive and cannot block the
    // page from scrolling. Only a focused row reacts, so plain scrolling past a
    // settings panel is never hijacked.
    const onWheel = (event: WheelEvent) => {
      if (!inputRef.current || document.activeElement !== inputRef.current) return;
      const primary =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? -event.deltaY : event.deltaX;
      const direction = Math.sign(primary);
      if (!direction) return;

      event.preventDefault();
      nudge(direction * (event.shiftKey ? COARSE_FACTOR : 1));

      window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(endGesture, WHEEL_COMMIT_DELAY);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      window.clearTimeout(wheelTimerRef.current);
    };
  }, [wheel, disabled, nudge, endGesture]);

  /* ---------------------------------------------------------- measurement -- */

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Derive the thresholds where the handle would collide with the label or the
    // readout from live layout, so padding, icons and size presets all work out
    // without hard-coded offsets.
    const measure = () => {
      const width = root.offsetWidth;
      if (!width) return;

      const labelEl = labelRef.current;
      const readoutEl = readoutRef.current;
      const left = labelEl
        ? (labelEl.offsetLeft + labelEl.offsetWidth + CROWD_BUFFER) / width
        : 0.35;
      const right = readoutEl ? (readoutEl.offsetLeft - CROWD_BUFFER) / width : 0.75;

      const previous = crowdRef.current;
      if (previous.left === left && previous.right === right) return;
      crowdRef.current = { left, right };
      paint(valueRef.current);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    if (labelRef.current) observer.observe(labelRef.current);
    if (readoutRef.current) observer.observe(readoutRef.current);
    return () => observer.disconnect();
  }, [paint, editing]);

  /* ------------------------------------------------- controlled value sync -- */

  // `paint` changes identity only when the scale or the formatting does
  // (min/max/step/unit), so this repaints the row after such a prop change —
  // and gives the first paint its authoritative pass on mount.
  useIsomorphicLayoutEffect(() => {
    if (sessionRef.current?.dragging) return;
    paint(valueRef.current);
  }, [paint]);

  useIsomorphicLayoutEffect(() => {
    if (valueProp === undefined) return; // uncontrolled: the DOM is the source of truth
    if (sessionRef.current?.dragging) return; // never fight an in-flight drag
    const next = quantize(valueProp);
    if (next === valueRef.current) return;
    valueRef.current = next;
    commitBaseRef.current = next;
    paint(next);
  }, [valueProp, quantize, paint]);

  React.useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /* ---------------------------------------------------------------- render -- */

  const toneStyle = toneStyles[tone];

  return (
    // The row is only a pointer surface. The accessible, focusable, form-bound
    // slider is the native range input inside it, so the wrapper deliberately
    // carries no role of its own.
    // biome-ignore lint/a11y/noStaticElementInteractions: pointer surface for the native range input below
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: pointer surface for the native range input below
    <div
      ref={rootRef}
      data-slot="inspector-slider"
      data-active="false"
      data-dragging="false"
      data-handle="hidden"
      data-disabled={disabled}
      className={cn(
        "group/inspector-slider relative h-(--inspector-height) touch-none select-none",
        "cursor-pointer rounded-(--inspector-radius) data-[dragging=true]:cursor-ew-resize",
        "[--inspector-radius:var(--radius-xl)]",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
        sizeStyles[size],
        className,
      )}
      style={
        {
          "--inspector-f": mountFraction,
          "--inspector-ease": SPRING_EASE,
        } as React.CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => finishGesture(event, false)}
      onPointerCancel={(event) => finishGesture(event, true)}
      onDoubleClick={handleDoubleClick}
      onPointerEnter={() => {
        flagsRef.current.hover = true;
        writeState();
      }}
      onPointerLeave={() => {
        flagsRef.current.hover = false;
        writeState();
      }}
    >
      <div
        data-slot="inspector-slider-track"
        className={cn(
          "absolute inset-y-0 left-0 overflow-hidden rounded-(--inspector-radius)",
          "motion-safe:transition-[width,transform] motion-safe:duration-[420ms] motion-safe:ease-(--inspector-ease)",
          "group-data-[dragging=true]/inspector-slider:transition-none",
          toneStyle.surface,
        )}
        style={{
          // The rubber band widens and pulls the surface without distorting the
          // text inside it. Both vars stay at rest until the cursor overshoots.
          width: "calc(100% + var(--inspector-pull-w, 0px))",
          transform: "translateX(var(--inspector-pull-x, 0px))",
        }}
      >
        {tickFractions.length > 0 && (
          <div
            data-slot="inspector-slider-ticks"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-data-[active=true]/inspector-slider:opacity-100"
          >
            {tickFractions.map((fraction) => (
              <span
                key={fraction}
                className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/30"
                style={{ left: `${fraction * 100}%` }}
              />
            ))}
          </div>
        )}

        <div
          data-slot="inspector-slider-fill"
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 origin-left",
            "motion-safe:transition-[transform,background-color] motion-safe:duration-[420ms] motion-safe:ease-(--inspector-ease)",
            "group-data-[dragging=true]/inspector-slider:transition-none",
            toneStyle.fill,
          )}
          style={{ transform: "scaleX(var(--inspector-f))" }}
        />

        <div
          data-slot="inspector-slider-handle-track"
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-full",
            "motion-safe:transition-transform motion-safe:duration-[420ms] motion-safe:ease-(--inspector-ease)",
            "group-data-[dragging=true]/inspector-slider:transition-none",
          )}
          style={{
            // Percentages inside translateX resolve against this full-width
            // positioner, so the handle rides the same custom property as the
            // fill while clamp() keeps it clear of the rounded ends.
            transform: `translateX(clamp(${HANDLE_INSET}px, calc(var(--inspector-f) * 100% - ${HANDLE_WIDTH / 2}px), calc(100% - ${HANDLE_INSET + HANDLE_WIDTH}px)))`,
          }}
        >
          <div
            data-slot="inspector-slider-handle"
            className={cn(
              "absolute inset-y-2 w-1 rounded-full bg-foreground opacity-50",
              "transition-[opacity,transform] duration-200",
              "group-data-[handle=hidden]/inspector-slider:scale-x-[0.25] group-data-[handle=hidden]/inspector-slider:opacity-0",
              "group-data-[handle=dragging]/inspector-slider:opacity-80",
              "group-data-[handle=crowded]/inspector-slider:scale-y-75 group-data-[handle=crowded]/inspector-slider:opacity-10",
            )}
          />
        </div>

        <span
          ref={labelRef}
          data-slot="inspector-slider-label"
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1/2 left-(--inspector-pad) flex max-w-[55%] -translate-y-1/2 items-center gap-1.5 text-sm font-medium text-foreground/70",
            labelClassName,
          )}
        >
          {Icon && <Icon className="size-4 shrink-0" />}
          <span className="truncate">{label}</span>
        </span>

        {editing ? (
          <input
            ref={editRef}
            type="text"
            inputMode="decimal"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={commitEdit}
            aria-label={`${ariaLabel ?? label} value`}
            className="absolute top-1/2 right-(--inspector-pad) w-16 -translate-y-1/2 rounded-sm bg-background px-1 text-right font-mono text-sm font-medium tabular-nums text-foreground outline-none ring-2 ring-ring/50"
          />
        ) : (
          <span
            ref={readoutRef}
            data-slot="inspector-slider-value"
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute top-1/2 right-(--inspector-pad) -translate-y-1/2",
              "font-mono text-sm font-medium tabular-nums transition-colors",
              "text-foreground/70 group-data-[active=true]/inspector-slider:text-foreground",
              valueClassName,
            )}
          >
            {format(renderValue)}
          </span>
        )}

        {/*
          The real slider: a native range input carries the role, the value, the
          accessible name, form participation and assistive-technology gestures,
          while the visible row above draws the state. Keyboard handling is taken
          over so Shift and Page steps behave the same in every browser, so the
          step attribute stays open.
        */}
        <input
          ref={inputRef}
          type="range"
          className="sr-only"
          min={min}
          max={max}
          step="any"
          defaultValue={String(renderValue)}
          disabled={disabled}
          name={name}
          id={id}
          aria-label={ariaLabel ?? label}
          aria-valuetext={format(renderValue)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={() => {
            flagsRef.current.focus = true;
            writeState();
          }}
          onBlur={() => {
            flagsRef.current.focus = false;
            writeState();
            endGesture();
          }}
        />
      </div>
    </div>
  );
}
