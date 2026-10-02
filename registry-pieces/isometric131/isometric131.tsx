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

interface Isometric131Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the tape with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric131Demo: Isometric131Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const BASE = 6;
const LOW = 30;
const TOP = { x: 20, y: 24, z: BASE + LOW, w: 52, d: 42, h: 30 };
const LID = TOP.z + TOP.h;
const SEAM = TOP.y + TOP.d / 2;
const TAPE = 8;
const ROLL = 7;
const START = TOP.x + 8;
const EDGE = TOP.x + TOP.w;
const DROP = 12;
const FROM = (START - TOP.x) / TOP.w;

// The roll rests where it ends: hanging on the side face at the bottom of the strip it laid
const REST = { x: EDGE + ROLL, z: LID - DROP };
/** Screen offset that puts the center of the roll at (x, z). */
const place = (x: number, z: number) => `translate(${((x - REST.x) * C).toFixed(1)}px, ${((x - REST.x) * S - (z - REST.z)).toFixed(1)}px)`;
// Around the top edge the roll turns about the corner, staying in touch with the box
const CORNER = [22.5, 45, 67.5].map((degrees, index) => {
  const angle = (degrees * Math.PI) / 180;
  return `${47.5 + index * 1.5}% { transform: ${place(EDGE + ROLL * Math.sin(angle), LID + ROLL * Math.cos(angle))}; animation-timing-function: linear; }`;
});
const STYLES = `
@keyframes isometric131-roll { 0% { transform: ${place(START, LID + ROLL)}; opacity: 0; } 6% { transform: ${place(START, LID + ROLL)}; opacity: 1; } 46% { transform: ${place(EDGE, LID + ROLL)}; animation-timing-function: linear; } ${CORNER.join(" ")} 52% { transform: ${place(EDGE + ROLL, LID)}; animation-timing-function: linear; } 62%, 84% { transform: translate(0, 0); opacity: 1; } 94%, 100% { transform: translate(0, 0); opacity: 0; } }
@keyframes isometric131-run { 0%, 6% { transform: scaleX(${FROM.toFixed(3)}); opacity: 1; } 46%, 84% { transform: scaleX(1); opacity: 1; } 94%, 100% { transform: scaleX(1); opacity: 0; } }
@keyframes isometric131-fold { 0%, 52% { transform: scaleY(0); opacity: 1; } 62%, 84% { transform: scaleY(1); opacity: 1; } 94%, 100% { transform: scaleY(1); opacity: 0; } }
.isometric131-roll { animation: isometric131-roll 6s cubic-bezier(0.45, 0, 0.55, 1) infinite; will-change: transform, opacity; }
.isometric131-run { transform-box: fill-box; transform-origin: left center; animation: isometric131-run 6s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.isometric131-fold { transform-box: fill-box; transform-origin: center top; animation: isometric131-fold 6s linear infinite; }
.isometric131-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric131-roll, .isometric131-run, .isometric131-fold { animation: none; } }
`;

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

/** Flat arrows that mark the side to keep up, drawn in the face's own (u, -z) units. */
function Arrows({ u, z, className }: { u: number; z: number; className: string }) {
  return (
    <g className={className}>
      {[0, 7].map((offset) => (
        <path key={offset} d={`M${u + offset} ${-z}v-6h-2l3 -4 3 4h-2v6Z`} />
      ))}
    </g>
  );
}

export function Isometric131({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric131Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const tape = paint.accent;
  const crate = (x: number, y: number, w: number, d: number) => (
    <g key={`${x}-${y}`}>
      <Block faces={box(x, y, BASE, w, d, LOW)} paint={body} />
      <g transform={onTop(BASE + LOW)} className={body.ink}>
        <rect x={x} y={y + d / 2 - 3} width={w} height={6} />
      </g>
      <g transform={onLeft(y + d)} className={body.ink}>
        <rect x={x} y={-BASE - LOW} width={w} height={4} />
        <rect x={x + w - 18} y={-BASE - 18} width={12} height={8} rx={1} />
      </g>
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric131-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-78 -50 162 142" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, 92, 84, BASE)} paint={body} />
        {crate(6, 10, 42, 70)}
        {crate(50, 10, 36, 70)}
        <Block faces={box(TOP.x, TOP.y, TOP.z, TOP.w, TOP.d, TOP.h)} paint={body} />
        <g transform={onTop(LID)}>
          <rect x={TOP.x} y={SEAM - 0.5} width={TOP.w} height={1} className={body.ink} />
          <rect x={TOP.x} y={SEAM - TAPE / 2} width={TOP.w} height={TAPE} className={cn("isometric131-run", tape.base)} />
        </g>
        <g transform={onLeft(TOP.y + TOP.d)}>
          <Arrows u={TOP.x + 8} z={LID - 8} className={body.ink} />
          <rect x={TOP.x + 28} y={-LID + 8} width={18} height={10} rx={1} className={body.ink} />
        </g>
        <g transform={onRight(TOP.x + TOP.w)}>
          <g className="isometric131-fold">
            <rect x={SEAM - TAPE / 2} y={-LID} width={TAPE} height={DROP} className={tape.base} />
            <rect x={SEAM - TAPE / 2} y={-LID} width={TAPE} height={DROP} className={tape.right} />
          </g>
        </g>
        <g className="isometric131-roll">
          <RodBlock shape={rod("y", SEAM - TAPE / 2, SEAM + TAPE / 2, REST.x, REST.z, ROLL)} paint={tape} />
          <g transform={onLeft(SEAM + TAPE / 2)}>
            <circle cx={REST.x} cy={-REST.z} r={3.5} className={cn(body.base, body.edge)} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          </g>
        </g>
      </svg>
    </div>
  );
}
