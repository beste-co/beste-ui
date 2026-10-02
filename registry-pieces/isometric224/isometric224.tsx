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

interface Isometric224Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the weight gauge, the status light and the sun in the picture with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric224Demo: Isometric224Props = {
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
const PERIOD = 10;
const BIG = { x: 12, y: 24, size: 44, h: 6 };
const HOUSE = { x: 80, y: 14, w: 34, d: 64, h: 24 };
const SMALL = { x: 126, y: 31, size: 30, h: 3 };
const OUT = HOUSE.x + HOUSE.w;
// The big tile runs in until its front edge reaches the far face; the small one starts inside and runs out
const IN = OUT - (BIG.x + BIG.size);
const RUN = SMALL.x - (OUT - SMALL.size - 2);
const px = (distance: number) => `${(distance * C).toFixed(1)}px, ${(distance * S).toFixed(1)}px`;
const GAUGE = { x: HOUSE.x + 6, w: 22, drop: 14 };
/** The space in front of the exit face, so the small tile shows only once it is out. */
const EXIT = polygon([
  [OUT, 10, BASE + SMALL.h + 0.6],
  [220, 10, BASE + SMALL.h + 0.6],
  [220, 82, BASE + SMALL.h + 0.6],
  [220, 82, BASE - 0.6],
  [OUT, 82, BASE - 0.6],
  [OUT, 82, BASE + SMALL.h + 0.6],
]);

const STYLES = `
@keyframes isometric224-in { 0%, 12% { transform: translate(0px, 0px); } 36%, 100% { transform: translate(${px(IN)}); } }
@keyframes isometric224-big { 0% { opacity: 0; } 6%, 36% { opacity: 1; } 40%, 100% { opacity: 0; } }
@keyframes isometric224-out { 0%, 44% { transform: translate(${px(-RUN)}); } 62%, 100% { transform: translate(0px, 0px); } }
@keyframes isometric224-small { 0%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes isometric224-weight { 0%, 40% { transform: translate(0px, 0px); } 60%, 88% { transform: translate(${-GAUGE.drop}px, 0px); } 96%, 100% { transform: translate(0px, 0px); } }
.isometric224-in { animation: isometric224-in ${PERIOD}s ease-in-out infinite; }
.isometric224-big { animation: isometric224-big ${PERIOD}s linear infinite; }
.isometric224-out { animation: isometric224-out ${PERIOD}s ease-in-out infinite; }
.isometric224-small { animation: isometric224-small ${PERIOD}s ease-in-out infinite; }
.isometric224-weight { animation: isometric224-weight ${PERIOD}s ease-in-out infinite; }
.isometric224-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric224-scene * { animation: none !important; } }
`;

export function Isometric224({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric224Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const exitId = useId();
  const gaugeId = useId();
  const spot = accent ? mine.base : body.base;

  /** The same picture on both tiles, drawn in a unit square and sized to the tile. */
  const picture = (size: number) => (
    <g transform={`translate(4 4) scale(${(size - 8) / 36})`}>
      <rect width={36} height={36} rx={3} className={body.ink} />
      <circle cx={25} cy={10} r={4.5} className={spot} />
      <path d="M0 36V22L10 13L17 20L23 15L36 27V33A3 3 0 0 1 33 36Z" className={body.base} />
      <path d="M0 36V22L10 13L17 20L23 15L36 27V33A3 3 0 0 1 33 36Z" className={body.right} />
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric224-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-90 -22 250 164" aria-hidden="true" className="isometric224-scene size-full overflow-visible">
        <defs>
          <clipPath id={exitId}>
            <polygon points={EXIT} />
          </clipPath>
          <clipPath id={gaugeId}>
            <rect x={GAUGE.x} y={-(BASE + 18)} width={GAUGE.w} height={4.4} rx={2.2} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 172, 92, BASE, 14)} paint={body} />
        {/* The heavy original slides into the back of the press and is lost behind it */}
        <g className="isometric224-big">
          <g className="isometric224-in">
            <RoundBlock shape={roundBox(BIG.x, BIG.y, BASE, BIG.size, BIG.size, BIG.h, 5)} paint={body} />
            <g transform={`${onTop(BASE + BIG.h)} translate(${BIG.x} ${BIG.y})`}>{picture(BIG.size)}</g>
          </g>
        </g>
        {/* The press: a housing with a weight gauge on its side and the exit slot on its end */}
        <Block faces={box(HOUSE.x, HOUSE.y, BASE, HOUSE.w, HOUSE.d, HOUSE.h)} paint={body} />
        <g transform={onTop(BASE + HOUSE.h)}>
          <rect x={HOUSE.x + 6} y={HOUSE.y + 8} width={HOUSE.w - 12} height={HOUSE.d - 16} rx={5} className={body.ink} />
          <circle cx={HOUSE.x + HOUSE.w / 2} cy={HOUSE.y + 18} r={3} className={spot} />
        </g>
        <g transform={onLeft(HOUSE.y + HOUSE.d)}>
          <rect x={GAUGE.x} y={-(BASE + 18)} width={GAUGE.w} height={4.4} rx={2.2} className={body.ink} />
          <g clipPath={`url(#${gaugeId})`}>
            <rect x={GAUGE.x} y={-(BASE + 18)} width={GAUGE.w} height={4.4} rx={2.2} className={cn("isometric224-weight", accent ? mine.base : body.ink)} />
          </g>
          <rect x={GAUGE.x} y={-(BASE + 10.5)} width={12} height={2.2} rx={1.1} className={body.ink} />
          <rect x={GAUGE.x} y={-(BASE + 6.5)} width={8} height={2.2} rx={1.1} className={body.ink} />
        </g>
        <g transform={onRight(OUT)}>
          <rect x={SMALL.y - 4} y={-(BASE + 6.5)} width={SMALL.size + 8} height={6.5} rx={1.5} className={body.ink} />
          <rect x={SMALL.y - 4} y={-(BASE + 6.5)} width={SMALL.size + 8} height={6.5} rx={1.5} className={body.ink} />
        </g>
        {/* The light copy comes out of the slot: thinner, smaller, the same picture */}
        <g clipPath={`url(#${exitId})`} className="isometric224-small">
          <g className="isometric224-out">
            <RoundBlock shape={roundBox(SMALL.x, SMALL.y, BASE, SMALL.size, SMALL.size, SMALL.h, 4)} paint={body} />
            <g transform={`${onTop(BASE + SMALL.h)} translate(${SMALL.x} ${SMALL.y})`}>{picture(SMALL.size)}</g>
          </g>
        </g>
      </svg>
    </div>
  );
}
