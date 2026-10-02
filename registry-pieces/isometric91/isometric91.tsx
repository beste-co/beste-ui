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

interface Isometric91Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the recording light and the view cone with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric91Demo: Isometric91Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const FLOOR = 8;
const WALL = 8;
// The camera turns about a vertical axis through this plan point
const PIVOT_X = 44;
const PIVOT_Y = 24;
const CAM_LOW = 34;
const CAM_TOP = 54;
// The body is a stack of horizontal slices so it can turn in plan
const SLICES = Array.from({ length: CAM_TOP - CAM_LOW }, (_, index) => CAM_LOW + index);
const SHELL = "M-11 -6H11V26A4 4 0 0 1 7 30H-7A4 4 0 0 1 -11 26Z";
const HOOD = "M-12 -6H12V30A4 4 0 0 1 8 34H-8A4 4 0 0 1 -12 30Z";
const FRONT = "M-11 25H11V26A4 4 0 0 1 7 30H-7A4 4 0 0 1 -11 26Z";
const LENS_Z = 44;
// The pan angle is animated as cos and sin, so the body's turn and the lens on its front face stay in step
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const sweep = (from: number, to: number, start: number, end: number): [number, number][] =>
  Array.from({ length: 9 }, (_, index) => [start + ((end - start) * index) / 8, from + (to - from) * ease(index / 8)]);
const PAN: [number, number][] = [[0, 0], ...sweep(0, -26, 12, 34), ...sweep(-26, 18, 50, 78), ...sweep(18, 0, 90, 100)];
const TURN = PAN.map(([at, degrees]) => `${at.toFixed(2)}% { --isometric91-c: ${Math.cos((degrees * Math.PI) / 180).toFixed(4)}; --isometric91-s: ${Math.sin((degrees * Math.PI) / 180).toFixed(4)}; }`).join(" ");
// The view is a cone of light from the lens down to an oval on the floor, cut into level slices so it can turn in plan
const LENS_OUT = 31;
const SPOT = { y: 43, rx: 18, ry: 11 };
const BEAM = Array.from({ length: 28 }, (_, index) => {
  const reach = 1 - index / 28;
  return { z: FLOOR + (LENS_Z - FLOOR) * (1 - reach), cy: LENS_OUT + (SPOT.y - LENS_OUT) * reach, rx: SPOT.rx * reach, ry: SPOT.ry * reach };
});

const STYLES = `
@property --isometric91-c { syntax: "<number>"; inherits: true; initial-value: 1; }
@property --isometric91-s { syntax: "<number>"; inherits: true; initial-value: 0; }
@keyframes isometric91-view { ${TURN} }
@keyframes isometric91-blink { 0%, 44%, 100% { opacity: 1; } 50%, 56% { opacity: 0.2; } }
.isometric91-view { animation: isometric91-view 6s linear infinite; }
.isometric91-pan { transform: matrix(var(--isometric91-c), var(--isometric91-s), calc(-1 * var(--isometric91-s)), var(--isometric91-c), 0, 0); }
.isometric91-lens { transform: matrix(1, 0, calc(-1 * var(--isometric91-c) - var(--isometric91-s)), calc(var(--isometric91-s) - var(--isometric91-c)), 0, 0); }
.isometric91-led { animation: isometric91-blink 2s ease-in-out infinite; }
.isometric91-still, .isometric91-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric91-view, .isometric91-led { animation: none; } }
`;

export function Isometric91({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric91Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const light = accent ? paint.accent.base : paint.body.ink;
  const turn = (children: ReactNode) => (
    <g transform={`translate(${PIVOT_X} ${PIVOT_Y})`}>
      <g className="isometric91-pan">{children}</g>
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric91-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-78 -80 164 170" aria-hidden="true" className="isometric91-view size-full overflow-visible">
        <Block faces={box(0, 0, 0, 88, 80, FLOOR)} paint={paint.body} />
        <g transform={onTop(FLOOR)}>
          {turn(
            <>
              <ellipse cy={SPOT.y} rx={SPOT.rx + 4} ry={SPOT.ry + 3} className={cn(light, "opacity-20")} />
              <ellipse cy={SPOT.y} rx={SPOT.rx} ry={SPOT.ry} className={cn(light, "opacity-30")} />
            </>,
          )}
        </g>
        <Block faces={box(0, 0, FLOOR, 88, WALL, 64)} paint={paint.body} />
        <Block faces={box(PIVOT_X - 7, WALL, CAM_TOP + 2, 14, 3, 16)} paint={paint.body} />
        {BEAM.map((slice) => (
          <g key={slice.z} transform={onTop(slice.z)}>
            {turn(<ellipse cy={slice.cy} rx={slice.rx} ry={slice.ry} className={cn(light, "opacity-5")} />)}
          </g>
        ))}
        {SLICES.map((z) => {
          const top = z === CAM_TOP - 1;
          const hood = z >= CAM_TOP - 3;
          return (
            <g key={z} transform={onTop(z + 1)}>
              {turn(
                <>
                  <path d={hood ? HOOD : SHELL} className={paint.body.base} />
                  {!top && <path d={hood ? HOOD : SHELL} className={paint.body.right} />}
                  {!top && <path d={FRONT} className={paint.body.base} />}
                  {!top && <path d={FRONT} className={paint.body.left} />}
                  {top && (
                    <>
                      <path d={HOOD} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={paint.body.edge} />
                      
                      <circle cx={0} cy={24} r={3.5} className={cn("isometric91-led", light)} />
                    </>
                  )}
                </>,
              )}
            </g>
          );
        })}
        {/* The lens lies on the front face: its width turns with the body, its height stays upright */}
        <g transform={onTop(LENS_Z)}>
          {turn(
            <g transform="translate(0 30.6)">
              <g className="isometric91-lens">
                <circle r={7.5} className={paint.body.base} />
                <circle r={7.5} className={paint.body.ink} />
                <circle r={5.5} className={palette === "dark" ? "fill-black/70" : "fill-zinc-900"} />
                <circle cx={-1.8} cy={1.8} r={1.6} className="fill-white/60" />
              </g>
            </g>,
          )}
        </g>
        <Block faces={box(PIVOT_X - 3, PIVOT_Y - 3, CAM_TOP, 6, 6, 6)} paint={paint.body} />
        <Block faces={box(PIVOT_X - 4, WALL + 3, CAM_TOP + 6, 8, PIVOT_Y - WALL + 1, 6)} paint={paint.body} />
      </svg>
    </div>
  );
}
