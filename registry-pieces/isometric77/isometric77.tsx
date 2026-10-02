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

interface Isometric77Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the kibble with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric77Demo: Isometric77Props = {
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

const MAT_H = 6;
const BOWL = { x: 48, y: 48 };
const BASE_R = 28;
const TOP_R = 38;
const RIM = 6;
const BOWL_H = 22;
const FILL_DROP = 10;
// Kibble packed in rings over the surface, in plan offsets from the bowl center, back to front
const KIBBLE = [0, 10, 20]
  .flatMap((r, ring) => {
    const count = ring === 0 ? 1 : ring * 7;
    return Array.from({ length: count }, (_, index) => {
      const a = ((index + ring * 0.5) / count) * Math.PI * 2;
      return { dx: r * Math.cos(a), dy: r * Math.sin(a), lift: 6 - ring * 2.5 };
    });
  })
  .sort((p, q) => p.dx + p.dy - (q.dx + q.dy));
const FALLING = [
  { x: -6, delay: 0 },
  { x: 7, delay: 0.35 },
  { x: 0, delay: 0.7 },
];

const STYLES = `
@keyframes isometric77-fill { 0%, 8% { transform: translateY(${FILL_DROP}px); } 56%, 88% { transform: translateY(0); } 100% { transform: translateY(${FILL_DROP}px); } }
@keyframes isometric77-drop { 0%, 6% { transform: translateY(-34px); opacity: 0; } 12% { opacity: 1; } 24% { transform: translateY(0); opacity: 1; } 28%, 100% { transform: translateY(0); opacity: 0; } }
.isometric77-fill { animation: isometric77-fill 4.8s cubic-bezier(0.3, 0, 0.3, 1) infinite; }
.isometric77-drop { animation: isometric77-drop 1.6s ease-in infinite; }
.isometric77-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric77-fill, .isometric77-drop { animation: none; } }
`;

export function Isometric77({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric77Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clip = useId();
  const paint = paints(palette, accent, tone, color);
  const kibble = accent ? paint.accent : paint.body;
  const [bx, by] = at(BOWL.x, BOWL.y, MAT_H);
  const [, ty] = at(BOWL.x, BOWL.y, MAT_H + BOWL_H);
  const e = (r: number) => ({ rx: r * RX, ry: r * RY });
  const bottom = e(BASE_R);
  const top = e(TOP_R);
  const hole = e(TOP_R - RIM);
  const side = (half: "left" | "right" | "all") => {
    const l = `M${bx - top.rx} ${ty}L${bx - bottom.rx} ${by}A${bottom.rx} ${bottom.ry} 0 0 0 ${half === "left" ? bx : bx + bottom.rx} ${by + (half === "left" ? bottom.ry : 0)}`;
    if (half === "left") return `${l}L${bx} ${ty + top.ry}A${top.rx} ${top.ry} 0 0 1 ${bx - top.rx} ${ty}Z`;
    if (half === "right")
      return `M${bx + top.rx} ${ty}L${bx + bottom.rx} ${by}A${bottom.rx} ${bottom.ry} 0 0 1 ${bx} ${by + bottom.ry}L${bx} ${ty + top.ry}A${top.rx} ${top.ry} 0 0 0 ${bx + top.rx} ${ty}Z`;
    return `${l}L${bx + top.rx} ${ty}A${top.rx} ${top.ry} 0 0 1 ${bx - top.rx} ${ty}Z`;
  };
  const surface = ty + 3;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric77-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-84 -26 204 134" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clip}>
            <ellipse cx={bx} cy={ty} rx={hole.rx} ry={hole.ry} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 128, 96, MAT_H, 18)} paint={paint.body} />
        <g transform={onTop(MAT_H)} className={paint.body.ink}>
          <g transform="translate(104 60) scale(1.3) translate(-106 -44)">
            <ellipse cx={106} cy={50} rx={10} ry={9} />
            <ellipse cx={92} cy={44} rx={4} ry={5} />
            <ellipse cx={98} cy={34} rx={4} ry={5} />
            <ellipse cx={110} cy={33} rx={4} ry={5} />
            <ellipse cx={119} cy={40} rx={4} ry={5} />
          </g>
        </g>
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <path d={side("all")} className={paint.body.base} />
          <path d={side("left")} stroke="none" className={paint.body.left} />
          <path d={side("right")} stroke="none" className={paint.body.right} />
          <ellipse cx={bx} cy={ty} rx={top.rx} ry={top.ry} className={paint.body.base} />
        </g>
        <ellipse cx={bx} cy={ty} rx={hole.rx} ry={hole.ry} className={paint.body.base} />
        <ellipse cx={bx} cy={ty} rx={hole.rx} ry={hole.ry} className={paint.body.right} />
        <g clipPath={`url(#${clip})`}>
          <g className="isometric77-fill">
            <ellipse cx={bx} cy={surface} rx={hole.rx} ry={hole.ry} className={kibble.base} />
            <ellipse cx={bx} cy={surface} rx={hole.rx} ry={hole.ry} className={kibble.right} />
            {KIBBLE.map((item, index) => {
              const cx = bx + (item.dx - item.dy) * C;
              const cy = surface + (item.dx + item.dy) * S - item.lift;
              return (
                <g key={index}>
                  <circle cx={cx} cy={cy} r={6} strokeWidth={1} className={cn(kibble.base, kibble.edge)} />
                  <circle cx={cx} cy={cy} r={6} className={kibble.right} />
                  <circle cx={cx - 0.8} cy={cy - 1.2} r={4.4} className={kibble.base} />
                </g>
              );
            })}
          </g>
        </g>
        {FALLING.map((item) => (
          <circle
            key={item.x}
            cx={bx + item.x}
            cy={surface - 6}
            r={3.2}
            className={cn("isometric77-drop opacity-0", kibble.base)}
            style={{ animationDelay: `${item.delay}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
