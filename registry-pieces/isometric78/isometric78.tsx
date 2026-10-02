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

interface Isometric78Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the sun with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric78Demo: Isometric78Props = {
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

/** Screen point of a plan position. */
const at = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * S - z] as const;
// A plan circle of radius r projects to an ellipse with these radii; a sphere to a circle of RX
const RX = C * Math.SQRT2;
const RY = S * Math.SQRT2;

const PLATE = 8;
const HOUSE = { x: 8, y: 32, w: 50, d: 42, h: 30 };
const EAVE = PLATE + HOUSE.h;
const RIDGE = EAVE + 18;
const MID = HOUSE.y + HOUSE.d / 2;
const X0 = HOUSE.x - 3;
const X1 = HOUSE.x + HOUSE.w + 3;
const BACK = polygon([[X0, HOUSE.y - 4, EAVE], [X1, HOUSE.y - 4, EAVE], [X1, MID, RIDGE], [X0, MID, RIDGE]]);
const FRONT = polygon([[X0, MID, RIDGE], [X1, MID, RIDGE], [X1, HOUSE.y + HOUSE.d + 4, EAVE], [X0, HOUSE.y + HOUSE.d + 4, EAVE]]);
const GABLE = polygon([[HOUSE.x + HOUSE.w, HOUSE.y, EAVE], [HOUSE.x + HOUSE.w, MID, RIDGE], [HOUSE.x + HOUSE.w, HOUSE.y + HOUSE.d, EAVE]]);
const THERMO = { x: 86, y: 52, r: 8, h: 50 };
// The cloud and sun are drawn facing the viewer: lobes that merge into one puffy shape on a flat base
const CLOUD = { x: 0, y: -52 };
const LOBES: [number, number, number][] = [
  [-23, 3, 10],
  [-9, -5, 14],
  [8, -9, 17],
  [24, 0, 12],
  [34, 6, 7],
];
const BASE = { x: -33, y: -1, w: 74, h: 14 };
const SUN = { x: 27, y: -70, r: 14 };
// Hidden, the sun sits behind the biggest lobe
const HIDE = { x: CLOUD.x + 8 - SUN.x, y: CLOUD.y - 8 - SUN.y };
const RAYS = Array.from({ length: 8 }, (_, index) => index * 45);
const TICKS = [0, 1, 2, 3, 4];

const STYLES = `
@keyframes isometric78-sun { 0%, 10% { transform: translate(0, 0); } 40%, 60% { transform: translate(${HIDE.x}px, ${HIDE.y}px); } 90%, 100% { transform: translate(0, 0); } }
@keyframes isometric78-rays { 0%, 12% { opacity: 1; } 34%, 66% { opacity: 0; } 88%, 100% { opacity: 1; } }
@keyframes isometric78-level { 0%, 10% { transform: scaleY(1); } 40%, 60% { transform: scaleY(0.4); } 90%, 100% { transform: scaleY(1); } }
@keyframes isometric78-float { 0%, 100% { transform: translate(-3px, 0); } 50% { transform: translate(3px, -2px); } }
.isometric78-sun { animation: isometric78-sun 6s ease-in-out infinite; }
.isometric78-rays { animation: isometric78-rays 6s ease-in-out infinite; }
.isometric78-level { animation: isometric78-level 6s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom; }
.isometric78-cloud { animation: isometric78-float 9s ease-in-out infinite; }
.isometric78-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric78-sun, .isometric78-rays, .isometric78-level, .isometric78-cloud { animation: none; } }
`;

export function Isometric78({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric78Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const sun = paint.accent;
  const clipId = useId();
  const level = accent ? sun.base : palette === "tone" ? "fill-black/30" : paint.body.ink;
  const rim = palette === "tone" && accent ? "stroke-current" : sun.edge;
  const [tx, ty] = at(THERMO.x, THERMO.y, PLATE);
  const tubeTop = ty + THERMO.r * RY - THERMO.h + 8;
  const tubeBottom = ty + THERMO.r * RY - 14;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric78-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-76 -98 170 188" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 12, 0, 100, 70, PLATE, 16)} paint={paint.body} />
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={BACK} className={paint.body.base} />
        </g>
        <Block faces={box(HOUSE.x, HOUSE.y, PLATE, HOUSE.w, HOUSE.d, HOUSE.h)} paint={paint.body} />
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={GABLE} className={paint.body.base} />
          <polygon points={GABLE} stroke="none" className={paint.body.right} />
          <polygon points={FRONT} className={paint.body.base} />
          <polygon points={FRONT} stroke="none" className={paint.body.left} />
        </g>
        <g transform={onLeft(HOUSE.y + HOUSE.d)} className={paint.body.ink}>
          <rect x={HOUSE.x + 8} y={-PLATE - 20} width={12} height={20} rx={2} />
          <rect x={HOUSE.x + 28} y={-PLATE - 22} width={12} height={10} rx={2} />
        </g>
        <g transform={onRight(HOUSE.x + HOUSE.w)} className={paint.body.ink}>
          <rect x={HOUSE.y + 14} y={-PLATE - 22} width={12} height={10} rx={2} />
        </g>
        <defs>
          <clipPath id={`${clipId}-roof`}>
            <polygon points={FRONT} />
          </clipPath>
          <clipPath id={`${clipId}-cloud`}>
            <rect x={BASE.x} y={BASE.y} width={BASE.w} height={BASE.h} rx={BASE.h / 2} />
            {LOBES.map(([x, y, r]) => (
              <circle key={x} cx={x} cy={y} r={r} />
            ))}
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId}-roof)`}>
          <ellipse cx={-14} cy={0} rx={26} ry={9} transform="rotate(30 -14 0)" className="fill-black/10" />
        </g>
        <g className="isometric78-sun">
          <g className="isometric78-rays" transform={`translate(${SUN.x} ${SUN.y})`}>
            {RAYS.map((turn) => (
              <rect key={turn} x={-1.5} y={-SUN.r - 9} width={3} height={6} rx={1.5} transform={`rotate(${turn})`} strokeWidth={1} className={cn(sun.base, rim)} />
            ))}
          </g>
          <circle cx={SUN.x} cy={SUN.y} r={SUN.r} strokeWidth={palette === "tone" && accent ? 1.5 : 1} className={cn(sun.base, rim)} />
        </g>
        <g className="isometric78-cloud">
          <g transform={`translate(${CLOUD.x} ${CLOUD.y})`}>
            {/* One outline around the whole cloud: stroke every part first, then fill over the inner strokes */}
            <g fill="none" strokeWidth={2} className={paint.body.edge === "stroke-transparent" ? "stroke-black/15" : paint.body.edge}>
              <rect x={BASE.x} y={BASE.y} width={BASE.w} height={BASE.h} rx={BASE.h / 2} />
              {LOBES.map(([x, y, r]) => (
                <circle key={x} cx={x} cy={y} r={r} />
              ))}
            </g>
            <g className={paint.body.base}>
              <rect x={BASE.x} y={BASE.y} width={BASE.w} height={BASE.h} rx={BASE.h / 2} />
              {LOBES.map(([x, y, r]) => (
                <circle key={x} cx={x} cy={y} r={r} />
              ))}
            </g>
            <g clipPath={`url(#${clipId}-cloud)`}>
              <rect x={BASE.x} y={5} width={BASE.w} height={12} className={paint.body.right} />
              <ellipse cx={4} cy={5} rx={34} ry={5} className={paint.body.left} />
            </g>
          </g>
        </g>
        <RoundBlock shape={roundBox(THERMO.x - THERMO.r, THERMO.y - THERMO.r, PLATE, THERMO.r * 2, THERMO.r * 2, THERMO.h, THERMO.r)} paint={paint.body} />
        <g className={paint.body.ink}>
          {TICKS.map((index) => (
            <rect key={index} x={tx + 4} y={tubeTop + 4 + index * 5} width={index % 2 ? 2 : 3.5} height={1} />
          ))}
        </g>
        <rect x={tx - 2.5} y={tubeTop} width={5} height={tubeBottom - tubeTop + 2} rx={2.5} className={paint.body.ink} />
        <rect x={tx - 1.5} y={tubeTop + 6} width={3} height={tubeBottom - tubeTop - 4} rx={1.5} className={cn("isometric78-level", level)} />
        <circle cx={tx} cy={tubeBottom + 3} r={5} className={paint.body.base} />
        <circle cx={tx} cy={tubeBottom + 3} r={5} className={paint.body.ink} />
        <circle cx={tx} cy={tubeBottom + 3} r={3.5} className={level} />
      </svg>
    </div>
  );
}
