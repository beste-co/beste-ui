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

interface Isometric62Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the luggage tag with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric62Demo: Isometric62Props = {
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

const W = 60;
const D = 32;
const BASE = 16;
const TOP = 100;
const CASE = roundBox(0, 0, BASE, W, D, TOP - BASE, 8);
const WHEELS = [[4, 4], [W - 12, 4], [4, D - 12], [W - 12, D - 12]].map(([x, y]) => roundBox(x as number, y as number, 8, 8, 8, 8, 4));
const RIBS = [12, 22, 32];
// Handle rods rise out of the top face; only what is above it shows
const RODS = [box(14, 14, TOP - 30, 4, 4, 62), box(42, 14, TOP - 30, 4, 4, 62)];
const GRIP = box(12, 13, TOP + 32, 36, 6, 6);
const COLUMNS = [14, 42].map((x) => polygon([[x, 18, TOP], [x, 18, TOP + 200], [x + 4, 14, TOP + 200], [x + 4, 14, TOP], [x + 4, 18, TOP]]));

const STYLES = `
@keyframes isometric62-handle { 0%, 8% { transform: translateY(28px); } 30%, 72% { transform: translateY(0); } 92%, 100% { transform: translateY(28px); } }
@keyframes isometric62-swing { 0%, 28% { transform: rotate(0deg); } 36% { transform: rotate(14deg); } 44% { transform: rotate(-9deg); } 52% { transform: rotate(5deg); } 60% { transform: rotate(-2deg); } 66%, 100% { transform: rotate(0deg); } }
.isometric62-handle { animation: isometric62-handle 5s cubic-bezier(0.45, 0, 0.2, 1) infinite; will-change: transform; }
.isometric62-tag { animation: isometric62-swing 5s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 0; }
.isometric62-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric62-handle, .isometric62-tag { animation: none; } }
`;

export function Isometric62({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric62Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const tag = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric62-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-62 -140 140 204" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            {COLUMNS.map((points) => (
              <polygon key={points} points={points} />
            ))}
          </clipPath>
        </defs>
        <Block faces={box(-12, -12, 0, W + 24, D + 24, 8)} paint={paint.body} />
        {WHEELS.map((shape, index) => (
          <RoundBlock key={index} shape={shape} paint={paint.body} />
        ))}
        <RoundBlock shape={CASE} paint={paint.body} />
        <g transform={onLeft(D)} className={paint.body.ink}>
          {RIBS.map((x) => (
            <rect key={x} x={x - 1.5} y={-TOP + 10} width={3} height={TOP - BASE - 20} rx={1.5} />
          ))}
        </g>
        <g transform={onRight(W)} className={paint.body.ink}>
          <rect x={10} y={-TOP + 10} width={3} height={TOP - BASE - 20} rx={1.5} />
          <rect x={19} y={-TOP + 10} width={3} height={TOP - BASE - 20} rx={1.5} />
        </g>
        <g transform={onTop(TOP)} className={paint.body.ink}>
          <rect x={12} y={12} width={8} height={8} rx={2} />
          <rect x={40} y={12} width={8} height={8} rx={2} />
          <rect x={22} y={22} width={16} height={4} rx={2} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric62-handle">
            {RODS.map((faces, index) => (
              <Block key={index} faces={faces} paint={paint.body} />
            ))}
          </g>
        </g>
        <g className="isometric62-handle">
          <Block faces={GRIP} paint={paint.body} />
        </g>
        <g className="isometric62-tag">
          <g transform={onLeft(D + 1)}>
            <rect x={46} y={-TOP + 2} width={2} height={14} rx={1} className={tag.base} />
            <rect x={46} y={-TOP + 2} width={2} height={14} rx={1} className={tag.right} />
            <g className={tag.edge} strokeWidth={1}>
              <rect x={38} y={-TOP + 14} width={18} height={26} rx={3} className={tag.base} vectorEffect="non-scaling-stroke" />
              <rect x={38} y={-TOP + 14} width={18} height={26} rx={3} className={tag.left} stroke="none" />
            </g>
            <circle cx={47} cy={-TOP + 20} r={2.5} className={tag.ink} />
            <rect x={42} y={-TOP + 27} width={10} height={2} rx={1} className={tag.ink} />
            <rect x={42} y={-TOP + 32} width={7} height={2} rx={1} className={tag.ink} />
          </g>
        </g>
      </svg>
    </div>
  );
}
