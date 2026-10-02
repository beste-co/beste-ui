"use client";

import { type CSSProperties, useId } from "react";
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

interface Isometric7Props {
  /** Bar heights, back to front; the tallest takes the accent. */
  values?: number[];
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the tallest bar with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric7Demo: Isometric7Props = {
  values: [32, 54, 44, 74, 100],
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const BAR = 24;
const STEP = 40;
const BASE = 12;
const DEPTH = 56;
const MAX = 104;

const STYLES = `
@keyframes isometric7-grow { 0%, 6% { transform: translateY(var(--isometric7-h)); } 22%, 78% { transform: translateY(0); } 94%, 100% { transform: translateY(var(--isometric7-h)); } }
.isometric7-bar { animation: isometric7-grow 5.4s cubic-bezier(0.65, 0, 0.35, 1) infinite both; will-change: transform; }
.isometric7-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric7-bar { animation: none; } }
`;

export function Isometric7({
  values = isometric7Demo.values,
  tone = "color", color = DEFAULT_COLOR,
  palette: paletteProp = "theme",
  accent: accentProp = true,
  animated = true,
  className,
}: Isometric7Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const id = useId();
  const paint = paints(palette, accent, tone, color);
  const bars = (values ?? []).slice(0, 7);
  const peak = Math.max(1, ...bars);
  const tallest = bars.indexOf(peak);
  const width = bars.length * STEP + 14 - (STEP - BAR);
  const heights = bars.map((value) => Math.max(8, Math.round((value / peak) * MAX)));
  const top = Math.min(...heights.map((h, index) => (7 + index * STEP + 12) * S - BASE - h)) - 12;
  const bottom = (width + DEPTH) * S + 6;
  const left = -DEPTH * C - 10;
  const right = width * C + 10;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric7-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox={`${left} ${top} ${right - left} ${bottom - top}`} aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, width, DEPTH, BASE)} paint={paint.body} />
        <g transform={onTop(BASE)} className={paint.body.ink}>
          {bars.map((_, index) => (
            <rect key={index} x={7 + index * STEP} y={DEPTH - 12} width={BAR} height={4} rx={2} />
          ))}
        </g>
        {heights.map((h, index) => {
          const x = 7 + index * STEP;
          const y = 12;
          const clip = `${id}-bar-${index}`;
          const hull = polygon([
            [x, y, BASE + h],
            [x + BAR, y, BASE + h],
            [x + BAR, y, BASE],
            [x + BAR, y + BAR, BASE],
            [x, y + BAR, BASE],
            [x, y + BAR, BASE + h],
          ]);
          return (
            <g key={index}>
              <clipPath id={clip}>
                <polygon points={hull} />
              </clipPath>
              <g clipPath={`url(#${clip})`}>
                <g
                  className="isometric7-bar"
                  style={{ "--isometric7-h": `${h}px`, animationDelay: `${index * 0.18}s` } as CSSProperties}
                >
                  <Block faces={box(x, y, BASE, BAR, BAR, h)} paint={index === tallest ? paint.accent : paint.body} />
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
