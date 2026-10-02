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

interface Isometric125Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Light the lamp and its beam with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric125Demo: Isometric125Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Plan = [number, number][];

/** A flat solid standing on a plan outline, showing only the sides that face the viewer. */
function prism(outline: Plan, z: number, h: number) {
  const area = outline.reduce((sum, [ax, ay], index) => {
    const [bx, by] = outline[(index + 1) % outline.length] as [number, number];
    return sum + ax * by - bx * ay;
  }, 0);
  const points = area < 0 ? [...outline].reverse() : outline;
  const sides = points.flatMap(([ax, ay], index) => {
    const [bx, by] = points[(index + 1) % points.length] as [number, number];
    const [nx, ny] = [by - ay, ax - bx];
    if (nx + ny <= 0) return [];
    return [{ points: polygon([[ax, ay, z + h], [bx, by, z + h], [bx, by, z], [ax, ay, z]]), left: ny > nx }];
  });
  return { top: polygon(points.map(([px, py]): Point => [px, py, z + h])), sides };
}

function Prism({ shape, paint }: { shape: ReturnType<typeof prism>; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      {shape.sides.map((side) => (
        <g key={side.points}>
          <polygon points={side.points} className={paint.base} />
          <polygon points={side.points} className={side.left ? paint.left : paint.right} stroke="none" />
        </g>
      ))}
      <polygon points={shape.top} className={paint.base} />
    </g>
  );
}

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
const outline = (radii: number[]): Plan =>
  radii.map((r, index) => {
    const a = ((index * 360) / radii.length + 10) * (Math.PI / 180);
    return [r * Math.cos(a), r * Math.sin(a)];
  });
const SEA = 4;
const ROCK_LOW = prism(outline([31, 27, 32, 28, 30, 26, 30, 29, 27]), SEA, 10);
const ROCK_HIGH = prism(outline([21, 18, 22, 19, 20, 17, 21, 19]), SEA + 10, 8);
const FOOT = SEA + 18;
const TOP = FOOT + 62;
const R_FOOT = 13;
const R_TOP = 9;
const LAMP_Z = TOP + 3;
const LAMP_H = 12;
const CAP_Z = LAMP_Z + LAMP_H;

/** A tapered cylinder, centered on the origin in plan. */
function frustum(r0: number, r1: number, z0: number, z1: number) {
  const [a0, b0, a1, b1] = [r0 * ELLIPSE_X, r0 * ELLIPSE_Y, r1 * ELLIPSE_X, r1 * ELLIPSE_Y];
  const left = `M${-a1} ${-z1}L${-a0} ${-z0}A${a0} ${b0} 0 0 0 0 ${-z0 + b0}L0 ${-z1 + b1}A${a1} ${b1} 0 0 1 ${-a1} ${-z1}Z`;
  const right = `M${a1} ${-z1}L${a0} ${-z0}A${a0} ${b0} 0 0 1 0 ${-z0 + b0}L0 ${-z1 + b1}A${a1} ${b1} 0 0 0 ${a1} ${-z1}Z`;
  const front = `M${-a1} ${-z1}L${-a0} ${-z0}A${a0} ${b0} 0 0 0 ${a0} ${-z0}L${a1} ${-z1}A${a1} ${b1} 0 0 1 ${-a1} ${-z1}Z`;
  return { left, right, front, top: { rx: a1, ry: b1, cy: -z1 } };
}
const radiusAt = (z: number) => R_FOOT + ((R_TOP - R_FOOT) * (z - FOOT)) / (TOP - FOOT);
const TOWER = frustum(R_FOOT, R_TOP, FOOT, TOP);
const BANDS = [
  [FOOT + 14, FOOT + 26],
  [FOOT + 40, FOOT + 52],
].map(([z0, z1]) => frustum(radiusAt(z0 as number), radiusAt(z1 as number), z0 as number, z1 as number).front);

const LAMP_MID = LAMP_Z + LAMP_H / 2;
const PERIOD = 8;
// The beam is a cone of light: a run of round slices that widen and thin out with distance from the lamp
const SLICES = (() => {
  const list: { reach: number; r: number; glow: number }[] = [];
  for (let reach = 9; reach < 56; ) {
    const r = 2.5 + 0.24 * (reach - 9);
    list.push({ reach, r, glow: 0.06 * (1 - (0.85 * (reach - 9)) / 47) });
    reach += 0.2 * r;
  }
  return list;
})();
const n = (value: number) => value.toFixed(4);
const COS = "var(--isometric125-c)";
const SIN = "var(--isometric125-s)";
/** A slice stands square to the beam, so on screen it is a circle squeezed along the beam's heading. */
const sliceCss = (reach: number, r: number) =>
  `matrix(calc(${n(-r * C)} * (${SIN} + ${COS})), calc(${n(r * S)} * (${COS} - ${SIN})), 0, ${n(r)}, calc(${n(reach * C)} * (${COS} - ${SIN})), calc(${n(reach * S)} * (${COS} + ${SIN}) - ${LAMP_MID}))`;
// Two flat fins through the axis, one upright and one level, keep the cone solid from every side
const NEAR = SLICES[0] ?? { reach: 9, r: 2.5 };
const FAR = SLICES[SLICES.length - 1] ?? { reach: 56, r: 14 };
const FIN = Array.from({ length: 16 }, (_, index) => {
  const at = (k: number) => ({ reach: NEAR.reach + ((FAR.reach - NEAR.reach) * k) / 16, r: NEAR.r + ((FAR.r - NEAR.r) * k) / 16 });
  const [a, b] = [at(index), at(index + 1)];
  // Each band is a little fainter than the one before, so the light thins out with distance
  return { d: `M${n(a.reach)} ${n(-a.r)}L${n(b.reach)} ${n(-b.r)}V${n(b.r)}L${n(a.reach)} ${n(a.r)}Z`, glow: 0.34 * (1 - index / 16) ** 1.6 + 0.02 };
});
const HEAD_X = `calc(${n(C)} * (${COS} - ${SIN}))`;
const HEAD_Y = `calc(${n(S)} * (${COS} + ${SIN}))`;
const uprightCss = `matrix(${HEAD_X}, ${HEAD_Y}, 0, 1, 0, ${-LAMP_MID})`;
const levelCss = `matrix(${HEAD_X}, ${HEAD_Y}, calc(${n(-C)} * (${SIN} + ${COS})), calc(${n(S)} * (${COS} - ${SIN})), 0, ${-LAMP_MID})`;
// Where the beam grazes the sea, in plan units around the tower
const POOL = 37;
const poolCss = `matrix(1, 0, 0, 1, calc(${POOL} * ${COS}), calc(${POOL} * ${SIN}))`;
// The beam starts at -20 degrees and turns once; it is on the viewer's side between -45 and 135 degrees
const START = -20;
const TURN = Array.from({ length: 37 }, (_, index) => {
  const angle = ((START + index * 10) * Math.PI) / 180;
  return `${((index * 100) / 36).toFixed(2)}% { --isometric125-c: ${n(Math.cos(angle))}; --isometric125-s: ${n(Math.sin(angle))}; }`;
}).join(" ");
const FAR_FROM = (((135 - START) / 360) * 100).toFixed(2);
const FAR_TO = (((315 - START) / 360) * 100).toFixed(2);
const WAVES = [
  { x: 26, y: -28, w: 8 },
  { x: 38, y: 6, w: 6 },
  { x: -28, y: 30, w: 8 },
  { x: 8, y: 38, w: 6 },
];

const STYLES = `
@property --isometric125-c { syntax: "<number>"; inherits: true; initial-value: ${n(Math.cos((START * Math.PI) / 180))}; }
@property --isometric125-s { syntax: "<number>"; inherits: true; initial-value: ${n(Math.sin((START * Math.PI) / 180))}; }
@keyframes isometric125-sweep { ${TURN} }
@keyframes isometric125-near { 0% { opacity: 1; } ${FAR_FROM}% { opacity: 0; } ${FAR_TO}%, 100% { opacity: 1; } }
@keyframes isometric125-far { 0% { opacity: 0; } ${FAR_FROM}% { opacity: 1; } ${FAR_TO}%, 100% { opacity: 0; } }
@keyframes isometric125-glow { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.8; } }
.isometric125-light { animation: isometric125-sweep ${PERIOD}s linear infinite; }
.isometric125-near { animation: isometric125-near ${PERIOD}s step-end infinite; }
.isometric125-far { animation: isometric125-far ${PERIOD}s step-end infinite; }
.isometric125-glow { animation: isometric125-glow 2s ease-in-out infinite; }
.isometric125-pool { transform: ${poolCss}; }
.isometric125-upright { transform: ${uprightCss}; }
.isometric125-level { transform: ${levelCss}; }
${SLICES.map((slice, index) => `.isometric125-slice${index} { transform: ${sliceCss(slice.reach, slice.r)}; }`).join("\n")}
.isometric125-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric125-light, .isometric125-near, .isometric125-far, .isometric125-glow { animation: none; } }
`;

export function Isometric125({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric125Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const lamp = paint.accent;
  const beam = accent ? lamp.base : paint.body.ink;
  const id = useId();
  const cone = (
    <g className={beam}>
      {["isometric125-upright", "isometric125-level"].map((fin) => (
        <g key={fin} className={fin}>
          {FIN.map((band) => (
            <path key={band.d} d={band.d} opacity={band.glow.toFixed(3)} />
          ))}
        </g>
      ))}
      {SLICES.map((slice, index) => (
        <circle key={slice.reach} r={1} opacity={slice.glow.toFixed(3)} className={`isometric125-slice${index}`} />
      ))}
    </g>
  );
  const dome = (r: number, h: number, z: number) => {
    const [rx, ry] = [r * ELLIPSE_X, r * ELLIPSE_Y];
    const d = `M${-rx} ${-z}A${rx} ${h} 0 0 1 ${rx} ${-z}A${rx} ${ry} 0 0 1 ${-rx} ${-z}Z`;
    const half = `M0 ${-z - h}A${rx} ${h} 0 0 1 ${rx} ${-z}A${rx} ${ry} 0 0 1 0 ${-z + ry}Z`;
    return (
      <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
        <path d={d} className={paint.body.base} />
        <path d={half} stroke="none" className={paint.body.right} />
      </g>
    );
  };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric125-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-78 -150 156 188" aria-hidden="true" className="isometric125-light size-full overflow-visible">
        <defs>
          <radialGradient id={`${id}-soft`}>
            <stop offset="0%" stopColor="white" />
            <stop offset="45%" stopColor="white" stopOpacity={0.5} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </radialGradient>
          <mask id={`${id}-halo`}>
            <circle cx={0} cy={-LAMP_MID} r={22} fill={`url(#${id}-soft)`} />
          </mask>
          <mask id={`${id}-pool`}>
            <circle r={11} fill={`url(#${id}-soft)`} />
          </mask>
        </defs>
        <Cylinder r={46} z={0} h={SEA} paint={paint.body} />
        <g transform={onTop(SEA)} className={paint.body.ink}>
          {WAVES.map((wave) => (
            <rect key={wave.x} x={wave.x} y={wave.y} width={wave.w} height={2} rx={1} transform={`rotate(-45 ${wave.x} ${wave.y})`} />
          ))}
        </g>
        <g transform={onTop(SEA)}>
          <g className="isometric125-pool">
            <circle r={11} opacity={0.7} mask={`url(#${id}-pool)`} className={beam} />
          </g>
        </g>
        <Prism shape={ROCK_LOW} paint={paint.body} />
        <Prism shape={ROCK_HIGH} paint={paint.body} />
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <path d={TOWER.left} className={paint.body.base} />
          <path d={TOWER.left} stroke="none" className={paint.body.left} />
          <path d={TOWER.right} className={paint.body.base} />
          <path d={TOWER.right} stroke="none" className={paint.body.right} />
        </g>
        {BANDS.map((band) => (
          <path key={band} d={band} className={paint.body.ink} />
        ))}
        <g transform={onLeft(R_FOOT - 0.5)} className={palette === "dark" ? "fill-black/40" : "fill-black/20"}>
          <path d={`M-3.5 ${-FOOT}V${-FOOT - 8}A3.5 3.5 0 0 1 3.5 ${-FOOT - 8}V${-FOOT}Z`} />
        </g>
        <Cylinder r={R_TOP + 4} z={TOP} h={3} paint={paint.body} />
        <g className="isometric125-far opacity-0">{cone}</g>
        <circle cx={0} cy={-LAMP_MID} r={22} mask={`url(#${id}-halo)`} className={cn("isometric125-glow", beam)} opacity={0.7} />
        <Cylinder r={6} z={LAMP_Z} h={LAMP_H} paint={accent ? lamp : paint.body} />
        <g className={accent ? lamp.ink : paint.body.ink}>
          {[-3.6, 0, 3.6].map((x) => (
            <rect key={x} x={x - 0.6} y={-CAP_Z + 1} width={1.2} height={LAMP_H - 2} transform={`translate(0 ${(Math.abs(x) < 1 ? 4.2 : 3.4).toFixed(1)})`} />
          ))}
        </g>
        <Cylinder r={8.5} z={CAP_Z} h={2} paint={paint.body} />
        {dome(7.5, 9, CAP_Z + 2)}
        <Cylinder r={1.2} z={CAP_Z + 10} h={4} paint={paint.body} />
        <g className="isometric125-near">{cone}</g>
      </svg>
    </div>
  );
}
