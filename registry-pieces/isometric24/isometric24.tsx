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

interface Isometric24Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Show the approval check in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric24Demo: Isometric24Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 64;
const D = 96;
const H = 16;
const TERMINAL = box(0, 0, 0, W, D, H);
const KEYS = Array.from({ length: 12 }, (_, index) => ({ x: 10 + (index % 3) * 16, y: 50 + Math.floor(index / 3) * 10 }));
const CARD_Z = 6;
const CARD = box(12, 70, CARD_Z, 40, 56, 2);
// Only the part of the card in front of the slot face shows
const CARD_CLIP = polygon([
  [-200, D, CARD_Z + 2],
  [300, D, CARD_Z + 2],
  [300, 400, CARD_Z + 2],
  [-200, 400, CARD_Z + 2],
]);

const MARK: Record<Palette, string> = {
  theme: "stroke-foreground",
  light: "stroke-zinc-900",
  dark: "stroke-zinc-100",
  tone: "stroke-black/70",
  glass: "stroke-foreground",
};

const STYLES = `
@keyframes isometric24-card { 0% { transform: translate(-17.3px, 10px); opacity: 0; } 12% { opacity: 1; } 34%, 80% { transform: translate(0, 0); opacity: 1; } 94%, 100% { transform: translate(-17.3px, 10px); opacity: 0; } }
@keyframes isometric24-check { 0%, 38% { transform: scale(0.6); opacity: 0; } 46%, 80% { transform: scale(1); opacity: 1; } 90%, 100% { transform: scale(1); opacity: 0; } }
.isometric24-card { animation: isometric24-card 4.8s cubic-bezier(0.45, 0, 0.2, 1) infinite; will-change: transform, opacity; }
.isometric24-check { animation: isometric24-check 4.8s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric24-still * { animation: none !important; }
.isometric24-still .isometric24-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric24-card, .isometric24-check { animation: none; } .isometric24-rest { opacity: 1; } }
`;

export function Isometric24({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric24Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const mark = !accent ? MARK[palette] : palette === "tone" ? "stroke-current" : "stroke-white";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric24-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-126 -26 192 130" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={CARD_CLIP} />
          </clipPath>
        </defs>
        <Block faces={TERMINAL} paint={paint.body} />
        <g transform={onTop(H)} className={paint.body.ink}>
          <rect x={8} y={8} width={48} height={32} rx={5} />
        </g>
        {KEYS.map(({ x, y }) => (
          <Block key={`${x}-${y}`} faces={box(x, y, H, 12, 7, 2)} paint={paint.body} />
        ))}
        <g transform={onLeft(D)} className={paint.body.ink}>
          <rect x={10} y={-CARD_Z - 3} width={44} height={4} rx={2} />
        </g>
        <g transform={onTop(H)}>
          <g className="isometric24-check isometric24-rest opacity-0">
            <circle cx={32} cy={24} r={10} className={accent ? paint.accent.base : paint.body.base} />
            <polyline points="28.6,26.4 33.6,27.4 32.4,18.6" fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={mark} />
          </g>
        </g>
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric24-card">
            <Block faces={CARD} paint={paint.body} />
            <g transform={onTop(CARD_Z + 2)} className={paint.body.ink}>
              <rect x={20} y={104} width={10} height={14} rx={2} />
              <rect x={38} y={100} width={6} height={20} rx={2} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
