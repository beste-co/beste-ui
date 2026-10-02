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

interface Isometric51Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Draw the coin in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric51Demo: Isometric51Props = {
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

const W = 108;
const D = 68;
const LEG = 14;
const BODY_H = 44;
const R = 34;
const TOP = LEG + BODY_H + 8;
const LEGS: [number, number][] = [[26, 18], [82, 18], [26, 50], [82, 50]];
const SNOUT = { y: D / 2, z: LEG + 24, r: 13 };
const SNOUT_SLICES = [W - 2, W, W + 2, W + 4, W + 6, W + 8];
const EARS = [16, D - 16];
const EAR_SLICES = [76, 77, 78, 79, 80];
const COIN = { x: 42, y: D / 2, z: TOP + 6, r: 16 };
const COIN_SLICES = [COIN.y - 2, COIN.y - 1, COIN.y, COIN.y + 1, COIN.y + 2];
const earPath = (y: number) => `M${y - 8} ${-TOP + 1}L${y + 8} ${-TOP + 1}L${y + 1} ${-TOP - 13}Z`;

const STYLES = `
@keyframes isometric51-coin { 0% { transform: translateY(-20px); opacity: 0; } 12% { transform: translateY(-20px); opacity: 1; } 20% { transform: translateY(-20px); } 38%, 88% { transform: translateY(40px); opacity: 1; } 89% { opacity: 0; } 100% { transform: translateY(-20px); opacity: 0; } }
@keyframes isometric51-hop { 0%, 38% { transform: translateY(0); } 43% { transform: translateY(-5px); } 49% { transform: translateY(0); } 53% { transform: translateY(-2px); } 57%, 100% { transform: translateY(0); } }
.isometric51-coin { animation: isometric51-coin 4.4s cubic-bezier(0.5, 0, 0.5, 1) infinite; will-change: transform, opacity; }
.isometric51-pig { animation: isometric51-hop 4.4s ease-in-out infinite; will-change: transform; }
.isometric51-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric51-coin, .isometric51-pig { animation: none; } }
`;

export function Isometric51({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric51Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric51-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-54 -76 146 156" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={polygon([[-60, COIN.y + 2, TOP], [160, COIN.y + 2, TOP], [160, COIN.y + 2, TOP + 200], [-60, COIN.y + 2, TOP + 200]])} />
          </clipPath>
        </defs>
        <g className="isometric51-pig">
          {LEGS.map(([x, y]) => (
            <RoundBlock key={`${x}-${y}`} shape={roundBox(x - 8, y - 8, 0, 16, 16, LEG + 2, 8)} paint={paint.body} />
          ))}
          <RoundBlock shape={roundBox(0, 0, LEG, W, D, BODY_H, R)} paint={paint.body} />
          <RoundBlock shape={roundBox(8, 8, LEG + BODY_H, W - 16, D - 16, 8, R - 8)} paint={paint.body} />
          <g transform={onTop(TOP)} className={paint.body.ink}>
            <rect x={COIN.x - 20} y={COIN.y - 3} width={40} height={6} rx={3} />
          </g>
          {EAR_SLICES.map((x, index) => (
            <g key={x} transform={onRight(x)}>
              <path d={earPath(EARS[0] ?? 14)} className={paint.body.base} />
              <path d={earPath(EARS[0] ?? 14)} className={index === EAR_SLICES.length - 1 ? paint.body.right : paint.body.left} />
            </g>
          ))}
          <g clipPath={`url(#${clipId})`}>
            <g className="isometric51-coin">
              {COIN_SLICES.map((y, index) => {
                const front = index === COIN_SLICES.length - 1;
                return (
                  <g key={y} transform={onLeft(y)}>
                    <circle cx={COIN.x} cy={-COIN.z} r={COIN.r} className={paint.accent.base} />
                    <circle cx={COIN.x} cy={-COIN.z} r={COIN.r} className={front ? paint.accent.left : paint.accent.right} />
                    {front && (
                      <path d={`M${COIN.x - 10} ${-COIN.z}a10 10 0 1 0 20 0a10 10 0 1 0 -20 0ZM${COIN.x - 8} ${-COIN.z}a8 8 0 1 1 16 0a8 8 0 1 1 -16 0Z`} fillRule="evenodd" className={paint.accent.ink} />
                    )}
                  </g>
                );
              })}
            </g>
          </g>
          {EAR_SLICES.map((x, index) => (
            <g key={x} transform={onRight(x)}>
              <path d={earPath(EARS[1] ?? 54)} className={paint.body.base} />
              <path d={earPath(EARS[1] ?? 54)} className={index === EAR_SLICES.length - 1 ? paint.body.right : paint.body.left} />
            </g>
          ))}
          <g transform={onLeft(D)} className={paint.body.ink}>
            <circle cx={72} cy={-(LEG + 34)} r={3} />
          </g>
          {SNOUT_SLICES.map((x, index) => {
            const front = index === SNOUT_SLICES.length - 1;
            return (
              <g key={x} transform={onRight(x)}>
                <circle cx={SNOUT.y} cy={-SNOUT.z} r={SNOUT.r} className={paint.body.base} />
                <circle cx={SNOUT.y} cy={-SNOUT.z} r={SNOUT.r} className={front ? paint.body.right : paint.body.left} />
                {front && (
                  <g className={paint.body.ink}>
                    <ellipse cx={SNOUT.y - 4} cy={-SNOUT.z} rx={2} ry={3.5} />
                    <ellipse cx={SNOUT.y + 4} cy={-SNOUT.z} rx={2} ry={3.5} />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
