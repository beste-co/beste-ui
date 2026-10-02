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

interface Isometric50Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Light the slide with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric50Demo: Isometric50Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const TX = 46;
const TY = 26;
const STAGE = 40;
const ARM = 70;

const STYLES = `
@keyframes isometric50-light { 0%, 12% { opacity: 0; } 26%, 82% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes isometric50-glow { 0%, 20% { transform: scale(0.6); opacity: 0; } 36% { transform: scale(1); opacity: 1; } 60% { transform: scale(1.12); opacity: 0.6; } 82% { transform: scale(1); opacity: 1; } 94%, 100% { transform: scale(1); opacity: 0; } }
.isometric50-light { animation: isometric50-light 4.8s ease-in-out infinite both; }
.isometric50-glow { transform-box: fill-box; transform-origin: center; animation: isometric50-glow 4.8s ease-in-out infinite both; }
.isometric50-still * { animation: none !important; }
.isometric50-still .isometric50-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric50-light, .isometric50-glow { animation: none; } .isometric50-rest { opacity: 1; } }
`;

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

/** An upright cylinder standing on plan point (cx, cy). */
const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);
type Rod = ReturnType<typeof rod>;

/** A cylinder lying along the x or y axis from a0 to a1, its axis at (c, cz) across. */
function rod(axis: "x" | "y", a0: number, a1: number, c: number, cz: number, r: number) {
  const at = (a: number, deg: number): Point => {
    const t = (deg * Math.PI) / 180;
    const u = c + r * Math.cos(t);
    const v = cz + r * Math.sin(t);
    return axis === "x" ? [a, u, v] : [u, a, v];
  };
  const arc = (a: number, from: number, to: number) => Array.from({ length: 17 }, (_, k) => at(a, from + ((to - from) * k) / 16));
  const band = (from: number, to: number) => polygon([...arc(a0, from, to), ...arc(a1, to, from)]);
  return { axis, side: band(-45, 135), lower: band(-45, 45), cap: polygon(arc(a1, 0, 360).slice(0, -1)) };
}

/** Lying cylinder: the upper half reads as a top, the lower half and the end cap as the two sides. */
function RodBlock({ shape, paint }: { shape: Rod; paint: Paint }) {
  const x = shape.axis === "x";
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.lower} className={x ? paint.left : paint.right} stroke="none" />
      <polygon points={shape.cap} className={paint.base} />
      <polygon points={shape.cap} className={x ? paint.right : paint.left} stroke="none" />
    </g>
  );
}

export function Isometric50({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric50Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const lit = accent ? paint.accent : { ...paint.body, base: paint.body.ink };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric50-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-54 -92 124 160" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 76, 52, 10, 10)} paint={paint.body} />
        <Block faces={box(6, 16, 10, 16, 20, ARM - 10)} paint={paint.body} />
        <Block faces={box(22, 6, STAGE - 5, 44, 40, 5)} paint={paint.body} />
        <g transform={onTop(STAGE)}>
          <rect x={28} y={10} width={4} height={32} rx={2} className={paint.body.ink} />
          <rect x={TX - 20} y={TY - 12} width={40} height={24} rx={6} className={cn("isometric50-glow isometric50-rest opacity-0", accent ? paint.accent.base : paint.body.ink)} fillOpacity={0.3} />
        </g>
        <Block faces={box(TX - 15, TY - 8, STAGE, 30, 16, 2)} paint={paint.body} />
        <g className="isometric50-light isometric50-rest opacity-0">
          <Block faces={box(TX - 15, TY - 8, STAGE, 30, 16, 2)} paint={lit} />
        </g>
        <g transform={onTop(STAGE + 2)} className={paint.body.ink}>
          <circle cx={TX} cy={TY} r={3} />
        </g>
        <RodBlock shape={rod("y", 36, 42, 14, 52, 9)} paint={paint.body} />
        <RodBlock shape={rod("y", 42, 45, 14, 52, 5)} paint={paint.body} />
        <RoundBlock shape={cylinder(TX, TY, STAGE + 6, 6, 4)} paint={paint.body} />
        <RoundBlock shape={cylinder(TX, TY, STAGE + 12, ARM - STAGE - 12, 8)} paint={paint.body} />
        <Block faces={box(6, 16, ARM, 52, 20, 12)} paint={paint.body} />
        <RoundBlock shape={cylinder(TX, TY, ARM + 12, 24, 8)} paint={paint.body} />
        <RoundBlock shape={cylinder(TX, TY, ARM + 36, 10, 6)} paint={paint.body} />
        <g transform={onTop(ARM + 46)} className={paint.body.ink}>
          <circle cx={TX} cy={TY} r={3.5} />
        </g>
        <g transform={onLeft(36)} className={paint.body.ink}>
          <rect x={10} y={-ARM - 8} width={40} height={2} rx={1} />
        </g>
      </svg>
    </div>
  );
}
