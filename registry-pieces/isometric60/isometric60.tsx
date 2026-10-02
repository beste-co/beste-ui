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

interface Isometric60Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Print the stamp mark in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric60Demo: Isometric60Props = {
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

const W = 100;
const D = 116;
const PAPER = 4;
const MARK = { x: 60, y: 74 };
const PAD = 46;
const LIFT = 26;
const Z0 = PAPER + LIFT;
const PERIOD = 4.8;
const MARK_PATH = `M${MARK.x - 17} ${MARK.y - 13}a4 4 0 0 1 4 -4h26a4 4 0 0 1 4 4v26a4 4 0 0 1 -4 4h-26a4 4 0 0 1 -4 -4ZM${MARK.x - 14} ${MARK.y - 11}v22a1 1 0 0 0 1 1h26a1 1 0 0 0 1 -1v-22a1 1 0 0 0 -1 -1h-26a1 1 0 0 0 -1 1Z`;

const STYLES = `
@keyframes isometric60-stamp { 0%, 18% { transform: translateY(0); } 30%, 36% { transform: translateY(${LIFT}px); } 52%, 100% { transform: translateY(0); } }
@keyframes isometric60-shadow { 0%, 18% { transform: scale(0.8); opacity: 0.4; } 30%, 36% { transform: scale(1); opacity: 1; } 52%, 100% { transform: scale(0.8); opacity: 0.4; } }
@keyframes isometric60-mark { 0%, 34% { opacity: 0; } 36%, 86% { opacity: 1; } 94%, 100% { opacity: 0; } }
.isometric60-stamp { animation: isometric60-stamp ${PERIOD}s cubic-bezier(0.5, 0, 0.3, 1) infinite; will-change: transform; }
.isometric60-shadow { animation: isometric60-shadow ${PERIOD}s cubic-bezier(0.5, 0, 0.3, 1) infinite; transform-box: fill-box; transform-origin: center; }
.isometric60-mark { animation: isometric60-mark ${PERIOD}s linear infinite; }
.isometric60-still * { animation: none !important; }
.isometric60-still .isometric60-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric60-stamp, .isometric60-shadow, .isometric60-mark { animation: none; } .isometric60-rest { opacity: 1; } }
`;

export function Isometric60({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric60Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const markFill = accent ? paint.accent.base : paint.body.ink;
  const check = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : paint.body.ink.replace("fill-", "stroke-");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric60-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-106 -30 200 142" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, W, D, PAPER)} paint={paint.body} />
        <g transform={onTop(PAPER)}>
          <g className={paint.body.ink}>
            <rect x={14} y={14} width={40} height={7} rx={2} />
            {[30, 39, 48].map((y, index) => (
              <rect key={y} x={14} y={y} width={index === 2 ? 50 : 72} height={3} rx={1.5} />
            ))}
            <rect x={14} y={62} width={22} height={3} rx={1.5} />
            <rect x={14} y={70} width={18} height={3} rx={1.5} />
          </g>
          <g className="isometric60-mark isometric60-rest opacity-0">
            <path d={MARK_PATH} fillRule="evenodd" className={markFill} />
            <path d={`M${MARK.x - 7} ${MARK.y}l5 5l10 -10`} fill="none" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" className={check} />
          </g>
          <rect x={MARK.x - PAD / 2} y={MARK.y - PAD / 2} width={PAD} height={PAD} rx={6} className={cn("isometric60-shadow opacity-40", paint.body.ink)} />
        </g>
        <g className="isometric60-stamp">
          <Block faces={box(MARK.x - PAD / 2 + 2, MARK.y - PAD / 2 + 2, Z0, PAD - 4, PAD - 4, 3)} paint={paint.body} />
          <Block faces={box(MARK.x - PAD / 2, MARK.y - PAD / 2, Z0 + 3, PAD, PAD, 10)} paint={paint.body} />
          <RoundBlock shape={roundBox(MARK.x - 7, MARK.y - 7, Z0 + 13, 14, 14, 16, 7)} paint={paint.body} />
          <RoundBlock shape={roundBox(MARK.x - 17, MARK.y - 17, Z0 + 29, 34, 34, 12, 17)} paint={paint.body} />
          <RoundBlock shape={roundBox(MARK.x - 12, MARK.y - 12, Z0 + 41, 24, 24, 3, 12)} paint={paint.body} />
        </g>
      </svg>
    </div>
  );
}
