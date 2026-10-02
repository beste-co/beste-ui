"use client";

import { type CSSProperties, useId } from "react";
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

interface Isometric17Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Tint the blocks with the tone as they pass the gate; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric17Demo: Isometric17Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const L = 224;
const D = 40;
const BELT = 12;
const CUBE = 20;
const START = 4;
const TRAVEL = L - CUBE - START * 2;
const COUNT = 4;
const GATE = 104;
const POST = 12;
const GATE_H = 60;
const PERIOD = 7;
const STRIPE = 16;
const PASS = Math.round(((GATE + POST / 2 - CUBE / 2 - START) / TRAVEL) * 100);

const BLOCKS = Array.from({ length: COUNT }, (_, index) => {
  const phase = (index + 0.42) / COUNT;
  return { index, phase, x: START + Math.round(TRAVEL * phase) };
});

const at = (dx: string) => `translate(calc(${dx} * ${C}px), calc(${dx} * ${S}px))`;

const STYLES = `
@keyframes isometric17-ride { 0% { transform: ${at("var(--isometric17-from)")}; opacity: 0; } 6%, 92% { opacity: 1; } 100% { transform: ${at(`(var(--isometric17-from) + ${TRAVEL})`)}; opacity: 0; } }
@keyframes isometric17-tint { 0%, ${PASS - 2}% { opacity: 0; } ${PASS + 2}%, 100% { opacity: 1; } }
@keyframes isometric17-belt { from { transform: translateX(-${STRIPE}px); } to { transform: translateX(0); } }
.isometric17-block { animation: isometric17-ride ${PERIOD}s linear infinite; will-change: transform; }
.isometric17-tint { animation: isometric17-tint ${PERIOD}s linear infinite; }
.isometric17-belt { animation: isometric17-belt ${((PERIOD * STRIPE) / TRAVEL).toFixed(3)}s linear infinite; }
.isometric17-still * { animation: none !important; }
.isometric17-still .isometric17-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric17-block, .isometric17-tint, .isometric17-belt { animation: none; } .isometric17-rest { opacity: 1; } }
`;

export function Isometric17({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric17Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const band = accent ? paint.accent.base : paint.body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric17-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -38 266 184" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={L} height={D} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, L, D, BELT)} paint={paint.body} />
        <g transform={onLeft(D)} className={paint.body.ink}>
          <circle cx={10} cy={-BELT / 2} r={3} />
          <circle cx={L - 10} cy={-BELT / 2} r={3} />
        </g>
        <g transform={onTop(BELT)}>
          <g clipPath={`url(#${clipId})`}>
            <g className={cn("isometric17-belt", paint.body.ink)}>
              {Array.from({ length: Math.ceil(L / STRIPE) + 1 }, (_, index) => (
                <rect key={index} x={index * STRIPE + 5} y={4} width={4} height={D - 8} rx={2} />
              ))}
            </g>
          </g>
          <rect x={GATE} y={0} width={POST} height={D} className={band} />
        </g>
        <Block faces={box(GATE, -10, 0, POST, 10, GATE_H)} paint={paint.body} />
        {BLOCKS.map(({ index, phase, x }) => {
          const faces = box(x, (D - CUBE) / 2, BELT, CUBE, CUBE, CUBE);
          const timing = { animationDelay: `${(-phase * PERIOD).toFixed(2)}s` };
          const past = x + CUBE / 2 > GATE + POST / 2;
          return (
            <g key={index} className="isometric17-block" style={{ ...timing, "--isometric17-from": START - x } as CSSProperties}>
              <Block faces={faces} paint={paint.body} />
              {accent && (
                <g className={cn("isometric17-tint opacity-0", past && "isometric17-rest")} style={timing}>
                  <Block faces={faces} paint={paint.accent} />
                </g>
              )}
            </g>
          );
        })}
        <Block faces={box(GATE, -10, GATE_H, POST, D + 14, 10)} paint={paint.body} />
        <g transform={onLeft(D + 4)} className={band}>
          <rect x={GATE + 3} y={-GATE_H - 7} width={POST - 6} height={4} rx={2} />
        </g>
      </svg>
    </div>
  );
}
