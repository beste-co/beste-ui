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

interface Isometric41Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color one half of each capsule with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric41Demo: Isometric41Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const TRAY = 8;
const BOTTLE_R = 26;
const BOTTLE_TOP = 66;
const NECK_R = 21;
const NECK_TOP = BOTTLE_TOP + 8;
const HOLE_R = 16;
// A capsule is a round rod with domed ends; from this camera it shows as a pill outline along its axis
const CAP_HALF = 17;
const CAP_R = 7;
// The seam is a circle around the rod, seen at this squeeze along the axis
const SEAM = CAP_R / Math.sqrt(3);
const OPENING_Y = -NECK_TOP;
const at = (x: number, y: number, z: number) => ({ x: (x - y) * C, y: (x + y) * S - z });
// Loose capsules lie on the tray along one of its two directions; `turn` is the screen angle of that direction
const LOOSE = [
  { x: -14, y: 52, turn: 30, along: "x" as const, flip: false },
  { x: 20, y: 46, turn: 150, along: "y" as const, flip: true },
];
const FALLING = [
  { x: -4, y: -34, delay: "0s", flip: false },
  { x: 6, y: -66, delay: "0.7s", flip: true },
];
// Capsules already in the bottle, seen through the mouth
const INSIDE = [
  { x: -6, y: 2, turn: 30 },
  { x: 6, y: -6, turn: 150 },
  { x: 4, y: 9, turn: 96 },
];
const CAP_X = ((48 - 22) * C).toFixed(1);
const CAP_Y = ((48 + 22) * S).toFixed(1);
const RIDGES = Array.from({ length: 9 }, (_, index) => -40 + index * 20);

const STYLES = `
@keyframes isometric41-drop { 0% { transform: translateY(-26px); opacity: 0; } 12% { opacity: 1; } 52% { transform: translateY(64px); opacity: 1; } 53%, 100% { transform: translateY(64px); opacity: 0; } }
.isometric41-drop { animation: isometric41-drop 4.6s cubic-bezier(0.55, 0, 0.85, 0.4) infinite both; will-change: transform, opacity; }
.isometric41-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric41-drop { animation: none; } }
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

function band(r: number, z: number, h: number, from: number, to: number) {
  const points = Array.from({ length: 17 }, (_, k) => {
    const angle = ((from + ((to - from) * k) / 16) * Math.PI) / 180;
    return [r * Math.cos(angle), r * Math.sin(angle)] as const;
  });
  return polygon([...points.map(([x, y]): Point => [x, y, z]), ...[...points].reverse().map(([x, y]): Point => [x, y, z + h])]);
}

export function Isometric41({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric41Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const id = useId();
  const shapeId = `${id}-capsule`;
  const holeId = `${id}-hole`;
  const paint = paints(palette, accent, tone, color);

  /** One capsule at a screen point, its axis turned to a screen angle; the accent half is the one behind the seam. */
  const capsule = (key: string, x: number, y: number, turn: number, flip = false, upright = false) => {
    const angle = (turn * Math.PI) / 180;
    // The shaded side in the capsule's own turned frame: under a lying capsule, to the right of a falling one
    const down = upright ? { x: Math.cos(angle), y: -Math.sin(angle) } : { x: Math.sin(angle), y: Math.cos(angle) };
    const side = flip ? -1 : 1;
    // The seam bulges toward the end that points away from the viewer, so it shows the nearer half's color
    const nearer = upright ? side === 1 : side === -1;
    return (
      <g key={key} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${turn})`}>
        <g clipPath={`url(#${shapeId})`}>
          <rect x={-CAP_HALF} y={-CAP_R} width={CAP_HALF * 2} height={CAP_R * 2} className={paint.body.base} />
          <rect x={side === 1 ? -CAP_HALF : 0} y={-CAP_R} width={CAP_HALF} height={CAP_R * 2} className={paint.accent.base} />
          <ellipse cx={0} cy={0} rx={SEAM} ry={CAP_R} className={nearer ? paint.accent.base : paint.body.base} />
          <rect x={-CAP_HALF} y={-CAP_R} width={CAP_HALF * 2} height={CAP_R * 2} rx={CAP_R} transform={`translate(${(down.x * CAP_R * 1.1).toFixed(2)} ${(down.y * CAP_R * 1.1).toFixed(2)})`} className="fill-black/20" />
          <rect x={-CAP_HALF + 5} y={-1} width={CAP_HALF * 2 - 10} height={2} rx={1} transform={`translate(${(-down.x * CAP_R * 0.5).toFixed(2)} ${(-down.y * CAP_R * 0.5).toFixed(2)})`} className="fill-white/50" />
        </g>
        <rect x={-CAP_HALF} y={-CAP_R} width={CAP_HALF * 2} height={CAP_R * 2} rx={CAP_R} fill="none" strokeWidth={1} className={paint.body.edge} />
      </g>
    );
  };
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric41-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-92 -160 186 224" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={shapeId}>
            <rect x={-CAP_HALF} y={-CAP_R} width={CAP_HALF * 2} height={CAP_R * 2} rx={CAP_R} />
          </clipPath>
          <clipPath id={`${holeId}-fill`}>
            <ellipse cx={0} cy={OPENING_Y} rx={HOLE_R * 1.2247} ry={HOLE_R * 0.7071} />
          </clipPath>
          <clipPath id={holeId}>
            <rect x={-60} y={-200} width={120} height={200 + OPENING_Y} />
            <ellipse cx={0} cy={OPENING_Y} rx={HOLE_R * 1.22} ry={HOLE_R * 0.7} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(-40, -40, 0, 112, 104, TRAY, 18)} paint={paint.body} />
        <RoundBlock shape={cylinder(0, 0, TRAY, BOTTLE_TOP - TRAY, BOTTLE_R)} paint={paint.body} />
        <polygon points={band(BOTTLE_R, 24, 30, -45, 135)} className={paint.body.ink} />
        <polygon points={band(BOTTLE_R, 44, 3, 20, 80)} className={paint.body.base} />
        <polygon points={band(BOTTLE_R, 36, 3, 20, 60)} className={paint.body.base} />
        <RoundBlock shape={cylinder(0, 0, BOTTLE_TOP, NECK_TOP - BOTTLE_TOP, NECK_R)} paint={paint.body} />
        <g transform={onTop(NECK_TOP)} className={paint.body.ink}>
          <circle cx={0} cy={0} r={HOLE_R} />
        </g>
        <g clipPath={`url(#${holeId}-fill)`}>
          {INSIDE.map((item) => capsule(`in${item.turn}`, item.x * 1.2, OPENING_Y + 5 + item.y * 0.7, item.turn))}
          <ellipse cx={0} cy={OPENING_Y} rx={HOLE_R * 1.2247} ry={HOLE_R * 0.7071} className="fill-black/20" />
        </g>
        <g clipPath={`url(#${holeId})`}>
          {FALLING.map((item) => (
            <g key={item.delay} className="isometric41-drop" style={{ animationDelay: item.delay }}>
              {capsule(item.delay, item.x, OPENING_Y + item.y, 90, item.flip, true)}
            </g>
          ))}
        </g>
        <RoundBlock shape={cylinder(48, 22, TRAY, 14, 18)} paint={paint.body} />
        {RIDGES.map((angle) => (
          <polygon key={angle} points={band(18.2, TRAY + 2, 10, angle, angle + 6)} transform={`translate(${CAP_X} ${CAP_Y})`} className={paint.body.ink} />
        ))}
        <g transform={onTop(TRAY + 14)} className={paint.body.ink}>
          <circle cx={48} cy={22} r={12} />
        </g>
        <g transform={onTop(TRAY)} className="fill-black/10">
          {LOOSE.map((item) => (
            <rect
              key={item.turn}
              x={item.x - (item.along === "x" ? CAP_HALF + 1 : CAP_R)}
              y={item.y - (item.along === "x" ? CAP_R : CAP_HALF + 1) + 2}
              width={item.along === "x" ? 2 * CAP_HALF + 2 : 2 * CAP_R}
              height={item.along === "x" ? 2 * CAP_R : 2 * CAP_HALF + 2}
              rx={CAP_R}
            />
          ))}
        </g>
        {LOOSE.map((item) => {
          const point = at(item.x, item.y, TRAY + CAP_R);
          return capsule(`loose${item.turn}`, point.x, point.y, item.turn, item.flip);
        })}
      </svg>
    </div>
  );
}
