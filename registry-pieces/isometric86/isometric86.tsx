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

interface Isometric86Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the seat and backrest with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric86Demo: Isometric86Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const PIVOT = { x: 60, y: 44 };

/** A rounded box around the pivot, laid out in local (u, v) units and turned by `turn` degrees in plan. */
function turned(u: number, v: number, z: number, w: number, d: number, h: number, r: number, turn: number) {
  const corners: [number, number, number][] = [
    [u + w - r, v + r, -90],
    [u + w - r, v + d - r, 0],
    [u + r, v + d - r, 90],
    [u + r, v + r, 180],
  ];
  const cos = Math.cos((turn * Math.PI) / 180);
  const sin = Math.sin((turn * Math.PI) / 180);
  const place = (lu: number, lv: number): [number, number] => [PIVOT.x + lu * cos - lv * sin, PIVOT.y + lu * sin + lv * cos];
  // Rim points whose outward normal (in plan, after the turn) lies between two angles
  const rim = (from: number, to: number) => {
    const arcs: { lo: number; points: [number, number][] }[] = [];
    for (const [cu, cv, start] of corners) {
      const g0 = ((((start + turn + 180) % 360) + 360) % 360) - 180;
      const lo = Math.max(g0, from);
      const hi = Math.min(g0 + 90, to);
      if (lo > hi) continue;
      const points: [number, number][] = [];
      for (let k = 0; k <= 6; k++) {
        const local = ((lo + ((hi - lo) * k) / 6 - turn) * Math.PI) / 180;
        points.push(place(cu + r * Math.cos(local), cv + r * Math.sin(local)));
      }
      arcs.push({ lo, points });
    }
    return arcs.sort((a, b) => a.lo - b.lo).flatMap((arc) => arc.points);
  };
  const band = (points: [number, number][]) =>
    polygon([...points.map(([px, py]): Point => [px, py, z]), ...points.reverse().map(([px, py]): Point => [px, py, z + h])]);
  return {
    side: band(rim(-45, 135)),
    left: band(rim(45, 135)),
    right: band(rim(-45, 45)),
    top: { u, v, w, d, r, transform: `${onTop(z + h)} translate(${PIVOT.x} ${PIVOT.y}) rotate(${turn})` },
  };
}

function Turned({ shape, paint }: { shape: ReturnType<typeof turned>; paint: Paint }) {
  const { top } = shape;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.left} className={paint.left} stroke="none" />
      <polygon points={shape.right} className={paint.right} stroke="none" />
      <rect x={top.u} y={top.v} width={top.w} height={top.d} rx={top.r} transform={top.transform} vectorEffect="non-scaling-stroke" className={paint.base} />
    </g>
  );
}

const G = 8;
const FLOOR = box(0, 0, 0, 100, 88, G);
const WALL = box(0, 0, G, 6, 88, 80);
const COUNTER = box(6, 18, G + 30, 12, 52, 4);
// The chair rides its hydraulic column: one drawing, lifted and lowered as a whole
const LIFT = 7;
const STYLES = `
@keyframes isometric86-lift { 0%, 10% { transform: translateY(0); } 34%, 58% { transform: translateY(${-LIFT}px); } 82%, 100% { transform: translateY(0); } }
.isometric86-lift { animation: isometric86-lift 6s cubic-bezier(0.45, 0, 0.3, 1) infinite; will-change: transform; }
.isometric86-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric86-lift { animation: none; } }
`;
const K = 1.4;
// Chair parts in local units, scaled up around the pivot
const part = (u: number, v: number, z: number, w: number, d: number, h: number, r: number, turn: number) =>
  turned(u * K, v * K, G + z * K, w * K, d * K, h * K, r * K, turn);

function Chair({ body, seat }: { body: Paint; seat: Paint }) {
  return (
    <>
      <Turned shape={part(-22, -9, 10, 4, 18, 3, 1.5, 0)} paint={body} />
      <Turned shape={part(-20, -3, 10, 4, 6, 14, 1.5, 0)} paint={body} />
      <Turned shape={part(-16, -16, 18, 32, 32, 4, 5, 0)} paint={body} />
      <Turned shape={part(-15, -14, 22, 28, 28, 6, 6, 0)} paint={seat} />
      <Turned shape={part(-12, -20, 31, 26, 5, 4, 2.5, 0)} paint={body} />
      <Turned shape={part(11, -15, 22, 7, 30, 32, 3.5, 0)} paint={seat} />
      <Turned shape={part(12, -7, 56, 5, 14, 8, 2.5, 0)} paint={body} />
      <Turned shape={part(-12, 15, 31, 26, 5, 4, 2.5, 0)} paint={body} />
    </>
  );
}
export function Isometric86({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric86Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const shine = palette === "tone" ? "fill-white/40" : paint.body.base;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric86-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-82 -92 172 186" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={FLOOR} paint={paint.body} />
        <Block faces={WALL} paint={paint.body} />
        <g transform={onRight(6)}>
          <path d={`M22 ${-(G + 38)}V${-(G + 54)}A22 22 0 0 1 66 ${-(G + 54)}V${-(G + 38)}Z`} className={paint.body.ink} />
          <path d={`M30 ${-(G + 46)}L44 ${-(G + 66)}L48 ${-(G + 62)}L34 ${-(G + 42)}Z`} className={shine} />
          <path d={`M38 ${-(G + 46)}L48 ${-(G + 60)}L50 ${-(G + 57)}L40 ${-(G + 43)}Z`} className={shine} />
        </g>
        <Block faces={COUNTER} paint={paint.body} />
        <Turned shape={turned(-22, -22, G, 44, 44, 3, 22, 0)} paint={paint.body} />
        {/* The column is tall enough to stay inside the seat base at full lift */}
        <Turned shape={part(-4, -4, 2, 8, 8, 22, 4, 0)} paint={paint.body} />
        <g className="isometric86-lift">
          <Chair body={paint.body} seat={paint.accent} />
        </g>
      </svg>
    </div>
  );
}
