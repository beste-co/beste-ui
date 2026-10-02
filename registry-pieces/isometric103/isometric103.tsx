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

interface Isometric103Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Light the inside of the fridge with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric103Demo: Isometric103Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const PLINTH = 6;
const W = 60;
const D = 48;
const H = 120;
const TOP = PLINTH + H;
const DOOR = { z: PLINTH + 2, h: 80 };
// The freezer door sits right on top of the main door, so it covers the main door's top edge while that is shut
const FREEZER = { z: DOOR.z + DOOR.h, h: TOP - DOOR.z - DOOR.h - 2 };
// The cavity behind the main door, open toward +y
const CAVE = { x: 4, y: D - 24, z: DOOR.z + 4, w: W - 8, h: DOOR.h - 8 };
const SHELVES = [CAVE.z + 26, CAVE.z + 50];
// Door racks, measured down from the top of the door
const RACKS = [28, 56];
const BACK = CAVE.y;
const FRONT = D;

const THICK = 4;
const RACK = 4;
const DOOR_TOP = DOOR.z + DOOR.h;
const OPEN = 90;
const PERIOD = 6;

type Vec = [number, number, number];
const screen = ([x, y, z]: Vec) => [(x - y) * C, (x + y) * S - z] as const;
/** A CSS/SVG matrix that draws local (u, v) onto the plane through o spanned by a and b. */
function frame(o: Vec, a: Vec, b: Vec) {
  const [e, f] = screen(o);
  const [m0, m1] = screen(a);
  const [m2, m3] = screen(b);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(", ")})`;
}
const DOWN: Vec = [0, 0, -1];
/** The door faces at a swing angle in degrees, hinged on the vertical edge at (0, D). */
function doorFrames(angle: number) {
  const t = (angle * Math.PI) / 180;
  const along: Vec = [Math.cos(t), Math.sin(t), 0];
  const out: Vec = [-Math.sin(t), Math.cos(t), 0];
  const at = (u: number, n: number): Vec => [along[0] * u + out[0] * n, D + along[1] * u + out[1] * n, DOOR_TOP];
  return {
    outer: frame(at(0, THICK), along, DOWN),
    inner: frame(at(0, 0), along, DOWN),
    edge: frame(at(W, 0), out, DOWN),
    top: frame(at(0, 0), along, out),
    rack: frame(at(0, -RACK), along, DOWN),
    rackEnd: frame(at(W - 8, -RACK), out, DOWN),
    rackTop: frame(at(0, -RACK), along, out),
  };
}
type Face = keyof ReturnType<typeof doorFrames>;
const CLOSED = doorFrames(0);
const OPENED = doorFrames(OPEN);
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const unease = (r: number) => (r < 0.5 ? Math.sqrt(r / 2) : 1 - Math.sqrt((1 - r) / 2));
// Swings open from 12% to 34% and shut from 78% to 96%, with extra stops either side of 45 degrees where the faces swap
const KS = [...Array.from({ length: 9 }, (_, index) => (index + 1) / 10), unease(43 / OPEN), unease(47 / OPEN)].sort((a, b) => a - b);
const STOPS: [number, number][] = [
  [0, 0],
  [12, 0],
  ...KS.map((k): [number, number] => [12 + k * 22, OPEN * ease(k)]),
  [34, OPEN],
  [78, OPEN],
  ...KS.map((k): [number, number] => [78 + k * 18, OPEN * (1 - ease(k))]),
  [96, 0],
  [100, 0],
];
const n = (value: number) => value.toFixed(4);
/** A number that depends on the door angle: k + c * cos + s * sin, written for calc(). */
const mix = (k: number, c: number, s: number) => `calc(${n(k)} + ${n(c)} * var(--isometric103-c) + ${n(s)} * var(--isometric103-s))`;
type Axis = "along" | "out";
// Screen directions of the door's own axes as [k, cos, sin] parts for x and y
const AXES: Record<Axis, [[number, number, number], [number, number, number]]> = {
  along: [[0, C, -C], [0, S, S]],
  out: [[0, -C, -C], [0, S, -S]],
};
/** The matrix of a door face at (u along, m out) from the hinge; it follows cos and sin, so shared edges cannot drift apart. */
function face(u: number, m: number, a: Axis, b?: Axis) {
  const [e, f] = screen([0, D, DOOR_TOP]);
  const [ax, ay] = AXES[a];
  const down = b ? `${mix(...AXES[b][0])}, ${mix(...AXES[b][1])}` : "0, 1";
  return `matrix(${mix(...ax)}, ${mix(...ay)}, ${down}, ${mix(e, C * (u - m), -C * (u + m))}, ${mix(f, S * (u + m), S * (u - m))})`;
}
const FACE_CSS: Record<Face, string> = {
  outer: face(0, THICK, "along"),
  inner: face(0, 0, "along"),
  edge: face(W, 0, "out"),
  top: face(0, 0, "along", "out"),
  rack: face(0, -RACK, "along"),
  rackEnd: face(W - 8, -RACK, "out"),
  rackTop: face(0, -RACK, "along", "out"),
};
const TURN = STOPS.map(([p, a]) => `${p.toFixed(2)}% { --isometric103-c: ${n(Math.cos((a * Math.PI) / 180))}; --isometric103-s: ${n(Math.sin((a * Math.PI) / 180))}; }`).join(" ");
// The front of the door shows below 45 degrees, its inside and the racks above
const show = (front: boolean) => STOPS.map(([p, a], index) => `${p.toFixed(2)}% { opacity: ${(a < 45 && (STOPS[index + 1]?.[1] ?? a) < 45) === front ? 1 : 0}; }`).join(" ");
const FACES: Face[] = ["outer", "inner", "edge", "top", "rack", "rackEnd", "rackTop"];
const INSIDE: Face[] = ["inner", "rack", "rackEnd", "rackTop"];
const STYLES = `
@property --isometric103-c { syntax: "<number>"; inherits: true; initial-value: 0; }
@property --isometric103-s { syntax: "<number>"; inherits: true; initial-value: 1; }
@keyframes isometric103-door { ${TURN} }
@keyframes isometric103-front { ${show(true)} }
@keyframes isometric103-back { ${show(false)} }
@keyframes isometric103-dark { 0%, 14% { opacity: 1; } 30%, 80% { opacity: 0; } 94%, 100% { opacity: 1; } }
.isometric103-door { animation: isometric103-door ${PERIOD}s linear infinite; }
${FACES.map((name) => `.isometric103-${name} { transform: ${FACE_CSS[name]}; transform-box: view-box; transform-origin: 0 0;${name === "outer" ? ` animation: isometric103-front ${PERIOD}s step-end infinite;` : INSIDE.includes(name) ? ` animation: isometric103-back ${PERIOD}s step-end infinite;` : ""} }`).join("\n")}
.isometric103-dark { animation: isometric103-dark ${PERIOD}s ease-in-out infinite; }
.isometric103-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric103-door, ${FACES.map((face) => `.isometric103-${face}`).join(", ")}, .isometric103-dark { animation: none; } }
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

export function Isometric103({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric103Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const lit = paint.accent;
  const top = CAVE.z + CAVE.h;
  const [S1 = 0, S2 = 0] = SHELVES;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric103-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-104 -134 170 198" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={CAVE.x} y={-top} width={CAVE.w} height={CAVE.h} rx={2} transform={onLeft(FRONT)} />
          </clipPath>
        </defs>
        <Block faces={box(-4, -4, 0, W + 8, D + 8, PLINTH)} paint={body} />
        <Block faces={box(0, 0, PLINTH, W, D, H)} paint={body} />
        <g clipPath={`url(#${clipId})`}>
          <polygon points={polygon([[CAVE.x, BACK, CAVE.z], [CAVE.x + CAVE.w, BACK, CAVE.z], [CAVE.x + CAVE.w, BACK, top], [CAVE.x, BACK, top]])} className={lit.base} />
          <polygon points={polygon([[CAVE.x, BACK, CAVE.z], [CAVE.x + CAVE.w, BACK, CAVE.z], [CAVE.x + CAVE.w, BACK, top], [CAVE.x, BACK, top]])} className={lit.left} />
          <polygon points={polygon([[CAVE.x, BACK, CAVE.z], [CAVE.x, FRONT, CAVE.z], [CAVE.x, FRONT, top], [CAVE.x, BACK, top]])} className={lit.base} />
          <polygon points={polygon([[CAVE.x, BACK, CAVE.z], [CAVE.x, FRONT, CAVE.z], [CAVE.x, FRONT, top], [CAVE.x, BACK, top]])} className={lit.right} />
          <polygon points={polygon([[CAVE.x, BACK, CAVE.z], [CAVE.x + CAVE.w, BACK, CAVE.z], [CAVE.x + CAVE.w, FRONT, CAVE.z], [CAVE.x, FRONT, CAVE.z]])} className={lit.base} />
          <Block faces={box(CAVE.x + 2, BACK + 2, CAVE.z, 24, 20, 12)} paint={body} />
          <Block faces={box(CAVE.x + 28, BACK + 2, CAVE.z, 22, 20, 12)} paint={body} />
          <g transform={onLeft(BACK + 22)} className={body.ink}>
            <rect x={CAVE.x + 8} y={-CAVE.z - 9} width={12} height={2} rx={1} />
            <rect x={CAVE.x + 33} y={-CAVE.z - 9} width={12} height={2} rx={1} />
          </g>
          <Block faces={box(CAVE.x, BACK, S1, CAVE.w, FRONT - BACK - 2, 2)} paint={lit} />
          <RoundBlock shape={cylinder(15, BACK + 10, S1 + 2, 11, 7)} paint={body} />
          <RoundBlock shape={cylinder(15, BACK + 10, S1 + 13, 3, 7.5)} paint={body} />
          <Block faces={box(30, BACK + 4, S1 + 2, 12, 12, 15)} paint={body} />
          <polygon points={polygon([[30, BACK + 10, S1 + 17], [42, BACK + 10, S1 + 17], [42, BACK + 10, S1 + 21], [30, BACK + 10, S1 + 21]])} className={cn(body.base, body.edge)} strokeWidth={1} strokeLinejoin="round" />
          <Block faces={box(CAVE.x, BACK, S2, CAVE.w, FRONT - BACK - 2, 2)} paint={lit} />
          {[12, 22].map((x) => (
            <g key={x}>
              <RoundBlock shape={cylinder(x, BACK + 8, S2 + 2, 14, 4)} paint={body} />
              <RoundBlock shape={cylinder(x, BACK + 8, S2 + 16, 4, 2)} paint={body} />
            </g>
          ))}
          <RoundBlock shape={roundBox(40, BACK + 4, S2 + 2, 14, 14, 7, 4)} paint={body} />
          <rect x={-200} y={-200} width={400} height={400} className="isometric103-dark fill-black/40 opacity-0" />
        </g>
        <g transform={onLeft(D + 8)} className={body.ink}>
          {[0, 1, 2, 3].map((index) => (
            <rect key={index} x={12 + index * 10} y={-PLINTH + 1.5} width={6} height={2} rx={1} />
          ))}
        </g>
        <g className={cn("isometric103-door", body.edge)} strokeWidth={1} strokeLinejoin="round">
          <g className="isometric103-top" transform={OPENED.top}>
            <rect width={W} height={THICK} className={body.base} />
          </g>
          <g className="isometric103-inner" transform={OPENED.inner}>
            <rect width={W} height={DOOR.h} className={body.base} />
            <rect width={W} height={DOOR.h} className={body.right} stroke="none" />
            <rect x={3} y={3} width={W - 6} height={DOOR.h - 6} rx={3} fill="none" strokeWidth={2} className={body.ink.replace("fill-", "stroke-")} />
          </g>
          {RACKS.map((down) => (
            <g key={down}>
              <g transform={`translate(0 ${down})`}>
                <g className="isometric103-rackTop" transform={OPENED.rackTop}>
                  <rect x={8} width={W - 16} height={RACK} className={body.base} />
                </g>
              </g>
              <g className="isometric103-rack" transform={OPENED.rack}>
                <rect x={8} y={down} width={W - 16} height={8} className={body.base} />
                <rect x={8} y={down} width={W - 16} height={8} className={body.right} stroke="none" />
              </g>
              <g className="isometric103-rackEnd" transform={OPENED.rackEnd}>
                <rect y={down} width={RACK} height={8} className={body.base} />
                <rect y={down} width={RACK} height={8} className={body.left} stroke="none" />
              </g>
            </g>
          ))}
          <g className="isometric103-edge" transform={OPENED.edge}>
            <rect width={THICK} height={DOOR.h} className={body.base} />
            <rect width={THICK} height={DOOR.h} className={body.left} stroke="none" />
          </g>
          <g className="isometric103-outer opacity-0" transform={OPENED.outer}>
            <rect width={W} height={DOOR.h} className={body.base} />
            <rect width={W} height={DOOR.h} className={body.left} stroke="none" />
            <rect x={W - 8} y={6} width={3} height={24} rx={1.5} className={body.base} />
            <rect x={W - 8} y={6} width={3} height={24} rx={1.5} className={body.right} stroke="none" />
          </g>
        </g>
        <Block faces={box(0, D, FREEZER.z, W, 4, FREEZER.h)} paint={body} />
        <Block faces={box(W - 8, D + 4, FREEZER.z + 4, 3, 3, 18)} paint={body} />
      </svg>
    </div>
  );
}
