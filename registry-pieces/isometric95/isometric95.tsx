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

interface Isometric95Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the campfire flames with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric95Demo: Isometric95Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const GROUND = 8;
const T0 = 4;
const T1 = 52;
const TY0 = 6;
const TY1 = 52;
const RIDGE_Y = (TY0 + TY1) / 2;
const RIDGE_Z = GROUND + 40;
const TENT_FRONT = polygon([[T0, TY1, GROUND], [T1, TY1, GROUND], [T1, RIDGE_Y, RIDGE_Z], [T0, RIDGE_Y, RIDGE_Z]]);
const TENT_END = polygon([[T1, TY0, GROUND], [T1, TY1, GROUND], [T1, RIDGE_Y, RIDGE_Z]]);
// The door is cut into the end wall, drawn in (y, -z)
const DOOR = `M${RIDGE_Y - 11} ${-GROUND}L${RIDGE_Y} ${-RIDGE_Z + 12}L${RIDGE_Y + 11} ${-GROUND}Z`;
const FLAP = `M${RIDGE_Y} ${-RIDGE_Z + 12}L${RIDGE_Y + 11} ${-GROUND}L${RIDGE_Y + 16} ${-GROUND}Z`;

const FX = 82;
const FY = 30;
const STONES = Array.from({ length: 7 }, (_, index) => {
  const angle = (index * 2 * Math.PI) / 7;
  return { x: FX + Math.cos(angle) * 12, y: FY + Math.sin(angle) * 12 };
}).sort((a, b) => a.x + a.y - (b.x + b.y));
const FIRE_X = (FX - FY) * C;
const FIRE_Y = (FX + FY) * S - GROUND;
const LOG_R = 2.5;
const LOW = GROUND + LOG_R;
const HIGH = LOW + 2 * LOG_R - 0.5;
const FLAME_Z = HIGH + 1;
type Vec = [number, number, number];
const screen = ([x, y, z]: Vec) => [(x - y) * C, (x + y) * S - z] as const;
/** A CSS/SVG matrix that draws local (u, v) onto the plane through o spanned by a and b. */
function frame(o: Vec, a: Vec, b: Vec) {
  const [e, f] = screen(o);
  const [m0, m1] = screen(a);
  const [m2, m3] = screen(b);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(", ")})`;
}
/** A flame tongue standing on its base point, leaning a little to one side. */
const tongue = (w: number, h: number) =>
  `M${-w} 0C${(-w * 1.25).toFixed(1)} ${(-h * 0.32).toFixed(1)} ${(-w * 0.35).toFixed(1)} ${(-h * 0.55).toFixed(1)} ${(w * 0.15).toFixed(1)} ${-h}C${(w * 0.55).toFixed(1)} ${(-h * 0.62).toFixed(1)} ${(w * 1.3).toFixed(1)} ${(-h * 0.36).toFixed(1)} ${w} 0Z`;
// Tongues stand in upright planes through the fire's axis at different plan angles, so the flame has a back, sides and a front
const TONGUES = [
  { turn: 110, out: -5, h: 21, w: 4.5, beat: 0, period: 1.3, delay: -0.2 },
  { turn: 160, out: 5, h: 19, w: 4.5, beat: 1, period: 1.7, delay: -0.9 },
  { turn: 0, out: 0, h: 27, w: 6, beat: 2, period: 1.5, delay: -0.5 },
  { turn: 90, out: 0, h: 25, w: 6, beat: 0, period: 1.9, delay: -1.1 },
  { turn: 135, out: 0, h: 35, w: 8, beat: 1, period: 1.4, delay: 0 },
  { turn: 160, out: -5, h: 20, w: 4.5, beat: 2, period: 1.6, delay: -0.7 },
  { turn: 110, out: 5, h: 17, w: 4.5, beat: 0, period: 1.2, delay: -0.4 },
].map((item) => {
  const angle = (item.turn * Math.PI) / 180;
  const along: Vec = [Math.cos(angle), Math.sin(angle), 0];
  return { ...item, plane: frame([FX + along[0] * item.out, FY + along[1] * item.out, FLAME_Z], along, [0, 0, -1]), d: tongue(item.w, item.h), core: tongue(item.w * 0.5, item.h * 0.6), base: tongue(item.w, item.h * 0.22) };
});
const SPARKS = [
  { x: -5, delay: 0, path: 0 },
  { x: 4, delay: 0.9, path: 1 },
  { x: 0, delay: 1.7, path: 0 },
  { x: 7, delay: 2.3, path: 1 },
];
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
  return { axis, b, u, z, side: band(-45, 135), shade: band(-45, 45), cap: polygon(Array.from({ length: 36 }, (_, k) => at(b, k * 10))) };
}
/** A log: bark on the side, end grain rings on the cut end that faces the viewer. */
function Log({ shape, paint }: { shape: Rod; paint: Paint }) {
  const along = shape.axis === "y";
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.side} className={paint.ink} stroke="none" />
      <polygon points={shape.shade} className={along ? paint.right : paint.left} stroke="none" />
      <polygon points={shape.cap} className={paint.base} />
      <g transform={along ? onLeft(shape.b) : onRight(shape.b)} stroke="none" className={paint.ink}>
        <circle cx={shape.u} cy={-shape.z} r={1.5} />
      </g>
    </g>
  );
}
const LOGS = [rod("x", FX - 8, FX + 8, FY - 4, LOW, LOG_R), rod("x", FX - 8, FX + 8, FY + 4, LOW, LOG_R), rod("y", FY - 8, FY + 8, FX - 4, HIGH, LOG_R), rod("y", FY - 8, FY + 8, FX + 4, HIGH, LOG_R)];
const GROUND_TOP = box(0, 0, 0, 104, 68, GROUND).top;
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
type Round = ReturnType<typeof roundBox>;

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

const STYLES = `
@keyframes isometric95-beat0 { 0%, 100% { transform: rotate(-3deg) scale(1, 1); } 30% { transform: rotate(2deg) scale(0.92, 1.14); } 60% { transform: rotate(4deg) scale(1.05, 0.9); } 80% { transform: rotate(-1deg) scale(0.97, 1.06); } }
@keyframes isometric95-beat1 { 0%, 100% { transform: rotate(2deg) scale(1, 0.94); } 25% { transform: rotate(-3deg) scale(0.95, 1.1); } 55% { transform: rotate(1deg) scale(1.04, 1); } 78% { transform: rotate(4deg) scale(0.93, 1.12); } }
@keyframes isometric95-beat2 { 0%, 100% { transform: rotate(0deg) scale(1, 1.06); } 35% { transform: rotate(4deg) scale(0.96, 0.9); } 65% { transform: rotate(-4deg) scale(1.03, 1.12); } }
@keyframes isometric95-core { 0%, 100% { opacity: 1; } 45% { opacity: 0.7; } }
@keyframes isometric95-glow { 0%, 100% { opacity: 0.6; } 40% { opacity: 0.38; } 70% { opacity: 0.52; } }
@keyframes isometric95-spark0 { 0% { transform: translate(0, 0); opacity: 0; } 12% { opacity: 1; } 50% { transform: translate(4px, -16px); } 100% { transform: translate(-3px, -34px); opacity: 0; } }
@keyframes isometric95-spark1 { 0% { transform: translate(0, 0); opacity: 0; } 12% { opacity: 1; } 50% { transform: translate(-5px, -14px); } 100% { transform: translate(2px, -30px); opacity: 0; } }
@keyframes isometric95-smoke { 0% { transform: translate(0, 0) scale(0.6); opacity: 0; } 20% { opacity: 0.5; } 100% { transform: translate(8px, -30px) scale(1.5); opacity: 0; } }
.isometric95-beat0 { animation: isometric95-beat0 1.4s ease-in-out infinite; }
.isometric95-beat1 { animation: isometric95-beat1 1.4s ease-in-out infinite; }
.isometric95-beat2 { animation: isometric95-beat2 1.4s ease-in-out infinite; }
.isometric95-core { animation: isometric95-core 0.9s ease-in-out infinite; }
.isometric95-glow { animation: isometric95-glow 2.4s ease-in-out infinite; }
.isometric95-spark0 { animation: isometric95-spark0 2.8s ease-out infinite both; }
.isometric95-spark1 { animation: isometric95-spark1 2.8s ease-out infinite both; }
.isometric95-smoke { animation: isometric95-smoke 4.2s ease-out infinite both; transform-box: fill-box; transform-origin: center; }
.isometric95-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric95-fire * { animation: none !important; } }
`;
export function Isometric95({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric95Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const fire = paint.accent;
  const id = useId();
  const core = accentProp ? "fill-amber-300" : paint.body.ink;
  const hot = accentProp ? "fill-yellow-200" : paint.body.ink;
  const warm = accentProp ? "fill-amber-300" : paint.body.ink;
  const stone = (item: (typeof STONES)[number]) => <RoundBlock key={`${item.x}-${item.y}`} shape={roundBox(item.x - 3.5, item.y - 3.5, GROUND, 7, 7, 4, 3.5)} paint={paint.body} />;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric95-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-66 -48 164 132" aria-hidden="true" className="isometric95-fire size-full overflow-visible">
        <defs>
          <radialGradient id={`${id}-soft`}>
            <stop offset="0%" stopColor="white" />
            <stop offset="45%" stopColor="white" stopOpacity={0.6} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </radialGradient>
          <mask id={`${id}-pool`}>
            <circle cx={FX} cy={FY} r={30} fill={`url(#${id}-soft)`} />
          </mask>
          <mask id={`${id}-wall`}>
            <ellipse cx={FY} cy={-GROUND - 6} rx={22} ry={30} fill={`url(#${id}-soft)`} />
          </mask>
          <clipPath id={`${id}-ground`}>
            <polygon points={GROUND_TOP} />
          </clipPath>
          <clipPath id={`${id}-tent`}>
            <polygon points={TENT_END} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, 104, 68, GROUND)} paint={paint.body} />
        {/* Firelight pools on the ground, and the stones throw short shadows away from the fire */}
        <g clipPath={`url(#${id}-ground)`}>
          <g transform={onTop(GROUND)}>
            <circle cx={FX} cy={FY} r={30} mask={`url(#${id}-pool)`} className={cn("isometric95-glow opacity-60", warm)} />
            {STONES.map((item) => (
              <ellipse key={`${item.x}-${item.y}`} cx={item.x + (item.x - FX) * 0.42} cy={item.y + (item.y - FY) * 0.42} rx={4.5} ry={4} className="fill-black/10" />
            ))}
          </g>
        </g>
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={TENT_END} className={paint.body.base} />
          <polygon points={TENT_END} stroke="none" className={paint.body.right} />
          <polygon points={TENT_FRONT} className={paint.body.base} />
          <polygon points={TENT_FRONT} stroke="none" className={paint.body.left} />
        </g>
        {/* The tent wall that faces the fire catches its light */}
        <g clipPath={`url(#${id}-tent)`}>
          <g transform={onRight(T1)}>
            <ellipse cx={FY} cy={-GROUND - 6} rx={22} ry={30} mask={`url(#${id}-wall)`} className={cn("isometric95-glow opacity-60", warm)} />
          </g>
        </g>
        <g transform={onRight(T1)}>
          <path d={DOOR} className={palette === "dark" ? "fill-black/40" : "fill-black/20"} />
          <path d={FLAP} strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={cn(paint.body.base, paint.body.edge)} />
          <path d={FLAP} className={paint.body.left} />
        </g>
        <Block faces={box(T1, RIDGE_Y - 1, RIDGE_Z - 2, 2, 2, 8)} paint={paint.body} />
        <Block faces={box(T0 - 2, RIDGE_Y - 1, RIDGE_Z - 2, 2, 2, 8)} paint={paint.body} />
        {STONES.filter((item) => item.x + item.y < FX + FY).map(stone)}
        <g transform={onTop(GROUND)}>
          <circle cx={FX} cy={FY} r={7.5} className={cn("isometric95-core", core)} />
          <circle cx={FX} cy={FY} r={4} className={hot} />
        </g>
        {LOGS.map((shape, index) => (
          <Log key={index} shape={shape} paint={paint.body} />
        ))}
        {[0, 1].map((index) => (
          <circle key={index} cx={FIRE_X + index * 3} cy={FIRE_Y - 44} r={3.5} className={cn("isometric95-smoke opacity-0", paint.body.ink)} style={{ animationDelay: `${index * 2.1}s` }} />
        ))}
        {TONGUES.map((item, index) => (
          <g key={index} transform={item.plane}>
            <g className={`isometric95-beat${item.beat}`} style={{ animationDuration: `${item.period}s`, animationDelay: `${item.delay}s` }}>
              <path d={item.d} className={fire.base} />
              <path d={item.base} className={fire.right} />
              <path d={item.core} className={cn("isometric95-core", core)} style={{ animationDelay: `${item.delay}s` }} />
              {item.out === 0 && <path d={tongue(item.w * 0.25, item.h * 0.32)} className={hot} />}
            </g>
          </g>
        ))}
        <g transform={`translate(${FIRE_X.toFixed(1)} ${FIRE_Y.toFixed(1)})`}>
          {SPARKS.map((spark) => (
            <rect key={spark.x} x={spark.x - 1} y={-24} width={2} height={2} rx={1} className={cn(`isometric95-spark${spark.path} opacity-0`, core)} style={{ animationDelay: `${spark.delay}s` }} />
          ))}
        </g>
        {STONES.filter((item) => item.x + item.y >= FX + FY).map(stone)}
      </svg>
    </div>
  );
}
