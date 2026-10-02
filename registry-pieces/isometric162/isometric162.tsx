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

interface Isometric162Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Light the floor indicator, call button and cabin carpet with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric162Demo: Isometric162Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const LOBBY = 6;
const W = 96;
const D = 50;
const TOP = LOBBY + 112;
// Doorway in the front wall, with the doors running in a slot just behind it
const X0 = 28;
const X1 = 68;
const HEAD = LOBBY + 72;
const SLOT = D - 3;
const LEAF = (X1 - X0) / 2;
const BACK = 8;
const PERIOD = 7;
const FLOORS = [0, 1, 2, 3];
// When each indicator dot is lit, in percent of the loop: the lift comes down, waits, goes back up
const LIT: Record<number, [number, number][]> = {
  0: [[18, 72]],
  1: [[12, 18], [72, 80]],
  2: [[6, 12], [80, 90]],
  3: [[0, 6], [90, 100]],
};
const dot = (index: number) => {
  const spans = LIT[index] ?? [];
  const frames = [`0% { opacity: ${spans.some(([from]) => from === 0) ? 1 : 0}; }`, ...spans.flatMap(([from, to]) => [`${from}% { opacity: 1; }`, `${to}% { opacity: 0; }`])];
  return `@keyframes isometric162-dot${index} { ${frames.join(" ")} }\n.isometric162-dot${index} { animation: isometric162-dot${index} ${PERIOD}s step-end infinite; }`;
};

const STYLES = `
@keyframes isometric162-left { 0%, 24% { transform: translateX(0); } 36%, 56% { transform: translateX(${-(LEAF - 1)}px); } 68%, 100% { transform: translateX(0); } }
@keyframes isometric162-right { 0%, 24% { transform: translateX(0); } 36%, 56% { transform: translateX(${LEAF - 1}px); } 68%, 100% { transform: translateX(0); } }
@keyframes isometric162-call { 0%, 22% { opacity: 1; } 24%, 96% { opacity: 0; } 100% { opacity: 1; } }
.isometric162-left { animation: isometric162-left ${PERIOD}s ease-in-out infinite; }
.isometric162-right { animation: isometric162-right ${PERIOD}s ease-in-out infinite; }
.isometric162-call { animation: isometric162-call ${PERIOD}s linear infinite; }
${FLOORS.map(dot).join("\n")}
.isometric162-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric162-moving * { animation: none !important; } }
`;

const HOLE = polygon([[X0, D, LOBBY], [X1, D, LOBBY], [X1, D, HEAD], [X0, D, HEAD]]);
const BACK_WALL = polygon([[X0, BACK, LOBBY], [X1, BACK, LOBBY], [X1, BACK, HEAD], [X0, BACK, HEAD]]);
const SIDE_WALL = polygon([[X0, BACK, LOBBY], [X0, SLOT, LOBBY], [X0, SLOT, HEAD], [X0, BACK, HEAD]]);
const CABIN_FLOOR = polygon([[X0, BACK, LOBBY], [X1, BACK, LOBBY], [X1, SLOT, LOBBY], [X0, SLOT, LOBBY]]);
const JAMB = polygon([[X0, SLOT, LOBBY], [X0, D, LOBBY], [X0, D, HEAD], [X0, SLOT, HEAD]]);
const SILL = polygon([[X0, SLOT, LOBBY], [X1, SLOT, LOBBY], [X1, D, LOBBY], [X0, D, LOBBY]]);

export function Isometric162({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric162Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const lit = paint.accent;
  const line = body.ink.replace("fill-", "stroke-");

  const leaf = (x: number, name: string) => (
    <g className={cn(name, body.edge)} strokeWidth={1}>
      <rect x={x} y={-HEAD} width={LEAF} height={HEAD - LOBBY} vectorEffect="non-scaling-stroke" className={body.base} />
      <rect x={x} y={-HEAD} width={LEAF} height={HEAD - LOBBY} className={body.left} stroke="none" />
      <rect x={x + LEAF / 2 - 2} y={-HEAD + 10} width={4} height={30} rx={2} className={body.ink} stroke="none" />
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric162-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-82 -124 182 222" aria-hidden="true" className="isometric162-moving size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={HOLE} />
          </clipPath>
        </defs>
        <Block faces={box(-6, -6, 0, W + 12, D + 36, LOBBY)} paint={body} />
        <g transform={onTop(LOBBY)} className={body.ink}>
          <rect x={X0 + 2} y={D + 5} width={X1 - X0 - 4} height={14} rx={2} />
        </g>
        <Block faces={box(0, 0, LOBBY, W, D, TOP - LOBBY)} paint={body} />
        <Block faces={box(22, 10, TOP, 52, 28, 7)} paint={body} />
        <g clipPath={`url(#${clipId})`}>
          <polygon points={BACK_WALL} className={body.base} />
          <polygon points={BACK_WALL} className={body.left} />
          <polygon points={SIDE_WALL} className={body.base} />
          <polygon points={SIDE_WALL} className={body.right} />
          <polygon points={CABIN_FLOOR} className={lit.base} />
          <polygon points={CABIN_FLOOR} className={lit.left} />
          <g transform={onLeft(BACK)} className={body.ink}>
            <rect x={X0 + 6} y={-HEAD + 8} width={X1 - X0 - 12} height={26} rx={2} />
          </g>
          <Block faces={box(X0, BACK, LOBBY + 26, X1 - X0, 3, 2)} paint={body} />
          <g transform={onLeft(SLOT)}>
            {leaf(X0, "isometric162-left")}
            {leaf(X0 + LEAF, "isometric162-right")}
          </g>
          <polygon points={JAMB} className={body.base} />
          <polygon points={JAMB} className={body.right} />
          <polygon points={SILL} className={body.base} />
          <polygon points={SILL} className={body.ink} />
        </g>
        <g transform={onLeft(D)}>
          <rect x={X0 - 2} y={-HEAD - 2} width={X1 - X0 + 4} height={HEAD - LOBBY + 2} fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke" className={line} />
          <rect x={X0 + 6} y={-HEAD - 18} width={X1 - X0 - 12} height={10} rx={2} className={body.ink} />
          {FLOORS.map((index) => (
            <g key={index}>
              <circle cx={X0 + 11 + index * 6} cy={-HEAD - 13} r={1.8} className={body.ink} />
              <circle cx={X0 + 11 + index * 6} cy={-HEAD - 13} r={1.8} className={cn(`isometric162-dot${index}`, index > 0 && "opacity-0", lit.base)} />
            </g>
          ))}
          <rect x={X1 + 7} y={-LOBBY - 42} width={7} height={13} rx={2} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
          <circle cx={X1 + 10.5} cy={-LOBBY - 35.5} r={1.8} className={body.ink} />
          <circle cx={X1 + 10.5} cy={-LOBBY - 35.5} r={1.8} className={cn("isometric162-call", lit.base)} />
        </g>
      </svg>
    </div>
  );
}
