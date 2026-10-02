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

interface Isometric101Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Bake the rising loaf in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric101Demo: Isometric101Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 96;
const D = 52;
const LEG = 12;
const H = 72;
const TOP = LEG + H;
// Front face details are drawn in (x, -z) on the plane y = D; one window per deck
const DECKS = [
  { bottom: LEG + 6, h: 22 },
  { bottom: LEG + 41, h: 22 },
];
const WIN_X = 6;
const WIN_W = 68;
const LOWER = DECKS[0] ?? { bottom: 0, h: 0 };
const UPPER = DECKS[1] ?? { bottom: 0, h: 0 };
const STONE = -LOWER.bottom - 3;
const LOAF = "M17 0 C15 -9 22 -16 40 -16 C58 -16 65 -9 63 0 Z";
const SCORES = [26, 34, 42, 50];
// The loaf lies inside the oven, behind the glass: a rounded body cut into upright slices across its depth
const LOAF_Y = D - 8;
const LOAF_HALF = 7;
const LOAF_SLICES = Array.from({ length: 2 * LOAF_HALF - 1 }, (_, index) => index - LOAF_HALF + 1);
const ROLLS = [14, 32, 50];
const LEGS: [number, number][] = [
  [0, 0],
  [W - 6, 0],
  [0, D - 6],
  [W - 6, D - 6],
];

const STYLES = `
@keyframes isometric101-rise { 0% { transform: scale(0.8, 0.45); opacity: 0; } 8% { opacity: 1; } 52%, 86% { transform: scale(1); opacity: 1; } 96%, 100% { transform: scale(1); opacity: 0; } }
@keyframes isometric101-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
.isometric101-loaf { animation: isometric101-rise 5.2s cubic-bezier(0.3, 0, 0.3, 1) infinite both; transform-box: fill-box; transform-origin: 50% 100%; will-change: transform, opacity; }
.isometric101-glow { animation: isometric101-glow 2.6s ease-in-out infinite; }
.isometric101-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric101-loaf, .isometric101-glow { animation: none; } }
`;

export function Isometric101({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric101Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const glass = palette === "dark" ? "fill-black/40" : palette === "tone" ? "fill-black/20" : body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric101-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-52 -92 142 172" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={WIN_X} y={-LOWER.bottom - LOWER.h} width={WIN_W} height={LOWER.h} rx={3} transform={onLeft(D)} />
          </clipPath>
        </defs>
        {LEGS.map(([x, y]) => (
          <Block key={`${x}-${y}`} faces={box(x, y, 0, 6, 6, LEG)} paint={body} />
        ))}
        <Block faces={box(0, 0, LEG, W, D, H)} paint={body} />
        <Block faces={box(62, 10, TOP, 16, 16, 12)} paint={body} />
        <g transform={onTop(TOP + 12)} className={body.ink}>
          <rect x={66} y={14} width={8} height={8} rx={2} />
        </g>
        <g transform={onLeft(D)}>
          <rect x={0} y={-UPPER.bottom + 6} width={W} height={1.5} className={body.ink} />
          {DECKS.map((deck) => (
            <g key={deck.bottom}>
              <rect x={WIN_X} y={-deck.bottom - deck.h} width={WIN_W} height={deck.h} rx={3} className={body.base} />
              <rect x={WIN_X} y={-deck.bottom - deck.h} width={WIN_W} height={deck.h} rx={3} className={glass} />
              <rect x={WIN_X + 4} y={-deck.bottom - deck.h + 3} width={WIN_W - 8} height={2} rx={1} className={cn("isometric101-glow", body.ink)} />
              <rect x={WIN_X} y={-deck.bottom - 3} width={WIN_W} height={3} className={body.base} />
              <rect x={82} y={-deck.bottom - deck.h + 1} width={10} height={6} rx={1.5} className={body.ink} />
              <circle cx={87} cy={-deck.bottom - 6} r={5} className={body.ink} />
              <rect x={86} y={-deck.bottom - 11} width={2} height={5} rx={1} className={body.base} />
            </g>
          ))}
          {ROLLS.map((x) => (
            <path key={x} d={`M${x} ${-UPPER.bottom - 3} c0 -6 3 -9 8 -9 c5 0 8 3 8 9 Z`} className={body.base} />
          ))}
        </g>
        <g clipPath={`url(#${clipId})`}>
          {LOAF_SLICES.map((offset) => {
            const girth = Math.sqrt(1 - (offset / LOAF_HALF) ** 2);
            return (
              <g key={offset} transform={onLeft(LOAF_Y + offset)}>
                <g className="isometric101-loaf">
                  <g transform={`translate(40 ${STONE}) scale(${(0.6 + 0.4 * girth).toFixed(3)} ${(0.85 * girth).toFixed(3)}) translate(-40 0)`}>
                    <path d={LOAF} className={paint.accent.base} />
                    {offset < 0 && <path d={LOAF} className={paint.accent.right} />}
                    {offset > 3 && <path d={LOAF} className={paint.accent.left} />}
                    {Math.abs(offset) < 3 && (
                      <g className={paint.accent.ink}>
                        {SCORES.map((x) => (
                          <rect key={x} x={x + offset} y={-16} width={3} height={2.5} />
                        ))}
                      </g>
                    )}
                  </g>
                </g>
              </g>
            );
          })}
          {/* The glass door dulls what is behind it */}
          <g transform={onLeft(D)}>
            <rect x={WIN_X} y={-LOWER.bottom - LOWER.h} width={WIN_W} height={LOWER.h} rx={3} className={cn(body.base, "opacity-20")} />
            <rect x={WIN_X + 4} y={-LOWER.bottom - LOWER.h + 3} width={WIN_W - 8} height={2} rx={1} className={cn("isometric101-glow", body.ink)} />
            <path d={`M${WIN_X + 8} ${-LOWER.bottom - 2} l10 ${-LOWER.h + 4} h6 l-10 ${LOWER.h - 4} Z`} className={cn(body.base, "opacity-30")} />
          </g>
        </g>
        {DECKS.map((deck) => (
          <Block key={deck.bottom} faces={box(10, D, deck.bottom + deck.h + 3, 60, 4, 3)} paint={body} />
        ))}
      </svg>
    </div>
  );
}
