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

interface Isometric37Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the lit shade with the tone and warm the lamplight; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric37Demo: Isometric37Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;
const at = (x: number, y: number, z = 0) => `translate(${project([x, y, z]).replace(",", " ")})`;

/** An upright cylinder around (x, y) in plan; r2 sets a different top radius for a taper. */
function Cylinder({ x = 0, y = 0, z, h, r, r2 = r, paint, lid = true }: { x?: number; y?: number; z: number; h: number; r: number; r2?: number; paint: Paint; lid?: boolean }) {
  const [bx, by, tx, ty] = [r * ELLIPSE_X, r * ELLIPSE_Y, r2 * ELLIPSE_X, r2 * ELLIPSE_Y].map((n) => +n.toFixed(2));
  const top = -z - h;
  const bottom = -z;
  const left = `M${-tx} ${top} L${-bx} ${bottom} A${bx} ${by} 0 0 0 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 1 ${-tx} ${top} Z`;
  const right = `M${tx} ${top} L${bx} ${bottom} A${bx} ${by} 0 0 1 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 0 ${tx} ${top} Z`;
  return (
    <g transform={at(x, y)} className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      {lid && <ellipse cx={0} cy={top} rx={tx} ry={ty} className={paint.base} />}
    </g>
  );
}

const FW = 112;
const FD = 88;
const F = 6;
const WALL = 4;
const WALL_H = 60;
const LAMP = { x: 96, y: 16 };
const SHADE_Z = 62;

const TOP = F + WALL_H;
const SOFA_END = 84;
// The outline of the whole room, used to dim everything while the lamp is off
const ROOM = polygon([[0, FD, 0], [FW, FD, 0], [FW, 0, 0], [FW, 0, TOP], [0, 0, TOP], [0, FD, TOP]]);
// Where the sofa blocks the lamp: its shadow runs across the floor away from the lamp toward the side wall
const SOFA_SHADOW = "84,36 77,49 4,52 4,10 20,10 20,36";
const SOFA_SIDE = polygon([[SOFA_END, 8, F], [SOFA_END, 36, F], [SOFA_END, 36, F + 22], [SOFA_END, 8, F + 22]]);
const SOFA_ARM = polygon([[76, 8, F + 22], [SOFA_END, 8, F + 22], [SOFA_END, 36, F + 22], [76, 36, F + 22]]);
const SOFA_SEAT = polygon([[52, 16, F + 16], [76, 16, F + 16], [76, 36, F + 16], [52, 36, F + 16]]);
const SOFA_BACK = polygon([[20, 8, F + 32], [SOFA_END, 8, F + 32], [SOFA_END, 16, F + 32], [20, 16, F + 32]]);

const STYLES = `
@keyframes isometric37-lamp { 0%, 30% { opacity: 0; } 33% { opacity: 1; } 35% { opacity: 0.3; } 38% { opacity: 0.8; } 46%, 84% { opacity: 1; } 92%, 100% { opacity: 0; } }
@keyframes isometric37-veil { 0%, 30% { opacity: 1; } 33% { opacity: 0.2; } 35% { opacity: 0.8; } 38% { opacity: 0.3; } 46%, 84% { opacity: 0; } 92%, 100% { opacity: 1; } }
.isometric37-light { animation: isometric37-lamp 6s ease-in-out infinite; }
.isometric37-veil { animation: isometric37-veil 6s ease-in-out infinite; }
.isometric37-still * { animation: none !important; }
.isometric37-still .isometric37-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric37-light, .isometric37-veil { animation: none; } .isometric37-rest { opacity: 1; } }
`;

export function Isometric37({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric37Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const id = useId();
  const lit = "isometric37-light isometric37-rest opacity-0";
  // Lamplight is warm whatever the tone; with the accent off it stays a plain brightening
  const glow = accentProp ? "text-amber-200" : "text-white";
  const warm = accentProp ? "fill-amber-200" : "fill-white";
  const fade = (stops: [number, number][]) => stops.map(([offset, opacity]) => <stop key={offset} offset={`${offset}%`} stopColor="currentColor" stopOpacity={opacity} className={glow} />);
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric37-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -70 182 174" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <radialGradient id={`${id}-floor`} gradientUnits="userSpaceOnUse" cx={LAMP.x} cy={LAMP.y + 6} r={92}>
            {fade([[0, 0.85], [22, 0.6], [60, 0.22], [100, 0.05]])}
          </radialGradient>
          <radialGradient id={`${id}-back`} gradientUnits="userSpaceOnUse" cx={LAMP.x} cy={-(SHADE_Z - 8)} r={78}>
            {fade([[0, 0.9], [25, 0.55], [65, 0.18], [100, 0.04]])}
          </radialGradient>
          <linearGradient id={`${id}-side`} gradientUnits="userSpaceOnUse" x1={WALL} y1={0} x2={FD} y2={0}>
            {fade([[0, 0.3], [100, 0.06]])}
          </linearGradient>
          <radialGradient id={`${id}-halo`}>{fade([[0, 0.7], [45, 0.3], [100, 0]])}</radialGradient>
        </defs>
        <Block faces={box(0, 0, 0, FW, FD, F)} paint={body} />
        <Block faces={box(0, 0, F, FW, WALL, WALL_H)} paint={body} />
        <Block faces={box(0, WALL, F, WALL, FD - WALL, WALL_H)} paint={body} />
        <g transform={onLeft(WALL)} className={body.ink}>
          <rect x={36} y={-F - 54} width={32} height={20} rx={1.5} />
        </g>
        <g transform={onRight(WALL)} className={body.ink}>
          <rect x={30} y={-F - 50} width={28} height={30} rx={1.5} />
          <rect x={16} y={-F - 50} width={10} height={30} rx={1.5} />
        </g>
        <g transform={onTop(F)}>
          <rect x={22} y={46} width={62} height={34} rx={4} className={body.ink} />
        </g>
        {/* Lamplight washes the walls and floor, strongest beside the lamp and fading across the room */}
        <g className={lit}>
          <rect x={WALL} y={-TOP} width={FW - WALL} height={WALL_H} transform={onLeft(WALL)} fill={`url(#${id}-back)`} />
          <rect x={WALL} y={-TOP} width={FD - WALL} height={WALL_H} transform={onRight(WALL)} fill={`url(#${id}-side)`} />
          <g transform={onTop(F)}>
            <rect x={WALL} y={WALL} width={FW - WALL} height={FD - WALL} fill={`url(#${id}-floor)`} />
            <polygon points={SOFA_SHADOW} className="fill-black/10" />
          </g>
        </g>
        <Block faces={box(20, 8, F, 64, 28, 12)} paint={body} />
        <Block faces={box(20, 8, F + 12, 64, 8, 20)} paint={body} />
        <Block faces={box(20, 8, F + 12, 8, 28, 10)} paint={body} />
        <Block faces={box(28, 16, F + 12, 24, 20, 4)} paint={body} />
        <Block faces={box(52, 16, F + 12, 24, 20, 4)} paint={body} />
        <Block faces={box(76, 8, F + 12, 8, 28, 10)} paint={body} />
        {/* The side of the sofa that faces the lamp catches the light */}
        <g className={lit}>
          <polygon points={SOFA_SIDE} className={cn(warm, "opacity-60")} />
          <polygon points={SOFA_ARM} className={cn(warm, "opacity-40")} />
          <polygon points={SOFA_SEAT} className={cn(warm, "opacity-20")} />
          <polygon points={SOFA_BACK} className={cn(warm, "opacity-30")} />
        </g>
        <Cylinder x={LAMP.x} y={LAMP.y} z={F} h={3} r={7} paint={body} />
        <Block faces={box(LAMP.x - 1, LAMP.y - 1, F + 3, 2, 2, SHADE_Z - F - 3)} paint={body} />
        <g transform={at(LAMP.x, LAMP.y, SHADE_Z + 8)} className={lit}>
          <circle r={30} fill={`url(#${id}-halo)`} />
        </g>
        <Cylinder x={LAMP.x} y={LAMP.y} z={SHADE_Z} h={16} r={13} r2={8} paint={body} />
        {/* Unlit, the whole room sits under a dim veil */}
        <polygon points={ROOM} className="isometric37-veil fill-slate-900/20 opacity-0" />
        <g className={lit}>
          <Cylinder x={LAMP.x} y={LAMP.y} z={SHADE_Z} h={16} r={13} r2={8} paint={paint.accent} />
          <g transform={at(LAMP.x, LAMP.y)}>
            <ellipse cy={-(SHADE_Z + 16)} rx={8 * ELLIPSE_X} ry={8 * ELLIPSE_Y} className={warm} />
            <path d={`M${-13 * ELLIPSE_X} ${-SHADE_Z}A${13 * ELLIPSE_X} ${13 * ELLIPSE_Y} 0 0 0 ${13 * ELLIPSE_X} ${-SHADE_Z}`} fill="none" strokeWidth={2} strokeLinecap="round" className={accentProp ? "stroke-amber-200" : "stroke-white"} />
          </g>
        </g>
      </svg>
    </div>
  );
}
