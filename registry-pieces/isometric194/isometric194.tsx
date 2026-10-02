"use client";

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

interface Isometric194Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the chart line, the price pill, the last bar and the top coin with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric194Demo: Isometric194Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Round = ReturnType<typeof roundBox>;

/** A box with rounded corners in plan; with w = d = 2r it is a cylinder. */
function roundBox(x: number, y: number, z: number, w: number, d: number, h: number, r: number) {
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -90],
    [x + w - r, y + d - r, 0],
    [x + r, y + d - r, 90],
  ];
  // Rim points whose outward normal lies between two angles (degrees, 0 = +x, 90 = +y)
  const rim = (from: number, to: number) => {
    const points: [number, number][] = [];
    for (const [cx, cy, start] of corners) {
      const lo = Math.max(start, from);
      const hi = Math.min(start + 90, to);
      if (lo > hi) continue;
      for (let k = 0; k <= 8; k++) {
        const angle = ((lo + ((hi - lo) * k) / 8) * Math.PI) / 180;
        points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
    }
    return points;
  };
  const band = (points: [number, number][]) =>
    polygon([...points.map(([px, py]): Point => [px, py, z]), ...points.reverse().map(([px, py]): Point => [px, py, z + h])]);
  return { side: band(rim(-45, 135)), left: band(rim(45, 135)), right: band(rim(-45, 45)), top: { x, y, w, d, r, z: z + h } };
}

function RoundBlock({ shape, paint }: { shape: Round; paint: Paint }) {
  const { top } = shape;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.left} className={paint.left} stroke="none" />
      <polygon points={shape.right} className={paint.right} stroke="none" />
      <rect x={top.x} y={top.y} width={top.w} height={top.d} rx={top.r} transform={onTop(top.z)} vectorEffect="non-scaling-stroke" className={paint.base} />
    </g>
  );
}

const BASE = 6;
const W = 64;
const TALL = 118;
const THICK = 6;
const TOP = BASE + THICK;
// The phone lies flat on the desk, its top away from the viewer
const AT = { x: 12, y: 7 };
const LINE = "M8 64L15 58L22 61L30 50L37 54L45 43L51 46L56.5 37";
const END = { x: 56.5, y: 37 };
// Volume bars stand on the glass as small solid columns
const BARS = [5, 8, 6, 11, 8, 15];
const BAR = { x: 8, y: 93, w: 5.4, pitch: 8.5 };
const COINS = { x: 90, y: 100, r: 7, h: 3 };
const PERIOD = 9;

const TRACE: Record<Palette, string> = {
  theme: "stroke-foreground/50",
  light: "stroke-zinc-950/50",
  dark: "stroke-white/60",
  tone: "stroke-white/80",
};

const STYLES = `
@keyframes isometric194-draw { 0%, 8% { stroke-dashoffset: 100; } 46%, 97% { stroke-dashoffset: 0; } 98%, 100% { stroke-dashoffset: 100; } }
@keyframes isometric194-chart { 0%, 90% { opacity: 1; } 96%, 99.9% { opacity: 0; } 100% { opacity: 1; } }
@keyframes isometric194-price { 0%, 46% { opacity: 0; } 53%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }
.isometric194-draw { stroke-dasharray: 100; animation: isometric194-draw ${PERIOD}s ease-in-out infinite; }
.isometric194-chart { animation: isometric194-chart ${PERIOD}s linear infinite; }
.isometric194-price { animation: isometric194-price ${PERIOD}s ease-in-out infinite; }
.isometric194-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric194-scene * { animation: none !important; } }
`;

export function Isometric194({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric194Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const trace = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : TRACE[palette];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric194-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-123 -16 228 150" aria-hidden="true" className="isometric194-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 112, 132, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(AT.x, AT.y, BASE, W, TALL, THICK, 9)} paint={body} />
        <g transform={onRight(AT.x + W)} className={body.ink}>
          <rect x={AT.y + 30} y={-BASE - 4} width={16} height={1.8} rx={0.9} />
        </g>
        <g transform={`${onTop(TOP)} translate(${AT.x} ${AT.y})`}>
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* Header: the ticker and its price */}
          <rect x={7} y={16} width={16} height={3} rx={1.5} className={cn(body.base, "opacity-60")} />
          <rect x={7} y={22} width={26} height={4.6} rx={2.3} className={body.base} />
          {/* The chart card with its guides; the line draws itself from left to right */}
          <rect x={5.5} y={31} width={W - 11} height={40} rx={5} className={cn(body.base, "opacity-40")} />
          {[40, 50, 60].map((y) => (
            <rect key={`guide-${y}`} x={8} y={y} width={W - 16} height={0.6} className={body.ink} />
          ))}
          <g className="isometric194-chart">
            <path d={LINE} pathLength={100} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cn("isometric194-draw", trace)} />
          </g>
          {/* The price pill and the marker fade in where the line ends */}
          <g className="isometric194-price">
            <circle cx={END.x} cy={END.y} r={2.6} strokeWidth={1} className={cn(accent ? mine.base : body.base, body.edge)} />
            <rect x={31} y={33.5} width={19} height={7} rx={3.5} className={accent ? mine.base : body.base} />
            <rect x={35} y={35.9} width={11} height={2.2} rx={1.1} className={accent ? mine.ink : body.ink} />
          </g>
          {[0, 1, 2, 3].map((chip) => (
            <rect key={`range-${chip}`} x={7 + chip * 13} y={76} width={10.5} height={6} rx={3} className={cn(body.base, chip !== 2 && "opacity-50")} />
          ))}
          <rect x={5.5} y={87} width={W - 11} height={18} rx={5} className={cn(body.base, "opacity-40")} />
          <rect x={W / 2 - 9} y={109.5} width={18} height={2} rx={1} className={cn(body.base, "opacity-60")} />
        </g>
        {BARS.map((height, index) => (
          <Block key={`bar-${index}`} faces={box(AT.x + BAR.x + index * BAR.pitch, AT.y + BAR.y, TOP, BAR.w, BAR.w, height)} paint={index === BARS.length - 1 ? mine : body} />
        ))}
        {/* A short stack of coins beside the phone */}
        {[0, 1, 2].map((coin) => (
          <RoundBlock key={`coin-${coin}`} shape={roundBox(COINS.x - COINS.r + (coin === 2 ? 1.5 : 0), COINS.y - COINS.r - (coin === 1 ? 1 : 0), BASE + coin * COINS.h, 2 * COINS.r, 2 * COINS.r, COINS.h, COINS.r)} paint={coin === 2 ? mine : body} />
        ))}
      </svg>
    </div>
  );
}
