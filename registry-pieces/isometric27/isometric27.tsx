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

interface Isometric27Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the last cube to arrive with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric27Demo: Isometric27Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const N = 22;
const SIDE = 3 * N;
const MID = SIDE / 2;
const PERIOD = 10;

// A value that follows a turn: k + c * cos + s * sin
type Mix = [number, number, number];
type Vec = [Mix, Mix, Mix];
const fixed = (value: number): Mix => [value, 0, 0];
const plus = (a: Mix, b: Mix): Mix => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const times = (a: Mix, k: number): Mix => [a[0] * k, a[1] * k, a[2] * k];
/** A plan offset turned about the vertical axis. */
const turnZ = (x: number, y: number, z: number): Vec => [[0, x, -y], [0, y, x], fixed(z)];
/** An offset in the y-z plane rolled about the x axis, the top coming toward the viewer. */
const turnX = (x: number, y: number, z: number): Vec => [fixed(x), [0, y, z], [0, z, -y]];
const at = (center: [number, number, number], offset: Vec): Vec => [plus(fixed(center[0]), offset[0]), plus(fixed(center[1]), offset[1]), plus(fixed(center[2]), offset[2])];
const screenX = ([x, y]: Vec): Mix => times(plus(x, times(y, -1)), C);
const screenY = ([x, y, z]: Vec): Mix => plus(times(plus(x, y), S), times(z, -1));
const calc = (mix: Mix, name: string) => `calc(${mix[0].toFixed(4)} + ${mix[1].toFixed(4)} * var(--isometric27-${name}c) + ${mix[2].toFixed(4)} * var(--isometric27-${name}s))`;
/** The matrix that lays a face's local (u, v) onto the plane through origin spanned by a and b. */
const frame = (name: string, origin: Vec, a: Vec, b: Vec) =>
  `matrix(${[screenX(a), screenY(a), screenX(b), screenY(b), screenX(origin), screenY(origin)].map((mix) => calc(mix, name)).join(", ")})`;

// Top layer: turns about the vertical axis through the middle of the cube
const TOP_CENTER: [number, number, number] = [MID, MID, 0];
const topFace = (ox: number, oy: number, ax: number, ay: number, flat: boolean) =>
  frame("u", at(TOP_CENTER, turnZ(ox - MID, oy - MID, SIDE)), turnZ(ax, ay, 0), flat ? turnZ(-ay, ax, 0) : [fixed(0), fixed(0), fixed(-1)]);
// Middle slice: rolls about the x axis through the middle of the cube
const ROLL_CENTER: [number, number, number] = [0, MID, MID];
const rollFace = (x: number, oy: number, oz: number, a: Vec, b: Vec) => frame("m", at(ROLL_CENTER, turnX(x, oy - MID, oz - MID)), a, b);
const ALONG_X: Vec = [fixed(1), fixed(0), fixed(0)];
const FACES = {
  "u-top": topFace(0, 0, 1, 0, true),
  "u-py": topFace(0, SIDE, 1, 0, false),
  "u-px": topFace(SIDE, 0, 0, 1, false),
  "u-ny": topFace(SIDE, 0, -1, 0, false),
  "m-top": rollFace(N, 0, SIDE, ALONG_X, turnX(0, 1, 0)),
  "m-py": rollFace(N, SIDE, SIDE, ALONG_X, turnX(0, 0, -1)),
  "m-ny": rollFace(N, 0, 0, ALONG_X, turnX(0, 0, 1)),
  "m-px": rollFace(2 * N, 0, SIDE, turnX(0, 1, 0), turnX(0, 0, -1)),
};

const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const unease = (e: number) => (e < 0.5 ? Math.sqrt(e / 2) : 1 - Math.sqrt((1 - e) / 2));
type Stop = [number, number];
/** A quarter turn between two moments, in small steps with stops either side of 45 degrees where faces swap. */
const sweep = (from: number, to: number, start: number, end: number): Stop[] =>
  [...Array.from({ length: 13 }, (_, index) => index / 12), ...[44, 46].map((angle) => unease((angle - Math.min(from, to)) / 90))]
    .sort((a, b) => a - b)
    .map((k): Stop => [start + (end - start) * k, from + (to - from) * ease(k)]);
// Top layer turns out, the middle slice rolls, the top layer turns back, then a long rest
const U_TRACK: Stop[] = [[0, 0], ...sweep(0, 90, 8, 22), ...sweep(90, 0, 48, 62), [100, 0]];
const M_TRACK: Stop[] = [[0, 0], ...sweep(0, 90, 28, 42), [99.9, 90], [100, 0]];
const turn = (name: string, track: Stop[]) =>
  track.map(([moment, angle]) => `${moment.toFixed(2)}% { --isometric27-${name}c: ${Math.cos((angle * Math.PI) / 180).toFixed(4)}; --isometric27-${name}s: ${Math.sin((angle * Math.PI) / 180).toFixed(4)}; }`).join(" ");
/** Step keyframes that show something while the turn is on one side of 45 degrees. */
const side = (track: Stop[], early: boolean) =>
  track.map(([moment, angle], index) => `${moment.toFixed(2)}% { opacity: ${(angle < 45 && (track[index + 1]?.[1] ?? angle) <= 45) === early ? 1 : 0}; }`).join(" ");
/** Keyframes that fade a shade in (or out) as the turn goes from 0 to 90 degrees. */
const fade = (track: Stop[], rising: boolean) => track.map(([moment, angle]) => `${moment.toFixed(2)}% { opacity: ${(rising ? angle / 90 : 1 - angle / 90).toFixed(3)}; }`).join(" ");

const STYLES = `
${["uc", "mc"].map((name) => `@property --isometric27-${name} { syntax: "<number>"; inherits: true; initial-value: 1; }`).join("\n")}
${["us", "ms"].map((name) => `@property --isometric27-${name} { syntax: "<number>"; inherits: true; initial-value: 0; }`).join("\n")}
@keyframes isometric27-u { ${turn("u", U_TRACK)} }
@keyframes isometric27-m { ${turn("m", M_TRACK)} }
@keyframes isometric27-u-early { ${side(U_TRACK, true)} }
@keyframes isometric27-u-late { ${side(U_TRACK, false)} }
@keyframes isometric27-m-early { ${side(M_TRACK, true)} }
@keyframes isometric27-m-late { ${side(M_TRACK, false)} }
@keyframes isometric27-u-rise { ${fade(U_TRACK, true)} }
@keyframes isometric27-u-fall { ${fade(U_TRACK, false)} }
@keyframes isometric27-m-rise { ${fade(M_TRACK, true)} }
@keyframes isometric27-layers { 0% { opacity: 1; } 28% { opacity: 0; } 42%, 100% { opacity: 1; } }
@keyframes isometric27-slices { 0% { opacity: 0; } 28% { opacity: 1; } 42%, 100% { opacity: 0; } }
.isometric27-cube { animation: isometric27-u ${PERIOD}s linear infinite, isometric27-m ${PERIOD}s linear infinite; }
${Object.entries(FACES).map(([name, matrix]) => `.isometric27-${name} { transform: ${matrix}; }`).join("\n")}
.isometric27-u-early { animation: isometric27-u-early ${PERIOD}s step-end infinite; }
.isometric27-u-late { animation: isometric27-u-late ${PERIOD}s step-end infinite; }
.isometric27-m-early { animation: isometric27-m-early ${PERIOD}s step-end infinite; }
.isometric27-m-late { animation: isometric27-m-late ${PERIOD}s step-end infinite; }
.isometric27-u-rise { animation: isometric27-u-rise ${PERIOD}s linear infinite; }
.isometric27-u-fall { animation: isometric27-u-fall ${PERIOD}s linear infinite; }
.isometric27-m-rise { animation: isometric27-m-rise ${PERIOD}s linear infinite; }
.isometric27-layers { animation: isometric27-layers ${PERIOD}s step-end infinite; }
.isometric27-slices { animation: isometric27-slices ${PERIOD}s step-end infinite; }
.isometric27-still, .isometric27-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric27-cube, .isometric27-cube * { animation: none !important; } }
`;

type Shade = { side: "left" | "right"; className?: string };
/** One face of the cube as a grid of small cube faces, in its own flat units; `lit` cells belong to the colored cube. */
function Grid({ cols, rows, lit = [], body, trim, shades = [] }: { cols: number; rows: number; lit?: [number, number][]; body: Paint; trim: Paint; shades?: Shade[] }) {
  const cells = lit.map(([col, row]) => ({ key: `${col}-${row}`, x: col * N, y: row * N }));
  return (
    <g>
      <rect width={cols * N} height={rows * N} className={body.base} />
      {cells.map((cell) => (
        <rect key={cell.key} x={cell.x} y={cell.y} width={N} height={N} className={trim.base} />
      ))}
      {shades.map((shade) => (
        <g key={`${shade.side}-${shade.className ?? ""}`} className={shade.className}>
          <rect width={cols * N} height={rows * N} className={body[shade.side]} />
          {cells.map((cell) => (
            <rect key={cell.key} x={cell.x} y={cell.y} width={N} height={N} className={trim[shade.side]} />
          ))}
        </g>
      ))}
      <g fill="none" strokeWidth={1} strokeLinejoin="round" className={body.edge}>
        <rect width={cols * N} height={rows * N} />
        {Array.from({ length: cols - 1 }, (_, index) => (
          <line key={`c${index}`} x1={(index + 1) * N} y1={0} x2={(index + 1) * N} y2={rows * N} />
        ))}
        {Array.from({ length: rows - 1 }, (_, index) => (
          <line key={`r${index}`} x1={0} y1={(index + 1) * N} x2={cols * N} y2={(index + 1) * N} />
        ))}
      </g>
    </g>
  );
}

const LEFT: Shade[] = [{ side: "left" }];
const RIGHT: Shade[] = [{ side: "right" }];

export function Isometric27({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric27Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const shadowId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const trim = paint.accent;
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric27-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-100 -104 200 196" aria-hidden="true" className="isometric27-cube size-full overflow-visible">
        <defs>
          <radialGradient id={shadowId} className="text-foreground">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={0} cy={N * 1.5 + 4} rx={SIDE * C * 1.2} ry={SIDE * S * 1.2} fill={`url(#${shadowId})`} />
        {/* Split into layers: the lower two stay put while the top one turns, carrying the colored cube */}
        <g className="isometric27-layers">
          <g transform={`${onLeft(SIDE)} translate(0 ${-2 * N})`}>
            <Grid cols={3} rows={2} body={body} trim={trim} shades={LEFT} />
          </g>
          <g transform={`${onRight(SIDE)} translate(0 ${-2 * N})`}>
            <Grid cols={3} rows={2} body={body} trim={trim} shades={RIGHT} />
          </g>
          <g transform={onTop(2 * N)}>
            <Grid cols={3} rows={3} body={body} trim={trim} />
          </g>
          <g className="isometric27-u-ny isometric27-u-late opacity-0">
            <Grid cols={3} rows={1} body={body} trim={trim} shades={RIGHT} />
          </g>
          <g className="isometric27-u-py isometric27-u-early">
            <Grid cols={3} rows={1} lit={[[2, 0]]} body={body} trim={trim} shades={LEFT} />
          </g>
          <g className="isometric27-u-px">
            <Grid cols={3} rows={1} lit={[[2, 0]]} body={body} trim={trim} shades={[{ side: "right", className: "isometric27-u-fall" }, { side: "left", className: "isometric27-u-rise opacity-0" }]} />
          </g>
          <g className="isometric27-u-top">
            <Grid cols={3} rows={3} lit={[[2, 2]]} body={body} trim={trim} />
          </g>
        </g>
        {/* Split into upright slices: the middle one rolls while the colored cube waits on the far slice */}
        <g className="isometric27-slices opacity-0">
          <g transform={`${onLeft(SIDE)} translate(0 ${-SIDE})`}>
            <Grid cols={1} rows={3} lit={[[0, 0]]} body={body} trim={trim} shades={LEFT} />
          </g>
          <g transform={`${onRight(N)} translate(0 ${-SIDE})`}>
            <Grid cols={3} rows={3} lit={[[2, 0]]} body={body} trim={trim} shades={RIGHT} />
          </g>
          <g transform={onTop(SIDE)}>
            <Grid cols={1} rows={3} lit={[[0, 2]]} body={body} trim={trim} />
          </g>
          <g className="isometric27-m-ny isometric27-m-late opacity-0">
            <Grid cols={1} rows={3} body={body} trim={trim} />
          </g>
          <g className="isometric27-m-py isometric27-m-early">
            <Grid cols={1} rows={3} body={body} trim={trim} shades={LEFT} />
          </g>
          <g className="isometric27-m-top">
            <Grid cols={1} rows={3} body={body} trim={trim} shades={[{ side: "left", className: "isometric27-m-rise opacity-0" }]} />
          </g>
          <g className="isometric27-m-px">
            <Grid cols={3} rows={3} body={body} trim={trim} shades={RIGHT} />
          </g>
          <g transform={`${onLeft(SIDE)} translate(${2 * N} ${-SIDE})`}>
            <Grid cols={1} rows={3} body={body} trim={trim} shades={LEFT} />
          </g>
          <g transform={`${onRight(SIDE)} translate(0 ${-SIDE})`}>
            <Grid cols={3} rows={3} body={body} trim={trim} shades={RIGHT} />
          </g>
          <g transform={`${onTop(SIDE)} translate(${2 * N} 0)`}>
            <Grid cols={1} rows={3} body={body} trim={trim} />
          </g>
        </g>
      </svg>
    </div>
  );
}
