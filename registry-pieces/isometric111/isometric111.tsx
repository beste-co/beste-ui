"use client";

import { useId } from "react";
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

interface Isometric111Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the notes in the drawer with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric111Demo: Isometric111Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;

/** An upright cylinder centered on the origin in plan, shaded in two halves like a box. */
function Cylinder({ r, z, h, paint }: { r: number; z: number; h: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const top = -z - h;
  const bottom = -z;
  const left = `M${-rx} ${top} L${-rx} ${bottom} A${rx} ${ry} 0 0 0 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 1 ${-rx} ${top} Z`;
  const right = `M${rx} ${top} L${rx} ${bottom} A${rx} ${ry} 0 0 1 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 0 ${rx} ${top} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      <ellipse cx={0} cy={top} rx={rx} ry={ry} className={paint.base} />
    </g>
  );
}

/** Draw flat onto any plane through o spanned by u and v; local (p, q) lands at o + p u + q v. */
function onPlane(o: Point, u: Point, v: Point) {
  const [ox, oy] = project(o).split(",");
  const m = (w: Point) => [((w[0] - w[1]) * C).toFixed(3), ((w[0] + w[1]) * S - w[2]).toFixed(3)].join(" ");
  return `matrix(${m(u)} ${m(v)} ${ox} ${oy})`;
}

const P = 6;
const W = 64;
const D = 48;
const LOW = 20;
const OUT = 24;
// The drawer is drawn open; the animation pushes it back in
const DRAWER = box(4, 4 + OUT, P + 2, W - 8, D - 4, 10);
const DZ = P + 12;
const SWEEP = polygon([[4, D, DZ], [W - 4, D, DZ], [W - 4, D, P + 2], [W - 4, D + OUT + 2, P + 2], [4, D + OUT + 2, P + 2], [4, D + OUT + 2, DZ]]);
const NOTES = [7, 21, 35];
const COINS = [D + 7, D + 15];
const BACK_Y = 20;
const FRONT_Z = 28;
const BACK_Z = 40;
const SLOPE = polygon([[0, D, FRONT_Z], [W, D, FRONT_Z], [W, BACK_Y, BACK_Z], [0, BACK_Y, BACK_Z]]);
const CHEEK = polygon([[W, BACK_Y, LOW], [W, D, LOW], [W, D, FRONT_Z], [W, BACK_Y, BACK_Z]]);
const RISE = Math.hypot(D - BACK_Y, BACK_Z - FRONT_Z);
const KEYS = onPlane([0, D, FRONT_Z], [1, 0, 0], [0, -(D - BACK_Y) / RISE, (BACK_Z - FRONT_Z) / RISE]);
const SHUT = `translate(${(OUT * C).toFixed(1)}px, ${-OUT * S}px)`;

const STYLES = `
@keyframes isometric111-drawer { 0%, 14% { transform: ${SHUT}; } 26% { transform: translate(-1px, 0.6px); } 30%, 80% { transform: translate(0, 0); } 92%, 100% { transform: ${SHUT}; } }
@keyframes isometric111-key { 0%, 6% { transform: translateY(0); } 9% { transform: translateY(1.5px); } 13%, 100% { transform: translateY(0); } }
.isometric111-drawer { animation: isometric111-drawer 5.2s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric111-key { animation: isometric111-key 5.2s ease-out infinite; }
.isometric111-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric111-drawer, .isometric111-key { animation: none; } }
`;

export function Isometric111({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric111Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric111-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -58 156 138" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={SWEEP} />
          </clipPath>
        </defs>
        <Block faces={box(-8, -8, 0, W + 16, D + OUT + 14, P)} paint={body} />
        <Block faces={box(0, 0, P, W, D, LOW - P)} paint={body} />
        <g transform={onLeft(D)} className={body.ink}>
          <rect x={4} y={-(P + 12)} width={W - 8} height={10} rx={1} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric111-drawer">
            <Block faces={DRAWER} paint={body} />
            <g transform={onTop(DZ)} className={body.ink}>
              <rect x={6} y={D + 2} width={41} height={OUT - 4} rx={1} />
          <rect x={49} y={D + 2} width={9} height={OUT - 4} rx={1} />
            </g>
            {NOTES.map((x) => (
              <g key={x}>
                <Block faces={box(x, D + 4, DZ, 11, 16, 2)} paint={paint.accent} />
                <g transform={onTop(DZ + 2)} className={paint.accent.ink}>
                  <circle cx={x + 5.5} cy={D + 12} r={2.5} />
                </g>
              </g>
            ))}
            {COINS.map((y, index) => (
              <g key={y} transform={`translate(${project([53.5, y, 0])})`}>
                <Cylinder r={3.5} z={DZ - 2} h={4 + index * 2} paint={body} />
              </g>
            ))}
            <g transform={onLeft(D + OUT)} className={body.ink}>
              <rect x={W / 2 - 8} y={-(P + 7)} width={16} height={3} rx={1.5} />
            </g>
          </g>
        </g>
        <Block faces={box(0, 0, LOW, W, BACK_Y, BACK_Z - LOW)} paint={body} />
        <Block faces={box(0, BACK_Y, LOW, W, D - BACK_Y, FRONT_Z - LOW)} paint={body} />
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={CHEEK} className={body.base} />
          <polygon points={CHEEK} className={body.right} stroke="none" />
          <polygon points={SLOPE} className={body.base} />
        </g>
        <g transform={KEYS} className={body.ink}>
          {[0, 1, 2, 3].flatMap((row) =>
            [0, 1, 2, 3, 4].map((col) => <rect key={`${row}-${col}`} x={8 + col * 8} y={3 + row * 6} width={6} height={4} rx={1} />),
          )}
          <rect x={50} y={3} width={8} height={10} rx={1} />
          <rect x={50} y={15} width={8} height={10} rx={1} />
        </g>
        <Block faces={box(30, 6, BACK_Z, 4, 4, 6)} paint={body} />
        <Block faces={box(18, 4, BACK_Z + 6, 28, 8, 16)} paint={body} />
        <g transform={onLeft(12)} className={body.ink}>
          <rect x={21} y={-(BACK_Z + 19)} width={22} height={10} rx={1} />
        </g>
      </svg>
    </div>
  );
}
