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

interface Isometric168Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the box on the pallet with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric168Demo: Isometric168Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

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

const G = 6;
const DECK = G + 22;
const ROOF = G + 56;
const MAST = { x: 60, h: 72 };
const LIFT = 34;
// Lowered, the pallet stands on the floor with the forks inside it
const FORK_Z = G + 3;
const PALLET_Z = FORK_Z + 2;
const PALLET = { x: 68, y: 22, w: 32, d: 36 };
const STRINGERS = [22, 38, 54];
const FORKS = [28, 47];
const WHEELS = [22, 50];

const STYLES = `
@keyframes isometric168-lift { 0%, 12% { transform: translateY(0); } 42%, 66% { transform: translateY(${-LIFT}px); } 94%, 100% { transform: translateY(0); } }
.isometric168-lift { animation: isometric168-lift 6s cubic-bezier(0.45, 0, 0.3, 1) infinite; will-change: transform; }
.isometric168-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric168-lift { animation: none; } }
`;

export function Isometric168({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric168Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const load = paint.accent;
  const [far = 0, middle = 0, near = 0] = STRINGERS;
  const [forkFar = 0, forkNear = 0] = FORKS;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric168-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-78 -52 198 164" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, 130, 80, G)} paint={body} />
        <g transform={onTop(G)} className={body.ink}>
          <rect x={66} y={14} width={38} height={3} rx={1.5} />
          <rect x={66} y={63} width={38} height={3} rx={1.5} />
        </g>
        <Block faces={box(8, 24, G + 8, 6, 32, 18)} paint={body} />
        <Block faces={box(14, 22, G + 5, 46, 36, 17)} paint={body} />
        <g transform={onLeft(58)} className={body.ink}>
          <rect x={30} y={-(DECK - 4)} width={12} height={3} rx={1.5} />
        </g>
        {WHEELS.map((x) => (
          <RodBlock key={x} shape={rod("y", 56, 62, x, G + 8, 8)} paint={body} />
        ))}
        <g transform={onLeft(62)} className={body.ink}>
          {WHEELS.map((x) => (
            <circle key={x} cx={x} cy={-(G + 8)} r={3.5} />
          ))}
        </g>
        <Block faces={box(16, 22, DECK, 2, 2, ROOF - DECK)} paint={body} />
        <Block faces={box(56, 22, DECK, 2, 2, ROOF - DECK)} paint={body} />
        <Block faces={box(22, 30, DECK, 4, 20, 19)} paint={body} />
        <Block faces={box(26, 30, DECK, 14, 20, 5)} paint={body} />
        <Block faces={box(48, 26, DECK, 8, 28, 9)} paint={body} />
        <Block faces={box(46, 39, DECK, 2, 2, 13)} paint={body} />
        <Block faces={box(44, 36, DECK + 13, 2, 8, 2)} paint={body} />
        <Block faces={box(16, 56, DECK, 2, 2, ROOF - DECK)} paint={body} />
        <Block faces={box(56, 56, DECK, 2, 2, ROOF - DECK)} paint={body} />
        <Block faces={box(14, 20, ROOF, 46, 40, 3)} paint={body} />
        <Block faces={box(MAST.x, 26, G + 2, 4, 28, 4)} paint={body} />
        <Block faces={box(MAST.x, 26, G + 2, 4, 4, MAST.h)} paint={body} />
        <Block faces={box(MAST.x + 1, 39, G + 6, 2, 2, MAST.h - 8)} paint={body} />
        <Block faces={box(MAST.x, 50, G + 2, 4, 4, MAST.h)} paint={body} />
        <Block faces={box(MAST.x, 26, G + MAST.h - 2, 4, 28, 4)} paint={body} />
        <g className="isometric168-lift">
          <Block faces={box(64, 24, FORK_Z, 2, 32, 18)} paint={body} />
          <g transform={onRight(66)} className={body.ink}>
            <rect x={27} y={-(FORK_Z + 15)} width={26} height={2} rx={1} />
            <rect x={27} y={-(FORK_Z + 10)} width={26} height={2} rx={1} />
          </g>
          <Block faces={box(PALLET.x, far, PALLET_Z - 5, PALLET.w, 4, 5)} paint={body} />
          <Block faces={box(66, forkFar, FORK_Z, 36, 5, 2)} paint={body} />
          <Block faces={box(PALLET.x, middle, PALLET_Z - 5, PALLET.w, 4, 5)} paint={body} />
          <Block faces={box(66, forkNear, FORK_Z, 36, 5, 2)} paint={body} />
          <Block faces={box(PALLET.x, near, PALLET_Z - 5, PALLET.w, 4, 5)} paint={body} />
          <Block faces={box(PALLET.x, PALLET.y, PALLET_Z, PALLET.w, PALLET.d, 2)} paint={body} />
          <Block faces={box(72, 26, PALLET_Z + 2, 24, 28, 22)} paint={load} />
          <g transform={onTop(PALLET_Z + 24)} className={load.ink}>
            <rect x={72} y={38} width={24} height={4} />
          </g>
          <g transform={onRight(96)} className={load.ink}>
            <rect x={38} y={-(PALLET_Z + 24)} width={4} height={8} />
          </g>
          <g transform={onLeft(54)} className={load.ink}>
            <rect x={76} y={-(PALLET_Z + 12)} width={8} height={6} rx={1} />
          </g>
        </g>
      </svg>
    </div>
  );
}
