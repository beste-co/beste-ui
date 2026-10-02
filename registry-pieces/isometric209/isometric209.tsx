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

interface Isometric209Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the section's button and parts of each picture with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric209Demo: Isometric209Props = {
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
// The section slab is cut open on its right side: that notch is the media slot
const SLAB = { x: 10, y: 10, w: 102, d: 56, h: 5, rail: 6, text: 50 };
const SLOT = { x: SLAB.x + SLAB.text, y: SLAB.y + SLAB.rail, w: SLAB.w - SLAB.text, d: SLAB.d - 2 * SLAB.rail };
const TILE = { x: SLOT.x + 2, y: SLOT.y + 2, w: SLOT.w - 4, d: SLOT.d - 4, h: 6.5 };
// How far to the right the tile waits before it slides in
const TRAVEL = 56;
const OUT = `translate(${(TRAVEL * C).toFixed(2)}px, ${(TRAVEL * S).toFixed(2)}px)`;
const TOP = BASE + SLAB.h;
const PERIOD = 12;

const STYLES = `
@keyframes isometric209-slide { 0%, 6% { transform: ${OUT}; } 17%, 40% { transform: translate(0px, 0px); } 50%, 56% { transform: ${OUT}; } 67%, 90% { transform: translate(0px, 0px); } 100% { transform: ${OUT}; } }
@keyframes isometric209-first { 0% { opacity: 0; } 5%, 50% { opacity: 1; } 55%, 100% { opacity: 0; } }
@keyframes isometric209-second { 0% { opacity: 1; } 5%, 50% { opacity: 0; } 55%, 100% { opacity: 1; } }
.isometric209-slide { animation: isometric209-slide ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric209-first { animation: isometric209-first ${PERIOD}s linear infinite; }
.isometric209-second { animation: isometric209-second ${PERIOD}s linear infinite; }
.isometric209-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric209-scene * { animation: none !important; } }
`;

export function Isometric209({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric209Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric209-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -34 248 184" aria-hidden="true" className="isometric209-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 178, 76, BASE, 14)} paint={body} />
        {/* The empty slot, marked out on the desk where the tile will sit */}
        <g transform={onTop(BASE)}>
          <rect x={TILE.x + 1} y={TILE.y + 1} width={TILE.w - 2} height={TILE.d - 2} rx={3} fill="none" strokeWidth={1.2} strokeDasharray="4 3" strokeLinecap="round" className={body.edge} />
        </g>
        {/* The slab: the far rail and the text part first, the near rail after the tile */}
        <Block faces={box(SLAB.x, SLAB.y, BASE, SLAB.w, SLAB.rail, SLAB.h)} paint={body} />
        <Block faces={box(SLAB.x, SLOT.y, BASE, SLAB.text, SLOT.d, SLAB.h)} paint={body} />
        <g transform={onTop(TOP)}>
          <rect x={SLAB.x + 0.8} y={SLOT.y - 1} width={SLAB.text - 1.6} height={2} className={body.base} />
          <rect x={18} y={22} width={30} height={5} rx={2.5} className={body.ink} />
          <rect x={18} y={31} width={34} height={2.6} rx={1.3} className={body.ink} />
          <rect x={18} y={36} width={26} height={2.6} rx={1.3} className={body.ink} />
          <rect x={18} y={44} width={22} height={8} rx={4} className={accent ? mine.base : body.ink} />
          <rect x={23.5} y={46.8} width={11} height={2.4} rx={1.2} className={accent ? mine.ink : body.base} />
        </g>
        {/* The art tile slides along the desk into the slot; its picture changes while it waits outside */}
        <g className="isometric209-slide">
          <Block faces={box(TILE.x, TILE.y, BASE, TILE.w, TILE.d, TILE.h)} paint={body} />
          <g transform={onTop(BASE + TILE.h)}>
            <g className="isometric209-first">
              <rect x={TILE.x + 3} y={TILE.y + 3} width={TILE.w - 6} height={TILE.d - 6} rx={3} className={body.ink} />
              <circle cx={TILE.x + 14} cy={TILE.y + 13} r={5} className={accent ? mine.base : body.base} />
              <path d={`M${TILE.x + 5} ${TILE.y + TILE.d - 5}l12 -13l8 7l9 -12l9 18Z`} className={body.base} />
            </g>
            <g className="isometric209-second opacity-0">
              <rect x={TILE.x + 3} y={TILE.y + 3} width={TILE.w - 6} height={TILE.d - 6} rx={3} className={accent ? mine.base : body.ink} />
              <circle cx={TILE.x + TILE.w / 2} cy={TILE.y + TILE.d / 2} r={11} className={accent ? mine.ink : body.base} />
              <circle cx={TILE.x + TILE.w / 2} cy={TILE.y + TILE.d / 2} r={5} className={accent ? mine.base : body.ink} />
              <rect x={TILE.x + 7} y={TILE.y + 7} width={7} height={7} rx={1.5} className={accent ? mine.ink : body.base} />
            </g>
          </g>
        </g>
        <Block faces={box(SLAB.x, SLAB.y + SLAB.d - SLAB.rail, BASE, SLAB.w, SLAB.rail, SLAB.h)} paint={body} />
        {/* The slab is one piece: paint over the seam where the near rail meets the text part */}
        <g transform={onTop(TOP)}>
          <rect x={SLAB.x + 0.8} y={SLOT.y + SLOT.d - 1} width={SLAB.text - 1.6} height={2} className={body.base} />
        </g>
      </svg>
    </div>
  );
}
