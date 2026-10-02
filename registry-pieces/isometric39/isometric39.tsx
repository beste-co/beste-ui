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

interface Isometric39Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the new leaf with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric39Demo: Isometric39Props = {
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

const RIM = 35;
const SOIL = 33;
type Vec = [number, number, number];
const screen = ([x, y, z]: Vec) => [(x - y) * C, (x + y) * S - z] as const;
/** A CSS/SVG matrix that draws local (u, v) onto the plane through o spanned by a and b. */
function frame(o: Vec, a: Vec, b: Vec) {
  const [e, f] = screen(o);
  const [m0, m1] = screen(a);
  const [m2, m3] = screen(b);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(", ")})`;
}
/** A sword-shaped blade standing on (0, 0) in its own plane: narrow foot, widest low down, a long taper to a tip that bends by dx. */
const blade = (w: number, h: number, dx: number) =>
  `M${-0.34 * w} 0 C${-0.62 * w} ${-0.3 * h} ${-0.48 * w + dx * 0.3} ${-0.76 * h} ${dx} ${-h} C${0.48 * w + dx * 0.65} ${-0.76 * h} ${0.62 * w} ${-0.3 * h} ${0.34 * w} 0 Z`;
const crease = (h: number, dx: number) => `M0 -3 Q${dx * 0.2} ${-h * 0.5} ${dx * 0.92} ${-h + 5}`;
/** Faint cross bands, each a shallow arc that stays inside the blade. */
const bands = (w: number, h: number, dx: number) =>
  Array.from({ length: 6 }, (_, index) => {
    const t = 0.14 + index * 0.115;
    const half = 0.4 * w * (1 - t ** 1.8);
    const mid = dx * t * t * 0.7;
    return `M${(mid - half).toFixed(1)} ${(-h * t).toFixed(1)} Q${mid.toFixed(1)} ${(-h * t - 2.4).toFixed(1)} ${(mid + half).toFixed(1)} ${(-h * t).toFixed(1)}`;
  }).join(" ");
// Each blade stands out from the pot's axis at a plan angle, faces outward and leans a little the same way
const SPECS = [
  { angle: 225, out: 7, w: 11, h: 74, dx: -4, lean: 0.1, sway: 1 },
  { angle: 188, out: 9, w: 10, h: 62, dx: 5, lean: 0.2 },
  { angle: 262, out: 9, w: 10, h: 66, dx: -5, lean: 0.2 },
  { angle: 158, out: 10, w: 10, h: 50, dx: 4, lean: 0.26, sway: 2 },
  { angle: 292, out: 10, w: 10, h: 54, dx: -4, lean: 0.26 },
  { angle: 104, out: 10, w: 10, h: 40, dx: 3, lean: 0.3 },
  { angle: 350, out: 10, w: 10, h: 44, dx: -3, lean: 0.3, sway: 3 },
  { angle: 45, out: 11, w: 9, h: 30, dx: 2, lean: 0.34 },
];
const NEW_SPEC = { angle: 62, out: 2, w: 11, h: 68, dx: 3, lean: 0.06 };
const THICK = 1.4;
function place(spec: (typeof SPECS)[number] | typeof NEW_SPEC) {
  const turn = (spec.angle * Math.PI) / 180;
  const out: [number, number] = [Math.cos(turn), Math.sin(turn)];
  const foot: Vec = [out[0] * spec.out, out[1] * spec.out, SOIL];
  const across: Vec = [-out[1], out[0], 0];
  const down: Vec = [-out[0] * spec.lean, -out[1] * spec.lean, -1];
  // The outer face shows when the blade faces the viewer; otherwise we look at its back
  const facing = out[0] + out[1] > 0;
  const behind = facing ? -THICK : THICK;
  return {
    ...spec,
    depth: foot[0] + foot[1],
    facing,
    toRight: out[0] > out[1],
    face: frame(foot, across, down),
    back: frame([foot[0] + out[0] * behind, foot[1] + out[1] * behind, SOIL], across, down),
  };
}
const BLADES = SPECS.map(place).sort((a, b) => a.depth - b.depth);
const NEW = place(NEW_SPEC);
const STYLES = `
@keyframes isometric39-grow { 0%, 8% { transform: translateY(${NEW.h + 2}px); opacity: 1; } 50%, 84% { transform: translateY(0); opacity: 1; } 94% { transform: translateY(0); opacity: 0; } 100% { transform: translateY(${NEW.h + 2}px); opacity: 0; } }
@keyframes isometric39-unfurl { 0%, 40% { transform: rotate(-3deg); } 58%, 100% { transform: rotate(0deg); } }
@keyframes isometric39-sway { 0%, 100% { transform: rotate(-1deg); } 50% { transform: rotate(1.2deg); } }
.isometric39-leaf { animation: isometric39-grow 6s cubic-bezier(0.3, 0, 0.2, 1) infinite; will-change: transform, opacity; }
.isometric39-unfurl { animation: isometric39-unfurl 6s ease-in-out infinite; }
.isometric39-sway1 { animation: isometric39-sway 5s ease-in-out infinite; }
.isometric39-sway2 { animation: isometric39-sway 6.2s ease-in-out -2s infinite; }
.isometric39-sway3 { animation: isometric39-sway 5.6s ease-in-out -3.4s infinite; }
.isometric39-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric39-leaf, .isometric39-unfurl, .isometric39-sway1, .isometric39-sway2, .isometric39-sway3 { animation: none; } }
`;

/** One blade: a darker back sheet for thickness, then the face with its crease and bands. */
function Blade({ item, paint, sway }: { item: ReturnType<typeof place>; paint: Paint; sway?: string }) {
  const line = paint.ink.replace("fill-", "stroke-");
  const outline = blade(item.w, item.h, item.dx);
  return (
    <g className={sway}>
      <g transform={item.back}>
        <path d={outline} className={paint.base} />
        <path d={outline} className={paint.right} />
        <path d={outline} className={paint.left} />
      </g>
      <g transform={item.face} className={paint.edge} strokeWidth={0.8} strokeLinejoin="round">
        <path d={outline} className={paint.base} />
        {(!item.facing || item.toRight) && <path d={outline} className={item.facing ? paint.left : paint.right} stroke="none" />}
        <path d={bands(item.w, item.h, item.dx)} fill="none" strokeWidth={0.7} strokeLinecap="round" className={line} />
        <path d={crease(item.h, item.dx)} fill="none" strokeWidth={0.9} strokeLinecap="round" className={line} />
      </g>
    </g>
  );
}

export function Isometric39({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric39Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const far = BLADES.filter((item) => item.depth < NEW.depth);
  const near = BLADES.filter((item) => item.depth >= NEW.depth);
  const blades = (items: typeof BLADES) => items.map((item) => <Blade key={item.angle} item={item} paint={body} sway={"sway" in item && item.sway ? `isometric39-sway${item.sway}` : undefined} />);
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric39-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-48 -130 96 154" aria-hidden="true" className="size-full overflow-visible">
        <Cylinder z={0} h={4} r={22} paint={body} />
        <Cylinder z={4} h={26} r={14} r2={19} paint={body} />
        <Cylinder z={30} h={5} r={21} paint={body} />
        <defs>
          <clipPath id={`${clipId}-mouth`}>
            <circle cx={0} cy={0} r={17.5} transform={onTop(RIM)} />
          </clipPath>
          <clipPath id={`${clipId}-soil`}>
            <rect x={-60} y={-200} width={120} height={200} />
          </clipPath>
        </defs>
        {/* Inside the rim: the inner wall, then the soil a little lower with a shadow under the far lip */}
        <g transform={onTop(RIM)}>
          <circle cx={0} cy={0} r={17.5} className={body.base} />
          <circle cx={0} cy={0} r={17.5} className={body.right} />
        </g>
        <g clipPath={`url(#${clipId}-mouth)`}>
          <g transform={onTop(SOIL)}>
            <circle cx={0} cy={0} r={18.5} className={body.ink} />
            <circle cx={0} cy={0} r={18.5} className={body.ink} />
            <circle cx={3} cy={3} r={17} className={body.base} />
            <circle cx={3} cy={3} r={17} className={body.ink} />
            <circle cx={3} cy={3} r={17} className={body.ink} />
          </g>
        </g>
        {blades(far)}
        <g className="isometric39-unfurl">
          <g transform={NEW.back} clipPath={`url(#${clipId}-soil)`}>
            <g className="isometric39-leaf">
              <path d={blade(NEW.w, NEW.h, NEW.dx)} className={paint.accent.base} />
              <path d={blade(NEW.w, NEW.h, NEW.dx)} className={paint.accent.right} />
            </g>
          </g>
          <g transform={NEW.face} clipPath={`url(#${clipId}-soil)`}>
            <g className="isometric39-leaf">
              <path d={blade(NEW.w, NEW.h, NEW.dx)} className={paint.accent.base} />
              <path d={bands(NEW.w, NEW.h, NEW.dx)} fill="none" strokeWidth={0.7} strokeLinecap="round" className={paint.accent.ink.replace("fill-", "stroke-")} />
              <path d={crease(NEW.h, NEW.dx)} fill="none" strokeWidth={0.9} strokeLinecap="round" className={paint.accent.ink.replace("fill-", "stroke-")} />
            </g>
          </g>
        </g>
        {blades(near)}
      </svg>
    </div>
  );
}
