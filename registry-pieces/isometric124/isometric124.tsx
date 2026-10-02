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

interface Isometric124Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the bird with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric124Demo: Isometric124Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const BASE = 8;
const POST_TOP = 52;
const H0 = 8;
const H1 = 48;
const MIDX = (H0 + H1) / 2;
const WALL = POST_TOP + 32;
const RIDGE = WALL + 16;
const PITCH = (RIDGE - WALL) / (MIDX - H0);
const OVER = 4;
const EAVE = WALL - OVER * PITCH;
const ROOF = 4;
const R0 = H0 - OVER;
const R1 = H1 + OVER;
const GABLE = polygon([[H0, H1, WALL], [MIDX, H1, RIDGE], [H1, H1, WALL]]);
const ROOF_BACK = polygon([[R0, R0, EAVE], [MIDX, R0, RIDGE], [MIDX, R1, RIDGE], [R0, R1, EAVE]]);
const ROOF_TOP = polygon([[MIDX, R0, RIDGE], [R1, R0, EAVE], [R1, R1, EAVE], [MIDX, R1, RIDGE]]);
const ROOF_END = polygon([[R0, R1, EAVE], [MIDX, R1, RIDGE], [R1, R1, EAVE], [R1, R1, EAVE - ROOF], [MIDX, R1, RIDGE - ROOF], [R0, R1, EAVE - ROOF]]);
const ROOF_EDGE = polygon([[R1, R0, EAVE], [R1, R1, EAVE], [R1, R1, EAVE - ROOF], [R1, R0, EAVE - ROOF]]);
const HOLE_Z = POST_TOP + 20;

const PERCH_Z = HOLE_Z - 14;
const HOLE_R = 6;
// The bird's head is a ball cut into upright slices along the hole's axis, so it reads as round from this angle
const HEAD_R = 5.2;
const OUT = H1 + 4;
const SLIDE = 24;
const HEAD = Array.from({ length: 21 }, (_, index) => {
  const off = -5 + index / 2;
  return { off, r: Math.sqrt(HEAD_R ** 2 - off ** 2) };
});
const BEAK = Array.from({ length: 9 }, (_, index) => ({ off: HEAD_R - 0.6 + index * 0.6, r: 2.3 * (1 - index / 9) + 0.2 }));
const EYE = { x: 2.2, z: 1.4 };
const EYE_OFF = Math.sqrt(HEAD_R ** 2 - EYE.x ** 2 - EYE.z ** 2);
/** The part of a slice above or below a level line, as a fraction of its radius. */
const cap = (r: number, level: number, above: boolean) => {
  const half = Math.sqrt(1 - level ** 2) * r;
  return `M${(-half).toFixed(2)} ${(-level * r).toFixed(2)}A${r.toFixed(2)} ${r.toFixed(2)} 0 0 ${above ? 1 : 0} ${half.toFixed(2)} ${(-level * r).toFixed(2)}Z`;
};
// Everything in front of the wall inside the hole's outline: the head only shows where it has passed through the hole
const TUNNEL = Array.from({ length: 10 }, (_, index) => H1 + index * 2);
const slide = (units: number) => `translate(${(units * C).toFixed(1)}px, ${(-units * S).toFixed(1)}px)`;
const STYLES = `
@keyframes isometric124-peek { 0%, 12% { transform: ${slide(SLIDE)}; } 26%, 76% { transform: translate(0, 0); } 90%, 100% { transform: ${slide(SLIDE)}; } }
@keyframes isometric124-look { 0%, 30% { transform: translate(0, 0); } 37%, 43% { transform: translate(-0.7px, 0); } 51%, 57% { transform: translate(0.7px, 0); } 63% { transform: translate(0, 0); } 67% { transform: translate(0, 0.8px); } 71%, 100% { transform: translate(0, 0); } }
@keyframes isometric124-face { 0%, 30% { transform: translate(0, 0); } 37%, 43% { transform: translate(-2.2px, 0); } 51%, 57% { transform: translate(2.2px, 0); } 63% { transform: translate(0, 0); } 67% { transform: translate(0, 1.6px); } 71%, 100% { transform: translate(0, 0); } }
.isometric124-bird { animation: isometric124-peek 5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric124-look { animation: isometric124-look 5s ease-in-out infinite; }
.isometric124-face { animation: isometric124-face 5s ease-in-out infinite; }
.isometric124-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric124-bird, .isometric124-look, .isometric124-face { animation: none; } }
`;

export function Isometric124({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric124Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const clipId = useId();
  const bird = paint.accent;
  const beak = palette === "tone" || !accentProp ? paint.body.ink.replace(/\/\d+$/, "/60") : "fill-amber-400";
  const hole = palette === "dark" ? "fill-black/50" : "fill-black/30";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric124-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-56 -92 112 154" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            {TUNNEL.map((y) => (
              <circle key={y} cx={MIDX} cy={-HOLE_Z} r={HOLE_R} transform={onLeft(y)} />
            ))}
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, 56, 56, BASE)} paint={paint.body} />
        <Block faces={box(MIDX - 4, MIDX - 4, BASE, 8, 8, POST_TOP - BASE - 4)} paint={paint.body} />
        <Block faces={box(H0 + 4, H0 + 4, POST_TOP - 4, H1 - H0 - 8, H1 - H0 - 8, 4)} paint={paint.body} />
        <Block faces={box(H0, H0, POST_TOP, H1 - H0, H1 - H0, WALL - POST_TOP)} paint={paint.body} />
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={GABLE} className={paint.body.base} />
          <polygon points={GABLE} stroke="none" className={paint.body.left} />
        </g>
        <g transform={onLeft(H1)}>
          <circle cx={MIDX} cy={-HOLE_Z} r={8} className={paint.body.ink} />
          <circle cx={MIDX} cy={-HOLE_Z} r={HOLE_R} className={hole} />
        </g>
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={ROOF_BACK} className={paint.body.base} />
          <polygon points={ROOF_EDGE} className={paint.body.base} />
          <polygon points={ROOF_EDGE} stroke="none" className={paint.body.right} />
          <polygon points={ROOF_TOP} className={paint.body.base} />
          <polygon points={ROOF_TOP} stroke="none" className={paint.body.left} />
          <polygon points={ROOF_END} className={paint.body.base} />
          <polygon points={ROOF_END} stroke="none" className={paint.body.left} />
        </g>
        <Block faces={box(MIDX - 1, H1, PERCH_Z - 2, 2, 8, 2)} paint={paint.body} />
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric124-bird">
            {HEAD.map((slice) => (
              <g key={slice.off} transform={onLeft(OUT + slice.off)}>
                <g transform={`translate(${MIDX} ${-HOLE_Z})`}>
                  <g className="isometric124-look">
                    <circle r={slice.r} className={bird.base} />
                    <path d={cap(slice.r, 0.35, true)} className={bird.right} />
                    <path d={cap(slice.r, -0.3, false)} className={bird.ink} />
                  </g>
                </g>
              </g>
            ))}
            <g transform={onLeft(OUT + EYE_OFF)}>
              <g transform={`translate(${MIDX} ${-HOLE_Z})`}>
                <g className="isometric124-face">
                  {[-EYE.x, EYE.x].map((x) => (
                    <g key={x}>
                      <circle cx={x} cy={-EYE.z} r={1.5} className="fill-white" />
                      <circle cx={x} cy={-EYE.z} r={0.85} className="fill-zinc-900" />
                    </g>
                  ))}
                </g>
              </g>
            </g>
            {BEAK.map((slice) => (
              <g key={slice.off} transform={onLeft(OUT + slice.off)}>
                <g transform={`translate(${MIDX} ${-HOLE_Z + 1.2})`}>
                  <g className="isometric124-face">
                    <circle r={slice.r} className={beak} />
                    <path d={cap(slice.r, 0, false)} className="fill-black/20" />
                  </g>
                </g>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
