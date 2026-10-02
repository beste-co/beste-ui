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

interface Isometric53Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the handle wheel with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric53Demo: Isometric53Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 80;
const D = 68;
const FOOT = 6;
const H = 96;
const WALL = 10;
const Z0 = FOOT + WALL;
const Z1 = FOOT + H - WALL;
const X0 = WALL;
const X1 = W - WALL;
const DOOR_W = X1 - X0;
const DOOR_H = Z1 - Z0;
const THICK = 6;
const PERIOD = 5.6;
const OPEN = 80;

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
const HINGE: Vec = [X0, D, Z0];
/** The four door faces at a swing angle in degrees. */
function doorFrames(angle: number) {
  const t = (angle * Math.PI) / 180;
  const along: Vec = [Math.cos(t), Math.sin(t), 0];
  const out: Vec = [-Math.sin(t), Math.cos(t), 0];
  const at = (u: number, n: number, z: number): Vec => [HINGE[0] + along[0] * u + out[0] * n, HINGE[1] + along[1] * u + out[1] * n, z];
  return {
    outer: frame(at(0, THICK, Z1), along, DOWN),
    inner: frame(at(0, 0, Z1), along, DOWN),
    edge: frame(at(DOOR_W, 0, Z1), out, DOWN),
    top: frame(at(0, 0, Z1), along, out),
  };
}
const CLOSED = doorFrames(0);
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const unease = (r: number) => (r < 0.5 ? Math.sqrt(r / 2) : 1 - Math.sqrt((1 - r) / 2));
// Swing open from 26% to 44%, closed again from 70% to 88%, with extra stops either side of 45 degrees where the faces swap
const KS = [...Array.from({ length: 15 }, (_, index) => (index + 1) / 16), unease(43 / OPEN), unease(47 / OPEN)].sort((a, b) => a - b);
const STOPS: [number, number][] = [
  [0, 0],
  [26, 0],
  ...KS.map((k): [number, number] => [26 + k * 18, OPEN * ease(k)]),
  [44, OPEN],
  [70, OPEN],
  ...KS.map((k): [number, number] => [70 + k * 18, OPEN * (1 - ease(k))]),
  [88, 0],
  [100, 0],
];
const n = (value: number) => value.toFixed(4);
/** A number that depends on the door angle: k + c * cos + s * sin, written for calc(). */
const mix = (k: number, c: number, s: number) => `calc(${n(k)} + ${n(c)} * var(--isometric53-c) + ${n(s)} * var(--isometric53-s))`;
type Axis = "along" | "out";
// Screen directions of the door's own axes as [k, cos, sin] parts for x and y
const AXES: Record<Axis, [[number, number, number], [number, number, number]]> = {
  along: [[0, C, -C], [0, S, S]],
  out: [[0, -C, -C], [0, S, -S]],
};
/** The matrix of a door face at (u along, m out) from the hinge; it follows cos and sin, so shared edges cannot drift apart. */
function face(u: number, m: number, a: Axis, b?: Axis) {
  const [e, f] = screen([HINGE[0], HINGE[1], Z1]);
  const [ax, ay] = AXES[a];
  const down = b ? `${mix(...AXES[b][0])}, ${mix(...AXES[b][1])}` : "0, 1";
  return `matrix(${mix(...ax)}, ${mix(...ay)}, ${down}, ${mix(e, C * (u - m), -C * (u + m))}, ${mix(f, S * (u + m), S * (u - m))})`;
}
type Face = keyof typeof CLOSED;
const FACE_CSS: Record<Face, string> = {
  outer: face(0, THICK, "along"),
  inner: face(0, 0, "along"),
  edge: face(DOOR_W, 0, "out"),
  top: face(0, 0, "along", "out"),
};
// The wheel is a hub, three spokes and a ring, built up in layers above the door's outer face
const WHEEL_LAYERS = [0, 1, 2, 3, 4, 5, 6];
const HUB = { x: DOOR_W / 2, y: DOOR_H / 2 };
const RING = `M${HUB.x - 23} ${HUB.y}a23 23 0 1 0 46 0a23 23 0 1 0 -46 0Z M${HUB.x - 18} ${HUB.y}a18 18 0 1 1 36 0a18 18 0 1 1 -36 0Z`;
const TURN = STOPS.map(([p, a]) => `${p.toFixed(2)}% { --isometric53-c: ${n(Math.cos((a * Math.PI) / 180))}; --isometric53-s: ${n(Math.sin((a * Math.PI) / 180))}; }`).join(" ");
// The front of the door shows below 45 degrees, its inside above
const show = (front: boolean) => STOPS.map(([p, a], index) => `${p.toFixed(2)}% { opacity: ${(a < 45 && (STOPS[index + 1]?.[1] ?? a) < 45) === front ? 1 : 0}; }`).join(" ");

const STYLES = `
@property --isometric53-c { syntax: "<number>"; inherits: true; initial-value: 1; }
@property --isometric53-s { syntax: "<number>"; inherits: true; initial-value: 0; }
@keyframes isometric53-door { ${TURN} }
@keyframes isometric53-front { ${show(true)} }
@keyframes isometric53-back { ${show(false)} }
@keyframes isometric53-wheel { 0%, 6% { transform: rotate(0deg); } 22%, 90% { transform: rotate(180deg); } 100% { transform: rotate(360deg); } }
.isometric53-door { animation: isometric53-door ${PERIOD}s linear infinite; }
.isometric53-outer { transform: ${FACE_CSS.outer}; animation: isometric53-front ${PERIOD}s step-end infinite; }
.isometric53-inner { transform: ${FACE_CSS.inner}; animation: isometric53-back ${PERIOD}s step-end infinite; }
${WHEEL_LAYERS.map((layer) => `.isometric53-layer${layer} { transform: ${face(0, THICK + layer + 1, "along")}; }`).join("\n")}
.isometric53-layer { animation: isometric53-front ${PERIOD}s step-end infinite; }
.isometric53-edge { transform: ${FACE_CSS.edge}; }
.isometric53-top { transform: ${FACE_CSS.top}; }
.isometric53-wheel { animation: isometric53-wheel ${PERIOD}s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric53-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric53-door, .isometric53-layer, .isometric53-outer, .isometric53-inner, .isometric53-edge, .isometric53-top, .isometric53-wheel { animation: none; } }
`;

const HOLE = polygon([[X0 + 2, D, Z0 + 2], [X1 - 2, D, Z0 + 2], [X1 - 2, D, Z1 - 2], [X0 + 2, D, Z1 - 2]]);
const SPOKES = [0, 120, 240];

export function Isometric53({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric53Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const back = WALL + 4;
  const wheel = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric53-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-104 -110 180 184" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={HOLE} />
          </clipPath>
        </defs>
        {[[6, 6], [W - 16, 6], [6, D - 16], [W - 16, D - 16]].map(([x = 0, y = 0]) => (
          <Block key={`${x}-${y}`} faces={box(x, y, 0, 10, 10, FOOT)} paint={paint.body} />
        ))}
        <Block faces={box(0, 0, FOOT, W, D, H)} paint={paint.body} />
        <g clipPath={`url(#${clipId})`}>
          <g className={paint.body.edge} strokeWidth={1}>
            <polygon points={polygon([[X0, back, Z0], [X1, back, Z0], [X1, back, Z1], [X0, back, Z1]])} className={paint.body.base} />
            <polygon points={polygon([[X0, back, Z0], [X1, back, Z0], [X1, back, Z1], [X0, back, Z1]])} className={paint.body.right} stroke="none" />
            <polygon points={polygon([[X0, back, Z0], [X1, back, Z0], [X1, back, Z1], [X0, back, Z1]])} className={paint.body.ink} stroke="none" />
            <polygon points={polygon([[X0, back, Z0], [X0, D, Z0], [X0, D, Z1], [X0, back, Z1]])} className={paint.body.base} />
            <polygon points={polygon([[X0, back, Z0], [X0, D, Z0], [X0, D, Z1], [X0, back, Z1]])} className={paint.body.right} stroke="none" />
            <polygon points={polygon([[X0, back, Z0], [X1, back, Z0], [X1, D, Z0], [X0, D, Z0]])} className={paint.body.base} />
            <polygon points={polygon([[X0, back, Z0], [X1, back, Z0], [X1, D, Z0], [X0, D, Z0]])} className={paint.body.left} stroke="none" />
                      </g>
          <Block faces={box(X0, back, Z0 + 38, DOOR_W, D - back - 6, 4)} paint={paint.body} />
          {[0, 1].map((index) => (
            <Block key={index} faces={box(X0 + 12 + index * 20, D - 36, Z0 + 42, 16, 24, 6 + index * 6)} paint={paint.body} />
          ))}
          {[0, 1, 2].map((index) => (
            <Block key={index} faces={box(X0 + 6 + index * 16, D - 34, Z0, 14, 24, 8)} paint={paint.body} />
          ))}
          {[0, 1].map((index) => (
            <Block key={index} faces={box(X0 + 14 + index * 16, D - 34, Z0 + 8, 14, 24, 8)} paint={paint.body} />
          ))}
        </g>
        <g className={cn("isometric53-door", paint.body.edge)} strokeWidth={1} strokeLinejoin="round">
          <g className="isometric53-top" transform={CLOSED.top}>
            <rect width={DOOR_W} height={THICK} className={paint.body.base} />
          </g>
          <g className="isometric53-inner opacity-0" transform={CLOSED.inner}>
            <rect width={DOOR_W} height={DOOR_H} className={paint.body.base} />
            <rect width={DOOR_W} height={DOOR_H} className={paint.body.right} stroke="none" />
            <rect x={10} y={10} width={DOOR_W - 20} height={DOOR_H - 20} rx={4} className={paint.body.ink} stroke="none" />
            {[22, DOOR_H / 2, DOOR_H - 22].map((y) => (
              <rect key={y} x={DOOR_W - 16} y={y - 3} width={10} height={6} rx={3} className={paint.body.ink} stroke="none" />
            ))}
          </g>
          <g className="isometric53-edge" transform={CLOSED.edge}>
            <rect width={THICK} height={DOOR_H} className={paint.body.base} />
            <rect width={THICK} height={DOOR_H} className={paint.body.right} stroke="none" />
          </g>
          <g className="isometric53-outer" transform={CLOSED.outer}>
            <rect width={DOOR_W} height={DOOR_H} className={paint.body.base} />
            <rect width={DOOR_W} height={DOOR_H} className={paint.body.left} stroke="none" />
            <rect x={8} y={8} width={DOOR_W - 16} height={DOOR_H - 16} rx={4} fill="none" strokeWidth={1.5} className={palette === "tone" ? "stroke-white/30" : "stroke-black/10"} />
          </g>
          {/* The handle wheel stands off the door: the same shape stacked on planes a unit apart, turning as one */}
          {WHEEL_LAYERS.map((layer) => {
            const top = layer === WHEEL_LAYERS.length - 1;
            const rim = layer >= 3;
            const shade = top ? undefined : wheel.right;
            return (
              <g key={layer} className={`isometric53-layer isometric53-layer${layer}`} stroke="none">
                <g className="isometric53-wheel">
                  {/* Keeps the rotation centered on the hub */}
                  <circle cx={HUB.x} cy={HUB.y} r={26} fill="none" />
                  {rim && (
                    <>
                      {SPOKES.map((angle) => (
                        <g key={angle} transform={`translate(${HUB.x} ${HUB.y}) rotate(${angle})`}>
                          <rect x={-2.5} y={-21} width={5} height={21} className={wheel.base} />
                          {shade && <rect x={-2.5} y={-21} width={5} height={21} className={shade} />}
                        </g>
                      ))}
                      <path d={RING} fillRule="evenodd" className={wheel.base} />
                      {shade && <path d={RING} fillRule="evenodd" className={shade} />}
                    </>
                  )}
                  <circle cx={HUB.x} cy={HUB.y} r={rim ? 7 : 9} className={wheel.base} />
                  {shade && <circle cx={HUB.x} cy={HUB.y} r={rim ? 7 : 9} className={shade} />}
                  {top && <circle cx={HUB.x} cy={HUB.y} r={3} className={wheel.ink} />}
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
