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

interface Isometric93Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Paint the flag in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric93Demo: Isometric93Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const X0 = 8;
const X1 = 84;
const W = 32;
const R = W / 2;
const ZB = 46;
const WALL = 16;
const ROOF_Z = ZB + WALL;

/** Points on the rounded roof, from the front side (angle 0) over the top. */
function arc(x: number, from: number, to: number): Point[] {
  const points: Point[] = [];
  for (let k = 0; k <= 12; k++) {
    const angle = ((from + ((to - from) * k) / 12) * Math.PI) / 180;
    points.push([x, R + R * Math.cos(angle), ROOF_Z + R * Math.sin(angle)]);
  }
  return points;
}
const band = (from: number, to: number) => polygon([...arc(X0, from, to), ...arc(X1, from, to).reverse()]);
const ROOF = band(0, 180);
const ROOF_SIDE = band(0, 50);
// The door profile in the plane x = X1, drawn in (y, -z)
const DOOR = `M0 ${-ZB}H${W}V${-ROOF_Z}A${R} ${R} 0 0 0 0 ${-ROOF_Z}Z`;

// The flag is drawn raised and swings down by 90 degrees about its pin
const PIN_X = X0 + 14;
const PIN_Z = ZB + 8;
const FLAG = "M-2 2V-34H2V2Z M2 -34H20V-20H2Z";
const FLAG_SLICES = [W, W + 1, W + 2];

// Level with the slot drawn on the door
const LETTER_Z = ROOF_Z - 3;
const TRAVEL = 36;

const STYLES = `
@keyframes isometric93-letter { 0% { transform: translate(${(TRAVEL * C).toFixed(1)}px, ${(TRAVEL * S).toFixed(1)}px); opacity: 0; } 10% { opacity: 1; } 38%, 100% { transform: translate(0, 0); opacity: 1; } }
@keyframes isometric93-flag { 0%, 36% { transform: rotate(90deg); } 46% { transform: rotate(-6deg); } 52%, 84% { transform: rotate(0deg); } 96%, 100% { transform: rotate(90deg); } }
.isometric93-letter { animation: isometric93-letter 5s cubic-bezier(0.3, 0, 0.2, 1) infinite; will-change: transform, opacity; }
.isometric93-flag { animation: isometric93-flag 5s ease-in-out infinite; }
.isometric93-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric93-letter, .isometric93-flag { animation: none; } }
`;

export function Isometric93({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric93Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const flag = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric93-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-50 -92 166 158" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={polygon([[X1, -200, LETTER_Z + 1], [400, -200, LETTER_Z + 1], [400, 400, LETTER_Z + 1], [X1, 400, LETTER_Z + 1]])} />
          </clipPath>
        </defs>
        <Block faces={box(14, -8, 0, 72, 48, 8)} paint={paint.body} />
        <Block faces={box(44, 12, 8, 8, 8, ZB - 12)} paint={paint.body} />
        <Block faces={box(32, 4, ZB - 4, 32, 24, 4)} paint={paint.body} />
        <Block faces={box(X0, 0, ZB, X1 - X0, W, WALL)} paint={paint.body} />
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={ROOF} className={paint.body.base} />
          <polygon points={ROOF_SIDE} stroke="none" className={paint.body.left} />
        </g>
        <g transform={onRight(X1)} strokeWidth={1} strokeLinejoin="round">
          <path d={DOOR} className={cn(paint.body.base, paint.body.edge)} />
          <path d={DOOR} className={paint.body.right} />
          <rect x={R - 5} y={-ROOF_Z - 8} width={10} height={4} rx={2} className={paint.body.ink} />
          <rect x={3} y={-ROOF_Z + 3} width={W - 6} height={2} rx={1} className={paint.body.ink} />
        </g>
        {FLAG_SLICES.map((y, index) => {
          const front = index === FLAG_SLICES.length - 1;
          return (
            <g key={y} transform={onLeft(y + 1)}>
              <g transform={`translate(${PIN_X} ${-PIN_Z})`}>
                <g className="isometric93-flag">
                  <path d={FLAG} className={flag.base} />
                  <path d={FLAG} className={front ? flag.left : flag.right} />
                  {front && <path d={FLAG} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={flag.edge} />}
                </g>
              </g>
              {front && <circle cx={PIN_X} cy={-PIN_Z} r={2.5} className={paint.body.ink} />}
            </g>
          );
        })}
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric93-letter">
            <Block faces={box(X1 - 28, 5, LETTER_Z, 28, 22, 2)} paint={paint.body} />
            <g transform={onTop(LETTER_Z + 2)} className={paint.body.ink}>
              <rect x={X1 - 8} y={6} width={5} height={6} rx={1} />
              <rect x={X1 - 22} y={12} width={12} height={2} rx={1} />
              <rect x={X1 - 22} y={16} width={8} height={2} rx={1} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
