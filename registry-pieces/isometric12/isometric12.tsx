"use client";

import type { CSSProperties } from "react";
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

interface Isometric12Props {
  /** Number of switches in the row. */
  count?: number;
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Light each switch in the tone as it turns on; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric12Demo: Isometric12Props = {
  count: 4,
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const PLATE_W = 112;
const BASE = 10;
const TRACK_W = 84;
const TRACK_D = 30;
const TRACK_H = 10;
const STEP = 40;
const KNOB = 24;
const KNOB_H = 12;
const TRAVEL = TRACK_W - KNOB - 6;
const SLIDE = `${(TRAVEL * C).toFixed(1)}px, ${(TRAVEL * S).toFixed(1)}px`;
const BACK = `${(-TRAVEL * C).toFixed(1)}px, ${(-TRAVEL * S).toFixed(1)}px`;

const STYLES = `
@keyframes isometric12-slide { 0%, 8% { transform: translate(0, 0); } 16%, 62% { transform: translate(${SLIDE}); } 70%, 100% { transform: translate(0, 0); } }
@keyframes isometric12-back { 0%, 8% { transform: translate(${BACK}); } 16%, 62% { transform: translate(0, 0); } 70%, 100% { transform: translate(${BACK}); } }
@keyframes isometric12-lit { 0%, 9% { opacity: 0; } 15%, 63% { opacity: 1; } 69%, 100% { opacity: 0; } }
.isometric12-knob { animation: isometric12-slide 5.2s cubic-bezier(0.5, 0, 0.2, 1.3) infinite both; will-change: transform; }
.isometric12-knob-rest { animation: isometric12-back 5.2s cubic-bezier(0.5, 0, 0.2, 1.3) infinite both; will-change: transform; }
.isometric12-lit { animation: isometric12-lit 5.2s ease-in-out infinite both; }
.isometric12-still * { animation: none !important; }
.isometric12-still .isometric12-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric12-knob, .isometric12-knob-rest, .isometric12-lit { animation: none; } .isometric12-rest { opacity: 1; } }
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

export function Isometric12({ count = 4, tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric12Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const total = Math.min(Math.max(Math.round(count), 2), 5);
  const rows = Array.from({ length: total }, (_, index) => index);
  const depth = total * STEP + 8;
  const glow = accent ? paint.accent.base : paint.body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric12-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg
        viewBox={`${-depth * C - 10} -34 ${(depth + PLATE_W) * C + 20} ${(depth + PLATE_W) * S + 44}`}
        aria-hidden="true"
        className="size-full overflow-visible"
      >
        <Block faces={box(0, 0, 0, PLATE_W, depth, BASE)} paint={paint.body} />
        {rows.map((index) => {
          const x = (PLATE_W - TRACK_W) / 2;
          const y = 14 + index * STEP;
          const rest = index === 0;
          const timing = { animationDelay: `${index * 0.5}s` } as CSSProperties;
          const knobX = rest ? x + 3 + TRAVEL : x + 3;
          return (
            <g key={index}>
              <RoundBlock shape={roundBox(x, y, BASE, TRACK_W, TRACK_D, TRACK_H, TRACK_D / 2)} paint={paint.body} />
              <rect
                x={x}
                y={y}
                width={TRACK_W}
                height={TRACK_D}
                rx={TRACK_D / 2}
                transform={onTop(BASE + TRACK_H)}
                className={cn("isometric12-lit opacity-0", rest && "isometric12-rest", glow)}
                style={timing}
              />
              <g className={rest ? "isometric12-knob-rest" : "isometric12-knob"} style={timing}>
                <RoundBlock shape={roundBox(knobX, y + 3, BASE + TRACK_H, KNOB, KNOB, KNOB_H, KNOB / 2)} paint={paint.body} />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
