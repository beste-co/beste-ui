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

interface Isometric43Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the cross on the lid with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric43Demo: Isometric43Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 104;
const D = 72;
const H = 40;
const LID = 12;
const RIM = 6;
// Only what rises above the rim of the open case shows
const MOUTH = polygon([
  [RIM, D - RIM, H],
  [W - RIM, D - RIM, H],
  [W - RIM, RIM, H],
  [W - RIM, RIM, H + 200],
  [RIM, RIM, H + 200],
  [RIM, D - RIM, H + 200],
]);

const CROSS = `M${W / 2 - 8} ${D / 2 - 22}h16v14h14v16h-14v14h-16v-14h-14v-16h14Z`;

const STYLES = `
@keyframes isometric43-lid { 0%, 12% { transform: translateY(0); } 30%, 72% { transform: translateY(-50px); } 86%, 100% { transform: translateY(0); } }
@keyframes isometric43-rise { 0%, 20% { transform: translateY(0); } 38%, 66% { transform: translateY(-16px); } 80%, 100% { transform: translateY(0); } }
.isometric43-lid { animation: isometric43-lid 5.2s cubic-bezier(0.45, 0, 0.25, 1) infinite; will-change: transform; }
.isometric43-rise { animation: isometric43-rise 5.2s cubic-bezier(0.45, 0, 0.25, 1) infinite; will-change: transform; }
.isometric43-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric43-lid, .isometric43-rise { animation: none; } }
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

export function Isometric43({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric43Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clip = useId();
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric43-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -110 164 204" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clip}>
            <polygon points={MOUTH} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, W, D, H)} paint={paint.body} />
        <g transform={onTop(H)} className={paint.body.ink}>
          <rect x={RIM} y={RIM} width={W - RIM * 2} height={D - RIM * 2} rx={3} />
        </g>
        <g transform={onLeft(D)} className={paint.body.ink}>
          <rect x={44} y={-H + 4} width={16} height={10} rx={2} />
          <rect x={10} y={-10} width={84} height={2} rx={1} />
        </g>
        <g transform={onRight(W)} className={paint.body.ink}>
          <rect x={24} y={-H + 12} width={24} height={6} rx={3} />
        </g>
        <g clipPath={`url(#${clip})`}>
          <g className="isometric43-rise">
            <Block faces={box(64, 20, 12, 30, 24, 30)} paint={paint.body} />
            <g transform={onRight(94)} className={paint.body.ink}>
              <rect x={24} y={-36} width={16} height={4} rx={2} />
              <rect x={24} y={-28} width={10} height={4} rx={2} />
            </g>
            <RoundBlock shape={cylinder(26, 42, 12, 32, 14)} paint={paint.body} />
            <g transform={onTop(44)} className={paint.body.ink}>
              <circle cx={26} cy={42} r={5} />
            </g>
            <RoundBlock shape={cylinder(56, 52, 12, 28, 8)} paint={paint.body} />
            <RoundBlock shape={cylinder(56, 52, 40, 8, 5)} paint={paint.body} />

          </g>
        </g>
        <g className="isometric43-lid">
          <Block faces={box(0, 0, H, W, D, LID)} paint={paint.body} />
          <g transform={onLeft(D)} className={paint.body.ink}>
            <rect x={46} y={-H - LID + 3} width={12} height={6} rx={2} />
          </g>
          <g transform={onTop(H + LID)}>
            <path d={CROSS} className={accent ? paint.accent.base : paint.body.ink} />
          </g>
        </g>
      </svg>
    </div>
  );
}
