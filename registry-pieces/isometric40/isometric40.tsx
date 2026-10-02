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

interface Isometric40Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the ribbon and bow with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric40Demo: Isometric40Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;
const at = (x: number, y: number, z = 0) => `translate(${project([x, y, z]).replace(",", " ")})`;

/** An upright cylinder around (x, y) in plan; r2 sets a different top radius for a taper. */
function Cylinder({ x = 0, y = 0, z, h, r, r2 = r, paint, lid = true }: { x?: number; y?: number; z: number; h: number; r: number; r2?: number; paint: Paint; lid?: boolean }) {
  const [bx, by, tx, ty] = [r * ELLIPSE_X, r * ELLIPSE_Y, r2 * ELLIPSE_X, r2 * ELLIPSE_Y].map((n) => +n.toFixed(2));
  const top = -z - h;
  const bottom = -z;
  const left = `M${-tx} ${top} L${-bx} ${bottom} A${bx} ${by} 0 0 0 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 1 ${-tx} ${top} Z`;
  const right = `M${tx} ${top} L${bx} ${bottom} A${bx} ${by} 0 0 1 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 0 ${tx} ${top} Z`;
  return (
    <g transform={at(x, y)} className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      {lid && <ellipse cx={0} cy={top} rx={tx} ry={ty} className={paint.base} />}
    </g>
  );
}

const B = 60;
const H = 44;
const LO = 3;
const LID_H = 12;
const TOP = H + LID_H;
const R0 = B / 2 - 5;
const RW = 10;
// The ribbon is pulled off along its own length: this much hangs down the hidden back, then it crosses the lid and runs down the front
const TAIL = 16;
const ACROSS = B + LO * 2;
const TRAVEL = TAIL + ACROSS + TOP;
const MID = B / 2;
// Bow loops stand in the plane that faces the viewer; each is an upper and a lower half of one ribbon ring
const LOOP_UP = "M0 0 C-4 -18 -28 -28 -32 -15 L-26 -13 C-24 -19 -11 -14 -6 -4 Z";
const LOOP_LOW = "M-32 -15 C-34 -5 -18 1 0 0 L-6 -4 C-16 -4 -28 -7 -26 -13 Z";
// The ribbon's width runs toward the viewer, which is straight down the screen
const DEPTH = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((step) => step * 0.7);
const TAIL_END = "M2 -2.5H17L14.5 0L17 2.5H2Z";
const PERIOD = 7;
const slide = (axis: "X" | "Y", from: number, to: number) =>
  `0%, ${from}% { transform: translate${axis}(0); animation-timing-function: cubic-bezier(0.5, 0, 0.7, 0.6); } ${to}%, ${184 - to - 10}% { transform: translate${axis}(${TRAVEL}px); animation-timing-function: cubic-bezier(0.3, 0.4, 0.5, 1); } ${184 - from - 10}%, 100% { transform: translate${axis}(0); }`;
const STYLES = `
@keyframes isometric40-bow { 0%, 10% { transform: scale(1); opacity: 1; } 22% { transform: scale(0.14); opacity: 1; } 22.1%, 95.9% { transform: scale(0.14); opacity: 0; } 96% { transform: scale(0.14); opacity: 1; } 99.5%, 100% { transform: scale(1); opacity: 1; } }
@keyframes isometric40-tail { 0%, 10% { transform: scaleX(1); } 22%, 96% { transform: scaleX(1.7); } 99.5%, 100% { transform: scaleX(1); } }
@keyframes isometric40-along { ${slide("Y", 24, 50)} }
@keyframes isometric40-across { ${slide("X", 28, 54)} }
@keyframes isometric40-over { ${slide("Y", 28, 54)} }
@keyframes isometric40-lid { 0%, 55% { transform: translateY(0) rotate(0deg); } 64% { transform: translateY(-27px) rotate(-5deg); } 67%, 76% { transform: translateY(-24px) rotate(-4deg); } 84%, 100% { transform: translateY(0) rotate(0deg); } }
@keyframes isometric40-glow { 0%, 56% { opacity: 0; } 62%, 76% { opacity: 1; } 82%, 100% { opacity: 0; } }
.isometric40-bow { animation: isometric40-bow ${PERIOD}s ease-in-out infinite; }
.isometric40-tail { animation: isometric40-tail ${PERIOD}s ease-in-out infinite; }
.isometric40-along { animation: isometric40-along ${PERIOD}s linear infinite; }
.isometric40-across { animation: isometric40-across ${PERIOD}s linear infinite; }
.isometric40-over { animation: isometric40-over ${PERIOD}s linear infinite; }
.isometric40-lid { animation: isometric40-lid ${PERIOD}s cubic-bezier(0.45, 0, 0.2, 1) infinite; transform-box: fill-box; transform-origin: center; will-change: transform; }
.isometric40-glow { animation: isometric40-glow ${PERIOD}s ease-in-out infinite; }
.isometric40-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric40-bow, .isometric40-tail, .isometric40-along, .isometric40-across, .isometric40-over, .isometric40-lid, .isometric40-glow { animation: none; } }
`;

export function Isometric40({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric40Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const ribbon = accent ? paint.accent : { ...body, base: body.ink };

  const id = useId();
  // One strip per box face; each is clipped to its face and slides along the ribbon's length, so the ribbon runs round the corners
  const strip = (move: string, shade: string | null, rect: { x: number; y: number; width: number; height: number }) => (
    <g className={move}>
      <rect {...rect} className={ribbon.base} />
      {shade && <rect {...rect} className={shade} />}
    </g>
  );
  const drop = { x: R0, y: -(TOP + ACROSS + TAIL), width: RW, height: TOP + ACROSS + TAIL };
  const loop = (flip: boolean) =>
    DEPTH.map((down, index) => (
      <g key={down} transform={`translate(0 ${down.toFixed(1)})${flip ? " scale(-1 1)" : ""}`}>
        <path d={LOOP_LOW} className={ribbon.base} />
        <path d={LOOP_LOW} className={ribbon.right} />
        <path d={LOOP_UP} className={ribbon.base} />
        {(flip || index === DEPTH.length - 1) && <path d={LOOP_UP} className={ribbon.left} />}
      </g>
    ));
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric40-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-62 -84 124 148" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={`${id}-top`}>
            <rect x={-LO} y={-LO} width={ACROSS} height={ACROSS} />
          </clipPath>
          <clipPath id={`${id}-lid`}>
            <rect x={-LO} y={-TOP} width={ACROSS} height={LID_H} />
          </clipPath>
          <clipPath id={`${id}-box`}>
            <rect x={0} y={-H} width={B} height={H} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, B, B, H)} paint={body} />
        <g transform={onTop(H)}>
          <rect x={4} y={4} width={B - 8} height={B - 8} rx={2} className={body.ink} />
          <g className="isometric40-glow opacity-0">
            <circle cx={MID} cy={MID} r={20} className={cn(ribbon.base, "opacity-30")} />
            <circle cx={MID} cy={MID} r={12} className={cn(ribbon.base, "opacity-60")} />
          </g>
          {[[8, 8], [36, 8], [8, 36], [36, 36]].map(([x = 0, y = 0]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y + 14}L${x + 8} ${y}L${x + 16} ${y + 14}Z`} className={body.base} />
          ))}
        </g>
        <g transform={onLeft(B)} clipPath={`url(#${id}-box)`}>
          {strip("isometric40-along", ribbon.left, drop)}
        </g>
        <g transform={onRight(B)} clipPath={`url(#${id}-box)`}>
          {strip("isometric40-over", ribbon.right, drop)}
        </g>
        <g className="isometric40-lid">
          <Block faces={box(-LO, -LO, H, ACROSS, ACROSS, LID_H)} paint={body} />
          <g transform={onLeft(B + LO)} clipPath={`url(#${id}-lid)`}>
            {strip("isometric40-along", ribbon.left, drop)}
          </g>
          <g transform={onRight(B + LO)} clipPath={`url(#${id}-lid)`}>
            {strip("isometric40-over", ribbon.right, drop)}
          </g>
          <g transform={onTop(TOP)} clipPath={`url(#${id}-top)`}>
            {strip("isometric40-across", null, { x: -LO - TAIL, y: R0, width: ACROSS + TAIL, height: RW })}
            <g className="isometric40-along">
              <rect x={R0} y={-LO - TAIL} width={RW} height={ACROSS + TAIL} className={ribbon.base} />
              {/* The two tails lie on the lid and grow as the loops are pulled through the knot */}
              {[19, 71].map((turn) => (
                <g key={turn} transform={`translate(${MID} ${MID}) rotate(${turn})`}>
                  <g className="isometric40-tail">
                    <path d={TAIL_END} className={ribbon.base} />
                    <path d={TAIL_END} className={turn > 45 ? ribbon.left : ribbon.right} />
                  </g>
                </g>
              ))}
              <rect x={R0} y={R0} width={RW} height={RW} rx={2} className={ribbon.left} />
            </g>
          </g>
          <g transform={at(MID, MID, TOP)}>
            <g className="isometric40-bow">
              {loop(false)}
              {loop(true)}
              {DEPTH.map((down, index) => (
                <g key={down} transform={`translate(0 ${down.toFixed(1)})`}>
                  <rect x={-5} y={-8} width={10} height={9} rx={3} className={ribbon.base} />
                  {index < DEPTH.length - 1 && <rect x={-5} y={-8} width={10} height={9} rx={3} className={ribbon.left} />}
                </g>
              ))}
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
