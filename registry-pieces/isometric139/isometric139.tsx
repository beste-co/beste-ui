"use client";

import { useId } from "react";
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

interface Isometric139Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the candle flames with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric139Demo: Isometric139Props = {
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

const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);

/** A ring band around (cx, cy), drawn on the visible half. */
function band(cx: number, cy: number, r: number, z: number, h: number) {
  const points = Array.from({ length: 17 }, (_, k) => {
    const angle = ((-45 + (180 * k) / 16) * Math.PI) / 180;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  });
  return polygon([...points.map(([x, y]): Point => [x, y, z]), ...[...points].reverse().map(([x, y]): Point => [x, y, z + h])]);
}

const M = 40;
const STAND = 6;
const LOWER = { z: STAND, h: 18, r: 28 };
const UPPER = { z: STAND + 18, h: 14, r: 19 };
const TOP = UPPER.z + UPPER.h;
const CANDLE_H = 18;
// One candle in the middle of the cake
const CANDLES = [[M, M]] as const;
// A teardrop flame in three layers: the outer body, a brighter middle and a small hot core near the wick
const FLAME = "M0 0C-4.6 0 -6.2 -4.4 -4.6 -8.6C-3.2 -12.4 -0.6 -15 0 -20C1.4 -16 4.2 -12.6 5 -8.4C5.8 -4.2 4.2 0 0 0Z";
const MIDDLE = "M0 -0.6C-2.8 -0.6 -3.8 -3.6 -2.8 -6.4C-2 -8.8 -0.4 -10.6 0 -13.6C1 -11 2.6 -8.8 3.1 -6.2C3.6 -3.4 2.6 -0.6 0 -0.6Z";
const CORE = "M0 -1C-1.5 -1 -2 -2.8 -1.4 -4.3C-0.9 -5.5 -0.2 -6.3 0 -7.8C0.6 -6.5 1.4 -5.4 1.6 -4.1C1.8 -2.6 1.3 -1 0 -1Z";
const SPRINKLES = [
  [M - 12, M - 2],
  [M - 3, M + 13],
  [M + 10, M + 4],
  [M - 6, M - 12],
  [M + 6, M + 12],
] as const;

const STYLES = `
@keyframes isometric139-flicker { 0%, 100% { transform: skewX(0deg) scale(1, 1); } 18% { transform: skewX(-4deg) scale(0.92, 1.08); } 37% { transform: skewX(3deg) scale(1.05, 0.95); } 58% { transform: skewX(-2deg) scale(0.96, 1.05); } 79% { transform: skewX(4deg) scale(1.03, 0.97); } }
@keyframes isometric139-core { 0%, 100% { transform: scale(1, 1); } 30% { transform: scale(0.9, 1.14); } 65% { transform: scale(1.08, 0.9); } }
@keyframes isometric139-halo { 0%, 100% { opacity: 0.75; transform: scale(1); } 35% { opacity: 1; transform: scale(1.08); } 70% { opacity: 0.6; transform: scale(0.94); } }
.isometric139-flame { animation: isometric139-flicker 1.9s ease-in-out infinite; transform-origin: 0 0; }
.isometric139-core { animation: isometric139-core 1.1s ease-in-out infinite; transform-origin: 0 0; }
.isometric139-halo { animation: isometric139-halo 2.3s ease-in-out infinite; transform-origin: 0 -8px; }
.isometric139-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric139-flame, .isometric139-core, .isometric139-halo { animation: none; } }
`;

export function Isometric139({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric139Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const candle = paint.body;
  const flame = palette === "tone" ? "fill-white" : accent ? "fill-current" : palette === "dark" ? "fill-white/40" : "fill-foreground/20";
  const core = palette === "tone" || !accent ? body.ink : "fill-white/50";
  const hot = palette === "tone" || !accent ? body.base : "fill-white";
  const wick = palette === "dark" ? "fill-black/60" : "fill-black/40";
  const haloId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric139-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-52 -48 104 117" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <radialGradient id={haloId}>
            <stop offset="0" stopColor="currentColor" stopOpacity={accent ? 0.35 : 0.08} />
            <stop offset="1" stopColor="currentColor" stopOpacity={0} />
          </radialGradient>
        </defs>
        <RoundBlock shape={cylinder(M, M, 0, STAND, 36)} paint={body} />
        <RoundBlock shape={cylinder(M, M, LOWER.z, LOWER.h, LOWER.r)} paint={body} />
        <polygon points={band(M, M, LOWER.r + 0.1, LOWER.z + 7, 2)} className={body.ink} />
        <g transform={onTop(UPPER.z)} className={body.ink}>
          <circle cx={M} cy={M} r={LOWER.r - 3} fill="none" strokeWidth={1.5} vectorEffect="non-scaling-stroke" className={body.ink.replace("fill-", "stroke-")} />
        </g>
        <RoundBlock shape={cylinder(M, M, UPPER.z, UPPER.h, UPPER.r)} paint={body} />
        <polygon points={band(M, M, UPPER.r + 0.1, UPPER.z + 5, 2)} className={body.ink} />
        <g transform={onTop(TOP)} className={body.ink}>
          {SPRINKLES.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 1.5} y={y - 0.75} width={3} height={1.5} rx={0.75} />
          ))}
        </g>
        {CANDLES.map(([x, y]) => {
          const [fx, fy] = project([x, y, TOP + CANDLE_H + 3]).split(",").map(Number) as [number, number];
          return (
            <g key={`${x}-${y}`}>
              <RoundBlock shape={cylinder(x, y, TOP, CANDLE_H, 3)} paint={candle} />
              {[5, 10].map((dz) => (
                <polygon key={dz} points={band(x, y, 3.1, TOP + dz, 1.5)} className={candle.ink} />
              ))}
              <g transform={`translate(${fx} ${fy})`}>
                {/* A soft halo of light around the flame, then the wick and the flame itself */}
                <circle cy={-8} r={17} fill={`url(#${haloId})`} className="isometric139-halo" />
                <rect x={-0.6} y={-1} width={1.2} height={4} rx={0.6} className={wick} />
                <g className="isometric139-flame">
                  <path d={FLAME} className={flame} />
                  <path d={MIDDLE} className={core} />
                  <path d={CORE} className={cn("isometric139-core", hot)} />
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
