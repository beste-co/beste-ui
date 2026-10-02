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

interface Isometric166Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the two slices of toast with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric166Demo: Isometric166Props = {
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


const G = 6;
const FOOT = 3;
const W = 80;
const D = 44;
const H = 46;
const Z0 = G + FOOT;
const TOP = Z0 + H;
const SLOT = { x: 14, w: 52, t: 6 };
const SLOTS = [11, 27];
const SLICE = { h: 40, up: 18 };
// How far the slices and the lever travel down
const POP = 20;
const PUSH = 18;
const LAYERS = [0, 1, 2, 3, 4];

/** Everything above a slot, plus the slot opening itself: the only place a slice can be seen. */
const slotWindow = (y: number) =>
  polygon([[SLOT.x, y + SLOT.t, TOP], [SLOT.x + SLOT.w, y + SLOT.t, TOP], [SLOT.x + SLOT.w, y, TOP], [SLOT.x + SLOT.w, y, TOP + 120], [SLOT.x, y + SLOT.t, TOP + 120]]);

const STYLES = `
@keyframes isometric166-pop { 0%, 8% { transform: translateY(0); } 16%, 64% { transform: translateY(${POP}px); } 68% { transform: translateY(-5px); } 72% { transform: translateY(1.5px); } 76% { transform: translateY(-1.5px); } 80%, 100% { transform: translateY(0); } }
@keyframes isometric166-lever { 0%, 8% { transform: translateY(0); } 16%, 64% { transform: translateY(${PUSH}px); } 67% { transform: translateY(0); } 70% { transform: translateY(1.5px); } 73%, 100% { transform: translateY(0); } }
@keyframes isometric166-glow { 0%, 18% { opacity: 0; } 28%, 60% { opacity: 0.7; } 66%, 100% { opacity: 0; } }
.isometric166-pop { animation: isometric166-pop 5.2s ease-in-out infinite; will-change: transform; }
.isometric166-lever { animation: isometric166-lever 5.2s ease-in-out infinite; }
.isometric166-glow { animation: isometric166-glow 5.2s ease-in-out infinite; }
.isometric166-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric166-pop, .isometric166-lever, .isometric166-glow { animation: none; } }
`;

export function Isometric166({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric166Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const toast = paint.accent;
  const sliceTop = -(TOP + SLICE.up);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric166-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-60 -80 152 158" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          {SLOTS.map((y) => (
            <clipPath key={y} id={`${clipId}-${y}`}>
              <polygon points={slotWindow(y)} />
            </clipPath>
          ))}
        </defs>
        <Block faces={box(-8, -8, 0, W + 16, D + 16, G)} paint={body} />
        {[[W - 20, 6], [10, D - 12], [W - 20, D - 12]].map(([x = 0, y = 0]) => (
          <Block key={`${x}-${y}`} faces={box(x, y, G, 10, 6, FOOT)} paint={body} />
        ))}
        <RoundBlock shape={roundBox(0, 0, Z0, W, D, H, 10)} paint={body} />
        <g transform={onTop(TOP)}>
          {SLOTS.map((y) => (
            <g key={y}>
              <rect x={SLOT.x} y={y} width={SLOT.w} height={SLOT.t} rx={1.5} className="fill-black/40" />
              <rect x={SLOT.x} y={y} width={SLOT.w} height={SLOT.t} rx={1.5} className="isometric166-glow fill-current opacity-0" />
            </g>
          ))}
        </g>
        {SLOTS.map((y) => (
          <g key={y} clipPath={`url(#${clipId}-${y})`}>
            <g className="isometric166-pop">
              {LAYERS.map((layer) => (
                <g key={layer} transform={onLeft(y + 0.5 + layer)}>
                  <rect x={SLOT.x + 1} y={sliceTop} width={SLOT.w - 2} height={SLICE.h} rx={7} className={toast.base} />
                  <rect x={SLOT.x + 1} y={sliceTop} width={SLOT.w - 2} height={SLICE.h} rx={7} className={toast.right} />
                </g>
              ))}
              <g transform={onLeft(y + 5.5)} className={toast.edge} strokeWidth={1}>
                <rect x={SLOT.x + 1} y={sliceTop} width={SLOT.w - 2} height={SLICE.h} rx={7} className={toast.base} />
                <rect x={SLOT.x + 1} y={sliceTop} width={SLOT.w - 2} height={SLICE.h} rx={7} className={toast.left} stroke="none" />
                <rect x={SLOT.x + 5} y={sliceTop + 4} width={SLOT.w - 10} height={SLICE.h - 8} rx={4} className={toast.ink} stroke="none" />
              </g>
            </g>
          </g>
        ))}
        <g transform={onRight(W)} className={body.ink}>
          <rect x={20} y={-(Z0 + 36)} width={4} height={30} rx={2} />
        </g>
        <g className="isometric166-lever">
          <Block faces={box(W, 16, Z0 + 28, 6, 12, 4)} paint={body} />
        </g>
        <g transform={onLeft(D)} className={body.ink}>
          <circle cx={58} cy={-(Z0 + 13)} r={6} />
          <rect x={14} y={-(Z0 + 15)} width={22} height={3} rx={1.5} />
          <rect x={14} y={-(Z0 + 9)} width={14} height={3} rx={1.5} />
        </g>
        <g transform={onLeft(D)} className={toast.base}>
          <rect x={57} y={-(Z0 + 18)} width={2} height={5} rx={1} />
        </g>
      </svg>
    </div>
  );
}
