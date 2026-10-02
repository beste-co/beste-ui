"use client";

import type { ReactNode } from "react";
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

interface Isometric96Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the cabins with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric96Demo: Isometric96Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const BASE = 8;
const HUB_X = 48;
const HUB_Z = 68;
const R = 42;
const CABINS = 6;
const STEP = 360 / CABINS;
// The wheel stands in planes of constant y, back to front
const BACK_LEGS = [10, 11];
const BACK_RIM = [14, 15];
const CABIN_SLICES = [17, 18, 19, 20, 21, 22, 23];
const FRONT_RIM = [25, 26];
const FRONT_LEGS = [29, 30];

const ring = (outer: number, inner: number) =>
  `M${-outer} 0A${outer} ${outer} 0 1 0 ${outer} 0A${outer} ${outer} 0 1 0 ${-outer} 0Z M${-inner} 0A${inner} ${inner} 0 1 1 ${inner} 0A${inner} ${inner} 0 1 1 ${-inner} 0Z`;
const SPOKES = Array.from({ length: CABINS }, (_, index) => {
  const a = (index * STEP * Math.PI) / 180;
  const [c, s] = [Math.cos(a), Math.sin(a)];
  const p = (r: number, w: number) => `${(c * r - s * w).toFixed(2)} ${(s * r + c * w).toFixed(2)}`;
  return `M${p(4, -1)}L${p(R - 2, -1)}L${p(R - 2, 1)}L${p(4, 1)}Z`;
}).join(" ");
const WHEEL = `${ring(R, R - 5)} ${ring(8, 0.01)} ${SPOKES}`;
const LEGS = `M${HUB_X - 30} ${-BASE}L${HUB_X - 3} ${-HUB_Z}H${HUB_X + 3}L${HUB_X + 30} ${-BASE}H${HUB_X + 24}L${HUB_X} ${-HUB_Z + 10}L${HUB_X - 24} ${-BASE}Z`;
const SEATS = Array.from({ length: CABINS }, (_, index) => {
  const a = ((index * STEP + STEP / 2) * Math.PI) / 180;
  return { index, x: Math.cos(a) * (R - 2.5), y: Math.sin(a) * (R - 2.5) };
});
const CABIN = "M-9 5H9V14A5 5 0 0 1 4 19H-4A5 5 0 0 1 -9 14Z M-1.5 0H1.5V5H-1.5Z M-10 3H10V6H-10Z";

const STYLES = `
@keyframes isometric96-spin { 0%, 12% { transform: rotate(0deg); } 72%, 100% { transform: rotate(${STEP}deg); } }
@keyframes isometric96-level { 0%, 12% { transform: rotate(0deg); } 72%, 100% { transform: rotate(${-STEP}deg); } }
.isometric96-spin { animation: isometric96-spin 4s ease-in-out infinite; }
.isometric96-level { animation: isometric96-level 4s ease-in-out infinite; }
.isometric96-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric96-spin, .isometric96-level { animation: none; } }
`;

export function Isometric96({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric96Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const hub = (children: ReactNode) => (
    <g transform={`translate(${HUB_X} ${-HUB_Z})`}>
      <g className="isometric96-spin">{children}</g>
    </g>
  );
  const layer = (slices: number[], d: string, spin: boolean, fill: Paint) =>
    slices.map((y, index) => {
      const front = index === slices.length - 1;
      const shape = (
        <>
          <path d={d} fillRule="evenodd" className={fill.base} />
          <path d={d} fillRule="evenodd" className={front ? fill.left : fill.right} />
          {front && <path d={d} fillRule="evenodd" fill="none" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={fill.edge} />}
        </>
      );
      return (
        <g key={y} transform={onLeft(y)}>
          {spin ? hub(shape) : shape}
        </g>
      );
    });

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric96-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-38 -94 124 164" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(8, 2, 0, 80, 36, BASE)} paint={paint.body} />
        {layer(BACK_LEGS, LEGS, false, paint.body)}
        {layer(BACK_RIM, WHEEL, true, paint.body)}
        <Block faces={box(HUB_X - 3, 12, HUB_Z - 3, 6, 18, 6)} paint={paint.body} />
        {CABIN_SLICES.map((y, index) => {
          const front = index === CABIN_SLICES.length - 1;
          return (
            <g key={y} transform={onLeft(y)}>
              {hub(
                SEATS.map((seat) => (
                  <g key={seat.index} transform={`translate(${seat.x.toFixed(2)} ${seat.y.toFixed(2)})`}>
                    <g className="isometric96-level">
                      <path d={CABIN} className={paint.accent.base} />
                      <path d={CABIN} className={front ? paint.accent.left : paint.accent.right} />
                      {front && (
                        <>
                          <path d={CABIN} fill="none" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={paint.accent.edge} />
                          <rect x={-6} y={8} width={12} height={5} rx={2} className={paint.accent.ink} />
                        </>
                      )}
                    </g>
                  </g>
                )),
              )}
            </g>
          );
        })}
        {layer(FRONT_RIM, WHEEL, true, paint.body)}
        {layer(FRONT_LEGS, LEGS, false, paint.body)}
        <g transform={onLeft(FRONT_LEGS[FRONT_LEGS.length - 1] as number)}>
          <circle cx={HUB_X} cy={-HUB_Z} r={4} className={paint.body.ink} />
        </g>
      </svg>
    </div>
  );
}
