"use client";

import { cn } from "@/lib/utils";

// --- isometric kit (shared by every Isometric piece, keep in sync) ---
type Tone = "primary" | "foreground" | "color" | "none";
type Palette = "theme" | "light" | "dark" | "tone" | "glass";

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
  // See-through body for a piece that sits over a photo or gradient; stacked solids add up to a frosted look
  glass: { base: "fill-card/30", left: "fill-foreground/5", right: "fill-foreground/10", edge: "stroke-card/70", ink: "fill-foreground/20" },
};
const ACCENT: Paint = { base: "fill-current", left: "fill-black/15", right: "fill-black/30", edge: "stroke-transparent", ink: "fill-white/40" };
// On a body that is already the tone, the accent turns white so it still stands out
const ACCENT_ON_TONE: Paint = { base: "fill-white", left: "fill-black/10", right: "fill-black/20", edge: "stroke-transparent", ink: "fill-current" };
// On a glass body the accent is tinted glass too, with a light rim
const ACCENT_ON_GLASS: Paint = { base: "fill-current/45", left: "fill-black/10", right: "fill-black/20", edge: "stroke-white/50", ink: "fill-white/60" };

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
  return { body, accent: !accent ? body : palette === "tone" ? ACCENT_ON_TONE : palette === "glass" ? ACCENT_ON_GLASS : ACCENT };
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

interface Isometric116Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the extinguisher with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric116Demo: Isometric116Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

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

/** A half sphere sitting on a circle of radius r at height z. */
function Dome({ r, z, paint }: { r: number; z: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const base = -z;
  const left = `M${-rx} ${base} A${rx} ${rx} 0 0 1 0 ${base - rx} L0 ${base + ry} A${rx} ${ry} 0 0 1 ${-rx} ${base} Z`;
  const right = `M${rx} ${base} A${rx} ${rx} 0 0 0 0 ${base - rx} L0 ${base + ry} A${rx} ${ry} 0 0 0 ${rx} ${base} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
    </g>
  );
}

type Rod = ReturnType<typeof rod>;

/** A round rod lying along x or y from a to b, centered on (u, z) in the other two axes. */
function rod(axis: "x" | "y", a: number, b: number, u: number, z: number, r: number) {
  const at = (t: number, degrees: number): Point => {
    const angle = (degrees * Math.PI) / 180;
    const du = r * Math.cos(angle);
    const dz = r * Math.sin(angle);
    return axis === "x" ? [t, u + du, z + dz] : [u + du, t, z + dz];
  };
  const arc = (t: number, from: number, to: number) => Array.from({ length: 13 }, (_, k) => at(t, from + ((to - from) * k) / 12));
  const band = (from: number, to: number) => polygon([...arc(a, from, to), ...arc(b, from, to).reverse()]);
  return { axis, side: band(-45, 135), shade: band(-45, 45), cap: polygon(Array.from({ length: 36 }, (_, k) => at(b, k * 10))) };
}

function RodBlock({ shape, paint }: { shape: Rod; paint: Paint }) {
  const along = shape.axis === "y";
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.shade} className={along ? paint.right : paint.left} stroke="none" />
      <polygon points={shape.cap} className={paint.base} />
      <polygon points={shape.cap} className={along ? paint.left : paint.right} stroke="none" />
    </g>
  );
}

const P = 6;
const W = 68;
const WALL = 6;
const H = 100;
const CX = 32;
const CY = WALL + 16;
const R = 14;
const FOOT = 20;
const TALL = 56;
const SHOULDER = FOOT + TALL;
const GAUGE = { x: CX - 1, z: SHOULDER + 15, r: 7, y: CY + 8 };
const NEEDLE: Record<Palette, string> = {
  theme: "fill-foreground",
  light: "fill-zinc-900",
  dark: "fill-zinc-100",
  tone: "fill-black/70",
  glass: "fill-foreground",
};
/** The front half of a ring around an upright cylinder, for straps and bands. */
function Band({ r, z, h, paint }: { r: number; z: number; h: number; paint: Paint }) {
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
    </g>
  );
}

const at = (x: number, y: number) => `translate(${project([x, y, 0])})`;

const STYLES = `
@keyframes isometric116-needle { 0%, 10% { transform: rotate(-100deg); } 34% { transform: rotate(18deg); } 44% { transform: rotate(-8deg); } 54% { transform: rotate(4deg); } 62%, 86% { transform: rotate(0deg); } 100% { transform: rotate(-100deg); } }
.isometric116-needle { transform-origin: 0 0; animation: isometric116-needle 5s cubic-bezier(0.4, 0, 0.3, 1) infinite; }
.isometric116-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric116-needle { animation: none; } }
`;

export function Isometric116({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric116Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const can = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric116-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-50 -112 120 172" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, W, 44, P)} paint={body} />
        <Block faces={box(0, 0, P, W, WALL, H)} paint={body} />
        <g transform={onLeft(WALL)} className={body.ink}>
          <rect x={CX - 9} y={-(SHOULDER - 4)} width={18} height={30} rx={2} />
        </g>
        <Block faces={box(CX - 4, WALL, SHOULDER - 22, 8, CY - WALL - R + 2, 10)} paint={body} />
        <g transform={at(CX, CY)}>
          <Cylinder r={R} z={FOOT} h={TALL} paint={can} />
          <Dome r={R} z={SHOULDER} paint={can} />
          <Band r={R + 1} z={SHOULDER - 20} h={6} paint={body} />
          <Cylinder r={4} z={SHOULDER + 8} h={8} paint={body} />
        </g>
        <g transform={onLeft(CY + R)} className={can.ink}>
          <rect x={CX - 7} y={-(FOOT + 30)} width={16} height={18} rx={2} />
        </g>
        <Block faces={box(CX - 3, CY - 4, SHOULDER + 16, 8, 8, 6)} paint={body} />
        <Block faces={box(CX - 12, CY - 2, SHOULDER + 24, 22, 4, 3)} paint={body} />
        <Block faces={box(CX - 10, CY - 2, SHOULDER + 18, 7, 4, 3)} paint={body} />
        <Block faces={box(CX + 5, CY - 2, SHOULDER + 17, 14, 3, 3)} paint={body} />
        <Block faces={box(CX + 16, CY - 2, FOOT + 8, 3, 3, SHOULDER - FOOT + 12)} paint={body} />
        <Block faces={box(CX + 15, CY - 3, FOOT + 2, 5, 5, 8)} paint={body} />
        <RodBlock shape={rod("y", CY + 2, GAUGE.y, GAUGE.x, GAUGE.z, GAUGE.r)} paint={body} />
        <g transform={onLeft(GAUGE.y)}>
          <g transform={`translate(${GAUGE.x} ${-GAUGE.z})`}>
            <path d="M-4 -4 A5.7 5.7 0 0 1 4 -4 L0 0 Z" className={can.base} />
            <g className="isometric116-needle">
              <rect x={-0.6} y={-5.5} width={1.4} height={6} rx={0.6} className={NEEDLE[palette]} />
            </g>
            <circle r={1.2} className={NEEDLE[palette]} />
          </g>
        </g>
      </svg>
    </div>
  );
}
