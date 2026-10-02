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

interface Isometric102Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the umbrella stripes with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric102Demo: Isometric102Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

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
const screen = (point: Point) => project(point).split(",").map(Number) as [number, number];
const RX = C * Math.SQRT2;
const RY = S * Math.SQRT2;

const W = 76;
const D = 40;
const LIFT = 12;
const H = 38;
const TOP = LIFT + H;
const WHEEL = { x: 54, z: 14, r: 14 };
const POLE = { x: 16, y: 20, top: 118 };
const CANOPY = { r: 40, z: 106, h: 22, panels: 12 };
const CONE = { x: 58, y: 22, z: TOP + 4, h: 24, r: 7 };
const SCOOP_R = 8;

// The canopy is a cone about the pole: its rim is an ellipse on screen and its tip sits CANOPY.h above the rim center
const [PX, PY] = screen([POLE.x, POLE.y, CANOPY.z]);
const CRX = CANOPY.r * RX;
const CRY = CANOPY.r * RY;
const PITCH = 360 / CANOPY.panels;
const SPLIT = 3;
const TURN = 2 * PITCH;
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const n = (value: number) => value.toFixed(3);
/** Screen offset from the tip to the rim point at an angle, as calc() parts that follow the turn. */
function spoke(degrees: number) {
  const cos = Math.cos(rad(degrees));
  const sin = Math.sin(rad(degrees));
  return [
    `calc(${n(-CRX * cos)} * var(--isometric102-c) + ${n(CRX * sin)} * var(--isometric102-s))`,
    `calc(${n(CANOPY.h)} + ${n(-CRY * sin)} * var(--isometric102-c) + ${n(-CRY * cos)} * var(--isometric102-s))`,
  ] as const;
}
/** Maps the unit triangle onto the tip and two rim points, so a slice of the cone turns with the canopy. */
function slice(from: number, to: number) {
  const [a, b] = spoke(from);
  const [c, d] = spoke(to);
  return `matrix(${a}, ${b}, ${c}, ${d}, ${n(PX)}, ${n(PY - CANOPY.h)})`;
}
// Each panel is cut into a few slices so the rim stays round; they overlap a touch to hide hairlines
const SLICES = Array.from({ length: CANOPY.panels * SPLIT }, (_, index) => {
  const from = (index * PITCH) / SPLIT;
  return { index, panel: Math.floor(index / SPLIT), seam: index % SPLIT === 0, fill: slice(from, from + PITCH / SPLIT + 0.6), edge: slice(from, from + PITCH / SPLIT) };
});
// The light stays put while the stripes turn: the right half of the cone is in shade
const SHADE = `M${n(PX)} ${n(PY - CANOPY.h)} L${n(PX)} ${n(PY - CRY)} A${n(CRX)} ${n(CRY)} 0 0 1 ${n(PX)} ${n(PY + CRY)} Z`;
const STOPS = Array.from({ length: 7 }, (_, index) => `${((index * 100) / 6).toFixed(2)}% { --isometric102-c: ${Math.cos(rad((index * TURN) / 6)).toFixed(4)}; --isometric102-s: ${Math.sin(rad((index * TURN) / 6)).toFixed(4)}; }`).join(" ");

const STYLES = `
@property --isometric102-c { syntax: "<number>"; inherits: true; initial-value: 1; }
@property --isometric102-s { syntax: "<number>"; inherits: true; initial-value: 0; }
@keyframes isometric102-turn { ${STOPS} }
.isometric102-turn { animation: isometric102-turn 9s linear infinite; }
.isometric102-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric102-turn { animation: none; } }
`;

export function Isometric102({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric102Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const id = useId();
  const coneId = `${id}-cone`;
  const scoopId = `${id}-scoop`;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const stripe = paint.accent;
  const scoop = body;

  const [cx, cy] = screen([CONE.x, CONE.y, CONE.z + CONE.h]);
  const [, tipY] = screen([CONE.x, CONE.y, CONE.z]);
  const corx = CONE.r * RX + 1;
  const cory = CONE.r * RY + 0.6;
  const cone = `M${cx - corx} ${cy} L${cx} ${tipY} L${cx + corx} ${cy} A${corx} ${cory} 0 0 1 ${cx - corx} ${cy} Z`;
  const sr = SCOOP_R * RX;
  const sy = cy - sr * 0.55;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric102-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-60 -124 134 182" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={coneId}>
            <path d={cone} />
          </clipPath>
          <clipPath id={scoopId}>
            <circle cx={cx} cy={sy} r={sr} />
          </clipPath>
        </defs>
        <Block faces={box(-16, 6, TOP - 6, 16, 3, 3)} paint={body} />
        <Block faces={box(-19, 6, TOP - 6, 3, D - 12, 3)} paint={body} />
        <Block faces={box(-16, D - 9, TOP - 6, 16, 3, 3)} paint={body} />
        <Block faces={box(6, D - 10, 0, 5, 5, LIFT)} paint={body} />
        <Block faces={box(0, 0, LIFT, W, D, H)} paint={body} />
        <g transform={onLeft(D)} className={body.ink}>
          <rect x={6} y={-TOP + 6} width={W - 12} height={3} rx={1.5} />
          <rect x={10} y={-TOP + 14} width={30} height={18} rx={4} />
        </g>
        <g transform={onTop(TOP)} className={body.ink}>
          <circle cx={36} cy={12} r={7} />
          <circle cx={36} cy={28} r={7} />
        </g>
        {Array.from({ length: 4 }, (_, k) => (
          <g key={k} transform={onLeft(D + k)}>
            <circle cx={WHEEL.x} cy={-WHEEL.z} r={WHEEL.r} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, k === 0 && body.edge)} />
            <circle cx={WHEEL.x} cy={-WHEEL.z} r={WHEEL.r} className={body.right} />
          </g>
        ))}
        <g transform={onLeft(D + 4)}>
          <circle cx={WHEEL.x} cy={-WHEEL.z} r={WHEEL.r} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
          <circle cx={WHEEL.x} cy={-WHEEL.z} r={WHEEL.r - 3} className={body.ink} />
          <circle cx={WHEEL.x} cy={-WHEEL.z} r={WHEEL.r - 5} className={body.base} />
          <circle cx={WHEEL.x} cy={-WHEEL.z} r={3} className={body.ink} />
        </g>
        <RoundBlock shape={cylinder(POLE.x, POLE.y, TOP, CANOPY.z - TOP, 1.6)} paint={body} />
        <g className="isometric102-turn">
          {SLICES.map((part) => (
            <g key={part.index} style={{ transform: part.fill }}>
              <path d="M0 0L1 0L0 1Z" className={part.panel % 2 === 0 ? stripe.base : body.base} />
              {part.panel % 2 === 0 && stripe === body && <path d="M0 0L1 0L0 1Z" className={body.ink} />}
            </g>
          ))}
          <path d={SHADE} className={body.left} />
          <g strokeWidth={1} strokeLinecap="round" className={body.edge}>
            {SLICES.filter((part) => part.seam).map((part) => (
              <g key={part.index} style={{ transform: part.edge }}>
                <line x1={0} y1={0} x2={1} y2={0} vectorEffect="non-scaling-stroke" />
              </g>
            ))}
            <ellipse cx={PX} cy={PY} rx={CRX} ry={CRY} fill="none" />
          </g>
        </g>
        <RoundBlock shape={cylinder(POLE.x, POLE.y, CANOPY.z + CANOPY.h - 1, 3, 2.4)} paint={body} />
        <RoundBlock shape={cylinder(CONE.x, CONE.y, TOP, 4, 9)} paint={body} />
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <path d={cone} className={body.base} />
        </g>
        <g clipPath={`url(#${coneId})`} className={body.ink}>
          {[-12, -6, 0, 6, 12].map((offset) => (
            <g key={offset}>
              <rect x={cx + offset - 0.6} y={cy - 4} width={1.2} height={34} transform={`rotate(28 ${cx + offset} ${cy})`} />
              <rect x={cx + offset - 0.6} y={cy - 4} width={1.2} height={34} transform={`rotate(-28 ${cx + offset} ${cy})`} />
            </g>
          ))}
          <rect x={cx} y={cy - 4} width={20} height={34} className={body.right} />
        </g>
        <g>
          <g>
            <circle cx={cx} cy={sy} r={sr} strokeWidth={1} className={cn(scoop.base, scoop.edge)} />
            <g clipPath={`url(#${scoopId})`}>
              <rect x={cx} y={sy - sr} width={sr} height={sr * 2} className={scoop.left} />
              <path d={`M${cx - sr} ${sy + 3} q${sr / 4} 4 ${sr / 2} 0 t${sr / 2} 0 t${sr / 2} 0 t${sr / 2} 0 V${sy + sr} H${cx - sr} Z`} className={scoop.right} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
