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

interface Isometric210Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the sample letters and the active letter tile with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric210Demo: Isometric210Props = {
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
const W = 74;
const TALL = 84;
const THICK = 5;
// The specimen sheet stands on its bottom front edge and leans back by this much
const LEAN = (14 * Math.PI) / 180;
const FOOT = { x: 14, y: 42, z: BASE + 3 };
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the front, starting `rise` up the slab. */
function plane(depth: number, rise: number, left = 0) {
  const origin: Point = [FOOT.x + left, FOOT.y + UP[1] * rise + BACK[1] * depth, FOOT.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const FRONT = plane(0, TALL);
// Behind the front the slab is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
// The rest behind the slab: a little wider, half as tall
const REST = { side: 4, tall: 44, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);
// The sheet leaves a chin at the bottom for the lip of the stand to cover
const PAGE = { x: 3, y: 3, w: W - 6, h: 70 };
// Letter shapes as filled outlines, about 14 units tall round the origin
const SANS_A = "M-7 7L-1.7 -7H1.7L7 7H3.7L2.6 3.8H-2.6L-3.7 7ZM-1.6 1.2H1.6L0 -3.6Z";
const SERIF_A = "M-5.4 6L-0.9 -7H1.5L6.2 6H7.6V7H2.4V6H3.6L2.6 3.2H-2.2L-3.1 6H-1.9V7H-7.6V6ZM-1.9 2.2H2.3L0.1 -4Z";
const BOWL = "M-4.4 2.6a4.4 4.4 0 1 0 8.8 0a4.4 4.4 0 1 0 -8.8 0ZM-1.9 2.6a1.9 1.9 0 1 0 3.8 0a1.9 1.9 0 1 0 -3.8 0Z";
const TILES = [
  { id: "sans", x: 106, y: 10 },
  { id: "serif", x: 106, y: 48 },
] as const;
const TILE = { s: 30, h: 5, r: 6 };
const PERIOD = 9;

const STYLES = `
@keyframes isometric210-sans { 0%, 40% { opacity: 1; } 47%, 90% { opacity: 0; } 97%, 100% { opacity: 1; } }
@keyframes isometric210-serif { 0%, 40% { opacity: 0; } 47%, 90% { opacity: 1; } 97%, 100% { opacity: 0; } }
.isometric210-sans { animation: isometric210-sans ${PERIOD}s ease-in-out infinite; }
.isometric210-serif { animation: isometric210-serif ${PERIOD}s ease-in-out infinite; }
.isometric210-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric210-scene * { animation: none !important; } }
`;

/** The pair "Aa" in one of the two faces, drawn round the origin. */
function Letters({ face, className }: { face: "sans" | "serif"; className: string }) {
  return (
    <g className={className}>
      <path d={face === "sans" ? SANS_A : SERIF_A} fillRule="evenodd" />
      <g transform="translate(13.5 0)">
        <path d={BOWL} fillRule="evenodd" />
        <rect x={face === "sans" ? 2.5 : 2.9} y={-1.8} width={face === "sans" ? 2.5 : 1.7} height={8.8} />
        {face === "serif" && <rect x={2.9} y={6} width={3.4} height={1} />}
      </g>
    </g>
  );
}

export function Isometric210({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric210Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const clipId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric210-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-86 -78 222 204" aria-hidden="true" className="isometric210-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} rx={4} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 148, 90, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 12, BASE, W + 12, 44, 3, 8)} paint={body} />
        {/* The rest the slab leans against, then the slab itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={`rest-${depth}`} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={`slab-${depth}`} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={6} className={body.base} />
            <rect width={W} height={TALL} rx={6} className={body.right} />
          </g>
        ))}
        <g transform={FRONT}>
          <rect width={W} height={TALL} rx={6} strokeWidth={1} className={cn(body.base, body.edge)} />
          <g clipPath={`url(#${clipId})`}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.base} />
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.ink} />
            {/* The sans pairing: round letters, a heavy heading and soft body lines */}
            <g className="isometric210-sans">
              <g transform="translate(22 22) scale(1.5)">
                <Letters face="sans" className={accent ? mine.base : body.base} />
              </g>
              <rect x={10} y={39} width={46} height={6} rx={3} className={body.base} />
              {[50, 55.5, 61].map((y, index) => (
                <rect key={`sans-${y}`} x={10} y={y} width={index === 2 ? 34 : 54} height={2.8} rx={1.4} className={body.base} />
              ))}
            </g>
            {/* The serif pairing: letters with feet, a lighter heading over a rule and fine body lines */}
            <g className="isometric210-serif opacity-0">
              <g transform="translate(22 22) scale(1.5)">
                <Letters face="serif" className={accent ? mine.base : body.base} />
              </g>
              <rect x={10} y={39} width={40} height={4} className={body.base} />
              <rect x={10} y={45.6} width={54} height={0.9} className={body.base} />
              {[50, 54, 58, 62].map((y, index) => (
                <rect key={`serif-${y}`} x={10} y={y} width={index === 3 ? 30 : 54} height={1.7} className={body.base} />
              ))}
            </g>
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the sheet */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* A letter tile per typeface; the one in use takes the accent */}
        {TILES.map((tile) => (
          <g key={`tile-${tile.id}`}>
            <RoundBlock shape={roundBox(tile.x, tile.y, BASE, TILE.s, TILE.s, TILE.h, TILE.r)} paint={body} />
            <g transform={`${onTop(BASE + TILE.h)} translate(${tile.x + TILE.s / 2 - 5} ${tile.y + TILE.s / 2})`}>
              <Letters face={tile.id} className={body.ink} />
            </g>
            <g className={cn(`isometric210-${tile.id}`, tile.id === "serif" && "opacity-0")}>
              <RoundBlock shape={roundBox(tile.x, tile.y, BASE, TILE.s, TILE.s, TILE.h, TILE.r)} paint={mine} />
              <g transform={`${onTop(BASE + TILE.h)} translate(${tile.x + TILE.s / 2 - 5} ${tile.y + TILE.s / 2})`}>
                <Letters face={tile.id} className={accent ? mine.ink : body.ink} />
              </g>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
