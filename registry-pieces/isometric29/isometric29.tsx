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

interface Isometric29Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the small gear with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric29Demo: Isometric29Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const MODULE = 6;
const THICKNESS = 10;
const LAYER = 1;

/** A spur gear outline centered on the origin, with a tooth centered on `phase` degrees. */
function gear(teeth: number, phase: number) {
  const pitch = (MODULE * teeth) / 2;
  const outer = pitch + MODULE * 0.9;
  const root = pitch - MODULE * 1.1;
  const step = 360 / teeth;
  const points: string[] = [];
  for (let index = 0; index < teeth; index++) {
    const mid = phase + index * step;
    const corners: [number, number][] = [
      [root, mid - step * 0.3],
      [outer, mid - step * 0.16],
      [outer, mid + step * 0.16],
      [root, mid + step * 0.3],
    ];
    for (const [r, deg] of corners) {
      const a = (deg * Math.PI) / 180;
      points.push(`${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`);
    }
  }
  return points.join(" ");
}

// The small gear sits along the -45 degree plan direction so the pair spreads across the card
const DISTANCE = (MODULE * (12 + 8)) / 2;
const GEARS = [
  { key: "large", teeth: 12, x: 0, y: 0, shape: gear(12, -45), hub: 18, spin: "isometric29-cw" },
  {
    key: "small",
    teeth: 8,
    x: Math.round(DISTANCE * Math.SQRT1_2 * 10) / 10,
    y: -Math.round(DISTANCE * Math.SQRT1_2 * 10) / 10,
    shape: gear(8, 22.5),
    hub: 10,
    spin: "isometric29-ccw",
  },
];
const LAYERS = Array.from({ length: THICKNESS / LAYER }, (_, index) => index * LAYER);

const STYLES = `
@keyframes isometric29-cw { from { transform: rotate(0deg); } to { transform: rotate(30deg); } }
@keyframes isometric29-ccw { from { transform: rotate(0deg); } to { transform: rotate(-45deg); } }
.isometric29-cw, .isometric29-ccw { transform-box: fill-box; transform-origin: center; }
.isometric29-cw { animation: isometric29-cw 2.8s linear infinite; }
.isometric29-ccw { animation: isometric29-ccw 2.8s linear infinite; }
.isometric29-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric29-cw, .isometric29-ccw { animation: none; } }
`;

export function Isometric29({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric29Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const shadowId = useId();
  const paint = paints(palette, accent, tone, color);
  const paintFor = (key: string) => (key === "small" ? paint.accent : paint.body);
  const at = (x: number, y: number, z: number) => `${onTop(z)} translate(${x} ${y})`;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric29-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-62 -52 180 100" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <radialGradient id={shadowId} className="text-foreground">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={36} cy={8} rx={96} ry={44} fill={`url(#${shadowId})`} />
        {LAYERS.map((z) =>
          GEARS.map(({ key, x, y, shape, spin }) => (
            <g key={`${key}-${z}`} transform={at(x, y, z)}>
              <g className={spin}>
                <polygon points={shape} className={paintFor(key).base} />
                <polygon points={shape} className={paintFor(key).right} />
              </g>
            </g>
          )),
        )}
        {GEARS.map(({ key, x, y, shape, hub, spin }) => {
          const surface = paintFor(key);
          return (
            <g key={key} transform={at(x, y, THICKNESS)}>
              <g className={spin}>
                <polygon points={shape} strokeWidth={1} strokeLinejoin="round" className={cn(surface.base, surface.edge)} />
                <circle cx={0} cy={0} r={hub} className={surface.ink} />
                <circle cx={0} cy={0} r={hub - 4} className={surface.base} />
                <circle cx={0} cy={0} r={4} className={surface.ink} />
                <rect x={hub - 10} y={-1.5} width={6} height={3} rx={1.5} className={surface.ink} />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
