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

interface Isometric164Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Glow the inside with the tone while it runs; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric164Demo: Isometric164Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const FOOT = 4;
const W = 92;
const D = 54;
const TOP = FOOT + 50;
const THICK = 4;
const DOOR_W = 64;
const Z0 = FOOT + 2;
const Z1 = TOP - 2;
const DOOR_H = Z1 - Z0;
// The cooking cavity behind the door, open toward +y
const X0 = 6;
const X1 = 58;
const BACK = 8;
const FLOOR = FOOT + 8;
const CEIL = TOP - 8;
const PLATE = { x: 32, y: 31, r: 17 };
const PERIOD = 8;
const OPEN = 95;
// Door opens 6..18%, shuts 30..42%, then the oven runs 46..88%
const RUN = [46, 88] as const;

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

/** The door faces at a swing angle in degrees, hinged on the front left corner. */
function doorFrames(angle: number) {
  const t = (angle * Math.PI) / 180;
  const along: Vec = [Math.cos(t), Math.sin(t), 0];
  const out: Vec = [-Math.sin(t), Math.cos(t), 0];
  const at = (u: number, n: number): Vec => [along[0] * u + out[0] * n, D + along[1] * u + out[1] * n, Z1];
  return {
    outer: frame(at(0, THICK), along, DOWN),
    inner: frame(at(0, 0), along, DOWN),
    free: frame(at(DOOR_W, 0), out, DOWN),
    top: frame(at(0, 0), along, out),
  };
}
type Face = keyof ReturnType<typeof doorFrames>;
const CLOSED = doorFrames(0);
const STOPS = swingStops(OPEN, [6, 18, 30, 42], [45]);
const n = (value: number) => value.toFixed(4);
/** The door's CSS: the swing animates only cos and sin, and every face derives its matrix from them, so shared edges cannot drift apart. */
function doorCss(ranges: Partial<Record<Face, [number, number]>>) {
  const name = "isometric164-door";
  const c = `var(--${name}-c)`;
  const s = `var(--${name}-s)`;
  const [e, f] = screen([0, D, Z1]);
  const ax = `${n(C)} * ${c} - ${n(C)} * ${s}`;
  const ay = `${n(S)} * ${c} + ${n(S)} * ${s}`;
  const ox = `${n(-C)} * ${s} - ${n(C)} * ${c}`;
  const oy = `${n(-S)} * ${s} + ${n(S)} * ${c}`;
  const matrix = (m0: string, m1: string, m2: string, m3: string, tx: string, ty: string) => `matrix(calc(${m0}), calc(${m1}), ${m2}, ${m3}, calc(${tx}), calc(${ty}))`;
  const faces: Record<Face, string> = {
    outer: matrix(ax, ay, "0", "1", `${n(e)} + ${THICK} * (${ox})`, `${n(f)} + ${THICK} * (${oy})`),
    inner: matrix(ax, ay, "0", "1", n(e), n(f)),
    free: matrix(ox, oy, "0", "1", `${n(e)} + ${DOOR_W} * (${ax})`, `${n(f)} + ${DOOR_W} * (${ay})`),
    top: matrix(ax, ay, `calc(${ox})`, `calc(${oy})`, n(e), n(f)),
  };
  const turn = STOPS.map(([p, a]) => `${p.toFixed(2)}% { --${name}-c: ${n(Math.cos((a * Math.PI) / 180))}; --${name}-s: ${n(Math.sin((a * Math.PI) / 180))}; }`).join(" ");
  const rules = (Object.keys(faces) as Face[]).map((face) => {
    const range = ranges[face];
    if (!range) return `.isometric164-${face} { transform: ${faces[face]}; }`;
    const seen = (a: number) => a >= range[0] - 0.01 && a <= range[1] + 0.01;
    const show = STOPS.map(([p, a], index) => `${p.toFixed(2)}% { opacity: ${seen(a) && seen(STOPS[index + 1]?.[1] ?? a) ? 1 : 0}; }`).join(" ");
    return `@keyframes isometric164-${face}-show { ${show} }\n.isometric164-${face} { transform: ${faces[face]}; animation: isometric164-${face}-show ${PERIOD}s step-end infinite; }`;
  });
  return `@property --${name}-c { syntax: "<number>"; inherits: true; initial-value: 1; }
@property --${name}-s { syntax: "<number>"; inherits: true; initial-value: 0; }
@keyframes ${name} { ${turn} }
.${name} { animation: ${name} ${PERIOD}s linear infinite; }
${rules.join("\n")}`;
}
const bar = (index: number) => {
  const off = RUN[0] + ((RUN[1] - RUN[0]) * (3 - index)) / 3;
  return `@keyframes isometric164-bar${index} { 0%, ${RUN[0]}% { opacity: 0; } ${RUN[0] + 0.1}%, ${off.toFixed(1)}% { opacity: 1; } ${(off + 0.1).toFixed(1)}%, 100% { opacity: 0; } }\n.isometric164-bar${index} { animation: isometric164-bar${index} ${PERIOD}s step-end infinite; }`;
};

const STYLES = `
${doorCss({ outer: [0, 43], inner: [47, 360] })}
@keyframes isometric164-glow { 0%, ${RUN[0]}% { opacity: 0; } ${RUN[0] + 3}%, ${RUN[1]}% { opacity: 1; } ${RUN[1] + 2}%, 100% { opacity: 0; } }
@keyframes isometric164-spin { 0%, ${RUN[0]}% { transform: rotate(0deg); } ${RUN[1]}%, 100% { transform: rotate(720deg); } }
.isometric164-glow { animation: isometric164-glow ${PERIOD}s linear infinite; }
.isometric164-spin { animation: isometric164-spin ${PERIOD}s linear infinite; }
${[0, 1, 2].map(bar).join("\n")}
.isometric164-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric164-moving, .isometric164-moving * { animation: none !important; } }
`;

const HOLE = polygon([[X0, D, FLOOR], [X1, D, FLOOR], [X1, D, CEIL], [X0, D, CEIL]]);
const BACK_WALL = polygon([[X0, BACK, FLOOR], [X1, BACK, FLOOR], [X1, BACK, CEIL], [X0, BACK, CEIL]]);
const SIDE_WALL = polygon([[X0, BACK, FLOOR], [X0, D, FLOOR], [X0, D, CEIL], [X0, BACK, CEIL]]);
const FLOOR_FACE = polygon([[X0, BACK, FLOOR], [X1, BACK, FLOOR], [X1, D, FLOOR], [X0, D, FLOOR]]);
// The door leaf with its window cut out, in door-local units
const WINDOW = { x: 8, y: 8, w: 46, h: 30 };
const LEAF = `M0 0H${DOOR_W}V${DOOR_H}H0Z M${WINDOW.x} ${WINDOW.y}V${WINDOW.y + WINDOW.h}H${WINDOW.x + WINDOW.w}V${WINDOW.y}Z`;

export function Isometric164({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric164Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const glow = paint.accent;

  const leaf = (shade: string) => (
    <>
      <path d={LEAF} fillRule="evenodd" vectorEffect="non-scaling-stroke" className={body.base} />
      <path d={LEAF} fillRule="evenodd" className={shade} stroke="none" />
      <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} className={body.ink} stroke="none" />
    </>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric164-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-118 -60 202 140" aria-hidden="true" className="isometric164-moving size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={HOLE} />
          </clipPath>
        </defs>
        {[[4, 4], [W - 12, 4], [4, D - 12], [W - 12, D - 12]].map(([x = 0, y = 0]) => (
          <Block key={`${x}-${y}`} faces={box(x, y, 0, 8, 8, FOOT)} paint={body} />
        ))}
        <Block faces={box(0, 0, FOOT, W, D, TOP - FOOT)} paint={body} />
        <g transform={onRight(W)} className={body.ink}>
          {[0, 1, 2, 3].map((index) => (
            <rect key={index} x={12 + index * 7} y={-TOP + 8} width={3} height={12} rx={1.5} />
          ))}
        </g>
        <g clipPath={`url(#${clipId})`}>
          <polygon points={BACK_WALL} className={body.base} />
          <polygon points={BACK_WALL} className={body.right} />
          <polygon points={BACK_WALL} className={body.ink} />
          <polygon points={SIDE_WALL} className={body.base} />
          <polygon points={SIDE_WALL} className={body.right} />
          <polygon points={FLOOR_FACE} className={body.base} />
          <polygon points={FLOOR_FACE} className={body.left} />
          <g className="isometric164-glow opacity-0">
            <polygon points={BACK_WALL} className={glow.base} />
            <polygon points={BACK_WALL} className={glow.left} />
            <polygon points={SIDE_WALL} className={glow.base} />
            <polygon points={SIDE_WALL} className={glow.right} />
            <polygon points={FLOOR_FACE} className={glow.base} />
          </g>
          <RoundBlock shape={cylinder(PLATE.x, PLATE.y, FLOOR, 2, PLATE.r)} paint={body} />
          <g transform={onTop(FLOOR + 2)}>
            <g transform={`translate(${PLATE.x} ${PLATE.y})`}>
              <g className={cn("isometric164-spin", body.ink)}>
                <circle cx={13} cy={0} r={2.5} />
                <circle cx={-6.5} cy={11.3} r={1.8} />
                <circle cx={-6.5} cy={-11.3} r={1.2} />
              </g>
            </g>
          </g>
          <RoundBlock shape={cylinder(PLATE.x, PLATE.y, FLOOR + 2, 7, 9)} paint={body} />
          <RoundBlock shape={cylinder(PLATE.x, PLATE.y, FLOOR + 9, 1.5, 7)} paint={glow} />
        </g>
        <g className={cn("isometric164-door", body.edge)} strokeWidth={1} strokeLinejoin="round">
          <g className="isometric164-top" transform={CLOSED.top}>
            <rect width={DOOR_W} height={THICK} vectorEffect="non-scaling-stroke" className={body.base} />
          </g>
          <g className="isometric164-inner opacity-0" transform={CLOSED.inner}>
            {leaf(body.right)}
            <rect x={WINDOW.x - 3} y={WINDOW.y - 3} width={WINDOW.w + 6} height={WINDOW.h + 6} rx={2} fill="none" strokeWidth={1.5} vectorEffect="non-scaling-stroke" className={body.ink.replace("fill-", "stroke-")} />
          </g>
          <g className="isometric164-free" transform={CLOSED.free}>
            <rect width={THICK} height={DOOR_H} vectorEffect="non-scaling-stroke" className={body.base} />
            <rect width={THICK} height={DOOR_H} className={body.right} stroke="none" />
          </g>
          <g className="isometric164-outer" transform={CLOSED.outer}>
            {leaf(body.left)}
            <rect x={DOOR_W - 6} y={6} width={3} height={DOOR_H - 12} rx={1.5} className={body.ink} stroke="none" />
          </g>
        </g>
        <Block faces={box(DOOR_W, D, FOOT, W - DOOR_W, THICK, TOP - FOOT)} paint={body} />
        <g transform={onLeft(D + THICK)}>
          <rect x={DOOR_W + 5} y={-TOP + 6} width={18} height={9} rx={1.5} className={body.ink} />
          {[0, 1, 2].map((index) => (
            <rect key={index} x={DOOR_W + 8 + index * 4.5} y={-TOP + 8} width={3} height={5} rx={1} className={cn(`isometric164-bar${index} opacity-0`, glow.base)} />
          ))}
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((column) => <circle key={`${row}-${column}`} cx={DOOR_W + 8 + column * 6} cy={-TOP + 22 + row * 6} r={1.6} className={body.ink} />),
          )}
          <rect x={DOOR_W + 6} y={-FOOT - 10} width={16} height={5} rx={2.5} className={glow.base} />
        </g>
      </svg>
    </div>
  );
}
