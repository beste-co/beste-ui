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

interface Isometric175Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the water with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric175Demo: Isometric175Props = {
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

const BASIN = { r: 48, wall: 5, h: 12, water: 9 };
const BOWL = { r: 23, z: 36, h: 5, water: 39.5 };
const TIP = 52;
const rad = (degrees: number) => (degrees * Math.PI) / 180;
/** Move to the plan point (x, y) on the ground. */
const at = (x: number, y: number) => `translate(${((x - y) * C).toFixed(1)} ${((x + y) * S).toFixed(1)})`;

// Water spills over the rim of the upper bowl at eight points and falls straight down
const SPILLS = [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => ({ angle, x: BOWL.r * Math.cos(rad(angle)), y: BOWL.r * Math.sin(rad(angle)) }));
// Seen from here, a spill is behind the column when it falls on the far side
const FAR = SPILLS.filter((spill) => spill.x + spill.y < -1);
const NEAR = SPILLS.filter((spill) => spill.x + spill.y >= -1);
const DROP = BOWL.z + 1 - BASIN.water;
// Four jets leave the tip, arc over and land in the upper bowl
const REACH = 13;
const jet = (side: 1 | -1) => `M0 ${-TIP}Q${side * REACH * 0.5} ${-TIP - 26} ${side * REACH} ${-BOWL.water}`;

const STYLES = `
@keyframes isometric175-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -10; } }
@keyframes isometric175-ring { 0% { transform: scale(0.3); opacity: 0; } 15% { opacity: 0.9; } 100% { transform: scale(1); opacity: 0; } }
.isometric175-flow { animation: isometric175-flow 0.7s linear infinite; }
.isometric175-ring { animation: isometric175-ring 2.4s ease-out infinite; }
.isometric175-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric175-flow, .isometric175-ring { animation: none; } }
`;

export function Isometric175({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric175Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const basinId = useId();
  const bowlId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const water = paint.accent;
  const flow = !accent
    ? palette === "dark" ? "stroke-zinc-500" : palette === "tone" ? "stroke-white/70" : palette === "light" ? "stroke-zinc-400" : "stroke-foreground/40"
    : palette === "tone" ? "stroke-current" : "stroke-current";
  const ripple = !accent ? body.edge : palette === "tone" ? "stroke-black/30" : "stroke-white/70";
  const inner = BASIN.r - BASIN.wall;

  const Spill = ({ x, y, index }: { x: number; y: number; index: number }) => (
    <g transform={at(x, y)}>
      <line x1={0} y1={-BOWL.z - 1} x2={0} y2={-BASIN.water} strokeWidth={2} strokeLinecap="round" strokeDasharray="6 4" className={cn("isometric175-flow", flow)} style={{ animationDelay: `${(-index * 0.09).toFixed(2)}s` }} />
    </g>
  );
  const Jet = ({ plane, side }: { plane: string; side: 1 | -1 }) => (
    <g transform={plane}>
      <path d={jet(side)} fill="none" strokeWidth={2} strokeLinecap="round" strokeDasharray="6 4" className={cn("isometric175-flow", flow)} />
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric175-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-82 -100 164 164" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={basinId}>
            <circle r={inner} transform={onTop(BASIN.h)} />
          </clipPath>
          <clipPath id={bowlId}>
            <circle r={BOWL.r - 3} transform={onTop(BOWL.z + BOWL.h)} />
          </clipPath>
        </defs>
        <RoundBlock shape={cylinder(0, 0, 0, 3, BASIN.r + 4)} paint={body} />
        <RoundBlock shape={cylinder(0, 0, 3, BASIN.h - 3, BASIN.r)} paint={body} />
        <g clipPath={`url(#${basinId})`}>
          <circle r={inner} transform={onTop(BASIN.h)} className={body.base} />
          <circle r={inner} transform={onTop(BASIN.h)} className={body.right} />
          <circle r={inner} transform={onTop(BASIN.water)} className={water.base} />
          <g transform={onTop(BASIN.water)} fill="none" strokeWidth={1.5} className={ripple}>
            {SPILLS.map((spill, index) => (
              <g key={spill.angle} transform={`translate(${spill.x.toFixed(1)} ${spill.y.toFixed(1)})`}>
                <circle r={9} vectorEffect="non-scaling-stroke" className="isometric175-ring opacity-0" style={{ animationDelay: `${(-index * 0.9).toFixed(1)}s` }} />
              </g>
            ))}
          </g>
        </g>
        <circle r={inner} transform={onTop(BASIN.h)} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={body.edge} />
        {FAR.map((spill, index) => (
          <Spill key={spill.angle} x={spill.x} y={spill.y} index={index} />
        ))}
        <RoundBlock shape={cylinder(0, 0, BASIN.water - 2, 4, 10)} paint={body} />
        <RoundBlock shape={cylinder(0, 0, BASIN.water + 2, BOWL.z - 6 - BASIN.water - 2, 6)} paint={body} />
        <RoundBlock shape={cylinder(0, 0, BOWL.z - 6, 3, 10)} paint={body} />
        <RoundBlock shape={cylinder(0, 0, BOWL.z - 3, 3, 16)} paint={body} />
        <RoundBlock shape={cylinder(0, 0, BOWL.z, BOWL.h, BOWL.r)} paint={body} />
        <g clipPath={`url(#${bowlId})`}>
          <circle r={BOWL.r - 3} transform={onTop(BOWL.z + BOWL.h)} className={body.base} />
          <circle r={BOWL.r - 3} transform={onTop(BOWL.z + BOWL.h)} className={body.right} />
          <circle r={BOWL.r - 3} transform={onTop(BOWL.water)} className={water.base} />
        </g>
        <circle r={BOWL.r - 3} transform={onTop(BOWL.z + BOWL.h)} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={body.edge} />
        <Jet plane={onLeft(0)} side={-1} />
        <Jet plane={onRight(0)} side={-1} />
        <RoundBlock shape={cylinder(0, 0, BOWL.water - 1, 6, 5)} paint={body} />
        <RoundBlock shape={cylinder(0, 0, BOWL.water + 5, TIP - BOWL.water - 5, 2.5)} paint={body} />
        <Jet plane={onLeft(0)} side={1} />
        <Jet plane={onRight(0)} side={1} />
        <line x1={0} y1={-TIP} x2={0} y2={-TIP - 14} strokeWidth={2} strokeLinecap="round" strokeDasharray="6 4" className={cn("isometric175-flow", flow)} />
        {NEAR.map((spill, index) => (
          <Spill key={spill.angle} x={spill.x} y={spill.y} index={index + 3} />
        ))}
      </svg>
    </div>
  );
}
