"use client";

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

interface Isometric98Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Stripe the barrier arm with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric98Demo: Isometric98Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const GROUND = 8;
const ARM_Y = 50;
const PIVOT_X = 67;
const PIVOT_Z = 26;
const ARM = 48;
const STRIPE = 8;
const ARM_SLICES = [ARM_Y + 1, ARM_Y + 2, ARM_Y + 3];
const CAR_X = 32;
const CAR_Y = 62;
const CAR_W = 24;
const CAR_L = 32;
const CHASSIS = GROUND + 4;
const shift = (dy: number) => `translate(${(-dy * C).toFixed(1)}px, ${(dy * S).toFixed(1)}px)`;

const STYLES = `
@keyframes isometric98-car { 0% { transform: ${shift(24)}; opacity: 0; } 8% { opacity: 1; } 30%, 52% { transform: translate(0, 0); opacity: 1; } 64% { opacity: 1; } 74%, 100% { transform: ${shift(-46)}; opacity: 0; } }
@keyframes isometric98-ahead { 0%, 41.9% { opacity: 0; } 42%, 100% { opacity: 1; } }
@keyframes isometric98-arm { 0%, 30% { transform: rotate(-90deg); } 42%, 72% { transform: rotate(0deg); } 86%, 100% { transform: rotate(-90deg); } }
.isometric98-car { animation: isometric98-car 6s ease-in-out infinite; will-change: transform, opacity; }
.isometric98-arm { animation: isometric98-arm 6s ease-in-out infinite; }
.isometric98-ahead { animation: isometric98-ahead 6s linear infinite; }
.isometric98-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric98-car, .isometric98-arm, .isometric98-ahead { animation: none; } }
`;

export function Isometric98({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric98Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const tyre = palette === "dark" ? "fill-black/60" : palette === "tone" ? "fill-black/40" : "fill-zinc-900";
  const stripes = Array.from({ length: Math.floor(ARM / STRIPE) }, (_, index) => index).filter((index) => index % 2 === 1);

  // Drawn twice: behind the waiting car, then ahead of it once the arm is up
  const gate = (
    <>
      <Block faces={box(PIVOT_X - 5, ARM_Y - 10, GROUND, 10, 10, PIVOT_Z - GROUND + 6)} paint={paint.body} />
      {ARM_SLICES.map((y, index) => {
        const front = index === ARM_SLICES.length - 1;
        return (
          <g key={y} transform={onLeft(y)}>
            <g transform={`translate(${PIVOT_X} ${-PIVOT_Z})`}>
              <g className="isometric98-arm">
                <rect x={-5} y={-2} width={10} height={10} rx={2} className={paint.body.base} />
                <rect x={-5} y={-2} width={10} height={10} rx={2} className={front ? paint.body.left : paint.body.right} />
                <rect x={-3} y={-ARM} width={6} height={ARM} rx={3} className={paint.body.base} />
                {stripes.map((index) => (
                  <rect key={index} x={-3} y={-(index + 1) * STRIPE} width={6} height={STRIPE} className={paint.accent.base} />
                ))}
                <rect x={-3} y={-ARM} width={6} height={ARM} rx={3} className={front ? paint.body.left : paint.body.right} />
                {front && (
                  <>
                    <rect x={-3} y={-ARM} width={6} height={ARM} rx={3} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={paint.body.edge} />
                    <circle cx={0} cy={0} r={2} className={paint.body.ink} />
                  </>
                )}
              </g>
            </g>
          </g>
        );
      })}
    </>
  );
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric98-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-90 -40 152 138" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 26, 0, 76, 72, GROUND)} paint={paint.body} />
        <g transform={onTop(GROUND)} className={paint.body.ink}>
          <rect x={CAR_X - 4} y={26} width={2} height={72} />
          <rect x={CAR_X + CAR_W + 2} y={26} width={2} height={72} />
          <rect x={CAR_X} y={ARM_Y + 5} width={CAR_W} height={2} />
        </g>
        {gate}
        <g className="isometric98-car">
          <Block faces={box(CAR_X, CAR_Y, CHASSIS, CAR_W, CAR_L, 10)} paint={paint.body} />
          <Block faces={box(CAR_X + 2, CAR_Y + 8, CHASSIS + 10, CAR_W - 4, 18, 9)} paint={paint.body} />
          <g transform={onRight(CAR_X + CAR_W)}>
            <circle cx={CAR_Y + 7} cy={-CHASSIS - 1} r={4} className={tyre} />
            <circle cx={CAR_Y + CAR_L - 7} cy={-CHASSIS - 1} r={4} className={tyre} />
          </g>
          <g transform={onRight(CAR_X + CAR_W - 2)} className={paint.body.ink}>
            <rect x={CAR_Y + 10} y={-CHASSIS - 18} width={6} height={6} rx={1} />
            <rect x={CAR_Y + 18} y={-CHASSIS - 18} width={6} height={6} rx={1} />
          </g>
          <g transform={onLeft(CAR_Y + CAR_L)} className={paint.body.ink}>
            <rect x={CAR_X + 3} y={-CHASSIS - 7} width={5} height={3} rx={1} />
            <rect x={CAR_X + CAR_W - 8} y={-CHASSIS - 7} width={5} height={3} rx={1} />
          </g>
          <g transform={onLeft(CAR_Y + 26)} className={paint.body.ink}>
            <rect x={CAR_X + 5} y={-CHASSIS - 17} width={CAR_W - 10} height={6} rx={1} />
          </g>
        </g>
        <g className="isometric98-ahead">{gate}</g>
      </svg>
    </div>
  );
}
