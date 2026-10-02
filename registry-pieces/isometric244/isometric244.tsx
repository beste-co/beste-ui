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

interface Isometric244Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the custom logo plate and the page highlight with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric244Demo: Isometric244Props = {
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

const G = 6;
const DESK = { w: 150, d: 84 };
const SLAB = { x: 20, y: 30, w: 104, d: 5, h: 74 };
const FACE_Y = SLAB.y + SLAB.d;
// The footer plate stands proud of the page and drops into a slot in the desk
const PLATE = { x: 84, w: 32, t: 2.5, h: 9, lift: 4 };
const DROP = PLATE.h + PLATE.lift + 3.5;
const at = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
// Everything above the slot's front and right edges: what is left of a plate as it sinks
const SLOT_CLIP = (() => {
  const a = at([PLATE.x - 3, FACE_Y + PLATE.t, G]);
  const b = at([PLATE.x + PLATE.w, FACE_Y + PLATE.t, G]);
  const c = at([PLATE.x + PLATE.w, FACE_Y, G]);
  return [a, b, c, [c[0] + 2, c[1] - 60], [a[0], a[1] - 60]].map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
})();
const PERIOD = 10;

const STYLES = `
@keyframes isometric244-brand { 0%, 12% { transform: translateY(0px); } 22%, 90% { transform: translateY(${DROP}px); } 100% { transform: translateY(0px); } }
@keyframes isometric244-custom { 0%, 26% { transform: translateY(${DROP}px); } 38%, 78% { transform: translateY(0px); } 88%, 100% { transform: translateY(${DROP}px); } }
.isometric244-brand { transform: translateY(${DROP}px); animation: isometric244-brand ${PERIOD}s cubic-bezier(0.5, 0, 0.2, 1) infinite; }
.isometric244-custom { animation: isometric244-custom ${PERIOD}s cubic-bezier(0.5, 0, 0.2, 1) infinite; }
.isometric244-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric244-scene * { animation: none !important; } }
`;

export function Isometric244({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric244Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const clipId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric244-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-86 -70 230 202" aria-hidden="true" className="isometric244-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={SLOT_CLIP} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, DESK.w, DESK.d, G, 14)} paint={body} />
        <Block faces={box(SLAB.x, SLAB.y, G, SLAB.w, SLAB.d, SLAB.h)} paint={body} />
        {/* The page: a bar, a highlight, two cards and a footer with the recess the plate sits in */}
        <g transform={onLeft(FACE_Y)}>
          <rect x={SLAB.x + 3} y={-(G + SLAB.h - 3)} width={SLAB.w - 6} height={SLAB.h - 6} rx={3} className={body.ink} />
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={SLAB.x + 9 + dot * 4.4} cy={-(G + 66)} r={1.3} className={body.base} />
          ))}
          <rect x={SLAB.x + 26} y={-(G + 68)} width={50} height={4} rx={2} className={body.base} />
          <rect x={SLAB.x + 8} y={-(G + 60)} width={SLAB.w - 16} height={18} rx={3} className={mine.base} />
          <rect x={SLAB.x + 13} y={-(G + 55)} width={30} height={3} rx={1.5} className={mine.ink} />
          <rect x={SLAB.x + 13} y={-(G + 49.5)} width={20} height={2.4} rx={1.2} className={mine.ink} />
          {[0, 1].map((card) => (
            <rect key={`card-${card}`} x={SLAB.x + 8 + card * 45} y={-(G + 38)} width={43} height={18} rx={3} className={body.base} />
          ))}
          <rect x={SLAB.x + 8} y={-(G + 11)} width={26} height={2.6} rx={1.3} className={body.base} />
          <rect x={SLAB.x + 8} y={-(G + 6.6)} width={18} height={2.2} rx={1.1} className={body.base} />
          <rect x={PLATE.x - 1} y={-(G + PLATE.lift + PLATE.h + 1)} width={PLATE.w + 2} height={PLATE.h + 2} rx={1.5} className={body.ink} />
        </g>
        {/* The slot in the desk under the plate */}
        <g transform={onTop(G)}>
          <rect x={PLATE.x - 1} y={FACE_Y} width={PLATE.w + 2} height={PLATE.t + 1} rx={1} className={body.ink} />
          <rect x={PLATE.x - 1} y={FACE_Y} width={PLATE.w + 2} height={PLATE.t + 1} rx={1} className={body.ink} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          {/* The badge the page came with */}
          <g className="isometric244-brand">
            <Block faces={box(PLATE.x, FACE_Y, G + PLATE.lift, PLATE.w, PLATE.t, PLATE.h)} paint={body} />
            <g transform={onLeft(FACE_Y + PLATE.t)}>
              <circle cx={PLATE.x + 6} cy={-(G + PLATE.lift + PLATE.h / 2)} r={2.2} className={body.ink} />
              <rect x={PLATE.x + 11} y={-(G + PLATE.lift + PLATE.h / 2 + 1.2)} width={16} height={2.4} rx={1.2} className={body.ink} />
            </g>
          </g>
          {/* The plate with your own mark */}
          <g className="isometric244-custom">
            <Block faces={box(PLATE.x, FACE_Y, G + PLATE.lift, PLATE.w, PLATE.t, PLATE.h)} paint={mine} />
            <g transform={onLeft(FACE_Y + PLATE.t)}>
              <rect x={PLATE.x + 4} y={-(G + PLATE.lift + PLATE.h / 2 + 2.4)} width={4.8} height={4.8} rx={1.4} className={mine.ink} />
              <rect x={PLATE.x + 11.5} y={-(G + PLATE.lift + PLATE.h / 2 + 1.3)} width={15} height={2.6} rx={1.3} className={mine.ink} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
