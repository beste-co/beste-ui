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

interface Isometric118Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the recycling mark with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric118Demo: Isometric118Props = {
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

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;

/** An upright cylinder centered on the origin in plan, shaded in two halves like a box. */
function Cylinder({ r, z, h, paint }: { r: number; z: number; h: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const top = -z - h;
  const bottom = -z;
  const left = `M${-rx} ${top} L${-rx} ${bottom} A${rx} ${ry} 0 0 0 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 1 ${-rx} ${top} Z`;
  const right = `M${rx} ${top} L${rx} ${bottom} A${rx} ${ry} 0 0 1 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 0 ${rx} ${top} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      <ellipse cx={0} cy={top} rx={rx} ry={ry} className={paint.base} />
    </g>
  );
}
const BASE = 8;
const BOTTOM = BASE;
const TOP = 60;
const LID_TOP = TOP + 5;

/** A bin that widens toward the top, centered on (cx, cy) in plan. */
function taper(cx: number, cy: number, bottom: number, top: number, z0: number, z1: number) {
  const ring = (h: number, z: number): Point[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]];
  const [b, t] = [ring(bottom, z0), ring(top, z1)] as [Point[], Point[]];
  return {
    left: polygon([t[3] as Point, t[2] as Point, b[2] as Point, b[3] as Point]),
    right: polygon([t[1] as Point, t[2] as Point, b[2] as Point, b[1] as Point]),
  };
}

function Bin({ shape, paint }: { shape: ReturnType<typeof taper>; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.left} className={paint.base} />
      <polygon points={shape.left} stroke="none" className={paint.left} />
      <polygon points={shape.right} className={paint.base} />
      <polygon points={shape.right} stroke="none" className={paint.right} />
    </g>
  );
}

const MAIN = { x: 30, y: 32, bottom: 18, top: 22 };
const SIDE = { x: 74, y: 38, bottom: 12, top: 15, height: 40 };
const HOLE = 12;
const HX = (MAIN.x - MAIN.y) * C;
const HY = (MAIN.x + MAIN.y) * S - LID_TOP;
// Bottle poses in screen space: high and tilted, resting mid fall, and down inside the opening
const START = { x: HX - 26, y: HY - 56, a: -60 };
const REST = { x: HX - 12, y: HY - 40, a: -35 };
const END = { x: HX, y: HY + 16, a: 0 };
const pose = (p: { x: number; y: number; a: number }) => `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${p.a}deg)`;

// Three arrows chasing each other around a triangle, drawn in the plane of the front face
const MARK = (() => {
  const R = 15;
  const v = [-90, 30, 150].map((deg) => [R * Math.cos((deg * Math.PI) / 180), R * Math.sin((deg * Math.PI) / 180)] as const);
  const at = (a: readonly [number, number], b: readonly [number, number], t: number, n: number) => {
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    const len = Math.hypot(dx, dy);
    return `${(a[0] + dx * t - (dy / len) * n).toFixed(2)} ${(a[1] + dy * t + (dx / len) * n).toFixed(2)}`;
  };
  return v
    .map((a, index) => {
      const b = v[(index + 1) % 3] as readonly [number, number];
      return `M${at(a, b, 0.08, -2.8)}L${at(a, b, 0.56, -2.8)}L${at(a, b, 0.56, -6.4)}L${at(a, b, 0.9, 0)}L${at(a, b, 0.56, 6.4)}L${at(a, b, 0.56, 2.8)}L${at(a, b, 0.08, 2.8)}Z`;
    })
    .join("");
})();

const STYLES = `
@keyframes isometric118-drop { 0% { transform: ${pose(START)}; opacity: 0; } 10% { opacity: 1; } 30% { transform: ${pose(REST)}; } 50% { transform: ${pose(END)}; opacity: 1; } 51%, 100% { transform: ${pose(END)}; opacity: 0; } }
@keyframes isometric118-turn { 0%, 50% { transform: rotate(0deg); } 70%, 100% { transform: rotate(120deg); } }
.isometric118-bottle { animation: isometric118-drop 5s cubic-bezier(0.5, 0, 0.8, 0.6) infinite; }
.isometric118-mark { transform-origin: 0 0; animation: isometric118-turn 5s cubic-bezier(0.45, 0, 0.2, 1) infinite; }
.isometric118-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric118-bottle, .isometric118-mark { animation: none; } }
`;

export function Isometric118({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric118Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const hole = palette === "dark" ? "fill-black/50" : "fill-black/30";
  const [hx, hy] = [HOLE * ELLIPSE_X, HOLE * ELLIPSE_Y];
  const markY = MAIN.y + (MAIN.bottom + MAIN.top) / 2;
  const sideTop = BASE + SIDE.height;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric118-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-60 -92 140 176" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={-200} y={-300} width={400} height={300 + HY} />
            <ellipse cx={HX} cy={HY} rx={hx} ry={hy} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, 96, 64, BASE)} paint={paint.body} />
        <Bin shape={taper(MAIN.x, MAIN.y, MAIN.bottom, MAIN.top, BOTTOM, TOP)} paint={paint.body} />
        <g transform={onLeft(markY)}>
          <g transform={`translate(${MAIN.x} ${-(BOTTOM + TOP) / 2 - 2})`}>
            <g className="isometric118-mark">
              <path d={MARK} strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={accent ? cn(paint.accent.base, paint.accent.edge) : paint.body.ink} />
            </g>
          </g>
        </g>
        <RoundBlock shape={roundBox(MAIN.x - MAIN.top - 2, MAIN.y - MAIN.top - 2, TOP, MAIN.top * 2 + 4, MAIN.top * 2 + 4, LID_TOP - TOP, 4)} paint={paint.body} />
        <g transform={onTop(LID_TOP)}>
          <circle cx={MAIN.x} cy={MAIN.y} r={HOLE + 3} className={paint.body.ink} />
          <circle cx={MAIN.x} cy={MAIN.y} r={HOLE} className={hole} />
        </g>
        <Bin shape={taper(SIDE.x, SIDE.y, SIDE.bottom, SIDE.top, BOTTOM, sideTop)} paint={paint.body} />
        <g transform={onLeft(SIDE.y + (SIDE.bottom + SIDE.top) / 2)} className={paint.body.ink}>
          <rect x={SIDE.x - 7} y={-sideTop + 10} width={14} height={3} rx={1.5} />
          <rect x={SIDE.x - 7} y={-sideTop + 16} width={9} height={3} rx={1.5} />
        </g>
        <RoundBlock shape={roundBox(SIDE.x - SIDE.top - 2, SIDE.y - SIDE.top - 2, sideTop, SIDE.top * 2 + 4, SIDE.top * 2 + 4, 4, 3)} paint={paint.body} />
        <g transform={onTop(sideTop + 4)}>
          <rect x={SIDE.x - 10} y={SIDE.y - 2} width={20} height={4} rx={2} className={hole} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric118-bottle" transform={`translate(${REST.x.toFixed(1)} ${REST.y.toFixed(1)}) rotate(${REST.a})`}>
            <Cylinder r={6} z={-14} h={16} paint={paint.body} />
            <Cylinder r={4} z={2} h={3} paint={paint.body} />
            <Cylinder r={2.5} z={5} h={5} paint={paint.body} />
            <Cylinder r={3} z={10} h={3} paint={paint.body} />
          </g>
        </g>
      </svg>
    </div>
  );
}
