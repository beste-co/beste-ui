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

interface Isometric105Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Print the chart on the sheet in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric105Demo: Isometric105Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 88;
const D = 60;
const H = 40;
const TRAY = { x: 18, z: 20, w: 52, d: 34 };
const SLOT = TRAY.z + 2;
const SHEET = { x: 22, w: 44, d: 36 };
const LINES = [8, 12, 16];
const BARS = [
  { y: 22, w: 20 },
  { y: 26, w: 28 },
  { y: 30, w: 14 },
];

const STYLES = `
@keyframes isometric105-feed { 0%, 8% { transform: translateY(-38px); opacity: 1; } 28%, 36% { transform: translateY(-20px); } 56%, 86% { transform: translateY(0); opacity: 1; } 94% { transform: translateY(0); opacity: 0; } 100% { transform: translateY(-38px); opacity: 0; } }
@keyframes isometric105-led { 0%, 56%, 100% { opacity: 0.3; } 8%, 50% { opacity: 1; } }
.isometric105-sheet { animation: isometric105-feed 5s cubic-bezier(0.45, 0, 0.4, 1) infinite; will-change: transform, opacity; }
.isometric105-led { animation: isometric105-led 5s ease-in-out infinite; }
.isometric105-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric105-sheet, .isometric105-led { animation: none; } }
`;

export function Isometric105({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric105Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const sheetZ = SLOT;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric105-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-74 -64 158 146" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={D} width={W} height={60} transform={onTop(sheetZ)} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, W, D, H)} paint={body} />
        <g transform={onLeft(D)}>
          <rect x={0} y={-15} width={W} height={1.5} className={body.ink} />
          <rect x={36} y={-10} width={16} height={3} rx={1.5} className={body.ink} />
          <rect x={TRAY.x - 4} y={-SLOT - 5} width={TRAY.w + 8} height={5} rx={2} className={body.ink} />
          <rect x={TRAY.x - 4} y={-SLOT - 5} width={TRAY.w + 8} height={2} rx={1} className={body.ink} />
        </g>
        <g transform={onRight(W)} className={body.ink}>
          {[0, 1, 2, 3].map((index) => (
            <rect key={index} x={10 + index * 5} y={-H + 10} width={2} height={14} rx={1} />
          ))}
        </g>
        <Block faces={box(12, 4, H, 64, 4, 22)} paint={body} />
        <Block faces={box(16, 8, H, 56, 16, 7)} paint={body} />
        <g transform={onLeft(24)} className={body.ink}>
          <rect x={16} y={-H - 5} width={56} height={1} />
          <rect x={16} y={-H - 3} width={56} height={1} />
        </g>
        <Block faces={box(W - 32, D - 22, H, 26, 16, 3)} paint={body} />
        <g transform={onTop(H + 3)}>
          <rect x={W - 28} y={D - 19} width={12} height={10} rx={2} className={body.ink} />
          <circle cx={W - 11} cy={D - 14} r={2.5} className={cn("isometric105-led", body.ink)} />
        </g>
        <Block faces={box(TRAY.x, D, TRAY.z, TRAY.w, TRAY.d, 2)} paint={body} />
        <g clipPath={`url(#${clipId})`}>
          <g transform={onTop(sheetZ)}>
            <g className="isometric105-sheet">
              <rect x={SHEET.x} y={D} width={SHEET.w} height={SHEET.d} rx={1} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
              {LINES.map((y) => (
                <rect key={y} x={SHEET.x + 5} y={D + y} width={y === 8 ? 18 : 30} height={2} rx={1} className={body.ink} />
              ))}
              {BARS.map((bar) => (
                <rect key={bar.y} x={SHEET.x + 5} y={D + bar.y} width={bar.w} height={3} rx={1} className={paint.accent.base} />
              ))}
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
