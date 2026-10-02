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

interface Isometric142Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the curtains with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric142Demo: Isometric142Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const STAGE = { w: 84, d: 46, h: 10 };
const WALL = { y: 4, d: 6 };
const FRONT = WALL.y + WALL.d;
const OPEN = { x0: 14, x1: 70, z0: STAGE.h, z1: STAGE.h + 40 };
const BEAM = { z: OPEN.z1, h: 10 };
const HALF = (OPEN.x1 - OPEN.x0) / 2;
const FOLDS = [5, 11, 17, 23];
const SPOT = { x: 42, y: 26, r: 12 };
const pt = (x: number, y: number, z: number) => project([x, y, z]).split(",").map(Number) as [number, number];
const LAMP = pt(42, FRONT + 2, BEAM.z + 2);
const ELLIPSE = { rx: SPOT.r * C * Math.SQRT2, ry: SPOT.r * S * Math.SQRT2 };
const [SX, SY] = pt(SPOT.x, SPOT.y, STAGE.h);
const BEAM_PATH = `M${LAMP[0] - 3} ${LAMP[1]}L${SX - ELLIPSE.rx} ${SY}A${ELLIPSE.rx} ${ELLIPSE.ry} 0 0 0 ${SX + ELLIPSE.rx} ${SY}L${LAMP[0] + 3} ${LAMP[1]}Z`;
const SWAG = `M${OPEN.x0} ${-OPEN.z1}H${OPEN.x1}V${-OPEN.z1 + 5}${Array.from({ length: 4 }, (_, k) => `A7 4 0 0 1 ${OPEN.x1 - (k + 1) * 14} ${-OPEN.z1 + 5}`).join("")}Z`;
const LIGHTS = [16, 30, 44, 58, 72];

const STYLES = `
@keyframes isometric142-part { 0%, 12% { transform: scaleX(1); } 38%, 76% { transform: scaleX(0.28); } 96%, 100% { transform: scaleX(1); } }
@keyframes isometric142-spot { 0%, 26% { opacity: 0; } 42%, 74% { opacity: 1; } 88%, 100% { opacity: 0; } }
.isometric142-curtain { animation: isometric142-part 6s cubic-bezier(0.45, 0, 0.3, 1) infinite; transform-box: fill-box; transform-origin: left center; }
.isometric142-curtain + .isometric142-curtain { transform-origin: right center; }
.isometric142-spot { animation: isometric142-spot 6s ease-in-out infinite; }
.isometric142-still * { animation: none !important; }
.isometric142-still .isometric142-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric142-curtain, .isometric142-spot { animation: none; } .isometric142-rest { opacity: 1; } }
`;

export function Isometric142({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric142Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const cloth = paint.accent;
  const light = palette === "tone" ? "fill-white" : accent ? "fill-current" : palette === "dark" ? "fill-white/60" : "fill-foreground/40";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric142-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-46 -61 124 130" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={OPEN.x0} y={-OPEN.z1} width={OPEN.x1 - OPEN.x0} height={OPEN.z1 - OPEN.z0} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, STAGE.w, STAGE.d, STAGE.h)} paint={body} />
        <Block faces={box(OPEN.x0, 0, STAGE.h, OPEN.x1 - OPEN.x0, WALL.y, OPEN.z1 - OPEN.z0)} paint={body} />
        <rect x={OPEN.x0} y={-OPEN.z1} width={OPEN.x1 - OPEN.x0} height={OPEN.z1 - OPEN.z0} transform={onLeft(WALL.y)} className={body.right} />
        <Block faces={box(4, WALL.y, STAGE.h, OPEN.x0 - 4, WALL.d, BEAM.z - STAGE.h)} paint={body} />
        <g transform={onLeft(FRONT - 1)}>
          <g clipPath={`url(#${clipId})`}>
            {[OPEN.x0, OPEN.x0 + HALF].map((x) => (
              <g key={x} className="isometric142-curtain">
                <rect x={x} y={-OPEN.z1} width={HALF} height={OPEN.z1 - OPEN.z0} className={cloth.base} />
                <rect x={x} y={-OPEN.z1} width={HALF} height={OPEN.z1 - OPEN.z0} className={cloth.left} />
                {FOLDS.map((dx) => (
                  <rect key={dx} x={x + dx} y={-OPEN.z1} width={2} height={OPEN.z1 - OPEN.z0} className={cloth.right} />
                ))}
              </g>
            ))}
          </g>
        </g>
        <Block faces={box(OPEN.x1, WALL.y, STAGE.h, STAGE.w - 4 - OPEN.x1, WALL.d, BEAM.z - STAGE.h)} paint={body} />
        <Block faces={box(4, WALL.y, BEAM.z, STAGE.w - 8, WALL.d, BEAM.h)} paint={body} />
        <g transform={onLeft(FRONT)}>
          <path d={SWAG} className={cloth.base} />
          <path d={SWAG} className={cloth.left} />
          <rect x={36} y={-BEAM.z - 7} width={12} height={4} rx={2} className={body.ink} />
        </g>
        <g className="isometric142-spot isometric142-rest opacity-0">
          <ellipse cx={SX} cy={SY} rx={ELLIPSE.rx} ry={ELLIPSE.ry} className={cn(light, "opacity-30")} />
          <path d={BEAM_PATH} className={cn(light, "opacity-15")} />
        </g>
        <g transform={onTop(STAGE.h)} className={body.ink}>
          {LIGHTS.map((x) => (
            <rect key={x} x={x - 3} y={STAGE.d - 5} width={6} height={2.5} rx={1.25} />
          ))}
        </g>
      </svg>
    </div>
  );
}
