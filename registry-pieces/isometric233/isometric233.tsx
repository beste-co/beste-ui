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

interface Isometric233Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the logo, the profile links and the verified mark with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric233Demo: Isometric233Props = {
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

const W = 96;
const TALL = 62;
const THICK = 5;
const FOOT: Point = [16, 44, BASE + 3];
// The linked profiles along the bottom of the card
const DOTS = [15, 37, 59, 81];
const DOT_Y = 47;
const CHECK = "M-2.4 0.2L-0.7 1.9L2.6 -1.7";

const PERIOD = 9;
const START = [14, 26, 38];
const STYLES = `
${START.map((start, link) => `@keyframes isometric233-link${link} { 0%, ${start}% { stroke-dashoffset: 1; } ${start + 10}%, 93% { stroke-dashoffset: 0; } 94%, 100% { stroke-dashoffset: 1; } }
.isometric233-link${link} { animation: isometric233-link${link} ${PERIOD}s ease-in-out infinite; }`).join("\n")}
@keyframes isometric233-links { 0%, 86% { opacity: 1; } 92%, 96% { opacity: 0; } 100% { opacity: 1; } }
@keyframes isometric233-seal { 0%, 52% { opacity: 0; } 59%, 86% { opacity: 1; } 92%, 100% { opacity: 0; } }
.isometric233-links { animation: isometric233-links ${PERIOD}s linear infinite; }
.isometric233-seal { animation: isometric233-seal ${PERIOD}s ease-in-out infinite; }
.isometric233-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric233-scene * { animation: none !important; } }
`;
export function Isometric233({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric233Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric233-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-88 -64 220 192" aria-hidden="true" className="isometric233-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 132, 92, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT[0] - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        <Rest id="rest" foot={FOOT} w={W} tall={36} behind={THICK} paint={body} />
        <Slab id="card" foot={FOOT} w={W} tall={TALL} thick={THICK} rx={7} paint={body}>
          {/* The logo block, the name and the line under it */}
          <rect x={8} y={8} width={20} height={20} rx={5.5} className={accent ? mine.base : body.ink} />
          <circle cx={18} cy={18} r={4.6} className={accent ? mine.ink : body.base} />
          <rect x={34} y={10.5} width={32} height={5} rx={2.5} className={body.ink} />
          <rect x={34} y={20} width={22} height={3} rx={1.5} className={body.ink} />
          <rect x={8} y={34.5} width={W - 16} height={1.2} rx={0.6} className={body.ink} />
          {/* The verified mark beside the name */}
          <g transform="translate(79 16)" className="isometric233-seal">
            <circle r={6.4} className={accent ? mine.base : body.ink} />
            <path d={CHECK} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={onAccent} />
          </g>
          {/* The profiles: links that draw in from one to the next, under the dots */}
          <g fill="none" strokeWidth={1.8} strokeLinecap="round" className={cn("isometric233-links", inAccent)}>
            {START.map((start, link) => (
              <path key={`link-${start}`} d={`M${DOTS[link]} ${DOT_Y}H${DOTS[link + 1]}`} pathLength={1} strokeDasharray={1} className={`isometric233-link${link}`} />
            ))}
          </g>
          {DOTS.map((x) => (
            <g key={`dot-${x}`}>
              <circle cx={x} cy={DOT_Y} r={5.4} className={body.base} />
              <circle cx={x} cy={DOT_Y} r={5.4} className={body.ink} />
              <circle cx={x} cy={DOT_Y - 1.2} r={1.7} className={body.base} />
              <rect x={x - 2.8} y={DOT_Y + 1.4} width={5.6} height={2.2} rx={1.1} className={body.base} />
            </g>
          ))}
        </Slab>
        {/* The lip of the stand holds the bottom edge of the card */}
        <RoundBlock shape={roundBox(FOOT[0] - 4, FOOT[1] - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
