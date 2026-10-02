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

interface Isometric143Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the painting with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric143Demo: Isometric143Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const FLOOR = { w: 76, d: 44, h: 6 };
const WALL = { d: 6, h: 70 };
const FRAME = { x: 12, w: 52, z: FLOOR.h + 20, h: 38, t: 3 };
const FACE = WALL.d + FRAME.t;
const CANVAS = { x: FRAME.x + 4, w: FRAME.w - 8, z0: FRAME.z + 4, z1: FRAME.z + FRAME.h - 4 };
const LAMP = { x: 26, w: 24, z: FRAME.z + FRAME.h + 5 };
const HILLS_BACK = `M${CANVAS.x} ${-CANVAS.z0 - 12}L${CANVAS.x + 12} ${-CANVAS.z0 - 19}L${CANVAS.x + 22} ${-CANVAS.z0 - 13}L${CANVAS.x + 31} ${-CANVAS.z0 - 20}L${CANVAS.x + CANVAS.w} ${-CANVAS.z0 - 11}V${-CANVAS.z0}H${CANVAS.x}Z`;
const HILLS_FRONT = `M${CANVAS.x} ${-CANVAS.z0 - 6}C${CANVAS.x + 10} ${-CANVAS.z0 - 11} ${CANVAS.x + 20} ${-CANVAS.z0 - 4} ${CANVAS.x + 30} ${-CANVAS.z0 - 8}C${CANVAS.x + 35} ${-CANVAS.z0 - 10} ${CANVAS.x + 38} ${-CANVAS.z0 - 9} ${CANVAS.x + CANVAS.w} ${-CANVAS.z0 - 7}V${-CANVAS.z0}H${CANVAS.x}Z`;
const CONE = `M${LAMP.x + 2} ${-LAMP.z + 1}H${LAMP.x + LAMP.w - 2}L${FRAME.x + FRAME.w + 6} ${-FRAME.z + 2}H${FRAME.x - 6}Z`;
const BENCH = { x: 22, y: 26, w: 32, d: 10, z: FLOOR.h + 8, t: 3 };

const STYLES = `
@keyframes isometric143-light { 0%, 14% { opacity: 0; } 20% { opacity: 1; } 22% { opacity: 0.4; } 28%, 76% { opacity: 1; } 90%, 100% { opacity: 0; } }
.isometric143-light { animation: isometric143-light 5.5s ease-in-out infinite; }
.isometric143-still * { animation: none !important; }
.isometric143-still .isometric143-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric143-light { animation: none; } .isometric143-rest { opacity: 1; } }
`;

export function Isometric143({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric143Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const art = paint.accent;
  const glow = palette === "tone" ? "fill-white/25" : palette === "dark" ? "fill-white/10" : accent ? "fill-current opacity-15" : "fill-foreground/5";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric143-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-43 -80 114 143" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={CANVAS.x} y={-CANVAS.z1} width={CANVAS.w} height={CANVAS.z1 - CANVAS.z0} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, FLOOR.w, FLOOR.d, FLOOR.h)} paint={body} />
        <Block faces={box(0, 0, FLOOR.h, FLOOR.w, WALL.d, WALL.h)} paint={body} />
        <g className="isometric143-light isometric143-rest opacity-0">
          <path d={CONE} transform={onLeft(WALL.d)} className={glow} />
        </g>
        <Block faces={box(FRAME.x, WALL.d, FRAME.z, FRAME.w, FRAME.t, FRAME.h)} paint={body} />
        <g transform={onLeft(FACE)}>
          <rect x={CANVAS.x - 1} y={-CANVAS.z1 - 1} width={CANVAS.w + 2} height={CANVAS.z1 - CANVAS.z0 + 2} className={body.ink} />
          <g clipPath={`url(#${clipId})`}>
            <rect x={CANVAS.x} y={-CANVAS.z1} width={CANVAS.w} height={CANVAS.z1 - CANVAS.z0} className={art.base} />
            <circle cx={CANVAS.x + 28} cy={-CANVAS.z1 + 8} r={4} className={art.ink} />
            <path d={HILLS_BACK} className={art.left} />
            <path d={HILLS_FRONT} className={art.right} />
            <g className="isometric143-light isometric143-rest opacity-0">
              <rect x={CANVAS.x} y={-CANVAS.z1} width={CANVAS.w} height={CANVAS.z1 - CANVAS.z0} className="fill-white/20" />
            </g>
          </g>
        </g>
        <Block faces={box(LAMP.x + LAMP.w / 2 - 1, WALL.d, LAMP.z + 1, 2, 5, 2)} paint={body} />
        <Block faces={box(LAMP.x, WALL.d + 4, LAMP.z, LAMP.w, 3, 3)} paint={body} />
        {[BENCH.x + 2, BENCH.x + BENCH.w - 5].map((x) => (
          <Block key={x} faces={box(x, BENCH.y + 1, FLOOR.h, 3, BENCH.d - 2, BENCH.z - FLOOR.h)} paint={body} />
        ))}
        <Block faces={box(BENCH.x, BENCH.y, BENCH.z, BENCH.w, BENCH.d, BENCH.t)} paint={body} />
      </svg>
    </div>
  );
}
