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

interface Isometric144Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the stripe along the train with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric144Demo: Isometric144Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const G = 8;
const LEN = 156;
const PLATFORM = 14;
const RAILS = [32, 52];
// The train runs toward +x with its long side facing the viewer
const Y0 = 28;
const Y1 = 58;
const X0 = 16;
const NOSE = 118;
const TIP = 132;
const Z = 16;
const ROOF = 50;
const HOOD = 32;
const BOGIES = [X0 + 10, NOSE - 30];
const DOORS = [40, 82];
const WINDOWS: [number, number][] = [
  [21, 15],
  [58, 20],
  [100, 14],
];
const SLOPE = polygon([[NOSE, Y0, ROOF], [TIP, Y0, HOOD], [TIP, Y1, HOOD], [NOSE, Y1, ROOF]]);
const NOSE_SIDE = polygon([[NOSE, Y1, HOOD], [TIP, Y1, HOOD], [NOSE, Y1, ROOF]]);
const SCREEN = polygon([[NOSE + 2, Y0 + 3, ROOF - 3], [TIP - 2, Y0 + 3, HOOD + 3], [TIP - 2, Y1 - 3, HOOD + 3], [NOSE + 2, Y1 - 3, ROOF - 3]]);
// The train stays in frame; the sleepers slide back under it, stop at the platform and move on
const TIE = 8;

const STYLES = `
@keyframes isometric144-run { 0% { transform: translateX(0); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); } 32%, 70% { transform: translateX(${-12 * TIE}px); animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); } 100% { transform: translateX(${-23 * TIE}px); } }
@keyframes isometric144-door-a { 0%, 36% { transform: translateX(0); } 42%, 60% { transform: translateX(-5px); } 66%, 100% { transform: translateX(0); } }
@keyframes isometric144-door-b { 0%, 36% { transform: translateX(0); } 42%, 60% { transform: translateX(5px); } 66%, 100% { transform: translateX(0); } }
.isometric144-track { animation: isometric144-run 6s linear infinite; }
.isometric144-door-a { animation: isometric144-door-a 6s ease-in-out infinite; }
.isometric144-door-b { animation: isometric144-door-b 6s ease-in-out infinite; }
.isometric144-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric144-track, .isometric144-door-a, .isometric144-door-b { animation: none; } }
`;

export function Isometric144({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric144Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric144-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-68 -34 208 152" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={box(0, 0, 0, LEN, 72, G).top} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, LEN, 72, G)} paint={body} />
        <Block faces={box(0, 0, G, LEN, 20, PLATFORM - G)} paint={body} />
        <g transform={onTop(PLATFORM)} className={body.ink}>
          <rect x={0} y={15} width={LEN} height={3} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <g transform={onTop(G)} className={body.ink}>
            <g className="isometric144-track">
              {Array.from({ length: 44 }, (_, index) => (
                <rect key={index} x={4 + index * TIE} y={Y0} width={3} height={Y1 - Y0 - 2} rx={1} />
              ))}
            </g>
          </g>
        </g>
        {RAILS.map((y) => (
          <Block key={y} faces={box(0, y, G, LEN, 2, 2)} paint={body} />
        ))}
        <g>
          {BOGIES.map((x) => (
            <g key={x}>
              <Block faces={box(x, Y0 + 3, G + 2, 22, Y1 - Y0 - 6, Z - G - 2)} paint={body} />
              <g transform={onLeft(Y1 - 3)} className={body.ink}>
                <circle cx={x + 6} cy={-(G + 6)} r={3} />
                <circle cx={x + 16} cy={-(G + 6)} r={3} />
              </g>
            </g>
          ))}
          <Block faces={box(X0, Y0, Z, NOSE - X0, Y1 - Y0, ROOF - Z)} paint={body} />
          <Block faces={box(NOSE, Y0, Z, TIP - NOSE, Y1 - Y0, HOOD - Z)} paint={body} />
          <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
            <polygon points={NOSE_SIDE} className={body.base} />
            <polygon points={NOSE_SIDE} className={body.left} stroke="none" />
            <polygon points={SLOPE} className={body.base} />
          </g>
          <polygon points={SCREEN} className={body.ink} />
          <Block faces={box(X0 + 4, Y0 + 5, ROOF, NOSE - X0 - 8, Y1 - Y0 - 10, 2)} paint={body} />
          {[X0 + 22, X0 + 62].map((x) => (
            <Block key={x} faces={box(x, Y0 + 9, ROOF + 2, 18, Y1 - Y0 - 18, 4)} paint={body} />
          ))}
          <g transform={onLeft(Y1)}>
            <rect x={X0} y={-(Z + 11)} width={TIP - X0} height={5} className={paint.accent.base} />
            {accent && palette !== "tone" && <rect x={X0} y={-(Z + 11)} width={TIP - X0} height={5} className={paint.accent.left} />}
            <g className={body.ink}>
              {WINDOWS.map(([x, w]) => (
                <rect key={x} x={x} y={-(Z + 28)} width={w} height={10} rx={1.5} />
              ))}
              <rect x={NOSE + 1} y={-(HOOD + 2)} width={7} height={6} rx={1} />
            </g>
            {DOORS.map((x) => (
              <g key={x}>
                <rect x={x} y={-(Z + 29)} width={14} height={28} rx={1} className={body.ink} />
                <rect x={x} y={-(Z + 29)} width={14} height={28} rx={1} className={body.ink} />
                {[0, 1].map((side) => (
                  <g key={side} className={side === 0 ? "isometric144-door-a" : "isometric144-door-b"}>
                    <rect x={x + side * 7} y={-(Z + 29)} width={7} height={28} className={body.base} />
                    <rect x={x + side * 7} y={-(Z + 29)} width={7} height={28} className={body.left} />
                    <rect x={x + side * 7 + 1.5} y={-(Z + 26)} width={4} height={9} rx={1} className={body.ink} />
                    <rect x={x + side * 7} y={-(Z + 29)} width={7} height={28} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={body.edge} />
                  </g>
                ))}
              </g>
            ))}
          </g>
          <g transform={onRight(TIP)} className={body.ink}>
            <rect x={Y0 + 4} y={-(HOOD - 4)} width={6} height={3} rx={1.5} />
            <rect x={Y1 - 10} y={-(HOOD - 4)} width={6} height={3} rx={1.5} />
          </g>
        </g>
      </svg>
    </div>
  );
}
