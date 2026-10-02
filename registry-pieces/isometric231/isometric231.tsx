"use client";

import type { ReactNode } from "react";
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

interface Isometric231Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the checks and the root of the sitemap tree with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric231Demo: Isometric231Props = {
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
// Slabs stand on their bottom front edge and lean back by this much
const LEAN = (14 * Math.PI) / 180;
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the front of a slab standing at `foot`, starting `rise` up it. */
function plane(foot: Point, depth: number, rise: number, left = 0) {
  const origin: Point = [foot[0] + left, foot[1] + UP[1] * rise + BACK[1] * depth, foot[2] + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}

/** The rest a slab leans against: a little wider, built from thin layers back to front. */
function Rest({ id, foot, w, tall, behind, side = 4, paint }: { id: string; foot: Point; w: number; tall: number; behind: number; side?: number; paint: Paint }) {
  return (
    <>
      {[3, 2, 1].map((layer) => (
        <g key={`${id}-${layer}`} transform={plane(foot, behind + layer, tall, -side)} className={paint.edge} strokeWidth={layer === 1 ? 1 : 0}>
          <rect width={w + 2 * side} height={tall} rx={6} className={paint.base} />
          <rect width={w + 2 * side} height={tall} rx={6} className={layer === 1 ? paint.left : paint.right} stroke="none" />
        </g>
      ))}
    </>
  );
}

/** A leaning slab built from thin layers back to front; its children are drawn on the front face. */
function Slab({ id, foot, w, tall, thick, rx = 6, paint, children }: { id: string; foot: Point; w: number; tall: number; thick: number; rx?: number; paint: Paint; children?: ReactNode }) {
  return (
    <>
      {Array.from({ length: thick }, (_, index) => thick - index).map((depth) => (
        <g key={`${id}-${depth}`} transform={plane(foot, depth, tall)}>
          <rect width={w} height={tall} rx={rx} className={paint.base} />
          <rect width={w} height={tall} rx={rx} className={paint.right} />
        </g>
      ))}
      <g transform={plane(foot, 0, tall)}>
        <rect width={w} height={tall} rx={rx} strokeWidth={1} className={cn(paint.base, paint.edge)} />
        {children}
      </g>
    </>
  );
}

const W = 72;
const TALL = 80;
const THICK = 5;
const FOOT: Point = [12, 44, BASE + 3];
const ROWS = [18, 37, 56];
const CHECK = "M-2.2 0.2L-0.6 1.8L2.4 -1.6";
// The sitemap tree on the desk: a root tile at the back and three pages in front of it
const ROOT = { x: 124, y: 22 };
const LEAVES = [102, 124, 146];
const LEAF_Y = 62;
const JOIN_Y = 48;

const PERIOD = 9;
const START = [14, 28, 42];
const STYLES = `
${START.map((start, row) => `@keyframes isometric231-draw${row} { 0%, ${start}% { stroke-dashoffset: 1; } ${start + 8}%, 92% { stroke-dashoffset: 0; } 93%, 100% { stroke-dashoffset: 1; } }
@keyframes isometric231-mark${row} { 0%, ${start - 3}% { opacity: 0; } ${start + 1}%, 84% { opacity: 1; } 90%, 100% { opacity: 0; } }
.isometric231-draw${row} { animation: isometric231-draw${row} ${PERIOD}s ease-in-out infinite; }
.isometric231-mark${row} { animation: isometric231-mark${row} ${PERIOD}s ease-in-out infinite; }`).join("\n")}
.isometric231-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric231-scene * { animation: none !important; } }
`;
export function Isometric231({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric231Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric231-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-92 -78 238 212" aria-hidden="true" className="isometric231-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 160, 92, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT[0] - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        <Rest id="rest" foot={FOOT} w={W} tall={44} behind={THICK} paint={body} />
        <Slab id="slab" foot={FOOT} w={W} tall={TALL} thick={THICK} paint={body}>
          <rect x={6} y={6} width={30} height={4.4} rx={2.2} className={body.ink} />
          <rect x={40} y={7} width={14} height={2.6} rx={1.3} className={body.ink} />
          {ROWS.map((y, row) => (
            <g key={`row-${y}`} transform={`translate(5 ${y})`}>
              <rect width={W - 10} height={15} rx={4.5} className={body.ink} />
              <rect x={3.5} y={3.5} width={8} height={8} rx={2.4} className={body.base} />
              {/* Sitemap, canonical address and structured data, each as a small glyph */}
              {row === 0 && (
                <g className={body.ink}>
                  <rect x={6.2} y={5} width={2.6} height={1.8} rx={0.6} />
                  <rect x={4.8} y={8.2} width={2.2} height={1.8} rx={0.6} />
                  <rect x={8} y={8.2} width={2.2} height={1.8} rx={0.6} />
                </g>
              )}
              {row === 1 && (
                <g className={body.ink}>
                  <circle cx={6} cy={7.5} r={1.5} />
                  <circle cx={9} cy={7.5} r={1.5} />
                </g>
              )}
              {row === 2 && (
                <g className={body.ink}>
                  <rect x={5} y={5.2} width={5} height={1.2} rx={0.6} />
                  <rect x={6} y={7} width={4} height={1.2} rx={0.6} />
                  <rect x={5} y={8.8} width={3} height={1.2} rx={0.6} />
                </g>
              )}
              <rect x={15} y={4.2} width={26} height={2.8} rx={1.4} className={body.base} />
              <rect x={15} y={9} width={17} height={2.2} rx={1.1} className={body.base} />
              <circle cx={W - 18.5} cy={7.5} r={4.6} className={body.base} />
              <g transform={`translate(${W - 18.5} 7.5)`} className={`isometric231-mark${row}`}>
                <circle r={4.6} className={mine.base} />
                <path d={CHECK} pathLength={1} strokeDasharray={1} fill="none" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className={cn(`isometric231-draw${row}`, onAccent)} />
              </g>
            </g>
          ))}
        </Slab>
        {/* The lip of the stand holds the bottom edge of the slab */}
        <RoundBlock shape={roundBox(FOOT[0] - 4, FOOT[1] - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* The sitemap tree: links drawn on the desk, the root behind and its pages in front */}
        <g transform={onTop(BASE)} className={body.ink}>
          <rect x={ROOT.x - 1} y={ROOT.y + 6} width={2} height={JOIN_Y - ROOT.y - 6} />
          <rect x={LEAVES[0]} y={JOIN_Y - 1} width={(LEAVES[2] ?? 0) - (LEAVES[0] ?? 0)} height={2} rx={1} />
          {LEAVES.map((x) => (
            <rect key={`link-${x}`} x={x - 1} y={JOIN_Y} width={2} height={LEAF_Y - JOIN_Y} />
          ))}
        </g>
        <RoundBlock shape={roundBox(ROOT.x - 10, ROOT.y - 7, BASE, 20, 14, 5, 4)} paint={mine} />
        <g transform={onTop(BASE + 5)} className={mine.ink}>
          <rect x={ROOT.x - 6} y={ROOT.y - 1.2} width={12} height={2.4} rx={1.2} />
        </g>
        {LEAVES.map((x) => (
          <g key={`leaf-${x}`}>
            <RoundBlock shape={roundBox(x - 8, LEAF_Y - 6, BASE, 16, 12, 4, 3.5)} paint={body} />
            <g transform={onTop(BASE + 4)} className={body.ink}>
              <rect x={x - 4.5} y={LEAF_Y - 1} width={9} height={2} rx={1} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
