"use client";

import { type CSSProperties, useId } from "react";
import { cn } from "@/lib/utils";

// --- isometric kit (shared by every Isometric piece, keep in sync) ---
type Tone = "primary" | "foreground" | "color" | "none";
type Palette = "theme" | "light" | "dark" | "tone";

// "color" takes the `color` prop instead of a class, so any hex works
const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  color: "",
  none: "text-foreground",
};
const DEFAULT_COLOR = "#2F6FED";
/** Whether a hex color is light enough that dark lines read better on it. */
function isLight(hex: string) {
  const digits = hex.replace("#", "");
  const full = digits.length === 3 ? digits.replace(/./g, "$&$&") : digits;
  const value = Number.parseInt(full, 16);
  if (full.length !== 6 || Number.isNaN(value)) return false;
  return 0.2126 * (value >> 16) + 0.7152 * ((value >> 8) & 255) + 0.0722 * (value & 255) > 165;
}

// Isometric projection: x runs down-right, y down-left, z straight up
const C = 0.866;
const S = 0.5;
type Point = [number, number, number];
const project = ([x, y, z]: Point) => `${((x - y) * C).toFixed(1)},${((x + y) * S - z).toFixed(1)}`;
const polygon = (points: Point[]) => points.map(project).join(" ");

/** The three faces a box shows from this angle. */
function box(x: number, y: number, z: number, w: number, d: number, h: number) {
  return {
    top: polygon([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
    left: polygon([[x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z]]),
    right: polygon([[x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x + w, y, z]]),
  };
}
type Faces = ReturnType<typeof box>;

/** Draw flat onto a top face at height z, in plan (x, y) units. */
const onTop = (z: number) => `matrix(${C} ${S} ${-C} ${S} 0 ${-z})`;
/** Draw flat onto the left face lying in the plane y = y0, in (x, -z) units. */
const onLeft = (y0: number) => `matrix(${C} ${S} 0 1 ${(-y0 * C).toFixed(1)} ${(y0 * S).toFixed(1)})`;
/** Draw flat onto the right face lying in the plane x = x0, in (y, -z) units. */
const onRight = (x0: number) => `matrix(${-C} ${S} 0 1 ${(x0 * C).toFixed(1)} ${(x0 * S).toFixed(1)})`;

/** How a solid is painted: a base fill, darker overlays on the two sides, an edge, and ink for details. */
interface Paint {
  base: string;
  left: string;
  right: string;
  edge: string;
  ink: string;
}

const BODY: Record<Palette, Paint> = {
  theme: { base: "fill-card", left: "fill-foreground/5", right: "fill-foreground/10", edge: "stroke-border dark:stroke-foreground/25", ink: "fill-foreground/15" },
  light: { base: "fill-white", left: "fill-zinc-950/5", right: "fill-zinc-950/10", edge: "stroke-zinc-200", ink: "fill-zinc-950/15" },
  dark: { base: "fill-zinc-800", left: "fill-black/20", right: "fill-black/40", edge: "stroke-zinc-500", ink: "fill-white/15" },
  tone: { base: "fill-current", left: "fill-black/15", right: "fill-black/30", edge: "stroke-zinc-400/70", ink: "fill-white/30" },
};
const ACCENT: Paint = { base: "fill-current", left: "fill-black/15", right: "fill-black/30", edge: "stroke-transparent", ink: "fill-white/40" };
// On a body that is already the tone, the accent turns white so it still stands out
const ACCENT_ON_TONE: Paint = { base: "fill-white", left: "fill-black/10", right: "fill-black/20", edge: "stroke-transparent", ink: "fill-current" };

// On a body in the tone, the edge takes whatever stands out against that tone
const TONE_EDGE: Record<Tone, string> = {
  primary: "stroke-primary-foreground/50",
  foreground: "stroke-background/50",
  color: "stroke-white/60",
  none: "stroke-border",
};

/** Body and accent paints; with accent off the piece is one color throughout. */
function paints(palette: Palette, accent: boolean, tone: Tone = "primary", color: string = DEFAULT_COLOR) {
  // A light custom color gets dark lines and ink, a deep one gets light ones
  const onTone = tone === "color" && isLight(color) ? { edge: "stroke-black/35", ink: "fill-black/20" } : { edge: TONE_EDGE[tone] };
  const body = palette === "tone" ? { ...BODY.tone, ...onTone } : BODY[palette];
  return { body, accent: !accent ? body : palette === "tone" ? ACCENT_ON_TONE : ACCENT };
}

function Block({ faces, paint }: { faces: Faces; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={faces.left} className={paint.base} />
      <polygon points={faces.left} className={paint.left} stroke="none" />
      <polygon points={faces.right} className={paint.base} />
      <polygon points={faces.right} className={paint.right} stroke="none" />
      <polygon points={faces.top} className={paint.base} />
    </g>
  );
}
// --- end isometric kit ---

interface Isometric23Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the donut chart with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric23Demo: Isometric23Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const BOARD = box(0, 0, 0, 160, 120, 8);
const TILE_Z = 14;
const SPARK = box(12, 12, 8, 136, 44, 6);
const DONUT = box(12, 66, 8, 56, 42, 6);
const BARS = box(78, 66, 8, 70, 42, 6);

// Stronger ink for the donut value when the accent is off
const STRONG: Record<Palette, string> = {
  theme: "fill-foreground/30",
  light: "fill-zinc-950/30",
  dark: "fill-white/30",
  tone: "fill-white/50",
};

// A standing area chart, drawn in the plane of the left face (x, -z)
const CHART_Y = 36;
const CHART_DEPTH = 4;
const chart = (values: number[]) =>
  [`24,${-TILE_Z}`, ...values.map((v, i) => `${24 + i * 15},${-TILE_Z - v}`), `${24 + (values.length - 1) * 15},${-TILE_Z}`].join(" ");
const SPARK_A = chart([8, 16, 12, 24, 19, 30, 26, 36]);
const SPARK_B = chart([10, 14, 20, 17, 27, 23, 33, 30]);

function sector(cx: number, cy: number, outer: number, inner: number, from: number, to: number) {
  const point = (r: number, deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  };
  const large = to - from > 180 ? 1 : 0;
  return `M${point(outer, from)} A${outer} ${outer} 0 ${large} 1 ${point(outer, to)} L${point(inner, to)} A${inner} ${inner} 0 ${large} 0 ${point(inner, from)} Z`;
}
const DONUT_CENTER = [40, 87] as const;
const TRACK = `${sector(40, 87, 15, 9, 0, 180)} ${sector(40, 87, 15, 9, 180, 359.99)}`;

const BAR = 8;
const BAR_Y = 83;
const BAR_HEIGHTS = [14, 24, 18, 32, 22];
const barX = (index: number) => 86 + index * 12;
const barClip = (x: number) =>
  polygon([
    [x, BAR_Y + BAR, TILE_Z],
    [x + BAR, BAR_Y + BAR, TILE_Z],
    [x + BAR, BAR_Y, TILE_Z],
    [x + BAR, BAR_Y, TILE_Z + 80],
    [x, BAR_Y + BAR, TILE_Z + 80],
  ]);

const STYLES = `
@keyframes isometric23-bar { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(var(--isometric23-sink)); } }
@keyframes isometric23-swap { 0%, 38%, 100% { opacity: 1; } 50%, 88% { opacity: 0; } }
@keyframes isometric23-swap-in { 0%, 38%, 100% { opacity: 0; } 50%, 88% { opacity: 1; } }
@keyframes isometric23-grow { 0%, 30%, 100% { opacity: 0; } 45%, 80% { opacity: 1; } }
.isometric23-bar { animation: isometric23-bar 3.6s ease-in-out infinite; will-change: transform; }
.isometric23-a { animation: isometric23-swap 4.8s ease-in-out infinite; }
.isometric23-b { animation: isometric23-swap-in 4.8s ease-in-out infinite; }
.isometric23-grow { animation: isometric23-grow 4.8s ease-in-out infinite; }
.isometric23-still * { animation: none !important; }
.isometric23-still .isometric23-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric23-bar, .isometric23-a, .isometric23-b, .isometric23-grow { animation: none; } .isometric23-rest { opacity: 1; } }
`;

export function Isometric23({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric23Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const ink = paint.body.ink;
  const standing = (points: string) => (
    <>
      {Array.from({ length: CHART_DEPTH }, (_, step) => (
        <g key={step} transform={onLeft(CHART_Y - CHART_DEPTH + step)}>
          <polygon points={points} className={paint.body.base} />
          <polygon points={points} className={paint.body.right} />
        </g>
      ))}
      <g transform={onLeft(CHART_Y)}>
        <polygon points={points} strokeWidth={1} strokeLinejoin="round" className={cn(paint.body.base, paint.body.edge)} />
        <polygon points={points} className={paint.body.left} />
      </g>
    </>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric23-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-112 -26 256 176" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          {BAR_HEIGHTS.map((_, index) => (
            <clipPath key={index} id={`${clipId}-${index}`}>
              <polygon points={barClip(barX(index))} />
            </clipPath>
          ))}
        </defs>
        <Block faces={BOARD} paint={paint.body} />
        <Block faces={SPARK} paint={paint.body} />
        <g className="isometric23-a">{standing(SPARK_A)}</g>
        <g className="isometric23-b opacity-0">{standing(SPARK_B)}</g>
        <Block faces={DONUT} paint={paint.body} />
        <g transform={onTop(TILE_Z)}>
          <path d={TRACK} className={ink} />
          <path d={sector(DONUT_CENTER[0], DONUT_CENTER[1], 15, 9, 0, 210)} className={accent ? paint.accent.base : STRONG[palette]} />
          <path d={sector(DONUT_CENTER[0], DONUT_CENTER[1], 15, 9, 210, 280)} className={cn("isometric23-grow isometric23-rest opacity-0", accent ? paint.accent.base : STRONG[palette])} />
        </g>
        <Block faces={BARS} paint={paint.body} />
        {BAR_HEIGHTS.map((height, index) => (
          <g key={index} clipPath={`url(#${clipId}-${index})`}>
            <g
              className="isometric23-bar"
              style={{ animationDelay: `${index * 0.3}s`, "--isometric23-sink": `${Math.round(height * 0.45)}px` } as CSSProperties}
            >
              <Block faces={box(barX(index), BAR_Y, TILE_Z - 20, BAR, BAR, height + 20)} paint={paint.body} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
