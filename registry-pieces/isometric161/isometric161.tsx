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

interface Isometric161Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color one garment on the rail with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric161Demo: Isometric161Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const FOOT = 6;
const W = 80;
const D = 36;
const TOP = FOOT + 104;
const THICK = 3;
const DOOR_W = W / 2;
const Z0 = FOOT + 2;
const Z1 = TOP - 2;
const DOOR_H = Z1 - Z0;
// The cavity behind the doors, open toward +y
const X0 = 4;
const X1 = W - 4;
const BACK = 5;
const FLOOR = FOOT + 5;
const CEIL = TOP - 5;
const RAIL = CEIL - 10;
const PERIOD = 7;
const GARMENTS = [
  { x: 11, h: 42, accent: false },
  { x: 24, h: 54, accent: false },
  { x: 37, h: 46, accent: false },
  { x: 50, h: 58, accent: true },
  { x: 63, h: 44, accent: false },
];

type Vec = [number, number, number];
type Stop = [number, number];
const screen = ([x, y, z]: Vec) => [(x - y) * C, (x + y) * S - z] as const;
/** A CSS/SVG matrix that draws local (u, v) onto the plane through o spanned by a and b. */
function frame(o: Vec, a: Vec, b: Vec) {
  const [e, f] = screen(o);
  const [m0, m1] = screen(a);
  const [m2, m3] = screen(b);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(", ")})`;
}
const DOWN: Vec = [0, 0, -1];
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const unease = (r: number) => (r < 0.5 ? Math.sqrt(r / 2) : 1 - Math.sqrt((1 - r) / 2));
/** [percent, angle] stops of a swing that opens over t0..t1 and closes over t2..t3, with extra stops 2 degrees either side of each mark. */
function swingStops(open: number, [t0, t1, t2, t3]: [number, number, number, number], marks: number[]): Stop[] {
  const near = marks.flatMap((mark) => [unease((mark - 2) / open), unease((mark + 2) / open)]);
  const ks = [...Array.from({ length: 9 }, (_, index) => (index + 1) / 10), ...near, ...near.map((k) => 1 - k)].sort((a, b) => a - b);
  return [
    [0, 0],
    [t0, 0],
    ...ks.map((k): Stop => [t0 + k * (t1 - t0), open * ease(k)]),
    [t1, open],
    [t2, open],
    ...ks.map((k): Stop => [t2 + k * (t3 - t2), open * (1 - ease(k))]),
    [t3, 0],
    [100, 0],
  ];
}
/** The faces of a door hinged on a front corner at a swing angle in degrees; dir -1 mirrors it for the right door. */
function doorFrames(hingeX: number, dir: 1 | -1, angle: number) {
  const t = (angle * Math.PI) / 180;
  const along: Vec = [dir * Math.cos(t), Math.sin(t), 0];
  const out: Vec = [-dir * Math.sin(t), Math.cos(t), 0];
  const at = (u: number, n: number): Vec => [hingeX + along[0] * u + out[0] * n, D + along[1] * u + out[1] * n, Z1];
  return {
    outer: frame(at(0, THICK), along, DOWN),
    inner: frame(at(0, 0), along, DOWN),
    free: frame(at(DOOR_W, 0), out, DOWN),
    hinge: frame(at(0, 0), out, DOWN),
    top: frame(at(0, 0), along, out),
  };
}
type Face = keyof ReturnType<typeof doorFrames>;
const LEFT_CLOSED = doorFrames(0, 1, 0);
const RIGHT_CLOSED = doorFrames(W, -1, 0);
// The left door stops just past square, the right one folds back wide so it never hides the rail
const LEFT_STOPS = swingStops(100, [8, 26, 72, 90], [45]);
const RIGHT_STOPS = swingStops(160, [14, 38, 62, 86], [45, 135]);
const n = (value: number) => value.toFixed(4);
/** One door's CSS: the swing animates only cos and sin, and every face derives its matrix from them, so shared edges cannot drift apart. */
function doorCss(id: "l" | "r", hingeX: number, dir: 1 | -1, stops: Stop[], ranges: Partial<Record<Face, [number, number]>>) {
  const name = `isometric161-${id}`;
  const c = `var(--${name}c)`;
  const s = `var(--${name}s)`;
  const [e, f] = screen([hingeX, D, Z1]);
  const ax = `${n(C * dir)} * ${c} - ${n(C)} * ${s}`;
  const ay = `${n(S * dir)} * ${c} + ${n(S)} * ${s}`;
  const ox = `${n(-C * dir)} * ${s} - ${n(C)} * ${c}`;
  const oy = `${n(-S * dir)} * ${s} + ${n(S)} * ${c}`;
  const matrix = (m0: string, m1: string, m2: string, m3: string, tx: string, ty: string) => `matrix(calc(${m0}), calc(${m1}), ${m2}, ${m3}, calc(${tx}), calc(${ty}))`;
  const faces: Record<Face, string> = {
    outer: matrix(ax, ay, "0", "1", `${n(e)} + ${THICK} * (${ox})`, `${n(f)} + ${THICK} * (${oy})`),
    inner: matrix(ax, ay, "0", "1", n(e), n(f)),
    free: matrix(ox, oy, "0", "1", `${n(e)} + ${DOOR_W} * (${ax})`, `${n(f)} + ${DOOR_W} * (${ay})`),
    hinge: matrix(ox, oy, "0", "1", n(e), n(f)),
    top: matrix(ax, ay, `calc(${ox})`, `calc(${oy})`, n(e), n(f)),
  };
  const turn = stops.map(([p, a]) => `${p.toFixed(2)}% { --${name}c: ${n(Math.cos((a * Math.PI) / 180))}; --${name}s: ${n(Math.sin((a * Math.PI) / 180))}; }`).join(" ");
  const rules = (Object.keys(faces) as Face[]).map((face) => {
    const range = ranges[face];
    if (!range) return `.${name}-${face} { transform: ${faces[face]}; }`;
    const seen = (a: number) => a >= range[0] - 0.01 && a <= range[1] + 0.01;
    const show = stops.map(([p, a], index) => `${p.toFixed(2)}% { opacity: ${seen(a) && seen(stops[index + 1]?.[1] ?? a) ? 1 : 0}; }`).join(" ");
    return `@keyframes ${name}-${face}-show { ${show} }\n.${name}-${face} { transform: ${faces[face]}; animation: ${name}-${face}-show ${PERIOD}s step-end infinite; }`;
  });
  return `@property --${name}c { syntax: "<number>"; inherits: true; initial-value: 1; }
@property --${name}s { syntax: "<number>"; inherits: true; initial-value: 0; }
@keyframes ${name} { ${turn} }
.${name} { animation: ${name} ${PERIOD}s linear infinite; }
${rules.join("\n")}`;
}

const STYLES = `
${doorCss("l", 0, 1, LEFT_STOPS, { outer: [0, 43], inner: [47, 360] })}
${doorCss("r", W, -1, RIGHT_STOPS, { hinge: [0, 43], free: [47, 360], outer: [0, 133], inner: [137, 360] })}
.isometric161-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric161-door, .isometric161-door * { animation: none !important; } }
`;

const HOLE = polygon([[X0, D, FLOOR], [X1, D, FLOOR], [X1, D, CEIL], [X0, D, CEIL]]);
const BACK_WALL = polygon([[X0, BACK, FLOOR], [X1, BACK, FLOOR], [X1, BACK, CEIL], [X0, BACK, CEIL]]);
const SIDE_WALL = polygon([[X0, BACK, FLOOR], [X0, D, FLOOR], [X0, D, CEIL], [X0, BACK, CEIL]]);
const FLOOR_FACE = polygon([[X0, BACK, FLOOR], [X1, BACK, FLOOR], [X1, D, FLOOR], [X0, D, FLOOR]]);

export function Isometric161({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric161Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const line = palette === "tone" ? "stroke-white/30" : "stroke-black/10";

  const face = (shade: string) => (
    <>
      <rect width={DOOR_W} height={DOOR_H} vectorEffect="non-scaling-stroke" className={body.base} />
      <rect width={DOOR_W} height={DOOR_H} className={shade} stroke="none" />
    </>
  );
  const strip = (shade: string) => (
    <>
      <rect width={THICK} height={DOOR_H} vectorEffect="non-scaling-stroke" className={body.base} />
      <rect width={THICK} height={DOOR_H} className={shade} stroke="none" />
    </>
  );
  const front = (
    <>
      {face(body.left)}
      <rect x={5} y={5} width={DOOR_W - 10} height={DOOR_H - 10} rx={2} fill="none" strokeWidth={1.5} vectorEffect="non-scaling-stroke" className={line} />
      <rect x={DOOR_W - 7} y={DOOR_H / 2 - 9} width={3} height={18} rx={1.5} className={body.ink} stroke="none" />
    </>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric161-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -116 156 198" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={HOLE} />
          </clipPath>
        </defs>
        {[[4, 4], [W - 12, 4], [4, D - 12], [W - 12, D - 12]].map(([x = 0, y = 0]) => (
          <Block key={`${x}-${y}`} faces={box(x, y, 0, 8, 8, FOOT)} paint={body} />
        ))}
        <Block faces={box(0, 0, FOOT, W, D, TOP - FOOT)} paint={body} />
        <Block faces={box(46, 7, TOP, 24, 20, 9)} paint={body} />
        <Block faces={box(45, 6, TOP + 9, 26, 22, 3)} paint={body} />
        <g clipPath={`url(#${clipId})`}>
          <polygon points={BACK_WALL} className={body.base} />
          <polygon points={BACK_WALL} className={body.right} />
          <polygon points={BACK_WALL} className={body.ink} />
          <polygon points={SIDE_WALL} className={body.base} />
          <polygon points={SIDE_WALL} className={body.right} />
          <polygon points={FLOOR_FACE} className={body.base} />
          <polygon points={FLOOR_FACE} className={body.left} />
          <Block faces={box(9, 10, FLOOR, 24, 18, 9)} paint={body} />
          <Block faces={box(12, 12, FLOOR + 9, 18, 14, 6)} paint={body} />
          <Block faces={box(42, 10, FLOOR, 20, 18, 7)} paint={body} />
          {GARMENTS.map((garment) => (
            <g key={garment.x}>
              <Block faces={box(garment.x, 9, RAIL - 4 - garment.h, 3, 22, garment.h)} paint={garment.accent ? paint.accent : body} />
              <Block faces={box(garment.x + 1, 19, RAIL - 4, 1, 2, 4)} paint={body} />
            </g>
          ))}
          <Block faces={box(X0, 19, RAIL, X1 - X0, 2, 2)} paint={body} />
        </g>
        <g className={cn("isometric161-door isometric161-l", body.edge)} strokeWidth={1} strokeLinejoin="round">
          <g className="isometric161-l-top" transform={LEFT_CLOSED.top}>
            <rect width={DOOR_W} height={THICK} vectorEffect="non-scaling-stroke" className={body.base} />
          </g>
          <g className="isometric161-l-inner opacity-0" transform={LEFT_CLOSED.inner}>
            {face(body.right)}
            <rect x={7} y={10} width={DOOR_W - 14} height={52} rx={2} className={body.ink} stroke="none" />
            <rect x={11} y={14} width={3} height={20} rx={1.5} className={body.ink} stroke="none" />
          </g>
          <g className="isometric161-l-free" transform={LEFT_CLOSED.free}>
            {strip(body.right)}
          </g>
          <g className="isometric161-l-outer" transform={LEFT_CLOSED.outer}>
            {front}
          </g>
        </g>
        <g className={cn("isometric161-door isometric161-r", body.edge)} strokeWidth={1} strokeLinejoin="round">
          <g className="isometric161-r-top" transform={RIGHT_CLOSED.top}>
            <rect width={DOOR_W} height={THICK} vectorEffect="non-scaling-stroke" className={body.base} />
          </g>
          <g className="isometric161-r-hinge" transform={RIGHT_CLOSED.hinge}>
            {strip(body.right)}
          </g>
          <g className="isometric161-r-inner opacity-0" transform={RIGHT_CLOSED.inner}>
            {face(body.left)}
            <rect x={5} y={5} width={DOOR_W - 10} height={DOOR_H - 10} rx={2} fill="none" strokeWidth={1.5} vectorEffect="non-scaling-stroke" className={line} />
            {[14, 20, 26].map((x) => (
              <circle key={x} cx={x} cy={16} r={1.5} className={body.ink} stroke="none" />
            ))}
          </g>
          <g className="isometric161-r-free opacity-0" transform={RIGHT_CLOSED.free}>
            {strip(body.right)}
          </g>
          <g className="isometric161-r-outer" transform={RIGHT_CLOSED.outer}>
            {front}
          </g>
        </g>
      </svg>
    </div>
  );
}
