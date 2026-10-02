"use client";

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

interface Isometric28Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the signal arcs and the status light with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric28Demo: Isometric28Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 100;
const D = 56;
const H = 18;
const ROUTER = box(0, 0, 0, W, D, H);
const ANTENNAS = [box(5, 46, H, 5, 5, 36), box(90, 5, H, 5, 5, 36)];

// The signal icon stands in the plane y = SIGNAL_Y, drawn in (x, -z)
const SIGNAL_Y = 30;
const SIGNAL_DEPTH = 4;
const CENTER_X = W / 2;
const CENTER_Z = 34;

function sector(outer: number, inner: number, from: number, to: number) {
  const point = (r: number, deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${(CENTER_X + r * Math.cos(a)).toFixed(2)} ${(-CENTER_Z + r * Math.sin(a)).toFixed(2)}`;
  };
  return `M${point(outer, from)} A${outer} ${outer} 0 0 1 ${point(outer, to)} L${point(inner, to)} A${inner} ${inner} 0 0 0 ${point(inner, from)} Z`;
}
const ARCS = [11, 22, 33].map((r) => sector(r + 6, r, -45, 45));
const DOT = `M${CENTER_X - 5} ${-CENTER_Z} a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 Z`;
const SHAPES = [DOT, ...ARCS];

const STYLES = `
@keyframes isometric28-pulse { 0%, 55%, 100% { opacity: 0.25; } 18%, 30% { opacity: 1; } }
.isometric28-arc { animation: isometric28-pulse 3s ease-in-out infinite; }
.isometric28-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric28-arc { animation: none; } }
`;

export function Isometric28({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric28Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const signal = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric28-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-62 -70 162 158" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={ROUTER} paint={paint.body} />
        <g transform={onTop(H)} className={paint.body.ink}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <rect key={index} x={30 + index * 8} y={40} width={4} height={10} rx={2} />
          ))}
        </g>
        <g transform={onLeft(D)}>
          {[0, 1, 2, 3].map((index) => (
            <rect key={index} x={12 + index * 10} y={-11} width={6} height={3} rx={1.5} className={index === 0 && accent ? paint.accent.base : paint.body.ink} />
          ))}
        </g>
        <g transform={onRight(W)} className={paint.body.ink}>
          {[0, 1, 2].map((index) => (
            <rect key={index} x={10 + index * 13} y={-12} width={9} height={6} rx={1.5} />
          ))}
        </g>
        {ANTENNAS.map((faces, index) => (
          <Block key={index} faces={faces} paint={paint.body} />
        ))}
        {SHAPES.map((d, index) => (
          <g key={index} className="isometric28-arc" style={{ animationDelay: `${index * 0.25}s` }}>
            {Array.from({ length: SIGNAL_DEPTH }, (_, step) => (
              <g key={step} transform={onLeft(SIGNAL_Y - SIGNAL_DEPTH + step)}>
                <path d={d} className={signal.base} />
                <path d={d} className={signal.right} />
              </g>
            ))}
            <g transform={onLeft(SIGNAL_Y)} strokeWidth={1} strokeLinejoin="round" className={signal.edge}>
              <path d={d} className={signal.base} />
              <path d={d} stroke="none" className={signal.left} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
