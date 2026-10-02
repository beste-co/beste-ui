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

interface Isometric44Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the plates of the rolling dumbbell with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric44Demo: Isometric44Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const L = 136;
const D = 56;
const RAIL = 30;
const PLATE = 15;
const SMALL = 12;
// The plates stand on the rails, so the handle's axis is one plate radius above them
const AXIS = RAIL + PLATE;
const BELLS = [24, 58];
const ROLLING = 100;
const LEGS = [8, L - 14];
// The front dumbbell rolls this far either way; its plates turn by distance / radius
const TRAVEL = 9;
const TURN = (TRAVEL / PLATE) * (180 / Math.PI);
const HOLES = [0, 90, 180, 270];

const STYLES = `
@keyframes isometric44-roll { 0%, 100% { transform: translate(${(-TRAVEL * C).toFixed(1)}px, ${(-TRAVEL * S).toFixed(1)}px); } 50% { transform: translate(${(TRAVEL * C).toFixed(1)}px, ${(TRAVEL * S).toFixed(1)}px); } }
@keyframes isometric44-spin { 0%, 100% { transform: rotate(${(-TURN).toFixed(1)}deg); } 50% { transform: rotate(${TURN.toFixed(1)}deg); } }
@keyframes isometric44-shade { 0%, 100% { transform: translateX(${-TRAVEL}px); } 50% { transform: translateX(${TRAVEL}px); } }
.isometric44-roll { animation: isometric44-roll 4.6s ease-in-out infinite; will-change: transform; }
.isometric44-spin { animation: isometric44-spin 4.6s ease-in-out infinite; }
.isometric44-shade { animation: isometric44-shade 4.6s ease-in-out infinite; }
.isometric44-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric44-roll, .isometric44-spin, .isometric44-shade { animation: none; } }
`;

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

/** A weight plate; neutral plates take an ink tint so they still read as iron. */
function Plate({ shape, paint, tint }: { shape: Rod; paint: Paint; tint?: string }) {
  return (
    <g>
      <RodBlock shape={shape} paint={paint} />
      {tint && <polygon points={shape.side} className={tint} />}
      {tint && <polygon points={shape.cap} className={tint} />}
    </g>
  );
}

function Dumbbell({ x, body, plates, tint, spin }: { x: number; body: Paint; plates: Paint; tint?: string; spin?: boolean }) {
  const grip: Paint = { ...body, base: body.ink, left: "fill-transparent", right: "fill-transparent", edge: "stroke-transparent" };
  return (
    <g>
      <Plate shape={rod("y", 3, 8, x, AXIS, SMALL)} paint={plates} tint={tint} />
      <Plate shape={rod("y", 8, 15, x, AXIS, PLATE)} paint={plates} tint={tint} />
      <RodBlock shape={rod("y", 15, 18, x, AXIS, 6)} paint={body} />
      <RodBlock shape={rod("y", 18, 38, x, AXIS, 3.5)} paint={body} />
      {[22, 25, 28, 31, 34].map((y) => (
        <RodBlock key={y} shape={rod("y", y, y + 1.2, x, AXIS, 3.7)} paint={grip} />
      ))}
      <RodBlock shape={rod("y", 38, 41, x, AXIS, 6)} paint={body} />
      <Plate shape={rod("y", 41, 48, x, AXIS, PLATE)} paint={plates} tint={tint} />
      <Plate shape={rod("y", 48, 53, x, AXIS, SMALL)} paint={plates} tint={tint} />
      {/* Bolt holes on the outer face turn with the plate */}
      <g transform={`${onLeft(53)} translate(${x} ${-AXIS})`}>
        <g className={spin ? "isometric44-spin" : undefined}>
          {HOLES.map((angle) => (
            <circle key={angle} cx={8 * Math.cos((angle * Math.PI) / 180)} cy={8 * Math.sin((angle * Math.PI) / 180)} r={1.5} className={plates.ink} />
          ))}
          <rect x={-1} y={-11} width={2} height={3.5} rx={1} className={plates.ink} />
        </g>
      </g>
      <RodBlock shape={rod("y", 53, 55, x, AXIS, 4)} paint={body} />
    </g>
  );
}

export function Isometric44({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric44Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric44-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -64 180 164" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, L, D, 8)} paint={paint.body} />
        {LEGS.map((x) => (
          <Block key={`back-${x}`} faces={box(x, 8, 8, 6, 6, RAIL - 14)} paint={paint.body} />
        ))}
        <Block faces={box(4, 6, RAIL - 6, L - 8, 10, 6)} paint={paint.body} />
        {LEGS.map((x) => (
          <Block key={`front-${x}`} faces={box(x, 42, 8, 6, 6, RAIL - 14)} paint={paint.body} />
        ))}
        <Block faces={box(4, 40, RAIL - 6, L - 8, 10, 6)} paint={paint.body} />
        <g transform={onTop(RAIL)}>
          <g className="isometric44-shade fill-black/15">
            <rect x={ROLLING - 6} y={8} width={14} height={7} rx={3.5} />
            <rect x={ROLLING - 6} y={41} width={14} height={7} rx={3.5} />
          </g>
        </g>
        {BELLS.map((x) => (
          <Dumbbell key={x} x={x} body={paint.body} plates={paint.body} tint={paint.body.ink} />
        ))}
        <g className="isometric44-roll">
          <Dumbbell x={ROLLING} body={paint.body} plates={paint.accent} tint={accent ? undefined : paint.body.ink} spin />
        </g>
      </svg>
    </div>
  );
}
