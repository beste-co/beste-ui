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

interface Isometric42Props {
  /** The heart rate shown on the screen. */
  bpm?: string;
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Draw the pulse line and heart in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric42Demo: Isometric42Props = {
  bpm: "72",
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 104;
const D = 28;
const Z = 18;
const H = 72;
const TOP = Z + H;
const PERIOD = 34;
const BASELINE = -38;
// One heartbeat of the trace, relative to the baseline
const BEAT: [number, number][] = [[0, 0], [7, 0], [9, -3], [11, 0], [14, 0], [16, 4], [18, -17], [20, 8], [22, 0], [26, 0], [28, -5], [30, 0]];
const TRACE = Array.from({ length: 5 }, (_, beat) => BEAT.map(([x, y]) => `${4 + beat * PERIOD + x},${BASELINE + y}`).join(" ")).join(" ");
const HEART = "M0 3C-1 1-6 -1-6 -4C-6 -7-2 -8 0 -5C2 -8 6 -7 6 -4C6 -1 1 1 0 3Z";

const LINE: Record<Palette, string> = {
  theme: "stroke-foreground/40",
  light: "stroke-zinc-950/40",
  dark: "stroke-white/40",
  tone: "stroke-white/60",
};

const STYLES = `
@keyframes isometric42-scroll { from { transform: translateX(0); } to { transform: translateX(-${PERIOD * 2}px); } }
@keyframes isometric42-beat { 0%, 30%, 100% { transform: scale(1); } 8% { transform: scale(1.25); } 16% { transform: scale(0.96); } 22% { transform: scale(1.12); } }
.isometric42-trace { animation: isometric42-scroll 3s linear infinite; will-change: transform; }
.isometric42-heart { transform-box: fill-box; transform-origin: center; animation: isometric42-beat 1.5s ease-out infinite; }
.isometric42-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric42-trace, .isometric42-heart { animation: none; } }
`;

export function Isometric42({ bpm = "72", tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric42Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clip = useId();
  const paint = paints(palette, accent, tone, color);
  const line = !accent ? LINE[palette] : palette === "tone" ? "stroke-white" : "stroke-current";
  const heart = accent ? paint.accent.base : LINE[palette].replace("stroke-", "fill-");
  const label = palette === "tone" ? "fill-black/70" : palette === "dark" ? "fill-zinc-100" : palette === "light" ? "fill-zinc-900" : "fill-foreground";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric42-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-36 -110 140 184" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clip}>
            <rect x={10} y={-TOP + 10} width={62} height={H - 20} />
          </clipPath>
        </defs>
        <Block faces={box(4, -12, 0, 96, 48, 8)} paint={paint.body} />
        <Block faces={box(42, 6, 8, 20, 16, Z - 8)} paint={paint.body} />
        <Block faces={box(0, 0, Z, W, D, H)} paint={paint.body} />
        <Block faces={box(20, 10, TOP, 6, 8, 8)} paint={paint.body} />
        <Block faces={box(78, 10, TOP, 6, 8, 8)} paint={paint.body} />
        <Block faces={box(20, 10, TOP + 8, 64, 8, 4)} paint={paint.body} />
        <g transform={onTop(TOP)} className={paint.body.ink}>
          <rect x={36} y={8} width={32} height={3} rx={1.5} />
          <rect x={36} y={15} width={32} height={3} rx={1.5} />
        </g>
        <g transform={onLeft(D)}>
          <g className={paint.body.ink}>
            <rect x={6} y={-TOP + 8} width={70} height={H - 16} rx={5} />
            <circle cx={90} cy={-TOP + 17} r={6} />
            <rect x={84} y={-TOP + 32} width={12} height={4} rx={2} />
            <rect x={84} y={-TOP + 40} width={12} height={4} rx={2} />
            <rect x={84} y={-TOP + 48} width={12} height={4} rx={2} />
          </g>
          <g clipPath={`url(#${clip})`}>
            <g className="isometric42-trace">
              <polyline points={TRACE} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={line} />
            </g>
          </g>
          <g transform={`translate(20 ${-TOP + 22})`}>
            <path d={HEART} className={cn("isometric42-heart", heart)} />
          </g>
          <text x={30} y={-TOP + 26} fontSize={12} fontWeight={600} className={label}>
            {bpm}
          </text>
        </g>
      </svg>
    </div>
  );
}
