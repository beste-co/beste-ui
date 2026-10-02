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

interface Isometric54Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Print the total line in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric54Demo: Isometric54Props = {
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

const W = 88;
const D = 80;
const H = 34;
const SLOT = 46;
const PAPER_X = 18;
const PAPER_W = 52;
const PAPER_H = 74;
const TOOTH = 6.5;
const PAPER = `M${PAPER_X} 0V${-PAPER_H}${Array.from({ length: 8 }, (_, index) => `L${PAPER_X + TOOTH * (index + 0.5)} ${-PAPER_H - 3}L${PAPER_X + TOOTH * (index + 1)} ${-PAPER_H}`).join("")}V0Z`;
const LINES = [
  { x: 6, w: 28, y: 20 },
  { x: 6, w: 36, y: 28 },
  { x: 6, w: 22, y: 36 },
  { x: 6, w: 32, y: 44 },
];

// Feeds in short pushes with a pause after each, like a thermal printer
const FEED = Array.from({ length: 9 }, (_, index) => {
  const left = ((PAPER_H + 4) * (1 - index / 8)).toFixed(1);
  const at = 6 + index * 6;
  return `${index === 0 ? "0%, " : ""}${at}%, ${at + 2}% { transform: translateY(${left}px); opacity: 1; }`;
}).join(" ");

const STYLES = `
@keyframes isometric54-feed { ${FEED} 84% { transform: translateY(0); opacity: 1; } 92% { transform: translateY(0); opacity: 0; } 100% { transform: translateY(${PAPER_H + 4}px); opacity: 0; } }
.isometric54-paper { animation: isometric54-feed 5.2s linear infinite; will-change: transform, opacity; }
.isometric54-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric54-paper { animation: none; } }
`;

export function Isometric54({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric54Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const total = accent ? paint.accent.base : paint.body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric54-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-72 -86 150 172" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={polygon([[-80, SLOT, H], [180, SLOT, H], [180, SLOT, H + 200], [-80, SLOT, H + 200]])} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, W, D, H, 12)} paint={paint.body} />
        <RoundBlock shape={roundBox(6, 6, H, W - 12, SLOT - 10, 14, 10)} paint={paint.body} />
        <g transform={onTop(H + 14)} className={paint.body.ink}>
          <rect x={18} y={16} width={W - 36} height={6} rx={3} />
        </g>
        <g transform={onTop(H)} className={paint.body.ink}>
          <rect x={PAPER_X - 4} y={SLOT - 2} width={PAPER_W + 8} height={4} rx={2} />
          <rect x={14} y={58} width={34} height={12} rx={3} />
        </g>
        <RoundBlock shape={roundBox(58, 56, H, 16, 16, 3, 8)} paint={paint.body} />
        <g clipPath={`url(#${clipId})`}>
          <g transform={`${onLeft(SLOT)} translate(0 ${-H})`}>
            <g className="isometric54-paper">
              <path d={PAPER} strokeWidth={1} strokeLinejoin="round" className={cn(paint.body.base, paint.body.edge)} />
              <path d={PAPER} className={paint.body.left} />
              <g transform={`translate(${PAPER_X} ${-PAPER_H})`}>
                <circle cx={PAPER_W / 2} cy={10} r={4} className={paint.body.ink} />
                {LINES.map((line) => (
                  <g key={line.y} className={paint.body.ink}>
                    <rect x={line.x} y={line.y} width={line.w} height={3} rx={1.5} />
                    <rect x={PAPER_W - 14} y={line.y} width={8} height={3} rx={1.5} />
                  </g>
                ))}
                <rect x={6} y={60} width={PAPER_W - 12} height={7} rx={2} className={total} />
              </g>
            </g>
          </g>
        </g>
        <Block faces={box(PAPER_X - 6, SLOT + 2, H, PAPER_W + 12, 4, 3)} paint={paint.body} />
      </svg>
    </div>
  );
}
