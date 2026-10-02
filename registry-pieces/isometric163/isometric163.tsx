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

interface Isometric163Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Paint the car with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric163Demo: Isometric163Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const GROUND = 4;
const W = 84;
const D = 56;
const WALL = 50;
// Doorway in the front wall, with the door running in tracks just behind it
const X0 = 12;
const X1 = 72;
const HEAD = GROUND + 40;
const TRACK = D - 2;
const BACK = 4;
const PANELS = [0, 1, 2, 3, 4];
const PANEL = (HEAD - GROUND) / PANELS.length;
// The car is narrower and lower than the doorway, so it clears both jambs and the lintel
const CAR = { x: 29, y: 16, w: 26, l: 30, h: 18 };
const DRIVE = 54;
const PERIOD = 8;
const shift = (dy: number) => `translate(${(-dy * C).toFixed(1)}px, ${(dy * S).toFixed(1)}px)`;

const STYLES = `
@keyframes isometric163-door { 0%, 8% { transform: translateY(0); } 26%, 60% { transform: translateY(${-(HEAD - GROUND + 2)}px); } 78%, 100% { transform: translateY(0); } }
@keyframes isometric163-drive { 0%, 30% { transform: translate(0, 0); } 54%, 88% { transform: ${shift(DRIVE)}; } 88.1%, 100% { transform: translate(0, 0); } }
@keyframes isometric163-inside { 0%, 80% { opacity: 1; } 86%, 90% { opacity: 0; } 94%, 100% { opacity: 1; } }
@keyframes isometric163-outside { 0%, 26% { opacity: 0; } 26.1%, 80% { opacity: 1; } 86%, 100% { opacity: 0; } }
.isometric163-door { animation: isometric163-door ${PERIOD}s ease-in-out infinite; }
.isometric163-inside { animation: isometric163-drive ${PERIOD}s ease-in-out infinite, isometric163-inside ${PERIOD}s linear infinite; }
.isometric163-outside { animation: isometric163-drive ${PERIOD}s ease-in-out infinite, isometric163-outside ${PERIOD}s linear infinite; }
.isometric163-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric163-door, .isometric163-inside, .isometric163-outside { animation: none; } }
`;

const HOLE = polygon([[X0, D, GROUND], [X1, D, GROUND], [X1, D, HEAD], [X0, D, HEAD]]);
const BACK_WALL = polygon([[X0, BACK, GROUND], [X1, BACK, GROUND], [X1, BACK, HEAD], [X0, BACK, HEAD]]);
const SIDE_WALL = polygon([[X0, BACK, GROUND], [X0, D, GROUND], [X0, D, HEAD], [X0, BACK, HEAD]]);
const FLOOR = polygon([[X0, BACK, GROUND], [X1, BACK, GROUND], [X1, D, GROUND], [X0, D, GROUND]]);
// Everything the car can cover once it is past the doorway: its own lane in front of the wall
const LANE = box(CAR.x - 1, D, GROUND, CAR.w + 2, 200, CAR.h + 1);

export function Isometric163({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric163Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const id = useId();
  const holeId = `${id}hole`;
  const laneId = `${id}lane`;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const tyre = palette === "dark" ? "fill-black/60" : palette === "tone" ? "fill-black/40" : "fill-zinc-900";
  const line = body.ink.replace("fill-", "stroke-");
  const z = GROUND + 3;

  const car = (
    <>
      <g transform={onRight(CAR.x + 2)}>
        <circle cx={CAR.y + 7} cy={-z} r={3.5} className={tyre} />
        <circle cx={CAR.y + CAR.l - 7} cy={-z} r={3.5} className={tyre} />
      </g>
      <Block faces={box(CAR.x, CAR.y, z, CAR.w, CAR.l, 8)} paint={paint.accent} />
      <Block faces={box(CAR.x + 2, CAR.y + 6, z + 8, CAR.w - 4, 15, 7)} paint={body} />
      <g transform={onRight(CAR.x + CAR.w)}>
        <circle cx={CAR.y + 7} cy={-z} r={3.5} className={tyre} />
        <circle cx={CAR.y + CAR.l - 7} cy={-z} r={3.5} className={tyre} />
      </g>
      <g transform={onRight(CAR.x + CAR.w - 2)} className={body.ink}>
        <rect x={CAR.y + 8} y={-z - 13.5} width={11} height={4.5} rx={1} />
      </g>
      <g transform={onLeft(CAR.y + 21)} className={body.ink}>
        <rect x={CAR.x + 4} y={-z - 13.5} width={CAR.w - 8} height={4.5} rx={1} />
      </g>
      <g transform={onLeft(CAR.y + CAR.l)} className={paint.accent.ink}>
        <rect x={CAR.x + 2} y={-z - 6} width={5} height={3} rx={1} />
        <rect x={CAR.x + CAR.w - 7} y={-z - 6} width={5} height={3} rx={1} />
      </g>
    </>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric163-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-102 -68 190 170" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={holeId}>
            <polygon points={HOLE} />
          </clipPath>
          <clipPath id={laneId}>
            <polygon points={LANE.top} />
            <polygon points={LANE.left} />
            <polygon points={LANE.right} />
          </clipPath>
        </defs>
        <Block faces={box(-6, -6, 0, W + 12, D + 56, GROUND)} paint={body} />
        <g transform={onTop(GROUND)} className={body.ink}>
          <rect x={X0 + 2} y={D + 2} width={2} height={46} rx={1} />
          <rect x={X1 - 4} y={D + 2} width={2} height={46} rx={1} />
        </g>
        <Block faces={box(0, 0, GROUND, W, D, WALL)} paint={body} />
        <g transform={onRight(W)}>
          <rect x={16} y={-GROUND - 38} width={22} height={14} rx={1} className={body.ink} />
          <rect x={16} y={-GROUND - 38} width={22} height={14} rx={1} fill="none" strokeWidth={1.5} vectorEffect="non-scaling-stroke" className={line} />
        </g>
        <g clipPath={`url(#${holeId})`}>
          <polygon points={BACK_WALL} className={body.base} />
          <polygon points={BACK_WALL} className={body.right} />
          <polygon points={BACK_WALL} className={body.ink} />
          <polygon points={SIDE_WALL} className={body.base} />
          <polygon points={SIDE_WALL} className={body.right} />
          <polygon points={FLOOR} className={body.base} />
          <polygon points={FLOOR} className={body.left} />
          <Block faces={box(X0 + 4, BACK, GROUND + 24, 40, 5, 2)} paint={body} />
          <Block faces={box(X0 + 8, BACK, GROUND + 26, 10, 5, 7)} paint={body} />
          <Block faces={box(X0 + 22, BACK, GROUND + 26, 14, 5, 5)} paint={body} />
          <g className="isometric163-inside">{car}</g>
          <g transform={onLeft(TRACK)}>
            <g className={cn("isometric163-door", body.edge)} strokeWidth={1}>
              {PANELS.map((index) => (
                <g key={index}>
                  <rect x={X0} y={-HEAD + index * PANEL} width={X1 - X0} height={PANEL} vectorEffect="non-scaling-stroke" className={body.base} />
                  <rect x={X0} y={-HEAD + index * PANEL} width={X1 - X0} height={PANEL} className={body.left} stroke="none" />
                </g>
              ))}
              {[0, 1, 2, 3].map((index) => (
                <rect key={index} x={X0 + 6 + index * 13} y={-HEAD + 2} width={9} height={PANEL - 4} rx={1} className={body.ink} stroke="none" />
              ))}
              <rect x={(X0 + X1) / 2 - 5} y={-GROUND - 5} width={10} height={2} rx={1} className={body.ink} stroke="none" />
            </g>
          </g>
        </g>
        <Block faces={box(-3, -3, GROUND + WALL, W + 6, D + 6, 5)} paint={body} />
        <g transform={onLeft(D)} className={body.ink}>
          <circle cx={X1 + 6} cy={-GROUND - 32} r={2} />
          <rect x={X0 - 9} y={-GROUND - 34} width={6} height={4} rx={1} />
        </g>
        <g clipPath={`url(#${laneId})`}>
          <g className="isometric163-outside opacity-0">{car}</g>
        </g>
      </svg>
    </div>
  );
}
