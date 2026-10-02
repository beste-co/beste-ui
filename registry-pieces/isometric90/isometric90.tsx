"use client";

import { useId } from "react";
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

interface Isometric90Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the fabric with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric90Demo: Isometric90Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

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

const BED = 10;
const FABRIC_Z = BED + 1;
const NEEDLE = { x: 16, y: 21 };
const STITCH = 6;
const STROKES = 4;
const DASHES = Array.from({ length: STROKES * 2 }, (_, index) => NEEDLE.y - 6 - (index - STROKES) * STITCH);
const SPOOL = roundBox(56, 18, 60, 8, 8, 10, 4);

// Each stroke: the needle dips, then the fabric feeds one stitch back
const stroke = (index: number) => (index * 72) / STROKES;
const STYLES = `
@keyframes isometric90-needle { ${Array.from({ length: STROKES }, (_, index) => {
  const at = stroke(index);
  const step = 72 / STROKES;
  return `${at.toFixed(1)}% { transform: translateY(0); } ${(at + step * 0.4).toFixed(1)}% { transform: translateY(5px); } ${(at + step * 0.8).toFixed(1)}% { transform: translateY(0); }`;
}).join(" ")} 100% { transform: translateY(0); } }
@keyframes isometric90-feed { ${Array.from({ length: STROKES }, (_, index) => {
  const at = stroke(index);
  const step = 72 / STROKES;
  return `${(at + step * 0.45).toFixed(1)}% { transform: translateY(${-index * STITCH}px); } ${(at + step * 0.95).toFixed(1)}% { transform: translateY(${-(index + 1) * STITCH}px); }`;
}).join(" ")} 99.9% { transform: translateY(${-STROKES * STITCH}px); } 100% { transform: translateY(0); } }
.isometric90-needle { animation: isometric90-needle 4.8s ease-in-out infinite; will-change: transform; }
.isometric90-feed { animation: isometric90-feed 4.8s ease-in-out infinite; }
.isometric90-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric90-needle, .isometric90-feed { animation: none; } }
`;

export function Isometric90({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric90Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clip = useId();
  const paint = paints(palette, accent, tone, color);
  const cloth = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric90-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-46 -58 140 134" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 100, 44, BED, 4)} paint={paint.body} />
        <Block faces={box(2, 2, BED, 46, 38, 1)} paint={cloth} />
        <g transform={onTop(FABRIC_Z)}>
          <defs>
            <clipPath id={clip}>
              <rect x={NEEDLE.x - 3} y={3} width={6} height={NEEDLE.y - 4} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <g className={cn("isometric90-feed", cloth.ink)}>
              {DASHES.map((y) => (
                <rect key={y} x={NEEDLE.x - 1.25} y={y} width={2.5} height={4} rx={1.25} />
              ))}
            </g>
          </g>
        </g>
        <Block faces={box(12, 17, FABRIC_Z, 9, 8, 2)} paint={paint.body} />
        {/* The needle bar runs up into the head, which is drawn over it, so it slides in and out of the machine */}
        <g className="isometric90-needle">
          <Block faces={box(NEEDLE.x - 1.5, NEEDLE.y - 1.5, FABRIC_Z + 6, 3, 3, 30)} paint={paint.body} />
          <Block faces={box(NEEDLE.x - 0.5, NEEDLE.y - 0.5, FABRIC_Z + 1, 1, 1, 5)} paint={paint.body} />
        </g>
        <RoundBlock shape={roundBox(8, 12, 30, 20, 20, 30, 5)} paint={paint.body} />
        <Block faces={box(70, 10, BED, 22, 24, 40)} paint={paint.body} />
        <RoundBlock shape={roundBox(8, 12, 46, 84, 20, 14, 5)} paint={paint.body} />
        <g transform={onLeft(32)} className={paint.body.ink}>
          <rect x={36} y={-56} width={28} height={3} rx={1.5} />
        </g>
        <RoundBlock shape={SPOOL} paint={paint.body} />
        <RoundBlock shape={roundBox(59, 21, 70, 2, 2, 4, 1)} paint={paint.body} />
        <RodBlock shape={rod("x", 92, 97, 22, 34, 11)} paint={paint.body} />
        <g transform={onRight(97)} className={paint.body.ink}>
          <path fillRule="evenodd" d="M13 -34a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z M16 -34a6 6 0 1 1 12 0a6 6 0 1 1 -12 0Z" />
          <circle cx={22} cy={-34} r={2} />
        </g>
      </svg>
    </div>
  );
}
