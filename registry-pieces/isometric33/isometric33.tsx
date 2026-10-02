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

interface Isometric33Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Stripe the awning with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  /** Word on the lit door sign. */
  label?: string;
  className?: string;
}

export const isometric33Demo: Isometric33Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
  label: "OPEN",
};

const W = 96;
const D = 44;
const BASE = 6;
const H = 64;
const TOP = BASE + H;
const AWNING = { x0: 4, x1: W - 4, z: 62, out: 10, drop: 6, valance: 5 };
const STRIPES = 8;
const stripe = (x: number, w: number): Point[][] => {
  const { z, out, drop, valance } = AWNING;
  return [
    [[x, D, z], [x + w, D, z], [x + w, D + out, z - drop], [x, D + out, z - drop]],
    [[x, D + out, z - drop], [x + w, D + out, z - drop], [x + w, D + out, z - drop - valance], [x, D + out, z - drop - valance]],
  ];
};
const LABEL: Record<Palette, string> = {
  theme: "fill-foreground",
  light: "fill-zinc-900",
  dark: "fill-zinc-100",
  tone: "fill-black/70",
  glass: "fill-foreground",
};

// The sign hangs flat on the door; only its light plays: a flicker as it comes on, then a slow breathing glow
const STYLES = `
@keyframes isometric33-lit { 0%, 6% { opacity: 0; } 8% { opacity: 1; } 10% { opacity: 0.3; } 13% { opacity: 1; } 15% { opacity: 0.6; } 18%, 50% { opacity: 1; } 68% { opacity: 0.78; } 86%, 94% { opacity: 1; } 100% { opacity: 0; } }
@keyframes isometric33-halo { 0%, 12% { opacity: 0; } 20%, 50% { opacity: 1; } 68% { opacity: 0.4; } 86%, 94% { opacity: 1; } 100% { opacity: 0; } }
.isometric33-lit { animation: isometric33-lit 5s linear infinite; }
.isometric33-halo { animation: isometric33-halo 5s linear infinite; }
.isometric33-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric33-lit, .isometric33-halo { animation: none; } }
`;

export function Isometric33({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, label = "OPEN", className }: Isometric33Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const glow = accent ? paint.accent.base : body.ink;
  const width = (AWNING.x1 - AWNING.x0) / STRIPES;
  const whole = stripe(AWNING.x0, AWNING.x1 - AWNING.x0);
  const colored = Array.from({ length: STRIPES / 2 }, (_, index) => stripe(AWNING.x0 + index * 2 * width, width));
  const stripeFill = accent ? paint.accent.base : body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric33-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -84 170 168" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-6, -6, 0, W + 12, D + 28, BASE)} paint={body} />
        <Block faces={box(0, 0, BASE, W, D, H)} paint={body} />
        <Block faces={box(-2, -2, TOP, W + 4, D + 4, 6)} paint={body} />
        <Block faces={box(60, 10, TOP + 6, 18, 14, 8)} paint={body} />
        <g transform={onRight(W)} className={body.ink}>
          <rect x={10} y={-50} width={24} height={22} rx={2} />
        </g>
        <g transform={onLeft(D)}>
          <rect x={8} y={-42} width={44} height={28} rx={2} className={body.ink} />
          <g className={body.base}>
            <rect x={14} y={-24} width={8} height={10} rx={1} />
            <rect x={26} y={-28} width={8} height={14} rx={1} />
            <rect x={38} y={-22} width={8} height={8} rx={1} />
          </g>
          <rect x={62} y={-46} width={26} height={40} rx={2} className={body.ink} />
          <rect x={66} y={-40} width={18} height={16} rx={1} className={body.ink} />
          <circle cx={83} cy={-22} r={1.6} className={body.base} />
          <g className={body.edge} strokeWidth={0.8}>
            <g className="isometric33-halo" stroke="none">
              <rect x={62} y={-40} width={26} height={17} rx={4} className={cn(glow, "opacity-20")} />
              <rect x={63.5} y={-38.5} width={23} height={14} rx={3} className={cn(glow, "opacity-30")} />
            </g>
            <rect x={65} y={-37} width={20} height={11} rx={1.5} className={body.base} />
            <text x={75} y={-31.5} textAnchor="middle" dominantBaseline="central" fontSize={6} stroke="none" className={cn("font-semibold", LABEL[palette])}>
              {label}
            </text>
            <g className="isometric33-lit">
              <rect x={65} y={-37} width={20} height={11} rx={1.5} className={accent ? paint.accent.base : body.base} />
              <text x={75} y={-31.5} textAnchor="middle" dominantBaseline="central" fontSize={6} stroke="none" className={cn("font-semibold", !accent ? LABEL[palette] : palette === "tone" ? "fill-current" : "fill-white")}>
                {label}
              </text>
            </g>
          </g>
        </g>
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={polygon(whole[0])} className={body.base} />
          <polygon points={polygon(whole[1])} className={body.base} />
        </g>
        {colored.map(([slope, front]) => (
          <g key={polygon(slope)} className={stripeFill}>
            <polygon points={polygon(slope)} />
            <polygon points={polygon(front)} />
          </g>
        ))}
        <polygon points={polygon(whole[1])} className={body.left} />
      </svg>
    </div>
  );
}
