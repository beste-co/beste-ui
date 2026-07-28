"use client";

import { CheckIcon, PipetteIcon } from "lucide-react";
import * as React from "react";
import { InspectorSlider } from "@/components/beste/component/inspector-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/** Notation the callbacks emit. Input is always parsed from any of them. */
type ColorFormat = "hex" | "oklch" | "rgb";

/** The working model. OKLCH is perceptual, so every control moves predictably. */
interface OklchColor {
  /** Lightness, 0 to 1. */
  l: number;
  /** Chroma, 0 to ~0.4 for sRGB. */
  c: number;
  /** Hue angle in degrees, 0 to 360. */
  h: number;
  /** Alpha, 0 to 1. */
  a: number;
}

/* -------------------------------------------------------------------------- */
/* Tuning                                                                     */
/* -------------------------------------------------------------------------- */

/** Chroma ceiling for the slider. sRGB tops out near 0.32, P3 a little higher. */
const CHROMA_MAX = 0.4;
/** Backing resolution of the lightness/chroma plane; CSS scales it up smoothly. */
const PLANE_WIDTH = 96;
const PLANE_HEIGHT = 64;
/** Tolerance for calling a converted channel in-gamut. */
const GAMUT_EPSILON = 0.0005;
/** Keyboard step on the plane. */
const PLANE_KEY_STEP = 0.01;
const PLANE_KEY_STEP_COARSE = 0.1;

const FALLBACK_COLOR: OklchColor = { l: 0.5, c: 0, h: 0, a: 1 };

/** Hue rail: one stop per 30 degrees, at a mid lightness and chroma. */
const HUE_RAIL = `linear-gradient(to right, ${Array.from(
  { length: 13 },
  (_, index) => `oklch(0.72 0.17 ${index * 30})`,
).join(", ")})`;

/** Checkerboard behind the alpha rail, drawn with one conic gradient. */
const ALPHA_CHECKER =
  "conic-gradient(from 90deg at 50% 50%, color-mix(in srgb, currentColor 12%, transparent) 25%, transparent 0 50%, color-mix(in srgb, currentColor 12%, transparent) 0 75%, transparent 0)";

/*
 * A row is a plain inspector-slider until it is hovered, and its ramp only
 * appears then. Everything below is scoped to that hover, and all three parts
 * have to move together: uncovering the gradient means dropping the row's own
 * surface and fill, which would otherwise sit on top of it, and the label and the
 * value have to go white with a halo for the moment they are over a ramp that can
 * run from black to white. `group-hover/rail` is what ties them to the wrapper.
 *
 * The value restates itself under `group-data-[active=true]` because hovering
 * also engages the row, which brightens the readout to `text-foreground` — a rule
 * specific enough to win unless the override matches it.
 */
const RAIL_SURFACE =
  "group-hover/rail:[&_[data-slot=inspector-slider-track]]:bg-transparent group-hover/rail:[&_[data-slot=inspector-slider-fill]]:bg-transparent";
const RAIL_LABEL = "group-hover/rail:text-white group-hover/rail:[text-shadow:0_1px_3px_#000c]";
const RAIL_VALUE =
  "group-hover/rail:text-white group-hover/rail:group-data-[active=true]/inspector-slider:text-white group-hover/rail:[text-shadow:0_1px_3px_#000c]";

/* -------------------------------------------------------------------------- */
/* Colour maths — sRGB <-> OKLab/OKLCH, using Björn Ottosson's matrices        */
/* -------------------------------------------------------------------------- */

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function clamp(value: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, value));
}

function srgbToLinear(channel: number) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel: number) {
  return channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
}

/** Linear sRGB in 0..1 to OKLCH. */
function linearRgbToOklch(r: number, g: number, b: number): OklchColor {
  const long = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const medium = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const short = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const lightness = 0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short;
  const a = 1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short;
  const b2 = 0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short;

  const chroma = Math.hypot(a, b2);
  const hue = chroma < 1e-6 ? 0 : ((Math.atan2(b2, a) * 180) / Math.PI + 360) % 360;

  return { l: clamp(lightness, 0, 1), c: chroma, h: hue, a: 1 };
}

/** OKLCH to linear sRGB. Channels may fall outside 0..1 when out of gamut. */
function oklchToLinearRgb({ l, c, h }: OklchColor) {
  const hueRadians = (h * Math.PI) / 180;
  const a = c * Math.cos(hueRadians);
  const b = c * Math.sin(hueRadians);

  const long = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const medium = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const short = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return {
    r: 4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    g: -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    b: -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  };
}

/** 0..255 sRGB plus whether the colour actually fits in the sRGB gamut. */
function oklchToRgb(color: OklchColor) {
  const linear = oklchToLinearRgb(color);
  const inGamut =
    linear.r >= -GAMUT_EPSILON &&
    linear.r <= 1 + GAMUT_EPSILON &&
    linear.g >= -GAMUT_EPSILON &&
    linear.g <= 1 + GAMUT_EPSILON &&
    linear.b >= -GAMUT_EPSILON &&
    linear.b <= 1 + GAMUT_EPSILON;

  return {
    r: Math.round(clamp(linearToSrgb(clamp(linear.r, 0, 1)), 0, 1) * 255),
    g: Math.round(clamp(linearToSrgb(clamp(linear.g, 0, 1)), 0, 1) * 255),
    b: Math.round(clamp(linearToSrgb(clamp(linear.b, 0, 1)), 0, 1) * 255),
    inGamut,
  };
}

/**
 * Highest chroma that still fits in sRGB at this lightness and hue. The binary
 * search keeps the last in-gamut value, so the result is always reachable.
 *
 * The plane's horizontal axis is this maximum rather than an absolute chroma:
 * drawing absolute chroma leaves most of the plane out of gamut, as a large
 * unusable wedge whose stair-stepped edge reads as a rendering fault. Scaling
 * each row to its own limit fills the plane and means every pixel the reader can
 * aim at is a colour sRGB can actually show.
 */
function maxChromaAt(l: number, h: number) {
  let low = 0;
  let high = 0.5;
  for (let step = 0; step < 16; step++) {
    const mid = (low + high) / 2;
    if (oklchToRgb({ l, c: mid, h, a: 1 }).inGamut) low = mid;
    else high = mid;
  }
  return low;
}

/** Chroma for a point on the plane, given how far across the row it sits. */
function chromaFromPlane(relative: number, l: number, h: number) {
  return clamp(relative, 0, 1) * maxChromaAt(l, h);
}

/** Where on its row a chroma sits, 0 at grey and 1 at the gamut edge. */
function planePositionOf(c: number, l: number, h: number) {
  const rowMax = maxChromaAt(l, h);
  return rowMax < 1e-4 ? 0 : clamp(c / rowMax, 0, 1);
}

/* ------------------------------------------------------------ parse/format -- */

function trimNumber(value: number, decimals: number) {
  return String(Number(value.toFixed(decimals)));
}

function toHexChannel(value: number) {
  return value.toString(16).padStart(2, "0");
}

function formatColor(color: OklchColor, format: ColorFormat, withAlpha: boolean): string {
  const alpha = clamp(color.a, 0, 1);

  if (format === "oklch") {
    const base = `${trimNumber(color.l, 4)} ${trimNumber(color.c, 4)} ${trimNumber(color.h, 2)}`;
    return withAlpha && alpha < 1
      ? `oklch(${base} / ${trimNumber(alpha, 3)})`
      : `oklch(${base})`;
  }

  const { r, g, b } = oklchToRgb(color);

  if (format === "rgb") {
    return withAlpha && alpha < 1
      ? `rgba(${r}, ${g}, ${b}, ${trimNumber(alpha, 3)})`
      : `rgb(${r}, ${g}, ${b})`;
  }

  const hex = `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`;
  return withAlpha && alpha < 1 ? `${hex}${toHexChannel(Math.round(alpha * 255))}` : hex;
}

/** Parse hex (3/4/6/8 digits), `rgb()`/`rgba()` or `oklch()` into the model. */
function parseColor(input: string | undefined): OklchColor | null {
  if (!input) return null;
  const value = input.trim().toLowerCase();
  if (!value) return null;

  const hex = /^#?([0-9a-f]{3,8})$/.exec(value);
  if (hex?.[1]) {
    const digits = hex[1];
    const expand = (pair: string) => Number.parseInt(pair, 16) / 255;
    let parts: string[] | null = null;

    if (digits.length === 3 || digits.length === 4) {
      parts = digits.split("").map((digit) => digit + digit);
    } else if (digits.length === 6 || digits.length === 8) {
      parts = digits.match(/.{2}/g);
    }
    if (!parts) return null;

    const [r, g, b, a] = parts;
    if (r === undefined || g === undefined || b === undefined) return null;
    const oklch = linearRgbToOklch(
      srgbToLinear(expand(r)),
      srgbToLinear(expand(g)),
      srgbToLinear(expand(b)),
    );
    return { ...oklch, a: a === undefined ? 1 : expand(a) };
  }

  const rgb =
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(value);
  if (rgb?.[1] && rgb[2] && rgb[3]) {
    const channel = (part: string) => srgbToLinear(clamp(Number.parseFloat(part) / 255, 0, 1));
    const oklch = linearRgbToOklch(channel(rgb[1]), channel(rgb[2]), channel(rgb[3]));
    return { ...oklch, a: parseAlpha(rgb[4]) };
  }

  const oklch =
    /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+%?))?\s*\)$/.exec(
      value,
    );
  if (oklch?.[1] && oklch[2] && oklch[3]) {
    const lightness = oklch[1].endsWith("%")
      ? Number.parseFloat(oklch[1]) / 100
      : Number.parseFloat(oklch[1]);
    const chroma = oklch[2].endsWith("%")
      ? (Number.parseFloat(oklch[2]) / 100) * CHROMA_MAX
      : Number.parseFloat(oklch[2]);
    const hue = Number.parseFloat(oklch[3]);
    if (!Number.isFinite(lightness) || !Number.isFinite(chroma) || !Number.isFinite(hue)) {
      return null;
    }
    return {
      l: clamp(lightness, 0, 1),
      c: clamp(chroma, 0, 0.5),
      h: ((hue % 360) + 360) % 360,
      a: parseAlpha(oklch[4]),
    };
  }

  return null;
}

function parseAlpha(raw: string | undefined) {
  if (raw === undefined) return 1;
  const value = raw.endsWith("%") ? Number.parseFloat(raw) / 100 : Number.parseFloat(raw);
  return Number.isFinite(value) ? clamp(value, 0, 1) : 1;
}

/** One row: its ramp, revealed on hover, under the slider that rides on it. */
function Rail({
  gradient,
  checker = false,
  children,
}: {
  gradient: string;
  checker?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group/rail relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-(--inspector-radius) opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100"
      >
        {checker ? (
          // `currentColor` in the checker resolves against this class, so the
          // squares stay neutral instead of picking up the chosen colour.
          <div
            className="absolute inset-0 rounded-(--inspector-radius) text-foreground/70"
            style={{ backgroundImage: ALPHA_CHECKER, backgroundSize: "8px 8px" }}
          />
        ) : null}
        <div
          className="absolute inset-0 rounded-(--inspector-radius)"
          style={{ backgroundImage: gradient }}
        />
      </div>
      {children}
    </div>
  );
}

/** CSS colour for previews. Always renders, even when out of the sRGB gamut. */
function toCssColor(color: OklchColor) {
  const { r, g, b } = oklchToRgb(color);
  return color.a < 1 ? `rgba(${r}, ${g}, ${b}, ${clamp(color.a, 0, 1)})` : `rgb(${r}, ${g}, ${b})`;
}

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface ColorPickerProps {
  /** Current colour. Hex, `rgb()`/`rgba()` and `oklch()` are all understood. */
  color?: string;
  /** Fires on every adjustment, in `format`. */
  onChange?: (color: string) => void;
  /**
   * Fires once an adjustment is finished — a drag release, a committed edit, a
   * swatch click. Use it for work too expensive to run per frame.
   */
  onChangeComplete?: (color: string) => void;

  /**
   * Notation the callbacks emit.
   * @defaultValue "hex" */
  format?: ColorFormat;
  /** Show the alpha row and carry an alpha channel through `format`. */
  alpha?: boolean;
  /**
   * Offer the RGB/OKLCH tabs. The OKLCH one adds lightness and chroma rows for
   * precise control and writes the value as `oklch(...)`; the choice only affects
   * what is shown and typed, never what `format` emits. Turn it off for a compact
   * picker: plane, hue and the field.
   * @defaultValue true */
  oklch?: boolean;
  /** Preset colours offered under the picker, in any supported notation. */
  swatches?: string[];
  /** Hide the text field that accepts and displays the value. */
  hideInput?: boolean;
  className?: string;
  /** Accessible name for the lightness/chroma plane. */
  "aria-label"?: string;
}

// Swatches are deliberately absent: presets are opt-in, and the default picker
// is the plane, the rows and the field.
export const colorPickerDemo: ColorPickerProps = {
  color: "#6366f1",
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ColorPicker({
  color: colorProp,
  onChange,
  onChangeComplete,
  format = "hex",
  alpha = false,
  oklch = true,
  swatches,
  hideInput = false,
  className,
  "aria-label": ariaLabel,
}: ColorPickerProps) {
  const [color, setColor] = React.useState<OklchColor>(
    () => parseColor(colorProp) ?? FALLBACK_COLOR,
  );
  const [draft, setDraft] = React.useState<string | null>(null);
  /** Which notation the field shows and the numeric rows follow. */
  const [notation, setNotation] = React.useState<"rgb" | "oklch">(
    format === "oklch" ? "oklch" : "rgb",
  );

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const planeRef = React.useRef<HTMLDivElement>(null);
  const colorRef = React.useRef(color);
  const draggingRef = React.useRef(false);
  const frameRef = React.useRef(0);
  const pendingRef = React.useRef({ x: 0, y: 0 });

  colorRef.current = color;

  const latest = React.useRef({ onChange, onChangeComplete, format, alpha });
  useIsomorphicLayoutEffect(() => {
    latest.current = { onChange, onChangeComplete, format, alpha };
  });

  const emit = React.useCallback((next: OklchColor, complete = false) => {
    colorRef.current = next;
    setColor(next);
    const { onChange: change, onChangeComplete: done, format: fmt, alpha: withAlpha } =
      latest.current;
    const value = formatColor(next, fmt, withAlpha);
    change?.(value);
    if (complete) done?.(value);
  }, []);

  /* ------------------------------------------------- incoming prop changes -- */

  useIsomorphicLayoutEffect(() => {
    if (colorProp === undefined || draggingRef.current) return;
    const parsed = parseColor(colorProp);
    if (!parsed) return;
    // Compare in the emitted notation: a hex prop cannot round-trip every OKLCH
    // value, so comparing components would fight the consumer every render.
    const { format: fmt, alpha: withAlpha } = latest.current;
    if (formatColor(parsed, fmt, withAlpha) === formatColor(colorRef.current, fmt, withAlpha)) {
      return;
    }
    colorRef.current = parsed;
    setColor(parsed);
  }, [colorProp]);

  /* ------------------------------------------------------- plane rendering -- */

  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const image = context.createImageData(PLANE_WIDTH, PLANE_HEIGHT);
    const pixels = image.data;

    for (let y = 0; y < PLANE_HEIGHT; y++) {
      const lightness = 1 - y / (PLANE_HEIGHT - 1);
      // One gamut probe per row, then the row is a straight ramp from grey to
      // that row's most saturated colour, so every pixel is in gamut.
      const rowMax = maxChromaAt(lightness, color.h);

      for (let x = 0; x < PLANE_WIDTH; x++) {
        const chroma = (x / (PLANE_WIDTH - 1)) * rowMax;
        const rgb = oklchToRgb({ l: lightness, c: chroma, h: color.h, a: 1 });
        const offset = (y * PLANE_WIDTH + x) * 4;
        pixels[offset] = rgb.r;
        pixels[offset + 1] = rgb.g;
        pixels[offset + 2] = rgb.b;
        pixels[offset + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);
  }, [color.h]);

  /* ------------------------------------------------------------ plane drag -- */

  const applyFromPlane = React.useCallback(() => {
    frameRef.current = 0;
    const plane = planeRef.current;
    if (!plane) return;

    const rect = plane.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const { x, y } = pendingRef.current;
    const nextL = clamp(1 - (y - rect.top) / rect.height, 0, 1);
    const relative = (x - rect.left) / rect.width;
    emit({
      ...colorRef.current,
      l: nextL,
      c: chromaFromPlane(relative, nextL, colorRef.current.h),
    });
  }, [emit]);

  const handlePlanePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    planeRef.current?.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    planeRef.current?.focus({ preventScroll: true });
    pendingRef.current = { x: event.clientX, y: event.clientY };
    applyFromPlane();
  };

  const handlePlanePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    pendingRef.current = { x: event.clientX, y: event.clientY };
    // One update per frame, however many pointer events arrive.
    if (!frameRef.current) frameRef.current = requestAnimationFrame(applyFromPlane);
  };

  const handlePlanePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    emit(colorRef.current, true);
  };

  const handlePlaneKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? PLANE_KEY_STEP_COARSE : PLANE_KEY_STEP;
    const current = colorRef.current;
    const relative = planePositionOf(current.c, current.l, current.h);
    let next: OklchColor | null = null;

    switch (event.key) {
      case "ArrowUp": {
        // Keep the same distance across the row while lightness moves, so the
        // colour stays as saturated as it was.
        const l = clamp(current.l + step, 0, 1);
        next = { ...current, l, c: chromaFromPlane(relative, l, current.h) };
        break;
      }
      case "ArrowDown": {
        const l = clamp(current.l - step, 0, 1);
        next = { ...current, l, c: chromaFromPlane(relative, l, current.h) };
        break;
      }
      case "ArrowRight":
        next = { ...current, c: chromaFromPlane(relative + step, current.l, current.h) };
        break;
      case "ArrowLeft":
        next = { ...current, c: chromaFromPlane(relative - step, current.l, current.h) };
        break;
      default:
        return;
    }

    event.preventDefault();
    emit(next, true);
  };

  React.useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /* ----------------------------------------------------------- text field -- */

  /**
   * The tabs choose how the value is written and typed, never what the callbacks
   * emit — that stays the consumer's `format`, so switching tabs cannot start
   * handing a component that asked for hex an `oklch()` string instead.
   */
  const fieldFormat: ColorFormat =
    notation === "oklch" ? "oklch" : format === "oklch" ? "hex" : format;
  const displayValue = formatColor(color, fieldFormat, alpha);
  const draftIsValid = draft === null || parseColor(draft) !== null;

  const handleDraftChange = (raw: string) => {
    setDraft(raw);
    const parsed = parseColor(raw);
    if (parsed) emit(parsed);
  };

  const commitDraft = () => {
    const parsed = draft === null ? null : parseColor(draft);
    setDraft(null);
    if (parsed) emit(parsed, true);
  };

  /* ----------------------------------------------------------- eyedropper -- */

  const [hasEyeDropper, setHasEyeDropper] = React.useState(false);
  useIsomorphicLayoutEffect(() => {
    setHasEyeDropper(typeof window !== "undefined" && "EyeDropper" in window);
  }, []);

  const pickFromScreen = async () => {
    const Picker = (
      window as unknown as {
        EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
      }
    ).EyeDropper;
    if (!Picker) return;
    try {
      const result = await new Picker().open();
      const parsed = parseColor(result.sRGBHex);
      if (parsed) emit({ ...parsed, a: colorRef.current.a }, true);
    } catch {
      // The reader dismissed the eyedropper; nothing to do.
    }
  };

  /* --------------------------------------------------------------- render -- */

  const cssColor = toCssColor(color);
  const puckX = planePositionOf(color.c, color.l, color.h);
  const puckY = 1 - color.l;
  const outOfGamut = !oklchToRgb(color).inGamut;

  // Hue and alpha belong to both tabs, and the field only changes notation, so
  // they are built once here and placed in each tab. Only one tab is mounted at
  // a time, so no element is ever rendered twice.
  const hueRow = (
    <Rail gradient={HUE_RAIL}>
      <InspectorSlider
        label="Hue"
        className={RAIL_SURFACE}
        labelClassName={RAIL_LABEL}
        valueClassName={RAIL_VALUE}
        size="sm"
        min={0}
        max={360}
        step={1}
        ticks={false}
        value={color.h}
        onValueChange={(value) => emit({ ...colorRef.current, h: value })}
        onValueCommit={() => emit(colorRef.current, true)}
        formatValue={(value) => `${Math.round(value)}°`}
      />
    </Rail>
  );

  const alphaRow = alpha ? (
    <Rail
      checker
      gradient={`linear-gradient(to right, transparent, ${toCssColor({ ...color, a: 1 })})`}
    >
      <InspectorSlider
        label="Alpha"
        className={RAIL_SURFACE}
        labelClassName={RAIL_LABEL}
        valueClassName={RAIL_VALUE}
        size="sm"
        min={0}
        max={1}
        step={0.01}
        ticks={false}
        value={color.a}
        onValueChange={(value) => emit({ ...colorRef.current, a: value })}
        onValueCommit={() => emit(colorRef.current, true)}
        formatValue={(value) => `${Math.round(value * 100)}%`}
      />
    </Rail>
  ) : null;

  const field = hideInput ? null : (
    <div data-slot="color-picker-field" className="flex items-center gap-1.5 pt-1">
      {/*
        The plane can no longer land out of gamut, so this only marks a value the
        numeric rows or a typed value pushed past sRGB. It stays a quiet hint
        rather than an error state.
      */}
      <span
        aria-hidden="true"
        data-out-of-gamut={outOfGamut}
        title={outOfGamut ? "Outside the sRGB gamut — shown clamped" : undefined}
        className="size-8 shrink-0 rounded-md border border-border data-[out-of-gamut=true]:ring-1 data-[out-of-gamut=true]:ring-muted-foreground/50"
        style={{ backgroundColor: cssColor }}
      />
      <Input
        value={draft ?? displayValue}
        spellCheck={false}
        autoComplete="off"
        aria-label="Colour value"
        aria-invalid={!draftIsValid}
        onChange={(event) => handleDraftChange(event.target.value)}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitDraft();
          } else if (event.key === "Escape") {
            event.preventDefault();
            setDraft(null);
          }
        }}
        className="h-8 min-w-0 flex-1 px-2 font-mono text-sm"
      />
      {hasEyeDropper ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Pick a colour from the screen"
          onClick={pickFromScreen}
          className="size-8 shrink-0 cursor-pointer"
        >
          <PipetteIcon className="size-4" />
        </Button>
      ) : null}
    </div>
  );

  return (
    // The click guard keeps the picker usable inside a card, a menu item or any
    // other ancestor that acts on clicks of its own.
    // biome-ignore lint/a11y/noStaticElementInteractions: containment guard, not a control
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: containment guard, not a control
    <div
      data-slot="color-picker"
      onClick={(event) => event.stopPropagation()}
      className={cn(
        // `max-w-full` lets the panel sit inside a narrower popover than its own
        // intrinsic width without overflowing it.
        "flex w-64 max-w-full flex-col gap-2 p-3 [--inspector-radius:var(--radius-xl)]",
        className,
      )}
    >
      {/*
        The plane is a convenience: the lightness, chroma and hue rows below are
        real range inputs and remain the accessible path, which is why this
        surface carries no widget role of its own.
      */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer surface for the sliders below */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pointer surface for the sliders below */}
      <div
        ref={planeRef}
        data-slot="color-picker-plane"
        tabIndex={0}
        aria-label={ariaLabel ?? "Lightness and chroma"}
        className={cn(
          "relative h-36 w-full cursor-crosshair touch-none overflow-hidden rounded-(--inspector-radius)",
          "bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
        onPointerDown={handlePlanePointerDown}
        onPointerMove={handlePlanePointerMove}
        onPointerUp={handlePlanePointerUp}
        onPointerCancel={handlePlanePointerUp}
        onKeyDown={handlePlaneKeyDown}
      >
        <canvas
          ref={canvasRef}
          width={PLANE_WIDTH}
          height={PLANE_HEIGHT}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ transform: `translate(${puckX * 100}%, ${puckY * 100}%)` }}
        >
          <div
            data-slot="color-picker-puck"
            className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/20"
            style={{ backgroundColor: cssColor }}
          />
        </div>
      </div>

      {oklch ? (
        <Tabs
          value={notation}
          onValueChange={(value) => setNotation(value === "oklch" ? "oklch" : "rgb")}
        >
          <TabsList className="w-full">
            <TabsTrigger value="rgb" className="flex-1 cursor-pointer">
              RGB
            </TabsTrigger>
            <TabsTrigger value="oklch" className="flex-1 cursor-pointer">
              OKLCH
            </TabsTrigger>
          </TabsList>

          {/*
            Hue drives the plane, so it belongs to both tabs; lightness and chroma
            repeat the plane's own axes and are only worth the space when someone
            has asked for numbers, which is what choosing OKLCH says.
          */}
          <TabsContent value="rgb" className="flex flex-col gap-1">
            {hueRow}
            {alphaRow}
            {field}
          </TabsContent>

          <TabsContent value="oklch" className="flex flex-col gap-1">
            <Rail
              gradient={`linear-gradient(to right, oklch(0 ${color.c} ${color.h}), oklch(1 ${color.c} ${color.h}))`}
            >
              <InspectorSlider
                label="Lightness"
                className={RAIL_SURFACE}
                labelClassName={RAIL_LABEL}
                valueClassName={RAIL_VALUE}
                size="sm"
                min={0}
                max={1}
                step={0.005}
                ticks={false}
                value={color.l}
                onValueChange={(value) => emit({ ...colorRef.current, l: value })}
                onValueCommit={() => emit(colorRef.current, true)}
                formatValue={(value) => value.toFixed(3)}
              />
            </Rail>
            <Rail
              gradient={`linear-gradient(to right, oklch(${color.l} 0 ${color.h}), oklch(${color.l} ${CHROMA_MAX} ${color.h}))`}
            >
              <InspectorSlider
                label="Chroma"
                className={RAIL_SURFACE}
                labelClassName={RAIL_LABEL}
                valueClassName={RAIL_VALUE}
                size="sm"
                min={0}
                max={CHROMA_MAX}
                step={0.005}
                ticks={false}
                value={color.c}
                onValueChange={(value) => emit({ ...colorRef.current, c: value })}
                onValueCommit={() => emit(colorRef.current, true)}
                formatValue={(value) => value.toFixed(3)}
              />
            </Rail>
            {hueRow}
            {alphaRow}
            {field}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col gap-1">
          {hueRow}
          {alphaRow}
          {field}
        </div>
      )}

      {swatches?.length ? (
        // Eight to a row, each cell taking an equal share of the width, so any
        // number of presets stays on a tidy grid instead of wrapping ragged.
        <div data-slot="color-picker-swatches" className="grid grid-cols-8 gap-1.5 pt-1">
          {swatches.map((swatch) => {
            const parsed = parseColor(swatch);
            const isActive = parsed
              ? formatColor(parsed, "hex", false) === formatColor(color, "hex", false)
              : false;

            return (
              <button
                key={swatch}
                type="button"
                aria-label={swatch}
                aria-pressed={isActive}
                onClick={() => {
                  if (parsed) emit(parsed, true);
                }}
                className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-full border border-border transition-transform hover:scale-110"
                style={{ backgroundColor: parsed ? toCssColor(parsed) : swatch }}
              >
                {isActive ? <CheckIcon className="size-3.5 text-white mix-blend-difference" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
